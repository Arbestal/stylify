# Stilify

Digital garderob: fota dina kläder och dig själv, be Claude stajla en outfit
baserat på tillfälle, årstid eller fritt mixat.

## Kom igång

1. Skapa `.env.local` (kopiera `.env.local.example`) och lägg in din
   Anthropic API-nyckel:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

2. Installera beroenden och starta dev-servern:

   ```
   npm install
   npm run dev
   ```

3. Öppna `http://localhost:3000` — för att kunna fota från mobilen behöver du
   nå appen från telefonen (samma nätverk, t.ex. `http://<din-dators-ip>:3000`,
   eller via en tunnel som `ngrok`). De flesta mobilbrowsers kräver HTTPS för
   kameraåtkomst över nätverk, medan `localhost` alltid fungerar.

## Hur det funkar

- **Garderob** (`/garderob`) – fota ett plagg, Claude taggar automatiskt
  kategori/färg/säsong/stil och sparar det.
- **Mig** (`/mig`) – foton av dig själv i olika vinklar (referens).
- **Stajla** (`/stajla`) – välj tillfälle/årstid eller skriv fritt, Claude
  väljer ut en sammanhållen outfit ur garderoben och förklarar varför.

## Data

Bilder sparas lokalt i `public/uploads/` och metadata i en SQLite-fil i
`data/stilify.db`. Båda är gitignorade – detta är en enanvändarprototyp utan
inloggning, tänkt att köras lokalt (eller på ett internt nätverk).

## Begränsningar i denna första version

- En användare, ingen autentisering.
- Stajlingen baseras på textbeskrivningarna som sparades vid fotografering av
  varje plagg, inte en ny bildanalys vid varje förslag (snabbare och
  billigare per förslag).
- Foton av dig själv används idag bara som referensbibliotek, inte i
  AI-promptet – kan kopplas in senare om du vill ha kroppstyps-medveten
  styling.
