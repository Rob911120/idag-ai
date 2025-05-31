// Navigation utilities for handling geo-based subdomain URLs across environments
export function buildGeoSubdomainUrl(geoSubdomain, currentUrl = '') {
  // If we're in browser environment, use window.location
  if (typeof window !== 'undefined') {
    currentUrl = window.location.href;
  }
  
  const url = new URL(currentUrl || 'https://idag.ai');
  const hostname = url.hostname;
  
  console.log('🔗 Building geo subdomain URL for:', geoSubdomain);
  console.log('  Current hostname:', hostname);
  
  // Check if we're in workers.dev environment (development)
  if (hostname.includes('workers.dev')) {
    // Extract the worker suffix (e.g., "rob911120.workers.dev")
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const workerSuffix = parts.slice(-3).join('.'); // "rob911120.workers.dev"
      const newUrl = `https://${geoSubdomain}-idag-ai.${workerSuffix}`;
      console.log('  Workers.dev environment, built URL:', newUrl);
      return newUrl;
    }
  }
  
  // Check if we're in localhost environment (local development)
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    // For localhost development, use geo query parameter
    const port = url.port || '4321'; // Default Astro dev server port
    const newUrl = `http://localhost:${port}?geo=${geoSubdomain}`;
    console.log('  Localhost environment, built URL:', newUrl);
    return newUrl;
  }
  
  // Check if we're in idag.ai environment (production)
  if (hostname.includes('idag.ai')) {
    const newUrl = `https://${geoSubdomain}.idag.ai`;
    console.log('  idag.ai environment, built URL:', newUrl);
    return newUrl;
  }
  
  // Check if we're in idag.se environment (production alternative)
  if (hostname.includes('idag.se')) {
    const newUrl = `https://${geoSubdomain}.idag.se`;
    console.log('  idag.se environment, built URL:', newUrl);
    return newUrl;
  }
  
  // For development/unknown environments, default to workers.dev
  // This handles both build-time (example.com) and any other unknown hostnames
  const defaultWorkerSuffix = 'rob911120.workers.dev';
  const fallbackUrl = `https://${geoSubdomain}-idag-ai.${defaultWorkerSuffix}`;
  console.log('  Unknown environment, using workers.dev fallback:', fallbackUrl);
  return fallbackUrl;
}


// Get geo navigation items with correct subdomain URLs
export function getGeoNavigationItems(currentUrl = '') {
  const geoItems = [
    { geoSubdomain: 'se', label: 'Sverige', flag: '🇸🇪' },
    { geoSubdomain: 'no', label: 'Norge', flag: '🇳🇴' },
  ];
  
  return geoItems.map(item => ({
    href: buildGeoSubdomainUrl(item.geoSubdomain, currentUrl),
    label: item.label,
    flag: item.flag,
    geoSubdomain: item.geoSubdomain
  }));
}

// Get category navigation items for a specific geo subdomain
export function getCategoryNavigationItems(geoSubdomain, currentUrl = '') {
  const categoryItems = [
    { category: 'nyheter', label: 'Nyheter' },
    { category: 'modeller', label: 'Modeller' },
    { category: 'verktyg', label: 'Verktyg' },
    { category: 'akademi', label: 'Akademi' },
  ];
  
  // Build URLs relative to the current geo subdomain
  const baseUrl = buildGeoSubdomainUrl(geoSubdomain, currentUrl);
  
  return categoryItems.map(item => ({
    href: `${baseUrl}/${item.category}`,
    label: item.label,
    category: item.category,
    geoSubdomain: geoSubdomain
  }));
}


// Check if current URL matches a specific geo subdomain
export function isCurrentGeoSubdomain(geoSubdomain, currentUrl = '') {
  if (typeof window !== 'undefined') {
    currentUrl = window.location.href;
  }
  
  const url = new URL(currentUrl || 'https://idag.ai');
  const hostname = url.hostname;
  
  // Check workers.dev pattern
  if (hostname.includes('workers.dev')) {
    return hostname.startsWith(`${geoSubdomain}-idag-ai`);
  }
  
  // Check production patterns
  if (hostname.includes('idag.ai') || hostname.includes('idag.se')) {
    return hostname.startsWith(`${geoSubdomain}.`);
  }
  
  return false;
}

// Check if current URL matches a specific category within a geo subdomain
export function isCurrentCategory(category, geoSubdomain, currentUrl = '') {
  if (typeof window !== 'undefined') {
    currentUrl = window.location.href;
  }
  
  const url = new URL(currentUrl || 'https://idag.ai');
  const pathname = url.pathname;
  
  // Check if we're on the correct geo subdomain and category path
  return isCurrentGeoSubdomain(geoSubdomain, currentUrl) &&
         (pathname === `/${category}` || pathname.startsWith(`/${category}/`));
}


// Helper function to detect current geo subdomain from URL
export function getCurrentGeoSubdomain(currentUrl = '') {
  if (typeof window !== 'undefined') {
    currentUrl = window.location.href;
  }
  
  const url = new URL(currentUrl || 'https://idag.ai');
  const hostname = url.hostname;
  const parts = hostname.split('.');
  
  // For localhost development, check for geo query parameter
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    const geoParam = url.searchParams.get('geo');
    if (geoParam && ['se', 'no'].includes(geoParam)) {
      return geoParam;
    }
  }
  
  // Check workers.dev pattern
  if (hostname.includes('workers.dev')) {
    const workerSubdomain = parts[0];
    if (workerSubdomain.includes('se-idag-ai')) return 'se';
    if (workerSubdomain.includes('no-idag-ai')) return 'no';
  }
  
  // Check production patterns
  if (hostname.includes('idag.ai') || hostname.includes('idag.se')) {
    const subdomain = parts[0];
    if (['se', 'no'].includes(subdomain)) return subdomain;
  }
  
  return 'se'; // Default to Swedish
}

// Helper function to detect current category from URL path
export function getCurrentCategory(currentUrl = '') {
  if (typeof window !== 'undefined') {
    currentUrl = window.location.href;
  }
  
  const url = new URL(currentUrl || 'https://idag.ai');
  const pathname = url.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);
  
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0];
    if (['nyheter', 'modeller', 'verktyg', 'akademi'].includes(firstSegment)) {
      return firstSegment;
    }
  }
  
  return null;
}