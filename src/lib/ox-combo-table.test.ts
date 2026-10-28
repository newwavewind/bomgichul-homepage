import { describe, expect, it } from "vitest";
import {
  getOxComboTable,
  jamoHeadersFromItems,
  splitOxCells,
} from "@/lib/ox-combo-table";

describe("splitOxCells", () => {
  it("splits spaced circle marks", () => {
    expect(splitOxCells("× × ○ ×")).toEqual(["×", "×", "○", "×"]);
  });

  it("normalizes latin O/X", () => {
    expect(splitOxCells("O X O X")).toEqual(["○", "×", "○", "×"]);
  });

  it("splits concatenated marks", () => {
    expect(splitOxCells("××○×")).toEqual(["×", "×", "○", "×"]);
  });

  it("splits slash-delimited marks", () => {
    expect(splitOxCells("× / × / ○ / ×")).toEqual(["×", "×", "○", "×"]);
  });

  it("rejects combination lists", () => {
    expect(splitOxCells("ㄱ, ㄴ")).toBeNull();
  });
});

describe("jamoHeadersFromItems", () => {
  it("reads ㄱ~ㄹ labels", () => {
    expect(
      jamoHeadersFromItems([
        { key: "ㄱ", label: "ㄱ" },
        { key: "ㄴ", label: "ㄴ" },
        { key: "ㄷ", label: "ㄷ" },
        { key: "ㄹ", label: "ㄹ" },
      ]),
    ).toEqual(["ㄱ", "ㄴ", "ㄷ", "ㄹ"]);
  });

  it("rejects numbered items", () => {
    expect(
      jamoHeadersFromItems([
        { key: "1", label: "①" },
        { key: "2", label: "②" },
      ]),
    ).toBeNull();
  });

  it("reads (가)~(라) labels from the 2021 지방직 행정법 5번 shape", () => {
    expect(
      jamoHeadersFromItems([
        { key: "가", label: "(가)" },
        { key: "나", label: "(나)" },
        { key: "다", label: "(다)" },
        { key: "라", label: "(라)" },
      ]),
    ).toEqual(["(가)", "(나)", "(다)", "(라)"]);
  });
});

describe("getOxComboTable", () => {
  it("builds the 2021 국가직 행정법 15번 table", () => {
    expect(
      getOxComboTable(
        ["ㄱ", "ㄴ", "ㄷ", "ㄹ"],
        ["× × ○ ×", "○ ○ × ○", "○ × ○ ×", "× × × ○"],
      ),
    ).toEqual({
      headers: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"],
      rows: [
        ["×", "×", "○", "×"],
        ["○", "○", "×", "○"],
        ["○", "×", "○", "×"],
        ["×", "×", "×", "○"],
      ],
    });
  });

  it("builds the 2021 지방직 행정법 5번 table", () => {
    expect(
      getOxComboTable(
        ["(가)", "(나)", "(다)", "(라)"],
        ["× × ○ ○", "○ ○ × ○", "○ × ○ ×", "× ○ ○ ×"],
      ),
    ).toEqual({
      headers: ["(가)", "(나)", "(다)", "(라)"],
      rows: [
        ["×", "×", "○", "○"],
        ["○", "○", "×", "○"],
        ["○", "×", "○", "×"],
        ["×", "○", "○", "×"],
      ],
    });
  });
});
