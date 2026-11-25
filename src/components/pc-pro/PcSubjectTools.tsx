import { pcStudyOffers } from '@/lib/pc-access/study-context';
import type { PcStudyFeature } from '@/lib/pc-access/study-features';
import { PcStudyAction } from './PcStudyAction';

export function PcSubjectTools({ site, subject, features }: {
  site: string; subject: string; features: PcStudyFeature[];
}) {
  return features.map(feature => <PcStudyAction key={feature} feature={feature} offers={pcStudyOffers(site, subject, feature)}/>);
}
