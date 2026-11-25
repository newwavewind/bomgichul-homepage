import { notFound, redirect } from 'next/navigation';
import { isPcSubject } from '@/lib/pc-access/catalog';
import { pcStudyReturnPath } from '@/lib/pc-access/study-context';
import { getPcStudyCounts } from '@/lib/pc-access/study-context';

export default async function LegacyPcStudyPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (!isPcSubject(scope) || !getPcStudyCounts(scope)) notFound();
  redirect(pcStudyReturnPath(scope));
}
