import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/xml',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  if (path.endsWith('/robots.txt')) {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: ${url.origin}/sitemap.xml`;
    return new Response(robotsTxt, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  if (path.endsWith('/sitemap.xml')) {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: trademarks } = await supabase
      .from('trademarks')
      .select('registration_number, updated_at')
      .limit(1000);

    const { data: listings } = await supabase
      .from('listings')
      .select('id, updated_at')
      .eq('is_active', true)
      .limit(1000);

    const urls: { loc: string; priority: string; lastmod?: string }[] = [
      { loc: '/', priority: '1.0' },
      { loc: '/search', priority: '0.9' },
      { loc: '/login', priority: '0.5' },
    ];

    trademarks?.forEach((t: any) => {
      urls.push({
        loc: `/trademark/${t.registration_number}`,
        priority: '0.8',
        lastmod: t.updated_at,
      });
    });

    listings?.forEach((l: any) => {
      urls.push({
        loc: `/listing/${l.id}`,
        priority: '0.7',
        lastmod: l.updated_at,
      });
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${url.origin}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, { headers: corsHeaders });
  }

  return new Response('Not Found', { status: 404 });
});
