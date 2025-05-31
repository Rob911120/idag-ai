# Subdomän-deployment för idag.ai

## 🚀 Testmiljö (Nuvarande)

### Aktiva test-subdomäner:
- `https://nyheter-idag-ai.rob911120.workers.dev` ✅ (deployad)
- `https://modeller-idag-ai.rob911120.workers.dev` (redo för deployment)
- `https://verktyg-idag-ai.rob911120.workers.dev` (redo för deployment)
- `https://akademi-idag-ai.rob911120.workers.dev` (redo för deployment)

### Manuell deployment av resterande test-subdomäner:
```bash
npx wrangler deploy --config wrangler-modeller.json
npx wrangler deploy --config wrangler-verktyg.json
npx wrangler deploy --config wrangler-akademi.json
```

## 🌐 Produktionsmiljö (Framtida)

### När du går live med riktiga domäner:

1. **Byt namn på Workers i Cloudflare Dashboard:**
   - `nyheter-idag-ai` → `nyheter`
   - `modeller-idag-ai` → `modeller`
   - `verktyg-idag-ai` → `verktyg`
   - `akademi-idag-ai` → `akademi`
   - `idag-ai` → `idag-ai-main`

2. **Använd produktions-konfigurationerna:**
   - `wrangler-production.json` för huvudsidan (idag.ai)
   - `wrangler-nyheter-production.json` för nyheter.idag.ai
   - Skapa liknande för modeller, verktyg, akademi

3. **DNS-konfiguration:**
   Lägg till CNAME-poster i Cloudflare DNS:
   ```
   nyheter.idag.ai → nyheter.rob911120.workers.dev
   modeller.idag.ai → modeller.rob911120.workers.dev
   verktyg.idag.ai → verktyg.rob911120.workers.dev
   akademi.idag.ai → akademi.rob911120.workers.dev
   ```

## 🔄 GitHub Actions

Automatisk deployment är konfigurerad i `.github/workflows/deploy.yml`.

### Secrets som behövs i GitHub:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Deployment triggas automatiskt vid:
- Push till `main` branch
- Pull requests till `main`

## 🧪 Subdomän-funktionalitet

### Implementerade funktioner:
- ✅ Subdomän-detektering för både test och produktion
- ✅ Innehållsfiltrering baserat på subdomän
- ✅ Debug-loggar för felsökning
- ✅ TypeScript-kompatibel kod
- ✅ Automatisk deployment via GitHub Actions

### Testning:
Varje subdomän visar endast innehåll relevant för sitt område:
- **Nyheter**: Endast AI-nyheter och breaking news
- **Modeller**: Endast AI-modeller och guider
- **Verktyg**: Endast AI-verktyg och recensioner
- **Akademi**: Endast utbildningsmaterial och kurser

## 📝 Nästa steg för produktion:

1. Konfigurera DNS-poster för subdomäner
2. Byt namn på Workers i Cloudflare
3. Uppdatera GitHub Actions secrets
4. Testa produktionsdomäner
5. Aktivera SSL-certifikat för alla subdomäner