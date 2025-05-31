// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://idag.ai",
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  i18n: {
    defaultLocale: "se",
    locales: ["se", "no"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  // Configure build output for geo-based subdomains
  build: {
    format: 'directory'
  }
});
