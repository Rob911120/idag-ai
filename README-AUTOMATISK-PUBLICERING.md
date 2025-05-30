# Automatisk Publicering av Artiklar

Detta system hanterar automatisk publicering och uppdatering av "senaste nytt" på idag.ai när nya artiklar pushas från n8n.

## Hur det fungerar

### 1. Automatisk sortering
- Artiklar sorteras automatiskt efter [`pubDate`](src/pages/index.astro:13) (nyaste först)
- Den senaste artikeln visas automatiskt som "hero article" (stora artikeln överst)
- Äldre artiklar flyttas automatiskt ner till rutnätet

### 2. Smart featured-logik
Systemet använder smart logik för att bestämma vilken artikel som ska vara "featured":
- Om det finns en artikel med `featured: true` från idag → den visas som hero
- Annars → senaste artikeln visas automatiskt som hero

### 3. Automatisk sortering och deployment
När du pushar nya artiklar från n8n till `/uploaded` mappen:
1. GitHub Action triggas automatiskt
2. [`process-uploaded.js`](scripts/process-uploaded.js) sorterar artiklar till rätt kategori-mapp
3. [`update-featured.js`](scripts/update-featured.js) uppdaterar featured-status
4. Sidan byggs om automatiskt
5. Deployas till Cloudflare Workers via Wrangler

## n8n Integration - Uploaded Mappen

### Var ska n8n pusha filer?
**Pusha alla nya artiklar till `/uploaded` mappen!**

Systemet sorterar automatiskt artiklarna till rätt kategori-mapp baserat på `category` fältet.

### Automatisk sortering
- `category: "ai-nyheter"` → flyttas till `src/content/news/ai-nyheter/`
- `category: "teknik"` → flyttas till `src/content/news/teknik/`
- `category: "analys"` → flyttas till `src/content/news/analys/`
- `category: "trender"` → flyttas till `src/content/news/trender/`
- `category: "foretag"` → flyttas till `src/content/news/foretag/`

### Automatisk filnamn
Filnamnet genereras automatiskt från titeln:
- "OpenAI lanserar GPT-5" → `openai-lanserar-gpt-5.md`
- "Ny AI-teknik revolutionerar" → `ny-ai-teknik-revolutionerar.md`

## Filstruktur för nya artiklar

När du skapar artiklar i n8n för `/uploaded` mappen, använd denna struktur:

```markdown
---
title: "Din artikeltitel"
description: "Kort beskrivning av artikeln"
pubDate: 2024-01-15  # VIKTIGT: Använd dagens datum för "senaste nytt"
heroImage: "/blog-placeholder-1.jpg"
heroImageAlt: "Beskrivning av bilden"
category: "ai-nyheter"  # ai-nyheter, teknik, analys, trender, foretag
tags: ["OpenAI", "GPT-5", "språkmodeller"]
hashtags: ["senaste", "modeller"]  # För filtrering
featured: false  # Sätts automatiskt av systemet
readingTime: 4
author: "idag.ai Redaktion"
---

Din artikeltext här...
```

## Kategorier

Tillgängliga kategorier:
- `ai-nyheter` - AI-nyheter och utvecklingar
- `teknik` - Tekniska genomgångar
- `analys` - Expertanalyser
- `trender` - Framtidstrender
- `foretag` - Företagsnyheter

## Manuell hantering

### Lokalt
```bash
# Bearbeta filer i uploaded mappen
npm run process-uploaded

# Uppdatera featured status manuellt
npm run update-featured

# Komplett publicering (process + update + build + deploy)
npm run publish
```

### GitHub
- Artiklar i `src/content/news/` triggar automatisk deployment
- GitHub Action kör automatiskt vid push till main branch

## Viktiga filer

- [`src/pages/index.astro`](src/pages/index.astro) - Startsidan med smart artikel-logik
- [`scripts/update-featured.js`](scripts/update-featured.js) - Script för featured-hantering
- [`.github/workflows/auto-deploy.yml`](.github/workflows/auto-deploy.yml) - Automatisk deployment
- [`src/content.config.ts`](src/content.config.ts) - Content schema och validering

## Tips för n8n-integration

1. **Destination**: Pusha alltid till `/uploaded` mappen - systemet sorterar automatiskt
2. **Datum**: Använd alltid dagens datum i `pubDate` för "senaste nytt"
3. **Kategori**: Använd endast giltiga kategorier (ai-nyheter, teknik, analys, trender, foretag)
4. **Titel**: Titeln används för att generera filnamnet automatiskt
5. **Bilder**: Se till att bilderna finns i `/public/` mappen
6. **Featured**: Sätt alltid `featured: false` - systemet hanterar detta automatiskt

## Felsökning

Om artiklar inte visas som förväntat:
1. Kontrollera att `pubDate` är korrekt formaterat
2. Verifiera att kategorin finns i [`content.config.ts`](src/content.config.ts)
3. Kör `npm run update-featured` lokalt för att testa
4. Kontrollera GitHub Actions för deployment-status