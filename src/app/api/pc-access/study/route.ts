import { getPcViewer, pcJson } from '@/lib/pc-access/session';
import { hasPcPro } from '@/lib/pc-access/pro';
import { readPcStudy, readPcNotebook, getPcStudyCounts, readPcGlossary, readPcGlossaryLabels, type PcStudy } from '@/lib/pc-access/study';
import { isPcStudyFeature } from '@/lib/pc-access/study-features';
import { isPcSubject } from '@/lib/pc-access/catalog';
import { pcQuestionFeatures, pcQuestionHasNotebook, pcQuestionLocation, pcQuestionOffers, pcQuestionPath } from '@/lib/pc-access/study-context';
import verifiedTraps from '../../../../../data/pc-pro-study/verified-traps.json';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const feature = params.get('feature');
  const path = params.get('question');
  const scope = params.get('scope');
  const term = params.get('term');
  const key = params.get('choice');
  const glossary = feature === 'glossary' || feature === 'term-exam';
  const questionBundle = feature === 'question';
  const studyFeature = isPcStudyFeature(feature) ? feature : undefined;
  const notebook = feature === 'notebook';
  const questionFeature = feature === 'choices' || feature === 'traps' || notebook;
  if ((!glossary && !notebook && !questionBundle && !studyFeature) || (Boolean(path) !== (glossary || questionFeature || questionBundle))) {
    return pcJson({ error: '학습 기능을 확인해 주세요.' }, 400);
  }
  const location = path ? pcQuestionLocation(path) : null;
  if ((path && !location) || (glossary && (!term || term.length > 100 || !key || key.length > 12))) {
    return pcJson({ error: '문항과 용어를 확인해 주세요.' }, 400);
  }
  const options = location && path ? pcQuestionOffers(path, studyFeature).map(offer => offer.id)
    : isPcSubject(scope) && studyFeature && getPcStudyCounts(scope)?.[studyFeature] ? [scope] : [];
  if (!options.length) return pcJson({ error: '이 항목의 Pro 자료가 없어요.' }, 404);
  try {
    const viewer = await getPcViewer();
    const publicGlossary = async () => questionBundle && location
      ? { glossaryLabels: await readPcGlossaryLabels(pcQuestionPath(location)) } : {};
    if (!viewer) return pcJson({ error: '로그인하고 이 과목의 Pro를 이용하세요.', ...await publicGlossary() }, 401);
    const pool = () => import('@/lib/daily-challenge/pool');
    for (const id of options) {
      if (!await hasPcPro(viewer.id, id, viewer.beta)) continue;
      if (questionBundle && location) {
        const href = pcQuestionPath(location);
        const [study, note, definitions, glossaryData, questions] = await Promise.all([
          pcQuestionFeatures(href).length ? readPcStudy(id) : null,
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
          traps: study ? questionTraps(study, id, href) : [],
          note,
          definitions,
        });
      }
      if (glossary && location && term && key) {
        const native = await readPcGlossary(id, pcQuestionPath(location));
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
      if (notebook && location) {
        const note = await readPcNotebook(id, pcQuestionPath(location));
        if (note) return pcJson({ note });
        continue;
      }
      const study = await readPcStudy(id);
      if (!study) continue;
      const href = location && pcQuestionPath(location);
      if (feature === 'choices') {
        const choices = study.choices.filter(item => item.href === href);
        if (choices.length) return pcJson({ choices });
      } else if (feature === 'traps') {
        const traps = questionTraps(study, id, href);
        if (traps.length) return pcJson({ traps });
      } else if (feature === 'audio' || feature === 'ox') {
        // Older split purchases can only use cards from their own examination edition.
        const edition = id.startsWith('gugeo-') && id.endsWith('-national') ? '국가직'
          : id.startsWith('gugeo-') && id.endsWith('-local') ? '지방직' : null;
        const ox = edition ? study.ox.filter(item => item.source.includes(edition)) : study.ox;
        if (ox.length) {
          if (params.get('format') === 'inline') {
            const { getPocketOriginals } = await import('@/lib/daily-challenge/pool');
            return pcJson({ ox, originals: getPocketOriginals(ox.flatMap(item => item.href ? [item.href] : [])) });
          }
          return pcJson({ ox });
        }
      } else if (feature === 'cells') {
        if (params.get('format') === 'workbook') {
          return pcJson({ cells: study.cells, cellExams: study.cellExams ?? [] });
        }
        // Pages open before the rollout can still use the previous table response.
        return pcJson({ cells: study.cells.map(sheet => ({ ...sheet,
          columns: sheet.columns.map(column => column.label),
          rows: sheet.rows.flatMap(row => row.kind === 'band' ? [] : [{ ...row,
            cells: row.cells.map(cell => ({ text: cell.value, notes: [cell.explanation].filter(Boolean), sources: cell.sources })),
          }]),
        })) });
      } else if (feature === 'law') {
        return pcJson({ law: study.law });
      }
    }
    return pcJson({ error: '이 기능을 쓰려면 해당 과목의 Pro를 연결해 주세요.', ...await publicGlossary() }, 403);
  } catch {
    return pcJson({ error: '학습 자료를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' }, 503);
  }
}

function questionTraps(study: PcStudy, id: string, href: string | null) {
  const traps = study.traps.filter(item => item.href === href);
  for (const fix of verifiedTraps.filter(item => item.scope === id)) {
    const choice = study.choices.find(item => item.id === fix.choice && item.href === href);
    const at = choice?.text.indexOf(fix.wrong) ?? -1;
    if (choice && at >= 0) {
      traps.push({ id: choice.id, source: choice.source, href: choice.href, explanation: choice.explanation,
        before: choice.text.slice(0, at), after: choice.text.slice(at + fix.wrong.length),
        wrong: fix.wrong, right: fix.right });
    }
  }
  return traps;
}
