# Stilify

Digital garderob: fota dina kläder och dig själv, be Claude stajla en outfit
baserat på tillfälle, årstid eller fritt mixat.

**Live:** https://stilify-two.vercel.app

## Kom igång (lokal utveckling)

Appen körs mot riktiga molntjänster även lokalt (Neon Postgres, Vercel Blob,
Clerk) — det finns ingen lokal-only-fallback.

1. Länka mappen till Vercel-projektet och hämta miljövariabler:

   ```
   npx vercel link
   npx vercel env pull .env.local
   ```

   Detta ger dig `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`,
   `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` m.fl. automatiskt.

2. Lägg till din egen Anthropic API-nyckel i `.env.local` (provisioneras inte
   automatiskt eftersom den inte hör till något Vercel-integration):

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Installera beroenden och starta dev-servern:

   ```
   npm install
   npm run dev
   ```

4. Öppna `http://localhost:3000` — du blir ombedd att skapa konto/logga in
   (Clerk). För att kunna fota från mobilen behöver du nå appen från
   telefonen (samma nätverk, t.ex. `http://<din-dators-ip>:3000`, eller via
   en tunnel som `ngrok`). De flesta mobilbrowsers kräver HTTPS för
   kameraåtkomst över nätverk, medan `localhost` alltid fungerar.

## Hur det funkar

- **Konto** – varje person loggar in med sin egen e-post (Clerk). Garderober
  är helt privata; ingen ser någon annans plagg eller foton.
- **Garderob** (`/garderob`) – fota ett plagg, Claude taggar automatiskt
  kategori/färg/säsong/stil och sparar det.
- **Mig** (`/mig`) – foton av dig själv i olika vinklar (referens).
- **Stajla** (`/stajla`) – välj tillfälle/årstid eller skriv fritt, Claude
  väljer ut en sammanhållen outfit ur din garderob och förklarar varför.
- **Installera som app** – en popup erbjuder att lägga till Stilify på
  hemskärmen (riktig installation på Android/Chrome, manuell instruktion på
  iOS Safari som saknar det stödet).

## Arkitektur

- **Next.js 16** (App Router, TypeScript, Tailwind v4).
- **Neon Postgres** (`@neondatabase/serverless`) för data — schema skapas
  automatiskt (`CREATE TABLE IF NOT EXISTS` + `ADD COLUMN IF NOT EXISTS`) i
  `src/lib/db.ts`, ingen separat migrationsprocess.
- **Vercel Blob** för uppladdade bilder (`src/lib/storage.ts`).
- **Clerk** för inloggning/konton — `src/proxy.ts` skyddar alla sidor och
  API-routes, varje rad i databasen har en `userId`-kolumn som alla queries
  filtrerar på.
- **Claude** (`claude-sonnet-5` via `@anthropic-ai/sdk`, `src/lib/anthropic.ts`)
  för plaggklassificering och outfitförslag.

Alla tre molntjänster (Neon, Blob, Clerk) är provisionerade som Vercel
Marketplace-integrationer kopplade till detta projekt — nya miljövariabler
hämtas alltid med `vercel env pull`, aldrig genom att klistra in hemligheter
manuellt.

## Deploy

```
npx vercel --prod
```

Push till `main` på GitHub triggar också en automatisk deploy (repo är
kopplat till Vercel-projektet).

## Kända begränsningar

- Vem som helst med länken till `/sign-up` kan skapa ett konto — ingen
  inbjudan-only-spärr.
- Clerk-instansen kör fortfarande i test-läge (inte en fullt konfigurerad
  produktionsinstans med verifierad domän) — funkar bra för en liten grupp
  testare, bör ses över inför bredare lansering.
- Stajlingen baseras på textbeskrivningarna som sparades vid fotografering av
  varje plagg, inte en ny bildanalys vid varje förslag (snabbare och
  billigare per förslag).
- Foton av dig själv används idag bara som referensbibliotek, inte i
  AI-promptet – kan kopplas in senare om du vill ha kroppstyps-medveten
  styling.
- En misslyckad Claude-klassificering lämnar en bild i Blob-lagret utan
  kopplad databaspost (ingen automatisk städning av det ännu).
