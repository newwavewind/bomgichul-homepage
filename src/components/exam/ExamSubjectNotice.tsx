/**
 * 과목 공통 전제 — 시험지가 과목 첫머리에 한 번 적는 안내문(감정평가사 회계학:
 * 「회계기간 1월 1일~12월 31일 · K-IFRS 적용 · 법인세 언급이 없으면 법인세 효과 무시」).
 *
 * 계산 문항의 답이 이 전제에 달려 있다. 앱(`StemWithMaterialBox`)과 같이 문항 위에
 * 접어 두고, 펼치면 전문을 보인다. 접혀 있어도 본문은 HTML 에 있어 검색이 읽는다.
 */
export function ExamSubjectNotice({ notice, className = "" }: { notice?: string; className?: string }) {
  const text = notice?.trim();
  if (!text) return null;
  return (
    <details className={`group max-w-3xl rounded-xl border border-mist bg-snow px-4 py-2.5 ${className}`.trim()}>
      <summary className="cursor-pointer select-none font-display text-[13px] font-semibold text-smoke">
        과목 공통 전제 보기
      </summary>
      <p className="mt-2 whitespace-pre-line break-words font-display text-body-sm leading-relaxed text-ink">{text}</p>
    </details>
  );
}
