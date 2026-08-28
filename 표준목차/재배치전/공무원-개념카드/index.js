import hangjunghak from './hangjunghak.js'
import haengjeongbeop from './haengjeongbeop.js'
import gwansebeop from './gwansebeop.js'
import hyeongbeop from './hyeongbeop.js'
import hyeongso from './hyeongso.js'
import hyeongsogaeron from './hyeongsogaeron.js'
import gyojeonghak from './gyojeonghak.js'
import gyoyukhak from './gyoyukhak.js'
import gukjebeop from './gukjebeop.js'
import sebeop from './sebeop.js'
import jibangsebeop from './jibangsebeop.js'
import nodongbeop from './nodongbeop.js'
import bokji from './bokji.js'
import sobang from './sobang.js'
import sobangbeop from './sobangbeop.js'
import hoegyehak from './hoegyehak.js'
import hoegyewonri from './hoegyewonri.js'

/**
 * @typedef {{ examId?: string, year: number, sourceCode?: string, questionNo: number }} ConceptQuestionRef
 *
 * @typedef {Object} Concept
 * @property {string} slug
 * @property {string} [chapterKo]
 * @property {string} [sectionKo]
 * @property {string} category
 * @property {string} subcategory
 * @property {string} titleKo
 * @property {string} [titleEn]
 * @property {string} definition
 * @property {string} intuition
 * @property {string[]} keyPoints
 * @property {string} pitfalls
 * @property {string} [example]
 * @property {ConceptQuestionRef[]} [questionRefs]
 * @property {string} [parentSlug]
 * @property {string[]} [reviewFlags]
 * @property {Array<{ id: string, type: string, title: string, locator?: string, url?: string, status?: 'verified'|'provisional'|'caution'|'rejected' }>} [sources]
 */

/** @type {Record<string, Concept[]>} */
const CONCEPTS_BY_SUBJECT = {
  hangjunghak,
  admin: hangjunghak,
  haengjeongbeop,
  gwansebeop,
  hyeongbeop,
  hyeongso,
  hyeongsogaeron,
  gyojeonghak,
  gyoyukhak,
  gukjebeop,
  sebeop,
  jibangsebeop,
  nodongbeop,
  bokji,
  sobang,
  sobangbeop,
  hoegyehak,
  hoegyewonri,
}

/** @param {string} [subjectId] */
export function getConceptsForSubject(subjectId = 'hangjunghak') {
  return CONCEPTS_BY_SUBJECT[subjectId] ?? hangjunghak
}

/** @param {string} subjectId @param {string} slug */
export function getConcept(subjectId, slug) {
  return getConceptsForSubject(subjectId).find(c => c.slug === slug)
}

/**
 * @param {Concept} concept
 * @param {Array<{ year: number, question_no?: number, questionNo?: number, category?: string, subcategory?: string, id?: string }>} exams
 */
export function getConceptQuestions(concept, exams) {
  if (!exams?.length) return []

  if (concept.questionRefs?.length) {
    return concept.questionRefs
      .map(ref =>
        exams.find(
          q =>
            (ref.examId
              ? q.id === ref.examId
              : q.year === ref.year &&
                (!ref.sourceCode || q.source_code === ref.sourceCode) &&
                (q.question_no === ref.questionNo || q.questionNo === ref.questionNo)),
        ),
      )
      .filter(Boolean)
      .sort((a, b) => b.year - a.year || (a.question_no ?? 0) - (b.question_no ?? 0))
  }

  return exams
    .filter(q => q.category === concept.category && q.subcategory === concept.subcategory)
    .sort((a, b) => b.year - a.year || (a.question_no ?? 0) - (b.question_no ?? 0))
}

/** @param {Concept} concept @param {unknown[]} exams */
export function getConceptQuestionCount(concept, exams) {
  return getConceptQuestions(concept, exams).length
}

/** @param {Concept} concept */
export function conceptHasReviewFlags(concept) {
  if (concept?.reviewFlags?.length) return true
  const texts = [
    concept?.definition,
    concept?.intuition,
    concept?.pitfalls,
    ...(concept?.keyPoints || []),
  ]
  return texts.some(t => typeof t === 'string' && (t.includes('【주의】') || t.includes('주의')))
}
