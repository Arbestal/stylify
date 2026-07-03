import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb, ClothingItem } from "@/lib/db";
import { saveDataUrlImage } from "@/lib/storage";
import { classifyClothingItem } from "@/lib/anthropic";

export async function GET() {
  const sql = await getDb();
  const items = (await sql`
    SELECT * FROM clothing_items ORDER BY "createdAt" DESC
  `) as ClothingItem[];
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body as { image: string };
    if (!image) {
      return NextResponse.json({ error: "Ingen bild skickades" }, { status: 400 });
    }

    const { publicPath, base64, mediaType } = await saveDataUrlImage("items", image);
    const classification = await classifyClothingItem(base64, mediaType);

    const item: ClothingItem = {
      id: randomUUID(),
      imagePath: publicPath,
      category: classification.category,
      colors: classification.colors,
      season: classification.season,
      style: classification.style,
      description: classification.description,
      createdAt: Date.now(),
    };

    const sql = await getDb();
    await sql`
      INSERT INTO clothing_items (id, "imagePath", category, colors, season, style, description, "createdAt")
      VALUES (${item.id}, ${item.imagePath}, ${item.category}, ${item.colors}, ${item.season}, ${item.style}, ${item.description}, ${item.createdAt})
    `;

    return NextResponse.json({ item });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
