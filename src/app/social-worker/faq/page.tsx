import type { Metadata } from "next";
import { FaqBoard } from "@/app/faq/page";
import { buildPageMetadata } from "@/lib/seo";
import { faqTitle } from "@/lib/exam-track/community";
import { faqDescription } from "@/lib/exam-track/faq";

export const metadata: Metadata = buildPageMetadata({
  title: faqTitle("social_worker"),
  description: faqDescription("social_worker"),
  path: "/social-worker/faq",
});

export default async function Page() {
  return <FaqBoard scope="social_worker" />;
}
