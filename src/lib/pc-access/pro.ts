import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import type { PcSubject } from './catalog';
import { verifyStorePurchase, type Store, type StoreEnvironment } from './store';

const freshness = 5 * 60 * 1000;

/** Fresh store state gates playback. A transient store error never marks a purchase refunded. */
export async function hasPcPro(userId: string, subject: PcSubject, beta = false): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin.from('police_pc_purchases')
    .select('purchase_key,platform,proof,checked_at,purchase_environment,test_expires_at')
    .eq('user_id', userId).eq('subject', subject).is('revoked_at', null)
    .order('checked_at', { ascending: false });
  if (error) throw error;
  const now = Date.now();
  const cutoff = now - freshness;
  const active = data.filter(row => row.purchase_environment === 'production' ||
    (beta && row.purchase_environment === 'sandbox' && Date.parse(row.test_expires_at) > now));
  if (active.some(row => Date.parse(row.checked_at) > cutoff)) return true;
  for (const row of active) {
    const checkedAt = new Date().toISOString();
    const verified = await verifyStorePurchase(row.platform as Store, row.proof, subject, row.purchase_environment as StoreEnvironment);
    const valid = verified?.key === row.purchase_key;
    const { data: saved, error: updateError } = await admin.from('police_pc_purchases')
      .update(valid ? { checked_at: checkedAt } : { checked_at: checkedAt, revoked_at: checkedAt })
      .eq('purchase_key', row.purchase_key).eq('checked_at', row.checked_at).is('revoked_at', null)
      .select('purchase_key').maybeSingle();
    if (updateError) throw updateError;
    if (valid && saved) return true;
    if (!saved && valid) {
      const { data: latest, error: readError } = await admin.from('police_pc_purchases').select('checked_at')
        .eq('purchase_key', row.purchase_key).is('revoked_at', null).maybeSingle();
      if (readError) throw readError;
      if (latest && Date.parse(latest.checked_at) > cutoff) return true;
    }
  }
  return false;
}
