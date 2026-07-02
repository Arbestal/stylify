import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db, { ClothingItem } from "@/lib/db";
import { saveDataUrlImage } from "@/lib/storage";
import { classifyClothingItem } from "@/lib/anthropic";

export async function GET() {
  const items = db
    .prepare("SELECT * FROM clothing_items ORDER BY createdAt DESC")
    .all() as ClothingItem[];
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body as { image: string };
    if (!image) {
      return NextResponse.json({ error: "Ingen bild skickades" }, { status: 400 });
    }

    const { publicPath, base64, mediaType } = saveDataUrlImage("items", image);
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

    db.prepare(
      `INSERT INTO clothing_items (id, imagePath, category, colors, season, style, description, createdAt)
       VALUES (@id, @imagePath, @category, @colors, @season, @style, @description, @createdAt)`
    ).run(item);

    return NextResponse.json({ item });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
