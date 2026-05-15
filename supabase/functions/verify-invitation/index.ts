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
    const { code, user_id } = await req.json();
    
    if (!code || !user_id) {
      throw new Error('缺少邀请码或用户ID');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: invitation } = await supabase
      .from('invitation_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (!invitation) {
      throw new Error('邀请码无效');
    }

    if (invitation.used_count >= invitation.max_uses) {
      throw new Error('邀请码已达使用上限');
    }

    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user_id)
      .eq('role', 'agent')
      .single();

    if (existingRole) {
      throw new Error('用户已拥有中介角色');
    }

    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id,
      role: 'agent',
      is_active: true
    });

    if (roleError) throw roleError;

    const { error: updateError } = await supabase
      .from('invitation_codes')
      .update({ used_count: invitation.used_count + 1 })
      .eq('id', invitation.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({
      success: true,
      message: '中介角色开通成功',
      data: { role: 'agent' }
    }), { headers: corsHeaders });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
