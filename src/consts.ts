// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "idag.ai";

// Geo-specific site descriptions
export const SITE_DESCRIPTIONS = {
  'se': "Idag, allt om AI. Sveriges största informationskälla inom AI.",
  'no': "I dag, alt om AI. Norges største informasjonskilde om AI."
} as const;

export const SITE_DESCRIPTION = "Idag, allt om AI. Sveriges största informationskälla inom AI.";

export const SITE_URL = import.meta.env.DEV
  ? "http://localhost:4321"
  : import.meta.env.CF_PAGES_URL
  ? import.meta.env.CF_PAGES_URL
  : "https://idag.ai";

// Geo-specific site URLs
export const GEO_SITE_URLS = {
  'se': 'https://se.idag.ai',
  'no': 'https://no.idag.ai'
} as const;

// Navigation items - links to different sections (geo-agnostic)
export const NAV_ITEMS = [
  { href: "/nyheter", label: "Nyheter" },
  { href: "/modeller", label: "Modeller" },
  { href: "/verktyg", label: "Verktyg" },
  { href: "/akademi", label: "Akademi" },
] as const;

// Helper function to get geo-specific site description
export function getSiteDescription(geoSubdomain?: string): string {
  if (geoSubdomain && geoSubdomain in SITE_DESCRIPTIONS) {
    return SITE_DESCRIPTIONS[geoSubdomain as keyof typeof SITE_DESCRIPTIONS];
  }
  return SITE_DESCRIPTION;
}

// Helper function to get geo-specific site URL
export function getSiteUrl(geoSubdomain?: string): string {
  if (geoSubdomain && geoSubdomain in GEO_SITE_URLS) {
    return GEO_SITE_URLS[geoSubdomain as keyof typeof GEO_SITE_URLS];
  }
  return SITE_URL;
}

// Hashtag categories for organizing content
export const HASHTAG_CATEGORIES = {
  'modeller': {
    name: 'MODELLER',
    description: 'AI-modeller, språkmodeller och deras utveckling',
    icon: 'brain'
  },
  'verktyg': {
    name: 'VERKTYG',
    description: 'AI-verktyg, applikationer och tjänster',
    icon: 'tools'
  },
  'guider': {
    name: 'GUIDER',
    description: 'Guider, tutorials och how-to inom AI',
    icon: 'book'
  },
  'nyheter': {
    name: 'NYHETER',
    description: 'Senaste nyheterna och utvecklingarna inom AI',
    icon: 'news'
  },
  'analys': {
    name: 'ANALYS',
    description: 'Expertanalyser och branschinsikter inom AI',
    icon: 'chart'
  },
  'trender': {
    name: 'TRENDER',
    description: 'Framtidstrender och prognoser inom AI',
    icon: 'trending'
  },
  'företag': {
    name: 'FÖRETAG',
    description: 'Företagsnyheter och investeringar inom AI',
    icon: 'building'
  }
} as const;

export type HashtagKey = keyof typeof HASHTAG_CATEGORIES;

// Social media links
export const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/company/idag-ai",
    icon: "linkedin"
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/idagai",
    icon: "twitter"
  }
] as const;
