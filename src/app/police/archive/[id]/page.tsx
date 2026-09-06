import type { Metadata } from "next";
import { ArchivePostDetailPage } from "@/app/archive/[id]/page";
import { getArchivePost } from "@/lib/archive";
import { absoluteUrl, truncateDescription } from "@/lib/seo";
import { ARCHIVE_RESOURCE_TYPE_MAP, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import { archiveBaseHref } from "@/lib/exam-track/community";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getArchivePost(id);
  if (!post) return {};
  const description = truncateDescription(post.content);
  const subjectLabel = post.subject ? ARCHIVE_SUBJECT_MAP[post.subject] : null;
  const typeLabel = post.resource_type
    ? ARCHIVE_RESOURCE_TYPE_MAP[post.resource_type]
    : null;
  const prefix = [subjectLabel, typeLabel].filter(Boolean).join(" ");
  const base = archiveBaseHref("police");
  return {
    title: post.title,
    description: prefix ? `${prefix} · ${description}` : description,
    alternates: { canonical: absoluteUrl(`${base}/${id}`) },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`${base}/${id}`),
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "article",
      // 레이아웃의 og 이미지는 세그먼트 openGraph 정의에 통째로 덮인다 — 다시 넣는다.
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function Page({ params }: Props) {
  return <ArchivePostDetailPage params={params} expectedScope="police" />;
}
