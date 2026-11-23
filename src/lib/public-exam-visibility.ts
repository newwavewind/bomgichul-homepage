/**
 * Public product visibility switches.
 *
 * Keep exam data and routes intact so a product can be restored without a data
 * migration. Every public entry point should consult this helper instead.
 *
 * 항목이 없으면 공개(true). 잠깐 가릴 시험만 여기에 false 로 적는다.
 */
const PUBLIC_EXAM_VISIBILITY: Readonly<Record<string, boolean>> = {
  // 한국사능력검정 — 다시 공개(2026-11-09). 가릴 일이 있으면 false 로 바꾼다.
  history: true,
};

export function isPublicExamVisible(slug: string): boolean {
  return PUBLIC_EXAM_VISIBILITY[slug] ?? true;
}

export function isPublicExamPathVisible(pathname: string): boolean {
  const slug = pathname.split("/").filter(Boolean)[0];
  return slug ? isPublicExamVisible(slug) : true;
}

export function isPublicCommunityScopeVisible(scope: string): boolean {
  return isPublicExamVisible(scope === "history" ? "history" : scope.replaceAll("_", "-"));
}
