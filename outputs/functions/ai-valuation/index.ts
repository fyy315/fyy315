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
    const { trademark_name, category, user_id } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: similar } = await supabase
      .from('listings')
      .select('current_price, trademark:trademarks(category)')
      .eq('trademark.category', category)
      .eq('status', 'active')
      .limit(10);

    const avgPrice = similar?.length 
      ? similar.reduce((sum, item) => sum + (item.current_price || 0), 0) / similar.length 
      : 50000;

    const nameLength = trademark_name.length;
    const baseValue = avgPrice;
    const lengthFactor = nameLength <= 3 ? 1.2 : nameLength <= 5 ? 1.0 : 0.8;
    const randomFactor = 0.9 + Math.random() * 0.2;
    
    const estimatedValue = Math.round(baseValue * lengthFactor * randomFactor);
    const minValue = Math.round(estimatedValue * 0.7);
    const maxValue = Math.round(estimatedValue * 1.3);

    const factors = [
      { name: '市场热度', score: Math.round(60 + Math.random() * 30), weight: 0.3 },
      { name: '名称辨识度', score: nameLength <= 3 ? 85 : 70, weight: 0.25 },
      { name: '分类竞争度', score: Math.round(50 + Math.random() * 40), weight: 0.25 },
      { name: '法律风险', score: Math.round(70 + Math.random() * 25), weight: 0.2 }
    ];

    return new Response(JSON.stringify({
      success: true,
      data: {
        trademark_name,
        category,
        estimated_value: estimatedValue,
        price_range: { min: minValue, max: maxValue },
        factors,
        similar_count: similar?.length || 0,
        generated_at: new Date().toISOString()
      }
    }), { headers: corsHeaders });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
