import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { listing_id, amount, bidder_id } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const lockKey = `bid_lock:${listing_id}`;
    const { data: lock } = await supabase
      .from('distributed_locks')
      .select('*')
      .eq('key', lockKey)
      .single();

    if (lock) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '系统繁忙，请重试' 
      }), { status: 429, headers: corsHeaders });
    }

    await supabase.from('distributed_locks').insert({ key: lockKey, expires_at: new Date(Date.now() + 5000) });

    try {
      const { data: listing } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listing_id)
        .single();

      if (!listing) {
        throw new Error('上架信息不存在');
      }

      if (listing.auction_type !== 'english') {
        throw new Error('该上架不支持竞价');
      }

      if (amount <= listing.current_price) {
        throw new Error('出价必须高于当前价格');
      }

      if (listing.min_increment && amount < listing.current_price + listing.min_increment) {
        throw new Error(`出价必须高于当前价格至少 ¥${listing.min_increment}`);
      }

      const { error: bidError } = await supabase.from('bids').insert({
        listing_id,
        bidder_id,
        amount
      });

      if (bidError) throw bidError;

      const { error: updateError } = await supabase
        .from('listings')
        .update({ current_price: amount })
        .eq('id', listing_id);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ 
        success: true, 
        message: '出价成功',
        data: { current_price: amount }
      }), { headers: corsHeaders });

    } finally {
      await supabase.from('distributed_locks').delete().eq('key', lockKey);
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
