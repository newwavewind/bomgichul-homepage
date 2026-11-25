import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('./session', async load => ({
  ...await load<typeof import('./session')>(),
  getPcViewer: vi.fn(),
}));
vi.mock('./pro', () => ({ hasPcPro: vi.fn() }));

import { GET } from '@/app/api/pc-access/study/route';
import { GET as getStudyContext } from '@/app/api/pc-access/study-context/route';
import { getPcViewer } from './session';
import { hasPcPro } from './pro';
import { pcQuestionFeatures, pcQuestionHasNotebook, pcQuestionOffers } from './study-context';

const national = 'public-service-haengjeongbeop-national';
const local = 'public-service-haengjeongbeop-local';
const path = (year: number) => `/public-service/exam/haengjeongbeop/${year}/${encodeURIComponent('국가직')}/1`;
const request = (feature: string, params: Record<string, string>) =>
  (['question', 'glossary', 'term-exam', 'notebook'].includes(feature) ? getStudyContext : GET)(
    new Request('https://www.bomgichul.com/api/pc-access/study?' + new URLSearchParams({ feature, ...params })),
  );
const glossary = { question: path(2025), choice: '2', term: '기부채납' };
const testViewer = { id: 'test', sessionId: 'test', beta: false, label: 'test' };

describe('contextual Pro study', () => {
  it('offers only the matching exam edition and real practice for the shown question', () => {
    expect(pcQuestionOffers(path(2026)).map(offer => offer.id)).toEqual([national]);
    expect(pcQuestionFeatures(path(2026)).map(entry => entry.feature)).toEqual(['traps']);
    expect(pcQuestionHasNotebook(path(2026))).toBe(true);
  });

  it('withholds the term definition and practice from guests and other editions', async () => {
    vi.mocked(getPcViewer).mockResolvedValue(null);
    const guest = await request('glossary', glossary);
    expect(guest.status).toBe(401);
    expect(await guest.json()).not.toHaveProperty('definition');
    expect(guest.headers.get('cache-control')).toBe('private, no-store');
    const bundle = await request('question', { question: glossary.question });
    expect(bundle.status).toBe(401);
    const bundleData = await bundle.json();
    expect(bundleData).not.toHaveProperty('glossary');
    expect(bundleData.glossaryLabels['2']).toEqual(expect.arrayContaining(['기부채납']));
    expect(bundleData).not.toHaveProperty('definitions');
    vi.mocked(getPcViewer).mockResolvedValue(testViewer);
    vi.mocked(hasPcPro).mockImplementation(async (_, scope) => scope === local);
    expect((await request('notebook', { question: path(2026) })).status).toBe(403);
    expect((await request('choices', { question: path(2026) })).status).toBe(403);
    expect((await request('term-exam', { ...glossary, related: path(2026) })).status).toBe(403);
  });

  it('serves the exact question, source-backed correction, notebook and term to its subscriber', async () => {
    vi.mocked(getPcViewer).mockResolvedValue(testViewer);
    vi.mocked(hasPcPro).mockImplementation(async (_, scope) => scope === national);
    const choices = await request('choices', { question: path(2026) });
    expect(choices.status).toBe(200);
    expect((await choices.json()).choices.map((item: { id: string }) => item.id)).toEqual(
      [1,2,3,4].map(no => '행정법-2026-국가직-Q1::' + no),
    );
    const traps = await request('traps', { question: path(2026) });
    expect((await traps.json()).traps).toEqual(expect.arrayContaining([
      expect.objectContaining({ wrong: '더욱 엄격하게 지켜야 한다', right: '완화되어 적용된다' }),
    ]));
    const note = await request('notebook', { question: path(2026) });
    expect((await note.json()).note.intro).toContain('포괄위임금지');
    const term = await request('glossary', glossary);
    expect((await term.json()).definition).toContain('소유권');
    expect((await request('glossary', { ...glossary, term: '다른 지문' })).status).toBe(404);
  }, 20000);

  it('loads only the requested subject feature', async () => {
    vi.mocked(getPcViewer).mockResolvedValue(testViewer);
    vi.mocked(hasPcPro).mockResolvedValue(true);
    for (const [feature, key] of [['cells', 'cells'], ['ox', 'ox'], ['audio', 'ox'], ['law', 'law']]) {
      const lessons = await request(feature, { scope: national });
      expect(lessons.status).toBe(200);
      const result = await lessons.json();
      expect(Object.keys(result)).toEqual([key]);
      expect(result[key].length).toBeGreaterThan(0);
    }
  });
});
