import { NextResponse } from "next/server";
import { getPost } from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return NextResponse.json({
    configured: isSupabaseConfigured(),
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    post: await getPost(id),
  });
}
