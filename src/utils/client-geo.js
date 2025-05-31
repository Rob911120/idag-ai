// Client-side geo detection and content switching
export function initClientGeoSwitching() {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return;
  
  console.log('🌍 FIXED: Initializing domain-based geo switching');
  console.log('🔍 Current URL:', window.location.href);
  console.log('🔍 Current hostname:', window.location.hostname);
  
  // FIXED: Only use server-side detected geo from domain, never add geo parameters
  const detectedGeo = document.body.getAttribute('data-detected-geo');
  console.log('🎯 FIXED: Server-side detected geo from domain:', detectedGeo);
  
  // FIXED: Only remove geo parameters on non-localhost environments
  const url = new URL(window.location.href);
  const geoParam = url.searchParams.get('geo');
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname.startsWith('127.0.0.1');
  
  // FIXED: Only remove geo parameter if NOT on localhost (localhost uses geo params for testing)
  if (geoParam && !isLocalhost) {
    console.log('🧹 FIXED: Removing geo parameter from URL (not localhost), using domain-based switching');
    url.searchParams.delete('geo');
    window.history.replaceState({}, '', url.href);
  } else if (geoParam && isLocalhost) {
    console.log('🏠 FIXED: Keeping geo parameter on localhost for testing:', geoParam);
  }
  
  // FIXED: On localhost, use geo parameter; on other environments, use domain-based geo
  let finalGeo = detectedGeo;
  
  if (isLocalhost && geoParam && ['se', 'no'].includes(geoParam)) {
    console.log('🏠 FIXED: Using localhost geo parameter:', geoParam);
    finalGeo = geoParam;
  } else if (detectedGeo && ['se', 'no'].includes(detectedGeo)) {
    console.log('🎯 FIXED: Using domain-based geo:', detectedGeo);
    finalGeo = detectedGeo;
  } else {
    console.log('🎯 FIXED: No valid geo detected, defaulting to Swedish content');
    finalGeo = 'se';
  }
  
  switchToGeo(finalGeo);
}

export function switchToGeo(targetGeo) {
  console.log('🔄 FIXED: Switching to geo:', targetGeo);
  
  // Update page content based on geo
  updatePageContent(targetGeo);
  
  // Update active geo button
  updateGeoButtons(targetGeo);
  
  // FIXED: Do NOT modify URL with geo parameters when using domain-based switching
  // The domain itself determines the language, not URL parameters
  console.log('✅ FIXED: No URL modification - domain determines language');
}

function updatePageContent(geo) {
  // Update hero section text
  const heroSubtitle = document.querySelector('.hero-intro__subtitle');
  if (heroSubtitle) {
    if (geo === 'no') {
      heroSubtitle.textContent = 'Hold deg oppdatert med de siste nyhetene innen kunstig intelligens';
    } else {
      heroSubtitle.textContent = 'Håll dig uppdaterad med de senaste nyheterna inom artificiell intelligens';
    }
  }
  
  // Update search placeholder
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    if (geo === 'no') {
      searchInput.placeholder = 'Søk over alle seksjoner...';
    } else {
      searchInput.placeholder = 'Sök över alla sektioner...';
    }
  }
  
  // Update section titles
  const subdomainsSectionTitle = document.querySelector('.subdomains-section__title');
  if (subdomainsSectionTitle) {
    if (geo === 'no') {
      subdomainsSectionTitle.textContent = 'Utforsk våre områder';
    } else {
      subdomainsSectionTitle.textContent = 'Utforska våra områden';
    }
  }
  
  const hashtagsSectionTitle = document.querySelector('.hashtags-section__title');
  if (hashtagsSectionTitle) {
    if (geo === 'no') {
      hashtagsSectionTitle.textContent = 'Populære emner';
    } else {
      hashtagsSectionTitle.textContent = 'Populära ämnen';
    }
  }
  
  const categoriesSectionTitle = document.querySelector('.categories-section__title');
  if (categoriesSectionTitle) {
    if (geo === 'no') {
      categoriesSectionTitle.textContent = 'Utforsk våre kategorier';
    } else {
      categoriesSectionTitle.textContent = 'Utforska våra kategorier';
    }
  }
  
  // Update news grid title
  const newsGridTitle = document.querySelector('#news-grid-container h2');
  if (newsGridTitle) {
    if (geo === 'no') {
      newsGridTitle.textContent = 'Siste artiklene';
    } else {
      newsGridTitle.textContent = 'Senaste artiklarna';
    }
  }
  
  // Update article count text
  const articleCounts = document.querySelectorAll('.subdomain-card__count');
  articleCounts.forEach(count => {
    const text = count.textContent;
    const number = text.match(/\d+/)?.[0];
    if (number) {
      if (geo === 'no') {
        count.textContent = `${number} artikler`;
      } else {
        count.textContent = `${number} artiklar`;
      }
    }
  });
  
  console.log('✅ Page content updated for geo:', geo);
}

function updateGeoButtons(activeGeo) {
  const geoButtons = document.querySelectorAll('.geo-nav-button');
  geoButtons.forEach(button => {
    const buttonGeo = button.getAttribute('data-geo');
    if (buttonGeo === activeGeo) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  console.log('✅ Geo buttons updated, active:', activeGeo);
}

// Export for global access
window.switchToGeo = switchToGeo;