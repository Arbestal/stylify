import { put, del } from "@vercel/blob";
import { randomUUID } from "crypto";

/**
 * Uploads a data URL (e.g. "data:image/jpeg;base64,...") to Vercel Blob and
 * returns its public URL plus the raw base64 payload (needed for the Claude
 * vision call, which wants the bytes directly rather than a fetchable URL).
 */
export async function saveDataUrlImage(
  subdir: "items" | "person",
  dataUrl: string
): Promise<{ publicPath: string; base64: string; mediaType: string }> {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    throw new Error("Ogiltig bilddata");
  }
  const mediaType = match[1];
  const base64 = match[2];
  const ext = mediaType.split("/")[1] || "jpg";

  const blob = await put(`${subdir}/${randomUUID()}.${ext}`, Buffer.from(base64, "base64"), {
    access: "public",
    contentType: mediaType,
  });

  return {
    publicPath: blob.url,
    base64,
    mediaType,
  };
}

export async function deleteImage(publicPath: string) {
  await del(publicPath);
}
