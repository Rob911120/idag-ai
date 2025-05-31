// Geo-based subdomain detection and routing utilities
export function detectSubdomain(request, astroUrl) {
  try {
    const url = astroUrl || new URL(request.url);
    const hostname = url.hostname;
    
    console.log('🔍 DEBUG: Geo Subdomain Detection:');
    console.log('  Full URL:', url.href);
    console.log('  Hostname:', hostname);
  
  // CRITICAL FIX: First check Cloudflare Workers environment variables
  // This ensures each worker deployment shows the correct language
  try {
    // In Cloudflare Workers, env vars are available through the runtime context
    const runtime = globalThis.runtime || globalThis;
    if (runtime && runtime.env && runtime.env.GEO_SUBDOMAIN) {
      const envGeo = runtime.env.GEO_SUBDOMAIN;
      console.log('  🎯 CRITICAL FIX: Using runtime environment GEO_SUBDOMAIN:', envGeo);
      return envGeo;
    }
    
    // Also try import.meta.env for build-time variables
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.GEO_SUBDOMAIN) {
      const envGeo = import.meta.env.GEO_SUBDOMAIN;
      console.log('  🎯 CRITICAL FIX: Using import.meta.env GEO_SUBDOMAIN:', envGeo);
      return envGeo;
    }
  } catch (e) {
    console.log('  ⚠️ Could not access environment variables:', e.message);
  }
  
  // Check for geo query parameter (fallback for localhost)
  const geoParam = url.searchParams.get('geo');
  if (geoParam && ['se', 'no'].includes(geoParam)) {
    console.log('  🎯 DEBUG: Found geo query parameter:', geoParam);
    return geoParam;
  }
  
  // Extract subdomain from hostname
  const parts = hostname.split('.');
  console.log('  DEBUG: Hostname parts:', parts);
  
  // Check for Cloudflare Workers subdomain pattern (test environment)
  if (hostname.includes('workers.dev')) {
    const workerSubdomain = parts[0];
    console.log('  DEBUG: Workers.dev detected, subdomain:', workerSubdomain);
    
    // Map worker subdomain to geo subdomain
    const subdomainMap = {
      'se-idag-ai': 'se',
      'no-idag-ai': 'no',
      // Direct mappings
      'se': 'se',
      'no': 'no'
    };
    
    const geoSubdomain = subdomainMap[workerSubdomain];
    console.log('  🎯 DEBUG: WORKER SUBDOMAIN MAPPING:');
    console.log('    Input subdomain:', workerSubdomain);
    console.log('    Mapped to geo:', geoSubdomain);
    console.log('    Available mappings:', Object.keys(subdomainMap));
    console.log('    RESULT: Will return geo subdomain:', geoSubdomain);
    
    return geoSubdomain || null;
  }
  
  // Check for custom domain subdomain pattern (production environment)
  if (hostname.includes('idag.ai')) {
    const subdomain = parts[0];
    console.log('  idag.ai domain detected, subdomain:', subdomain);
    
    // Handle both www and non-www cases
    if (subdomain === 'www' && parts.length > 2) {
      // www.se.idag.ai -> se
      const actualSubdomain = parts[1];
      if (['se', 'no'].includes(actualSubdomain)) {
        return actualSubdomain;
      }
    } else if (['se', 'no'].includes(subdomain)) {
      // se.idag.ai -> se, no.idag.ai -> no
      return subdomain;
    }
  }
  
  console.log('  No valid geo subdomain detected, using default "se"');
  // During prerendering, return a default value instead of null to prevent build errors
  return 'se';
  
  } catch (error) {
    console.error('🚨 Error in geo subdomain detection:', error);
    // Fallback to default behavior - use 'se' instead of null during prerendering
    return 'se';
  }
}

export function getGeoContent(geoSubdomain, collections) {
  console.log('📚 Getting content for geo subdomain:', geoSubdomain);
  
  if (!geoSubdomain) {
    console.log('  No geo subdomain provided, returning all content');
    return null;
  }
  
  // Get country-specific collections
  const countryCollections = getCountryCollections(geoSubdomain, collections);
  
  console.log(`  Found ${Object.keys(countryCollections).length} collection types for ${geoSubdomain}`);
  return countryCollections;
}

export function getCountryCollections(country, collections) {
  const prefix = country === 'se' ? 'se' : 'no';
  
  return {
    nyheter: collections[`${prefix}-nyheter`] || [],
    modeller: collections[`${prefix}-modeller`] || [],
    verktyg: collections[`${prefix}-verktyg`] || [],
    akademi: collections[`${prefix}-akademi`] || []
  };
}

export function getCategoryContent(geoSubdomain, category, collections) {
  console.log('📚 Getting category content:', category, 'for geo:', geoSubdomain);
  
  const countryCollections = getCountryCollections(geoSubdomain, collections);
  
  switch (category) {
    case 'nyheter':
      const nyhetarContent = countryCollections.nyheter || [];
      console.log(`  Found ${nyhetarContent.length} nyheter articles for ${geoSubdomain}`);
      return nyhetarContent;
      
    case 'modeller':
      const modellerContent = countryCollections.modeller || [];
      console.log(`  Found ${modellerContent.length} modeller articles for ${geoSubdomain}`);
      return modellerContent;
      
    case 'verktyg':
      const verktygContent = countryCollections.verktyg || [];
      console.log(`  Found ${verktygContent.length} verktyg articles for ${geoSubdomain}`);
      return verktygContent;
      
    case 'akademi':
      const akademiContent = countryCollections.akademi || [];
      console.log(`  Found ${akademiContent.length} akademi articles for ${geoSubdomain}`);
      return akademiContent;
      
    default:
      console.log('  Unknown category, returning null');
      return null;
  }
}

export function shouldRedirectToGeoSubdomain(geoSubdomain, pathname) {
  console.log('🔄 Checking redirect for geo subdomain:', geoSubdomain, 'pathname:', pathname);
  
  if (!geoSubdomain) return false;
  
  // Don't redirect for root path - show geo-specific content instead
  if (pathname === '/' || pathname === '') {
    console.log('  Root path detected, will show geo content');
    return false;
  }
  
  // Don't redirect if already on a category path (nyheter, modeller, etc.)
  const categoryPaths = ['nyheter', 'modeller', 'verktyg', 'akademi'];
  const pathSegments = pathname.split('/').filter(Boolean);
  
  if (pathSegments.length > 0 && categoryPaths.includes(pathSegments[0])) {
    console.log('  Already on category path, no redirect needed');
    return false;
  }
  
  console.log('  No redirect needed for geo-based routing');
  return false;
}

// Helper function to get language from geo subdomain
export function getLanguageFromGeo(geoSubdomain) {
  const languageMap = {
    'se': 'sv', // Swedish
    'no': 'no'  // Norwegian
  };
  
  return languageMap[geoSubdomain] || 'sv'; // Default to Swedish
}

// Helper function to get country name from geo subdomain
export function getCountryName(geoSubdomain, language = 'sv') {
  const countryNames = {
    'se': {
      'sv': 'Sverige',
      'no': 'Sverige',
      'en': 'Sweden'
    },
    'no': {
      'sv': 'Norge',
      'no': 'Norge',
      'en': 'Norway'
    }
  };
  
  return countryNames[geoSubdomain]?.[language] || countryNames[geoSubdomain]?.['sv'] || geoSubdomain;
}