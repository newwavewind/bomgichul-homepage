import type { ArchiveSubject } from "@/lib/constants";
import type { ResourceType } from "@/types/database";

/** 자료실 초기 게시글 (봄기출 계정으로 게시). 파일은 public/archive-seed/에서 가져와 업로드한다. */
export interface ArchiveSeedFile {
  fileName: string;
  title: string;
  content: string;
  resourceType: ResourceType;
  subject: ArchiveSubject;
  mimeType: string;
}

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const ARCHIVE_SEED_FILES: ArchiveSeedFile[] = [
  {
    fileName: "법령개정요약_2026.docx",
    title: "[법령정보] 2026년 공인중개사 관련 법령 개정 요약 (문서)",
    content:
      "2026년 공인중개사 관련 법령 개정사항과 제37회 시험 일정을 한 장으로 정리했어요. 실무교육 시간 확대, 공인중개사법 일부개정 시행일, 시험 일정까지 한 번에 확인하세요. 정확한 조문은 국가법령정보센터(law.go.kr) 원문을 함께 확인하시길 권장드려요.",
    resourceType: "summary",
    subject: "other",
    mimeType: DOCX_MIME,
  },
  {
    fileName: "오답노트_템플릿.xlsx",
    title: "[템플릿] 공인중개사 오답노트 (엑셀)",
    content:
      "틀린 문제를 과목·연도·문제번호별로 기록하고, 1~3회독 체크박스로 회독 여부를 관리할 수 있는 오답노트 템플릿입니다. 모든 과목에 공통으로 사용할 수 있어요.",
    resourceType: "note",
    subject: "other",
    mimeType: XLSX_MIME,
  },
  {
    fileName: "회독계획표.xlsx",
    title: "[템플릿] D-day 회독 계획표 (엑셀)",
    content:
      "시험일을 입력하면 D-day가 자동으로 계산되는 회독 계획표입니다. 주차별로 6과목 회독 여부를 체크하며 학습 진도를 관리해보세요.",
    resourceType: "note",
    subject: "other",
    mimeType: XLSX_MIME,
  },
  {
    fileName: "출제빈도분석_2016-2025.xlsx",
    title: "[통계] 전 과목 10개년 출제 빈도 분석 (2016~2025)",
    content:
      "2016~2025년 실제 기출 데이터를 과목별·주제별로 집계한 출제 빈도 분석 자료입니다. 과목마다 어떤 주제가 가장 많이 나왔는지 순위와 비중(%)으로 확인할 수 있어요. 전 과목 시트가 포함되어 있습니다.",
    resourceType: "summary",
    subject: "other",
    mimeType: XLSX_MIME,
  },
  {
    fileName: "부동산학개론_핵심요약노트.docx",
    title: "[부동산학개론] 핵심 요약노트 (출제 비중 상위 7개 주제)",
    content:
      "부동산학개론 10개년 기출 중 출제 비중이 높은 7개 주제(부동산투자론·경제론·금융론·정책론·시장론·개발관리론·감정평가)를 압축 정리했어요. 자주 틀리는 함정 포인트도 함께 담았습니다.",
    resourceType: "summary",
    subject: "realestate",
    mimeType: DOCX_MIME,
  },
  {
    fileName: "부동산학개론_빈칸채우기.docx",
    title: "[부동산학개론] 빈칸 채우기 연습지 20문항",
    content:
      "부동산학개론 핵심 개념을 빈칸 채우기 형식으로 연습할 수 있는 20문항입니다. 정답은 문서 맨 뒤에 있어요.",
    resourceType: "note",
    subject: "realestate",
    mimeType: DOCX_MIME,
  },
];
