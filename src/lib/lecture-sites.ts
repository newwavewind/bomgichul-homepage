import { appStoreLinksForScope } from '@/lib/constants';

type LectureSite = 'real-estate' | 'firefighter' | 'police';

const SITES: Record<LectureSite, {
  examLabel: string;
  scope: Parameters<typeof appStoreLinksForScope>[0];
  basePath: string;
}> = {
  'real-estate': {
    examLabel: '공인중개사',
    scope: 'real_estate',
    basePath: '/real-estate/lectures',
  },
  firefighter: {
    examLabel: '소방공무원',
    scope: 'firefighter',
    basePath: '/firefighter/lectures',
  },
  police: {
    examLabel: '경찰공무원',
    scope: 'police',
    basePath: '/police/lectures',
  },
};

export function lectureSiteConfig(site: string = 'real-estate') {
  const config = SITES[(site as LectureSite)] ?? SITES['real-estate'];
  return {
    examLabel: config.examLabel,
    appName: `봄기출 ${config.examLabel} 앱`,
    basePath: config.basePath,
    appLinks: appStoreLinksForScope(config.scope),
    shareDescription: `음성과 판서로 공부하는 ${config.examLabel} 칠판 강의.`,
  };
}

export function lecturePagePath(site: string, subject: string, lectureId?: string) {
  const path = `${lectureSiteConfig(site).basePath}/${encodeURIComponent(subject)}`;
  return lectureId ? `${path}?lecture=${encodeURIComponent(lectureId)}` : path;
}
