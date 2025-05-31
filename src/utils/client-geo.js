// Client-side geo detection and content switching
export function initClientGeoSwitching() {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return;
  
  console.log('🌍 Initializing client-side geo switching');
  console.log('🔍 Current URL:', window.location.href);
  console.log('🔍 Current hostname:', window.location.hostname);
  
  // First check for server-side detected geo from body data attribute
  const detectedGeo = document.body.getAttribute('data-detected-geo');
  console.log('🎯 Server-side detected geo:', detectedGeo);
  console.log('🎯 Body element attributes:', Array.from(document.body.attributes).map(attr => `${attr.name}="${attr.value}"`));
  
  // Then check for geo parameter (overrides server-side detection)
  const url = new URL(window.location.href);
  const geoParam = url.searchParams.get('geo');
  
  let targetGeo = null;
  
  if (geoParam && ['se', 'no'].includes(geoParam)) {
    console.log('🎯 Found geo parameter (overriding server-side):', geoParam);
    targetGeo = geoParam;
  } else if (detectedGeo && ['se', 'no'].includes(detectedGeo)) {
    console.log('🎯 Using server-side detected geo:', detectedGeo);
    targetGeo = detectedGeo;
  }
  
  if (targetGeo) {
    switchToGeo(targetGeo);
  } else {
    console.log('🎯 No geo detected, defaulting to Swedish content');
    // Ensure Swedish content is shown by default
    updateGeoButtons('se');
  }
}

export function switchToGeo(targetGeo) {
  console.log('🔄 Switching to geo:', targetGeo);
  
  // Update page content based on geo
  updatePageContent(targetGeo);
  
  // Update active geo button
  updateGeoButtons(targetGeo);
  
  // Update URL without reload
  const url = new URL(window.location.href);
  url.searchParams.set('geo', targetGeo);
  window.history.replaceState({}, '', url.href);
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