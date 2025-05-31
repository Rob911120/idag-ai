// Subdomain detection and routing utilities
export function detectSubdomain(request) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  console.log('🔍 Subdomain Detection Debug:');
  console.log('  Full URL:', request.url);
  console.log('  Hostname:', hostname);
  
  // Extract subdomain from hostname
  const parts = hostname.split('.');
  console.log('  Hostname parts:', parts);
  
  // Check for Cloudflare Workers subdomain pattern (test environment)
  if (hostname.includes('workers.dev')) {
    const workerSubdomain = parts[0];
    console.log('  Workers.dev detected, subdomain:', workerSubdomain);
    
    // Map worker subdomain to content subdomain
    const subdomainMap = {
      'nyheter-idag-ai': 'nyheter',
      'modeller-idag-ai': 'modeller',
      'verktyg-idag-ai': 'verktyg',
      'akademi-idag-ai': 'akademi',
      // Production mappings (when we change worker names)
      'nyheter': 'nyheter',
      'modeller': 'modeller',
      'verktyg': 'verktyg',
      'akademi': 'akademi'
    };
    
    const contentSubdomain = subdomainMap[workerSubdomain];
    console.log('  Mapped to content subdomain:', contentSubdomain);
    
    return contentSubdomain || null;
  }
  
  // Check for custom domain subdomain pattern (production environment)
  if (hostname.includes('idag.ai')) {
    const subdomain = parts[0];
    console.log('  idag.ai domain detected, subdomain:', subdomain);
    
    // Handle both www and non-www cases
    if (subdomain === 'www' && parts.length > 2) {
      // www.nyheter.idag.ai -> nyheter
      const actualSubdomain = parts[1];
      if (['nyheter', 'modeller', 'verktyg', 'akademi'].includes(actualSubdomain)) {
        return actualSubdomain;
      }
    } else if (['nyheter', 'modeller', 'verktyg', 'akademi'].includes(subdomain)) {
      // nyheter.idag.ai -> nyheter
      return subdomain;
    }
  }
  
  console.log('  No valid subdomain detected');
  return null;
}

export function getSubdomainContent(subdomain, collections) {
  console.log('📚 Getting content for subdomain:', subdomain);
  
  if (!subdomain) {
    console.log('  No subdomain provided, returning all content');
    return null;
  }
  
  const { news, nyheter, modeller, verktyg, akademi } = collections;
  
  switch (subdomain) {
    case 'nyheter':
      const nyhetarContent = [...(nyheter || []), ...(news || []).filter(item => item.data.subdomain === 'nyheter')];
      console.log(`  Found ${nyhetarContent.length} nyheter articles`);
      return nyhetarContent;
      
    case 'modeller':
      console.log(`  Found ${modeller?.length || 0} modeller articles`);
      return modeller || [];
      
    case 'verktyg':
      console.log(`  Found ${verktyg?.length || 0} verktyg articles`);
      return verktyg || [];
      
    case 'akademi':
      console.log(`  Found ${akademi?.length || 0} akademi articles`);
      return akademi || [];
      
    default:
      console.log('  Unknown subdomain, returning null');
      return null;
  }
}

export function shouldRedirectToSubdomain(subdomain, pathname) {
  console.log('🔄 Checking redirect for subdomain:', subdomain, 'pathname:', pathname);
  
  if (!subdomain) return false;
  
  // Don't redirect if already on correct path
  if (pathname.startsWith(`/${subdomain}`)) {
    console.log('  Already on correct path, no redirect needed');
    return false;
  }
  
  // Don't redirect for root path - show subdomain-specific content instead
  if (pathname === '/' || pathname === '') {
    console.log('  Root path detected, will show subdomain content');
    return false;
  }
  
  console.log('  Redirect needed');
  return true;
}