import { historyLibraryAccess } from "@/lib/history-library-access";
import type { Metadata } from "next";
import Link from "next/link";
import { getHistoryCatalogue, findHistoryRecord } from "@/lib/history-library";
import { libraryView } from "@/lib/history-library-model";
import { HistoryLibrary } from "@/components/history/library/HistoryLibrary";
import { historyLibraryLinks } from "@/components/history/library/HistoryLibraryLinks";
import "@/components/history/library/history-library.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "한국사 사료 모음집·인물 사전", robots: { index: false, follow: true } };

type Props = { searchParams: Promise<{ view?: string; id?: string }> };
export default async function HistoryLibraryPage({ searchParams }: Props) {
  const { view: requestedView, id } = await searchParams;
  const view = libraryView(requestedView);
  const access = await historyLibraryAccess();
  const title = view === "sources" ? "사료 모음집" : "인물 사전";
  const returnPath = "/history/library?" + new URLSearchParams({ view, ...(id ? { id } : {}) });

  if (access !== "granted") {
    return <div className="history-library sry">
      <Link href="/history" className="hl-back">‹ 한국사 기출문제</Link>
      <header className="hl-heading"><h1>{title}</h1><span className="pc-access-pro">Pro</span></header>
      <nav className="hl-view-tabs" aria-label="한국사 Pro 학습 자료">
        {historyLibraryLinks.map(({ key, href, title }) => <Link key={key} href={href} aria-current={key === view ? "page" : undefined}>{title}</Link>)}
      </nav>
      <section className="hl-gate" aria-label="한국사 Pro 구매 연동">
        <h2>{access === "unavailable" ? "구매 연결을 확인하는 중 문제가 생겼어요" : "한국사 심화 앱 구매를 연결해 주세요"}</h2>
        <p>{access === "unavailable" ? "잠시 뒤 다시 열어 주세요." : "사료 원문과 풀이, 인물 사전은 앱에서 구매한 한국사 심화 학습권을 연결하면 열려요."}</p>
        {access === "login" && <Link href={"/login?next=" + encodeURIComponent(returnPath)}>로그인하고 연결하기</Link>}
        {access === "connect" && <Link href="/pc-pro/history?subject=history-history#history-pc-plan">한국사 심화 구매 연결</Link>}
        {access === "unavailable" && <a href={returnPath}>다시 열기</a>}
      </section>
    </div>;
  }

  const catalogue = await getHistoryCatalogue();
  const kind = view === "people" ? "people" : "sources";
  const initialRecord = view === "dynasties" ? null : await findHistoryRecord(kind, id ?? catalogue[kind][0]?.id ?? "")
    ?? await findHistoryRecord(kind, catalogue[kind][0]?.id ?? "");
  return <HistoryLibrary catalogue={catalogue} initialView={view} initialRecord={initialRecord} initialId={id}/>;
}
