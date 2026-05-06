import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';

config();

const BASE_URL = 'https://weddingbysms.fr';
const TODAY = new Date().toISOString().split('T')[0];

const staticUrls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${BASE_URL}/service/traiteur-oriental`, priority: '0.9', changefreq: 'daily' },
  { loc: `${BASE_URL}/service/robes-soiree`, priority: '0.9', changefreq: 'daily' },
  { loc: `${BASE_URL}/service/decoration-evenementielle`, priority: '0.9', changefreq: 'daily' },
  { loc: `${BASE_URL}/blog`, priority: '0.7', changefreq: 'daily' },
  { loc: `${BASE_URL}/privacy`, priority: '0.2', changefreq: 'daily' },
];

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const { data: articles, error } = await supabase
  .from('blog_articles')
  .select('slug, updated_at')
  .eq('publie', true)
  .order('updated_at', { ascending: false });

if (error) {
  console.error('Supabase error:', error.message);
  process.exit(1);
}

const blogUrls = (articles || []).map((a) => ({
  loc: `${BASE_URL}/blog/${a.slug}`,
  lastmod: a.updated_at.split('T')[0],
  priority: '0.6',
  changefreq: 'daily',
}));

const allUrls = [
  ...staticUrls.map((u) => ({ ...u, lastmod: TODAY })),
  ...blogUrls,
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls
  .map(
    (u) => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('')}

</urlset>
`;

writeFileSync('public/sitemap.xml', xml.trimStart());
console.log(`Sitemap generated: ${allUrls.length} URLs (${blogUrls.length} blog posts)`);
