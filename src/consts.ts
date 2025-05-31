// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "idag.ai";
export const SITE_DESCRIPTION = "Idag, allt om AI. Sveriges största informationskälla inom AI.";
export const SITE_URL = "https://idag.ai";

// Navigation items - links to different sections
export const NAV_ITEMS = [
  { href: "/nyheter", label: "Nyheter" },
  { href: "/modeller", label: "Modeller" },
  { href: "/verktyg", label: "Verktyg" },
  { href: "/akademi", label: "Akademi" },
] as const;

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
