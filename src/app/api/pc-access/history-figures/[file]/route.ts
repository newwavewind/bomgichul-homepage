import { historyLibraryAccess, isHistoryPreviewImage } from "@/lib/history-library-access";
import { readHistoryLibraryImage } from "@/lib/history-library-image";

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const access = isHistoryPreviewImage(file) ? "granted" : await historyLibraryAccess();
  const headers = { "Cache-Control": "private, no-store" };
  if (access !== "granted") {
    return new Response(null, { status: access === "login" ? 401 : access === "connect" ? 403 : 503, headers });
  }
  const image = await readHistoryLibraryImage(file);
  if (!image) return new Response(null, { status: 404, headers });
  return new Response(image.bytes, {
    headers: {
      ...headers,
      "Content-Type": image.type,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data:",
    },
  });
}
