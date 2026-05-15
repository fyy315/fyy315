import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { query, category, priceMin, priceMax } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let sql = `
      SELECT 
        t.registration_number,
        t.name,
        t.category,
        t.exclusive_period_end,
        t.seo_description,
        l.current_price,
        l.auction_type,
        l.status as listing_status
      FROM public.trademarks t
      LEFT JOIN public.listings l ON t.registration_number = l.trademark_id AND l.is_active = true
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (query) {
      sql += ` AND (t.name ILIKE $${params.length + 1} OR t.seo_description ILIKE $${params.length + 1})`;
      params.push(`%${query}%`);
    }
    
    if (category) {
      sql += ` AND t.category = $${params.length + 1}`;
      params.push(category);
    }
    
    if (priceMin !== undefined) {
      sql += ` AND l.current_price >= $${params.length + 1}`;
      params.push(priceMin);
    }
    
    if (priceMax !== undefined) {
      sql += ` AND l.current_price <= $${params.length + 1}`;
      params.push(priceMax);
    }
    
    sql += ` ORDER BY l.current_price ASC NULLS LAST LIMIT 50`;

    const { data, error } = await supabase.rpc('execute_sql', { sql, params });
    
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
