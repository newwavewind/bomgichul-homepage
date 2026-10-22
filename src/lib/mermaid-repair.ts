/**
 * AI 답 흐름도(mermaid) 손질 — 앱 src/utils/mermaidRepair.js · 서버 ai-explain 의 repairMermaid 와 **같은 규칙**(2026-10-22).
 * 예비 모델이 `flow`, `P1((P*)_1)` 처럼 써서 그림 대신 코드가 보였다. `flow` → flowchart, 방향 없는 graph 에 TD,
 * 괄호·별표 든 마디 이름은 따옴표, 영문 아닌 마디 id 는 k1… 로 바꾼다. 올바른 그림은 그대로 둔다.
 */
const MMD_FLOW_HEAD = /^(graph|flowchart)\b\s*(TD|TB|BT|RL|LR)?\s*;?\s*$/i
const MMD_DIAGRAM_HEAD = /^(graph|flowchart|flow|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|gantt|pie|mindmap|timeline|journey|quadrantChart|xychart-beta|block-beta)\b/i
const MMD_ARROW = /(\s*(?:<-->|<==>|--[^-<>\n]*?-->|==[^=<>\n]*?==>|-\.[^.\n]*?\.->|-->|---|-\.->|==>|--o|--x|-\.-)\s*(?:\|[^|]*\|\s*)?)/
const MMD_RISKY = /[()[\]{}*&;:#"<>|]/

export function looksLikeMermaid(code: string): boolean {
  const first = String(code ?? '').split('\n').map((l) => l.trim()).find(Boolean) || ''
  return MMD_DIAGRAM_HEAD.test(first)
}

function mmdFixHead(line: string): string {
  const t = line.trim()
  const flow = t.match(/^flow(?!chart)\b\s*(TD|TB|BT|RL|LR)?/i)
  if (flow) return `flowchart ${(flow[1] || 'TD').toUpperCase()}`
  const m = t.match(MMD_FLOW_HEAD)
  if (m) return `${m[1].toLowerCase()} ${(m[2] || 'TD').toUpperCase()}`
  return line
}

function mmdFixNode(segment: string, ids: Map<string, string>): string {
  const lead = (segment.match(/^\s*/) as RegExpMatchArray)[0]
  const trail = (segment.match(/\s*$/) as RegExpMatchArray)[0]
  const body = segment.trim()
  if (!body) return segment
  const m = body.match(/^([^\s[\](){}"]+)([\s\S]*)$/)
  if (!m) return segment
  const id = m[1]
  const shape = m[2]
  let label: string | null = null
  let open = ''
  let close = ''
  if (shape) {
    const shapes: [string, string][] = [['((', '))'], ['[', ']'], ['{', '}'], ['(', ')']]
    const hit = shapes.find(([o, c]) => shape.startsWith(o) && shape.endsWith(c) && shape.length >= o.length + c.length)
    if (!hit) return segment
    ;[open, close] = hit
    label = shape.slice(open.length, shape.length - close.length)
  }
  let newId = id
  if (!/^[A-Za-z_][\w-]*$/.test(id)) {
    if (!ids.has(id)) ids.set(id, `k${ids.size + 1}`)
    newId = ids.get(id) as string
    if (label == null) {
      label = id
      open = '['
      close = ']'
    }
  }
  if (label != null) {
    const quoted = /^"[\s\S]*"$/.test(label.trim())
    if (!quoted && MMD_RISKY.test(label)) label = `"${label.replace(/"/g, "'")}"`
    return `${lead}${newId}${open}${label}${close}${trail}`
  }
  return `${lead}${newId}${trail}`
}

function mmdFixFlowLine(line: string, ids: Map<string, string>): string {
  const t = line.trim()
  if (!t || /^(%%|subgraph\b|end\b|style\b|classDef\b|class\b|click\b|linkStyle\b|direction\b)/.test(t)) return line
  return line
    .split(MMD_ARROW)
    .map((part, i) => (i % 2 === 1 ? part : part.split(/(\s&\s)/).map((seg, j) => (j % 2 === 1 ? seg : mmdFixNode(seg, ids))).join('')))
    .join('')
}

export function repairMermaid(code: string): string {
  const lines = String(code ?? '').split('\n')
  const headAt = lines.findIndex((l) => l.trim())
  if (headAt < 0) return String(code ?? '')
  lines[headAt] = mmdFixHead(lines[headAt])
  if (!/^(graph|flowchart)\b/i.test(lines[headAt].trim())) return lines.join('\n')
  const ids = new Map<string, string>()
  for (let i = headAt + 1; i < lines.length; i += 1) lines[i] = mmdFixFlowLine(lines[i], ids)
  return lines.join('\n')
}
