import type { Metadata } from "next";
import { FaqBoard } from "@/app/faq/faq-board";
import { buildPageMetadata } from "@/lib/seo";
import { faqTitle } from "@/lib/exam-track/community";
import { faqDescription } from "@/lib/exam-track/faq";

export const metadata: Metadata = buildPageMetadata({
  title: faqTitle("firefighter"),
  description: faqDescription("firefighter"),
  path: "/firefighter/faq",
});

export default async function Page() {
  return <FaqBoard scope="firefighter" />;
}
