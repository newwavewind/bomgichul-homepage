import { plainStudyText } from "@/lib/study-text";

export type ExamTableCell =
  | string
  | { text?: string; colSpan?: number; rowSpan?: number; align?: "left" | "center" };

export interface ExamStructuredTable {
  caption?: string;
  lead?: string;
  headers?: string[];
  headerRows?: Array<Array<string | { text?: string; colSpan?: number; rowSpan?: number }>>;
  rows: ExamTableCell[][];
  notes?: string[];
}

export interface ExamTAccount {
  title: string;
  debit?: [string, string][];
  credit?: [string, string][];
}

function cellInfo(cell: ExamTableCell) {
  if (typeof cell === "string") return { text: cell, colSpan: 1, rowSpan: 1, align: undefined };
  return {
    text: cell?.text ?? "",
    colSpan: cell?.colSpan ?? 1,
    rowSpan: cell?.rowSpan ?? 1,
    align: cell?.align,
  };
}

function MaterialTable({ table }: { table: ExamStructuredTable }) {
  if (!table.rows?.length) return null;
  const headerRows = table.headerRows?.length
    ? table.headerRows.map((row) => row.map(cellInfo))
    : table.headers?.length
      ? [table.headers.map(cellInfo)]
      : [];
  const columns = Math.max(
    1,
    ...table.rows.map((row) => row.reduce((sum, cell) => sum + cellInfo(cell).colSpan, 0)),
    ...headerRows.map((row) => row.reduce((sum, cell) => sum + cell.colSpan, 0)),
  );

  return (
    <div className="space-y-3">
      {table.lead ? <p className="whitespace-pre-line font-display text-body leading-relaxed text-ink">{plainStudyText(table.lead)}</p> : null}
      <div className="overflow-x-auto rounded-[var(--radius-cards)] border border-carbon bg-white p-3">
        {table.caption ? <p className="mb-2 text-center font-display text-body-sm font-medium text-smoke">{plainStudyText(table.caption)}</p> : null}
        <table className="w-full border-collapse font-system text-[14px] text-ink" style={{ minWidth: `${Math.max(20, columns * 6)}rem` }}>
          {headerRows.length ? (
            <thead>
              {headerRows.map((row, rowIndex) => (
                <tr key={`header-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <th key={`header-${rowIndex}-${cellIndex}`} colSpan={cell.colSpan > 1 ? cell.colSpan : undefined} rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined} className="border border-ash bg-snow px-3 py-2 text-center font-semibold">
                      {plainStudyText(cell.text)}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          ) : null}
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((rawCell, cellIndex) => {
                  const cell = cellInfo(rawCell);
                  const align = cell.align ?? (cellIndex === 0 && cell.colSpan === 1 ? "left" : "center");
                  return (
                    <td key={`cell-${rowIndex}-${cellIndex}`} colSpan={cell.colSpan > 1 ? cell.colSpan : undefined} rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined} className={`border border-ash px-3 py-2 leading-relaxed ${align === "left" ? "text-left" : "text-center tabular-nums"}`}>
                      {plainStudyText(cell.text)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {table.notes?.length ? (
          <ul className="mt-3 space-y-1 font-system text-[13px] leading-relaxed text-smoke">
            {table.notes.map((note, index) => <li key={index}>※ {plainStudyText(note)}</li>)}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function TAccounts({ accounts }: { accounts: ExamTAccount[] }) {
  if (!accounts.length) return null;
  return (
    <div className="grid gap-3 rounded-[var(--radius-cards)] border border-carbon bg-white p-4 sm:grid-cols-2">
      {accounts.map((account, index) => (
        <div key={`${account.title}-${index}`}>
          <p className="border-b border-carbon pb-1 text-center font-display text-body-sm font-semibold text-ink">{account.title}</p>
          <div className="mt-1 flex">
            {[account.debit ?? [], account.credit ?? []].map((entries, side) => (
              <div key={side} className={`min-w-0 flex-1 space-y-1 px-2 ${side === 1 ? "border-l border-ash" : ""}`}>
                {entries.map(([label, amount], entryIndex) => (
                  <div key={entryIndex} className="flex justify-between gap-2 font-system text-[13px] text-ink"><span>{label}</span><span className="tabular-nums">{amount}</span></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExamStructuredMaterials({
  table,
  tAccounts,
  stemTail,
}: {
  table?: ExamStructuredTable | ExamStructuredTable[];
  tAccounts?: ExamTAccount[];
  stemTail?: string;
}) {
  const tables = (Array.isArray(table) ? table : [table]).filter((item): item is ExamStructuredTable => Boolean(item));
  if (!tables.length && !tAccounts?.length && !stemTail) return null;
  return (
    <div className="mt-5 space-y-4">
      {tables.map((item, index) => <MaterialTable key={index} table={item} />)}
      {tAccounts?.length ? <TAccounts accounts={tAccounts} /> : null}
      {stemTail ? <p className="whitespace-pre-line font-display text-body leading-relaxed text-ink">{plainStudyText(stemTail)}</p> : null}
    </div>
  );
}
