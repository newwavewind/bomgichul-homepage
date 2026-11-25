import { getPcViewer, pcJson } from '@/lib/pc-access/session';
import { hasPcPro } from '@/lib/pc-access/pro';
import { readPcNotebook, readPcGlossary, readPcGlossaryLabels, readPcQuestionTraps } from '@/lib/pc-access/study';
import { pcQuestionHasNotebook, pcQuestionLocation, pcQuestionOffers, pcQuestionPath } from '@/lib/pc-access/study-context';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const feature = params.get('feature');
  const path = params.get('question');
  const term = params.get('term');
  const key = params.get('choice');
  const glossary = feature === 'glossary' || feature === 'term-exam';
  const questionBundle = feature === 'question';
  const notebook = feature === 'notebook';
  if (!path || (!glossary && !notebook && !questionBundle)) {
    return pcJson({ error: '학습 기능을 확인해 주세요.' }, 400);
  }
  const location = pcQuestionLocation(path);
  if (!location || (glossary && (!term || term.length > 100 || !key || key.length > 12))) {
    return pcJson({ error: '문항과 용어를 확인해 주세요.' }, 400);
  }
  const href = pcQuestionPath(location);
  const options = pcQuestionOffers(path).map(offer => offer.id);
  if (!options.length) return pcJson({ error: '이 항목의 Pro 자료가 없어요.' }, 404);
  try {
    const viewer = await getPcViewer();
    const publicGlossary = async () => questionBundle
      ? { glossaryLabels: await readPcGlossaryLabels(href) } : {};
    if (!viewer) return pcJson({ error: '로그인하고 이 과목의 Pro를 이용하세요.', ...await publicGlossary() }, 401);
    const pool = () => import('@/lib/daily-challenge/pool');
    for (const id of options) {
      if (!await hasPcPro(viewer.id, id, viewer.beta)) continue;
      if (questionBundle) {
        const [traps, note, definitions, glossaryData, questions] = await Promise.all([
          readPcQuestionTraps(id, href),
          pcQuestionHasNotebook(href) ? readPcNotebook(id, href) : null,
          pool().then(module => module.getQuestionGlossaryDefinitions(location)),
          readPcGlossary(id, href),
          pool(),
        ]);
        if (glossaryData) {
          for (const list of Object.values(glossaryData.related)) {
            const first = list[0];
            const exam = first && questions.getGlossaryExam(first.href);
            if (exam) first.first = exam;
          }
        }
        return pcJson({
          glossary: glossaryData,
          traps,
          note,
          definitions,
        });
      }
      if (glossary && term && key) {
        const native = await readPcGlossary(id, href);
        const entry = native?.terms[key]?.find(value => value.term === term);
        if (feature === 'term-exam') {
          const requested = params.get('related');
          const matching = entry && native && Object.hasOwn(native.related, term)
            ? native.related[term].find(value => value.href === requested) : undefined;
          const exam = matching ? (await pool()).getGlossaryExam(matching.href) : null;
          return exam ? pcJson({ exam }) : pcJson({ error: '이 용어의 관련 기출을 찾지 못했어요.' }, 404);
        }
        if (native?.terms[key]?.length) {
          return entry ? pcJson({ definition: entry.def }) : pcJson({ error: '이 문항에 없는 용어예요.' }, 404);
        }
        const { getQuestionGlossary } = await pool();
        const fallback = await getQuestionGlossary(location, key, term);
        return fallback ? pcJson({ definition: fallback.definition }) : pcJson({ error: '이 문항에 없는 용어예요.' }, 404);
      }
      if (notebook) {
        const note = await readPcNotebook(id, href);
        if (note) return pcJson({ note });
        continue;
      }
    }
    return pcJson({ error: '이 기능을 쓰려면 해당 과목의 Pro를 연결해 주세요.', ...await publicGlossary() }, 403);
  } catch {
    return pcJson({ error: '학습 자료를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' }, 503);
  }
}
