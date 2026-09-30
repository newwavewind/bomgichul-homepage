import { StudyTools } from "@/components/web-study/StudyTools";
import { buildPageMetadata } from "@/lib/seo";
export const metadata = {
  ...buildPageMetadata({
    title: "나의 웹 학습 도구",
    description: "주간 보고서, 시험일까지 학습 계획, 오답 요약집",
    path: "/study-tools",
  }),
  robots: { index: false, follow: true },
};
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">나의 웹 학습 도구</h1>
      <StudyTools />
    </div>
  );
}
