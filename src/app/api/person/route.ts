import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db, { PersonPhoto } from "@/lib/db";
import { saveDataUrlImage } from "@/lib/storage";

export async function GET() {
  const photos = db
    .prepare("SELECT * FROM person_photos ORDER BY createdAt DESC")
    .all() as PersonPhoto[];
  return NextResponse.json({ photos });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, angle } = body as { image: string; angle: string };
    if (!image) {
      return NextResponse.json({ error: "Ingen bild skickades" }, { status: 400 });
    }

    const { publicPath } = saveDataUrlImage("person", image);

    const photo: PersonPhoto = {
      id: randomUUID(),
      imagePath: publicPath,
      angle: angle || "okänd vinkel",
      createdAt: Date.now(),
    };

    db.prepare(
      `INSERT INTO person_photos (id, imagePath, angle, createdAt)
       VALUES (@id, @imagePath, @angle, @createdAt)`
    ).run(photo);

    return NextResponse.json({ photo });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
