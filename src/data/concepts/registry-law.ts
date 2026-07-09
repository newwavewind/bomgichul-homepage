import type { Concept } from "@/lib/concepts";

const concepts: Concept[] = [
  // ───────── 공간정보관리법 ─────────
  {
    slug: "land-alteration-registration",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "토지의 이동",
    titleKo: "지번부여·등록전환·합병과 직권 정정",
    titleEn: "Lot Numbering, Conversion, Merger, and Ex Officio Correction",
    definition:
      "지적소관청은 도시개발사업 등이 준공되기 전에 사업시행자의 신청이 있으면 지적확정측량을 실시한 지역의 지번부여 방법을 준용해 지번을 부여할 수 있고, 합병하려는 토지는 지목·지번부여지역·소유자가 같아야 하며, 토지의 표시에 오류가 있으면 지적소관청이 직권으로 조사·측량하여 정정한다.",
    intuition:
      "지번·지목·경계 등 토지의 기본 표시사항을 새로 만들거나(등록전환) 합치거나(합병) 고칠 때(직권정정), 신청인의 뜻과 무관하게 지적소관청이 실체적 사실관계를 직접 확인해 등록을 좌우한다는 공통점이 있다.",
    keyPoints: [
      "도시개발사업 등 준공 전 지번부여는 지적확정측량을 실시한 지역의 지번부여 방법을 준용한다.",
      "합병하려는 토지는 지목·지번부여지역이 같고 소유자의 소유권이전등기 연월일도 같아야 하지만, 지적도의 축척이 다르다는 사정만으로는 합병이 제한되지 않는다.",
      "등록전환 시 임야대장 면적과 실제 등록전환 면적의 차이가 허용범위를 초과하면, 지적소관청이 임야대장의 면적 또는 임야도의 경계를 직권으로 정정한다.",
      "토지소유자의 신청이 없어도 지적소관청은 토지이동현황을 직권으로 조사·측량하여 지번·지목·면적 등을 결정할 수 있다.",
    ],
    pitfalls:
      "합병 제한사유로 '지적도 축척이 다른 경우'를 떠올리기 쉽지만, 실제 제한사유는 소유권이전등기 연월일이 다른 경우이고 축척 차이는 제한사유가 아니다.",
    example:
      "등록전환 대상 토지의 임야대장 면적과 실제 측량 면적의 차이가 허용범위를 넘으면, 지적소관청은 임야대장의 면적을 직권으로 정정한다.",
    questionRefs: [
      { year: 2016, questionNo: 5 },
      { year: 2016, questionNo: 12 },
      { year: 2017, questionNo: 8 },
      { year: 2020, questionNo: 6 },
      { year: 2021, questionNo: 7 },
      { year: 2022, questionNo: 3 },
      { year: 2024, questionNo: 4 },
      { year: 2024, questionNo: 6 },
      { year: 2024, questionNo: 7 },
    ],
  },
  {
    slug: "scale-conversion",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "토지의 이동",
    parentSlug: "land-alteration-registration",
    titleKo: "축척변경의 절차와 청산금",
    titleEn: "Scale Conversion Procedure and Settlement Payments",
    definition:
      "축척변경은 지적소관청이 토지소유자 3분의 2 이상의 동의를 받아 축척변경위원회의 의결과 시·도지사(또는 대도시 시장)의 승인을 거쳐 시행하며, 시행에 따른 면적 증감은 청산금으로 정산한다.",
    intuition:
      "축척변경은 지적도의 축척을 바꾸는 것뿐 아니라 그 과정에서 생기는 면적 증감을 돈으로 정산하는 절차까지 포함하므로, 동의 → 위원회 의결 → 승인 → 시행공고 → 청산금 → 확정공고의 흐름으로 이해해야 한다.",
    keyPoints: [
      "축척변경을 신청하는 토지소유자는 시행지역 토지소유자 3분의 2 이상의 동의를 받아야 한다.",
      "축척변경위원회는 시행계획, 지번별 제곱미터당 금액 결정, 청산금의 산정·이의신청에 관한 사항을 심의·의결하지만, 축척변경 '승인'에 관한 사항은 위원회의 심의·의결사항이 아니다.",
      "청산금 납부·지급이 완료되면 지적소관청은 지체 없이 확정공고를 하고, 확정공고 후에는 지체 없이 확정된 사항을 지적공부에 등록해야 한다.",
    ],
    pitfalls:
      "축척변경 '승인'을 축척변경위원회의 심의·의결사항으로 착각하기 쉽지만, 승인 권한은 위원회가 아니라 시·도지사 등에게 있다.",
    example:
      "토지소유자들이 축척변경을 신청하려면 시행지역 토지소유자 3분의 2 이상의 동의를 받아 지적소관청에 신청해야 한다.",
    questionRefs: [
      { year: 2016, questionNo: 10 },
      { year: 2017, questionNo: 5 },
      { year: 2018, questionNo: 12 },
      { year: 2019, questionNo: 5 },
      { year: 2020, questionNo: 4 },
      { year: 2020, questionNo: 11 },
      { year: 2021, questionNo: 10 },
      { year: 2022, questionNo: 2 },
      { year: 2022, questionNo: 7 },
      { year: 2022, questionNo: 11 },
      { year: 2023, questionNo: 8 },
      { year: 2023, questionNo: 11 },
      { year: 2024, questionNo: 12 },
      { year: 2025, questionNo: 7 },
    ],
  },
  {
    slug: "development-project-special-case",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "토지의 이동",
    parentSlug: "land-alteration-registration",
    titleKo: "도시개발사업 등 시행지역의 토지이동신청 특례",
    titleEn: "Special Rules for Land Movement in Development Project Areas",
    definition:
      "도시개발법·농어촌정비법·도시 및 주거환경정비법·주택법·택지개발촉진법 등에 따른 사업시행자는 사업의 착수·변경·완료 사실을 지적소관청에 신고해야 하며, 사업시행자가 신청할 수 없는 경우에는 시공보증자나 입주예정자 등이 대신 신청할 수 있다.",
    intuition:
      "대규모 개발사업 지역은 토지의 형질이 통째로 바뀌므로, 개별 토지이동 신청 대신 사업 단계(착수·변경·완료)에 맞춰 일괄 신고하는 특례를 두고 있다.",
    keyPoints: [
      "사업의 착수·변경·완료 사실은 그 사유가 발생한 날부터 15일 이내에 지적소관청에 신고해야 한다.",
      "농어촌정비사업의 경우 토지의 이동은 형질변경 등 공사가 '준공된 때'를 기준으로 하며, '착수(시행)된 때'가 아니다.",
      "주택건설사업 시행자가 파산 등으로 토지이동 신청을 할 수 없을 때는 시공보증자나 입주예정자 등이 대신 신청할 수 있다.",
    ],
    pitfalls:
      "농어촌정비사업의 토지이동 시기를 '공사 착수 시'로 착각하기 쉽지만, 기준 시점은 '공사가 준공된 때'이다.",
    example:
      "택지개발사업이 환지를 수반하는 경우, 사업완료 신고를 함으로써 별도의 토지이동 신청을 갈음할 수 있다.",
    questionRefs: [
      { year: 2019, questionNo: 9 },
      { year: 2020, questionNo: 9 },
      { year: 2023, questionNo: 2 },
      { year: 2025, questionNo: 5 },
    ],
  },
  {
    slug: "land-record-notification-procedure",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "토지의 이동",
    parentSlug: "land-alteration-registration",
    titleKo: "지적정리의 통지와 소유자 등록",
    titleEn: "Notification of Cadastral Changes and Owner Registration",
    definition:
      "지적소관청은 토지의 표시에 관한 변경등기가 필요한 경우 지체 없이 관할 등기관서에 등기를 촉탁해야 하고, 직권 정정·행정구역 개편 등으로 토지의 표시가 달라진 경우에는 토지소유자에게 그 사실을 통지해야 하며, 신규등록의 경우에는 등기부가 없으므로 지적소관청이 직접 조사하여 소유자를 등록한다.",
    intuition:
      "지적공부와 등기부는 서로 다른 기관이 관리하는 별개의 장부이므로, 한쪽의 표시가 바뀌면 다른 쪽에도 반영되도록 '촉탁'과 '통지'라는 연결 장치를 두고 있다.",
    keyPoints: [
      "지적소관청은 토지의 표시 변경에 관한 등기가 필요하면 지체 없이 관할 등기관서에 그 등기를 촉탁해야 한다.",
      "직권 조사·측량에 의한 정정, 채권자대위에 의한 토지이동 등록, 행정구역 개편에 따른 지번 변경 등은 모두 토지소유자에게 통지해야 하는 사유에 해당한다.",
      "신규등록의 경우에는 등기부가 존재하지 않으므로, 토지소유자에 관한 사항은 등기관서의 등기필통지에 의하지 않고 지적소관청이 직접 조사하여 등록한다.",
    ],
    pitfalls:
      "토지소유자 정리의 근거를 '축척변경'이나 '등록전환'으로 착각하기 쉬운데, 등기부가 없어 지적소관청이 직접 조사하는 경우는 신규등록이다.",
    example:
      "행정구역 개편으로 어떤 토지가 다른 지번부여지역에 속하게 되어 지적소관청이 새 지번을 부여한 경우, 지적소관청은 그 토지소유자에게 이 사실을 통지해야 한다.",
    questionRefs: [
      { year: 2017, questionNo: 10 },
      { year: 2017, questionNo: 12 },
      { year: 2019, questionNo: 12 },
      { year: 2020, questionNo: 10 },
      { year: 2022, questionNo: 10 },
      { year: 2023, questionNo: 6 },
    ],
  },
  {
    slug: "cadastral-books-classification",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지적공부",
    titleKo: "지적공부별 등록사항의 구분",
    titleEn: "Registered Items by Type of Cadastral Book",
    definition:
      "토지대장·임야대장에는 지번·지목·면적 등이, 경계점좌표등록부에는 좌표가 등록되며, 각 지적공부마다 등록하는 항목이 다르다.",
    intuition:
      "지적공부가 여러 종류로 나뉘는 이유는 '표시할 정보의 성격'이 다르기 때문이므로, 어떤 정보가 어느 장부의 몫인지 짝짓는 것이 이 단원의 핵심이다.",
    keyPoints: [
      "좌표는 경계점좌표등록부의 등록사항이며, 토지대장·임야대장의 등록사항이 아니다.",
      "경계점좌표등록부를 갖춰 두는 지역의 지적도에는 도면 제명 끝에 '(좌표)'라고 표시하고, 면적은 제곱미터 이하 한 자리 단위로 결정한다.",
      "공유지연명부와 대지권등록부는 소유자의 성명·주소와 소유권 지분을 공통으로 등록하지만, 대지권비율은 대지권등록부에만 등록된다.",
    ],
    pitfalls:
      "'제명 앞에 (수치)라고 표시한다'는 서술은 틀렸다 — 제명 '끝'에 '(좌표)'라고 표시하는 것이 맞다.",
    example:
      "경계점좌표등록부가 있는 지역의 지적도라면, 도면 제명이 '○○동 지적도(좌표)'와 같은 형태로 표시된다.",
    questionRefs: [
      { year: 2016, questionNo: 7 },
      { year: 2016, questionNo: 9 },
      { year: 2017, questionNo: 9 },
      { year: 2018, questionNo: 8 },
      { year: 2018, questionNo: 11 },
      { year: 2020, questionNo: 2 },
      { year: 2021, questionNo: 5 },
      { year: 2021, questionNo: 8 },
      { year: 2022, questionNo: 1 },
      { year: 2023, questionNo: 5 },
      { year: 2024, questionNo: 9 },
      { year: 2024, questionNo: 10 },
      { year: 2025, questionNo: 10 },
    ],
  },
  {
    slug: "land-integrated-registry",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지적공부",
    parentSlug: "cadastral-books-classification",
    titleKo: "부동산종합공부의 등록사항과 열람",
    titleEn: "Registered Items and Access to the Integrated Real Estate Register",
    definition:
      "부동산종합공부는 토지의 표시·소유자, 건축물의 표시·소유자, 토지의 이용 및 규제, 부동산의 가격에 관한 사항을 지적소관청이 통합하여 관리하는 공부로, 등록사항에 잘못이 있으면 관리기관에 정정을 신청할 수 있다.",
    intuition:
      "부동산종합공부는 여러 행정기관이 따로 관리하던 토지·건물·가격·이용계획 정보를 한 장으로 모아 보여주는 통합 공부이므로, 원본 정보는 여전히 각 소관 기관이 관리하고 지적소관청은 이를 연계·관리할 뿐이라는 점이 핵심이다.",
    keyPoints: [
      "부동산종합공부에는 토지의 표시·소유자(토지대장 등), 건축물의 표시·소유자(건축물대장), 토지의 이용 및 규제(토지이용계획확인서), 부동산의 가격(개별공시지가 등)에 관한 사항이 등록된다.",
      "부동산종합공부의 등록사항에 잘못이 있음을 발견하면, 지적소관청에 그 정정을 신청할 수 있다.",
      "부동산종합공부의 열람이나 증명서 발급은 지적소관청이나 읍·면·동의 장에게 신청할 수 있다.",
    ],
    pitfalls:
      "부동산종합공부가 원본 정보까지 새로 만든다고 착각하기 쉽지만, 실제로는 각 기관이 관리하는 원본 정보를 연계하여 통합 제공하는 공부일 뿐이다.",
    example:
      "토지의 가격 정보가 잘못 등록된 것을 발견한 소유자는 지적소관청에 부동산종합공부의 등록사항 정정을 신청할 수 있다.",
    questionRefs: [
      { year: 2016, questionNo: 8 },
      { year: 2019, questionNo: 6 },
      { year: 2021, questionNo: 11 },
      { year: 2022, questionNo: 5 },
      { year: 2025, questionNo: 3 },
    ],
  },
  {
    slug: "boundary-point-register",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지적공부",
    parentSlug: "cadastral-books-classification",
    titleKo: "지상경계의 결정과 지상경계점등록부",
    titleEn: "Determining Boundaries and the Boundary Point Register",
    definition:
      "지적소관청은 토지의 이동에 따라 지상경계를 새로 정한 경우 경계점표지의 종류, 경계점 위치 설명도 등을 지상경계점등록부에 등록·관리해야 한다.",
    intuition:
      "지상경계는 현장에 실제로 표시된 경계점(말뚝, 표지 등)을 기준으로 하므로, 그 표지의 종류와 위치를 별도 장부로 남겨 두어야 나중에 분쟁이 생겨도 원래 경계를 확인할 수 있다.",
    keyPoints: [
      "지상경계점등록부에는 경계점 위치 설명도, 경계점 표지의 종류, 경계점 사진 파일 등이 등록되며, 지목·면적 등 지적공부 일반 등록사항과는 별개다.",
      "지적소관청은 토지의 이동에 따라 지상경계를 새로 정한 경우 지상경계점등록부를 작성·관리해야 한다.",
    ],
    pitfalls:
      "지상경계점등록부의 등록사항을 토지대장 등 일반 지적공부의 등록사항과 혼동하기 쉽지만, 경계점 표지·사진 등 현장 표시 정보가 핵심이다.",
    example:
      "새로 지상경계를 정한 토지에 콘크리트 말뚝으로 경계점표지를 설치했다면, 그 표지의 종류가 지상경계점등록부에 등록된다.",
    questionRefs: [
      { year: 2017, questionNo: 4 },
      { year: 2019, questionNo: 3 },
      { year: 2023, questionNo: 12 },
    ],
  },
  {
    slug: "cadastral-books-restoration",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지적공부",
    parentSlug: "cadastral-books-classification",
    titleKo: "지적공부의 복구",
    titleEn: "Restoration of Cadastral Books",
    definition:
      "지적소관청은 지적공부가 멸실·훼손된 경우 지적공부의 등본, 측량 결과도, 부동산등기부 등본 등 관계 자료에 의해 지적공부를 복구해야 한다.",
    intuition:
      "복구는 없어진 장부를 다시 만드는 것이므로, 신뢰할 수 있는 다른 자료(등기부, 측량 결과, 토지이동정리 결의서 등)로 원래 내용을 증명할 수 있어야 복구 자료로 인정된다.",
    keyPoints: [
      "지적공부의 복구자료에는 지적공부의 등본, 측량 결과도, 토지이동정리 결의서, 부동산등기부 등본 등이 포함된다.",
      "토지이용계획확인서는 지적공부 복구자료에 해당하지 않는다.",
      "지적소관청은 복구자료를 조사하고, 복구할 토지의 표시 등을 조사한 서류를 작성해 게시해야 한다.",
    ],
    pitfalls:
      "토지이용계획확인서처럼 관련 있어 보이는 서류를 복구 자료로 착각하기 쉽지만, 실제 복구자료 목록에는 열거되지 않은 자료다.",
    example:
      "화재로 지적공부가 소실된 경우, 지적소관청은 부동산등기부 등본과 측량 결과도 등을 근거로 지적공부를 복구한다.",
    questionRefs: [
      { year: 2017, questionNo: 11 },
      { year: 2020, questionNo: 5 },
      { year: 2022, questionNo: 12 },
      { year: 2024, questionNo: 11 },
    ],
  },
  {
    slug: "cadastral-books-storage-and-maintenance",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지적공부",
    parentSlug: "cadastral-books-classification",
    titleKo: "지적공부의 보존·관리와 등기촉탁",
    titleEn: "Storage, Maintenance, and Registration Referral",
    definition:
      "지적공부는 지적소관청 청사 내 지적서고에 보존해야 하며, 지목변경·지번변경·축척변경·합병 등으로 등기부와 지적공부의 내용이 달라지면 지적소관청이 관할 등기관서에 등기를 촉탁해야 하지만, 신규등록은 등기부 자체가 없어 촉탁 대상이 아니다.",
    intuition:
      "지적공부는 국가의 공적 장부이므로 어디에, 어떻게 보관하는지 자체가 법으로 정해져 있고, 등기부와 짝을 맞춰야 하는 변경사항(지목·지번·축척·합병)과 애초에 등기부가 없는 신규등록은 처리방식이 다르다는 점이 핵심이다.",
    keyPoints: [
      "지적서고는 지적사무를 처리하는 사무실과 연접하여 설치해야 하고, 온도·습도 자동조절장치 등 물리적 보존기준이 법정되어 있다.",
      "등기촉탁의 대상은 지목변경·지번변경·축척변경·합병 등 기존 등기부 내용의 변경이 필요한 경우이며, 신규등록은 촉탁 대상이 아니다.",
      "신규등록 토지의 소유자에 관한 사항은 등기부와 대조하지 않고 등기필증·등기완료통지서·등기사항증명서 등에 따라 지적소관청이 직접 정리한다.",
      "지적소관청은 토지이동정리 결의서와 다르게 정리된 경우, 경계의 위치만 잘못된 경우 등에는 직권으로 조사·측량하여 등록사항을 정정할 수 있다.",
    ],
    pitfalls:
      "신규등록도 등기촉탁 대상이라고 착각하기 쉽지만, 신규등록은 애초에 등기부 자체가 없으므로 촉탁 대상에서 제외된다.",
    example:
      "합병으로 지적공부의 표시가 바뀐 경우, 지적소관청은 지체 없이 관할 등기관서에 등기를 촉탁해야 한다.",
    questionRefs: [
      { year: 2018, questionNo: 7 },
      { year: 2018, questionNo: 10 },
      { year: 2020, questionNo: 1 },
      { year: 2021, questionNo: 12 },
      { year: 2024, questionNo: 1 },
      { year: 2025, questionNo: 6 },
      { year: 2025, questionNo: 11 },
    ],
  },
  {
    slug: "land-category-registration",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "토지의 등록",
    titleKo: "지목의 종류별 결정 기준",
    titleEn: "Determining the Correct Land Category (Jimok)",
    definition:
      "지목은 토지의 주된 용도에 따라 학교용지·수도용지·도로·유지·잡종지 등 법정된 종류 중 하나로 정해지며, 얼핏 비슷해 보이는 시설이라도 법령이 정한 기준에 따라 서로 다른 지목으로 갈린다.",
    intuition:
      "지목은 '땅의 용도를 한 단어로 요약한 이름'이라고 생각하면, 실제 시설과 지목 명칭을 짝짓는 문제를 직관적으로 풀 수 있다.",
    keyPoints: [
      "학교의 교사와 부속 체육장 등 부속시설물의 부지는 '학교용지', 취수·저수·도수·정수·송수·배수 시설의 부지는 '수도용지'로 등록한다.",
      "여객자동차터미널·자동차운전학원·폐차장 등 자동차 관련 독립시설물, 모래바람을 막는 방사제·방파제의 부지는 '잡종지'로 등록하지만, 변전소·송신소·수신소, 공항·항만시설, 도축장·쓰레기처리장·오물처리장의 부지는 잡종지가 아니다.",
      "일반 공중의 교통·운수를 위한 설비를 갖춘 토지, 도로법상 개설된 토지, 고속도로 휴게소, 2필지 이상의 진입로는 '도로'로 등록하지만, 궤도 등의 설비를 갖춘 토지는 '도로'가 아니라 '철도용지'로 등록한다.",
      "물이 고이거나 상시 저장되는 저수지·호수, 연·왕골 등이 자생하며 배수가 나쁜 토지는 '유지'로 등록한다(양어장·구거·답이 아님).",
    ],
    pitfalls:
      "여객자동차터미널·운전학원·폐차장처럼 자동차 관련 독립시설은 잡종지로 등록되지만, 변전소·공항항만시설·도축장처럼 언뜻 유사해 보이는 시설들은 잡종지가 아니라는 점에서 혼동하기 쉽다.",
    example:
      "궤도를 갖춘 교통용 부지는 '도로'가 아니라 '철도용지'로 등록되며, 정수·배수 시설이 있는 부지는 '수도용지'로 등록된다.",
    questionRefs: [
      { year: 2016, questionNo: 2 },
      { year: 2017, questionNo: 7 },
      { year: 2018, questionNo: 1 },
      { year: 2018, questionNo: 5 },
      { year: 2019, questionNo: 1 },
      { year: 2019, questionNo: 11 },
      { year: 2020, questionNo: 3 },
      { year: 2020, questionNo: 7 },
      { year: 2021, questionNo: 4 },
      { year: 2022, questionNo: 4 },
      { year: 2023, questionNo: 3 },
      { year: 2024, questionNo: 2 },
      { year: 2024, questionNo: 8 },
      { year: 2025, questionNo: 2 },
    ],
  },
  {
    slug: "lot-numbering-and-registration-basics",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "토지의 등록",
    parentSlug: "land-category-registration",
    titleKo: "지번의 구성·부여, 축척, 바다로 된 토지",
    titleEn: "Lot Numbering, Map Scales, and Land Submerged by the Sea",
    definition:
      "지번은 지적소관청이 지번부여지역별로 아라비아숫자로 순차 부여하며(임야대장·임야도는 숫자 앞에 '산'자 부기), 지적공부에 등록된 토지가 지형변화로 바다가 되어 원상회복이 불가능하면 지적소관청은 소유자에게 등록말소 신청을 통지하고 불응 시 직권으로 말소한다.",
    intuition:
      "지번부여, 지적도·임야도의 축척, 바다로 된 토지의 말소·회복은 모두 '지적소관청이 토지의 존재·범위를 어떻게 표시·유지·소멸시키는가'라는 같은 문제의 다른 국면이다.",
    keyPoints: [
      "지번은 본번과 부번을 '-'로 연결해 북서에서 남동으로 순차 부여하며, 지번변경은 토지소유자가 아니라 지적소관청이 결정한다.",
      "지적도의 축척은 500·600·1000·1200·2400·3000·6000분의 1 등 여러 종류이지만, 임야도의 축척은 3000분의 1과 6000분의 1 두 가지뿐이다 — 1/50000처럼 임야도에 없는 축척을 있는 것처럼 묻는 지문이 잦다.",
      "바다로 되어 원상회복이 불가능한 토지는 소유자에게 등록말소 신청을 통지하고, 통지받은 날부터 60일 이내에 신청이 없으면 지적소관청이 직권으로 말소한다.",
      "합병에 따른 경계·좌표·면적은 새로 지적측량을 하지 않고 종전 등록자료로 결정한다.",
    ],
    pitfalls:
      "임야도의 축척을 지적도와 같은 여러 종류로 착각하기 쉽지만, 임야도는 1/3000과 1/6000 두 가지 축척만 사용한다.",
    example:
      "지적공부에 등록된 토지가 지형변화로 바다가 되어 원상회복이 불가능한 경우, 소유자가 통지받고도 60일 내 등록말소를 신청하지 않으면 지적소관청이 직권으로 말소한다.",
    questionRefs: [
      { year: 2016, questionNo: 11 },
      { year: 2017, questionNo: 3 },
      { year: 2018, questionNo: 3 },
      { year: 2018, questionNo: 4 },
      { year: 2019, questionNo: 4 },
      { year: 2019, questionNo: 7 },
      { year: 2021, questionNo: 3 },
    ],
  },
  {
    slug: "boundary-determination-standards",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "토지의 등록",
    parentSlug: "land-category-registration",
    titleKo: "지상경계의 결정기준",
    titleEn: "Standards for Determining Surface Boundaries",
    definition:
      "지상경계는 둑·담장 등 구조물이나 경계점표지로 구분하며, 연접 토지 간 높낮이 차이가 있으면 그 구조물의 하단부, 공유수면매립지의 제방 등을 편입하는 경우에는 바깥쪽 어깨부분, 토지가 해면·수면에 접하는 경우에는 최대만조위 또는 최대만수위가 되는 선을 결정기준으로 한다.",
    intuition:
      "지상경계 결정기준은 눈에 보이는 구조물의 어느 지점을 경계로 볼 것인지를 유형별로 못박아 둔 규정이므로, 높낮이 차이·매립지·해안선처럼 상황별로 다른 기준점(상단/하단/어깨/만조위)을 짝지어 암기해야 한다.",
    keyPoints: [
      "연접되는 토지 간에 높낮이 차이가 있는 경우에는 그 구조물 등의 하단부를 경계로 한다.",
      "공유수면매립지의 제방 등을 토지에 편입해 등록하는 경우에는 바깥쪽 어깨부분을, 토지가 해면·수면에 접하는 경우에는 최대만조위 또는 최대만수위가 되는 선을 경계로 한다(평균해수면이 아님).",
      "분할에 따른 지상경계는 원칙적으로 지상건축물을 걸리게 결정할 수 없지만, 법원의 확정판결이 있는 경우에는 예외적으로 허용된다.",
    ],
    pitfalls:
      "해면·수면에 접하는 토지의 경계기준을 '평균해수면'으로 착각하기 쉽지만, 정확한 기준은 최대만조위 또는 최대만수위가 되는 선이다.",
    example:
      "공유수면매립지에서 제방을 토지에 편입해 등록하는 경우, 그 경사면이 아니라 바깥쪽 어깨부분이 지상경계의 결정기준이 된다.",
    questionRefs: [
      { year: 2016, questionNo: 4 },
      { year: 2018, questionNo: 2 },
      { year: 2021, questionNo: 1 },
      { year: 2024, questionNo: 3 },
      { year: 2025, questionNo: 8 },
    ],
  },
  {
    slug: "area-registration-rounding",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "토지의 등록",
    parentSlug: "land-category-registration",
    titleKo: "등록면적의 결정과 끝수 처리",
    titleEn: "Determining Registered Area and Rounding Rules",
    definition:
      "토지대장에 등록하는 면적은 원칙적으로 1제곱미터 단위로 정하되, 지적도 축척이 600분의 1인 지역과 경계점좌표등록부를 갖춘 지역은 0.1제곱미터 단위로 정하며, 끝수가 0.05㎡ 미만이면 버리고 초과하면 올린다.",
    intuition:
      "면적은 측량한 실제 수치를 그대로 등록하는 것이 아니라, 지역별 정밀도 기준(1㎡ 단위 vs 0.1㎡ 단위)에 맞춰 끝수 처리 규칙으로 다듬어 등록한다는 점이 핵심이다.",
    keyPoints: [
      "지적도 축척 600분의 1 지역·경계점좌표등록부 비치 지역은 면적을 0.1㎡ 단위까지, 그 밖의 지역은 1㎡ 단위로 등록한다.",
      "끝수가 정확히 0.05㎡로 끝나는 경우 그 앞자리 숫자가 0 또는 짝수이면 버리고 홀수이면 올리되, 버림의 결과 0.0㎡이 되면 최소 등록단위인 0.1㎡로 한다.",
      "경계점좌표등록부가 있는 지역에서 토지를 분할할 때는, 분할 후 각 필지의 면적을 끝자리 다음 숫자가 작은 것부터 순서대로 배분해 합계가 분할 전 면적과 일치하도록 조정한다.",
    ],
    pitfalls:
      "0.050㎡처럼 정확히 5로 끝나는 값을 무조건 올림 처리한다고 착각하기 쉽지만, 실제로는 앞자리 숫자의 홀짝에 따라 처리 방향이 갈리고 그 결과가 0.0㎡이 되면 최소단위로 올린다.",
    example:
      "600분의 1 축척 지역에서 신규등록 면적이 145.450㎡로 측정되면, 앞자리 4가 짝수이므로 버림 처리되어 토지대장에는 145.4㎡로 등록된다.",
    questionRefs: [
      { year: 2019, questionNo: 8 },
      { year: 2023, questionNo: 4 },
      { year: 2024, questionNo: 5 },
      { year: 2025, questionNo: 4 },
    ],
  },
  {
    slug: "land-category-types",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지목",
    titleKo: "지목의 표기 방법과 법정 종류",
    titleEn: "Notation and Statutory Types of Land Categories",
    definition:
      "지목을 지적도 및 임야도에 등록할 때는 부호로 표기해야 하며, 지목의 종류는 법령에 열거된 것에 한정되어 '선로용지'처럼 법정되지 않은 명칭은 사용할 수 없다.",
    intuition:
      "지목은 땅의 용도를 정형화한 28가지(예: 전·답·대·학교용지·철도용지 등) 카테고리로만 분류하도록 법에 못 박아 두었으므로, 목록에 없는 이름을 지어내는 지문은 항상 오답이라고 이해하면 된다.",
    keyPoints: [
      "지목을 지적도·임야도에 등록할 때는 지목명 전체가 아니라 정해진 부호로 표기한다.",
      "'선로용지'는 법령상 지목의 종류에 해당하지 않으며, 관련 부지는 '철도용지'에 포함된다.",
      "지목의 종류는 법에서 한정적으로 열거하고 있으므로 당사자가 임의로 새로운 지목을 만들어낼 수 없다.",
    ],
    pitfalls:
      "실생활 용어(선로용지 등)를 법정 지목으로 착각하기 쉽다 — 반드시 법에 열거된 지목 명칭인지 확인해야 한다.",
    example:
      "철도 선로가 지나는 부지는 '선로용지'가 아니라 법정 지목인 '철도용지'로 등록된다.",
  },
  {
    slug: "cadastral-survey-period",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지적측량",
    titleKo: "지적측량의 측량기간·검사기간",
    titleEn: "Survey and Inspection Periods for Cadastral Surveying",
    definition:
      "지적측량의 측량기간은 5일, 측량검사기간은 4일을 원칙으로 하며, 지적기준점을 설치하여 측량하는 경우에는 점의 개수에 따라 기간이 가산된다.",
    intuition:
      "기준점 설치처럼 작업량이 늘어나는 요소가 있으면 그만큼 기간도 비례해서 늘어난다고 보면, 가산 규정의 취지가 자연스럽게 이해된다.",
    keyPoints: [
      "측량기간은 5일, 측량검사기간은 4일이 원칙이다.",
      "지적기준점을 설치하여 측량하는 경우, 15점 이하이면 4일을 가산하고 15점을 초과하면 4일에 15점을 초과하는 4점마다 1일을 추가로 가산한다.",
      "지적측량 의뢰인과 지적측량수행자가 합의하여 따로 기간을 정하는 경우에는 전체 기간의 4분의 3을 측량기간으로, 4분의 1을 측량검사기간으로 본다.",
    ],
    pitfalls:
      "기간·점수 기준의 숫자를 바꿔서 내는 지문이 많으므로, 5일/4일/15점/4점 같은 구체적 수치를 정확히 암기해야 한다.",
    example:
      "지적기준점 20점을 설치해 측량하는 경우, 15점 초과분 5점에 대해 4점마다 1일씩 가산되어 측량기간이 늘어난다.",
    questionRefs: [
      { year: 2017, questionNo: 2 },
      { year: 2018, questionNo: 6 },
      { year: 2023, questionNo: 10 },
    ],
  },
  {
    slug: "survey-required-cases-and-types",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지적측량",
    parentSlug: "cadastral-survey-period",
    titleKo: "지적측량을 실시해야 하는 경우와 측량의 종류",
    titleEn: "When Cadastral Surveying Is Required, and Survey Types",
    definition:
      "신규등록·등록전환·지적재조사사업에 따른 토지이동, 바다로 된 토지의 등록말소, 지적공부 복구·정정 등 토지의 표시가 달라지거나 확인이 필요한 경우에는 지적측량을 실시해야 하며, 지상건축물의 현황을 지적도·임야도상 경계와 대비해 표시하는 측량은 '지적현황측량'이라 한다.",
    intuition:
      "지적측량은 '토지의 표시를 새로 만들거나(신규등록·등록전환) 바꾸거나(정정·말소) 확인할(현황측량) 필요가 있을 때' 실시하는 것이므로, 단순히 지적공부를 정리만 하는 경우(예: 합병)에는 별도 측량이 필요 없다는 점과 대비해서 이해하면 된다.",
    keyPoints: [
      "신규등록, 등록전환, 지적재조사사업에 따른 토지이동, 바다가 된 토지의 등록말소, 지적공부의 복구·정정 등은 지적측량을 실시해야 하는 경우에 해당한다.",
      "토지의 합병은 새로운 경계·좌표를 확정할 필요가 없으므로 지적측량을 실시해야 하는 경우가 아니다.",
      "지상건축물 등의 현황을 지적도·임야도에 등록된 경계와 대비하여 표시하는 지적측량은 '지적현황측량'이라 하며, 경계복원측량·등록전환측량 등과 구분된다.",
      "경계점좌표등록부에 등록하는 지역의 면적은 0.1㎡ 단위로 등록하며, 끝수 처리 규칙에 따라 1,029.551㎡는 1,029.6㎡로 등록한다.",
    ],
    pitfalls:
      "토지의 합병도 지적공부가 바뀌니 측량이 필요하다고 착각하기 쉽지만, 합병은 새로 측량할 경계·좌표·면적이 없으므로 지적측량 실시 사유가 아니다.",
    example:
      "지상건축물이 지적도상 경계를 침범했는지 확인하려는 경우, 지적현황측량을 실시해 실제 현황과 등록된 경계를 대비한다.",
    questionRefs: [
      { year: 2016, questionNo: 3 },
      { year: 2019, questionNo: 10 },
      { year: 2021, questionNo: 2 },
      { year: 2022, questionNo: 9 },
      { year: 2025, questionNo: 1 },
    ],
  },
  {
    slug: "survey-request-and-benchmark-access",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지적측량",
    parentSlug: "cadastral-survey-period",
    titleKo: "지적측량의 의뢰와 지적기준점성과의 열람",
    titleEn: "Requesting a Cadastral Survey and Accessing Benchmark Results",
    definition:
      "토지소유자 등 이해관계인은 지적측량수행자에게 지적측량을 의뢰할 수 있으나 지적측량성과 검사, 지적재조사사업에 따른 측량처럼 이해관계인의 의뢰 대상이 아닌 경우도 있으며, 지적기준점성과의 열람·등본 발급은 그 종류(지적삼각점·지적삼각보조점·지적도근점)에 따라 신청기관이 다르다.",
    intuition:
      "지적측량은 '누가 신청하는가'(이해관계인의 의뢰 vs 지적소관청 직권/검사)와 '그 결과를 누구에게 확인받는가'(기준점 종류별 신청기관)라는 두 갈래로 나뉘어 출제된다.",
    keyPoints: [
      "지적측량성과에 대한 검사, 지적재조사사업에 따른 토지이동은 지적측량수행자가 아니라 지적소관청 등이 주체가 되므로 이해관계인의 의뢰 대상이 아니다.",
      "지적측량수행자는 의뢰를 받은 다음 날까지 측량기간·측량일자·측량 수수료 등을 적은 지적측량 수행계획서를 지적소관청에 제출해야 한다(의뢰서를 제출하는 것이 아님).",
      "지적삼각점성과는 시·도지사 또는 지적소관청에, 지적삼각보조점성과와 지적도근점성과는 지적소관청에 열람·등본 발급을 신청한다.",
      "지적전산자료의 이용·활용 승인신청을 받은 기관은 사생활 침해 여부, 자료의 목적 외 사용 방지대책, 전산정보처리조직으로 처리 가능한지 여부 등을 심사한다.",
    ],
    pitfalls:
      "지적삼각점성과와 지적삼각보조점성과의 신청기관을 같다고 착각하기 쉽지만, 지적삼각점성과는 시·도지사 또는 지적소관청에, 지적삼각보조점성과는 지적소관청에만 신청한다.",
    example:
      "지적재조사사업에 따라 토지의 이동이 있어 측량이 필요한 경우, 이는 이해관계인이 지적측량수행자에게 의뢰해야 하는 사유가 아니다.",
    questionRefs: [
      { year: 2017, questionNo: 6 },
      { year: 2020, questionNo: 12 },
      { year: 2021, questionNo: 9 },
      { year: 2022, questionNo: 6 },
      { year: 2022, questionNo: 8 },
      { year: 2023, questionNo: 1 },
      { year: 2023, questionNo: 7 },
    ],
  },
  {
    slug: "cadastral-committee-composition",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지적측량",
    parentSlug: "cadastral-survey-period",
    titleKo: "중앙지적위원회의 구성과 심의·의결사항",
    titleEn: "Composition and Duties of the Central Cadastral Committee",
    definition:
      "중앙지적위원회는 위원장 1명과 부위원장 1명을 포함해 5명 이상 10명 이하의 위원으로 구성하며, 위원장은 국토교통부 지적업무 담당 국장이, 부위원장은 담당 과장이 맡고, 지적측량 적부심사 재심사·지적기술자 양성·지적재조사 기본계획 등을 심의·의결한다.",
    intuition:
      "중앙지적위원회는 '지적 분야 전반의 정책·인사·재심사'를 다루는 최상위 위원회이므로, 구성원 수·소집 절차 같은 형식적 요건과 심의·의결사항의 범위를 정확히 구분해서 암기해야 한다.",
    keyPoints: [
      "중앙지적위원회는 위원장 1명과 부위원장 1명을 포함해 5명 이상 10명 이하의 위원으로 구성되며, 재적위원 과반수 출석으로 개의하고 출석위원 과반수 찬성으로 의결한다.",
      "위원장이 회의를 소집할 때는 회의 일시·장소·심의 안건을 회의 5일 전까지(7일 전이 아님) 각 위원에게 서면으로 통지해야 한다.",
      "지적측량 적부심사에 대한 재심사, 지적분야 측량기술자의 양성, 지적기술자의 업무정지 처분 및 징계요구에 관한 사항은 중앙지적위원회의 심의·의결사항이지만, 지적재조사 기본계획의 수립·변경은 이에 해당하지 않는다.",
    ],
    pitfalls:
      "회의 소집 통지기한을 '7일 전'으로 암기하기 쉽지만, 실제로는 '5일 전'까지 서면으로 통지해야 한다.",
    example:
      "지적측량 적부심사 의결에 불복해 재심사를 청구하면, 그 재심사는 지방지적위원회가 아니라 중앙지적위원회가 심의·의결한다.",
    questionRefs: [
      { year: 2016, questionNo: 6 },
      { year: 2019, questionNo: 2 },
      { year: 2020, questionNo: 8 },
      { year: 2023, questionNo: 9 },
      { year: 2025, questionNo: 12 },
    ],
  },
  {
    slug: "survey-appeal-procedure",
    chapterKo: "공간정보관리법",
    category: "공간정보관리법",
    subcategory: "지적측량",
    parentSlug: "cadastral-survey-period",
    titleKo: "지적측량의 적부심사 절차",
    titleEn: "Procedure for Reviewing Cadastral Survey Results",
    definition:
      "지적측량성과에 다툼이 있는 토지소유자·이해관계인·지적측량수행자는 관할 시·도지사를 거쳐 지방지적위원회에 적부심사를 청구할 수 있고, 지방지적위원회는 회부받은 날부터 60일 이내에 심의·의결하며, 시·도지사는 의결서를 받은 날부터 7일 이내에 청구인 등에게 통지해야 한다.",
    intuition:
      "적부심사는 '지방(1심) → 중앙(재심사)'의 2단계 구조를 가지며, 각 단계마다 청구·회부·심의·통지·불복의 기한이 촘촘히 정해져 있으므로 그 순서와 숫자를 하나의 흐름으로 암기해야 한다.",
    keyPoints: [
      "적부심사 청구는 관할 시·도지사를 거쳐 지방지적위원회에 하며, 지방지적위원회는 회부받은 날부터 60일 이내(부득이한 경우 위원회 의결로 30일 이내 한 번만 연장)에 심의·의결해야 한다.",
      "시·도지사는 지방지적위원회의 의결서를 받은 날부터 7일 이내에 청구인 및 이해관계인에게 통지해야 한다.",
      "의결서를 받은 자가 불복하는 경우, 그 의결서를 받은 날부터 90일 이내에 국토교통부장관을 거쳐 중앙지적위원회에 재심사를 청구할 수 있다.",
      "중앙지적위원회는 관계인을 출석시켜 의견을 들을 수 있고 필요하면 현지조사를 할 수 있으며, 지적측량수행자에게 소속 지적기술자를 현지조사에 참여시키도록 요청할 수 있다.",
    ],
    pitfalls:
      "재심사 청구를 '시·도지사를 거쳐'로 착각하기 쉽지만, 재심사는 국토교통부장관을 거쳐 중앙지적위원회에 청구한다(최초 청구만 시·도지사를 거친다).",
    example:
      "지방지적위원회의 의결에 불복하는 자는 의결서를 받은 날부터 90일 이내에 국토교통부장관을 거쳐 중앙지적위원회에 재심사를 청구할 수 있다.",
    questionRefs: [
      { year: 2018, questionNo: 9 },
      { year: 2021, questionNo: 6 },
      { year: 2025, questionNo: 9 },
    ],
  },

  // ───────── 부동산등기법 ─────────
  {
    slug: "ownership-registration",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "권리에 관한 등기",
    titleKo: "소유권보존·이전등기",
    titleEn: "Registration of Ownership Preservation and Transfer",
    definition:
      "미등기건물을 매수한 자는 매수인 명의로 바로 보존등기를 할 수 없고 원소유자(신축자) 명의로 보존등기 후 이전등기를 해야 하며, 등기의무자가 사망하면 그 단독상속인이 자신을 등기의무자로 하여 피상속인에서 direct 등기권리자로의 이전등기를 신청할 수 있다.",
    intuition:
      "등기제도는 '실제 권리변동의 연속된 과정'을 그대로 기록하는 것을 원칙으로 하므로, 원시취득자를 건너뛰고 바로 최종 매수인 명의로 등기하는 것은 원칙적으로 허용되지 않지만, 상속처럼 법률로 당연히 승계되는 경우에는 중간 단계(상속등기)를 생략하고 직접 등기할 수 있는 예외가 인정된다.",
    keyPoints: [
      "미등기건물의 매수인이 곧바로 자기 명의로 소유권보존등기를 할 수 있다고 착각하기 쉽다 — 반드시 원소유자 명의 보존등기를 거쳐야 한다.",
      "등기의무자(매도인)가 사망하고 단독상속인이 있는 경우, 그 상속인은 자신을 등기의무자로 하여 피상속인에서 매수인으로 직접 이전등기를 신청할 수 있다(상속등기 생략).",
      "수용개시일 후 원소유자가 제3자에게 경료한 소유권이전등기는 수용의 원시취득 효과로 등기관이 직권으로 말소한다.",
      "가장매매로 소유권이전등기가 되었더라도, 그 후 선의의 제3자 명의로 저당권이 설정되어 있다는 사정만으로는 당사자들이 진정명의회복을 위한 이전등기를 신청하는 데 지장이 없다.",
    ],
    pitfalls:
      "등기의무자가 사망하면 반드시 상속등기를 먼저 거쳐야 한다고 착각하기 쉽다 — 상속인은 자신을 등기의무자로 하여 직접 이전등기를 신청할 수 있다.",
    example:
      "甲이 신축한 미등기건물을 매수한 乙은, 甲 명의로 소유권보존등기를 마친 뒤 乙 앞으로 소유권이전등기를 해야 한다.",
    questionRefs: [
      { year: 2016, questionNo: 22 },
      { year: 2016, questionNo: 23 },
      { year: 2018, questionNo: 13 },
      { year: 2018, questionNo: 23 },
      { year: 2019, questionNo: 21 },
      { year: 2020, questionNo: 17 },
      { year: 2021, questionNo: 17 },
      { year: 2022, questionNo: 18 },
      { year: 2023, questionNo: 23 },
      { year: 2024, questionNo: 17 },
      { year: 2025, questionNo: 18 },
    ],
  },
  {
    slug: "mortgage-registration-detail",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "권리에 관한 등기",
    titleKo: "저당권·근저당권·공동저당의 등기사항",
    titleEn: "Registration Details for Mortgages and Joint Mortgages",
    parentSlug: "ownership-registration",
    definition:
      "일정한 금액을 목적으로 하지 않는 채권을 담보하는 저당권설정등기를 신청할 때는 그 채권의 평가액을 신청정보로 제공해야 하며, 3개의 부동산이 공동담보로 제공되는 경우가 아니라 5개 이상인 경우에만 등기관이 공동담보목록을 작성한다.",
    intuition:
      "저당권 등기사항은 '그 채권이 정확히 얼마인지, 누구의 채무를 담보하는지'를 등기부에 명확히 남기려는 취지이므로, 금액이 불확정적인 채권이나 여러 부동산에 걸친 공동담보처럼 특수한 경우마다 별도의 기재 규칙을 두고 있다고 이해하면 된다.",
    keyPoints: [
      "일정한 금액을 목적으로 하지 않는 채권을 담보하는 저당권설정등기를 신청할 때는 그 채권의 평가액을 신청정보로 제공해야 한다.",
      "저당권의 이전등기를 신청할 때는 저당권이 채권과 같이 이전한다는 뜻을 신청정보로 제공해야 하며, 채무자와 저당권설정자가 동일해도 등기기록에 채무자를 표시해야 한다.",
      "공동담보목록은 목적 부동산이 5개 이상인 경우에만 작성하며, 3~4개인 경우에는 작성 의무가 없다.",
      "피담보채권의 일부양도로 저당권의 일부이전등기를 할 때는 그 양도액도 함께 기록해야 한다.",
    ],
    pitfalls:
      "공동담보목록 작성 기준을 '부동산 3개 이상'으로 착각하기 쉽다 — 정확히는 '5개 이상'인 경우에만 작성한다.",
    example:
      "채권최고액을 확정할 수 없는 특수한 채권을 담보로 저당권을 설정할 때는, 그 채권의 평가액을 신청정보로 등기소에 제공해야 한다.",
    questionRefs: [
      { year: 2017, questionNo: 15 },
      { year: 2017, questionNo: 18 },
      { year: 2019, questionNo: 23 },
      { year: 2020, questionNo: 23 },
      { year: 2021, questionNo: 19 },
      { year: 2023, questionNo: 18 },
      { year: 2024, questionNo: 21 },
    ],
  },
  {
    slug: "usufructuary-right-registration",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "권리에 관한 등기",
    titleKo: "지상권·지역권·전세권·임차권의 등기사항",
    titleEn: "Registration Details for Usufructuary Rights",
    parentSlug: "ownership-registration",
    definition:
      "지상권·지역권설정등기에는 그 설정의 목적을 기록해야 하며, 지상권설정등기의 범위가 토지 일부인 경우에는 그 부분을 표시한 지적도(토지대장이 아님)를 첨부정보로 제공해야 하고, 임차권설정등기에는 차임 및 임차보증금(있는 경우)을 등기사항으로 기록한다.",
    intuition:
      "용익권 등기사항은 대체로 '그 권리가 무엇을 목적으로, 어느 범위에 미치는지'를 등기부에 남기는 데 초점이 있으므로, 각 권리별로 요구되는 특유의 기재사항(지상권의 목적, 지역권의 목적, 임차권의 차임 등)을 서로 구분해서 암기해야 한다.",
    keyPoints: [
      "지상권설정등기와 지역권설정등기 모두 그 설정의 목적을 기록해야 한다.",
      "지상권설정등기의 범위가 토지의 일부인 경우, 그 부분을 표시한 지적도를 첨부정보로 제공해야 한다(토지대장이 아님).",
      "임차권설정등기를 신청할 때는 차임을 신청정보로 제공해야 하며, 임차보증금이 있는 경우 그 보증금도 등기사항이다.",
      "등기관이 승역지의 등기기록에 지역권설정등기를 할 때는 요역지·지역권설정의 목적·범위 등을 기록해야 한다.",
    ],
    pitfalls:
      "지상권 범위가 토지 일부인 경우의 첨부정보를 '토지대장'으로 착각하기 쉽다 — 정확히는 '지적도'다.",
    example:
      "한 필지 토지의 절반에만 지상권을 설정하는 경우, 그 부분을 표시한 지적도를 첨부정보로 등기소에 제공해야 한다.",
    questionRefs: [
      { year: 2017, questionNo: 21 },
      { year: 2018, questionNo: 21 },
      { year: 2020, questionNo: 18 },
      { year: 2021, questionNo: 18 },
      { year: 2022, questionNo: 22 },
      { year: 2023, questionNo: 17 },
      { year: 2024, questionNo: 20 },
      { year: 2025, questionNo: 19 },
      { year: 2025, questionNo: 20 },
    ],
  },
  {
    slug: "trust-registration-detail",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "권리에 관한 등기",
    titleKo: "신탁등기의 신청과 말소",
    titleEn: "Application and Cancellation of Trust Registration",
    parentSlug: "ownership-registration",
    definition:
      "수익자는 수탁자를 대위하여 신탁등기를 신청할 수 있고, 신탁등기의 말소등기는 수탁자가 단독으로 신청할 수 있으며, 하나의 부동산에 수탁자가 여러 명이면 등기관은 그 신탁부동산이 합유임을 기록해야 한다.",
    intuition:
      "신탁등기 절차는 '수탁자가 주된 신청인이되, 수익자에게도 보완적 신청권을 준다'는 구조와 '신탁재산이 수탁자 개인 재산과 섞이지 않도록 합유로 공시한다'는 원칙으로 이해하면 대부분의 지문을 판단할 수 있다.",
    keyPoints: [
      "수익자는 수탁자를 대위하여 신탁등기를 신청할 수 있으며, 신탁등기의 말소등기는 수탁자가 단독으로 신청할 수 있다.",
      "수탁자가 여러 명인 경우, 등기관은 그 신탁부동산이 수탁자들의 합유임을 기록해야 한다.",
      "신탁재산에 속한 권리가 이전되어 신탁재산에서 벗어나는 경우, 신탁등기의 말소신청은 그 권리이전등기 신청과 '동시에' 해야 한다(별도로 하는 것이 아니다).",
      "위탁자·수익자의 합의로 수탁자가 해임되어 임무가 종료된 경우, 신수탁자는 단독으로 신탁재산에 관한 권리이전등기를 신청할 수 있다.",
    ],
    pitfalls:
      "신탁재산에서 벗어난 권리에 대한 신탁등기 말소를 '별도로' 신청해야 한다고 착각하기 쉽다 — 권리이전등기 신청과 동시에 해야 한다.",
    example:
      "부동산이 신탁재산에서 벗어나 제3자에게 이전되는 경우, 그 이전등기를 신청할 때 신탁등기 말소신청도 함께 해야 한다.",
    questionRefs: [
      { year: 2016, questionNo: 14 },
      { year: 2020, questionNo: 24 },
      { year: 2021, questionNo: 24 },
      { year: 2022, questionNo: 24 },
      { year: 2025, questionNo: 22 },
    ],
  },
  {
    slug: "co-ownership-registration",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "권리에 관한 등기",
    titleKo: "공유·합유의 등기사항",
    titleEn: "Registration Details for Co-Ownership and Joint Ownership",
    parentSlug: "ownership-registration",
    definition:
      "합유등기에는 합유지분을 표시하지 않으며, 미등기 부동산의 공유자 중 1인은 자기 지분만이 아니라 부동산 전체에 대해서만 보존등기를 신청할 수 있다. 법인 아닌 사단 명의 부동산을 매매로 이전등기할 때는 특별한 사정이 없는 한 사원총회 결의를 증명하는 정보를 제출해야 한다.",
    intuition:
      "합유는 '지분이 있으나 자유롭게 처분할 수 없는' 공동소유 형태이므로 등기부에 지분을 아예 표시하지 않고, 미등기 공유부동산의 보존등기는 '전체를 하나로' 등기해야 한다는 원칙으로 이해하면 된다.",
    keyPoints: [
      "합유등기에는 합유지분을 표시하지 않는다 — 공유등기와 달리 지분 비율을 기록하지 않는 것이 특징이다.",
      "미등기 부동산의 공유자 중 1인은 자기 지분만에 대해 보존등기를 신청할 수 없고, 부동산 전체에 대해서만 보존등기를 신청할 수 있다.",
      "농지에 대해 공유물분할을 원인으로 하는 소유권이전등기를 신청하는 경우, 농지취득자격증명을 첨부할 필요가 없다.",
      "법인 아닌 사단 명의 부동산에 관해 매매를 원인으로 이전등기를 신청하는 경우, 특별한 사정이 없는 한 사원총회 결의를 증명하는 정보를 제출해야 한다.",
    ],
    pitfalls:
      "미등기 공유부동산의 공유자 1인이 자기 지분만 보존등기할 수 있다고 착각하기 쉽다 — 반드시 부동산 전체에 대해서만 신청할 수 있다.",
    example:
      "미등기 토지를 3인이 공유하는 경우, 그중 1인이 자신의 지분만 따로 떼어 보존등기를 신청할 수는 없고 토지 전체에 대해 보존등기를 신청해야 한다.",
    questionRefs: [
      { year: 2017, questionNo: 19 },
      { year: 2018, questionNo: 22 },
      { year: 2019, questionNo: 19 },
      { year: 2019, questionNo: 24 },
    ],
  },
  {
    slug: "sub-registration-and-priority",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "권리에 관한 등기",
    titleKo: "부기등기의 대상과 등기 순위",
    titleEn: "Scope of Sub-Registrations and Registration Priority",
    parentSlug: "ownership-registration",
    definition:
      "환매특약등기, 지상권의 이전등기, 등기명의인표시의 변경등기, 지상권 위에 설정한 저당권의 이전등기는 이해관계인의 승낙 여부와 무관하게 부기등기로 하지만, 근저당권의 채권최고액을 증액하는 변경등기는 후순위 권리자 등 이해관계 있는 제3자의 승낙이 없으면 부기등기로 할 수 없다.",
    intuition:
      "부기등기는 기존 등기의 순위를 그대로 유지하면서 덧붙이는 등기이므로, 그 변경이 다른 이해관계인에게 불리한 영향을 주지 않는 경우(단순 표시변경, 이전등기 등)에는 승낙 없이도 부기등기로 처리되지만, 채권최고액 증액처럼 후순위자에게 불리해질 수 있는 변경은 그 승낙을 받아야만 순위를 그대로 유지하는 부기등기로 할 수 있다.",
    keyPoints: [
      "환매특약등기, 지상권의 이전등기, 등기명의인표시의 변경등기, 지상권 위 저당권의 이전등기는 승낙 여부와 무관하게 부기등기로 한다.",
      "근저당권의 채권최고액을 증액하는 변경등기는 이해관계 있는 제3자(후순위 권리자 등)의 승낙이 없으면 부기등기로 할 수 없다.",
      "등기한 권리의 순위는 원칙적으로 등기의 전후(순위번호·접수번호)에 따르며, 부기등기의 순위는 주등기의 순위에 따른다.",
    ],
    pitfalls:
      "근저당권 채권최고액 증액 변경등기도 승낙 없이 부기등기로 할 수 있다고 착각하기 쉽다 — 이해관계 있는 제3자의 승낙이 필요하다.",
    example:
      "근저당권의 채권최고액을 증액하려는 경우, 후순위 저당권자 등 이해관계 있는 제3자의 승낙을 받아야만 그 변경등기를 부기등기로 할 수 있다.",
    questionRefs: [
      { year: 2018, questionNo: 20 },
      { year: 2019, questionNo: 22 },
      { year: 2022, questionNo: 19 },
      { year: 2023, questionNo: 15 },
      { year: 2025, questionNo: 17 },
    ],
  },
  {
    slug: "repurchase-registration",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "권리에 관한 등기",
    titleKo: "환매특약등기의 등기사항",
    titleEn: "Registration Details for Repurchase Agreements",
    parentSlug: "ownership-registration",
    definition:
      "환매특약등기의 등기사항은 매매비용과 매수인이 지급한 대금이며, 채권최고액이나 이자지급시기는 환매특약등기의 등기사항이 아니다.",
    intuition:
      "환매특약등기는 '나중에 되사올 때 정산할 기준 금액(매매대금·매매비용)'을 공시하는 것이 목적이므로, 근저당권의 채권최고액이나 이자 조건처럼 신용거래에 특유한 사항은 애초에 등기사항이 아니라고 구분하면 된다.",
    keyPoints: [
      "환매특약등기의 등기사항은 매수인이 지급한 대금과 매매비용이다.",
      "채권최고액은 근저당권등기의 등기사항이며 환매특약등기의 등기사항이 아니다.",
      "이자지급시기는 환매특약등기의 등기사항으로 명시되어 있지 않다.",
    ],
    pitfalls:
      "환매특약등기에도 채권최고액이나 이자 관련 사항이 등기된다고 착각하기 쉽다 — 그런 사항은 근저당권 등 신용거래 관련 등기의 몫이다.",
    example:
      "환매특약을 등기할 때는 매수인이 지급한 대금과 매매에 든 비용을 등기사항으로 기록하지만, 이자지급시기 같은 사항은 기록하지 않는다.",
    questionRefs: [
      { year: 2021, questionNo: 21 },
      { year: 2022, questionNo: 20 },
      { year: 2024, questionNo: 19 },
    ],
  },
  {
    slug: "registration-general-matters",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "권리에 관한 등기",
    titleKo: "등기사항의 총론과 등기의 효력",
    titleEn: "General Registrable Matters and the Effect of Registration",
    parentSlug: "ownership-registration",
    definition:
      "등기원인에 그러한 약정이 있더라도 등기기록에 기록할 수 없는 사항이 법령상 정해져 있으며, 수용으로 인한 등기·말소등기 등 각종 등기 유형마다 별도의 요건과 효력이 규정되어 있다.",
    intuition:
      "이 카드는 위의 개념 카드들(소유권·저당권·용익권·신탁·공유·부기등기·환매특약)로 깔끔히 분류되지 않는 등기법 총론 성격의 개별 지문들을 모아둔 것이므로, 하나의 원리로 묶이지는 않지만 실전에서 반복 출제되는 개별 규정들로 알아두어야 한다.",
    keyPoints: [
      "당사자가 등기원인에 특정 약정을 포함시켰더라도, 법령상 등기기록에 기록할 수 없는 사항으로 정해진 것은 등기할 수 없다.",
      "수용으로 인한 소유권이전등기를 신청하는 경우, 재결수용의 요건과 절차에 관한 특유의 규정이 적용된다.",
      "말소등기는 기존 등기를 소멸시키는 등기로서, 등기상 이해관계 있는 제3자가 있으면 그 승낙서 등을 첨부해야 하는 경우가 있다.",
      "등기의 효력(순위확정력, 대항력, 추정력 등)은 등기의 유형과 무관하게 부동산등기법 전반에 걸쳐 공통적으로 적용되는 총론적 논점이다.",
    ],
    pitfalls:
      "당사자 간 약정이 있으면 어떤 사항이든 등기기록에 기록할 수 있다고 착각하기 쉽다 — 법령상 기록할 수 없는 사항으로 정해진 것은 약정으로도 등기할 수 없다.",
    example:
      "당사자가 특약으로 등기원인에 특정 조건을 붙였더라도, 그 조건이 법령상 등기기록에 기록할 수 없는 사항이라면 등기관은 이를 등기부에 기록하지 않는다.",
    questionRefs: [
      { year: 2016, questionNo: 24 },
      { year: 2017, questionNo: 16 },
      { year: 2019, questionNo: 16 },
      { year: 2019, questionNo: 18 },
      { year: 2020, questionNo: 14 },
      { year: 2020, questionNo: 15 },
      { year: 2020, questionNo: 19 },
      { year: 2020, questionNo: 20 },
      { year: 2021, questionNo: 20 },
      { year: 2021, questionNo: 23 },
      { year: 2023, questionNo: 14 },
      { year: 2024, questionNo: 13 },
      { year: 2024, questionNo: 18 },
    ],
  },
  {
    slug: "registration-application-procedure",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "등기신청 절차",
    titleKo: "등기신청의 주체와 열람·이의신청",
    titleEn: "Registration Applicants, Public Access, and Objections",
    definition:
      "법인의 등록번호는 주된 사무소 소재지 관할 등기소의 등기관이 부여하며, 등기기록의 열람은 이해관계인 여부와 관계없이 누구든지 청구할 수 있다.",
    intuition:
      "등기부는 공시(公示)를 목적으로 하는 공적 장부이므로 열람의 문턱을 낮게 두는 반면, 등기관의 처분에 대한 불복(이의신청)은 거래 안정을 위해 집행정지 효력을 주지 않는다는 점이 대조된다.",
    keyPoints: [
      "법인의 등록번호는 시장·군수·구청장이 아니라 관할 등기소의 등기관이 부여한다.",
      "등기기록에 기록된 사항은 이해관계인이 아니어도 누구든지 열람을 청구할 수 있다.",
      "등기관의 처분에 대한 이의신청은 집행정지의 효력이 없으며, 법인 아닌 사단은 전자신청을 할 수 없다.",
    ],
    pitfalls:
      "등록번호 부여기관을 '시장·군수·구청장'으로 잘못 기억하는 경우가 많다 — 부여 주체는 등기관이다.",
    example:
      "새로 설립된 법인이 부동산 등기를 위해 등록번호가 필요하면, 주된 사무소 소재지를 관할하는 등기소에서 이를 부여받는다.",
    questionRefs: [
      { year: 2016, questionNo: 15 },
      { year: 2016, questionNo: 16 },
      { year: 2017, questionNo: 14 },
      { year: 2017, questionNo: 23 },
      { year: 2019, questionNo: 15 },
      { year: 2021, questionNo: 13 },
      { year: 2021, questionNo: 15 },
      { year: 2022, questionNo: 15 },
      { year: 2023, questionNo: 24 },
      { year: 2024, questionNo: 23 },
    ],
  },
  {
    slug: "registration-applicant-capacity",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "등기신청 절차",
    parentSlug: "registration-application-procedure",
    titleKo: "등기신청의 당사자 — 공동신청과 단독신청",
    titleEn: "Joint vs. Sole Registration Applicants",
    definition:
      "등기신청은 원칙적으로 등기권리자와 등기의무자가 공동으로 하지만, 등기의 성질상 상대방이 없거나 등기의무자의 협력을 요하지 않는 경우에는 등기권리자(또는 등기명의인)가 단독으로 신청할 수 있다.",
    intuition:
      "공동신청주의는 등기의 진정성을 담보하기 위한 원칙인데, 판결·상속·보존등기처럼 진정성이 이미 다른 방법으로 담보되거나 애초에 상대방이 없는 경우에는 단독신청을 허용해 절차를 간소화한다.",
    keyPoints: [
      "원칙은 등기권리자와 등기의무자의 공동신청이지만, 법률에 단독신청이 명시된 예외가 있다.",
      "토지수용에 의한 소유권이전등기(사업시행자 단독), 포괄유증에 의한 소유권이전등기(수증자 단독), 가등기명의인의 가등기말소등기는 단독신청이 가능하다.",
      "근저당권의 채권최고액을 감액하는 변경등기처럼 상대방의 이익에 영향을 주는 등기는 여전히 공동신청이 필요하다.",
    ],
    pitfalls:
      "가등기말소는 가등기명의인이 단독으로 할 수 있지만, 근저당권 변경등기(채권최고액 감액 등)는 여전히 공동신청 대상이라는 점을 혼동하기 쉽다.",
    example:
      "한국토지주택공사가 토지를 수용한 경우, 그 수용에 따른 소유권이전등기는 사업시행자인 한국토지주택공사가 단독으로 신청할 수 있다.",
    questionRefs: [
      { year: 2016, questionNo: 20 },
      { year: 2017, questionNo: 17 },
      { year: 2019, questionNo: 13 },
      { year: 2020, questionNo: 16 },
      { year: 2021, questionNo: 14 },
      { year: 2022, questionNo: 14 },
      { year: 2024, questionNo: 14 },
      { year: 2025, questionNo: 13 },
    ],
  },
  {
    slug: "registration-rejection-grounds",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "등기신청 절차",
    parentSlug: "registration-application-procedure",
    titleKo: "등기신청의 각하사유",
    titleEn: "Grounds for Rejecting a Registration Application",
    definition:
      "등기관은 등기신청이 부동산등기법 제29조 각 호의 각하사유에 해당하면 그 신청을 각하해야 하며, 그중 제2호 '사건이 등기할 것이 아닌 경우'는 실체법상 허용되지 않는 등기를 신청한 경우를 말한다.",
    intuition:
      "각하사유는 절차적 흠(신청정보 불비 등)과 실체적 흠('사건이 등기할 것이 아닌 경우')으로 나뉘는데, 후자는 등기가 실행되더라도 무효가 되는 등기를 애초에 걸러내기 위한 장치다.",
    keyPoints: [
      "구분건물의 전유부분과 대지사용권의 분리처분 금지를 위반한 등기, 농지에 대한 전세권설정등기 신청은 '사건이 등기할 것이 아닌 경우'로 각하된다.",
      "소유권 외의 권리가 등기된 일반건물에 대한 멸실등기 신청도 각하사유에 해당한다.",
      "공동상속인 중 일부가 자신의 상속지분만에 대해 상속등기를 신청하는 것은 상속등기의 성질상 허용되어 각하사유가 아니다.",
    ],
    pitfalls:
      "공유·상속재산에 대해 지분만 등기신청하는 것을 무조건 각하사유로 오해하기 쉽지만, 상속등기의 경우 지분만의 신청도 허용된다.",
    example:
      "농지에 전세권을 설정하는 등기를 신청하면, 농지법상 농지에는 전세권을 설정할 수 없으므로 등기관은 이를 각하한다.",
    questionRefs: [
      { year: 2018, questionNo: 16 },
      { year: 2019, questionNo: 14 },
      { year: 2023, questionNo: 21 },
      { year: 2024, questionNo: 16 },
    ],
  },
  {
    slug: "registration-objection-procedure",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "등기신청 절차",
    parentSlug: "registration-application-procedure",
    titleKo: "등기관 처분에 대한 이의신청과 기록명령",
    titleEn: "Objections to Registrar Decisions and Record Orders",
    definition:
      "등기관의 처분(각하 등)에 불복하는 자는 관할 지방법원에 이의신청을 할 수 있으나, 이의신청은 등기소에 이의신청서를 제출하는 방법으로 하며, 각하결정에 대한 이의신청이 인용되어 기록명령이 내려지면 등기관은 그 명령에 따라 등기를 실행한다.",
    intuition:
      "이의신청은 등기관의 처분이 위법·부당함을 다투는 절차이지 새로운 사실을 주장하는 재심사가 아니므로, 처분 당시 제출되지 않은 새 사실은 이의사유가 될 수 없다.",
    keyPoints: [
      "이의신청은 등기소에 이의신청서를 제출하는 방법으로 하며(관할법원에 직접 제출하는 것이 아님), 신청기간에 제한이 없다.",
      "등기관의 처분시 주장·제출하지 않은 새로운 사실을 근거로는 이의신청을 할 수 없고, 등기신청인이 아닌 제3자는 각하결정에 대해 이의신청을 할 수 없다.",
      "이의신청 중에도 그 부동산에 대한 다른 등기신청은 수리되며(집행정지 효력 없음), 기록명령이 있어도 그 사이 사건이 등기할 것이 아닌 경우가 된 때에는 기록명령에 따른 등기를 할 수 없다.",
    ],
    pitfalls:
      "이의신청을 관할 지방법원에 직접 제출하는 것으로 착각하기 쉽지만, 실제로는 등기소에 제출한다.",
    example:
      "등기신청이 각하되어 이의신청을 하는 사이 다른 사람이 같은 부동산에 대해 별도로 등기를 신청하면, 그 신청은 이의신청과 무관하게 정상적으로 수리된다.",
    questionRefs: [
      { year: 2017, questionNo: 24 },
      { year: 2019, questionNo: 20 },
      { year: 2020, questionNo: 21 },
      { year: 2023, questionNo: 20 },
      { year: 2025, questionNo: 24 },
    ],
  },
  {
    slug: "application-and-attachment-info",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "등기신청 절차",
    parentSlug: "registration-application-procedure",
    titleKo: "등기신청정보와 첨부정보",
    titleEn: "Application Information and Attached Documents",
    definition:
      "등기신청 시 등기소에 제공해야 하는 신청정보(부동산 표시, 등기원인, 신청인 등)와 첨부정보(등기원인증명, 등기필정보, 인감증명 등)는 부동산등기법·규칙에서 정한 사항이며, 매매로 인한 소유권이전등기의 경우 토지의 면적과 같은 부동산 표시사항이 신청정보에 포함되어야 한다.",
    intuition:
      "신청정보는 '무엇을 등기해달라는 것인지'를 특정하는 정보이고 첨부정보는 '그 신청이 진실하다는 것'을 뒷받침하는 자료로, 등기소는 등기부에 공시될 필요가 없는 사항(대리인의 주민등록번호 등)까지는 신청정보로 요구하지 않는다.",
    keyPoints: [
      "매매로 인한 토지소유권이전등기의 신청정보에는 토지의 표시 중 면적을 기재해야 하지만, 표시번호까지 기재할 필요는 없다.",
      "등기권리자의 등기필정보는 신청정보 사항이 아니며(등기의무자의 등기필정보만 문제됨), 대리인의 주민등록번호도 신청정보 사항이 아니다.",
      "신청인이 법인인 경우 그 대표자의 주민등록번호는 신청정보 사항이 아니다.",
    ],
    pitfalls:
      "등기필정보는 등기'의무자'만 제공하면 되는데, 등기권리자의 등기필정보까지 필요하다고 착각하기 쉽다.",
    example:
      "甲이 乙에게 토지를 매도하고 소유권이전등기를 신청할 때, 신청정보에는 그 토지의 면적을 기재해야 하지만 대리인의 주민등록번호까지 기재할 필요는 없다.",
    questionRefs: [
      { year: 2018, questionNo: 14 },
      { year: 2018, questionNo: 24 },
      { year: 2022, questionNo: 13 },
      { year: 2023, questionNo: 16 },
      { year: 2024, questionNo: 15 },
      { year: 2025, questionNo: 15 },
      { year: 2025, questionNo: 16 },
      { year: 2025, questionNo: 21 },
    ],
  },
  {
    slug: "special-registration-application-cases",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "등기신청 절차",
    parentSlug: "registration-application-procedure",
    titleKo: "등기신청의 특수 사례 — 대위신청·검인·말소승낙서",
    titleEn: "Special Cases: Creditor Subrogation, Verification Seals, Consent Letters",
    definition:
      "채권자대위에 의한 등기신청, 등기원인증서에 대한 검인, 지체 없이 해야 하는 등기, 말소등기 시 승낙서를 첨부해야 하는 이해관계인 등은 등기신청 절차에서 문제되는 대표적인 특수 사례들이다.",
    intuition:
      "이 사례들은 모두 '누가 진짜 신청인·이해관계인인가'를 가려내는 문제로 수렴한다 — 대위등기에서는 채무자가 여전히 등기신청인이고, 말소등기에서는 순위상 후순위 권리자만 승낙서가 필요한 이해관계인이 된다.",
    keyPoints: [
      "채권자대위등기에서 등기신청인은 대위채권자(甲)가 아니라 채무자(乙)이며, 대위원인을 증명하는 정보를 첨부해야 하고 등기완료통지는 乙에게 한다.",
      "검인은 공유물분할합의·양도담보계약·명의신탁해지약정을 원인으로 한 소유권이전등기 신청 시 필요하지만, 임의경매나 진정명의회복을 원인으로 한 경우에는 필요 없다.",
      "말소등기의 승낙서 첨부 대상은 말소되는 권리보다 후순위인 이해관계인(예: 지상권을 목적으로 하는 저당권자, 소유권보존등기 말소 시 가압류권자)이며, 선순위 권리자는 대상이 아니다.",
      "규약폐지로 공용부분을 취득한 자의 소유권보존등기, 신탁재산 운용방법 변경에 따른 신탁원부 기록의 변경등기는 '지체 없이' 해야 하는 등기에 해당한다.",
    ],
    pitfalls:
      "채권자대위등기에서 등기신청인을 대위채권자로 착각하기 쉽지만, 신청인은 어디까지나 채무자이고 대위채권자는 그를 대신해 신청할 뿐이다.",
    example:
      "甲이 乙에 대한 채권을 보전하기 위해 乙을 대위하여 등기를 신청하는 경우, 등기완료통지는 실제 등기명의인이 되는 乙에게 이루어진다.",
    questionRefs: [
      { year: 2016, questionNo: 19 },
      { year: 2016, questionNo: 21 },
      { year: 2017, questionNo: 20 },
      { year: 2018, questionNo: 18 },
      { year: 2020, questionNo: 13 },
      { year: 2021, questionNo: 16 },
      { year: 2022, questionNo: 16 },
      { year: 2022, questionNo: 17 },
      { year: 2023, questionNo: 13 },
    ],
  },
  {
    slug: "provisional-registration",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "가등기",
    titleKo: "가등기의 청구권 범위·신청절차와 본등기의 효력",
    titleEn: "Scope of Claims, Filing Procedure, and Effect of Final Registration",
    definition:
      "가등기는 채권적 청구권(정지조건부 청구권 포함)을 보전하기 위해 신청할 수 있지만 해제조건부 청구권이나 물권적 청구권, 소유권보존등기를 위한 가등기는 허용되지 않으며, 가등기권리자와 의무자가 공동으로 신청하거나 의무자의 승낙·가처분명령이 있으면 권리자가 단독으로 신청할 수 있고, 본등기의 물권변동 효력은 가등기 시로 소급하지 않는다.",
    intuition:
      "가등기는 장래에 본등기를 할 청구권을 미리 순위 보전해주는 제도이므로, 이미 확정적으로 존재하는 물권적 청구권이나 애초에 순위 다툼이 없는 보존등기에는 필요하지도, 허용되지도 않는다는 원칙에서 세부 규정들이 파생된다.",
    keyPoints: [
      "정지조건부 청구권은 가등기 대상이지만 해제조건부 청구권은 가등기를 할 수 없으며, 물권적 청구권이나 소유권보존등기를 위한 가등기는 허용되지 않는다.",
      "가등기는 가등기권리자와 의무자가 공동으로 신청할 수 있고, 의무자의 승낙이 있거나 가등기를 명하는 법원의 가처분명령이 있으면 권리자가 단독으로 신청할 수 있으며, 가등기명의인은 단독으로 가등기의 말소를 신청할 수 있고 의무자도 명의인의 승낙을 받아 단독으로 말소를 신청할 수 있다.",
      "본등기에 의한 물권변동의 효력은 가등기한 때로 소급하지 않고 본등기를 한 때에 발생한다(순위만 가등기 시로 소급함). 가등기가 있다고 해서 소유권이전등기를 청구할 법률관계가 있다고 추정되지는 않는다.",
      "하나의 가등기에 여러 명의 가등기권자가 있는 경우 그중 일부만으로는 공유물보존행위에 준해 가등기 전부에 관한 본등기를 신청할 수 없으며, 가등기 목적물의 소유권이 가등기 후 제3자에게 이전되어도 본등기신청의 등기의무자는 여전히 원래의 가등기의무자다.",
    ],
    pitfalls:
      "본등기의 물권변동 효력이 가등기 시로 소급한다고 착각하기 쉽지만, 실제로는 순위만 가등기 시로 소급할 뿐 물권변동의 효력 자체는 본등기 시에 발생한다.",
    example:
      "정지조건부로 소유권이전등기청구권을 취득하기로 한 경우 그 청구권을 보전하기 위한 가등기를 할 수 있지만, 해제조건부인 경우에는 가등기를 할 수 없다.",
    questionRefs: [
      { year: 2016, questionNo: 17 },
      { year: 2017, questionNo: 22 },
      { year: 2018, questionNo: 19 },
      { year: 2019, questionNo: 17 },
      { year: 2020, questionNo: 22 },
      { year: 2021, questionNo: 22 },
      { year: 2022, questionNo: 21 },
      { year: 2023, questionNo: 19 },
      { year: 2024, questionNo: 24 },
    ],
  },
  {
    slug: "provisional-registration-ex-officio-cancellation",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "가등기",
    parentSlug: "provisional-registration",
    titleKo: "가등기 후 본등기 시 직권말소의 범위",
    titleEn: "Scope of Ex Officio Cancellation upon Final Registration",
    definition:
      "소유권이전청구권보전 가등기에 의해 본등기가 이루어지면 그 가등기 후에 마쳐진 소유권이전등기·제한물권(지상권·지역권·저당권·임차권 등) 설정등기는 직권말소되지만 가등기상 권리를 목적으로 한 가압류·가처분등기는 말소되지 않으며, 용익물권(지상권 등) 설정청구권보전 가등기에 의해 본등기가 이루어지면 그 본등기와 양립할 수 없는 이후의 용익권 설정등기만 말소되고 저당권·압류·가압류 등은 말소되지 않는다.",
    intuition:
      "직권말소 범위는 결국 본등기로 실현되는 권리와 양립할 수 없는 등기인가로 판단하면 된다 — 소유권이전 본등기는 거의 모든 후행 등기와 양립 불가능하지만, 지상권 같은 용익권 본등기는 저당권·압류처럼 소유권을 전제로 한 등기와는 양립할 수 있다.",
    keyPoints: [
      "소유권이전청구권보전 가등기 후 본등기가 되면, 그 사이에 마쳐진 소유권이전등기, 지상권·지역권·저당권·임차권 설정등기는 모두 직권말소된다.",
      "다만 가등기상 권리(청구권) 자체를 목적으로 한 가압류·가처분등기나, 가등기 전부터 대항력을 갖춘 임차권은 본등기로 인해 소멸하는 것이 아니므로 직권말소 대상이 아니다.",
      "지상권 등 용익물권 설정청구권보전 가등기에 의해 본등기가 이루어지면, 그 용익권과 양립할 수 없는 이후의 임차권·용익권 설정등기만 말소되고, 저당권·체납처분압류·가압류·가처분·소유권이전등기는 말소되지 않는다.",
    ],
    pitfalls:
      "지상권설정 가등기에 의한 본등기 시에도 저당권이나 압류등기가 말소된다고 착각하기 쉽지만, 용익권 가등기의 본등기는 그와 양립 불가능한 용익권 설정등기만 말소시키고 저당권·압류는 말소시키지 않는다.",
    example:
      "소유권이전청구권보전 가등기에 의해 본등기가 되면 그 사이 마쳐진 저당권설정등기는 직권말소되지만, 그 가등기상 권리를 목적으로 한 가압류등기는 말소되지 않는다.",
    questionRefs: [
      { year: 2016, questionNo: 13 },
      { year: 2022, questionNo: 23 },
      { year: 2024, questionNo: 22 },
      { year: 2025, questionNo: 23 },
    ],
  },
  {
    slug: "building-status-registration",
    chapterKo: "부동산등기법",
    category: "부동산등기법",
    subcategory: "표시에 관한 등기",
    titleKo: "건물의 표시등기와 부기등기",
    titleEn: "Building Description Registration and Sub-Registration",
    definition:
      "건물의 소유권 등기명의인은 건축물대장상 건물의 합병등록이 있은 날로부터 1개월 이내에 건물합병등기를 신청해야 하며, 저당권 이전등기와 같이 기존 등기의 동일성을 유지하는 등기는 부기등기로 한다.",
    intuition:
      "'표시에 관한 등기'는 부동산 자체의 물리적 현황(면적·구조·합병 등)을 반영하는 등기이고, 부기등기는 기존 순위를 그대로 유지하면서 덧붙이는 등기라는 두 축을 구분해서 이해하면 된다.",
    keyPoints: [
      "건축물대장상 건물 합병등록이 있으면, 소유권 등기명의인은 그 날로부터 1개월 이내에 건물합병등기를 신청해야 한다.",
      "저당권 이전등기는 기존 저당권의 동일성을 유지하는 등기이므로 부기등기로 한다.",
      "폐쇄한 등기기록은 영구히 보존해야 한다.",
    ],
    pitfalls:
      "저당권 이전등기를 주등기로 착각하기 쉽다 — 기존 등기와 동일성을 유지하는 등기이므로 부기등기로 실행된다.",
    example:
      "인접한 두 건물이 건축물대장상 하나로 합병 등록되었다면, 소유권 등기명의인은 합병등록일로부터 1개월 이내에 건물합병등기를 신청해야 한다.",
  },
];

export default concepts;
