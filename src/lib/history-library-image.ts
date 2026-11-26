import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

const directory = path.join(process.cwd(), "data/history-library/media");

const mediaTypes: Record<string, string> = {
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml",
};

export async function readHistoryLibraryImage(file: string) {
  const type = mediaTypes[path.extname(file).toLowerCase()];
  if (!type || !/^[a-z0-9][a-z0-9_.-]+$/i.test(file)) return null;
  try {
    const bytes = await readFile(path.join(directory, file));
    return { bytes: new Uint8Array(bytes), type };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
