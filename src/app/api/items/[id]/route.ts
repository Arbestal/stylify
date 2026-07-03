import { NextRequest, NextResponse } from "next/server";
import { getDb, ClothingItem } from "@/lib/db";
import { deleteImage } from "@/lib/storage";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = await getDb();
  const rows = (await sql`
    SELECT * FROM clothing_items WHERE id = ${id}
  `) as ClothingItem[];
  const item = rows[0];

  if (!item) {
    return NextResponse.json({ error: "Plagget hittades inte" }, { status: 404 });
  }

  await sql`DELETE FROM clothing_items WHERE id = ${id}`;
  await deleteImage(item.imagePath);

  return NextResponse.json({ ok: true });
}
