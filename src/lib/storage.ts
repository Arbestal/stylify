import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadsRoot = path.join(process.cwd(), "public", "uploads");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Saves a data URL (e.g. "data:image/jpeg;base64,...") to disk under
 * public/uploads/<subdir>/ and returns the public path plus raw base64 data.
 */
export function saveDataUrlImage(
  subdir: "items" | "person",
  dataUrl: string
): { publicPath: string; base64: string; mediaType: string } {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    throw new Error("Ogiltig bilddata");
  }
  const mediaType = match[1];
  const base64 = match[2];
  const ext = mediaType.split("/")[1] || "jpg";

  const dir = path.join(uploadsRoot, subdir);
  ensureDir(dir);

  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));

  return {
    publicPath: `/uploads/${subdir}/${filename}`,
    base64,
    mediaType,
  };
}

export function deleteImage(publicPath: string) {
  const filePath = path.join(process.cwd(), "public", publicPath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
