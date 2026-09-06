import { NextResponse } from "next/server";
import {
  ENGLISH_SYNTAX_CARDS,
  ENGLISH_SYNTAX_UNIT_MAP,
  getEnglishSyntaxCardsForUnit,
  type EnglishSyntaxCard,
} from "@/lib/english-syntax";
import { getUnitNote } from "@/data/english/syntax-notes";

/*
 * 구문 올인원의 쿼리 화면(단원 보기 ?unit= · 번호순 보기 ?view=number&page=)용 데이터.
 *
 * 페이지에서 searchParams 를 읽으면 그 페이지가 통째로 동적 렌더가 되어 CDN
 * 캐시가 죽고, 그렇다고 원본(2.7MB)을 클라이언트 번들에 담을 수도 없다.
 * 그래서 페이지는 정적(구문별 목차)으로 두고, 쿼리 화면이 필요한 조각만
 * 여기서 받아 간다. 전부 공개 로컬 데이터라 쿠키가 필요 없고 CDN 캐시를 허용한다.
 */

const PAGE_SIZE = 50;

// 목록에는 문장 한 줄만 싣는다 — 전문(끊어읽기·문법·어휘)은 상세 페이지 몫이다.
function toSummary(card: EnglishSyntaxCard) {
  return { id: card.id, no: card.no, sentence: card.sentence, seriesLabel: card.seriesLabel };
}

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const unitId = searchParams.get("unit");

  if (unitId) {
    const mapped = ENGLISH_SYNTAX_UNIT_MAP.get(unitId);
    if (!mapped) {
      return NextResponse.json(
        { error: "unit not found" },
        { status: 404, headers: { "cache-control": CACHE_CONTROL } },
      );
    }
    const { group, unit } = mapped;
    const cards = getEnglishSyntaxCardsForUnit(unit.id);
    const note = getUnitNote(unit.id);
    const focuses = [...new Set(cards.flatMap((card) => card.focus ?? []))];
    return NextResponse.json(
      {
        kind: "unit",
        group: { no: group.no, name: group.name },
        unit: { id: unit.id, name: unit.name, desc: unit.desc },
        note: note ? { title: String(note.title), summary: String(note.summary) } : null,
        focuses,
        cards: cards.map(toSummary),
      },
      { headers: { "cache-control": CACHE_CONTROL } },
    );
  }

  const pages = Math.ceil(ENGLISH_SYNTAX_CARDS.length / PAGE_SIZE);
  const page = Math.min(Math.max(1, Number(searchParams.get("page")) || 1), pages);
  return NextResponse.json(
    {
      kind: "number",
      page,
      pages,
      cards: ENGLISH_SYNTAX_CARDS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(toSummary),
    },
    { headers: { "cache-control": CACHE_CONTROL } },
  );
}
