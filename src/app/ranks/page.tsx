import type { Metadata } from "next";
import { OceanRankShowcase } from "@/components/ranks/OceanRankShowcase";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "바다 레벨",
  description: "플랑크톤부터 흰수염고래까지, 봄기출 활동 점수로 성장하는 20단계 바다 레벨을 확인하세요.",
  path: "/ranks",
});

export default function RanksPage() {
  return <OceanRankShowcase />;
}
