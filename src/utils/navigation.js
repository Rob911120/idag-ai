// Navigation utilities for handling subdomain URLs across environments
export function buildSubdomainUrl(subdomain, currentUrl = '') {
  // If we're in browser environment, use window.location
  if (typeof window !== 'undefined') {
    currentUrl = window.location.href;
  }
  
  const url = new URL(currentUrl || 'https://idag.ai');
  const hostname = url.hostname;
  
  console.log('🔗 Building subdomain URL for:', subdomain);
  console.log('  Current hostname:', hostname);
  
  // Check if we're in workers.dev environment (development)
  if (hostname.includes('workers.dev')) {
    // Extract the worker suffix (e.g., "rob911120.workers.dev")
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const workerSuffix = parts.slice(-3).join('.'); // "rob911120.workers.dev"
      const newUrl = `https://${subdomain}-idag-ai.${workerSuffix}`;
      console.log('  Workers.dev environment, built URL:', newUrl);
      return newUrl;
    }
  }
  
  // Check if we're in idag.ai environment (production)
  if (hostname.includes('idag.ai')) {
    const newUrl = `https://${subdomain}.idag.ai`;
    console.log('  idag.ai environment, built URL:', newUrl);
    return newUrl;
  }
  
  // Check if we're in idag.se environment (production alternative)
  if (hostname.includes('idag.se')) {
    const newUrl = `https://${subdomain}.idag.se`;
    console.log('  idag.se environment, built URL:', newUrl);
    return newUrl;
  }
  
  // Fallback to idag.se for unknown environments
  const fallbackUrl = `https://${subdomain}.idag.se`;
  console.log('  Unknown environment, using fallback:', fallbackUrl);
  return fallbackUrl;
}

// Get navigation items with correct subdomain URLs
export function getNavigationItems(currentUrl = '') {
  const baseItems = [
    { subdomain: 'nyheter', label: 'Nyheter' },
    { subdomain: 'modeller', label: 'Modeller' },
    { subdomain: 'verktyg', label: 'Verktyg' },
    { subdomain: 'akademi', label: 'Akademi' },
  ];
  
  return baseItems.map(item => ({
    href: buildSubdomainUrl(item.subdomain, currentUrl),
    label: item.label,
    subdomain: item.subdomain
  }));
}

// Check if current URL matches a specific subdomain
export function isCurrentSubdomain(subdomain, currentUrl = '') {
  if (typeof window !== 'undefined') {
    currentUrl = window.location.href;
  }
  
  const url = new URL(currentUrl || 'https://idag.ai');
  const hostname = url.hostname;
  
  // Check workers.dev pattern
  if (hostname.includes('workers.dev')) {
    return hostname.startsWith(`${subdomain}-idag-ai`);
  }
  
  // Check production patterns
  if (hostname.includes('idag.ai') || hostname.includes('idag.se')) {
    return hostname.startsWith(`${subdomain}.`);
  }
  
  return false;
}