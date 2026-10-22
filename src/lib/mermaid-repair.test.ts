import { describe, expect, it } from "vitest";
import { looksLikeMermaid, repairMermaid } from "@/lib/mermaid-repair";

describe("repairMermaid", () => {
  it("flow 첫 줄을 flowchart 로", () => {
    expect(repairMermaid("flow\n  A[가] --> B[나]").split("\n")[0]).toBe("flowchart TD");
  });
  it("괄호·별표 든 이름은 따옴표, 영문 아닌 id 는 바꾼다", () => {
    const out = repairMermaid("graph LR\n  P1((P*)_1) & Q1((Q*)_1) --> 교점1");
    expect(out).toContain('P1("(P*)_1")');
    expect(out).toContain("k1[교점1]");
  });
  it("올바른 흐름도는 그대로", () => {
    const ok = "graph TD\n  A[부동산업] --> B[임대업]\n  A -->|예| C{판단}";
    expect(repairMermaid(ok)).toBe(ok);
    expect(looksLikeMermaid("const a = 1")).toBe(false);
  });
});
