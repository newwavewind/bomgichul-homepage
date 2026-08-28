/**
 * 홈페이지 개념 목록과 동일: PART → CHAPTER → parent/child 정렬
 */

/** @typedef {import('./index.js').Concept} Concept */

/**
 * @typedef {Object} SectionGroup
 * @property {string} section
 * @property {string} orderNo
 * @property {Concept[]} items
 */

/**
 * @typedef {Object} PartGroup
 * @property {string} chapter
 * @property {SectionGroup[]} sections
 */

/** @param {Concept[]} items */
export function orderWithChildrenAfterParent(items) {
  const bySlug = new Map(items.map((c) => [c.slug, c]))
  /** @type {Map<string, Concept[]>} */
  const childrenByParent = new Map()
  /** @type {Concept[]} */
  const topLevel = []

  for (const concept of items) {
    if (concept.parentSlug && bySlug.has(concept.parentSlug)) {
      const siblings = childrenByParent.get(concept.parentSlug) ?? []
      siblings.push(concept)
      childrenByParent.set(concept.parentSlug, siblings)
    } else {
      topLevel.push(concept)
    }
  }

  /** @type {Concept[]} */
  const ordered = []
  for (const concept of topLevel) {
    ordered.push(concept)
    const children = childrenByParent.get(concept.slug)
    if (children) ordered.push(...children)
  }
  return ordered
}

/** @param {Concept[]} concepts @returns {PartGroup[]} */
export function groupByPartAndSection(concepts) {
  /** @type {PartGroup[]} */
  const parts = []

  for (const concept of concepts) {
    const chapter = concept.chapterKo ?? concept.category
    let part = parts.find((p) => p.chapter === chapter)
    if (!part) {
      part = { chapter, sections: [] }
      parts.push(part)
    }

    const section = concept.sectionKo ?? concept.category
    let sectionGroup = part.sections.find((s) => s.section === section)
    if (!sectionGroup) {
      sectionGroup = {
        section,
        orderNo: String(part.sections.length + 1).padStart(2, '0'),
        items: [],
      }
      part.sections.push(sectionGroup)
    }
    sectionGroup.items.push(concept)
  }

  for (const part of parts) {
    for (const section of part.sections) {
      section.items = orderWithChildrenAfterParent(section.items)
    }
  }

  return parts
}
