/**
 * AI 답변을 앱에서 보이는 그대로 그린다.
 *
 * 앱의 src/components/AiAnswerBody.jsx 를 옮겨 왔다. 관리자 화면에서 캡처해
 * 쓸 일이 있어, 색과 크기를 앱과 같은 slate 계열로 맞춰 두었다 — 홈페이지의
 * 색 토큰으로 바꾸면 같은 글이 다른 모양으로 찍힌다.
 *
 * 수평선(---)은 그리지 않고 여백으로만 받는 것도 앱과 같다.
 */
import type { ReactNode } from "react";

/** **굵게** · *기울임* · `코드` 를 살린다 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pieces = String(text).split(/(\*\*[^*]+\*\*|(?<!\*)\*[^*\n]+\*(?!\*)|`[^`\n]+`)/g);

  return pieces.filter(Boolean).map((piece, i) => {
    const key = `${keyPrefix}-i${i}`;

    if (/^\*\*[^*]+\*\*$/.test(piece)) {
      return (
        <strong key={key} className="font-bold text-slate-900">
          {piece.slice(2, -2)}
        </strong>
      );
    }
    if (/^\*[^*\n]+\*$/.test(piece)) {
      return (
        <em key={key} className="italic">
          {piece.slice(1, -1)}
        </em>
      );
    }
    if (/^`[^`\n]+`$/.test(piece)) {
      return (
        <code key={key} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.92em] text-slate-700">
          {piece.slice(1, -1)}
        </code>
      );
    }
    return <span key={key}>{piece}</span>;
  });
}

const isTableRow = (line: string) => /^\s*\|.*\|\s*$/.test(line);
const isHorizontalRule = (line: string) => /^\s*([-*_])\s*(\1\s*){2,}$/.test(line);

function parseCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

const isDividerRow = (line: string) => parseCells(line).every((c) => /^:?-{2,}:?$/.test(c));

function Table({ rows, keyPrefix }: { rows: string[]; keyPrefix: string }) {
  const body = rows.filter((r) => !isDividerRow(r)).map(parseCells);
  if (!body.length) return null;
  const [head, ...rest] = body;

  return (
    <div className="my-1 overflow-x-auto">
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th
                key={`${keyPrefix}-h${i}`}
                className="border border-slate-200 bg-slate-50 px-2 py-1.5 text-left font-bold text-slate-600"
              >
                {renderInline(cell, `${keyPrefix}-h${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rest.map((row, r) => (
            <tr key={`${keyPrefix}-r${r}`}>
              {row.map((cell, c) => (
                <td
                  key={`${keyPrefix}-r${r}c${c}`}
                  className="border border-slate-200 px-2 py-1.5 align-top"
                >
                  {renderInline(cell, `${keyPrefix}-r${r}c${c}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const HEADING_CLASS: Record<number, string> = {
  1: "mt-2 text-[15px] font-bold text-slate-900",
  2: "mt-2 text-[14px] font-bold text-slate-900",
  3: "mt-1.5 text-[13px] font-bold text-slate-800",
};

export function AiAnswerBody({ text }: { text: string }) {
  const lines = String(text ?? "").split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const key = `n${i}`;

    // ``` 코드 블록
    if (/^\s*```/.test(line)) {
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1;
      nodes.push(
        <pre key={key} className="overflow-x-auto rounded-lg bg-slate-100 p-2.5 text-[11px] leading-relaxed">
          {buf.join("\n")}
        </pre>
      );
      continue;
    }

    // 표
    if (isTableRow(line)) {
      const rows: string[] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(lines[i]);
        i += 1;
      }
      nodes.push(<Table key={key} rows={rows} keyPrefix={key} />);
      continue;
    }

    // 수평선 — 긴 줄은 그리지 않고 여백으로만 받는다
    if (isHorizontalRule(line)) {
      nodes.push(<div key={key} className="h-1.5" />);
      i += 1;
      continue;
    }

    // 인용
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""));
        i += 1;
      }
      nodes.push(
        <blockquote
          key={key}
          className="border-l-[3px] border-slate-300 bg-slate-50 py-1.5 pl-2.5 pr-2 text-[12.5px]"
        >
          {buf.map((b, bi) => (
            <p key={`${key}-q${bi}`}>{renderInline(b, `${key}-q${bi}`)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 제목
    const heading = line.match(/^\s*(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      nodes.push(
        <p key={key} className={HEADING_CLASS[level]}>
          {renderInline(heading[2], key)}
        </p>
      );
      i += 1;
      continue;
    }

    // 번호 목록
    const ordered = line.match(/^(\s*)(\d+)[.)]\s+(.*)$/);
    if (ordered) {
      const indent = ordered[1].length >= 2 ? "ml-3.5" : "";
      nodes.push(
        <p key={key} className={`flex gap-1.5 ${indent}`}>
          <span className="shrink-0 font-bold text-slate-400">{ordered[2]}.</span>
          <span>{renderInline(ordered[3], key)}</span>
        </p>
      );
      i += 1;
      continue;
    }

    // 글머리 목록
    const bullet = line.match(/^(\s*)[-*+·•]\s+(.*)$/);
    if (bullet) {
      const indent = bullet[1].length >= 2 ? "ml-3.5" : "";
      nodes.push(
        <p key={key} className={`flex gap-1.5 ${indent}`}>
          <span aria-hidden="true" className="shrink-0 opacity-45">
            ·
          </span>
          <span>{renderInline(bullet[2], key)}</span>
        </p>
      );
      i += 1;
      continue;
    }

    // 빈 줄 — 문단 사이 숨 쉴 자리
    if (!line.trim()) {
      if (nodes.length) nodes.push(<div key={key} className="h-1.5" />);
      i += 1;
      continue;
    }

    nodes.push(<p key={key}>{renderInline(line, key)}</p>);
    i += 1;
  }

  return <div className="flex flex-col gap-0.5 text-[13px] leading-relaxed text-slate-800">{nodes}</div>;
}
