// Internationalization utilities for geo-based content
export const supportedLanguages = {
  'se': 'sv', // Swedish
  'no': 'no'  // Norwegian
};

export const defaultLanguage = 'sv';

// Translation strings for UI elements
export const translations = {
  sv: {
    // Navigation
    'nav.home': 'Hem',
    'nav.news': 'Nyheter',
    'nav.models': 'Modeller',
    'nav.tools': 'Verktyg',
    'nav.academy': 'Akademi',
    'nav.search': 'Sök',
    'nav.about': 'Om oss',
    
    // Categories
    'category.nyheter': 'Nyheter',
    'category.modeller': 'Modeller',
    'category.verktyg': 'Verktyg',
    'category.akademi': 'Akademi',
    
    // Countries
    'country.se': 'Sverige',
    'country.no': 'Norge',
    
    // Common UI
    'ui.readMore': 'Läs mer',
    'ui.publishedOn': 'Publicerad',
    'ui.updatedOn': 'Uppdaterad',
    'ui.author': 'Författare',
    'ui.readingTime': 'Läsningstid',
    'ui.minutes': 'minuter',
    'ui.tags': 'Taggar',
    'ui.sources': 'Källor',
    'ui.relatedArticles': 'Relaterade artiklar',
    'ui.backToTop': 'Tillbaka till toppen',
    'ui.loading': 'Laddar...',
    'ui.error': 'Ett fel uppstod',
    'ui.noResults': 'Inga resultat hittades',
    
    // Search
    'search.placeholder': 'Sök artiklar...',
    'search.results': 'Sökresultat',
    'search.noResults': 'Inga artiklar hittades för din sökning',
    
    // Article metadata
    'meta.difficulty.nybörjare': 'Nybörjare',
    'meta.difficulty.medel': 'Medel',
    'meta.difficulty.avancerad': 'Avancerad',
    
    // Footer
    'footer.copyright': '© 2024 idag.ai. Alla rättigheter förbehållna.',
    'footer.privacy': 'Integritetspolicy',
    'footer.terms': 'Användarvillkor',
    
    // Error messages
    'error.pageNotFound': 'Sidan kunde inte hittas',
    'error.serverError': 'Serverfel',
    'error.networkError': 'Nätverksfel'
  },
  
  no: {
    // Navigation
    'nav.home': 'Hjem',
    'nav.news': 'Nyheter',
    'nav.models': 'Modeller',
    'nav.tools': 'Verktøy',
    'nav.academy': 'Akademi',
    'nav.search': 'Søk',
    'nav.about': 'Om oss',
    
    // Categories
    'category.nyheter': 'Nyheter',
    'category.modeller': 'Modeller',
    'category.verktyg': 'Verktøy',
    'category.akademi': 'Akademi',
    
    // Countries
    'country.se': 'Sverige',
    'country.no': 'Norge',
    
    // Common UI
    'ui.readMore': 'Les mer',
    'ui.publishedOn': 'Publisert',
    'ui.updatedOn': 'Oppdatert',
    'ui.author': 'Forfatter',
    'ui.readingTime': 'Lesetid',
    'ui.minutes': 'minutter',
    'ui.tags': 'Tagger',
    'ui.sources': 'Kilder',
    'ui.relatedArticles': 'Relaterte artikler',
    'ui.backToTop': 'Tilbake til toppen',
    'ui.loading': 'Laster...',
    'ui.error': 'En feil oppstod',
    'ui.noResults': 'Ingen resultater funnet',
    
    // Search
    'search.placeholder': 'Søk artikler...',
    'search.results': 'Søkeresultater',
    'search.noResults': 'Ingen artikler funnet for ditt søk',
    
    // Article metadata
    'meta.difficulty.nybörjare': 'Nybegynner',
    'meta.difficulty.medel': 'Middels',
    'meta.difficulty.avancerad': 'Avansert',
    
    // Footer
    'footer.copyright': '© 2024 idag.ai. Alle rettigheter forbeholdt.',
    'footer.privacy': 'Personvernpolicy',
    'footer.terms': 'Brukervilkår',
    
    // Error messages
    'error.pageNotFound': 'Siden kunne ikke finnes',
    'error.serverError': 'Serverfeil',
    'error.networkError': 'Nettverksfeil'
  }
};

// Get language from geo subdomain
export function getLanguageFromGeo(geoSubdomain) {
  return supportedLanguages[geoSubdomain] || defaultLanguage;
}

// Get translation for a key
export function t(key, language = defaultLanguage) {
  const languageTranslations = translations[language] || translations[defaultLanguage];
  return languageTranslations[key] || key;
}

// Get translation with geo subdomain
export function tGeo(key, geoSubdomain) {
  const language = getLanguageFromGeo(geoSubdomain);
  return t(key, language);
}

// Format date according to language
export function formatDate(date, language = defaultLanguage) {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const locales = {
    'sv': 'sv-SE',
    'no': 'nb-NO'
  };
  
  const locale = locales[language] || locales[defaultLanguage];
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format date with geo subdomain
export function formatDateGeo(date, geoSubdomain) {
  const language = getLanguageFromGeo(geoSubdomain);
  return formatDate(date, language);
}

// Get reading time text
export function getReadingTimeText(minutes, language = defaultLanguage) {
  if (!minutes) return '';
  
  const minutesText = t('ui.minutes', language);
  return `${minutes} ${minutesText}`;
}

// Get reading time text with geo subdomain
export function getReadingTimeTextGeo(minutes, geoSubdomain) {
  const language = getLanguageFromGeo(geoSubdomain);
  return getReadingTimeText(minutes, language);
}

// Get difficulty text
export function getDifficultyText(difficulty, language = defaultLanguage) {
  if (!difficulty) return '';
  return t(`meta.difficulty.${difficulty}`, language);
}

// Get difficulty text with geo subdomain
export function getDifficultyTextGeo(difficulty, geoSubdomain) {
  const language = getLanguageFromGeo(geoSubdomain);
  return getDifficultyText(difficulty, language);
}

// Get category display name
export function getCategoryDisplayName(category, language = defaultLanguage) {
  return t(`category.${category}`, language);
}

// Get category display name with geo subdomain
export function getCategoryDisplayNameGeo(category, geoSubdomain) {
  const language = getLanguageFromGeo(geoSubdomain);
  return getCategoryDisplayName(category, language);
}

// Get country display name
export function getCountryDisplayName(countryCode, language = defaultLanguage) {
  return t(`country.${countryCode}`, language);
}

// Get country display name with geo subdomain
export function getCountryDisplayNameGeo(countryCode, geoSubdomain) {
  const language = getLanguageFromGeo(geoSubdomain);
  return getCountryDisplayName(countryCode, language);
}

// Check if language is RTL (not applicable for Swedish/Norwegian, but good to have)
export function isRTL(language = defaultLanguage) {
  const rtlLanguages = []; // No RTL languages in our current setup
  return rtlLanguages.includes(language);
}

// Get HTML lang attribute
export function getHtmlLang(geoSubdomain) {
  const language = getLanguageFromGeo(geoSubdomain);
  const langMap = {
    'sv': 'sv-SE',
    'no': 'nb-NO'
  };
  
  return langMap[language] || langMap[defaultLanguage];
}

// Get alternate language links for SEO
export function getAlternateLanguages(currentPath = '') {
  return Object.keys(supportedLanguages).map(geo => ({
    geo,
    language: supportedLanguages[geo],
    hreflang: getHtmlLang(geo),
    href: `https://${geo}.idag.ai${currentPath}`
  }));
}