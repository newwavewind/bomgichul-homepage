import type { Metadata } from "next";
import { CommunityPostDetailPage } from "@/app/community/[id]/page";
import { getPost } from "@/lib/posts";
import { CATEGORY_MAP, SITE_NAME } from "@/lib/constants";
import { absoluteUrl, ROBOTS_NOINDEX, truncateDescription } from "@/lib/seo";
import { communityBaseHref } from "@/lib/exam-track/community";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return {};

  const description = truncateDescription(post.content);
  const title = post.title;
  const categoryLabel = CATEGORY_MAP[post.category] ?? post.category;
  const canonicalPath = `${communityBaseHref("police")}/${id}`;
  const isAppOnlyCategory = post.category === "bug" || post.category === "feedback";

  return {
    title,
    description: `${categoryLabel} · ${description}`,
    alternates: { canonical: absoluteUrl(canonicalPath) },
    robots: isAppOnlyCategory ? ROBOTS_NOINDEX : undefined,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  return <CommunityPostDetailPage params={params} expectedScope="police" />;
}
