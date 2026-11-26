import { describe, expect, it, vi } from "vitest";
import { GET as record } from "@/app/api/pc-access/history-library/route";
import { GET as media } from "@/app/api/pc-access/history-figures/[file]/route";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HistoryLibrary } from "@/components/history/library/HistoryLibrary";
import { findHistoryRecord, getHistoryCatalogue } from "./history-library";
import { getPcViewer } from "./pc-access/session";
import { hasPcPro } from "./pc-access/pro";

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
  const figure = () => media(original, { params: Promise.resolve({ file: "saryo-gojoseon-8jo-1.svg" }) });

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
    const material = renderToStaticMarkup(createElement(HistoryLibrary, { catalogue, initialView: "sources", initialRecord: source }));
    const profile = renderToStaticMarkup(createElement(HistoryLibrary, { catalogue, initialView: "people", initialRecord: person }));
    expect(material).toContain('aria-label="사료 모음집 목록"');
    expect(material).toContain("고조선의 범금 8조");
    expect(material).toContain("이 사료가 나온 기출");
    expect(profile).toContain('aria-label="인물 사전 목록"');
    expect(profile).toContain("세종 인물 카드");
    expect(profile).toContain("왕실 관계");
  }, 20000);

  it("한국사 심화 구매의 권한을 본문과 이미지 요청 양쪽에서 확인한다", async () => {
    vi.mocked(getPcViewer).mockResolvedValue(null);
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
