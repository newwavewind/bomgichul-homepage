export const PC_SUBJECTS = {
  constitution: { title: '헌법', productId: 'premium_unlock_constitution' },
  'criminal-law': { title: '형사법', productId: 'premium_unlock_criminal_law' },
  'police-science': { title: '경찰학', productId: 'premium_unlock_police_science' },
} as const;

export type PcSubject = keyof typeof PC_SUBJECTS;

export function isPcSubject(value: unknown): value is PcSubject {
  return typeof value === 'string' && Object.hasOwn(PC_SUBJECTS, value);
}

export function productSubject(productId: unknown): PcSubject | undefined {
  return (Object.keys(PC_SUBJECTS) as PcSubject[]).find(subject => PC_SUBJECTS[subject].productId === productId);
}
