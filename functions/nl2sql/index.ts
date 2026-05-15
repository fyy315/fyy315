import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { query } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: '查询内容不能为空' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const scnetApiKey = Deno.env.get('SCNET_API_KEY');
    if (!scnetApiKey) {
      return new Response(JSON.stringify({ error: 'AI服务未配置' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const prompt = `将以下自然语言转换为PostgreSQL查询语句，仅查询trademarks表（字段：registration_number, name, category, exclusive_period_end, seo_description）。只返回SQL语句，不要其他解释。

用户查询：${query}

示例：
- "第9类商标" -> SELECT * FROM trademarks WHERE category = '第9类'
- "价格低于5万" -> SELECT * FROM trademarks t JOIN listings l ON t.registration_number = l.trademark_id WHERE l.current_price < 50000
- "有效期还有1年以上" -> SELECT * FROM trademarks WHERE exclusive_period_end > CURRENT_DATE + INTERVAL '1 year'`;

    const aiRes = await fetch('https://api.scnet.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${scnetApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen3.6-plus',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      }),
    });

    const aiData = await aiRes.json();
    const generatedSql = aiData.choices?.[0]?.message?.content?.trim() || '';

    const sqlMatch = generatedSql.match(/SELECT[\s\S]+?;/i);
    const sql = sqlMatch ? sqlMatch[0] : generatedSql;

    if (!sql.toLowerCase().startsWith('select')) {
      return new Response(JSON.stringify({ error: '仅支持查询操作' }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    const forbidden = ['insert', 'update', 'delete', 'drop', 'create', 'alter', 'truncate'];
    if (forbidden.some(k => sql.toLowerCase().includes(k))) {
      return new Response(JSON.stringify({ error: '检测到危险操作，已拦截' }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.rpc('execute_safe_query', { sql_query: sql });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      sql,
      data,
      count: data?.length || 0,
    }), { headers: corsHeaders });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
