import { Fragment } from 'react'
import './examConceptNote.css'
import NoteSpiral from './NoteSpiral'
import PencilGlyphIcon from './PencilGlyphIcon'

/** 개념 글 안의 `**강조**` 만 굵게 그린다 — 마크다운 전체를 끌어오지 않고
 * 딱 이 한 가지 표시만 지원한다. 문장 하나에 진짜 중요한 말은 하나둘뿐이라,
 * 그 이상을 굵게 만들 필요가 없다. */
function withEmphasis(text) {
  const parts = String(text ?? '').split(/\*\*(.+?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
  )
}

/**
 * 문항 맨 아래, 정답을 확인한 뒤에 펼쳐지는 「핵심 개념」.
 *
 * 이건 선지 다섯 개 해설을 이어 붙인 것이 아니다. 선지 해설은 「왜 이 선지가
 * 참/거짓인가」를 답하고, 핵심 개념은 **이 문항을 풀려면 무엇을 알아야 했는가**를
 * 답한다 — 교과서 없이 이 문항 하나로 그 단원의 핵심이 서게 쓴다. 그래서 선지
 * 문장을 참고하지 않고 새로 쓴다.
 *
 * 한국사는 왕·나라·사건이 서로 닮은꼴로 되풀이돼서, 개념이 잘 붙는 결이 저마다
 * 다르다 — 나라별 비교표, 왕대별 연표, 인물 비교, 사건 흐름. 그래서 이 부품은
 * 문장 하나로 다 밀어붙이지 않고 **블록을 쌓는다**. 블록 종류는 다섯.
 *
 *   p        — 이어지는 설명 문단
 *   stack    — 대상마다 카드 하나, 그 안에 라벨 위·값 아래로 세로로 쌓는다. 비교표
 *              대신 항상 이걸 쓴다 — 표는 좁은 화면에서 가로로 밀어야 해서 쓰지
 *              않는다(칸이 두세 개뿐이어도 마찬가지). 세로로만 읽으면 되니 가로로
 *              밀 일이 없다.
 *   timeline — 연표 (사건이 언제 어떤 순서로 일어났는지)
 *   compare  — 두세 묶음을 나란히 놓고 각각의 특징을 점으로 짚는다 (표보다 가벼운 자리)
 *   callout  — 시험이 정말로 묻는 한 줄 (외울 필요 없이 이 한 줄만 붙잡으면 되는 것)
 */
/** @param {{concept: any, short?: string, terms?: any[] | null, bound?: boolean, footer?: import('react').ReactNode}} props */
export default function ExamConceptNote({ concept, short = '', terms = null, bound = true, footer = null }) {
  if (!concept?.블록?.length) return null

  const note = (
    <section className="ecn" aria-label="필기노트">
      <span className="ecn__aurora" aria-hidden />
      <header className="ecn__head">
        <div className="ecn__eyebrow">
          <span className="ecn__badge">
            {/* 연필 타일 — 하단바 「필기」와 같은 연필, 분홍빛 흰 바탕 */}
            <span className="ecn__badge-icon" aria-hidden>
              <PencilGlyphIcon className="ecn__badge-pen" />
            </span>
            <span className="ecn__badge-text">필기노트</span>
          </span>
        </div>
        <h3 className="ecn__title">{concept.제목}</h3>
        {/* 한 줄로 말하면 — 초등학생도 첫 줄에서 요점을 잡는다(필기노트 모음에서 넘겨 준다) */}
        {short ? (
          <p className="ecn__short">
            <span className="ecn__short-label">요약</span>
            {short}
          </p>
        ) : null}
      </header>
      <div className="ecn__body">
        {concept.블록.map((block, i) => (
          <div key={i} className={`ecn__block ecn__block--${block.유형}`} style={{ '--ecn-i': i }}>
            {BLOCK_LABEL[block.유형] ? <p className="ecn__label">{BLOCK_LABEL[block.유형]}</p> : null}
            <ConceptBlock block={block} />
          </div>
        ))}
      </div>
      {terms?.length ? (
        <div className="ecn__terms">
          <p className="ecn__terms-label">용어 사전</p>
          <dl>
            {terms.map(t => (
              <div key={t.term} className="ecn__term">
                <dt>
              {t.term}
              {t.hanja ? (
                <span className="sx-terms__hanja" lang="ko-Hani">
                  ({t.hanja})
                </span>
              ) : null}
            </dt>
                <dd>{t.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
      {/* 원고의 '근거' — 빌드가 sources 로 싣는다 (scripts/history/build_exams.py) */}
      {concept.sources?.length > 0 && <ul className="pc-notebook-sources">
        {concept.sources.map(({ label, url }, index) => (
          <li key={index}>{url ? <a href={url} target="_blank" rel="noreferrer">{label} ↗</a> : label}</li>
        ))}
      </ul>}
      {footer}
    </section>
  )
  // 스프링 제본 — 노트가 나오는 곳(학습 화면·필기노트 모음)마다 같은 모양
  if (!bound) return note
  return (
    <div className="ecn-bound">
      <NoteSpiral />
      {note}
    </div>
  )
}

/** 블록 머리표 — 무엇을 보여 주는 칸인지(문단은 표 없이) */
const BLOCK_LABEL = { stack: '한눈에 정리', steps: '한눈에 정리', timeline: '연표', compare: '비교', callout: '시험 포인트', example: '예시' }

function ConceptBlock({ block }) {
  switch (block.유형) {
    case 'p':
      return <p className="ecn__p">{withEmphasis(block.글)}</p>

    case 'steps':
      return (
        <ol className="ecn__steps">
          {block.줄.map((line, i) => (
            <li key={i} className="ecn__step">
              <span className="ecn__step-no" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="ecn__step-text">{withEmphasis(line)}</span>
            </li>
          ))}
        </ol>
      )

    case 'example':
      return <p className="ecn__p ecn__p--example">{withEmphasis(block.글)}</p>

    case 'callout':
      return (
        <p className="ecn__callout">
          <span className="ecn__callout-text">{withEmphasis(block.글)}</span>
        </p>
      )

    case 'stack':
      return (
        <div className="ecn__stack">
          {block.카드.map((card, i) => (
            <div key={i} className="ecn__stack-card">
              <span className="ecn__stack-no" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="ecn__stack-name">{card.이름}</p>
              <dl className="ecn__stack-rows">
                {card.행.map((row, ri) => (
                  <div key={ri} className="ecn__stack-row">
                    <dt>{row.라벨}</dt>
                    <dd>{withEmphasis(row.값)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )

    case 'timeline':
      return (
        <ol className="ecn__timeline">
          {block.사건.map((ev, i) => (
            <li key={i} className="ecn__timeline-row">
              <span className="ecn__timeline-dot" aria-hidden />
              <span className="ecn__timeline-when">{ev.때}</span>
              <span className="ecn__timeline-what">{withEmphasis(ev.일)}</span>
            </li>
          ))}
        </ol>
      )

    case 'compare':
      return (
        <div
          className={`ecn__compare${block.묶음.length === 2 ? ' ecn__compare--pair' : ''}`}
          style={{ '--ecn-compare-n': block.묶음.length }}
        >
          {block.묶음.length === 2 ? (
            <span className="ecn__vs" aria-hidden>
              VS
            </span>
          ) : null}
          {block.묶음.map((group, i) => (
            <div key={i} className="ecn__compare-card">
              <p className="ecn__compare-name">{group.이름}</p>
              <ul className="ecn__compare-list">
                {group.항목.map((point, pi) => (
                  <li key={pi}>{withEmphasis(point)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}
