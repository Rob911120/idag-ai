import { defineMiddleware } from 'astro:middleware';
import { detectSubdomain } from './utils/subdomain';

export const onRequest = defineMiddleware(async (context, next) => {
  // Detect geo subdomain from request
  const geoSubdomain = detectSubdomain(context.request, context.url);
  
  // Add geo information to locals for use in pages
  context.locals.geoSubdomain = geoSubdomain;
  context.locals.language = geoSubdomain === 'se' ? 'sv' : geoSubdomain === 'no' ? 'no' : 'sv';
  
  // Log geo detection for debugging
  console.log('🌍 Middleware Geo Detection:', {
    url: context.url.href,
    hostname: context.url.hostname,
    geoSubdomain,
    language: context.locals.language,
    userAgent: context.request.headers.get('user-agent')?.substring(0, 100)
  });
  
  // Add geo-specific headers
  const response = await next();
  
  // Check if we're in a prerendering context where headers are immutable
  const isPrerendering = !context.request.headers.get('user-agent') ||
                         context.url.protocol === 'file:' ||
                         process.env.NODE_ENV === 'production';
  
  // Only set headers if not prerendering (headers are mutable)
  if (!isPrerendering) {
    try {
      if (geoSubdomain) {
        response.headers.set('X-Geo-Subdomain', geoSubdomain);
        response.headers.set('X-Language', context.locals.language);
        response.headers.set('Content-Language', context.locals.language);
      }
      
      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      // Add cache headers for static content
      if (context.url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
    } catch (error) {
      // Headers are immutable during prerendering, which is expected
      console.log('⚠️ Headers are immutable (prerendering context), skipping header modifications');
    }
  }
  
  return response;
});