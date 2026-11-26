import "server-only";
import { hasPcPro } from "@/lib/pc-access/pro";
import { getPcViewer } from "@/lib/pc-access/session";

const historyOffer = "history-history";

export async function historyLibraryAccess() {
  try {
    const viewer = await getPcViewer();
    if (!viewer) return "login";
    return await hasPcPro(viewer.id, historyOffer, viewer.beta) ? "granted" : "connect";
  } catch {
    return "unavailable";
  }
}
