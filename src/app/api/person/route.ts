import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb, PersonPhoto } from "@/lib/db";
import { saveDataUrlImage } from "@/lib/storage";

export async function GET() {
  const sql = await getDb();
  const photos = (await sql`
    SELECT * FROM person_photos ORDER BY "createdAt" DESC
  `) as PersonPhoto[];
  return NextResponse.json({ photos });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, angle } = body as { image: string; angle: string };
    if (!image) {
      return NextResponse.json({ error: "Ingen bild skickades" }, { status: 400 });
    }

    const { publicPath } = await saveDataUrlImage("person", image);

    const photo: PersonPhoto = {
      id: randomUUID(),
      imagePath: publicPath,
      angle: angle || "okänd vinkel",
      createdAt: Date.now(),
    };

    const sql = await getDb();
    await sql`
      INSERT INTO person_photos (id, "imagePath", angle, "createdAt")
      VALUES (${photo.id}, ${photo.imagePath}, ${photo.angle}, ${photo.createdAt})
    `;

    return NextResponse.json({ photo });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
