import { getCollection } from 'astro:content';
import { SITE_URL } from '../consts';

export async function GET() {
  // Get all Norwegian content
  const noNyheter = await getCollection('no-nyheter');
  const noModeller = await getCollection('no-modeller');
  const noVerktyg = await getCollection('no-verktyg');
  const noAkademi = await getCollection('no-akademi');

  const baseUrl = 'https://no.idag.ai';
  
  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/nyheter', priority: '0.9', changefreq: 'daily' },
    { url: '/modeller', priority: '0.8', changefreq: 'weekly' },
    { url: '/verktyg', priority: '0.8', changefreq: 'weekly' },
    { url: '/akademi', priority: '0.8', changefreq: 'weekly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/search', priority: '0.5', changefreq: 'monthly' }
  ];

  // Dynamic content pages
  const contentPages = [
    ...noNyheter.map(post => ({
      url: `/nyheter/${post.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: post.data.pubDate || post.data.updatedDate
    })),
    ...noModeller.map(post => ({
      url: `/modeller/${post.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: post.data.pubDate || post.data.updatedDate
    })),
    ...noVerktyg.map(post => ({
      url: `/verktyg/${post.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: post.data.pubDate || post.data.updatedDate
    })),
    ...noAkademi.map(post => ({
      url: `/akademi/${post.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: post.data.pubDate || post.data.updatedDate
    }))
  ];

  const allPages = [...staticPages, ...contentPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}