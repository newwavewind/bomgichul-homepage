export type SyntaxPracticeCard = {
  id: string;
  no: number;
  sentence: string;
  translation: string;
  audio?: string;
  chunks: { en: string; ko: string; audio?: string }[];
  source: string;
  href: string;
};

export type WordRow = {
  id: string;
  term: string;
  kind: string;
  level: string;
  count: number;
  day: number;
  meanings: string[];
};

export type WordDetail = WordRow & {
  senses: { meaning: string; example: string; translation: string; source: string }[];
  notes: { title: string; entries: [string, string][] }[];
  tip: string;
  more: string;
};
