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
    const body = await req.json();
    const { out_trade_no, trade_status, trade_no, total_amount } = body;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', out_trade_no)
        .single();

      if (order && order.status === 'unpaid') {
        await supabase.from('orders').update({
          status: 'paid',
          payment_time: new Date().toISOString(),
        }).eq('id', out_trade_no);

        await supabase.from('payments').insert({
          order_id: out_trade_no,
          payment_method: 'alipay',
          payment_status: 'success',
          transaction_id: trade_no,
          amount: parseFloat(total_amount),
          paid_at: new Date().toISOString(),
        });
      }
    }

    return new Response('success', { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
