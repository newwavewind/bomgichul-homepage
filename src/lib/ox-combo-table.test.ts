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
});
