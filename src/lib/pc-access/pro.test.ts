import { describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import policeOutline from '@/components/lectures/police/outline.json';
import realEstateOutline from '@/components/lectures/outline.json';
import policeManifest from '../../../data/police-pro-lectures/manifest.json';
import realEstateManifest from '../../../data/real-estate-pro-lectures/manifest.json';
import { PC_SUBJECTS, isPcSubject, pcSite, productSubject } from './catalog';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/pc-access/session', async importOriginal => ({
  ...await importOriginal<typeof import('./session')>(),
  getPcViewer: vi.fn(),
}));
vi.mock('@/lib/pc-access/pro', async importOriginal => ({
  ...await importOriginal<typeof import('./pro')>(),
  hasPcPro: vi.fn(),
}));

import { GET as definitionRoute } from '@/app/api/pc-access/lecture/[lecture]/route';
import { GET as audioRoute } from '@/app/api/pc-access/lecture/[lecture]/[scene]/route';
import { getPcViewer } from './session';
import { hasPcPro, paidLectureSubject, readPaidLecture } from './pro';

const viewer = { id: 'test-user', sessionId: 'test-session', beta: false, label: 'Google · 가○○ 계정' };

describe('과목별 PC Pro 강의', () => {
  it('전체 공개 목록과 검증된 유료 원본의 수·과목·해시가 일치한다', async () => {
    const subjects: Record<string, { public: number; paid: number; sha256: string }> = {
      ...policeManifest.subjects, ...realEstateManifest.subjects,
    };
    for (const group of [...policeOutline, ...realEstateOutline]) {
      if (!isPcSubject(group.subject)) throw new Error('Unknown subject');
      const subject = group.subject;
      const content = await readFile(`data/${pcSite(subject)}-pro-lectures/${subject}.json`);
      const definitions = JSON.parse(content.toString());
      const lessons = group.parts.flatMap(part => part.sections.flatMap(section => section.lessons));
      expect(productSubject(PC_SUBJECTS[subject].productId)).toBe(subject);
      expect(lessons.filter(lesson => lesson.number <= 3)).toHaveLength(3);
      expect(Object.keys(definitions)).toEqual(lessons.filter(lesson => lesson.ready && lesson.number > 3).map(lesson => lesson.id));
      expect(Object.keys(definitions)).toHaveLength(subjects[subject].paid);
      expect(createHash('sha256').update(content).digest('hex')).toBe(subjects[subject].sha256);
      for (const lesson of lessons) {
        expect(paidLectureSubject(lesson.id)).toBe(lesson.number <= 3 ? null : subject);
        if (lesson.number > 3) expect(definitions[lesson.id].scenes.length).toBeGreaterThan(0);
      }
    }
  });

  it('로그인과 정확한 과목 수강권을 확인하고 서버 경유 음원 주소만 전달한다', async () => {
    const lecture = 'police-hnU102_1';
    const request = new Request('http://localhost/api/pc-access/lecture/' + lecture);
    const params = Promise.resolve({ lecture });
    vi.mocked(getPcViewer).mockResolvedValueOnce(null).mockResolvedValue(viewer);
    vi.mocked(hasPcPro).mockImplementation(async (id, subject) => id === viewer.id && subject === 'constitution');
    expect((await definitionRoute(request, { params })).status).toBe(401);
    expect((await definitionRoute(request, { params: Promise.resolve({ lecture: 'police-hsU102_1' }) })).status).toBe(403);
    const response = await definitionRoute(request, { params });
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('no-store');
    const lesson = await response.json();
    expect(lesson.audioBase).toBe('/api/pc-access/lecture/' + lecture);
    expect(lesson.scenes).toEqual((await readPaidLecture('constitution', lecture))?.scenes);
  });

  it('음원도 같은 과목의 권한을 확인하고 구간 응답을 전달한다', async () => {
    const lecture = 'police-hnU102_1';
    const request = new Request('http://localhost/test', { headers: { Range: 'bytes=0-3' } });
    const args = { params: Promise.resolve({ lecture, scene: 'scene-01.m4a' }) };
    vi.mocked(getPcViewer).mockResolvedValue(viewer);
    vi.mocked(hasPcPro).mockResolvedValueOnce(false).mockResolvedValue(true);
    expect((await audioRoute(request, args)).status).toBe(403);
    const original = globalThis.fetch;
    const media = vi.fn(async () => new Response('ftyp', {
      status: 206, headers: { 'Content-Range': 'bytes 0-3/100', 'Content-Length': '4' },
    }));
    vi.stubGlobal('fetch', media);
    try {
      const response = await audioRoute(request, args);
      expect(response.status).toBe(206);
      expect(response.headers.get('content-range')).toBe('bytes 0-3/100');
      expect(await response.text()).toBe('ftyp');
      expect(media).toHaveBeenCalledOnce();
    } finally {
      vi.stubGlobal('fetch', original);
    }
  });
});
