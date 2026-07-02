import { NextRequest, NextResponse } from "next/server";
import db, { PersonPhoto } from "@/lib/db";
import { deleteImage } from "@/lib/storage";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const photo = db
    .prepare("SELECT * FROM person_photos WHERE id = ?")
    .get(id) as PersonPhoto | undefined;

  if (!photo) {
    return NextResponse.json({ error: "Bilden hittades inte" }, { status: 404 });
  }

  db.prepare("DELETE FROM person_photos WHERE id = ?").run(id);
  deleteImage(photo.imagePath);

  return NextResponse.json({ ok: true });
}
