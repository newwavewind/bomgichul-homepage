import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 외부 업타임 모니터(UptimeRobot 등)와 내부 cron이 쓰는 가벼운 헬스체크.
 * 의존성(DB 등) 실패로 홈이 죽지 않도록, 이 엔드포인트는 앱 프로세스만 확인한다.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "bomgichulhomepage",
      ts: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
