import type { Metadata } from "next";
import { FaqBoard } from "@/app/faq/page";
import { buildPageMetadata } from "@/lib/seo";
import { faqTitle } from "@/lib/exam-track/community";
import { faqDescription } from "@/lib/exam-track/faq";

export const metadata: Metadata = buildPageMetadata({
  title: faqTitle("nomusa"),
  description: faqDescription("nomusa"),
  path: "/nomusa/faq",
});

export default async function Page() {
  return <FaqBoard scope="nomusa" />;
}
