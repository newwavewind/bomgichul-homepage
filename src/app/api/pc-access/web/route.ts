import { randomBytes } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPcSubject } from '@/lib/pc-access/catalog';
import { digest, storeVerificationConfigured } from '@/lib/pc-access/store';
import { getPcViewer, pcJson, validQrToken } from '@/lib/pc-access/session';

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return pcJson({ error: '페이지에서 다시 시도해 주세요.' }, 403);
  try {
    const viewer = await getPcViewer();
    if (!viewer) return pcJson({ error: '홈페이지에 먼저 로그인해 주세요.' }, 401);
    const body = await request.json().catch(() => null);
    if (!body) return pcJson({ error: '잘못된 요청이에요.' }, 400);
    const admin = createAdminClient();
    if (body.action === 'start' && isPcSubject(body.subject)) {
      if (!storeVerificationConfigured()) return pcJson({ error: '앱 구매 연동을 준비 중이에요.' }, 503);
      const token = randomBytes(32).toString('base64url');
      const { data, error } = await admin.rpc('start_police_pc_request', {
        p_hash: digest(token), p_user: viewer.id, p_session: viewer.sessionId,
        p_label: viewer.label, p_subject: body.subject,
      });
      if (error) throw error;
      if (!data) return pcJson({ error: '연결 요청이 많아요. 잠시 뒤에 다시 시도해 주세요.' }, 429);
      return pcJson({ token, expiresAt: data });
    }
    if (!validQrToken(body.token)) return pcJson({ error: '새 QR을 만들어 주세요.' }, 400);
    const params = { p_hash: digest(body.token), p_user: viewer.id, p_session: viewer.sessionId };
    if (body.action === 'finish') {
      const { data, error } = await admin.rpc('finish_police_pc_request', params);
      if (error) throw error;
      if (data === 'linked') return pcJson({ status: 'linked' });
      if (data === 'conflict') return pcJson({ error: '이 구매는 다른 봄기출 계정에 연결돼 있어요.' }, 409);
      if (data === 'waiting') return pcJson({ error: '앱에서 먼저 구매를 확인해 주세요.' }, 409);
      return pcJson({ error: 'QR이 만료됐어요. 새 QR을 만들어 주세요.' }, 410);
    }
    if (body.action === 'status' || body.action === 'cancel') {
      const query = admin.from('police_pc_requests');
      if (body.action === 'cancel') {
        const { error } = await query.update({ expires_at: new Date().toISOString(), verified_purchase: null })
          .eq('token_hash', params.p_hash).eq('user_id', viewer.id).eq('session_id', viewer.sessionId).is('completed_at', null);
        if (error) throw error;
        return pcJson({ status: 'cancelled' });
      }
      const { data, error } = await query.select('expires_at,completed_at')
        .eq('token_hash', params.p_hash).eq('user_id', viewer.id).eq('session_id', viewer.sessionId).maybeSingle();
      if (error) throw error;
      if (data?.completed_at) return pcJson({ status: 'linked' });
      if (!data || Date.parse(data.expires_at) <= Date.now()) return pcJson({ status: 'expired' });
      const { count, error: pendingError } = await query.select('token_hash', { count: 'exact', head: true })
        .eq('token_hash', params.p_hash).not('verified_purchase', 'is', null);
      if (pendingError) throw pendingError;
      return pcJson({ status: count ? 'approved' : 'waiting' });
    }
    return pcJson({ error: '잘못된 요청이에요.' }, 400);
  } catch {
    return pcJson({ error: '구매 연동 서버에 연결하지 못했어요. 잠시 뒤에 다시 시도해 주세요.' }, 503);
  }
}
