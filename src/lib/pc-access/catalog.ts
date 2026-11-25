import appOffers from './app-offers.json';

const coreSubjects = {
  constitution: { title: '헌법', productId: 'premium_unlock_constitution', site: 'police' },
  'criminal-law': { title: '형사법', productId: 'premium_unlock_criminal_law', site: 'police' },
  'police-science': { title: '경찰학', productId: 'premium_unlock_police_science', site: 'police' },
  realestate: { title: '부동산학개론', productId: 'premium_unlock_realestate', site: 'real-estate' },
  civillaw: { title: '민법', productId: 'premium_unlock', site: 'real-estate' },
  'broker-law': { title: '중개사법', productId: 'premium_unlock_agency', site: 'real-estate' },
  'registry-law': { title: '공시법', productId: 'premium_unlock_registration', site: 'real-estate' },
  'realestate-tax': { title: '세법', productId: 'premium_unlock_tax', site: 'real-estate' },
  'realestate-public-law': { title: '공법', productId: 'premium_unlock_publiclaw', site: 'real-estate' },
} as const;

type PcSite = 'police' | 'real-estate' | 'firefighter';
type Platform = 'ios' | 'android';
export type PcSubject = string;
type PcOffer = {
  id: string;
  title: string;
  productId: string;
  bundle: string;
  subjectId: string;
  webId?: string;
  source?: string;
  site: string;
  exam: string;
  platforms: readonly string[];
  lectureSubject?: string;
};
export const PC_APPS = appOffers;
export const PC_SUBJECTS: Readonly<Record<string, PcOffer>> = Object.fromEntries([
  ...Object.entries(coreSubjects).map(([id, offer]): [string, PcOffer] => {
    const police = offer.site === 'police';
    return [id, { ...offer, id, subjectId: id, lectureSubject: id, exam: police ? '경찰공무원' : '공인중개사',
      bundle: police ? 'com.sanghyun.police' : 'com.sanghyun.civillaw', platforms: ['ios', 'android'] }];
  }),
  ...PC_APPS.flatMap(app => app.subjects.map((offer): [string, PcOffer] => [
    offer.id, { ...offer, site: app.site, exam: app.title, bundle: app.bundle },
  ])),
]);

export function pcSite(subject: PcSubject): PcSite | null {
  const offer = PC_SUBJECTS[subject];
  return offer?.lectureSubject ? offer.site as PcSite : null;
}

export function lecturePcSubject(site: PcSite, lectureSubject: string) {
  return Object.values(PC_SUBJECTS).find(offer => offer.site === site && offer.lectureSubject === lectureSubject)?.id;
}

export function isPcSubject(value: unknown): value is PcSubject {
  return typeof value === 'string' && Object.hasOwn(PC_SUBJECTS, value);
}

export function productSubject(productId: unknown): PcSubject | undefined {
  // The original police and real-estate builds only send the product ID.
  return Object.entries(coreSubjects).find(([, offer]) => offer.productId === productId)?.[0];
}

export function mobileOffer(request: { bundle?: unknown; subjectId?: unknown; productId?: unknown }, scope: string) {
  if (!isPcSubject(scope)) return undefined;
  const offer = PC_SUBJECTS[scope];
  if (request.bundle === undefined) return productSubject(request.productId) === scope ? offer : undefined;
  return request.bundle === offer.bundle && request.subjectId === offer.subjectId &&
    (request.productId === undefined || request.productId === offer.productId) ? offer : undefined;
}

export function platformInOffer(subject: PcSubject, platform: Platform) {
  return PC_SUBJECTS[subject].platforms.includes(platform);
}
