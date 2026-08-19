import type { Metadata } from "next";
import { ROBOTS_NOINDEX } from "@/lib/seo";

/** 글쓰기 화면은 검색결과에 뜰 이유가 없다. robots.txt 로 막으면 크롤러가
 *  이 지시를 읽지 못해 오히려 「내용 모르는 채 색인」 되므로 noindex 로 뺀다. */
export const metadata: Metadata = { robots: ROBOTS_NOINDEX };

import { CommunityWritePage } from "@/app/community/write/page";

export default function Page() {
  return <CommunityWritePage scope="english" />;
}
