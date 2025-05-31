import { detectSubdomain } from '../utils/subdomain';

export async function GET({ request }) {
  // Detect geo subdomain
  const geoSubdomain = detectSubdomain(request);
  
  // Redirect to appropriate robots.txt based on geo
  if (geoSubdomain === 'se') {
    return Response.redirect(new URL('/robots-se.txt', request.url), 301);
  } else if (geoSubdomain === 'no') {
    return Response.redirect(new URL('/robots-no.txt', request.url), 301);
  }
  
  // Default robots.txt for main domain
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://idag.ai/sitemap.xml
Sitemap: https://se.idag.ai/sitemap-se.xml
Sitemap: https://no.idag.ai/sitemap-no.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_astro/
Disallow: /uploaded/

# Allow specific bot access to feeds
User-agent: Googlebot
Allow: /rss.xml
Allow: /*/rss.xml

User-agent: Bingbot
Allow: /rss.xml
Allow: /*/rss.xml

# Block AI training bots (optional - can be removed if you want AI training)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Host directive
Host: https://idag.ai
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}