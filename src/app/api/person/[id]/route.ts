import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb, PersonPhoto } from "@/lib/db";
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
    SELECT * FROM person_photos WHERE id = ${id} AND "userId" = ${userId}
  `) as PersonPhoto[];
  const photo = rows[0];

  if (!photo) {
    return NextResponse.json({ error: "Bilden hittades inte" }, { status: 404 });
  }

  await sql`DELETE FROM person_photos WHERE id = ${id} AND "userId" = ${userId}`;
  await deleteImage(photo.imagePath);

  return NextResponse.json({ ok: true });
}
