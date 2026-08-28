import AdminAiExplanationsPage from "../ai-explanations/page";

/**
 * 「바로바로 AI 개념」만 모아 보는 화면.
 *
 * 해설과 개념은 같은 표(`ai_explanation_log`)에 쌓인다 — 앱이 둘 다 같은 함수로
 * 만들기 때문이다. 다만 개념은 `exam_id` 가 `concept:{slug}` 로 와서 가를 수 있다.
 *
 * 화면을 베껴 두 벌로 두면 한쪽만 고쳐지는 날이 오므로, 해설 화면을 그대로 쓰고
 * 무엇을 볼지(`kind`)와 링크가 돌아갈 곳(`basePath`)만 바꿔 넘긴다.
 */
export default function AdminAiConceptsPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; exam?: string; item?: string; date?: string }>;
}) {
  return (
    <AdminAiExplanationsPage
      searchParams={searchParams}
      kind="concept"
      basePath="/admin/ai-concepts"
    />
  );
}
