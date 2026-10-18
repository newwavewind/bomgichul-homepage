/**
 * Public product visibility switches.
 *
 * Keep exam data and routes intact so a product can be restored without a data
 * migration. Every public entry point should consult this helper instead.
 */
const PUBLIC_EXAM_VISIBILITY: Readonly<Record<string, boolean>> = {
  history: false,
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
