// Simplified navigation utilities that work across all environments
export function getCategoryNavigationItems(geoSubdomain = 'se', currentUrl = '') {
  const categoryItems = [
    { category: 'nyheter', label: 'Nyheter' },
    { category: 'modeller', label: 'Modeller' },
    { category: 'verktyg', label: 'Verktyg' },
    { category: 'akademi', label: 'Akademi' },
  ];
  
  // Use relative paths that work in all environments
  return categoryItems.map(item => ({
    href: `/${item.category}`,
    label: item.label,
    category: item.category,
    geoSubdomain: geoSubdomain
  }));
}

// Simplified geo subdomain detection
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
  
  // Check workers.dev pattern (se-idag-ai.workers.dev)
  if (hostname.includes('workers.dev')) {
    const workerSubdomain = parts[0];
    if (workerSubdomain.includes('se-idag-ai')) return 'se';
    if (workerSubdomain.includes('no-idag-ai')) return 'no';
  }
  
  // Check production patterns (se.idag.ai, no.idag.ai)
  if (hostname.includes('idag.ai') || hostname.includes('idag.se')) {
    const subdomain = parts[0];
    if (['se', 'no'].includes(subdomain)) return subdomain;
  }
  
  return 'se'; // Default to Swedish
}

// Helper to check if we're on a specific category page
export function isCurrentCategory(category, currentUrl = '') {
  if (typeof window !== 'undefined') {
    currentUrl = window.location.href;
  }
  
  const url = new URL(currentUrl || 'https://idag.ai');
  const pathname = url.pathname;
  
  return pathname === `/${category}` || pathname.startsWith(`/${category}/`);
}