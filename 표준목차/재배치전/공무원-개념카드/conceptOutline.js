/**
 * 기출 올인원의 뼈대 — 봄기출 표준 목차 그대로.
 *
 * 예전에는 미리 써 둔 개념카드를 늘어놓고 그 카드가 가진 이름으로 층을 만들었다.
 * 그런데 표준 목차(에듀윌·박문각·해커스 세 곳을 대조해 세운 것)로 문항을 전부
 * 갈아 끼운 뒤로, 카드는 장까지만 따라오고 절에서 멈춰 있었다. 그래서 화면에
 * 장 이름이 위아래로 두 번 나오고(「제1장 행정의 의의」 아래에 「행정의 의의」 하나),
 * 표준 목차에 있는 절이 아예 보이지 않았다.
 *
 * 이제 뼈대를 카드가 아니라 목차로 세운다. 「목차별」 화면(`HomeScreen`)이 보는 그
 * 접근자를 똑같이 쓰므로 — `getCurriculumForSubject` 로 목차를 얻고
 * `getChapterSections` 로 절을 센다 — 두 화면의 편·장·절이 어긋날 수 없다.
 * 절 하나가 곧 한 자리이고, 그 자리에서 AI 가 개념을 쓴다.
 *
 * 기출 지문과 관련 기출도 절을 따라간다 — 절이 들고 있는 category·subcategory 가
 * 그 절에 배정된 문항을 그대로 가리키기 때문이다.
 */

import {
  getChapterSections,
  getCurriculumForSubject,
  hasCurriculumForSubject,
} from '../curriculum.js'

/** 이 과목에 표준 목차가 있는가. 없으면 화면은 예전 방식으로 물러선다. */
export function hasOutline(subjectId) {
  if (!hasCurriculumForSubject(subjectId)) return false
  return Boolean(getCurriculumForSubject(subjectId)?.parts?.length)
}

/**
 * 표준 목차를 화면이 쓰는 모양(편 → 장 → 자리)으로 편다.
 * 돌려주는 모양은 예전 `groupByPartAndSection` 과 같다 — 화면 코드를 그대로 쓰기 위함이다.
 *
 * @param {string} subjectId
 * @returns {Array<{ chapter: string, sections: Array<{ section: string, orderNo: string, items: object[] }> }>}
 */
export function buildOutlineParts(subjectId) {
  if (!hasOutline(subjectId)) return []
  const curriculum = getCurriculumForSubject(subjectId)

  return curriculum.parts.map((part) => {
    const partName = part.shortLabel || part.label || ''
    return {
      chapter: partName,
      sections: (part.chapters || []).map((chapter, chapterIndex) => {
        const chapterName = chapter.shortLabel || chapter.label || ''
        return {
          section: chapterName,
          orderNo: String(chapterIndex + 1).padStart(2, '0'),
          items: getChapterSections(chapter).map((sec) => ({
            // 자리마다 고르는 열쇠. 진도도 이 열쇠로 쌓인다.
            slug: `outline:${part.id}:${chapter.id}:${sec.id}`,
            titleKo: sec.label,
            chapterKo: partName,
            sectionKo: chapterName,
            // 무료·유료를 가르는 열쇠. 기출 화면이 장으로 가르므로 여기도 장으로 가른다.
            partId: part.id,
            chapterId: chapter.id,
            // 이 둘이 기출 지문·관련 기출을 끌어오는 다리다.
            category: sec.filter?.category ?? null,
            subcategory: sec.filter?.subcategory ?? null,
            outline: true,
          })),
        }
      }),
    }
  })
}

/** 이 과목의 자리가 모두 몇인가 — 머리에 얹는 숫자. */
export function countOutlineItems(parts) {
  let n = 0
  for (const part of parts) {
    for (const section of part.sections) n += section.items.length
  }
  return n
}
