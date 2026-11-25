export const PC_SUBJECTS = {
  constitution: { title: '헌법', productId: 'premium_unlock_constitution' },
  'criminal-law': { title: '형사법', productId: 'premium_unlock_criminal_law' },
  'police-science': { title: '경찰학', productId: 'premium_unlock_police_science' },
  realestate: { title: '부동산학개론', productId: 'premium_unlock_realestate' },
  civillaw: { title: '민법', productId: 'premium_unlock' },
  'broker-law': { title: '중개사법', productId: 'premium_unlock_agency' },
  'registry-law': { title: '공시법', productId: 'premium_unlock_registration' },
  'realestate-tax': { title: '세법', productId: 'premium_unlock_tax' },
  'realestate-public-law': { title: '공법', productId: 'premium_unlock_publiclaw' },
} as const;

export type PcSubject = keyof typeof PC_SUBJECTS;

export function pcSite(subject: PcSubject): 'police' | 'real-estate' {
  return subject === 'constitution' || subject === 'criminal-law' || subject === 'police-science'
    ? 'police' : 'real-estate';
}

export function isPcSubject(value: unknown): value is PcSubject {
  return typeof value === 'string' && Object.hasOwn(PC_SUBJECTS, value);
}

export function productSubject(productId: unknown): PcSubject | undefined {
  return (Object.keys(PC_SUBJECTS) as PcSubject[]).find(subject => PC_SUBJECTS[subject].productId === productId);
}
