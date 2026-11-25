import 'server-only';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export async function getPcViewer() {
  if (!isSupabaseConfigured()) return null;
  const auth = (await createClient()).auth;
  const { data: { user } } = await auth.getUser();
  if (!user) return null;
  const { data } = await auth.getClaims();
  const sessionId = data?.claims.session_id;
  if (data?.claims.sub !== user.id || typeof sessionId !== 'string') return null;

  const provider = user.app_metadata?.provider;
  const label = { google: 'Google', kakao: '카카오', apple: 'Apple' }[provider as string] || '봄기출';
  const raw = user.email?.split('@')[0] || user.user_metadata?.full_name || user.user_metadata?.name;
  const alias = typeof raw === 'string' ? Array.from(raw.trim())[0] : '';
  return { id: user.id, sessionId, label: `${label} · ${alias ? `${alias}○○` : user.id.slice(-4)} 계정` };
}

export const validQrToken = (value: unknown): value is string => typeof value === 'string' && /^[a-zA-Z0-9_-]{43}$/.test(value);

export function pcJson(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store', ...headers } });
}
