import { describe, expect, it } from "vitest";
import { getExamQuestion } from "@/lib/exam-questions";

describe("2019년 부동산학개론 12번 원문 보기", () => {
  it("ㄷ 지문과 가·나·다·라 보기를 분리해 유지한다", () => {
    const question = getExamQuestion("realestate", 2019, 12);
    expect(question).toBeDefined();
    expect(question?.items).toHaveLength(3);
    expect(question?.items.some((item) => item.text.includes("<보기>"))).toBe(false);
    expect(question?.referenceEntries).toEqual([
      { label: "가", text: "버제스(E. Burgess)의 동심원이론" },
      { label: "나", text: "레일리(W. Reilly)의 소매인력법칙" },
      { label: "다", text: "크리스탈러(W. Christaller)의 중심지이론" },
      { label: "라", text: "넬슨(R. Nelson)의 소매입지이론" },
    ]);
    expect(question?.correctChoice).toBe("3");
  });
});

describe("2021년 부동산학개론 13번 원문 분류", () => {
  it("선택지의 A·B·C를 원문 시장 유형과 연결한다", () => {
    const question = getExamQuestion("realestate", 2021, 13);
    expect(question?.leadEntries).toEqual([
      { label: "A", text: "약성 효율적 시장" },
      { label: "B", text: "준강성 효율적 시장" },
      { label: "C", text: "강성 효율적 시장" },
    ]);
    expect(question?.items.map((item) => item.key)).toEqual(["ㄱ", "ㄴ", "ㄷ"]);
    expect(question?.correctChoice).toBe("2");
  });
});

describe("2021년 부동산학개론 31번 원문 보기", () => {
  it("ㄱ·ㄴ·ㄷ과 짝지을 a~f 선택지를 모두 제공한다", () => {
    const question = getExamQuestion("realestate", 2021, 31);
    expect(question?.referenceEntries?.map(({ label, text }) => `${label}: ${text}`)).toEqual([
      "a: BTO(build-transfer-operate) 방식",
      "b: BOT(build-operate-transfer) 방식",
      "c: BTL(build-transfer-lease) 방식",
      "d: BLT(build-lease-transfer) 방식",
      "e: BOO(build-own-operate) 방식",
      "f: ROT(rehabilitate-operate-transfer) 방식",
    ]);
    expect(question?.correctChoice).toBe("4");
  });
});
