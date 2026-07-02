import { NextRequest, NextResponse } from "next/server";
import db, { ClothingItem } from "@/lib/db";
import { deleteImage } from "@/lib/storage";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = db
    .prepare("SELECT * FROM clothing_items WHERE id = ?")
    .get(id) as ClothingItem | undefined;

  if (!item) {
    return NextResponse.json({ error: "Plagget hittades inte" }, { status: 404 });
  }

  db.prepare("DELETE FROM clothing_items WHERE id = ?").run(id);
  deleteImage(item.imagePath);

  return NextResponse.json({ ok: true });
}
