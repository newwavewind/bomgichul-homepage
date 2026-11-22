import editions from "@/data/exam-print-editions.json";

const files: Partial<Record<string, string>> = editions;
const entries = Object.entries(editions).map(([key, file]) => {
  const [track, subject, year, session] = key.split("/");
  return { track, subject, year: Number(year), session, file };
});

export function examPrintHref(track: string, subject: string, year: number, session: string) {
  const file = files[`${track}/${subject}/${year}/${session}`];
  return file ? `/exam-print/${file}` : undefined;
}

export function hasExamPrintEditions(track: string) {
  return entries.some((entry) => entry.track === track);
}

export function examPrintOptions(track: string) {
  return entries.filter((entry) => entry.track === track);
}
