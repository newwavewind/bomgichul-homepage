import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createAdminClient } from '@/lib/supabase/admin';
import outline from '@/components/lectures/police/outline.json';
import { isPcSubject, type PcSubject } from './catalog';
import { verifyStorePurchase, type Store } from './store';

const freshness = 5 * 60 * 1000;
const audioOrigin = 'https://pub-018addf460ef45fcad17018a675217b0.r2.dev';
type Lecture = {
  audioBase: string;
  scenes: { id: string }[];
  [key: string]: unknown;
};
const definitions = new Map<PcSubject, Promise<Record<string, Lecture>>>();

export function paidLectureSubject(lectureId: string): PcSubject | null {
  if (!/^police-(hn|hs|gc)U\d+_\d+$/.test(lectureId)) return null;
  for (const group of outline) {
    if (!isPcSubject(group.subject)) continue;
    if (group.parts.some(part => part.sections.some(section => section.lessons.some(
      lesson => lesson.id === lectureId && lesson.number > 3 && lesson.ready,
    )))) return group.subject;
  }
  return null;
}

export async function readPaidLecture(subject: PcSubject, lectureId: string): Promise<Lecture | null> {
  if (paidLectureSubject(lectureId) !== subject) return null;
  let catalog = definitions.get(subject);
  if (!catalog) {
    catalog = readFile(path.join(process.cwd(), 'data/police-pro-lectures', `${subject}.json`), 'utf8')
      .then(content => JSON.parse(content))
      .catch(error => { definitions.delete(subject); throw error; });
    definitions.set(subject, catalog);
  }
  return (await catalog)[lectureId] || null;
}

export function audioSource(lecture: Lecture, sceneFile: string): URL | null {
  const match = /^scene-(\d{2})\.m4a$/.exec(sceneFile);
  if (!match || Number(match[1]) < 1 || Number(match[1]) > lecture.scenes.length) return null;
  const base = new URL(lecture.audioBase);
  if (base.origin !== audioOrigin || !base.pathname.startsWith('/lectures/')) return null;
  return new URL(`${base.pathname}/${sceneFile}`, audioOrigin);
}

/** Fresh store state gates playback. A transient store error never marks a purchase refunded. */
export async function hasPolicePro(userId: string, subject: PcSubject): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin.from('police_pc_purchases')
    .select('purchase_key,platform,proof,checked_at')
    .eq('user_id', userId).eq('subject', subject).is('revoked_at', null)
    .order('checked_at', { ascending: false });
  if (error) throw error;
  const cutoff = Date.now() - freshness;
  if (data.some(row => Date.parse(row.checked_at) > cutoff)) return true;
  for (const row of data) {
    const checkedAt = new Date().toISOString();
    const verified = await verifyStorePurchase(row.platform as Store, row.proof, subject);
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
