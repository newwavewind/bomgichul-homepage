import 'server-only';

import { isPcSubject, PC_SUBJECTS, pcSite } from './catalog';
import { getPcStudyCounts } from './study';
import type { PcStudyFeature, PcStudyOffer } from './study-features';
import questionFeatures from '../../../data/pc-pro-study/question-index.json';
import notebookPaths from '../../../data/pc-pro-notes/index.json';
import { lecturePagePath } from '@/lib/lecture-sites';

export type PcQuestionLocation = { site: string; subject: string; year: number; source?: string; no: number };
const webSubjects: Record<string, string> = { english: 'gong9', history: 'simhwa' };
const offers = Object.values(PC_SUBJECTS);
const notebooks = new Set(notebookPaths);
const index: Readonly<Record<string, number>> = questionFeatures;

export function pcQuestionLocation(path: string): PcQuestionLocation | null {
  if (path.length > 240) return null;
  const parts = path.split('/');
  const realEstate = parts.length === 5 && parts[1] === 'exam';
  if (!realEstate && (parts.length !== 7 || parts[2] !== 'exam')) return null;
  if (parts[0] !== '') return null;
  const [site, subject, year, source, no] = realEstate
    ? ['real-estate', parts[2], parts[3], undefined, parts[4]]
    : [parts[1], parts[3], parts[4], parts[5], parts[6]];
  if (!/^[\w-]+$/.test(site) || !/^[\w-]+$/.test(subject) ||
      !/^20\d{2}$/.test(year) || !/^[1-9]\d{0,2}$/.test(no)) return null;
  try {
    const sourceCode = source === undefined ? undefined : decodeURIComponent(source);
    if (sourceCode !== undefined && (!sourceCode.trim() || /[/\\?#\u0000-\u001f]/u.test(sourceCode))) return null;
    return { site, subject, year: Number(year), source: sourceCode, no: Number(no) };
  } catch {
    return null;
  }
}

export function pcQuestionPath(location: PcQuestionLocation) {
  const { site, subject, year, source, no } = location;
  return site === 'real-estate' ? `/exam/${subject}/${year}/${no}`
    : `/${site}/exam/${subject}/${year}/${encodeURIComponent(source ?? '')}/${no}`;
}

export function pcStudyReturnPath(scope: string) {
  if (!isPcSubject(scope)) return '/pc-pro';
  const offer = PC_SUBJECTS[scope];
  const prefix = offer.site === 'real-estate' ? '' : '/' + offer.site;
  return `${prefix}/exam/${webSubjects[offer.site] ?? offer.webId ?? offer.subjectId}`;
}

export function pcStudyPlanPath(scope: string) {
  const offer = PC_SUBJECTS[scope];
  const site = pcSite(scope);
  const path = site && offer.lectureSubject ? lecturePagePath(site, offer.lectureSubject)
    : `/pc-pro/${offer.site}?subject=${scope}`;
  return path + '#' + offer.site + '-pc-plan';
}

export function pcStudyOffers(site: string, subject: string, feature?: PcStudyFeature, source?: string): PcStudyOffer[] {
  return offers.filter(offer => {
    const webSubject = webSubjects[offer.site] ?? offer.webId ?? offer.subjectId;
    if (offer.site !== site || webSubject !== subject) return false;
    if (feature && !getPcStudyCounts(offer.id)?.[feature]) return false;
    if (source && ['public-service', 'english', 'gugeo'].includes(site)) {
      const edition = offer.source ?? (offer.id.endsWith('-national') ? '국가직'
        : offer.id.endsWith('-local') ? '지방직' : undefined);
      if (edition && !source.startsWith(edition)) return false;
    }
    return true;
  }).map(offer => ({ id: offer.id, title: offer.title, plan: pcStudyPlanPath(offer.id) }));
}

export function pcQuestionOffers(path: string, feature?: PcStudyFeature) {
  const location = pcQuestionLocation(path);
  return location ? pcStudyOffers(location.site, location.subject, feature, location.source) : [];
}

export function pcQuestionFeatures(path: string) {
  const location = pcQuestionLocation(path);
  const mask = location ? index[pcQuestionPath(location)] ?? 0 : 0;
  return ([['choices', 1], ['traps', 2]] as const).flatMap(([feature, bit]) => {
    const offers = mask & bit ? pcQuestionOffers(path, feature) : [];
    return offers.length ? [{ feature, offers }] : [];
  });
}

export function pcQuestionHasNotebook(path: string) {
  const location = pcQuestionLocation(path);
  return location !== null && notebooks.has(pcQuestionPath(location));
}
