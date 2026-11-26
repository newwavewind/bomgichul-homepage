import { findHistoryRecord, historyLibraryAccess } from "@/lib/history-library";
import { pcJson } from "@/lib/pc-access/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind");
  const id = searchParams.get("id");
  if ((kind !== "sources" && kind !== "people") || !id || id.length > 160) {
    return pcJson({ error: "열려는 사료나 인물을 확인해 주세요." }, 400);
  }
  const access = await historyLibraryAccess();
  if (access === "login") return pcJson({ error: "로그인해 주세요." }, 401);
  if (access === "connect") return pcJson({ error: "한국사 심화 구매를 연결해 주세요." }, 403);
  if (access === "unavailable") return pcJson({ error: "잠시 후 다시 시도해 주세요." }, 503);
  const record = await findHistoryRecord(kind, id);
  return record ? pcJson(record) : pcJson({ error: "이 항목을 찾지 못했어요." }, 404);
}
