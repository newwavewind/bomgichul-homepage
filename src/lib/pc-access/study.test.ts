import { describe, expect, it, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { PC_SUBJECTS } from './catalog';
import { PC_STUDY_FEATURES } from './study-features';
import studyManifest from '../../../data/pc-pro-study/manifest.json';
import policeBooks from '../../../data/pc-pro-textbooks/police.json';
import realEstateBooks from '../../../data/pc-pro-textbooks/real-estate.json';
import firefighterBooks from '../../../data/pc-pro-textbooks/firefighter.json';
import { GET } from '@/app/api/pc-access/textbook/[lecture]/route';
import { getPcViewer } from './session';
import { hasPcPro } from './pro';
import { paidLectureSubject } from './lectures';

vi.mock('server-only', () => ({}));
vi.mock('./session', async importOriginal => ({
  ...await importOriginal<typeof import('./session')>(), getPcViewer: vi.fn(),
}));
vi.mock('./pro', async importOriginal => ({
  ...await importOriginal<typeof import('./pro')>(), hasPcPro: vi.fn(),
}));

describe('PC Pro 교재', () => {
  it('세 시험의 교재가 등록된 유료 강의에 정확히 연결된다', () => {
    const books = [policeBooks.books, realEstateBooks.books, firefighterBooks.books].flatMap(group => Object.keys(group));
    expect(books.length).toBeGreaterThan(700);
    expect(new Set(books).size).toBe(books.length);
    for (const lecture of books) expect(paidLectureSubject(lecture)).toBeTruthy();
  });

  it('비로그인, 다른 과목, 본인 Pro를 구분하고 PDF 범위 요청을 전달한다', async () => {
    const request = new Request('http://localhost/api/pc-access/textbook/police-gcU102_1', { headers: { Range: 'bytes=0-4' } });
    const args = { params: Promise.resolve({ lecture: 'police-gcU102_1' }) };
    vi.mocked(getPcViewer).mockResolvedValueOnce(null).mockResolvedValue({id:'test',sessionId:'session',beta:false,label:'test'});
    vi.mocked(hasPcPro).mockResolvedValueOnce(false).mockResolvedValue(true);
    const fetchMock = vi.fn(async () => new Response('%PDF-', {
      status: 206,
      headers: { 'Content-Type': 'application/pdf', 'Content-Length': '5', 'Content-Range': 'bytes 0-4/100' },
    }));
    vi.stubGlobal('fetch', fetchMock);
    try {
      expect((await GET(request, args)).status).toBe(401);
      expect((await GET(request, args)).status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
      const response = await GET(request, args);
      expect(vi.mocked(hasPcPro)).toHaveBeenLastCalledWith('test', 'police-science', false);
      expect(response.status).toBe(206);
      expect(response.headers.get('cache-control')).toBe('private, no-store');
      expect(response.headers.get('content-range')).toBe('bytes 0-4/100');
      expect(await response.text()).toBe('%PDF-');
    } finally { vi.unstubAllGlobals(); }
  });
});

describe('PC Pro 학습 자료', () => {
  it('등록한 모든 범위와 학습 기능이 실제 압축 자료와 일치한다', async () => {
    for (const [scope, counts] of Object.entries(studyManifest.scopes)) {
      expect(PC_SUBJECTS[scope]).toBeDefined();
      const data = JSON.parse(gunzipSync(await readFile('data/pc-pro-study/' + scope + '.json.gz')).toString('utf8'));
      for (const { id } of PC_STUDY_FEATURES) {
        expect(counts[id]).toBe(id === 'audio' ? (data.audio ? data.ox.length : 0) : data[id].length);
      }
      if (['civillaw', 'realestate', 'broker-law', 'registry-law', 'realestate-tax', 'realestate-public-law'].includes(scope)) {
        expect(data.choices.some((question: { href?: string }) => question.href?.startsWith('/exam/' + scope + '/'))).toBe(true);
      }
      for (const question of data.choices) {
        expect(typeof question.answer).toBe('boolean');
        expect(typeof question.source).toBe('string');
      }
    }
  }, 60000);
});
