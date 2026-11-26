import { describe, expect, it, vi } from "vitest";
import { GET as record } from "@/app/api/pc-access/history-library/route";
import { GET as media } from "@/app/api/pc-access/history-figures/[file]/route";
import { GET as questionPreview } from "@/app/api/history/question-preview/route";
import { GET as sourcePreview } from "@/app/api/exam-sources/route";
import HistoryLibraryPage from "@/app/history/library/page";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HistoryLibrary } from "@/components/history/library/HistoryLibrary";
import { findHistoryRecord, getHistoryCatalogue } from "./history-library";
import { historyPreviewIds } from "./history-library-access";
import { sourcePreviewKey } from "./exam-source-preview";
import { getPcViewer } from "./pc-access/session";
import { hasPcPro } from "./pc-access/pro";
import { readPcGlossary, readPcGlossaryLabels } from "./pc-access/question-study";

vi.mock("server-only", () => ({}));
vi.mock("./pc-access/session", async importOriginal => ({
  ...await importOriginal<typeof import("./pc-access/session")>(),
  getPcViewer: vi.fn(),
}));
vi.mock("./pc-access/pro", () => ({ hasPcPro: vi.fn() }));

describe("한국사 Pro 학습 자료", () => {
  const endpoint = "http://localhost/api/pc-access/history-library";
  const viewer = { id: "test-user", sessionId: "test-session", beta: false, label: "테스트 계정" };
  const original = new Request(endpoint + "?kind=sources&id=saryo-gojoseon-8jo");
  const figure = (file = "saryo-gojoseon-8jo-1.svg") => media(original, { params: Promise.resolve({ file }) });
  const recordRequest = (kind: string, id: string) => new Request(endpoint + "?" + new URLSearchParams({ kind, id }));
  const openPage = async (view: string, id?: string) => renderToStaticMarkup(await HistoryLibraryPage({ searchParams: Promise.resolve({ view, id }) }));

  it("사료, 인물, 왕조를 앱 정본에서 가져오고 중복 ID가 없다", async () => {
    const catalogue = await getHistoryCatalogue();
    expect(catalogue.sources).toHaveLength(662);
    expect(catalogue.people).toHaveLength(840);
    expect(catalogue.dynasties).toHaveLength(63);
    for (const entries of [catalogue.sources, catalogue.people, catalogue.dynasties]) {
      expect(new Set(entries.map(({ id }) => id)).size).toBe(entries.length);
    }
  });

  it("구매한 독자의 목록과 첫 상세 자료를 함께 그린다", async () => {
    const catalogue = await getHistoryCatalogue();
    const source = await findHistoryRecord("sources", "saryo-gojoseon-8jo");
    const person = await findHistoryRecord("people", "joseon-sejong");
    const material = renderToStaticMarkup(createElement(HistoryLibrary, { catalogue, access: "granted", initialView: "sources", initialRecord: source }));
    const profile = renderToStaticMarkup(createElement(HistoryLibrary, { catalogue, access: "granted", initialView: "people", initialRecord: person }));
    expect(material).toContain('aria-label="사료 모음집 목록"');
    expect(material).toContain("고조선의 범금 8조");
    expect(material).toContain("이 사료가 나온 기출");
    expect(profile).toContain('aria-label="인물 사전 목록"');
    expect(profile).toContain("세종 인물 카드");
    expect(profile).toContain("왕실 관계");
  }, 20000);

  it("비로그인에게 전체 목록과 처음 열 개의 본문·이미지를 제공한다", async () => {
    vi.mocked(getPcViewer).mockResolvedValue(null);
    const catalogue = await getHistoryCatalogue();
    for (const kind of ["sources", "people"] as const) {
      expect(historyPreviewIds[kind]).toEqual(catalogue[kind].slice(0, 10).map(({ id }) => id));
      for (const id of historyPreviewIds[kind]) {
        const response = await record(recordRequest(kind, id));
        expect(response.status).toBe(200);
        const item = await response.json();
        expect(item.id).toBe(id);
        if (kind === "sources") {
          for (const image of item.images) expect((await figure(image.file.split("/").at(-1))).status).toBe(200);
        }
      }
      expect((await record(recordRequest(kind, catalogue[kind][10].id))).status).toBe(401);
    }

    const sourcePage = await openPage("sources");
    expect(sourcePage).toContain("662건");
    expect(sourcePage).toContain('aria-label="연천 전곡리 주먹도끼"');
    expect(sourcePage).toContain("반달 돌칼");
    expect(sourcePage).not.toContain("처음 10개 무료");
    const personPage = await openPage("people");
    expect(personPage).toContain("840명");
    expect(personPage).toContain('aria-label="단군왕검 인물 카드"');
    const locked = await openPage("sources", catalogue.sources[10].id);
    expect(locked).toContain("로그인하고 Pro 연결");
    expect(locked).not.toContain('aria-label="반달 돌칼"');
    expect((await figure("saryo-bandal-dolkal-1.webp")).status).toBe(401);
  }, 20000);

  it("왕조 계보 목록은 공개하고 실제 재위 순서는 Pro 연결 후 그린다", async () => {
    vi.mocked(getPcViewer).mockResolvedValue(null);
    const guest = await openPage("dynasties", "joseon");
    expect(guest).toContain("왕조 계보 목록");
    expect(guest).toContain("로그인하고 Pro 연결");
    expect(guest).not.toContain("1392–1398");

    vi.mocked(getPcViewer).mockResolvedValue(viewer);
    vi.mocked(hasPcPro).mockResolvedValue(true);
    const pro = await openPage("dynasties", "joseon");
    expect(pro).toContain('aria-label="조선 계보"');
    expect(pro).toContain("기출 연결 왕");
    expect(pro).toContain("1392–1398");
    expect(pro).toContain('aria-keyshortcuts="ArrowRight"');
  }, 20000);

  it("관련 기출에서 시험지 자료와 정답, 선지별 해설을 받는다", async () => {
    const href = "/history/exam/simhwa/2024/" + encodeURIComponent("제70회") + "/37";
    const request = (href: string) => new Request("http://localhost/api/history/question-preview?" + new URLSearchParams({ href }));
    const response = await questionPreview(request(href));
    expect(response.status).toBe(200);
    const question = await response.json();
    expect(question.material.image).toBe("/exam/history/70/q37.webp");
    expect(question.correctChoice).toBe(5);
    expect(question.items).toHaveLength(5);
    expect(question.items[4].explanation).toContain("대종교");
    expect(question.items[4].sources.length).toBeGreaterThan(0);
    expect(question.glossaryByChoice[2].terms).toContain("사찰령");
    expect(question.glossaryPro.offers[0].id).toBe("history-history");
    expect((await questionPreview(request("/exam/civillaw/2025/41"))).status).toBe(400);
  });

  it("74회 2번을 실제 웹 주소로 앱 용어 사전과 연결한다", async () => {
    const href = "/history/exam/simhwa/2025/" + encodeURIComponent("제74회") + "/2";
    expect((await readPcGlossaryLabels(href))[4]).toContain("책화");
    const glossary = await readPcGlossary("history-history", href);
    expect(glossary?.terms[4].find(item => item.term === "책화")).toMatchObject({ hanja: "責禍" });
  });

  it("한국사 근거 요약과 기존 조문을 같은 펼치기 요청에서 제공한다", async () => {
    const urls = ["https://encykorea.aks.ac.kr/Article/E0003901", "https://www.law.go.kr/법령/민법/제103조"];
    const keys = urls.map(href => sourcePreviewKey(href, ""));
    expect(keys).toEqual(["aks:E0003901", "law:민법|제103조"]);
    const query = new URLSearchParams(keys.map(key => ["key", key ?? ""]));
    const response = await sourcePreview(new Request("http://localhost/api/exam-sources?" + query));
    expect(response.status).toBe(200);
    const { previews } = await response.json();
    expect(previews["aks:E0003901"]).toMatchObject({ summary: true, url: urls[0] });
    expect(previews["aks:E0003901"].lines.join(" ")).toContain("화순");
    expect(previews["law:민법|제103조"].lines.length).toBeGreaterThan(0);
  });

  it("한국사 심화 구매의 권한을 본문과 이미지 요청 양쪽에서 확인한다", async () => {
    vi.mocked(getPcViewer).mockResolvedValue(null);
    vi.mocked(hasPcPro).mockClear();
    expect((await record(original)).status).toBe(401);
    expect((await figure()).status).toBe(401);
    expect(hasPcPro).not.toHaveBeenCalled();

    vi.mocked(getPcViewer).mockResolvedValue(viewer);
    vi.mocked(hasPcPro).mockResolvedValue(false);
    expect((await record(original)).status).toBe(403);
    expect((await figure()).status).toBe(403);
    expect(hasPcPro).toHaveBeenLastCalledWith(viewer.id, "history-history", false);

    vi.mocked(hasPcPro).mockResolvedValue(true);
    const source = await record(original);
    const person = await record(new Request(endpoint + "?kind=people&id=joseon-sejong"));
    const image = await figure();
    expect(source.headers.get("cache-control")).toBe("private, no-store");
    expect(person.headers.get("cache-control")).toBe("private, no-store");
    expect(image.headers.get("cache-control")).toBe("private, no-store");
    expect((await source.json()).original.text).toBeTruthy();
    expect((await person.json()).books.aks.sections.length).toBeGreaterThan(0);
    expect(image.headers.get("content-type")).toBe("image/svg+xml");
    expect((await media(original, { params: Promise.resolve({ file: "../records.json.gz" }) })).status).toBe(404);
  }, 20000);
});
