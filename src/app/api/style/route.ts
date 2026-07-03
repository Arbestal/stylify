import { NextRequest, NextResponse } from "next/server";
import { getDb, ClothingItem } from "@/lib/db";
import { generateOutfitSuggestion } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { occasion, season, freeform } = body as {
      occasion: string;
      season: string;
      freeform: string;
    };

    const sql = await getDb();
    const items = (await sql`
      SELECT * FROM clothing_items ORDER BY "createdAt" DESC
    `) as ClothingItem[];

    const suggestion = await generateOutfitSuggestion(items, {
      occasion: occasion || "",
      season: season || "",
      freeform: freeform || "",
    });

    const chosenItems = suggestion.itemIds
      .map((id) => items.find((item) => item.id === id))
      .filter((item): item is ClothingItem => Boolean(item));

    return NextResponse.json({
      title: suggestion.title,
      reasoning: suggestion.reasoning,
      items: chosenItems,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
