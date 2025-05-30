// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "idag.ai";
export const SITE_DESCRIPTION = "Idag, allt om AI. Sveriges största informationskälla inom AI.";
export const SITE_URL = "https://idag.ai";

// Navigation items - now used as filters
export const NAV_ITEMS = [
  { filter: "senaste", label: "Senaste" },
  { filter: "modeller", label: "Modeller" },
  { filter: "verktyg", label: "Verktyg" },
  { filter: "guider", label: "Guider" },
] as const;

// Article categories
export const CATEGORIES = {
  'ai-nyheter': 'AI NYHETER',
  'teknik': 'TEKNIK', 
  'analys': 'ANALYS',
  'trender': 'TRENDER',
  'foretag': 'FÖRETAG'
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

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
