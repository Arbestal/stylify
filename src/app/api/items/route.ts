import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { getDb, ClothingItem } from "@/lib/db";
import { saveDataUrlImage } from "@/lib/storage";
import { classifyClothingItem } from "@/lib/anthropic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const sql = await getDb();
  const items = (await sql`
    SELECT * FROM clothing_items WHERE "userId" = ${userId} ORDER BY "createdAt" DESC
  `) as ClothingItem[];
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
    }

    const body = await req.json();
    const { image } = body as { image: string };
    if (!image) {
      return NextResponse.json({ error: "Ingen bild skickades" }, { status: 400 });
    }

    const { publicPath, base64, mediaType } = await saveDataUrlImage("items", image);
    const classification = await classifyClothingItem(base64, mediaType);

    const item: ClothingItem = {
      id: randomUUID(),
      userId,
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
      INSERT INTO clothing_items (id, "userId", "imagePath", category, colors, season, style, description, "createdAt")
      VALUES (${item.id}, ${item.userId}, ${item.imagePath}, ${item.category}, ${item.colors}, ${item.season}, ${item.style}, ${item.description}, ${item.createdAt})
    `;

    return NextResponse.json({ item });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
