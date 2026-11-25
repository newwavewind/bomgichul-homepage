import { createAdminClient } from '@/lib/supabase/admin';
import { mobileOffer, productSubject } from '@/lib/pc-access/catalog';
import { pcJson, validQrToken } from '@/lib/pc-access/session';
import { digest, isStoreProof, pcTesterAllowed, storeVerificationConfigured, verifyStorePurchase } from '@/lib/pc-access/store';

function cors(request: Request): Record<string, string> | null {
  const origin = request.headers.get('origin');
  const allowed = origin === 'capacitor://localhost' || origin === 'https://localhost' ||
    (process.env.NODE_ENV === 'development' && /^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin || ''));
  if (origin && !allowed) return null;
  return origin ? {
    'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin',
  } : {};
}

export function OPTIONS(request: Request) {
  const headers = cors(request);
  return new Response(null, { status: headers ? 204 : 403, headers: headers ?? undefined });
}

export async function POST(request: Request) {
  const headers = cors(request);
  if (!headers) return pcJson({ error: '봄기출 앱에서 연결해 주세요.' }, 403);
  const respond = (data: unknown, status = 200) => pcJson(data, status, headers);
  try {
    if (!request.headers.get('content-type')?.includes('application/json')) return respond({ error: '잘못된 요청이에요.' }, 415);
    const body = await request.json().catch(() => null);
    if (!body || (body.bundle === undefined && !productSubject(body.productId)) || !validQrToken(body.token) || !['inspect', 'approve'].includes(body.action)) {
      return respond({ error: '홈페이지 강의에서 만든 QR을 확인해 주세요.' }, 400);
    }
    const admin = createAdminClient();
    const hash = digest(body.token);
    const { data: row, error } = await admin.from('police_pc_requests').select('account_label,user_id,subject,expires_at,completed_at')
      .eq('token_hash', hash).maybeSingle();
    if (error) throw error;
    if (!row || row.completed_at || Date.parse(row.expires_at) <= Date.now()) {
      return respond({ error: 'QR이 만료됐거나 이미 사용됐어요. PC에서 새 QR을 만들어 주세요.' }, 410);
    }
    const offer = mobileOffer(body, row.subject);
    if (!offer) return respond({ error: '앱과 홈페이지에서 같은 시험과 과목을 선택해 주세요.' }, 409);
    const subject = offer.id;
    if (body.action === 'inspect') return respond({
      label: row.account_label, offer: offer.id, title: offer.title, productId: offer.productId,
    });
    const { platform, proof } = body;
    if ((platform !== 'ios' && platform !== 'android') || !isStoreProof(platform, proof)) {
      return respond({ error: '유효한 스토어 구매 내역을 찾지 못했어요.' }, 400);
    }
    if (!storeVerificationConfigured(platform)) return respond({ error: '이 스토어의 구매 연동을 준비 중이에요.' }, 503);
    const { data: reserved, error: reserveError } = await admin.rpc('reserve_police_pc_verification', { p_hash: hash, p_subject: subject });
    if (reserveError) throw reserveError;
    if (!reserved) return respond({ error: 'PC에서 연결 상태를 확인하거나 새 QR을 만들어 주세요.' }, 409);
    let verified = await verifyStorePurchase(platform, proof, subject);
    if (!verified && platform === 'ios' && process.env.BOMGICHUL_PC_TEST_EMAIL_SHA256) {
      const { data, error: userError } = await admin.auth.admin.getUserById(row.user_id);
      if (userError) throw userError;
      if (pcTesterAllowed(data.user)) verified = await verifyStorePurchase(platform, proof, subject, 'sandbox');
    }
    if (!verified) return respond({ error: '이 과목의 유효한 결제를 확인하지 못했어요.' }, 422);
    const { data: saved, error: saveError } = await admin.from('police_pc_requests').update({ verified_purchase: verified })
      .eq('token_hash', hash).gt('expires_at', new Date().toISOString()).is('verified_purchase', null)
      .is('completed_at', null).select('token_hash').maybeSingle();
    if (saveError) throw saveError;
    if (!saved) return respond({ error: 'PC에서 연결 상태를 확인하거나 새 QR을 만들어 주세요.' }, 409);
    return respond({ status: 'approved' });
  } catch {
    return respond({ error: '구매 확인 서버에 연결하지 못했어요. 잠시 뒤에 다시 시도해 주세요.' }, 503);
  }
}
