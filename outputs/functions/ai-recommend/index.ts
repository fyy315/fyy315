import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    const { data: trademarks } = await supabase
      .from('trademarks')
      .select('*, listings(current_price, auction_type, is_active)')
      .limit(20);

    let recommendations = trademarks || [];

    if (userId) {
      const { data: userOrders } = await supabase
        .from('orders')
        .select('listing_id')
        .eq('buyer_id', userId)
        .limit(10);
      
      const { data: userBids } = await supabase
        .from('bids')
        .select('listing_id')
        .eq('bidder_id', userId)
        .limit(10);

      const interactedIds = new Set([
        ...(userOrders?.map(o => o.listing_id) || []),
        ...(userBids?.map(b => b.listing_id) || []),
      ]);

      recommendations = recommendations.filter(t => !interactedIds.has(t.registration_number));
    }

    recommendations = recommendations
      .filter((t: any) => t.listings?.some((l: any) => l.is_active))
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    return new Response(
      JSON.stringify({
        success: true,
        data: recommendations.map(t => ({
          registration_number: t.registration_number,
          name: t.name,
          category: t.category,
          current_price: t.listings?.[0]?.current_price,
          auction_type: t.listings?.[0]?.auction_type,
          reason: userId ? '基于您的浏览偏好' : '热门推荐',
        })),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
