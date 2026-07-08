import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { deleteAdminPost } from "@/lib/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const { id } = await context.params;
  const result = await deleteAdminPost(id);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
