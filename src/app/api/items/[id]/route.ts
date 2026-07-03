import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb, ClothingItem } from "@/lib/db";
import { deleteImage } from "@/lib/storage";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const { id } = await params;
  const sql = await getDb();
  const rows = (await sql`
    SELECT * FROM clothing_items WHERE id = ${id} AND "userId" = ${userId}
  `) as ClothingItem[];
  const item = rows[0];

  if (!item) {
    return NextResponse.json({ error: "Plagget hittades inte" }, { status: 404 });
  }

  await sql`DELETE FROM clothing_items WHERE id = ${id} AND "userId" = ${userId}`;
  await deleteImage(item.imagePath);

  return NextResponse.json({ ok: true });
}
