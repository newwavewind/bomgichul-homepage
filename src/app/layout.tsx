import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Outfit, Caveat } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatShell } from "@/components/chat/ChatShell";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import {
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
  GA_MEASUREMENT_ID,
} from "@/lib/constants";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "봄기출",
    "기출문제",
    "공무원 기출문제",
    "9급 공무원",
    "국가직 기출문제",
    "지방직 기출문제",
    "공인중개사 기출문제",
    "공인중개사 시험",
    "경찰공무원 기출문제",
    "순경 공채",
    "주택관리사 기출문제",
    "주택관리사보",
    "무료 기출문제",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    shortcut: `${SITE_URL}/favicon.ico`,
    apple: [
      {
        url: `${SITE_URL}/apple-icon`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "봄기출 | 기출 학습의 모든것",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image"],
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    // Next.js Verification 타입에 naver 키가 없어 other로 동일 메타 출력
    other: {
      "naver-site-verification": "6eb3690f67ceb4d2281d99222586a31063d2a955",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${outfit.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildWebSiteJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildOrganizationJsonLd()),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatShell />
        <VisitTracker />
      </body>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </html>
  );
}
