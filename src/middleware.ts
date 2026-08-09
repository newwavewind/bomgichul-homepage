import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  let pathname = request.nextUrl.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // Keep the original pathname when a malformed escape sequence is supplied.
  }

  if (pathname === "/diary-수험일기") {
    return NextResponse.redirect(new URL("/diary", request.url), 308);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
