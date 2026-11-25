import Link from 'next/link';
import { PC_APPS } from '@/lib/pc-access/catalog';

export const metadata = { title: 'PC Pro 앱 구매 연동' };

export default function PcProHome() {
  const exams = [
    { site: 'police', title: '경찰공무원', href: '/police/lectures/constitution#police-pc-plan' },
    { site: 'real-estate', title: '공인중개사', href: '/real-estate/lectures/realestate#real-estate-pc-plan' },
    ...PC_APPS.map(app => ({ site: app.site, title: app.title, href: '/pc-pro/' + app.site })),
  ];
  return <main className="mx-auto max-w-4xl space-y-5 px-4 py-10">
    <h1 className="text-3xl font-semibold text-ink">PC Pro</h1>
    <p className="text-sm leading-7 text-smoke">앱에서 구매한 시험과 과목을 선택해 홈페이지 계정에 연결하세요.</p>
    <ul className="grid gap-2 sm:grid-cols-2">
      {exams.map(({ site, title, href }) => <li key={site}>
        <Link className="block rounded-xl border border-mist bg-white px-4 py-3 font-medium text-carbon hover:bg-snow" href={href}>{title}</Link>
      </li>)}
    </ul>
  </main>;
}
