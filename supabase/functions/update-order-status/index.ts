import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const validTransitions: Record<string, string[]> = {
  'unpaid': ['paid', 'cancelled'],
  'paid': ['applied', 'cancelled'],
  'applied': ['transferred', 'cancelled'],
  'transferred': ['completed', 'cancelled'],
  'completed': [],
  'cancelled': []
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { order_id, new_status, updated_by } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (!order) {
      throw new Error('订单不存在');
    }

    const allowedNext = validTransitions[order.status];
    if (!allowedNext.includes(new_status)) {
      throw new Error(`无效的状态流转: ${order.status} -> ${new_status}`);
    }

    const updateData: any = { status: new_status };
    if (new_status === 'paid') {
      updateData.payment_time = new Date().toISOString();
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order_id);

    if (error) throw error;

    return new Response(JSON.stringify({ 
      success: true, 
      message: '状态更新成功',
      data: { order_id, status: new_status }
    }), { headers: corsHeaders });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
