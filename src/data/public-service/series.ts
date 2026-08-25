/** 공무원 앱 seriesRegistry와 동일한 직렬·전문과목 구성 */
export type PublicServiceSeries = {
  id: string;
  label: string;
  group: string;
  subjectIds: string[];
  blurb?: string;
};

export const PUBLIC_SERVICE_SERIES: PublicServiceSeries[] = [
  { id: "ilban-haengjeong", label: "일반행정직", group: "행정", subjectIds: ["haengjeongbeop", "hangjunghak"], blurb: "국가직·지방직" },
  { id: "gyoyuk-haengjeong", label: "교육행정직", group: "행정", subjectIds: ["gyoyukhak", "haengjeongbeop"] },
  { id: "goyong-nodong", label: "고용노동직", group: "행정", subjectIds: ["nodongbeop", "haengjeongbeop"] },
  { id: "chulipguk", label: "출입국관리직", group: "행정", subjectIds: ["haengjeongbeop", "gukjebeop"] },
  { id: "sahoe-bokji", label: "사회복지직", group: "행정", subjectIds: ["bokji", "haengjeongbeop"] },
  { id: "semu", label: "세무직", group: "세무·관세", subjectIds: ["sebeop", "hoegyehak"], blurb: "국가직 · 회계학" },
  { id: "gwanse", label: "관세직", group: "세무·관세", subjectIds: ["gwansebeop", "hoegyewonri"], blurb: "회계원리" },
  { id: "gyojeong", label: "교정직", group: "교정·수사", subjectIds: ["gyojeonghak", "hyeongsogaeron"] },
  { id: "geomchal", label: "검찰직", group: "교정·수사", subjectIds: ["hyeongbeop", "hyeongso"] },
  { id: "mayak-susa", label: "마약수사직", group: "교정·수사", subjectIds: ["hyeongbeop", "hyeongso"] },
  { id: "cheoldo-gyeongchal", label: "철도경찰직", group: "교정·수사", subjectIds: ["hyeongbeop", "hyeongsogaeron"] },
  { id: "sobang", label: "소방직", group: "소방", subjectIds: ["sobang", "sobangbeop"], blurb: "소방사 공채" },
];

/** manifest.json 과목 표기와 동일 (시험·학습 홈 라벨) */
export const PUBLIC_SERVICE_SUBJECT_LABELS: Record<string, string> = {
  haengjeongbeop: "행정법총론",
  hangjunghak: "행정학개론",
  gyoyukhak: "교육학개론",
  nodongbeop: "노동법개론",
  gukjebeop: "국제법개론",
  bokji: "사회복지학개론",
  sebeop: "세법개론",
  hoegyehak: "회계학",
  gwansebeop: "관세법개론",
  hoegyewonri: "회계원리",
  gyojeonghak: "교정학개론",
  hyeongsogaeron: "형사소송법개론",
  hyeongbeop: "형법",
  hyeongso: "형사소송법",
  sobang: "소방학개론",
  sobangbeop: "소방관계법규",
};
