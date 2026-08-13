import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ mediaId: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const { mediaId } = await params;
  const { data } = await supabase.from("profile_media").select("file_path").eq("id", mediaId).single();
  if (!data) return NextResponse.json({ error: "사진을 찾을 수 없습니다." }, { status: 404 });
  const { data: signed } = await supabase.storage.from("profile-media").createSignedUrl(data.file_path, 300);
  if (!signed?.signedUrl) return NextResponse.json({ error: "사진을 열 수 없습니다." }, { status: 404 });
  return NextResponse.redirect(signed.signedUrl, { headers: { "Cache-Control": "private, max-age=240" } });
}
