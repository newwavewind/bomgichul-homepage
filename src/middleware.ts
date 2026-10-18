import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getLegacySeoRedirect } from "@/lib/legacy-seo-redirects";
import { isPublicExamVisible } from "@/lib/public-exam-visibility";

export async function middleware(request: NextRequest) {
  let pathname = request.nextUrl.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // Keep the original pathname when a malformed escape sequence is supplied.
  }

  // 한국사 문제 자료 이미지는 public/에 보존하되 비공개 기간에는 직접 URL도 막는다.
  const optimizedImageUrl = pathname === "/_next/image" ? request.nextUrl.searchParams.get("url") : null;
  const requestsHistoryImage =
    pathname === "/exam/history" ||
    pathname.startsWith("/exam/history/") ||
    optimizedImageUrl === "/exam/history" ||
    optimizedImageUrl?.startsWith("/exam/history/");
  if (!isPublicExamVisible("history") && requestsHistoryImage) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
    });
  }

  if (pathname === "/diary-수험일기") {
    return NextResponse.redirect(new URL("/diary", request.url), 308);
  }

  const legacyDestination = getLegacySeoRedirect(pathname);
  if (legacyDestination) {
    return NextResponse.redirect(new URL(legacyDestination, request.url), 308);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/exam/history/:path*",
    "/_next/image",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
