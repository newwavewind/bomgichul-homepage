import type { Metadata } from "next";
import { KakaoShareBridge } from "@/components/daily/KakaoShareButton";

export const metadata: Metadata = {
  title: "카카오톡 공유",
  robots: { index: false, follow: false },
};

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return (
    <KakaoShareBridge
      title={one(params.title)}
      description={one(params.description)}
      imageUrl={one(params.imageUrl)}
      path={one(params.path)}
    />
  );
}
