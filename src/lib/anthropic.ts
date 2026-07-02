import Anthropic from "@anthropic-ai/sdk";
import type { ClothingItem } from "./db";

const MODEL = "claude-sonnet-5";

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY saknas. Lägg till den i .env.local (se .env.local.example)."
    );
  }
  return new Anthropic({ apiKey });
}

/** Pulls the first {...} JSON block out of a text reply, tolerating stray prose around it. */
function extractJson<T>(text: string): T {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Kunde inte tolka svar från AI:n: " + text);
  }
  return JSON.parse(text.slice(start, end + 1)) as T;
}

export interface ClothingClassification {
  category: string;
  colors: string;
  season: string;
  style: string;
  description: string;
}

export async function classifyClothingItem(
  base64: string,
  mediaType: string
): Promise<ClothingClassification> {
  const client = getClient();

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system:
      "Du är stylist-assistenten i en garderobs-app. Du analyserar foton av enskilda klädesplagg " +
      "och svarar ALLTID med enbart ett JSON-objekt, ingen annan text.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as
                | "image/jpeg"
                | "image/png"
                | "image/webp"
                | "image/gif",
              data: base64,
            },
          },
          {
            type: "text",
            text:
              "Analysera plagget på bilden. Svara med JSON på svenska i exakt detta format:\n" +
              `{"category": "en av: topp, byxa, klänning, ytterplagg, sko, accessoar, övrigt", ` +
              `"colors": "kort kommaseparerad lista på färger", ` +
              `"season": "en av: vår, sommar, höst, vinter, helår", ` +
              `"style": "kort stiltagg, t.ex. casual, formell, sport, festlig", ` +
              `"description": "en kort mening som beskriver plagget"}`,
          },
        ],
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return extractJson<ClothingClassification>(text);
}

export interface OutfitSuggestion {
  title: string;
  itemIds: string[];
  reasoning: string;
}

export async function generateOutfitSuggestion(
  items: ClothingItem[],
  context: { occasion: string; season: string; freeform: string }
): Promise<OutfitSuggestion> {
  const client = getClient();

  if (items.length === 0) {
    throw new Error("Garderoben är tom - lägg till några plagg först.");
  }

  const itemList = items
    .map(
      (item) =>
        `- id: ${item.id} | kategori: ${item.category} | färger: ${item.colors} | säsong: ${item.season} | stil: ${item.style} | beskrivning: ${item.description}`
    )
    .join("\n");

  const contextParts: string[] = [];
  if (context.occasion) contextParts.push(`Tillfälle: ${context.occasion}`);
  if (context.season) contextParts.push(`Årstid: ${context.season}`);
  if (context.freeform) contextParts.push(`Övrigt önskemål: ${context.freeform}`);
  const contextText =
    contextParts.length > 0
      ? contextParts.join("\n")
      : "Inget specifikt tillfälle angivet - mixa fritt och skapa en snygg, sammanhållen outfit.";

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 700,
    system:
      "Du är en personlig stylist. Du får en lista på plagg i användarens garderob (med id) samt " +
      "ett önskemål om tillfälle/årstid. Föreslå EN sammanhållen outfit genom att välja ut ett litet " +
      "antal id:n från listan (max ett plagg per kategori om möjligt, t.ex. inte två byxor). " +
      "Svara ALLTID med enbart ett JSON-objekt, ingen annan text.",
    messages: [
      {
        role: "user",
        content:
          `Garderob:\n${itemList}\n\n${contextText}\n\n` +
          `Svara med JSON i exakt detta format:\n` +
          `{"title": "kort catchy titel på outfiten", ` +
          `"itemIds": ["id1", "id2", ...], ` +
          `"reasoning": "2-3 meningar på svenska om varför outfiten funkar för tillfället"}`,
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return extractJson<OutfitSuggestion>(text);
}
