---
title: "Exempel på artikel från n8n"
description: "Detta är ett exempel på hur artiklar ska struktureras när de pushas från n8n till uploaded mappen"
pubDate: 2024-01-30
heroImage: "/blog-placeholder-1.jpg"
heroImageAlt: "Exempel bild för artikel"
country: "se"
subdomain: "nyheter"
tags: ["exempel", "n8n", "automation"]
hashtags: ["nyheter", "automation"]
featured: false
readingTime: 3
author: "idag.ai Redaktion"
seoTitle: "Exempel artikel - Automatisk publicering"
seoDescription: "Exempel på hur artiklar struktureras för automatisk publicering via n8n"
---

Detta är ett exempel på en artikel som pushas från n8n till `/uploaded` mappen.

## Viktiga punkter för n8n-integration

### Kategori-mappning
Artikeln kommer automatiskt att flyttas till rätt mapp baserat på `country` och `subdomain` fälten:

**För Sverige (country: "se"):**
- `subdomain: "nyheter"` → `src/content/se/se-nyheter/`
- `subdomain: "modeller"` → `src/content/se/se-modeller/`
- `subdomain: "verktyg"` → `src/content/se/se-verktyg/`
- `subdomain: "akademi"` → `src/content/se/se-akademi/`

**För Norge (country: "no"):**
- `subdomain: "nyheter"` → `src/content/no/no-nyheter/`
- `subdomain: "modeller"` → `src/content/no/no-modeller/`
- `subdomain: "verktyg"` → `src/content/no/no-verktyg/`
- `subdomain: "akademi"` → `src/content/no/no-akademi/`

### Automatisk slug-generering
Filnamnet genereras automatiskt från titeln:
- "Exempel på artikel från n8n" → `exempel-pa-artikel-fran-n8n.md`

### Datum för "senaste nytt"
Använd alltid dagens datum i `pubDate` för att artikeln ska visas som "senaste nytt".

## Så fungerar processen

1. **n8n pushar** artikel till `/uploaded/`
2. **GitHub Action triggas** automatiskt
3. **process-uploaded.js** flyttar artikeln till rätt kategori-mapp
4. **update-featured.js** sätter featured status
5. **Sidan deployas** till Cloudflare Workers
6. **Artikeln visas** som "senaste nytt" på hemsidan

Denna fil kommer att flyttas automatiskt till `src/content/se/se-nyheter/exempel-pa-artikel-fran-n8n.md` när systemet körs (baserat på `country: "se"` och `subdomain: "nyheter"`).