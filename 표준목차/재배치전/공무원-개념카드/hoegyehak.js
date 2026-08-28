export default [
  {
    "slug": "acc-closing-adjustments",
    "chapterKo": "재무회계",
    "sectionKo": "제3장 회계순환과 결산",
    "category": "재무회계 기초",
    "subcategory": "회계순환과 결산",
    "titleKo": "결산수정분개 6유형 — 이연 4형ㆍ발생 2형을 한 장으로",
    "definition": "기말에 기록을 **기간 귀속에 맞게 고치는** 절차가 결산수정분개다 — **이연**(선수수익·선급비용), **발생**(미수수익·미지급비용), **추정**(감가상각·대손)으로 나뉜다.",
    "intuition": "「돈이 언제 움직였나」와 「일이 언제 일어났나」가 어긋난 자리마다 수정분개가 하나씩 붙는다.",
    "compareCard": {
      "left": {
        "title": "이연 — 현금이 먼저",
        "body": "미리 받았으면 선수수익(부채), 미리 냈으면 선급비용(자산)으로 미룬다. 시산표 합계는 늘지 않는다."
      },
      "right": {
        "title": "발생 — 손익이 먼저",
        "body": "벌었는데 못 받았으면 미수수익(자산), 썼는데 안 냈으면 미지급비용(부채)을 새로 세운다. 시산표 합계가 양변 모두 늘어난다."
      }
    },
    "deepDive": [
      {
        "title": "소모품 두 가지 기록법",
        "body": "자산법(구입 시 소모품)이면 기말에 쓴 만큼을 (차)소모품비 (대)소모품으로 빼고, 비용법(구입 시 소모품비)이면 남은 만큼을 (차)소모품 (대)소모품비로 되돌린다. “구입액－기말재고＝사용액”이라는 뼈대는 같고 어느 쪽을 분개로 적느냐만 다르다."
      },
      {
        "title": "선수수익 방향을 자주 뒤집는다",
        "body": "선수수익은 부채이므로 수익을 벌면 줄어든다. 따라서 (차)선수수익 (대)수익이 맞는다. 금액은 맞게 계산해 놓고 좌우만 바꿔 놓은 선지가 반복해서 나온다."
      },
      {
        "title": "수정분개가 시산표 합계에 미치는 영향",
        "body": "이연은 이미 있던 계정끼리 자리를 바꾸므로 합계가 그대로이고, 발생은 없던 자산ㆍ부채를 세우므로 차변과 대변 합계가 각각 그 금액만큼 커진다. 수정전ㆍ후 합계 차이를 묻는 문제는 이 구분만으로 풀린다."
      }
    ],
    "keyPoints": [
      "선수수익ㆍ선급비용 = 이연 → 시산표 합계 불변",
      "미수수익ㆍ미지급비용 = 발생 → 양변 합계 증가",
      "소모품: 자산법이면 사용액을 비용으로, 비용법이면 잔액을 자산으로",
      "선수수익 감소는 차변 — 방향을 뒤집은 선지가 단골",
      "감가상각ㆍ대손은 추정에 따른 배분형 수정분개",
      "수정분개는 현금 계정을 건드리지 않는다"
    ],
    "pitfallCards": [
      {
        "wrong": "선수수익 중 당기 몫을 인식할 때 (차)수익 (대)선수수익으로 적는다.",
        "correct": "반대다. 부채인 선수수익이 줄어드는 것이므로 (차)선수수익 (대)수익이다."
      },
      {
        "wrong": "기말수정분개를 하면 언제나 시산표 합계가 늘어난다.",
        "correct": "이연 유형은 계정 사이의 대체라 합계가 그대로다. 합계를 늘리는 것은 발생 유형뿐이다."
      },
      {
        "wrong": "소모품을 구입할 때 비용으로 적었으면 기말에 사용액을 비용으로 추가 계상한다.",
        "correct": "이미 전액이 비용이므로 반대로 남은 잔액을 자산으로 되돌린다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-지방직-Q1",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2017-국가직-Q3",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2017-지방직-Q3",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2017-지방직-Q6",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2018-국가직-Q3",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2018-지방직-Q10",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2018-지방직-Q11",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2019-국가직-Q1",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2019-지방직-Q1",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2019-국가직-Q6",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2020-지방직-Q9",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2020-국가직-Q14",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2021-국가직-Q1",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2021-지방직-Q2",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2021-지방직-Q3",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2021-국가직-Q7",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2021-국가직-Q8",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2021-국가직-Q14",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2021-국가직-Q16",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2021-지방직-Q19",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2022-국가직-Q1",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2022-지방직-Q2",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2022-국가직-Q13",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2022-국가직-Q15",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2022-지방직-Q15",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2022-국가직-Q18",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2022-지방직-Q20",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2023-지방직-Q1",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2023-지방직-Q2",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2023-국가직-Q17",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2024-국가직-Q1",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2024-지방직-Q1",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2024-지방직-Q2",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2024-국가직-Q3",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2024-국가직-Q6",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2025-지방직-Q1",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2025-지방직-Q3",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2025-지방직-Q6",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2025-국가직-Q7",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2025-지방직-Q10",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2025-지방직-Q13",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2025-국가직-Q15",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2025-국가직-Q16",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2025-국가직-Q17",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2025-국가직-Q18",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2026-지방직-Q1",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2026-국가직-Q2",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2026-지방직-Q3",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2026-지방직-Q4",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2026-지방직-Q6",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2026-국가직-Q9",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 9
      }
    ]
  },
  {
    "slug": "acc-gov-national-standard",
    "chapterKo": "정부회계",
    "sectionKo": "제1장 국가회계기준",
    "category": "정부회계",
    "subcategory": "국가회계기준",
    "titleKo": "국가회계기준 — 재정상태표ㆍ재정운영표의 뼈대와 최근 개정",
    "definition": "재정운영표는 손익계산서와 달리 **원가에서 출발해 내려간다** — 프로그램순원가 → 재정운영순원가 → 재정운영결과의 흐름이다.",
    "intuition": "순서가 곧 계산식이라 순서를 외우면 계산 문항이 한 줄로 풀린다.",
    "compareCard": {
      "left": {
        "title": "재정상태표",
        "body": "자산 = 부채 + 순자산. 자산은 유동ㆍ투자ㆍ일반유형ㆍ사회기반시설ㆍ무형ㆍ기타 비유동."
      },
      "right": {
        "title": "재정운영표",
        "body": "프로그램총원가 − 프로그램수익 = 프로그램순원가 → ＋관리운영비ㆍ비배분비용 −비배분수익 = 재정운영순원가 → −비교환수익 = 재정운영결과."
      }
    },
    "deepDive": [
      {
        "title": "유산자산 공시 위치 [개정]",
        "body": "2024년 7월 31일 개정으로 유산자산은 필수보충정보가 아니라 주석에 공시하도록 바뀌었고 종전 제54조는 삭제되었다. 지방자치단체 회계기준의 관련 규정은 그대로이므로 두 기준을 섞어 묻는 선지에 주의해야 한다."
      },
      {
        "title": "사회기반시설의 감가상각 면제",
        "body": "관리ㆍ유지 노력에 따라 취득 당시의 용역 잠재력을 그대로 유지할 수 있는 사회기반시설은 감가상각하지 않을 수 있다. 다만 그 사실과 관리 방법을 주석에 적어야 한다."
      },
      {
        "title": "자산ㆍ부채의 평가",
        "body": "자산은 취득원가를 원칙으로 하되 무주부동산 취득이나 관리전환처럼 대가 없이 취득한 경우 공정가액을 취득원가로 본다. 국가채무는 원칙적으로 만기상환가액으로 평가한다."
      }
    ],
    "keyPoints": [
      "재정운영표는 원가에서 출발해 내려가는 구조",
      "프로그램순원가 = 프로그램총원가 − 프로그램수익",
      "재정운영순원가 = 프로그램순원가 + 관리운영비 + 비배분비용 − 비배분수익",
      "재정운영결과 = 재정운영순원가 − 비교환수익 등",
      "순자산 3구분: 기본순자산ㆍ적립금및잉여금ㆍ순자산조정",
      "유산자산은 주석 공시로 개정(2024.7.31)"
    ],
    "pitfallCards": [
      {
        "wrong": "재정운영결과가 클수록 재정 성과가 좋다.",
        "correct": "재정운영결과는 순원가 개념이라 작을수록 좋다. 기업의 이익과 방향이 반대다."
      },
      {
        "wrong": "유산자산은 필수보충정보로 공시한다.",
        "correct": "국가회계기준은 2024년 개정으로 주석 공시로 바꾸었다. 지방자치단체 쪽 규정과 혼동하기 쉽다."
      },
      {
        "wrong": "모든 사회기반시설은 감가상각한다.",
        "correct": "관리ㆍ유지로 용역 잠재력이 유지되는 경우에는 감가상각하지 않을 수 있다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q9",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2017-지방직-Q12",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2018-지방직-Q9",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2018-국가직-Q11",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2018-국가직-Q17",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2019-국가직-Q13",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2019-국가직-Q16",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2020-국가직-Q4",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2020-지방직-Q13",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2020-국가직-Q19",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2021-국가직-Q11",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2021-지방직-Q15",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2022-국가직-Q5",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2022-지방직-Q18",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2023-국가직-Q14",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2024-국가직-Q18",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2025-국가직-Q1",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2025-국가직-Q9",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2025-지방직-Q16",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 16
      }
    ]
  },
  {
    "slug": "acc-gov-local-standard",
    "chapterKo": "정부회계",
    "sectionKo": "제2장 지방자치단체 회계기준",
    "category": "정부회계",
    "subcategory": "지방자치단체 회계기준",
    "titleKo": "지방자치단체 회계기준 — 국가회계기준과 갈리는 자리만",
    "definition": "국가회계기준과 큰 틀이 닮아 시험은 **갈리는 자리만** 묻는다 — 자산에 **주민편의시설**이 있는지, 순자산을 **고정·특정·일반**으로 나누는지가 그 자리다.",
    "intuition": "두 목록을 나란히 놓고 다른 낱말에 표시해 두면 선지를 하나씩 대조할 수 있다.",
    "compareCard": {
      "left": {
        "title": "국가",
        "body": "재무제표: 재정상태표ㆍ재정운영표ㆍ순자산변동표(현금흐름표 없음). 순자산: 기본순자산ㆍ적립금및잉여금ㆍ순자산조정."
      },
      "right": {
        "title": "지방자치단체",
        "body": "재무제표: 재정상태표ㆍ재정운영표ㆍ현금흐름표ㆍ순자산변동표. 순자산: 고정순자산ㆍ특정순자산ㆍ일반순자산. 자산에 주민편의시설이 있다."
      }
    },
    "deepDive": [
      {
        "title": "무형자산 상각",
        "body": "지방자치단체 기준은 무형자산을 정액법에 따라 해당 자산을 사용할 수 있는 시점부터 상각하도록 정한다. 상각방법을 콕 집어 정해 둔 점이 국가 쪽과 대비된다."
      },
      {
        "title": "재정운영표의 표시",
        "body": "지방자치단체 재정운영표는 회계 단위별로 표시하며 일반회계ㆍ기타특별회계ㆍ기금회계ㆍ지방공기업특별회계로 나뉜다. 내부거래는 상계하여 작성한다."
      },
      {
        "title": "자산ㆍ부채 평가",
        "body": "자산은 취득원가를 원칙으로 하되 교환ㆍ기부채납ㆍ무상취득은 공정가액을 취득원가로 한다. 이 원칙 자체는 국가 쪽과 같아서 선지에서 구분 요소로 쓰이지 않는다."
      }
    ],
    "keyPoints": [
      "지방자치단체 재무제표에는 현금흐름표가 포함된다",
      "자산 분류에 “주민편의시설”이 있다 — 국가에는 없다",
      "순자산 3구분: 고정순자산ㆍ특정순자산ㆍ일반순자산",
      "무형자산은 정액법으로 상각",
      "재정운영표는 회계 단위별로 표시하고 내부거래는 상계"
    ],
    "pitfallCards": [
      {
        "wrong": "지방자치단체 순자산은 기본순자산ㆍ적립금및잉여금ㆍ순자산조정으로 나뉜다.",
        "correct": "그것은 국가회계기준이다. 지방자치단체는 고정ㆍ특정ㆍ일반 순자산으로 나눈다."
      },
      {
        "wrong": "국가와 지방자치단체 모두 재무제표에 현금흐름표가 들어간다.",
        "correct": "현금흐름표를 재무제표로 두는 쪽은 지방자치단체다."
      },
      {
        "wrong": "주민편의시설은 국가회계기준의 자산 분류에도 있다.",
        "correct": "주민편의시설은 지방자치단체 회계기준에만 있는 분류다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-지방직-Q11",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2017-국가직-Q19",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2018-지방직-Q3",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2018-국가직-Q16",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2019-지방직-Q13",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2019-지방직-Q15",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2020-지방직-Q12",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2021-지방직-Q14",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2021-국가직-Q19",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2022-지방직-Q10",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2022-국가직-Q16",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2023-지방직-Q7",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2023-국가직-Q15",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2023-지방직-Q18",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2024-지방직-Q6",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2024-지방직-Q11",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2024-지방직-Q20",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2025-지방직-Q15",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2026-지방직-Q14",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2026-지방직-Q15",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2026-국가직-Q17",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 17
      }
    ]
  },
  {
    "slug": "acc-inventory-flow-lcnrv",
    "chapterKo": "재무회계",
    "sectionKo": "제5장 재고자산",
    "category": "자산",
    "subcategory": "재고자산",
    "titleKo": "재고자산 — 원가흐름 가정과 감모ㆍ평가의 순서",
    "definition": "재고자산은 **취득원가와 순실현가능가치 중 낮은 금액**으로 측정하고, 원가흐름 가정은 **개별법·선입선출법·가중평균법**만 인정된다.",
    "intuition": "수량 먼저, 단가 나중이라는 순서를 지켜야 없어진 재고를 두 번 깎지 않는다.",
    "compareCard": {
      "left": {
        "title": "감모손실",
        "body": "(장부수량 − 실지수량) × 단위당 취득원가. 정상분은 매출원가, 비정상분은 영업외비용으로 나눈다."
      },
      "right": {
        "title": "평가손실",
        "body": "실지수량 × (취득원가 − 순실현가능가치). 전액 매출원가에 포함하고 재고자산평가충당금으로 차감 표시한다."
      }
    },
    "deepDive": [
      {
        "title": "순실현가능가치와 현행대체원가",
        "body": "상품ㆍ제품ㆍ재공품은 순실현가능가치로 저가법을 적용한다. 현행대체원가는 원재료의 저가법 판단에서만 쓰이며, 그 원재료로 만든 제품이 원가 이상으로 팔릴 것으로 예상되면 원재료는 감액하지 않는다. 문제가 두 값을 함께 주면 고르라는 뜻이다."
      },
      {
        "title": "기말재고 귀속 판단",
        "body": "선적지 인도조건 미착품은 매입자 재고, 도착지 인도조건 미착품은 판매자 재고다. 적송품은 수탁자가 팔기 전까지 위탁자 재고, 시용품은 고객이 구매의사를 밝히기 전까지 판매자 재고다. 담보로 제공한 재고는 소유권이 그대로이므로 재고에 남는다."
      },
      {
        "title": "기말재고 오류가 이익에 미치는 방향",
        "body": "기말재고를 과대계상하면 매출원가가 과소해져 당기순이익이 과대해진다. 그리고 이 오류는 다음 해 기초재고를 통해 반대 방향으로 자동 상쇄된다."
      }
    ],
    "keyPoints": [
      "순실현가능가치 = 추정판매가 − 추정 완성원가 − 판매비용",
      "감모(수량) 먼저, 평가(단가) 나중 — 순서를 바꾸면 이중계산",
      "평가손실은 실지수량에만 적용",
      "정상감모ㆍ평가손실은 매출원가, 비정상감모는 영업외비용",
      "후입선출법은 K-IFRS 에서 인정되지 않는다",
      "기말재고 과대 → 매출원가 과소 → 이익 과대"
    ],
    "pitfallCards": [
      {
        "wrong": "평가손실을 장부수량 전체에 대해 계산한다.",
        "correct": "감모로 이미 털어낸 수량을 또 깎는 셈이다. 평가는 실지수량에만 적용한다."
      },
      {
        "wrong": "상품의 저가법 판단에 현행대체원가를 쓴다.",
        "correct": "상품ㆍ제품은 순실현가능가치를 쓴다. 현행대체원가는 원재료의 기준이다."
      },
      {
        "wrong": "도착지 인도조건으로 매입해 운송 중인 상품은 매입자의 기말재고에 포함한다.",
        "correct": "도착해야 소유권이 넘어오므로 아직 판매자의 재고다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-지방직-Q4",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2017-지방직-Q20",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2018-지방직-Q6",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2018-국가직-Q19",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2019-국가직-Q3",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2019-국가직-Q19",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2020-국가직-Q1",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2020-국가직-Q5",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2020-지방직-Q8",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2020-국가직-Q13",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2021-국가직-Q9",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2021-지방직-Q16",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2022-지방직-Q4",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2022-국가직-Q7",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2022-지방직-Q16",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2022-국가직-Q19",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2023-국가직-Q9",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2023-지방직-Q9",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2023-지방직-Q13",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2024-국가직-Q8",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2024-지방직-Q10",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2025-국가직-Q5",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2025-지방직-Q8",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2026-국가직-Q4",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2026-지방직-Q8",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2026-지방직-Q9",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 9
      }
    ]
  },
  {
    "slug": "acc-fs-presentation",
    "chapterKo": "재무회계",
    "sectionKo": "제2장 재무제표 표시",
    "category": "재무회계 기초",
    "subcategory": "재무제표 표시",
    "titleKo": "재무제표 표시 — 상계 금지ㆍ중요성ㆍ주석의 지위",
    "definition": "이 단원은 **「무엇이 재무제표에 포함되는가」와 「무엇을 합치거나 지울 수 있는가」**를 묻는다 — **주석은 붙임 서류가 아니라 재무제표의 일부**다.",
    "intuition": "대손충당금이나 감가상각누계액을 빼서 순액으로 보이는 것은 상계가 아니라 측정이다.",
    "compareCard": {
      "left": {
        "title": "허용 — 통합표시ㆍ평가충당금 차감",
        "body": "중요하지 않은 항목은 유사한 것끼리 묶고, 대손충당금ㆍ감가상각누계액은 차감해 순액으로 측정한다."
      },
      "right": {
        "title": "금지 — 상계",
        "body": "매출채권과 매입채무처럼 서로 다른 항목을 지우는 것은 기준서가 요구하거나 허용하지 않는 한 금지된다."
      }
    },
    "deepDive": [
      {
        "title": "주석의 지위",
        "body": "주석은 재무제표의 다섯 구성요소 중 하나다. 기준서가 요구하는데 본문에 자리가 없는 정보, 요구하지 않아도 이해에 목적적합한 정보를 담고, 체계적인 순서로 표시하며 본문 항목과 상호 참조한다. “첨부되는 보조적 명세서”라는 표현이 반복되는 오답이다."
      },
      {
        "title": "발생기준의 예외",
        "body": "현금흐름 정보를 제외하고는 모든 재무제표를 발생기준으로 작성한다. 현금흐름표만 현금기준이라는 점이 이 원칙의 유일한 예외다."
      },
      {
        "title": "비용의 성격별ㆍ기능별 분류",
        "body": "기능별로 분류한 기업은 감가상각비ㆍ종업원급여비용 같은 성격별 정보를 추가로 공시해야 한다. 방향을 반대로 적은 선지가 자주 나온다."
      }
    ],
    "keyPoints": [
      "전체 재무제표 5종 — 주석 포함",
      "현금흐름 정보를 제외하면 발생기준",
      "중요하지 않은 항목은 통합표시 가능",
      "상계는 원칙적 금지, 평가충당금 차감은 상계가 아니다",
      "기능별 분류 기업이 성격별 추가 정보를 공시한다",
      "계속기업 존속가능성은 매 보고기간 말 평가"
    ],
    "pitfallCards": [
      {
        "wrong": "매출채권에서 대손충당금을 차감해 표시하는 것은 상계에 해당한다.",
        "correct": "같은 자산의 값을 제대로 매기는 측정이므로 상계가 아니다."
      },
      {
        "wrong": "주석은 재무제표에 첨부되는 보조적 명세서다.",
        "correct": "주석은 재무제표를 이루는 구성요소 중 하나다."
      },
      {
        "wrong": "성격별로 분류한 기업이 기능별 추가 정보를 공시한다.",
        "correct": "반대다. 기능별로 분류한 기업이 성격별 정보를 추가로 공시한다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-지방직-Q1",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2017-지방직-Q6",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2017-지방직-Q7",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2018-국가직-Q1",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2019-국가직-Q1",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2019-지방직-Q1",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2019-국가직-Q2",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2019-지방직-Q3",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2019-지방직-Q4",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2019-국가직-Q5",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2020-지방직-Q1",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2020-국가직-Q2",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2020-국가직-Q11",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2021-국가직-Q1",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2021-지방직-Q2",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2021-지방직-Q5",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2021-국가직-Q15",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2022-지방직-Q8",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2022-지방직-Q15",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2022-국가직-Q18",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2022-지방직-Q20",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2023-지방직-Q5",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2024-국가직-Q2",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2024-지방직-Q2",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2024-국가직-Q6",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2025-지방직-Q6",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2025-국가직-Q16",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2026-지방직-Q1",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2026-지방직-Q2",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2026-국가직-Q8",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2026-국가직-Q10",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 10
      }
    ]
  },
  {
    "slug": "acc-equity-transactions",
    "chapterKo": "재무회계",
    "sectionKo": "제10장 자본",
    "category": "부채와 자본",
    "subcategory": "자본거래",
    "titleKo": "자본거래 — 자본 총액을 움직이는 것과 이름표만 바꾸는 것",
    "definition": "자본거래는 주주와의 거래라 **손익을 발생시키지 않는다** — 유상증자·자기주식·현금배당은 자본 총액을 움직이고, 무상증자·주식배당·분할·병합은 그대로 둔다.",
    "intuition": "「자본 총계는 얼마인가」를 물으면 회사 금고를 드나든 돈만 따라가면 된다.",
    "compareCard": {
      "left": {
        "title": "자본 총액이 움직인다",
        "body": "유상증자(＋), 신주발행비(－), 자기주식 취득(－)ㆍ처분(＋), 현금배당(－), 당기순이익(＋)."
      },
      "right": {
        "title": "자본 총액이 그대로다",
        "body": "무상증자ㆍ주식배당(자본금↑ 잉여금↓), 주식분할ㆍ병합(자본금도 불변)."
      }
    },
    "deepDive": [
      {
        "title": "주식발행 직접원가",
        "body": "신주발행비는 비용이 아니라 발행금액에서 차감한다. 주식발행초과금이 생기면 거기서 빼고, 기존에 주식할인발행차금이 남아 있으면 새로 생긴 초과금과 우선 상계한다."
      },
      {
        "title": "자기주식 거래의 손익",
        "body": "처분이익은 자기주식처분이익(자본잉여금), 처분손실은 먼저 처분이익과 상계한 뒤 남으면 자기주식처분손실(자본조정)로 간다. 어느 쪽도 당기손익을 거치지 않는다."
      },
      {
        "title": "자본금과 자본 총액을 함께 묻는 유형",
        "body": "“자본금은 액면×주식수, 자본 총액은 실제 순유입액”이라는 두 축을 잡고 검산하면 자본금＋자본잉여금이 자본 총액과 맞아떨어지는지로 스스로 확인할 수 있다."
      }
    ],
    "keyPoints": [
      "자본거래에는 손익이 없다 — 모두 자본 항목",
      "신주발행비는 자본에서 차감(비용 아님)",
      "주식발행초과금과 주식할인발행차금은 우선 상계",
      "자기주식 처분손익은 자본잉여금ㆍ자본조정",
      "주식배당ㆍ무상증자: 자본 총액 불변, 자본금 증가",
      "주식분할: 자본 총액도 자본금도 불변, 주식 수만 증가"
    ],
    "pitfallCards": [
      {
        "wrong": "주식발행과 직접 관련된 원가는 당기비용으로 인식한다.",
        "correct": "자본에서 직접 차감한다. 주주와의 거래에서 생긴 지출이기 때문이다."
      },
      {
        "wrong": "주식분할을 하면 자본금이 증가한다.",
        "correct": "주식 수가 늘어나는 만큼 액면금액이 줄어 자본금은 그대로다."
      },
      {
        "wrong": "자기주식을 비싸게 팔면 처분이익이 당기순이익을 늘린다.",
        "correct": "자본잉여금으로 갈 뿐 당기순이익과 무관하다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q7",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2017-국가직-Q17",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2017-지방직-Q17",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2018-국가직-Q9",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2019-국가직-Q10",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2020-국가직-Q18",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2021-지방직-Q11",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2022-국가직-Q8",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2023-국가직-Q2",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2024-지방직-Q13",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2025-지방직-Q12",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 12
      }
    ]
  },
  {
    "slug": "acc-bonds-effective-interest",
    "chapterKo": "재무회계",
    "sectionKo": "제9장 부채",
    "category": "부채와 자본",
    "subcategory": "사채",
    "titleKo": "사채 — 유효이자율 상각표를 세 줄로 만들고 조기상환까지",
    "definition": "사채는 **유효이자율법**으로 상각해 만기에 액면금액에 이른다 — **이자비용은 기초 장부금액×유효이자율**, **현금이자는 액면×표시이자율**이다.",
    "intuition": "세 줄이면 끝난다 — 이자비용, 현금이자, 그리고 그 차이인 상각액이다.",
    "compareCard": {
      "left": {
        "title": "할인발행",
        "body": "발행가 < 액면. 이자비용 > 현금이자, 장부금액이 해마다 올라가고 상각액도 커진다."
      },
      "right": {
        "title": "할증발행",
        "body": "발행가 > 액면. 이자비용 < 현금이자, 장부금액이 해마다 내려가고 상각액은 커진다."
      }
    },
    "deepDive": [
      {
        "title": "기중 상환",
        "body": "기말이 아닌 날에 갚으면 그 날짜까지의 이자비용과 상각을 먼저 인식해 장부금액을 갱신한 뒤 상환금액과 비교한다. 이 단계를 건너뛰면 직전 기말 장부금액을 쓰게 되어 답이 어긋난다."
      },
      {
        "title": "발행자와 투자자",
        "body": "같은 사채를 발행자는 사채로, 투자자는 상각후원가 측정 금융자산으로 기록한다. 같은 유효이자율을 쓰므로 이자비용과 이자수익, 상각액이 서로 같다. 투자자의 처분손익도 상각을 반영한 장부금액을 기준으로 계산한다."
      },
      {
        "title": "만기 장부금액은 언제나 액면",
        "body": "할인이든 할증이든 마지막 상각이 끝나면 장부금액이 액면금액과 정확히 일치한다. 총발생액과 상각액 합계가 같다는 서술도 양쪽 모두에 해당한다."
      }
    ],
    "keyPoints": [
      "이자비용 = 기초 장부금액 × 유효이자율",
      "현금이자 = 액면금액 × 표시이자율",
      "상각액 = 이자비용 − 현금이자 (부호는 발행 형태에 따라)",
      "상각액은 할인ㆍ할증 모두 해마다 커진다",
      "만기 장부금액 = 액면금액",
      "상환손익 = 상환금액 − 상환일 장부금액 (＋이면 손실)"
    ],
    "pitfallCards": [
      {
        "wrong": "할인발행이면 사채할인발행차금 상각액이 해마다 줄어든다.",
        "correct": "장부금액이 커지면서 이자비용도 커지므로 상각액은 해마다 늘어난다."
      },
      {
        "wrong": "기중에 상환할 때는 직전 기말 장부금액과 상환금액을 비교한다.",
        "correct": "상환일까지 이자와 상각을 먼저 반영해 장부금액을 갱신한 뒤 비교한다."
      },
      {
        "wrong": "투자자가 사채를 처분할 때 처분손익은 최초 취득원가를 기준으로 계산한다.",
        "correct": "그동안의 상각을 반영한 장부금액이 기준이다. 이미 인식한 이자수익을 두 번 세게 된다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2018-국가직-Q13",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2019-국가직-Q9",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2020-지방직-Q10",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2021-국가직-Q4",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2021-지방직-Q20",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2022-국가직-Q3",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2023-지방직-Q3",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2023-국가직-Q4",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2024-국가직-Q4",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2024-지방직-Q19",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2025-국가직-Q11",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2025-지방직-Q11",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2026-지방직-Q5",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 5
      }
    ]
  },
  {
    "slug": "acc-depreciation-methods",
    "chapterKo": "재무회계",
    "sectionKo": "제6장 유형자산",
    "category": "자산",
    "subcategory": "감가상각",
    "titleKo": "감가상각 — 다섯 방법과 기중 취득 월할의 함정",
    "definition": "방법마다 **상각대상액을 어디서 잡는지**가 다르다 — 정액법과 연수합계법은 **취득원가에서 잔존가치를 뺀 금액**에, 정률법과 이중체감법은 **기초 장부금액**에 곱한다.",
    "intuition": "이 차이를 놓치면 첫해부터 답이 어긋난다.",
    "compareCard": {
      "left": {
        "title": "상각대상액 기준 — 정액ㆍ연수합계ㆍ생산량비례",
        "body": "(취득원가 − 잔존가치)에 비율을 곱한다. 잔존가치를 먼저 뺀다."
      },
      "right": {
        "title": "장부금액 기준 — 정률ㆍ이중체감",
        "body": "기초 장부금액에 상각률을 곱한다. 잔존가치는 마지막 해에 하한으로만 작용한다."
      }
    },
    "deepDive": [
      {
        "title": "연수합계법의 기중 취득",
        "body": "상각연도는 회계연도가 아니라 취득일로부터 세므로, 5월 취득이면 첫 상각연도가 이듬해 4월에 끝난다. 따라서 한 회계연도 안에 서로 다른 상각률 구간이 섞이고 각각 월할로 쪼개 더해야 한다."
      },
      {
        "title": "유휴자산과 감가상각",
        "body": "정액법을 쓰는 자산은 놀고 있어도 감가상각을 계속한다. 생산량비례법이라면 생산이 없을 때 상각액이 없을 수 있다는 점만 예외다."
      },
      {
        "title": "부분별 상각",
        "body": "유형자산을 구성하는 일부의 원가가 전체에 비해 유의적이면 그 부분을 따로 떼어 상각한다. 교체 주기가 다른 부품을 별도 자산처럼 다루는 것이다."
      }
    ],
    "keyPoints": [
      "정액법: (원가 − 잔존가치) ÷ 내용연수",
      "연수합계법: (원가 − 잔존가치) × 잔여연수 ÷ 연수합계",
      "정률ㆍ이중체감법: 기초 장부금액 × 상각률 (잔존가치를 빼지 않는다)",
      "기중 취득이면 상각연도와 회계연도가 어긋나 월할 배분이 필요",
      "유휴상태여도 정액법이면 상각을 계속한다",
      "유의적인 부분은 별도로 구분해 상각"
    ],
    "pitfallCards": [
      {
        "wrong": "이중체감법 첫해 상각비는 (취득원가 − 잔존가치)에 상각률을 곱해 구한다.",
        "correct": "잔존가치를 빼지 않은 취득원가에 상각률을 곱한다."
      },
      {
        "wrong": "연수합계법에서 2년차 회계연도에는 2년차 상각률만 적용한다.",
        "correct": "기중 취득이면 1년차와 2년차 상각률 구간이 한 회계연도에 섞인다. 월할로 나눠 더한다."
      },
      {
        "wrong": "기계장치가 유휴상태가 되면 감가상각을 멈춘다.",
        "correct": "정액법이라면 시간이 흐르므로 상각을 계속한다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-지방직-Q8",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2017-지방직-Q10",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2017-국가직-Q12",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2017-국가직-Q20",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2018-지방직-Q1",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2018-국가직-Q4",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2019-국가직-Q20",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2020-국가직-Q1",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2021-국가직-Q2",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2022-국가직-Q9",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2022-국가직-Q19",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2023-국가직-Q1",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2023-지방직-Q9",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2025-지방직-Q4",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2025-국가직-Q10",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2025-지방직-Q14",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2026-지방직-Q7",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2026-지방직-Q8",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 8
      }
    ]
  },
  {
    "slug": "acc-revenue-five-steps",
    "chapterKo": "재무회계",
    "sectionKo": "제11장 수익과 비용",
    "category": "수익ㆍ비용과 재무제표",
    "subcategory": "수익인식",
    "titleKo": "수익인식 5단계 — 계약 식별의 다섯 요건과 거래가격",
    "definition": "수익인식은 **계약 식별 → 수행의무 식별 → 거래가격 산정 → 배분 → 수익인식**의 5단계이며, **계약의 다섯 요건은 하나라도 빠지면 계약이 아니다**.",
    "intuition": "요건을 잇는 접속사를 「그리고」에서 「또는」으로 바꿔 놓는 것이 이 단원의 단골 함정이다.",
    "compareCard": {
      "left": {
        "title": "거래가격에 포함",
        "body": "변동대가(기댓값 또는 가능성이 가장 높은 금액), 유의적인 금융요소, 비현금대가, 고객에게 지급할 대가의 조정."
      },
      "right": {
        "title": "거래가격에서 제외",
        "body": "부가가치세처럼 제삼자를 대신하여 회수한 금액. 기업이 갖게 될 대가가 아니다."
      }
    },
    "deepDive": [
      {
        "title": "상업적 실질이라는 요건",
        "body": "계약의 결과로 기업의 미래현금흐름의 위험ㆍ시기ㆍ금액이 변동될 것으로 예상되어야 한다. 현금흐름이 전혀 달라지지 않는다면 실질 없는 맞교환이라 계약으로 보지 않는다. 이 문장을 부정형으로 뒤집어 놓은 선지가 반복된다."
      },
      {
        "title": "거래가격 산정의 전제",
        "body": "거래가격을 산정할 때는 재화나 용역을 현행 계약에 따라 약속대로 이전할 것이고 그 계약이 취소ㆍ갱신ㆍ변경되지 않을 것이라고 가정한다."
      },
      {
        "title": "장기할부판매",
        "body": "대금을 여러 해에 걸쳐 받으면 유의적인 금융요소가 있으므로 현재가치로 매출을 인식하고, 명목금액과의 차이는 기간에 걸쳐 이자수익으로 나눠 인식한다. 매년 같은 금액을 받으면 정상연금 현가계수를 쓴다."
      }
    ],
    "keyPoints": [
      "순서: 계약 식별 → 수행의무 식별 → 거래가격 산정 → 배분 → 수익인식",
      "계약 식별의 다섯 요건은 모두 충족해야 한다",
      "상업적 실질 = 미래현금흐름이 변동될 것으로 예상",
      "제삼자를 대신해 회수한 금액은 거래가격에서 제외",
      "수행의무는 “구별되는” 재화나 용역마다 하나씩",
      "장기할부는 현재가치로 매출, 차액은 이자수익"
    ],
    "pitfallCards": [
      {
        "wrong": "수익인식 5단계는 수행의무 식별에서 시작한다.",
        "correct": "계약 식별이 먼저다. 계약이 있어야 그 안의 수행의무를 가려낼 수 있다."
      },
      {
        "wrong": "거래가격에는 제삼자를 대신하여 회수한 금액도 포함한다.",
        "correct": "기업이 갖게 될 대가가 아니므로 제외한다."
      },
      {
        "wrong": "계약의 결과로 미래현금흐름이 변동되지 않을 것으로 예상되어야 계약으로 본다.",
        "correct": "반대다. 변동될 것으로 예상되어야(상업적 실질이 있어야) 계약으로 본다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q6",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2018-지방직-Q2",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2018-국가직-Q5",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2018-국가직-Q14",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2018-지방직-Q18",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2019-지방직-Q7",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2019-지방직-Q11",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2019-국가직-Q12",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2019-국가직-Q18",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2020-국가직-Q16",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2021-지방직-Q6",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2021-국가직-Q20",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2022-국가직-Q4",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2022-지방직-Q11",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2023-지방직-Q10",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2023-지방직-Q15",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2023-지방직-Q19",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2024-지방직-Q16",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2024-국가직-Q20",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2025-지방직-Q5",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2025-국가직-Q6",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2025-지방직-Q9",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2026-지방직-Q17",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2026-지방직-Q19",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2026-지방직-Q20",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 20
      }
    ]
  },
  {
    "slug": "acc-cost-flow",
    "chapterKo": "원가관리회계",
    "sectionKo": "제1장 원가의 흐름과 배부",
    "category": "원가회계",
    "subcategory": "원가의 흐름과 분류",
    "titleKo": "원가의 흐름 — 세 계정을 잇는 하나의 사슬",
    "definition": "원가는 **원재료 → 재공품 → 제품 → 매출원가**의 순서로 흐르고, **세 계정 모두 「기초＋투입−기말＝산출」**이라는 같은 모양이다.",
    "intuition": "문제에서 어느 칸이 비어 있든 이 사슬을 따라가면 채울 수 있다.",
    "compareCard": {
      "left": {
        "title": "기본원가와 가공원가",
        "body": "기본원가 = 직접재료 + 직접노무. 가공원가 = 직접노무 + 제조간접. 직접노무원가가 양쪽에 겹친다."
      },
      "right": {
        "title": "제품원가와 기간원가",
        "body": "제조원가는 재고를 거쳐 팔릴 때 비용이 되고, 판매비와관리비는 발생한 기간에 바로 비용이 된다."
      }
    },
    "deepDive": [
      {
        "title": "세 계정의 같은 구조",
        "body": "원재료: 기초＋매입－기말＝직접재료원가. 재공품: 기초＋당기총제조원가－기말＝당기제품제조원가. 제품: 기초＋당기제품제조원가－기말＝매출원가."
      },
      {
        "title": "원가 분류의 축",
        "body": "추적가능성으로 직접ㆍ간접, 조업도 반응으로 변동ㆍ고정, 의사결정 관련성으로 관련ㆍ비관련, 자산화 여부로 제품원가ㆍ기간원가를 나눈다. 같은 원가가 축에 따라 다른 이름을 갖는다."
      },
      {
        "title": "매몰원가와 기회원가",
        "body": "이미 지출해 되돌릴 수 없는 매몰원가는 의사결정에서 제외하고, 대안을 택함으로써 포기한 최선의 대안 가치인 기회원가는 장부에 없어도 의사결정에 포함한다."
      }
    ],
    "keyPoints": [
      "당기총제조원가 = 직접재료 + 직접노무 + 제조간접",
      "당기제품제조원가 = 기초재공품 + 당기총제조원가 − 기말재공품",
      "매출원가 = 기초제품 + 당기제품제조원가 − 기말제품",
      "기본원가와 가공원가는 직접노무원가를 함께 가진다",
      "매몰원가는 의사결정에서 제외, 기회원가는 포함"
    ],
    "pitfallCards": [
      {
        "wrong": "당기총제조원가와 당기제품제조원가는 같은 말이다.",
        "correct": "재공품 재고가 있으면 다르다. 당기총제조원가에 기초재공품을 더하고 기말재공품을 빼야 당기제품제조원가가 된다."
      },
      {
        "wrong": "기본원가와 가공원가를 더하면 당기총제조원가가 된다.",
        "correct": "직접노무원가가 두 번 세어진다. 당기총제조원가 = 기본원가 + 제조간접원가다."
      },
      {
        "wrong": "매몰원가는 금액이 크면 의사결정에 반영해야 한다.",
        "correct": "금액과 무관하게 이미 되돌릴 수 없으므로 대안 사이의 차이를 만들지 않는다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q13",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2017-지방직-Q15",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2017-국가직-Q18",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2019-국가직-Q11",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2019-국가직-Q14",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2019-지방직-Q18",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2019-지방직-Q19",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2020-국가직-Q7",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2020-지방직-Q11",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2020-지방직-Q14",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2021-지방직-Q9",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2021-국가직-Q12",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2022-국가직-Q6",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2022-지방직-Q12",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2022-지방직-Q19",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2023-국가직-Q6",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2023-국가직-Q12",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2023-지방직-Q20",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2024-지방직-Q12",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2024-지방직-Q15",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2025-국가직-Q13",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2025-지방직-Q17",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2025-지방직-Q18",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2025-국가직-Q20",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2025-지방직-Q20",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2026-국가직-Q6",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 6
      }
    ]
  },
  {
    "slug": "acc-ppe-acquisition",
    "chapterKo": "재무회계",
    "sectionKo": "제6장 유형자산",
    "category": "자산",
    "subcategory": "유형자산의 취득원가",
    "titleKo": "유형자산 취득원가 — 일괄취득ㆍ철거ㆍ교환ㆍ복구원가",
    "definition": "취득원가의 판단 기준은 **「이 자산을 쓸 수 있게 만드는 데 꼭 필요했는가」**다 — 취득세는 포함하고 새 시설 개설원가나 광고비는 포함하지 않는다.",
    "intuition": "토지만 쓰려고 건물째 사서 곧바로 헐었다면 지급액 전액과 철거비까지 토지의 원가다.",
    "compareCard": {
      "left": {
        "title": "건물을 계속 쓴다",
        "body": "공정가치 비율로 토지와 건물에 배분. 분모는 지급액이 아니라 공정가치 합계다."
      },
      "right": {
        "title": "토지만 쓰려고 곧바로 철거",
        "body": "지급액 전액이 토지 원가. 철거비도 더하고, 폐자재 매각액은 뺀다."
      }
    },
    "deepDive": [
      {
        "title": "복구원가의 자산화",
        "body": "사용 후 원상복구 의무가 충당부채에 해당하면 예상 복구비의 현재가치를 취득원가에 더한다. 이후 충당부채가 만기금액까지 불어나며 생기는 증가분은 이자비용이지 자산의 원가가 아니다."
      },
      {
        "title": "교환거래",
        "body": "상업적 실질이 있으면 제공한 자산의 공정가치로 측정하고 처분손익을 인식한다. 상업적 실질이 없거나 공정가치를 신뢰성 있게 측정할 수 없으면 제공한 자산의 장부금액으로 측정해 손익이 생기지 않는다."
      },
      {
        "title": "자본적 지출과 수익적 지출",
        "body": "내용연수를 늘리거나 성능을 뚜렷이 높이는 지출은 자산의 원가에 더하고, 원상을 유지하는 수선비는 발생한 기간의 비용이다."
      }
    ],
    "keyPoints": [
      "취득세 등 취득부대원가는 원가에 포함",
      "일괄취득 배분의 분모는 공정가치 합계",
      "토지 사용 목적이면 배분하지 않고 철거비까지 토지 원가",
      "복구충당부채의 현재가치를 취득원가에 가산",
      "교환은 상업적 실질이 있어야 공정가치로 측정",
      "내용연수를 늘린 지출은 자본적 지출"
    ],
    "pitfallCards": [
      {
        "wrong": "일괄취득액을 나눌 때 분모로 실제 지급액을 쓴다.",
        "correct": "개별 자산의 공정가치 합계를 분모로 쓴다. 싸게 샀다면 두 자산 모두 공정가치보다 낮게 기록된다."
      },
      {
        "wrong": "토지만 쓰려고 산 건물의 철거비는 당기비용이다.",
        "correct": "토지를 쓸 수 있게 만드는 원가이므로 토지의 취득원가에 더한다."
      },
      {
        "wrong": "복구충당부채의 이자비용도 자산의 취득원가에 더한다.",
        "correct": "취득 시점의 현재가치만 자산에 얹고, 이후의 증가분은 이자비용이다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-지방직-Q8",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2017-지방직-Q9",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2018-국가직-Q20",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2019-국가직-Q7",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2019-국가직-Q8",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2019-지방직-Q9",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2020-국가직-Q3",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2021-국가직-Q5",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2022-지방직-Q1",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2022-국가직-Q10",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2022-국가직-Q19",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2023-지방직-Q9",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2024-국가직-Q9",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2026-지방직-Q8",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 8
      }
    ]
  },
  {
    "slug": "acc-process-costing",
    "chapterKo": "원가관리회계",
    "sectionKo": "제2장 원가계산 방법",
    "category": "원가회계",
    "subcategory": "종합원가계산",
    "titleKo": "종합원가계산 — 완성품환산량 다섯 걸음과 두 방법의 차이",
    "definition": "종합원가계산은 **물량 흐름 → 완성품환산량 → 원가 집계 → 단위당 원가 → 배분**의 다섯 걸음을 밟는다.",
    "intuition": "재료원가와 가공원가를 따로 세는 것이 핵심이고, 기초재공품이 없으면 두 방법이 같아진다.",
    "compareCard": {
      "left": {
        "title": "평균법",
        "body": "기초재공품 원가와 당기원가를 섞는다. 환산량 = 완성품 수량 + 기말재공품 환산량. 기초재공품의 기왕 작업분을 따로 빼지 않는다."
      },
      "right": {
        "title": "선입선출법",
        "body": "기초재공품을 먼저 끝낸다고 본다. 환산량 = 기초재공품의 완성 소요분 + 당기착수완성 + 기말재공품 환산량. 단위당 원가에 당기원가만 쓴다."
      }
    },
    "deepDive": [
      {
        "title": "두 방법의 환산량 차이",
        "body": "선입선출법 환산량 = 평균법 환산량 − 기초재공품 환산량이다. 이 관계를 알면 한쪽을 구한 뒤 다른 쪽을 곧바로 얻을 수 있고, 두 방법의 단위당 원가 차이도 설명된다."
      },
      {
        "title": "재료 투입 시점",
        "body": "공정 초 전량 투입이면 기말재공품의 재료 환산량은 수량 그대로이고, 공정 전반에 걸쳐 균등 투입이면 완성도를 곱한다. 공정 말 투입이면 기말재공품의 재료 환산량은 0이다."
      },
      {
        "title": "공손",
        "body": "정상공손원가는 합격품에 배분하고 비정상공손은 당기비용으로 처리한다. 검사시점을 통과한 물량만 정상공손을 부담한다는 점이 배분의 기준이 된다."
      }
    ],
    "keyPoints": [
      "재료원가와 가공원가의 환산량을 따로 계산",
      "평균법 환산량 = 완성품 + 기말재공품 환산량",
      "선입선출법 환산량 = 평균법 환산량 − 기초재공품 환산량",
      "기초재공품이 없으면 두 방법의 결과가 같다",
      "재료 투입 시점에 따라 기말재공품의 재료 환산량이 달라진다",
      "정상공손은 합격품에 배분, 비정상공손은 당기비용"
    ],
    "pitfallCards": [
      {
        "wrong": "완성품환산량은 재료원가와 가공원가를 합쳐 한 번만 계산한다.",
        "correct": "투입 시점이 달라 완성도가 다르므로 반드시 따로 계산한다."
      },
      {
        "wrong": "선입선출법에서도 단위당 원가에 기초재공품 원가를 포함한다.",
        "correct": "선입선출법은 당기 발생원가만으로 단위당 원가를 구한다."
      },
      {
        "wrong": "공정 초에 재료를 전량 투입해도 기말재공품의 재료 환산량에 완성도를 곱한다.",
        "correct": "재료는 이미 다 들어갔으므로 환산량은 기말재공품 수량 그대로다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q13",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2017-지방직-Q13",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2017-국가직-Q18",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2018-지방직-Q5",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2018-국가직-Q7",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2019-국가직-Q14",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2019-지방직-Q19",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2020-지방직-Q14",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2020-지방직-Q17",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2021-지방직-Q9",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2021-국가직-Q17",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2022-국가직-Q17",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2022-지방직-Q19",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2023-국가직-Q6",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2023-지방직-Q6",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2023-지방직-Q20",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2024-지방직-Q9",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2024-지방직-Q12",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2024-국가직-Q14",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2025-국가직-Q14",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2025-지방직-Q17",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2025-지방직-Q19",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2026-지방직-Q11",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2026-국가직-Q20",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 20
      }
    ]
  },
  {
    "slug": "acc-cash-flow-statement",
    "chapterKo": "재무회계",
    "sectionKo": "제13장 현금흐름표",
    "category": "수익ㆍ비용과 재무제표",
    "subcategory": "현금흐름표",
    "titleKo": "현금흐름표 — 간접법 조정 3단과 활동 분류",
    "definition": "간접법 조정은 세 덩어리다 — **현금이 오가지 않은 손익**, **투자·재무활동에 속하는 손익**, **영업활동 자산·부채의 증감**이다.",
    "intuition": "자산은 반대로, 부채는 같은 방향으로 조정한다고 외우면 부호를 놓치지 않는다.",
    "compareCard": {
      "left": {
        "title": "더한다",
        "body": "감가상각비ㆍ손상차손ㆍ이자비용 상각액 등 비현금비용, 유형자산처분손실, 영업자산의 감소, 영업부채의 증가."
      },
      "right": {
        "title": "뺀다",
        "body": "유형자산처분이익ㆍ평가이익 등 비현금수익과 투자ㆍ재무활동 손익, 영업자산의 증가, 영업부채의 감소."
      }
    },
    "deepDive": [
      {
        "title": "현금이 오가지 않는 거래",
        "body": "주식배당ㆍ무상증자ㆍ전환사채의 주식 전환ㆍ현물출자, 그리고 미지급금으로 남긴 취득대금은 현금흐름표에 실리지 않고 주석에 비현금거래로 공시한다."
      },
      {
        "title": "이자와 배당의 분류",
        "body": "이자수취ㆍ이자지급ㆍ배당수취는 영업활동 또는 각각 투자ㆍ재무활동으로 분류할 수 있고, 배당지급은 재무활동 또는 영업활동으로 분류할 수 있다. 선택한 방법은 매기 일관되게 적용한다."
      },
      {
        "title": "재무활동 현금흐름 역산",
        "body": "자본 항목의 기초ㆍ기말 잔액이 주어지면 증자 유입은 발행가액으로, 배당 유출은 이익잉여금 계정에서 “기초＋당기순이익－기말”로 역산한다. 자본금이나 자본잉여금의 증가액을 그대로 현금흐름으로 쓰면 어긋난다."
      }
    ],
    "keyPoints": [
      "간접법: 당기순이익 → 비현금 손익 조정 → 투자ㆍ재무 손익 제거 → 영업자산ㆍ부채 증감",
      "영업자산 증가는 차감, 영업부채 증가는 가산",
      "유형자산처분손익은 영업에서 걷어내고 투자활동으로",
      "주식배당ㆍ무상증자는 현금흐름표에 실리지 않는다",
      "미지급금으로 남긴 취득대금은 비현금거래",
      "배당 유출은 이익잉여금 계정으로 역산"
    ],
    "pitfallCards": [
      {
        "wrong": "매출채권이 증가하면 간접법에서 더한다.",
        "correct": "외상이 늘어난 만큼 현금이 덜 들어왔으므로 차감한다."
      },
      {
        "wrong": "주식배당은 재무활동 현금유출로 표시한다.",
        "correct": "현금이 오가지 않으므로 현금흐름표에 실리지 않는다."
      },
      {
        "wrong": "유상증자의 현금유입은 자본금 증가액으로 계산한다.",
        "correct": "실제로 들어온 돈은 발행가액이다. 자본금은 액면금액만 반영한다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q8",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2017-지방직-Q19",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2018-지방직-Q2",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2018-국가직-Q5",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2018-국가직-Q14",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2018-지방직-Q14",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2018-지방직-Q18",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2018-지방직-Q20",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2019-국가직-Q12",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2019-지방직-Q12",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2019-지방직-Q14",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2020-지방직-Q18",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2021-지방직-Q4",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2021-지방직-Q6",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2022-지방직-Q6",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2022-지방직-Q11",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2023-국가직-Q10",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2023-지방직-Q10",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2023-지방직-Q15",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2023-국가직-Q18",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2023-지방직-Q19",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2024-지방직-Q4",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2024-국가직-Q13",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2024-국가직-Q20",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2025-국가직-Q8",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2025-지방직-Q9",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2026-지방직-Q17",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2026-지방직-Q20",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 20
      }
    ]
  },
  {
    "slug": "acc-revaluation-model",
    "chapterKo": "재무회계",
    "sectionKo": "제6장 유형자산",
    "category": "자산",
    "subcategory": "유형자산의 후속측정",
    "titleKo": "재평가모형 — 증감의 순서 규칙과 투자부동산과의 대비",
    "definition": "재평가모형의 규칙은 **「증가는 자본, 감소는 손익」**이되 **과거에 반대 방향으로 인식한 금액이 있으면 그것을 먼저 상계**한다는 순서 조건이 붙는다.",
    "intuition": "그래서 「전에 무슨 일이 있었나」를 묻는 것이 이 유형의 첫 질문이 된다.",
    "compareCard": {
      "left": {
        "title": "유형자산 재평가모형",
        "body": "증가는 기타포괄손익(재평가잉여금), 감소는 당기손익. 감가상각을 계속한다."
      },
      "right": {
        "title": "투자부동산 공정가치모형",
        "body": "증감 모두 당기손익. 감가상각을 하지 않는다. 잉여금을 쌓지 않는다."
      }
    },
    "deepDive": [
      {
        "title": "재평가잉여금의 처분",
        "body": "재평가잉여금은 자산을 제거할 때 이익잉여금으로 직접 대체할 수 있고, 사용하는 동안 재평가된 금액에 따른 상각액과 원가 기준 상각액의 차이만큼 나누어 대체할 수도 있다. 어느 쪽이든 당기손익을 거치지 않는다."
      },
      {
        "title": "재평가 빈도와 범위",
        "body": "공정가치의 변동이 심하면 매년, 그렇지 않으면 3~5년마다 재평가할 수 있다. 특정 자산을 재평가하면 그 자산이 속한 유형자산 분류 전체를 함께 재평가해야 한다."
      },
      {
        "title": "손상차손과의 관계",
        "body": "재평가모형을 적용하는 자산의 손상차손은 재평가감소액과 같은 방식으로 처리한다. 즉 잉여금이 있으면 먼저 헐고 남는 부분만 당기손실이다."
      }
    ],
    "keyPoints": [
      "증가는 기타포괄손익, 감소는 당기손익 — 단 과거 반대 인식분을 먼저 상계",
      "재평가는 자산 분류 전체에 대해 실시",
      "재평가잉여금은 당기손익을 거치지 않고 이익잉여금으로 대체 가능",
      "투자부동산 공정가치모형은 증감 모두 당기손익, 상각 없음",
      "원가모형은 감가상각하고 손상 여부만 검토"
    ],
    "pitfallCards": [
      {
        "wrong": "재평가로 장부금액이 감소하면 언제나 당기손실로 인식한다.",
        "correct": "쌓아 둔 재평가잉여금이 있으면 그것을 먼저 헐어 쓰고 모자란 부분만 당기손실이다."
      },
      {
        "wrong": "투자부동산 공정가치모형의 평가손익도 기타포괄손익이다.",
        "correct": "전액 당기손익이다. 유형자산 재평가모형과 헷갈리는 자리다."
      },
      {
        "wrong": "재평가모형을 적용하면 감가상각을 하지 않는다.",
        "correct": "상각하지 않는 것은 투자부동산 공정가치모형이다. 재평가모형은 재평가된 금액을 기준으로 계속 상각한다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q5",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2018-국가직-Q6",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2018-지방직-Q7",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2019-지방직-Q6",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2020-지방직-Q5",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2020-지방직-Q7",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2020-지방직-Q20",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2021-국가직-Q6",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2021-지방직-Q7",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2022-지방직-Q9",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2022-국가직-Q11",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2023-국가직-Q7",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2024-지방직-Q5",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2024-지방직-Q14",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2026-국가직-Q11",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 11
      }
    ]
  },
  {
    "slug": "acc-provisions",
    "chapterKo": "재무회계",
    "sectionKo": "제9장 부채",
    "category": "부채와 자본",
    "subcategory": "충당부채와 우발부채",
    "titleKo": "충당부채ㆍ우발부채ㆍ우발자산 — 세 칸으로 가르는 표",
    "definition": "충당부채는 **현재의무·자원 유출 가능성 높음·신뢰성 있는 추정** 셋을 다 갖춰야 인식하고, **하나라도 빠지면 우발부채로 주석**에 적는다.",
    "intuition": "자산 쪽은 비대칭이다 — 부채는 가능성이 높으면 인식하지만 자산은 거의 확실해야 인식한다.",
    "compareCard": {
      "left": {
        "title": "부채 쪽",
        "body": "가능성 높음＋측정 가능 → 충당부채 인식. 그 밖 → 우발부채 주석. 가능성 아주 낮음 → 공시 안 함."
      },
      "right": {
        "title": "자산 쪽",
        "body": "가능성 높음 → 우발자산 주석. 거의 확실 → 자산 인식. 가능성 높다는 이유만으로 인식하지 않는다."
      }
    },
    "deepDive": [
      {
        "title": "측정",
        "body": "최선의 추정치로 측정하되, 다수의 항목이면 기댓값을, 단일 항목이면 가능성이 가장 높은 금액을 쓴다. 화폐의 시간가치가 중요하면 현재가치로 측정한다."
      },
      {
        "title": "변제와 상계 금지",
        "body": "제삼자가 대신 갚을 것이 거의 확실하면 그 변제금액을 별도의 자산으로 인식하되, 충당부채와 상계하지 않는다. 다만 포괄손익계산서에서는 관련 비용과 변제금액을 상계해 표시할 수 있다."
      },
      {
        "title": "인식하지 않는 충당부채",
        "body": "미래의 예상 영업손실은 충당부채로 인식하지 않는다. 손실부담계약은 인식하고, 구조조정은 공식적이고 구체적인 계획을 발표해 정당한 기대를 갖게 했을 때만 인식한다."
      }
    ],
    "keyPoints": [
      "충당부채 3요건: 현재의무 + 유출 가능성 높음 + 신뢰성 있는 추정",
      "요건이 빠지면 우발부채 주석, 가능성 아주 낮으면 공시 안 함",
      "우발자산은 가능성이 높아도 인식하지 않고 주석에만",
      "다수 항목은 기댓값, 단일 항목은 가능성이 가장 높은 금액",
      "변제자산은 충당부채와 상계하지 않는다",
      "미래 예상 영업손실은 충당부채가 아니다"
    ],
    "pitfallCards": [
      {
        "wrong": "자원 유입 가능성이 높은 우발자산은 자산으로 인식한다.",
        "correct": "주석 공시에 그친다. 거의 확실할 때에야 자산으로 인식한다."
      },
      {
        "wrong": "제삼자의 변제가 확실하면 충당부채에서 차감해 순액으로 표시한다.",
        "correct": "재무상태표에서는 별도 자산으로 표시하고 상계하지 않는다."
      },
      {
        "wrong": "금액을 추정해야 하는 의무는 부채로 볼 수 없다.",
        "correct": "추정이 필요해도 세 요건을 채우면 충당부채로 인식한다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q11",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2018-국가직-Q8",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2020-지방직-Q19",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2022-지방직-Q3",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2022-국가직-Q12",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2023-국가직-Q8",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2025-국가직-Q3",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2026-국가직-Q15",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2026-지방직-Q16",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 16
      }
    ]
  },
  {
    "slug": "acc-cvp-analysis",
    "chapterKo": "원가관리회계",
    "sectionKo": "제3장 원가ㆍ조업도ㆍ이익 분석",
    "category": "관리회계",
    "subcategory": "원가ㆍ조업도ㆍ이익 분석",
    "titleKo": "CVP 분석 — 공비율 하나로 손익분기점부터 레버리지까지",
    "definition": "**공헌이익**은 매출액에서 변동원가를 뺀 금액이고, **손익분기점은 공헌이익이 고정원가와 같아지는 지점**이다.",
    "intuition": "공헌이익률만 구해 두면 나머지는 나눗셈이다 — 고정원가를 그것으로 나누면 손익분기 매출액이다.",
    "compareCard": {
      "left": {
        "title": "수량으로 풀 때",
        "body": "단위당 공헌이익 = 단위당 판매가 − 단위당 변동원가. 손익분기 수량 = 고정원가 ÷ 단위당 공헌이익."
      },
      "right": {
        "title": "금액으로 풀 때",
        "body": "공헌이익률 = 공헌이익 ÷ 매출액. 손익분기 매출액 = 고정원가 ÷ 공헌이익률."
      }
    },
    "deepDive": [
      {
        "title": "영업레버리지도",
        "body": "영업레버리지도 = 공헌이익 ÷ 영업이익 = 1 ÷ 안전한계율. 고정원가 비중이 클수록 커지고, 매출이 1% 변할 때 영업이익이 몇 % 변하는지를 나타낸다. 손익분기점 근처에서는 무한대에 가까워진다."
      },
      {
        "title": "법인세를 고려할 때",
        "body": "세후 목표이익이 주어지면 세전이익 = 세후이익 ÷ (1 − 세율)로 되돌린 뒤 (고정원가 + 세전이익) ÷ 공헌이익률로 매출액을 구한다."
      },
      {
        "title": "복수제품의 CVP",
        "body": "매출배합이 일정하다고 보고 가중평균 공헌이익률을 구해 단일제품처럼 푼다. 배합이 바뀌면 손익분기점도 달라진다."
      }
    ],
    "keyPoints": [
      "공헌이익 = 매출액 − 변동원가",
      "손익분기 매출액 = 고정원가 ÷ 공헌이익률",
      "목표이익 매출액 = (고정원가 + 목표이익) ÷ 공헌이익률",
      "안전한계 = 실제매출 − 손익분기매출",
      "영업레버리지도 = 공헌이익 ÷ 영업이익 = 1 ÷ 안전한계율",
      "세후 목표이익은 (1 − 세율)로 나눠 세전으로 되돌린다"
    ],
    "pitfallCards": [
      {
        "wrong": "손익분기점에서는 공헌이익이 0이다.",
        "correct": "공헌이익이 고정원가와 같아지는 지점이다. 0이 되는 것은 영업이익이다."
      },
      {
        "wrong": "고정원가가 클수록 영업레버리지도가 작아진다.",
        "correct": "고정원가 비중이 클수록 영업레버리지도는 커진다."
      },
      {
        "wrong": "세후 목표이익을 그대로 고정원가에 더해 매출액을 구한다.",
        "correct": "세전이익으로 환산한 뒤 더해야 한다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q10",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2017-지방직-Q14",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2017-지방직-Q16",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2018-지방직-Q4",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2018-국가직-Q10",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2018-지방직-Q13",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2018-국가직-Q15",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2018-지방직-Q17",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2019-지방직-Q17",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2019-지방직-Q20",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2020-국가직-Q8",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2020-지방직-Q16",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2021-지방직-Q10",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2021-국가직-Q18",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2022-지방직-Q5",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2022-지방직-Q7",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2023-지방직-Q8",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2023-지방직-Q12",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2023-국가직-Q13",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2024-지방직-Q7",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2024-국가직-Q15",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2024-국가직-Q17",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2024-지방직-Q18",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2026-국가직-Q7",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 7
      }
    ]
  },
  {
    "slug": "acc-overhead-allocation",
    "chapterKo": "원가관리회계",
    "sectionKo": "제1장 원가의 흐름과 배부",
    "category": "원가회계",
    "subcategory": "제조간접원가의 배부",
    "titleKo": "제조간접원가 배부 — 예정배부율과 배부차이 조정",
    "definition": "**예정배부율은 예산 제조간접원가를 예정 조업도로 나눈 값**이고 실제 조업도를 곱해 배부한다 — 실제 발생액과의 차이가 **배부차이**다.",
    "intuition": "배부액이 실제보다 적으면 과소배부라 원가를 더 얹고, 많으면 과대배부라 덜어낸다.",
    "compareCard": {
      "left": {
        "title": "과소배부",
        "body": "실제 발생 > 배부액. 원가를 덜 얹었으므로 매출원가를 늘린다(이익 감소)."
      },
      "right": {
        "title": "과대배부",
        "body": "실제 발생 < 배부액. 원가를 더 얹었으므로 매출원가를 줄인다(이익 증가)."
      }
    },
    "deepDive": [
      {
        "title": "왜 예정배부를 쓰나",
        "body": "실제 제조간접원가는 기말에야 확정되고 조업도에 따라 단위당 원가가 널뛴다. 예정배부율을 쓰면 기중에도 제품원가를 산출할 수 있고 계절적 변동의 영향을 줄일 수 있다."
      },
      {
        "title": "부문별 배부",
        "body": "보조부문 원가를 제조부문에 배분할 때 직접배분법은 보조부문 사이의 용역수수를 무시하고, 단계배분법은 한쪽 방향만 인정하며, 상호배분법은 양방향을 모두 반영한다. 어느 방법을 쓰든 배분할 총원가는 같다."
      },
      {
        "title": "활동기준원가계산",
        "body": "단일 배부기준의 왜곡을 줄이려고 활동별로 원가동인을 달리 잡는 방법이다. 소량ㆍ다품종 제품의 원가가 전통적 방법에서 과소평가되던 것을 바로잡는다."
      }
    ],
    "keyPoints": [
      "예정배부율 = 예산 제조간접원가 ÷ 예정 조업도",
      "예정배부액 = 예정배부율 × 실제 조업도",
      "배부차이 = 실제 발생액 − 예정배부액",
      "과소배부는 매출원가 가산, 과대배부는 매출원가 차감",
      "중요하면 재공품ㆍ제품ㆍ매출원가 비율로 안분",
      "보조부문 배분법이 달라도 배분할 총원가는 같다"
    ],
    "pitfallCards": [
      {
        "wrong": "예정배부액은 예정배부율에 예정 조업도를 곱해 구한다.",
        "correct": "실제 조업도를 곱한다. 예정 조업도는 배부율을 만들 때만 쓴다."
      },
      {
        "wrong": "과소배부액은 매출원가에서 차감한다.",
        "correct": "원가를 덜 얹었으므로 매출원가에 더한다."
      },
      {
        "wrong": "상호배분법을 쓰면 직접배분법보다 배분할 총원가가 커진다.",
        "correct": "배분 방법은 나누는 방식만 바꿀 뿐 총원가는 같다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q13",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2017-국가직-Q18",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2019-국가직-Q14",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2019-지방직-Q19",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2020-국가직-Q9",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2020-지방직-Q14",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2021-지방직-Q9",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 9
      },
      {
        "examId": "회계학-2021-국가직-Q13",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2022-국가직-Q14",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2022-지방직-Q19",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2023-국가직-Q6",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2023-지방직-Q20",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2024-지방직-Q12",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2025-국가직-Q13",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2025-지방직-Q17",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2025-국가직-Q19",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2026-지방직-Q10",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2026-국가직-Q19",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 19
      }
    ]
  },
  {
    "slug": "acc-qualitative-characteristics",
    "chapterKo": "재무회계",
    "sectionKo": "제1장 재무보고를 위한 개념체계",
    "category": "재무회계 기초",
    "subcategory": "재무정보의 질적특성",
    "titleKo": "질적특성 — 근본 둘과 보강 넷, 그리고 자주 뒤집히는 문장",
    "definition": "**근본적 질적특성은 「있어야 하는 것」**이고 **보강적 질적특성은 「있으면 더 좋은 것」**이다 — 보강적 특성은 근본적 특성을 대신할 수 없다.",
    "intuition": "보강적 특성끼리는 맞바꿔야 할 때가 있다 — 적시성을 높이면 검증가능성이 떨어진다.",
    "compareCard": {
      "left": {
        "title": "근본적 질적특성",
        "body": "목적적합성(예측가치ㆍ확인가치ㆍ중요성) + 표현충실성(완전ㆍ중립ㆍ무오류). 둘 다 있어야 유용하다."
      },
      "right": {
        "title": "보강적 질적특성",
        "body": "비교가능성ㆍ검증가능성ㆍ적시성ㆍ이해가능성. 근본적 특성을 대체할 수 없고 서로 상충할 수 있다."
      }
    },
    "deepDive": [
      {
        "title": "비교가능성과 일관성ㆍ통일성",
        "body": "비교가능성은 목표, 일관성은 그 목표에 이르는 수단이다. 둘은 관련되어 있으나 같지 않다. 통일성은 서로 다른 것까지 같아 보이게 만들어 오히려 비교가능성을 해친다."
      },
      {
        "title": "중립성과 신중성",
        "body": "중립적 서술은 편의가 없는 것이고, 신중성은 불확실한 상황에서 판단할 때 주의를 기울이는 것이다. 신중성이 자산을 일부러 낮게, 부채를 높게 잡는 보수주의를 뜻하지는 않는다."
      },
      {
        "title": "무오류의 뜻",
        "body": "무오류는 모든 면에서 정확하다는 뜻이 아니라, 현상의 기술에 오류나 누락이 없고 추정 절차를 적절히 선택해 적용했다는 뜻이다."
      }
    ],
    "keyPoints": [
      "근본적: 목적적합성 + 표현충실성",
      "보강적: 비교가능성ㆍ검증가능성ㆍ적시성ㆍ이해가능성",
      "일관성은 비교가능성의 수단이지 같은 개념이 아니다",
      "통일성은 비교가능성을 해칠 수 있다",
      "신중성 ≠ 보수주의 — 중립성을 훼손하지 않는다",
      "무오류는 완전한 정확성을 뜻하지 않는다"
    ],
    "pitfallCards": [
      {
        "wrong": "비교가능성은 일관성과 동일한 개념이다.",
        "correct": "비교가능성은 목표이고 일관성은 수단이다. 개념체계도 둘이 같지 않다고 명시한다."
      },
      {
        "wrong": "보강적 질적특성이 충분하면 근본적 질적특성이 부족해도 유용한 정보가 된다.",
        "correct": "보강적 특성은 근본적 특성을 대체할 수 없다."
      },
      {
        "wrong": "신중성은 자산을 낮게, 부채를 높게 인식하는 것을 의미한다.",
        "correct": "그것은 보수주의다. 신중성은 중립성을 훼손하지 않는 범위의 주의 깊은 판단이다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q1",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2017-지방직-Q1",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2017-지방직-Q6",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2018-국가직-Q2",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2018-지방직-Q12",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2019-국가직-Q1",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2019-지방직-Q1",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2019-지방직-Q2",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2020-지방직-Q2",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2021-국가직-Q1",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2021-지방직-Q1",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2021-지방직-Q2",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2022-지방직-Q15",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2022-국가직-Q18",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2022-지방직-Q20",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2023-국가직-Q11",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2024-지방직-Q2",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2025-지방직-Q6",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2025-지방직-Q7",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 7
      },
      {
        "examId": "회계학-2026-국가직-Q1",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 1
      },
      {
        "examId": "회계학-2026-지방직-Q1",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 1
      }
    ]
  },
  {
    "slug": "acc-financial-assets",
    "chapterKo": "재무회계",
    "sectionKo": "제8장 금융자산",
    "category": "자산",
    "subcategory": "금융자산",
    "titleKo": "금융자산 3분류 — 거래원가와 손익 자리가 함께 갈린다",
    "definition": "금융자산의 분류는 **사업모형**(수취인가, 수취와 매도인가)과 **계약상 현금흐름의 특성**(원리금만으로 이루어지는가) 두 잣대가 함께 정한다.",
    "intuition": "분류가 정해지면 거래원가와 평가손익·처분손익의 자리가 한꺼번에 정해진다.",
    "compareCard": {
      "left": {
        "title": "지분상품 FVOCI 선택",
        "body": "최초 인식시점에만 선택할 수 있고 취소할 수 없다. 평가손익도 처분손익도 당기손익으로 재순환하지 않는다."
      },
      "right": {
        "title": "채무상품 FVOCI",
        "body": "평가손익은 기타포괄손익에 쌓아 두었다가 처분할 때 당기손익으로 재순환한다."
      }
    },
    "deepDive": [
      {
        "title": "거래원가의 자리",
        "body": "당기손익－공정가치 측정 금융자산의 거래원가는 즉시 당기비용이다. 상각후원가와 기타포괄손익－공정가치는 취득원가에 더한다. “취득금액이 얼마인가”를 묻는 선지가 이 차이를 노린다."
      },
      {
        "title": "지분상품 처분손익이 0이 되는 이유",
        "body": "처분 직전에 공정가치로 다시 평가하면 장부금액이 처분가액과 같아진다. 그 상태에서 팔았으니 처분손익이 생기지 않는다. 평가 단계의 손익은 이미 기타포괄손익에 담겼다."
      },
      {
        "title": "재분류",
        "body": "사업모형을 바꾸었을 때만 재분류하며, 재분류일부터 전진적으로 적용한다. 지분상품에 대한 기타포괄손익 표시 선택은 재분류 대상이 아니다."
      }
    ],
    "keyPoints": [
      "수취만 + 원리금만 → 상각후원가",
      "수취와 매도 + 원리금만 → 기타포괄손익－공정가치",
      "그 밖은 당기손익－공정가치",
      "FVPL만 거래원가를 즉시 비용 처리",
      "지분상품 FVOCI 선택은 최초 인식시점에만, 취소 불가",
      "지분상품 FVOCI는 처분손익도 재순환하지 않는다"
    ],
    "pitfallCards": [
      {
        "wrong": "기타포괄손익－공정가치 측정 지분상품의 취득원가에는 매매수수료를 포함하지 않는다.",
        "correct": "거래원가를 취득원가에 더한다. 즉시 비용으로 터는 것은 당기손익－공정가치 쪽이다."
      },
      {
        "wrong": "지분상품을 기타포괄손익으로 표시하기로 한 선택은 나중에 취소할 수 있다.",
        "correct": "최초 인식시점에만 선택할 수 있고 이후 취소하지 못한다."
      },
      {
        "wrong": "FVOCI 지분상품을 처분하면 그동안의 기타포괄손익이 당기손익으로 재순환된다.",
        "correct": "지분상품은 재순환하지 않는다. 채무상품과 갈리는 지점이다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2018-지방직-Q15",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2018-지방직-Q19",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2019-지방직-Q10",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2020-지방직-Q6",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2021-지방직-Q12",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2022-국가직-Q2",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2022-지방직-Q17",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2023-지방직-Q4",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2024-지방직-Q3",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2025-지방직-Q2",
        "year": 2025,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2026-국가직-Q14",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2026-국가직-Q16",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2026-지방직-Q18",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 18
      }
    ]
  },
  {
    "slug": "acc-receivable-impairment",
    "chapterKo": "재무회계",
    "sectionKo": "제4장 현금과 매출채권",
    "category": "자산",
    "subcategory": "현금과 매출채권",
    "titleKo": "현금및현금성자산과 매출채권 손상 — 두 개의 판별표",
    "definition": "**현금및현금성자산**은 통화와 통화대용증권, 요구불예금, 그리고 **취득 당시 만기가 3개월 이내인 금융상품**을 말한다.",
    "intuition": "현금 문제는 더하기가 아니라 분류 문제다 — 우표와 수입인지는 현금이 아니다.",
    "compareCard": {
      "left": {
        "title": "현금및현금성자산에 포함",
        "body": "지폐ㆍ주화, 타인발행 수표, 자기앞수표, 우편환증서, 요구불예금, 취득 당시 만기 3개월 이내 금융상품."
      },
      "right": {
        "title": "제외",
        "body": "우표ㆍ수입인지(소모품), 당좌차월(부채), 당좌개설보증금ㆍ사용제한 예금(장기금융상품), 취득 당시 만기 3개월 초과 상품."
      }
    },
    "deepDive": [
      {
        "title": "“취득 당시”라는 기준",
        "body": "만기 3개월은 결산일이 아니라 취득 시점부터 센다. 3년 만기 채권을 만기 2개월 남기고 샀다면 현금성자산이지만, 원래 1년 만기로 산 예금이 결산일에 2개월 남았다면 아니다."
      },
      {
        "title": "손상차손 산정",
        "body": "연령분석표가 주어지면 구간별 채권금액에 기대신용손실률을 곱해 모두 더한 것이 기말 목표 충당금 잔액이다. 여기서 기존 대변잔액을 빼면 올해 인식할 손상차손이다. 중간에 대손이 확정됐다면 그만큼 충당금이 먼저 줄어든 상태에서 계산한다."
      },
      {
        "title": "은행계정조정",
        "body": "은행측은 미기입예금과 기발행미인출수표를, 회사측은 부도수표ㆍ은행수수료ㆍ미통지입금을 조정한다. 조정 후 두 잔액이 같아지는 것이 정확한 현금 잔액이다."
      }
    ],
    "keyPoints": [
      "만기 3개월은 “취득 당시”부터 센다",
      "우표ㆍ수입인지는 현금이 아니다",
      "당좌차월은 자산이 아니라 단기차입금",
      "손상차손 = 목표 충당금 잔액 − 기존 대변잔액",
      "대손 확정은 충당금을 먼저 줄인 뒤 목표까지 채운다",
      "사용이 제한된 예금은 현금성자산이 아니다"
    ],
    "pitfallCards": [
      {
        "wrong": "연령분석으로 구한 기대신용손실 합계가 그해 손상차손이다.",
        "correct": "그것은 기말 목표 잔액이다. 기존 충당금 잔액을 빼야 올해의 비용이 나온다."
      },
      {
        "wrong": "결산일 기준으로 만기가 3개월 이내면 현금성자산이다.",
        "correct": "취득 당시를 기준으로 판단한다."
      },
      {
        "wrong": "당좌개설보증금은 예금이므로 현금및현금성자산에 넣는다.",
        "correct": "인출이 제한되어 있어 장기금융상품으로 분류한다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-지방직-Q18",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2018-지방직-Q16",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2020-국가직-Q12",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2021-국가직-Q3",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2021-지방직-Q8",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2021-지방직-Q17",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2023-지방직-Q11",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 11
      },
      {
        "examId": "회계학-2023-지방직-Q14",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2024-국가직-Q11",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 11
      }
    ]
  },
  {
    "slug": "acc-variable-vs-absorption",
    "chapterKo": "원가관리회계",
    "sectionKo": "제4장 표준원가와 변동원가계산",
    "category": "관리회계",
    "subcategory": "변동원가계산과 전부원가계산",
    "titleKo": "변동원가계산과 전부원가계산 — 이익 차이는 고정제조간접원가에서만",
    "definition": "두 방법의 **이익 차이는 오직 재고에 실려 이연된 고정제조간접원가**에서 나온다 — 그것만이 제품원가와 기간원가로 갈리는 항목이다.",
    "intuition": "생산량이 판매량보다 많으면 전부원가계산의 이익이 크고, 같으면 두 이익이 같다.",
    "compareCard": {
      "left": {
        "title": "전부원가계산",
        "body": "고정제조간접원가를 제품원가에. 이익이 생산량의 영향을 받는다. 외부보고용으로 인정된다."
      },
      "right": {
        "title": "변동원가계산",
        "body": "고정제조간접원가를 기간원가로. 이익이 판매량에만 반응한다. 내부 의사결정에 유용하다."
      }
    },
    "deepDive": [
      {
        "title": "이익 차이 공식",
        "body": "전부원가계산 영업이익 − 변동원가계산 영업이익 = 기말재고에 포함된 고정제조간접원가 − 기초재고에 포함된 고정제조간접원가. 단위당 고정제조간접원가가 해마다 같다면 (기말재고수량 − 기초재고수량) × 단위당 고정제조간접원가로 계산할 수 있다."
      },
      {
        "title": "왜 외부보고에는 전부원가계산인가",
        "body": "기준서는 정상조업도에 기초해 고정제조간접원가를 제품에 배부하도록 요구한다. 재고자산의 원가에 생산과 관련된 모든 원가를 포함시키기 위해서다."
      },
      {
        "title": "초변동원가계산",
        "body": "직접재료원가만 제품원가로 보고 직접노무원가와 제조간접원가를 모두 기간원가로 처리한다. 재고를 늘려 이익을 부풀리는 유인을 가장 강하게 억제한다."
      }
    ],
    "keyPoints": [
      "차이의 원인은 고정제조간접원가 하나뿐",
      "생산량 > 판매량 → 전부원가계산 이익이 더 크다",
      "생산량 = 판매량 → 두 이익이 같다",
      "차이 = 기말재고 포함 고정제조간접원가 − 기초재고 포함 고정제조간접원가",
      "외부보고는 전부원가계산, 내부 의사결정은 변동원가계산",
      "초변동원가계산은 직접재료원가만 제품원가"
    ],
    "pitfallCards": [
      {
        "wrong": "두 방법의 이익 차이는 변동제조간접원가에서도 생긴다.",
        "correct": "변동원가는 양쪽 모두 제품원가이므로 차이를 만들지 않는다."
      },
      {
        "wrong": "변동원가계산에서는 생산량을 늘리면 이익이 늘어난다.",
        "correct": "고정원가를 전액 기간비용으로 처리하므로 이익은 판매량에만 반응한다."
      },
      {
        "wrong": "변동원가계산은 외부보고 목적으로도 인정된다.",
        "correct": "외부보고용 재무제표는 전부원가계산으로 작성한다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-지방직-Q14",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2018-지방직-Q4",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2018-국가직-Q10",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2018-국가직-Q12",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2018-지방직-Q13",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2019-국가직-Q4",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2019-국가직-Q15",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2019-지방직-Q20",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2020-국가직-Q6",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 6
      },
      {
        "examId": "회계학-2020-지방직-Q15",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 15
      },
      {
        "examId": "회계학-2021-지방직-Q13",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2021-국가직-Q18",
        "year": 2021,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2021-지방직-Q18",
        "year": 2021,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2022-지방직-Q5",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2023-지방직-Q12",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 12
      },
      {
        "examId": "회계학-2023-지방직-Q16",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2024-국가직-Q16",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2024-국가직-Q17",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2024-지방직-Q18",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2026-지방직-Q12",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 12
      }
    ]
  },
  {
    "slug": "acc-joint-cost",
    "chapterKo": "원가관리회계",
    "sectionKo": "제2장 원가계산 방법",
    "category": "원가회계",
    "subcategory": "결합원가계산",
    "titleKo": "결합원가 배분 — 네 방법과 추가가공 의사결정",
    "definition": "결합원가 배분 방법은 **「무엇에 비례해 나눌 것인가」**만 다르다 — 물량, 분리점 판매가치, 순실현가치, 균등이익률이 그 잣대다.",
    "intuition": "추가가공해야 팔 수 있으면 최종판매가치에서 추가가공원가를 뺀 순실현가치로 나눈다.",
    "compareCard": {
      "left": {
        "title": "순실현가치법",
        "body": "순실현가치 = 최종판매가치 − 추가가공원가 − 판매비. 이 비율로 결합원가를 나눈다."
      },
      "right": {
        "title": "균등이익률법",
        "body": "전체 매출총이익률을 먼저 구한 뒤 각 제품이 그 이익률을 갖도록 원가를 역산해 배분한다."
      }
    },
    "deepDive": [
      {
        "title": "추가가공 의사결정",
        "body": "결합원가는 이미 발생한 매몰원가라 추가가공 여부에 영향을 주지 않는다. 증분수익(추가가공 후 판매가치 − 분리점 판매가치)이 추가가공원가보다 크면 가공한다. 배분된 결합원가를 계산에 넣으면 잘못된 결론이 나온다."
      },
      {
        "title": "부산물의 처리",
        "body": "부산물은 순실현가치만큼을 결합원가에서 차감하고 나머지를 주산품에 배분하는 방법이 일반적이다. 부산물에 결합원가를 배분하지 않는 것이 원칙이다."
      },
      {
        "title": "방법 선택의 영향",
        "body": "어느 방법을 쓰든 배분할 결합원가 총액과 회사 전체의 이익은 같다. 달라지는 것은 제품별 원가와 제품별 이익뿐이다."
      }
    ],
    "keyPoints": [
      "분리점 판매가치법: 분리점에서 팔 수 있을 때",
      "순실현가치법: 최종판매가치 − 추가가공원가",
      "균등이익률법: 모든 제품의 매출총이익률을 같게",
      "추가가공 의사결정에 결합원가는 넣지 않는다 (매몰원가)",
      "증분수익 > 추가가공원가면 가공한다",
      "방법이 달라도 회사 전체 이익은 같다"
    ],
    "pitfallCards": [
      {
        "wrong": "추가가공 여부를 판단할 때 배분받은 결합원가를 원가에 포함한다.",
        "correct": "결합원가는 이미 발생한 매몰원가라 어느 쪽을 택하든 같다. 증분수익과 추가가공원가만 비교한다."
      },
      {
        "wrong": "배분 방법을 바꾸면 회사 전체 이익이 달라진다.",
        "correct": "제품별 이익만 달라지고 전체 이익은 같다."
      },
      {
        "wrong": "부산물에도 결합원가를 주산품과 같은 방식으로 배분한다.",
        "correct": "부산물은 순실현가치만큼 결합원가에서 차감하고 배분하지 않는 것이 원칙이다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q14",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2019-국가직-Q17",
        "year": 2019,
        "sourceCode": "국가직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2022-지방직-Q14",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 14
      },
      {
        "examId": "회계학-2022-국가직-Q20",
        "year": 2022,
        "sourceCode": "국가직",
        "questionNo": 20
      },
      {
        "examId": "회계학-2026-지방직-Q13",
        "year": 2026,
        "sourceCode": "지방직",
        "questionNo": 13
      }
    ]
  },
  {
    "slug": "acc-retained-earnings-dividend",
    "chapterKo": "재무회계",
    "sectionKo": "제10장 자본",
    "category": "부채와 자본",
    "subcategory": "이익잉여금과 배당",
    "titleKo": "배당 — 우선주 유형에 따른 배분 순서",
    "definition": "**배당은 이익잉여금의 처분이며 비용이 아니다**. 우선주의 **누적적·비누적적**과 **참가적·비참가적** 조합이 배당 총액을 나누는 순서를 정한다.",
    "intuition": "그래서 문제를 만나면 우선주가 어느 조합인지부터 확인해야 순서가 잡힌다.",
    "compareCard": {
      "left": {
        "title": "누적적 / 비누적적",
        "body": "누적적은 못 받은 해의 배당이 쌓여 나중에 먼저 받는다. 비누적적은 그해가 지나면 사라진다."
      },
      "right": {
        "title": "참가적 / 비참가적",
        "body": "완전참가적은 잔여분을 보통주와 자본금 비율로 나눈다. 비참가적은 약정 배당률까지만 받는다."
      }
    },
    "deepDive": [
      {
        "title": "연체배당을 몇 년치로 세나",
        "body": "배당기준일이 속한 해의 몫은 “당기분”으로 따로 세고, 그 이전에 받지 못한 해만 연체분이다. 설립 이후 한 번도 배당하지 않았다면 설립연도부터 기준일 직전 해까지가 연체분이다."
      },
      {
        "title": "배당 관련 날짜",
        "body": "배당기준일에는 분개가 없고, 배당결의일에 (차)이익잉여금 (대)미지급배당금으로 부채가 생기며, 배당지급일에 현금이 나간다. 미지급배당금은 유동부채다."
      },
      {
        "title": "이익준비금",
        "body": "상법상 현금배당액의 10분의 1 이상을 자본금의 2분의 1에 이를 때까지 이익준비금으로 적립해야 한다. 주식배당에는 적립 의무가 없다."
      }
    ],
    "keyPoints": [
      "배당은 비용이 아니라 이익잉여금의 처분",
      "순서: 연체 → 당기 → 보통주 기본 → 참가",
      "참가분은 자본금 비율로 나눈다",
      "연체분은 배당기준일이 속한 해를 빼고 센다",
      "배당결의일에 미지급배당금(부채)이 생긴다",
      "주식배당에는 이익준비금 적립 의무가 없다"
    ],
    "pitfallCards": [
      {
        "wrong": "배당금은 비용이므로 당기순이익을 줄인다.",
        "correct": "이미 번 이익을 나눠 주는 것이라 이익잉여금만 줄인다."
      },
      {
        "wrong": "누적적 우선주의 연체배당에는 배당기준일이 속한 해의 몫도 포함된다.",
        "correct": "그 해의 몫은 당기분으로 따로 센다."
      },
      {
        "wrong": "비참가적 우선주도 잔여 배당에 참가한다.",
        "correct": "약정 배당률까지만 받고 잔여분은 보통주와 참가적 우선주가 나눈다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2018-국가직-Q18",
        "year": 2018,
        "sourceCode": "국가직",
        "questionNo": 18
      },
      {
        "examId": "회계학-2019-지방직-Q8",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2022-지방직-Q13",
        "year": 2022,
        "sourceCode": "지방직",
        "questionNo": 13
      },
      {
        "examId": "회계학-2026-국가직-Q3",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2026-국가직-Q5",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 5
      }
    ]
  },
  {
    "slug": "acc-error-correction",
    "chapterKo": "재무회계",
    "sectionKo": "제12장 회계변경과 오류수정",
    "category": "재무회계 기초",
    "subcategory": "회계변경과 오류수정",
    "titleKo": "회계변경과 오류수정 — 소급이냐 전진이냐",
    "definition": "**회계정책의 변경과 전기오류의 수정은 소급적용**하고 **회계추정의 변경은 전진적용**한다 — 구분이 어려우면 회계추정의 변경으로 본다.",
    "intuition": "「규칙을 바꿨나, 예측을 바꿨나, 틀렸던 것을 고치나」로 나누면 갈린다.",
    "compareCard": {
      "left": {
        "title": "소급적용",
        "body": "회계정책 변경, 전기오류 수정. 비교표시 재무제표를 다시 작성하고 기초 이익잉여금을 조정한다."
      },
      "right": {
        "title": "전진적용",
        "body": "회계추정 변경(내용연수ㆍ잔존가치ㆍ대손추정률ㆍ감가상각방법). 과거는 손대지 않고 당기부터 반영한다."
      }
    },
    "deepDive": [
      {
        "title": "오류가 이익에 미치는 방향",
        "body": "비용을 과대계상했으면 되돌릴 때 이익이 늘고, 과소계상했으면 이익이 준다. 수익은 반대다. 기말재고 과대계상은 매출원가 과소를 거쳐 이익 과대로 이어지므로 수정할 때 차감한다."
      },
      {
        "title": "자동조정오류",
        "body": "재고자산이나 미지급비용의 오류는 다음 해에 반대 방향으로 상쇄되어 두 해의 이익 합계는 맞아떨어진다. 그래서 두 해를 함께 물으면 상쇄 효과까지 따져야 한다."
      },
      {
        "title": "비한정에서 유한으로",
        "body": "무형자산의 내용연수 판단이 비한정에서 유한으로 바뀌면 회계추정의 변경이므로 그때부터 남은 기간에 걸쳐 상각을 시작한다. 과거를 소급하지 않는다."
      }
    ],
    "keyPoints": [
      "정책 변경ㆍ오류 수정 → 소급적용",
      "추정 변경 → 전진적용",
      "감가상각방법의 변경은 추정의 변경",
      "구분이 어려우면 추정의 변경으로 본다",
      "비용 과대계상 수정 → 이익 증가",
      "기말재고 과대계상 수정 → 이익 감소"
    ],
    "pitfallCards": [
      {
        "wrong": "감가상각방법을 정액법에서 정률법으로 바꾸면 소급적용한다.",
        "correct": "회계추정의 변경으로 보아 전진적용한다."
      },
      {
        "wrong": "전기오류를 발견하면 당기손익으로 조정한다.",
        "correct": "소급적용해 비교표시 재무제표를 다시 작성하고 기초 이익잉여금을 조정한다."
      },
      {
        "wrong": "기말재고 과대계상 오류를 수정하면 당기순이익이 늘어난다.",
        "correct": "매출원가가 과소했던 것이므로 수정하면 이익이 줄어든다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-국가직-Q2",
        "year": 2017,
        "sourceCode": "국가직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2019-지방직-Q5",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2019-지방직-Q16",
        "year": 2019,
        "sourceCode": "지방직",
        "questionNo": 16
      },
      {
        "examId": "회계학-2020-지방직-Q3",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 3
      },
      {
        "examId": "회계학-2023-지방직-Q17",
        "year": 2023,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2023-국가직-Q19",
        "year": 2023,
        "sourceCode": "국가직",
        "questionNo": 19
      },
      {
        "examId": "회계학-2026-국가직-Q12",
        "year": 2026,
        "sourceCode": "국가직",
        "questionNo": 12
      }
    ]
  },
  {
    "slug": "acc-intangible-assets",
    "chapterKo": "재무회계",
    "sectionKo": "제7장 무형자산과 투자부동산",
    "category": "자산",
    "subcategory": "무형자산",
    "titleKo": "무형자산 — 인식할 수 없는 것부터 외운다",
    "definition": "무형자산은 **식별가능성·통제·미래 경제적 효익** 세 요건을 다 갖춰야 하고, **연구단계 지출은 전액 비용**이며 개발단계 지출만 요건을 채우면 자산이 된다.",
    "intuition": "「올릴 수 있는 것」보다 「올릴 수 없는 것」을 외우는 편이 빠르다.",
    "compareCard": {
      "left": {
        "title": "자산으로 올린다",
        "body": "특허권ㆍ상표권ㆍ저작권ㆍ라이선스, 밖에서 사 온 브랜드, 사업결합으로 취득한 영업권, 요건을 충족한 개발비."
      },
      "right": {
        "title": "올리지 못한다",
        "body": "내부창출 영업권ㆍ브랜드ㆍ고객목록, 연구단계 지출, 홍보ㆍ광고원가, 사업개시원가, 교육훈련비."
      }
    },
    "deepDive": [
      {
        "title": "상각과 손상",
        "body": "내용연수가 유한하면 사용 가능한 시점부터 상각하고 상각기간ㆍ방법을 매 회계연도 말 검토한다. 비한정이면 상각하지 않고 매년 손상검사를 한다. 비한정에서 유한으로 바뀌면 그때부터 상각한다."
      },
      {
        "title": "상각방법",
        "body": "경제적 효익이 소비될 것으로 예상되는 형태를 반영해야 하고, 그 형태를 신뢰성 있게 결정할 수 없으면 정액법을 쓴다. 계약상 권리에서 나온 무형자산의 내용연수는 그 권리 기간을 넘을 수 없다."
      },
      {
        "title": "손상차손 계산 순서",
        "body": "자산으로 올릴 금액을 먼저 확정하고, 사용 개시 시점부터 상각해 기말 장부금액을 구한 뒤, 회수가능액과 비교한다. 상각을 건너뛰면 손상차손이 과대해진다."
      }
    ],
    "keyPoints": [
      "세 요건: 식별가능성 + 통제 + 미래 경제적 효익",
      "내부창출 영업권ㆍ브랜드ㆍ고객목록은 인식 불가",
      "연구단계는 비용, 개발단계는 요건 충족 시 자산",
      "비한정 내용연수는 상각하지 않고 매년 손상검사",
      "비한정 → 유한 변경 시 그때부터 상각 (전진)",
      "계약상 권리에서 나온 자산의 내용연수 ≤ 권리 기간"
    ],
    "pitfallCards": [
      {
        "wrong": "전문기관이 평가한 내부창출 영업권은 그 금액으로 자산에 계상한다.",
        "correct": "평가액이 있어도 인식하지 않는다. 그 값어치를 만든 원가를 일상 지출에서 뗄 수 없기 때문이다."
      },
      {
        "wrong": "연구단계와 개발단계를 구분할 수 없으면 전부 개발단계로 본다.",
        "correct": "구분할 수 없으면 전부 연구단계로 보아 비용 처리한다."
      },
      {
        "wrong": "비한정 내용연수 무형자산이 유한으로 바뀌어도 상각하지 않는다.",
        "correct": "나눌 기간이 생겼으므로 그때부터 상각을 시작한다."
      }
    ],
    "questionRefs": [
      {
        "examId": "회계학-2017-지방직-Q2",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 2
      },
      {
        "examId": "회계학-2017-지방직-Q5",
        "year": 2017,
        "sourceCode": "지방직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2018-지방직-Q8",
        "year": 2018,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2020-지방직-Q4",
        "year": 2020,
        "sourceCode": "지방직",
        "questionNo": 4
      },
      {
        "examId": "회계학-2020-국가직-Q10",
        "year": 2020,
        "sourceCode": "국가직",
        "questionNo": 10
      },
      {
        "examId": "회계학-2024-국가직-Q5",
        "year": 2024,
        "sourceCode": "국가직",
        "questionNo": 5
      },
      {
        "examId": "회계학-2024-지방직-Q8",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 8
      },
      {
        "examId": "회계학-2024-지방직-Q17",
        "year": 2024,
        "sourceCode": "지방직",
        "questionNo": 17
      },
      {
        "examId": "회계학-2025-국가직-Q4",
        "year": 2025,
        "sourceCode": "국가직",
        "questionNo": 4
      }
    ]
  }
]
