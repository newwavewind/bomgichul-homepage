const conceptEnhancements = {
  'types-of-real-right-change': {
    summary: '새 권리를 얻는 경로는 먼저 “앞사람의 권리에 기대는가?”로 나누고, 승계취득이라면 다시 “권리가 이동하는가, 새 권리가 얹히는가?”로 나눈다.',
    branches: [
      {
        type: '원시취득',
        cue: '앞 권리와 독립',
        description: '타인의 기존 권리를 이어받지 않고 새로 취득한다.',
        examples: ['건물 신축', '무주동산 선점', '점유취득시효'],
        tone: 'mint',
      },
      {
        type: '이전적 승계',
        cue: '권리 자체가 이동',
        description: '양도인의 기존 권리가 동일성을 유지한 채 양수인에게 옮겨간다.',
        examples: ['부동산 매매', '상속', '채권 양도'],
        tone: 'blue',
      },
      {
        type: '설정적 승계',
        cue: '새 권리가 위에 생성',
        description: '기존 권리는 남고, 그 권능 일부를 내용으로 하는 제한된 권리가 생긴다.',
        examples: ['저당권 설정', '지상권 설정', '전세권 설정'],
        tone: 'amber',
      },
    ],
    decision: [
      ['1', '앞사람의 권리를 이어받는가?', '아니오 → 원시취득'],
      ['2', '기존 권리 자체가 주체만 바뀌는가?', '예 → 이전적 승계'],
      ['3', '기존 권리는 남고 새 제한물권이 생기는가?', '예 → 설정적 승계'],
    ],
    scenario: {
      owner: '甲의 토지 소유권',
      right: '乙의 저당권',
      caption: '소유권은 甲에게 그대로 있고, 그 위에 乙의 저당권이 새로 생긴다. 따라서 “이전”이 아니라 설정적 승계다.',
    },
    caution: '원시취득이라고 해서 언제나 등기가 필요 없는 것은 아니다. 건물 신축은 등기 없이 취득하지만, 20년 점유취득시효는 민법 제245조 제1항에 따라 등기해야 소유권을 취득한다.',
    sources: [
      { label: '민법 제187조', note: '법률규정에 의한 부동산물권 취득과 처분 제한', href: 'https://www.law.go.kr/법령/민법/제187조' },
      { label: '민법 제245조', note: '부동산 점유취득시효의 기간과 등기', href: 'https://www.law.go.kr/법령/민법/제245조' },
      { label: '민법 제252조', note: '무주동산의 선점과 무주부동산의 국유', href: 'https://www.law.go.kr/법령/민법/제252조' },
    ],
  },
  'co-ownership-management': {
    kind: 'legal-thresholds',
    summary: '공유물 문제는 “무슨 행위인가?”를 먼저 분류하면 동의 기준이 자동으로 정해진다. 처분·변경은 전원, 관리는 지분 과반수, 보존은 각자다.',
    thresholds: [
      { action: '처분·변경', vote: '전원 동의', mark: '100%', examples: ['공유물 전체 매각', '철거 등 중대한 변경'], tone: 'red' },
      { action: '관리', vote: '지분 과반수', mark: '> 50%', examples: ['임대', '사용·수익 방법 결정'], tone: 'blue' },
      { action: '보존', vote: '각자 가능', mark: '1인 OK', examples: ['방해배제', '멸실·훼손 방지'], tone: 'green' },
    ],
    comparison: [
      { label: '개별 지분 처분', shared: '각자 자유', joint: '전원 동의 필요' },
      { label: '물건 처분·변경', shared: '전원 동의', joint: '전원 동의' },
      { label: '보존행위', shared: '각자 가능', joint: '각자 가능' },
      { label: '분할청구', shared: '원칙적으로 가능', joint: '조합 존속 중 불가' },
    ],
    scenario: {
      given: '甲 3/5 지분 · 乙 2/5 지분',
      action: '甲이 공유 토지를 제3자에게 임대',
      result: '임대는 관리행위이고 甲이 지분 과반수이므로 유효',
    },
    precedent: '소수지분권자가 공유물을 독점 점유하더라도 다른 소수지분권자는 공유물 자체의 인도를 청구할 수 없고, 공동 사용을 방해하는 행위의 금지나 지상물 제거 등 방해배제는 청구할 수 있다는 것이 대법원 전원합의체의 입장이다.',
    sources: [
      { label: '민법 제264조', note: '공유물의 처분·변경', href: 'https://www.law.go.kr/법령/민법/제264조' },
      { label: '민법 제265조', note: '관리와 보존행위', href: 'https://www.law.go.kr/법령/민법/제265조' },
      { label: '민법 제271~273조', note: '합유와 합유지분', href: 'https://www.law.go.kr/법령/민법/제271조' },
      { label: '대법원 2018다287522', note: '소수지분권자의 인도·방해배제', href: 'https://www.scourt.go.kr/supreme/news/NewsViewAction2.work?gubun=4&seqnum=7138' },
    ],
  },
  'real-estate-transaction-report': {
    kind: 'report-process',
    summary: '거래신고 문제는 “누가 계약서를 작성했는가?”로 신고의무자를 정하고, 신고 뒤에는 단순 오류인지·계약 내용 변경인지·계약 소멸인지로 후속 절차를 나눈다.',
    deadline: '계약 체결일부터 30일 이내',
    actors: [
      { situation: '당사자 간 직거래', actor: '매도인 + 매수인', detail: '거래당사자가 공동 신고', icon: '🤝' },
      { situation: '개업공인중개사가 계약서 작성·교부', actor: '개업공인중개사', detail: '공동중개라면 중개사들이 공동 신고', icon: '🏠' },
      { situation: '상대방이 신고를 거부', actor: '다른 일방 단독', detail: '거부 사실을 소명하여 단독 신고 가능', icon: '✍' },
    ],
    flow: ['계약 체결', '신고의무자 확정', '30일 이내 신고', '신고필증 발급·검증'],
    followups: [
      { issue: '단순 오기', action: '정정신청', example: '지분비율·면적·건축물 종류·전화번호 등' },
      { issue: '계약 내용 변화', action: '변경신고', example: '공동매수인 추가 등 계약 당사자·내용 변경' },
      { issue: '해제·무효·취소', action: '해제등 신고', example: '해제등 확정일부터 30일 이내' },
    ],
    digital: '국토교통부 부동산거래 전자계약시스템으로 매매계약을 체결하면 실거래 신고가 자동 신청되어 별도의 종이 신고 절차를 줄일 수 있다.',
    sources: [
      { label: '거래신고법 제3조', note: '신고의무자·기한·신고관청', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제3조' },
      { label: '거래신고법 제3조의2', note: '해제·무효·취소 신고', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제3조의2' },
      { label: '국토교통부 전자계약 FAQ', note: '매매 실거래 자동신고', href: 'https://irts.molit.go.kr/usr/brd/bscbrd/faq/RtecsFaqList.do' },
    ],
  },
  'land-category-registration': {
    kind: 'registry-visual', variant: 'land-category',
    summary: '지목은 시설 이름이 아니라 토지의 주된 용도로 결정한다. 비슷한 시설은 “무엇을 생산·수송·저장하는가?”를 확인해야 한다.',
    categories: [
      { name: '학교용지', icon: '▤', rule: '교사와 이에 접속된 체육장 등 부속시설', examples: ['교실·운동장'] },
      { name: '수도용지', icon: '≈', rule: '취수·저수·도수·정수·송수·배수 시설', examples: ['정수장·배수시설'] },
      { name: '도로 / 철도용지', icon: '⇢', rule: '일반 교통은 도로, 궤도 설비는 철도용지', examples: ['고속도로 휴게소 / 철도 선로'] },
      { name: '유지', icon: '◒', rule: '물이 고이거나 상시 저장되고 배수가 나쁜 토지', examples: ['저수지·호수'] },
      { name: '잡종지', icon: '◇', rule: '다른 지목에 속하지 않는 독립시설 중 법정 예시', examples: ['터미널·운전학원·폐차장·방파제'] },
    ],
    contrast: {
      yes: ['여객자동차터미널', '자동차운전학원', '폐차장', '방사제·방파제'],
      no: ['변전소·송신소', '공항·항만시설', '도축장·쓰레기처리장'],
    },
    sources: [
      { label: '공간정보관리법 제67조', note: '법정 지목의 종류', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제67조' },
      { label: '시행령 제58조', note: '지목별 구체적 결정 기준', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제58조' },
    ],
  },
  'cadastral-books-classification': {
    kind: 'registry-visual', variant: 'books',
    summary: '지적공부는 같은 토지를 서로 다른 방식으로 기록한다. 대장은 문자정보, 도면은 위치·경계, 좌표등록부는 수치좌표를 담당한다.',
    books: [
      { book: '토지·임야대장', role: '문자 장부', items: '지번·지목·면적·소유자 등', accent: 'blue' },
      { book: '공유지연명부', role: '공유관계', items: '공유자 성명·주소·지분', accent: 'mint' },
      { book: '대지권등록부', role: '대지권', items: '소유자·지분 + 대지권비율', accent: 'amber' },
      { book: '지적도·임야도', role: '도면', items: '경계·지번·지목 부호 등', accent: 'violet' },
      { book: '경계점좌표등록부', role: '수치 좌표', items: '경계점의 좌표·부호·부호도', accent: 'rose' },
    ],
    coordinateNote: '경계점좌표등록부를 갖춘 지역의 지적도에는 제명 끝에 “(좌표)”라고 표시한다.',
    sources: [
      { label: '공간정보관리법 제2조', note: '지적공부의 정의와 종류', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제2조' },
      { label: '공간정보관리법 제71조', note: '토지대장 등의 등록사항', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제71조' },
    ],
  },
  'scale-conversion': {
    kind: 'registry-visual', variant: 'scale-process',
    summary: '축척변경은 단순히 지도를 다시 그리는 작업이 아니다. 동의·위원회·승인을 거쳐 새로 측량하고, 늘거나 줄어든 면적을 청산금으로 정산한 뒤 지적공부를 확정한다.',
    consent: '토지소유자 3분의 2 이상 동의',
    steps: ['소유자 동의·신청', '축척변경위원회 의결', '시·도지사 등 승인', '시행공고·측량', '청산금 산정·공고', '납부·지급 후 확정공고'],
    settlement: [
      { change: '면적 증가', money: '청산금 납부', direction: '소유자 → 지적소관청' },
      { change: '면적 감소', money: '청산금 지급', direction: '지적소관청 → 소유자' },
    ],
    trap: '축척변경위원회는 시행계획·㎡당 금액·청산금과 이의신청을 심의하지만, 축척변경 자체의 승인기관은 아니다.',
    sources: [
      { label: '공간정보관리법 제83조', note: '축척변경의 시행', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제83조' },
      { label: '시행령 제75조', note: '청산금 산정과 공고', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제75조' },
      { label: '시행규칙 제92조', note: '축척변경 확정공고', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제92조' },
    ],
  },
  'registration-general-matters': {
    kind: 'registration-effects',
    summary: '등기 총론은 “기록할 수 있는가 → 언제 효력이 생기는가 → 서로 충돌하면 누가 앞서는가 → 말소할 때 제3자가 있는가”의 네 관문으로 정리한다.',
    gates: [
      { title: '기록 가능성', cue: '약정 ≠ 등기사항', body: '당사자가 합의했더라도 법령이 기록을 허용하지 않는 사항은 등기기록에 넣을 수 없다.', icon: '⌕' },
      { title: '효력 발생', cue: '등기관이 마친 때', body: '등기관이 등기를 마치면 그 효력은 해당 신청을 접수한 때부터 발생한다.', icon: '◷' },
      { title: '권리 순위', cue: '등기한 순서', body: '같은 부동산의 권리 순위는 원칙적으로 같은 구는 순위번호, 다른 구는 접수번호로 가린다.', icon: '≣' },
      { title: '말소의 안전장치', cue: '이해관계인 확인', body: '말소로 손해를 입을 등기상 이해관계 있는 제3자가 있으면 승낙 또는 이에 대항할 재판이 필요하다.', icon: '⊘' },
    ],
    timeline: [
      { at: '10:01', label: '甲 신청 접수', rank: '접수번호 101' },
      { at: '10:04', label: '乙 신청 접수', rank: '접수번호 102' },
      { at: '처리 완료', label: '등기관이 각각 등기', rank: '甲이 선순위' },
    ],
    effects: [
      { name: '순위확정력', rule: '접수·순위번호로 우열 고정', sourceType: '법률' },
      { name: '대항력', rule: '등기를 갖춰 제3자에게 권리 주장', sourceType: '민법·개별법' },
      { name: '추정력', rule: '등기 절차·원인이 정당한 것으로 추정', sourceType: '대법원 판례' },
    ],
    deletion: ['말소 대상 등기 확인', '후순위 가압류 등 제3자 확인', '승낙서 또는 대항 가능한 재판 첨부', '말소등기 실행'],
    caution: '“등기의 효력”을 하나로 외우면 위험하다. 순위와 효력발생시기는 부동산등기법 조문, 추정력은 판례 법리이며, 대항력의 구체적 모습은 권리·법률관계마다 다르다.',
    sources: [
      { label: '부동산등기법 제4조', note: '권리의 순위와 순서', href: 'https://www.law.go.kr/법령/부동산등기법/제4조' },
      { label: '부동산등기법 제6조', note: '접수시기와 등기의 효력발생시기', href: 'https://www.law.go.kr/법령/부동산등기법/제6조' },
      { label: '부동산등기법 제57조', note: '이해관계 있는 제3자가 있는 말소', href: 'https://www.law.go.kr/법령/부동산등기법/제57조' },
      { label: '대법원 97다2993', note: '소유권이전등기의 추정력과 증명책임', href: 'https://www.law.go.kr/LSW/precInfoP.do?evtNo=97다2993' },
    ],
  },
  'required-vs-expected-return': {
    kind: 'return-risk',
    summary: '요구수익률은 투자자가 위험을 감수하기 위한 최소 문턱이고, 기대수익률은 투자안에서 예상되는 수익이다. 둘의 높이를 비교해 채택 여부를 판단한다.',
    formula: [
      { term: '무위험률', value: '시간가치의 출발점', tone: 'safe' },
      { term: '위험 프리미엄', value: '위험 감수의 추가 보상', tone: 'risk' },
      { term: '요구수익률', value: '최소 수용 문턱', tone: 'required' },
    ],
    cases: [
      { expected: 10, required: 8, verdict: '채택', reason: '기대수익률이 문턱보다 2%p 높다', tone: 'accept' },
      { expected: 6, required: 8, verdict: '기각', reason: '기대수익률이 문턱보다 2%p 낮다', tone: 'reject' },
    ],
    riskTypes: [
      { name: '사업위험', signal: '경기·수요·영업수익', example: '경기침체로 임대수익 악화' },
      { name: '금융위험', signal: '부채·이자·레버리지', example: '차입금리 상승과 원리금 부담' },
      { name: '유동성위험', signal: '매각 시간·가격', example: '원하는 때 적정가로 현금화 곤란' },
      { name: '인플레이션위험', signal: '구매력 하락', example: '명목수익보다 물가가 더 빠르게 상승' },
    ],
    diversification: {
      reducible: '비체계적 위험: 개별 부동산·지역·임차인 특성 → 분산으로 감소 가능',
      irreducible: '체계적 위험: 금리·경기·시장 전체 충격 → 분산으로 제거 불가',
    },
    shifts: ['무위험률 상승', '위험회피 성향 강화', '투자안의 불확실성 증가'],
    sources: [
      { label: '한국은행 BOK 경제연구 2024-11', note: '위험 프리미엄을 위험자산 기대수익률과 무위험수익률의 차이로 정의', href: 'https://www.bok.or.kr/portal/bbs/P0002455/view.do?menuNo=201669&nttId=10086850' },
      { label: '금융투자협회 표준투자권유준칙', note: '투자자 성향과 금융상품 위험도의 적합성 기준', href: 'https://law.kofia.or.kr/service/law/detailArticlePrint.do?contentSeq=305503&historySeq=1787&seq=149' },
    ],
  },
  'sham-declaration': {
    kind: 'sham-relation',
    summary: '통정허위표시는 甲과 乙이 서로 짜고 겉모습만 만든 법률행위다. 두 사람 사이에서는 무효지만, 그 외관을 믿고 새 법률상 이해관계를 맺은 선의의 제3자 丙은 보호된다.',
    parties: [
      { role: '甲', label: '진짜 소유자·표의자', note: '허위표시를 제안·합의' },
      { role: '乙', label: '가장 매수인', note: '실제 취득 의사 없이 통정' },
      { role: '丙', label: '제3자', note: '외관을 믿고 새 이해관계 취득' },
    ],
    relations: [
      { from: '甲', to: '乙', title: '가장매매', result: '무효', detail: '당사자 사이에는 소유권 이전 의사가 없다.' },
      { from: '乙', to: '丙', title: '후속 거래', result: '선의라면 보호', detail: '甲은 허위표시의 무효를 丙에게 대항하지 못한다.' },
    ],
    test: [
      ['1', '상대방과 짜고 표시했는가?', '예 → 통정허위표시'],
      ['2', '문제의 사람이 새 이해관계를 취득했는가?', '예 → 제3자 해당 가능'],
      ['3', '허위표시임을 알고 있었는가?', '모름(선의) → 보호'],
    ],
    burden: '제3자의 선의는 추정되므로, 그가 악의였다고 주장하는 사람이 악의를 증명해야 한다. 전득자는 앞선 제3자가 악의였더라도 자신이 선의이면 보호될 수 있다.',
    scenario: '채무자 甲이 강제집행을 피하려고 乙과 짜고 허위 근저당권을 설정했다면 甲·乙 사이에서는 무효다. 다만 그 외관을 믿고 새로운 법률상 이해관계를 취득한 선의의 丙에게는 그 무효를 주장할 수 없다.',
    caution: '제108조 제2항의 “제3자”는 단순히 당사자 밖에 있는 모든 사람이 아니다. 허위표시로 생긴 외관을 기초로 별개의 법률원인에 따라 새 이해관계를 취득한 사람이어야 한다.',
    sources: [
      { label: '민법 제108조', note: '통정한 허위 의사표시의 무효와 선의의 제3자 보호', href: 'https://www.law.go.kr/법령/민법/제108조' },
      { label: '대법원 2019다280375', note: '선의의 제3자와 악의 증명책임', href: 'https://www.law.go.kr/LSW/precInfoP.do?precSeq=226049' },
      { label: '대법원 판례속보', note: '선의의 전득자 보호 법리', href: 'https://www.scourt.go.kr/sjudge/1576738707590_155827.pdf' },
    ],
  },
  'appraisal-terminology': {
    kind: 'appraisal-system',
    summary: '감정평가 용어는 따로 외우기보다 “무슨 가치를 정하는가 → 어느 공간의 자료를 보는가 → 어떤 시점·단위로 평가하는가 → 어떤 방법으로 계산하는가”의 체계로 연결한다.',
    valueStandard: {
      default: '시장가치',
      definition: '통상적 시장에서 충분히 공개되고, 정통한 당사자 사이의 신중·자발적 거래로 성립할 가능성이 가장 높은 가액',
      exceptions: ['법령에 다른 규정', '의뢰인의 요청', '사회통념상 필요'],
      safeguard: '시장가치 외 가치의 성격·특징과 합리성·적법성을 검토',
    },
    regions: [
      { name: '대상부동산', cue: '평가의 중심', size: 'target' },
      { name: '인근지역', cue: '대상이 속함 · 이용 동질 · 지역요인 공유', size: 'near' },
      { name: '유사지역', cue: '대상은 속하지 않음 · 인근지역과 유사', size: 'similar' },
      { name: '동일수급권', cue: '대체·경쟁 관계 · 인근지역 + 유사지역', size: 'market' },
    ],
    timing: {
      label: '기준시점',
      rule: '가격조사를 완료한 날짜',
      exception: '미리 정한 날에도 가격조사가 가능하면 그 날짜',
    },
    units: [
      { type: '일괄평가', when: '둘 이상 물건이 일체 거래되거나 용도상 불가분' },
      { type: '구분평가', when: '한 물건 안에서 가치가 다른 부분' },
      { type: '부분평가', when: '일체 이용 물건 중 일부만 평가할 특수 목적' },
    ],
    methods: [
      { name: '원가법', equation: '재조달원가 − 감가수정', trap: '감가요인은 공제' },
      { name: '수익환원법', equation: '장래 순수익·현금흐름을 환원·할인', trap: '가치 산정' },
      { name: '수익분석법', equation: '순수익 + 필요경비', trap: '임대료 산정' },
    ],
    sources: [
      { label: '감정평가에 관한 규칙 제2조', note: '시장가치·평가방법·지역 개념의 법정 정의', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제2조' },
      { label: '감정평가에 관한 규칙 제5조', note: '시장가치 기준 원칙과 예외', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제5조' },
      { label: '감정평가에 관한 규칙 제7조', note: '개별·일괄·구분·부분 감정평가', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제7조' },
      { label: '감정평가에 관한 규칙 제9조', note: '기본적 사항 확정과 기준시점', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제9조' },
    ],
  },
  'ownership-registration': {
    kind: 'ownership-chain',
    summary: '소유권등기는 실제 권리취득의 흐름을 등기기록에 이어 붙인다. “누가 최초 소유자인가, 중간 등기를 생략할 법정 승계인가”를 먼저 확인한다.',
    buildingFlow: [
      { party: '甲', role: '건물 신축자', state: '원시취득 · 미등기' },
      { party: '甲', role: '보존등기 신청', state: '최초 소유명의 기록' },
      { party: '乙', role: '매수인', state: '甲 → 乙 이전등기' },
    ],
    wrongShortcut: '미등기건물 매수인 乙이 자기 명의로 곧바로 보존등기',
    successionFlow: [
      { party: '甲', role: '매도인', state: '이전등기 전 사망' },
      { party: '乙', role: '단독상속인', state: '등기의무자 지위 승계' },
      { party: '丙', role: '매수인', state: '甲 명의에서 직접 이전등기' },
    ],
    successionNote: '상속등기를 먼저 하지 않아도 상속인이 등기의무자로 신청할 수 있다. 이는 보존등기 단계 생략과는 다른 문제다.',
    applicantRules: [
      { case: '원칙적 권리등기', applicant: '등기권리자 + 등기의무자', method: '공동신청' },
      { case: '소유권보존등기', applicant: '등기명의인이 될 자', method: '단독신청' },
      { case: '상속·합병 등 포괄승계', applicant: '등기권리자', method: '단독신청' },
    ],
    expropriation: '수용은 수용개시일에 원시취득하므로, 그 뒤 원소유자 명의에서 이루어진 소유권이전등기는 수용에 따른 등기 과정에서 직권말소 대상이 된다.',
    sources: [
      { label: '부동산등기법 제23조', note: '공동신청 원칙과 단독신청 유형', href: 'https://www.law.go.kr/법령/부동산등기법/제23조' },
      { label: '부동산등기법 제27조', note: '포괄승계인에 의한 등기신청', href: 'https://www.law.go.kr/법령/부동산등기법/제27조' },
      { label: '부동산등기법 제65조', note: '소유권보존등기를 신청할 수 있는 자', href: 'https://www.law.go.kr/법령/부동산등기법/제65조' },
      { label: '대법원등기예규 제1483호', note: '미등기부동산 보존등기 신청인의 구체적 범위', href: 'https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2200000102905' },
    ],
  },
  'voidable-act-period': {
    kind: 'cancellation-timer',
    summary: '취소권에는 서로 출발점이 다른 두 제척기간이 동시에 걸린다. “추인할 수 있는 날부터 3년”과 “법률행위를 한 날부터 10년” 중 하나라도 끝나면 더 이상 취소할 수 없다.',
    clocks: [
      { duration: '3년', starts: '추인할 수 있는 날', meaning: '취소 원인이 종료되고 취소·추인을 선택할 장애가 없어진 때', tone: 'blue' },
      { duration: '10년', starts: '법률행위를 한 날', meaning: '취소사유를 알았는지와 무관한 객관적 최종기한', tone: 'violet' },
    ],
    sample: {
      act: '2020. 4. 1. 법률행위',
      ratifiable: '2024. 7. 1. 추인 가능',
      threeYearEnd: '2027. 7. 1.',
      tenYearEnd: '2030. 4. 1.',
      result: '먼저 도래하는 2027. 7. 1.까지 행사',
    },
    statutoryRatification: [
      { act: '전부·일부 이행', actor: '취소권자', included: true },
      { act: '이행 청구', actor: '취소권자', included: true },
      { act: '경개·담보 제공', actor: '취소권자', included: true },
      { act: '권리의 양도', actor: '취소권자', included: true },
      { act: '상대방의 이행 청구', actor: '상대방', included: false },
    ],
    restitution: {
      rule: '취소되면 처음부터 무효로 본다.',
      limited: '제한능력자는 그 행위로 받은 이익이 현존하는 한도에서만 상환한다.',
    },
    caution: '3년의 기산점은 “취소사유를 안 날”이나 단순히 “취소할 수 있는 날”이라는 암기문구가 아니라, 법적으로 추인할 수 있는 상태가 된 날이다.',
    sources: [
      { label: '민법 제140조', note: '법률행위의 취소권자', href: 'https://www.law.go.kr/법령/민법/제140조' },
      { label: '민법 제141조', note: '취소의 소급효와 제한능력자의 반환범위', href: 'https://www.law.go.kr/법령/민법/제141조' },
      { label: '민법 제145조', note: '법정추인의 구체적 사유', href: 'https://www.law.go.kr/법령/민법/제145조' },
      { label: '민법 제146조', note: '3년·10년의 취소권 제척기간', href: 'https://www.law.go.kr/법령/민법/제146조' },
      { label: '대법원 96다25371', note: '“추인할 수 있는 날”의 의미', href: 'https://www.law.go.kr/LSW/precInfoP.do?precSeq=195270' },
    ],
  },
  'real-estate-classification': {
    kind: 'land-vocabulary',
    summary: '토지용어는 이름을 나열해 외우지 않고, “용도가 어디까지 바뀌는가·물과 육지의 경계에서 어떤 상태인가·법적 등록단위인가 경제적 가격단위인가”로 나누면 선명해진다.',
    transitions: [
      { from: '주거용 택지', to: '상업용 택지', scope: '같은 택지지역 내부', answer: '이행지' },
      { from: '농지지역', to: '택지지역', scope: '용도지역 대분류 상호간', answer: '후보지' },
      { from: '임지지역', to: '농지지역', scope: '용도지역 대분류 상호간', answer: '후보지' },
    ],
    shore: [
      { name: '육지', state: '통상적인 토지', owner: '소유권 인정', level: 3 },
      { name: '법지', state: '경사면·축대 등', owner: '소유권 O · 활용실익 적음', level: 2 },
      { name: '빈지', state: '바다와 육지 사이 해변', owner: '사적 소유권 X', level: 1 },
      { name: '포락지', state: '침식되어 수면 아래로 무너진 땅', owner: '토지로서 소유권 상실', level: 0 },
    ],
    units: [
      { name: '필지', axis: '법률·지적', definition: '하나의 지번이 붙는 토지 등록단위', icon: '1-23' },
      { name: '획지', axis: '경제·가격', definition: '가격수준이 비슷한 일단의 토지', icon: '₩' },
      { name: '일단지', axis: '용도·평가', definition: '용도상 불가분인 둘 이상의 필지', icon: '▦' },
      { name: '나지', axis: '이용상태', definition: '건축물 등 정착물이 없고 사법상 제한이 없는 토지', icon: '□' },
      { name: '맹지', axis: '접근성', definition: '도로에 직접 접하지 않은 토지', icon: '⊙' },
    ],
    quiz: ['같은 대분류 내부 변화인가?', '지번이라는 등록기준인가?', '가격이 같은 경제적 범위인가?', '도로 접면이 있는가?'],
    sources: [
      { label: '공간정보관리법 제2조', note: '필지·지번·지목 등 법정 지적용어', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제2조' },
      { label: '건축법 제2조', note: '필지를 기초로 한 대지의 법정 정의', href: 'https://www.law.go.kr/법령/건축법/제2조' },
      { label: 'KOCW 부동산학개론 공개강의', note: '부동산의 경제적 측면과 토지 분류 학습자료', href: 'https://contents.kocw.net/KOCW/document/2014/shinhan/kimseungwook/6.pdf' },
    ],
  },
  'land-characteristics': {
    kind: 'land-causality',
    summary: '토지의 자연적 특성은 정의보다 결과가 더 자주 출제된다. 각 특성을 원인으로 놓고 시장·평가·이용에서 생기는 현상을 화살표로 연결한다.',
    traits: [
      { name: '부동성', cue: '옮길 수 없음', effects: ['임장활동·지역분석', '시장 국지화', '외부효과', '조세 포착 용이'], color: 'blue' },
      { name: '부증성', cue: '물리량을 늘릴 수 없음', effects: ['희소성·지가·지대', '최유효이용', '집약적 이용'], color: 'red' },
      { name: '영속성', cue: '소모·소멸하지 않음', effects: ['토지는 감가상각 X', '장기적 배려', '소득·자본이득', '직접환원법'], color: 'green' },
      { name: '개별성', cue: '완전히 같은 땅 없음', effects: ['일물일가 제약', '완전대체 불가', '불완전경쟁시장'], color: 'violet' },
      { name: '인접성', cue: '다른 토지와 연속', effects: ['상호의존', '경계 문제', '외부효과'], color: 'amber' },
    ],
    supply: {
      physical: { label: '물리적 공급', value: '고정', result: '부증성 때문에 전체 토지량 증대 불가' },
      economic: { label: '경제적·용도적 공급', value: '변화 가능', result: '용도전환·집약이용으로 특정 용도 공급 증가' },
    },
    distinction: [
      { phenomenon: '외부효과', causes: ['부동성', '인접성'] },
      { phenomenon: '토지의 감가상각 배제', causes: ['영속성'] },
      { phenomenon: '용도전환 필요', causes: ['부증성', '용도의 다양성'] },
      { phenomenon: '개별분석 필요', causes: ['개별성'] },
    ],
    caution: '건물은 소모·감가되지만 토지 자체는 영속성 때문에 물리적 감가상각 대상이 아니다. 또 부증성은 물리적 공급을 고정할 뿐 특정 용도의 경제적 공급까지 고정하지 않는다.',
    sources: [
      { label: 'KOCW 부동산학개론 공개강의', note: '자연적 특성과 물리적 토지공급의 고정성', href: 'https://contents.kocw.net/KOCW/document/2014/shinhan/kimseungwook/6.pdf' },
      { label: '민법 제211조', note: '법률 범위 안의 토지소유권 사용·수익·처분', href: 'https://www.law.go.kr/법령/민법/제211조' },
      { label: '감정평가에 관한 규칙 제2조', note: '원가법·감가수정·수익환원법의 공식 정의', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제2조' },
    ],
  },
  'registration-requirements': {
    kind: 'broker-registration',
    summary: '중개사무소 개설등록은 신청자 자격을 먼저 거른 뒤, 사무소·교육 등 등록기준 심사와 7일 이내 통지, 보증 확인, 등록증 교부, 협회 통보 순으로 진행된다.',
    applicants: [
      { name: '공인중개사', allowed: true, note: '소속공인중개사는 제외' },
      { name: '법인', allowed: true, note: '대통령령상 등록기준 충족' },
      { name: '소속공인중개사', allowed: false, note: '개업공인중개사 소속 신분' },
      { name: '법인 아닌 사단', allowed: false, note: '법 제9조의 신청 주체 아님' },
    ],
    process: [
      { step: '신청', detail: '사무소 소재지 등록관청' },
      { step: '기준 심사', detail: '자격·결격·사무소·교육' },
      { step: '등록 통지', detail: '신청일부터 7일 이내 서면' },
      { step: '보증 신고·확인', detail: '업무 시작 전 손해배상 보장' },
      { step: '등록증 교부', detail: '보증 여부 확인 후' },
      { step: '협회 통보', detail: '다음 달 10일까지' },
    ],
    officeUse: ['소유', '전세', '임대차', '사용대차'],
    officeRule: '사무소는 소유권만으로 확보할 필요가 없고, 건축물대장에 기재된 건물의 사용권을 적법하게 확보하면 된다.',
    cancellation: '이중으로 중개사무소 개설등록을 한 경우 등록관청은 등록을 취소해야 한다.',
    arrows: { from: '등록관청', to: '공인중개사협회', deadline: '다음 달 10일' },
    sources: [
      { label: '공인중개사법 제9조', note: '개설등록 관청과 신청 주체', href: 'https://www.law.go.kr/법령/공인중개사법/제9조' },
      { label: '공인중개사법 제11조', note: '등록증 교부와 보증 확인', href: 'https://www.law.go.kr/법령/공인중개사법/제11조' },
      { label: '공인중개사법 시행령 제24조', note: '업무 개시 전 손해배상책임 보증', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제24조' },
      { label: '공인중개사법 시행규칙 제5조', note: '7일 이내 통지·등록증 교부·협회 통보', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제5조' },
    ],
  },
  'brokerage-fee-calculation': {
    kind: 'brokerage-fee',
    summary: '중개보수 문제는 금액 계산보다 먼저 “주택인가 → 어느 지역 규범을 적용하는가 → 누가 의뢰했는가 → 계약이 왜 무산됐는가 → 한도를 넘었는가”를 판별해야 한다.',
    routing: [
      { object: '주택·부속토지', rule: '국토교통부령 범위 + 시·도 조례', jurisdiction: '중개사무소 소재지 관할 조례' },
      { object: '주택 외 중개대상물', rule: '공인중개사법 시행규칙', jurisdiction: '전국 공통 상한·기준' },
    ],
    decision: [
      ['1', '중개의뢰인이 누구인가?', '의뢰하지 않은 거래상대방은 원칙적으로 지급의무 없음'],
      ['2', '고의·과실로 계약이 무효·취소·해제됐나?', '개업공인중개사 책임이면 보수 청구 불가'],
      ['3', '지급시기를 따로 약정했나?', '없으면 거래대금 지급이 완료된 날'],
      ['4', '법정 상한을 넘었나?', '초과 부분 무효 + 초과 금품 수령 금지'],
    ],
    overcharge: [
      { stage: '약정', result: '법정한도 초과 부분 무효', tone: 'warning' },
      { stage: '수령', result: '제33조 금지행위 성립', tone: 'danger' },
      { stage: '사후 반환', result: '이미 성립한 위반을 없애지 못함', tone: 'dark' },
    ],
    caseStudy: {
      situation: '경기도 주택을 서울 소재 중개사무소가 중개',
      answer: '서울특별시 조례 기준 적용',
      reason: '대상물 소재지가 아니라 중개사무소 소재지를 기준으로 한다.',
    },
    nuance: '공매 대상 부동산의 취득 알선은 공인중개사법상 “중개”와 구별되는 영역이어서 법 제32조의 중개보수 제한을 그대로 적용하지 않는다.',
    sources: [
      { label: '공인중개사법 제32조', note: '보수청구·지급시기·주택과 비주택의 규율', href: 'https://www.law.go.kr/법령/공인중개사법/제32조' },
      { label: '공인중개사법 제33조', note: '법정 보수·실비를 초과한 금품 수령 금지', href: 'https://www.law.go.kr/법령/공인중개사법/제33조' },
      { label: '공인중개사법 시행규칙 제20조', note: '중개보수 한도와 거래금액 산정기준', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제20조' },
      { label: '대법원 2023다252162', note: '중개의뢰하지 않은 거래당사자의 보수의무', href: 'https://www.law.go.kr/LSW/precInfoP.do?mode=0&precSeq=239253' },
      { label: '법제처 22-0397', note: '초과보수 수령 금지행위의 해석', href: 'https://www.law.go.kr/DRF/lawService.do?ID=338797&OC=unicpla&mobileYn=Y&target=expc&type=HTML' },
    ],
  },
  'registration-application-procedure': {
    kind: 'registration-procedure',
    summary: '등기절차 총론은 “신청 전에 누구인지 확인 → 누구나 기록을 열람 → 신청·심사 → 처분에 불복”의 흐름으로 묶되, 등록번호 발급기관과 전자신청 가능 주체를 반드시 나눠야 한다.',
    identifiers: [
      { subject: '국내 법인', issuer: '법인등기 담당기관', note: '법인등록번호를 사용' },
      { subject: '법인 아닌 사단·재단', issuer: '시장·군수·구청장', note: '부동산등기용등록번호' },
      { subject: '외국인', issuer: '출입국관서 등', note: '법정 절차에 따라 부여' },
    ],
    access: { who: '누구든지', actions: ['등기기록 열람', '등기사항증명서 발급'], rule: '수수료를 내고 청구할 수 있으며 이해관계 소명은 요구되지 않는다.' },
    flow: [
      { step: '신청', detail: '방문 또는 허용된 전자신청' },
      { step: '접수', detail: '접수번호·접수시각 부여' },
      { step: '심사·처분', detail: '등기 실행 또는 각하' },
      { step: '이의신청', detail: '관할 지방법원에 판단 요청' },
    ],
    objection: { rule: '이의신청에는 집행정지 효력이 없다', route: '등기관을 거쳐 관할 지방법원', caution: '불복했다는 이유만으로 등기관의 처분이 자동 정지되지 않는다.' },
    electronic: [
      { subject: '당사자·자격자대리인', allowed: true, note: '사용자등록·인증 등 요건 충족' },
      { subject: '법인 아닌 사단·재단', allowed: false, note: '부동산등기규칙상 전자신청 불가' },
    ],
    sources: [
      { label: '부동산등기법 제19조', note: '등기사항의 열람과 증명서 발급', href: 'https://www.law.go.kr/법령/부동산등기법/제19조' },
      { label: '부동산등기법 제49조', note: '부동산등기용등록번호 부여 주체', href: 'https://www.law.go.kr/법령/부동산등기법/제49조' },
      { label: '부동산등기법 제100~104조', note: '등기관 처분에 대한 이의와 집행부정지', href: 'https://www.law.go.kr/법령/부동산등기법/제104조' },
      { label: '부동산등기규칙 제67조', note: '전자신청 방법과 신청 주체 제한', href: 'https://www.law.go.kr/법령/부동산등기규칙/제67조' },
    ],
  },
  'housing-construction-association': {
    kind: 'housing-definitions',
    summary: '주택법 정의 문제는 “단지를 가르는 선 → 국민주택 면적 문턱 → 시설의 역할 → 주택은 아니지만 거주하는 준주택” 순서로 공간을 그리면 서로 섞이지 않는다.',
    separators: [
      { name: '철도·고속도로·자동차전용도로', width: '폭과 무관', tone: 'rail' },
      { name: '일반도로', width: '20m 이상', tone: 'road' },
      { name: '도시·군계획예정도로', width: '8m 이상', tone: 'plan' },
    ],
    nationalHousing: [
      { area: '85㎡ 이하', place: '일반 지역' },
      { area: '100㎡ 이하', place: '수도권 밖 읍·면' },
    ],
    facilities: [
      { type: '부대시설', cue: '주거 기능을 직접 보조', examples: ['주차장', '관리사무소', '담장·주택단지 도로'] },
      { type: '복리시설', cue: '입주자의 생활·복리를 지원', examples: ['어린이놀이터', '근린생활시설', '유치원·경로당'] },
      { type: '기반시설', cue: '도시 전체의 기능을 지탱', examples: ['교통시설', '공간시설', '유통·공급시설'] },
    ],
    quasi: ['기숙사', '다중생활시설', '노인복지주택', '오피스텔'],
    caution: '준주택은 주택법상 “주택 외의 건축물과 그 부속토지” 중 주거시설로 이용 가능한 시설이다. 이름에 ‘주택’이 들어간 노인복지주택도 이 분류에서는 준주택이다.',
    sources: [
      { label: '주택법 제2조', note: '주택단지·국민주택·부대·복리·기반시설 정의', href: 'https://www.law.go.kr/법령/주택법/제2조' },
      { label: '주택법 시행령 제4조', note: '준주택의 구체적 범위', href: 'https://www.law.go.kr/법령/주택법시행령/제4조' },
      { label: '국토계획법 제2조', note: '기반시설의 법정 범주', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제2조' },
    ],
  },
  'quasi-rent-differential-rent': {
    kind: 'rent-theories',
    summary: '지대이론은 모두 토지소득을 설명하지만 원인이 다르다. 비옥도 격차, 소유 독점, 시장까지의 거리, 단기 고정요소라는 네 질문으로 학자를 연결한다.',
    theories: [
      { scholar: '리카도', name: '차액지대', cause: '비옥도·토지 생산성 격차', key: '한계지 지대 0', tone: 'green' },
      { scholar: '마르크스', name: '절대지대', cause: '토지 사유와 소유 독점', key: '한계지도 지대 발생', tone: 'red' },
      { scholar: '튀넨', name: '위치지대', cause: '시장과 거리·수송비 차이', key: '멀수록 지대 감소', tone: 'blue' },
      { scholar: '마셜', name: '준지대', cause: '단기에 공급 고정된 생산요소', key: '총수입 − 총가변비', tone: 'amber' },
    ],
    grades: [
      { land: 'A급지', output: 100, cost: 40, rent: 60 },
      { land: 'B급지', output: 80, cost: 40, rent: 40 },
      { land: 'C급지', output: 60, cost: 40, rent: 20 },
      { land: '한계지', output: 40, cost: 40, rent: 0 },
    ],
    distance: ['도심·시장', '근교농업', '곡물농업', '목축·임업'],
    timeSwitch: { short: '단기: 설비 공급 고정 → 일시적 초과수입', long: '장기: 공급 조정 → 준지대 소멸 가능' },
    caution: '“가격이 높아져서 지대가 생긴다”와 “지대가 가격을 올린다”를 뒤집지 않는다. 리카도 이론에서는 생산물 가격이 지대를 결정하며 지대는 가격결정비용이 아니다.',
    sources: [
      { label: 'KOCW 입지이론 강의', note: '차액지대와 튀넨 농업입지·수송비', href: 'https://contents.kocw.or.kr/KOCW/document/2015/hankyong/nohyongsik1/6.pdf' },
      { label: 'KOCW 수험경제학', note: '준지대의 단기 고정요소 보수와 계산식', href: 'https://contents.kocw.net/KOCW/document/2010/dongguk/leesiyeong/06_1.pdf' },
    ],
  },
  'urban-structure-theory': {
    kind: 'urban-models',
    summary: '도시 내부구조 이론은 도시가 커지는 모양을 비교한다. 동심원은 중심에서 바깥으로, 선형은 교통축을 따라, 다핵심은 여러 중심 주위로 성장한다.',
    models: [
      { type: 'rings', scholar: '버제스', name: '동심원이론', cue: 'CBD → 전이지대 → 주거지 → 통근자지대', explanation: '침입과 천이로 토지이용이 바깥쪽 원형 띠를 이루며 이동한다.' },
      { type: 'sectors', scholar: '호이트', name: '선형이론', cue: '교통축을 따라 부채꼴 성장', explanation: '고급주택지 등 유사 용도가 도로·철도 축을 따라 바깥으로 뻗는다.' },
      { type: 'nuclei', scholar: '해리스·울만', name: '다핵심이론', cue: 'CBD 하나가 아닌 복수의 핵', explanation: '상업·공업·대학·공항 등 서로 다른 중심 주위에 적합한 용도가 모인다.' },
    ],
    comparison: [
      { question: '성장의 출발점은?', rings: '하나의 CBD', sectors: 'CBD + 교통축', nuclei: '여러 전문 핵' },
      { question: '대표 모양은?', rings: '원형 띠', sectors: '부채꼴', nuclei: '군집·모자이크' },
      { question: '핵심 동인은?', rings: '침입·천이', sectors: '접근성·지가', nuclei: '입지 적합·집적·분리' },
    ],
    christaller: '크리스탈러의 중심지이론은 개별 도시 “안”의 토지이용 모양보다 도시와 배후지 사이의 계층·분포를 설명한다. 내부구조 3모형과 분석 단위가 다르다.',
    sources: [
      { label: 'KOCW 지리학 및 실험 2', note: '버제스·호이트·해리스와 울만 도시구조 모형', href: 'https://elearning.kocw.net/contents4/document/lec/2012/KonKuk/ChoiJaeHeon/7.pdf' },
      { label: 'KOCW 입지이론 강의', note: '크리스탈러 중심지이론의 입지이론상 위치', href: 'https://contents.kocw.or.kr/KOCW/document/2015/hankyong/nohyongsik1/6.pdf' },
    ],
  },
  'anti-social-juridical-act': {
    kind: 'public-order-act', summary: '제103조는 단순히 계약 과정이 불쾌하거나 위법한지를 묻지 않는다. 급부 내용·조건·대가 또는 알려진 동기가 사회질서에 반하는지 판별하고, 해당하면 처음부터 절대적으로 무효다.',
    gates: [
      { question: '권리·의무의 내용 자체가 반사회적인가?', result: '제103조 무효 가능', example: '허위진술의 대가 약정' },
      { question: '반사회적 조건·금전 대가가 결부됐는가?', result: '제103조 무효 가능', example: '범죄·부정행위의 보수' },
      { question: '반사회적 동기가 표시·상대방에게 알려졌는가?', result: '제103조 무효 가능', example: '불법 목적을 공유한 계약' },
      { question: '강박·기망 등 성립과정에만 하자가 있는가?', result: '취소 등 별도 제도', example: '내용은 정상인 강박 계약' },
    ],
    doubleSale: ['甲→乙 선매매', '甲의 배임을 丙이 인식', '丙이 권유·협력해 적극 가담', '甲→丙 후매매는 제103조 무효'],
    effects: ['당사자 사이 무효', '선의의 전득자도 보호되지 않음', '법률행위 당시를 기준으로 판단'],
    caution: '이중매매라는 이유만으로 곧바로 무효가 아니다. 제2매수인이 선매매 사실을 아는 것만으로 부족하고, 매도인의 배임행위에 적극 가담해야 한다.',
    sources: [
      { label: '민법 제103조', note: '선량한 풍속 기타 사회질서 위반행위의 무효', href: 'https://www.law.go.kr/법령/민법/제103조' },
      { label: '대법원 2000다71999', note: '허위진술 대가 약정의 반사회성', href: 'https://www.law.go.kr/LSW/precInfoP.do?precSeq=80486' },
      { label: '대법원 2013다49794', note: '이중양도 적극 가담과 제103조', href: 'https://law.go.kr/LSW/precInfoP.do?precSeq=176319' },
    ],
  },
  'land-policy-tools-current-status': {
    kind: 'policy-status', summary: '정책수단은 “현행인가·폐지됐는가”와 “시장에 어떻게 개입하는가”를 분리해야 한다. 현행 여부는 시험 시점의 법령을 다시 확인해야 하는 변동 정보다.', checkedAt: '2026. 7. 13. 기준',
    active: [
      { name: '토지거래허가제', mechanism: '허가구역 내 계약 전 허가', source: '국토계획법' },
      { name: '개발부담금제', mechanism: '개발이익 일부 환수', source: '개발이익환수법' },
      { name: '공공토지비축', mechanism: 'LH 토지은행이 취득·관리·공급', source: '공공토지비축법' },
      { name: '실거래가 신고', mechanism: '계약일부터 법정기한 내 신고', source: '거래신고법' },
      { name: '분양가상한제', mechanism: '적용주택 분양가격 상한', source: '주택법' },
    ],
    abolished: ['택지소유상한제', '택지초과소유부담금', '토지초과이득세'],
    unpublished: ['개발권양도제(TDR): 국내 일반 법정제도로 시행 중이라고 볼 수 없음'],
    priceActors: [
      { price: '표준지공시지가', actor: '국토교통부장관', cycle: '매년 조사·평가하여 공시' },
      { price: '개별공시지가', actor: '시장·군수·구청장', cycle: '표준지 가격을 기준으로 결정·공시' },
    ],
    sources: [
      { label: '국토계획법 제117·122조', note: '토지거래허가구역과 선매', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제117조' },
      { label: '공공토지비축법 제21조', note: '한국토지주택공사의 비축토지 관리', href: 'https://www.law.go.kr/법령/공공토지의비축에관한법률/제21조' },
      { label: '부동산가격공시법 제3·10조', note: '표준지·개별공시지가 공시 주체', href: 'https://www.law.go.kr/법령/부동산가격공시에관한법률/제10조' },
    ],
  },
  'business-suspension-and-closure': {
    kind: 'broker-pause', summary: '휴업·폐업 문제는 기간 문턱과 서류의 이동을 함께 본다. 3개월 초과 휴업부터 사전신고, 휴업은 원칙 6개월 한도이며 부득이한 사유가 있으면 더 길게 가능하다.',
    thresholds: [
      { duration: '3개월 이하 휴업', report: '신고 불필요', tone: 'safe' },
      { duration: '3개월 초과 휴업', report: '미리 신고 + 등록증 첨부', tone: 'warn' },
      { duration: '6개월 초과 휴업', report: '부득이한 사유 필요', tone: 'danger' },
    ],
    exceptions: ['질병 요양', '징집 입영', '취학', '임신·출산', '그 밖의 부득이한 사유'],
    documents: [
      { event: '휴업신고', movement: '등록증 → 등록관청', note: '3개월 초과 휴업' },
      { event: '기간변경', movement: '변경신고서만', note: '등록증 재첨부 X' },
      { event: '재개신고', movement: '등록관청 → 등록증 즉시 반환', note: '업무 재개 전 신고' },
      { event: '폐업신고', movement: '등록증 반납 + 간판 철거', note: '세무서 신고 송부 특례' },
    ],
    sources: [
      { label: '공인중개사법 제21조', note: '휴업·폐업·재개 신고와 휴업기간', href: 'https://www.law.go.kr/법령/공인중개사법/제21조' },
      { label: '시행령 제18조', note: '6개월 초과 휴업의 부득이한 사유', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제18조' },
      { label: '시행규칙 제12조', note: '신고서·등록증 첨부와 반환 절차', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제12조' },
    ],
  },
  'land-alteration-registration': {
    kind: 'land-movement', summary: '토지이동은 새 지번을 만드는 단계, 임야를 토지대장 체계로 옮기는 단계, 여러 필지를 합치는 단계, 오류를 바로잡는 단계로 구분한다.',
    operations: [
      { name: '준공 전 지번부여', trigger: '사업시행자 신청', result: '지적확정측량 지역의 방법 준용' },
      { name: '등록전환', trigger: '임야대장 → 토지대장', result: '측량면적 차이 허용범위 검사' },
      { name: '합병', trigger: '둘 이상 필지 → 한 필지', result: '법정 제한사유 모두 통과' },
      { name: '직권정정', trigger: '표시 오류·토지이동 조사', result: '조사·측량 후 지적공부 정리' },
    ],
    mergerGates: [
      { label: '소유자·지목·지번부여지역 동일', pass: true },
      { label: '서로 연접', pass: true },
      { label: '지적도·임야도 축척 서로 다름', pass: false },
      { label: '등기원인·연월일 또는 접수번호 다름', pass: false },
      { label: '등기 토지와 미등기 토지 혼합', pass: false },
    ],
    correction: '등록전환 측량면적과 임야대장 면적의 차이가 허용범위를 초과하면 임야대장 면적이나 임야도 경계를 직권으로 정정한 뒤 등록전환한다.',
    sources: [
      { label: '공간정보관리법 제78조', note: '등록전환 신청', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제78조' },
      { label: '공간정보관리법 제80조', note: '합병 신청과 제한', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제80조' },
      { label: '시행령 제66조', note: '축척·연접·등기 등 합병 제한사유', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제66조' },
      { label: '공간정보관리법 제84조', note: '등록사항 오류의 직권정정', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제84조' },
    ],
  },
  'acquisition-tax-exemption-procedure': {
    kind: 'tax-gates', summary: '취득세 비과세는 “취득 유형별 문”을 각각 통과해야 한다. 비과세가 아니면 원칙적 신고기한과 등기 선행기한 중 먼저 닥치는 시점을 놓치지 않는다.',
    exemptions: [
      { case: '공동주택 개수', gate: '대수선 제외 + 시가표준액 9억원 이하', result: '비과세' },
      { case: '외국정부·국제기구', gate: '상대국이 대한민국 정부 취득에 과세하지 않음', result: '상호주의 비과세' },
      { case: '국가 등에 귀속·기부채납', gate: '반대급부 없는 귀속', result: '비과세' },
    ],
    counterexamples: ['무상사용권을 반대급부로 받은 부분', '상대국이 대한민국 정부기관 취득에 과세', '주택 개수가 아니라 대수선'],
    timeline: [
      { at: '취득일', action: '납세의무 성립' },
      { at: '원칙 60일 이내', action: '신고·납부' },
      { at: '그 전에 등기한다면', action: '등기 신청서 접수일까지 먼저 신고·납부' },
    ],
    sources: [
      { label: '지방세법 제9조', note: '국가·외국정부·기부채납·공동주택 개수 비과세', href: 'https://www.law.go.kr/법령/지방세법/제9조' },
      { label: '지방세법 제20조', note: '취득세 신고·납부기한과 등기 전 납부', href: 'https://www.law.go.kr/법령/지방세법/제20조' },
      { label: '지방세법 시행령 제12조의2', note: '공동주택 개수 비과세 가액 기준', href: 'https://www.law.go.kr/법령/지방세법시행령/제12조의2' },
    ],
  },
  'housing-association-membership-and-establishment': {
    kind: 'housing-association', summary: '지역주택조합은 모집신고와 설립인가의 토지확보 문턱이 다르다. 설립 때는 사용권원 80%와 조합원 50%·10명 기준을 동시에 통과해야 한다.',
    landStages: [
      { stage: '조합원 모집신고', use: 50, ownership: 15, note: '토지 사용권원 50% 이상 + 소유권 15% 이상' },
      { stage: '조합 설립인가', use: 80, ownership: 15, note: '사용권원 80% 이상 + 소유권 15% 이상' },
      { stage: '사업계획승인', use: 95, ownership: 0, note: '원칙적으로 사용권원 95% 이상' },
    ],
    members: { floor: '예정세대수의 50% 이상', minimum: '최소 10명', refill: '결원으로 50% 미만이 된 범위에서 충원' },
    rules: [
      { item: '공개모집 뒤 미달·결원 충원', rule: '신고 없이 선착순 가능' },
      { item: '조합원 사망', rule: '상속인이 지위 승계 가능' },
      { item: '임원 선임 총회', rule: '조합원 20% 이상 직접 출석' },
      { item: '모집 광고 날짜', rule: '설립인가일 X · 모집신고 수리일 O' },
    ],
    sources: [
      { label: '주택법 제11조', note: '주택조합 설립인가와 토지확보', href: 'https://www.law.go.kr/법령/주택법/제11조' },
      { label: '주택법 제11조의3', note: '조합원 모집신고', href: 'https://www.law.go.kr/법령/주택법/제11조의3' },
      { label: '주택법 시행령 제20·22조', note: '인가요건·조합원 자격과 충원', href: 'https://www.law.go.kr/법령/주택법시행령/제20조' },
      { label: '주택법 시행규칙 제7조', note: '설립인가 신청의 토지확보 서류', href: 'https://www.law.go.kr/법령/주택법시행규칙/제7조' },
    ],
  },
  'agency-basics': {
    kind: 'agency-scope', summary: '대리권은 “무엇을 맡겼는가”를 중심으로 동심원처럼 본다. 명시된 행위, 그 이행에 통상 필요한 부수행위, 별도의 처분결정이 필요한 행위를 차례로 분리한다.',
    rings: [
      { zone: '명시적 수권', examples: ['매매계약 체결', '대출계약 체결'], status: '권한 O' },
      { zone: '통상 부수행위', examples: ['매매대금 수령', '금전채무 변제·상계'], status: '통상 권한 O' },
      { zone: '별도 처분권한', examples: ['계약 해제', '목적 밖 재산처분'], status: '당연 포함 X' },
    ],
    defaults: [
      { rule: '권한을 정하지 않은 대리인', answer: '보존 + 성질을 바꾸지 않는 이용·개량만' },
      { rule: '대리인이 여러 명', answer: '각자대리가 원칙' },
      { rule: '대리인의 사망·성년후견·파산', answer: '대리권 소멸' },
      { rule: '대리인의 한정후견개시', answer: '법정 소멸사유 아님' },
    ],
    scenario: { grant: '甲이 乙에게 토지 매도 권한 수여', receive: '乙이 중도금·잔금 수령', cancel: '乙이 마음대로 계약 해제', verdict: '대금 수령은 통상 포함되나 해제권은 별도 수권이 필요' },
    sources: [
      { label: '민법 제118조', note: '권한을 정하지 않은 대리인의 범위', href: 'https://www.law.go.kr/법령/민법/제118조' },
      { label: '민법 제119조', note: '여러 대리인의 각자대리 원칙', href: 'https://www.law.go.kr/법령/민법/제119조' },
      { label: '민법 제127조', note: '대리권의 법정 소멸사유', href: 'https://www.law.go.kr/법령/민법/제127조' },
      { label: '대법원 91다43107', note: '매매대금 수령권한과 계약 해제권의 구별', href: 'https://www.law.go.kr/LSW/precInfoP.do?evtNo=91다43107' },
    ],
  },
  'npv-irr': {
    kind: 'investment-metrics', summary: '세 지표는 같은 현금흐름을 금액·수익률·비율이라는 서로 다른 자로 잰다. 채택 기준과 상호배타적 투자안의 우선순위를 분리해야 한다.',
    metrics: [
      { name: 'NPV', unit: '금액', formula: '유입 PV − 유출 PV', accept: '> 0', color: 'mint' },
      { name: 'IRR', unit: '수익률 %', formula: 'NPV = 0이 되는 할인율', accept: '> 요구수익률', color: 'blue' },
      { name: 'PI', unit: '비율', formula: '유입 PV ÷ 유출 PV', accept: '> 1', color: 'amber' },
    ],
    equivalence: ['NPV > 0', 'IRR > 요구수익률', 'PI > 1'],
    conflicts: [
      { situation: '독립적 투자안', choice: '각 기준을 통과하면 채택 가능' },
      { situation: '규모가 다른 상호배타안', choice: '기업가치 증가액인 NPV 우선' },
      { situation: '비정상 현금흐름', choice: 'IRR이 여러 개이거나 없을 수 있음' },
    ],
    reinvestment: { npv: 'NPV·PI: 요구수익률로 재투자 가정', irr: 'IRR: 내부수익률로 재투자 가정' },
    sample: { outlay: 100, inflowPv: 118, npv: 18, pi: 1.18, decision: 'NPV 양수·PI 1 초과 → 채택' },
    sources: [
      { label: 'KOCW 재무관리 강의자료', note: 'NPV·IRR 투자안 평가와 상충', href: 'https://www.kocw.net/home/search/kemView.do?kemId=1352485' },
      { label: '한국은행 경제금융용어', note: '현재가치와 할인 개념의 공공 교육자료', href: 'https://www.bok.or.kr/portal/bbs/P0002353/list.do?menuNo=200433' },
    ],
  },
  'definition-of-terms': {
    kind: 'broker-roles', summary: '공인중개사법의 사람 용어는 자격증·개설등록·소속관계·업무범위 네 칸으로 구별한다. “공인중개사”와 “개업공인중개사”는 같은 말이 아니다.',
    roles: [
      { name: '공인중개사', license: '자격 O', registration: '불문', work: '법에 따른 자격 취득자' },
      { name: '개업공인중개사', license: '개설등록 O', registration: '사무소 개설등록', work: '다른 사람 의뢰로 중개업' },
      { name: '소속공인중개사', license: '자격 O', registration: '개업공인중개사에 소속', work: '중개업무 수행 또는 보조' },
      { name: '중개보조원', license: '자격 X', registration: '개업공인중개사에 소속', work: '현장안내·일반서무 등 단순 보조' },
    ],
    corporation: '법인인 개업공인중개사의 사원·임원이 공인중개사이고 중개업무를 수행하면 소속공인중개사에 포함된다.',
    boundary: ['중개보조원: 확인·설명 업무 수행 X', '중개보조원: 거래계약서 작성 X', '소속공인중개사: 자격증 보유 필수'],
    sources: [
      { label: '공인중개사법 제2조', note: '중개·중개업·각 종사자 법정 정의', href: 'https://www.law.go.kr/법령/공인중개사법/제2조' },
      { label: '법제처 20-0275', note: '중개보조원의 확인·설명 업무 수행 불가', href: 'https://www.law.go.kr/DRF/lawService.do?ID=328871&OC=unicpla&mobileYn=Y&target=expc&type=HTML' },
      { label: '공인중개사법 제25조', note: '개업공인중개사의 확인·설명의무', href: 'https://www.law.go.kr/법령/공인중개사법/제25조' },
    ],
  },
  'special-registration-application-cases': {
    kind: 'special-registration', summary: '특수 등기는 한 표에 섞지 말고 대위신청의 주체, 계약서 검인, 말소 이해관계인, 지체 없는 신청이라는 네 서랍으로 나눈다.',
    proxy: { creditor: '甲 대위채권자', debtor: '乙 채무자·등기명의인', action: '甲이 乙을 대위해 신청', notice: '완료사실은 乙에게도 통지', attachment: '대위원인 증명정보 첨부' },
    inspections: [
      { cause: '매매·증여 등 계약', needed: true },
      { cause: '공유물분할합의·양도담보', needed: true },
      { cause: '임의경매', needed: false },
      { cause: '진정명의회복', needed: false },
    ],
    consent: [
      { right: '말소대상보다 후순위 권리자', needed: true, why: '말소로 등기상 손해 가능' },
      { right: '말소대상보다 선순위 권리자', needed: false, why: '말소로 순위상 손해 없음' },
    ],
    promptly: ['공용부분 규약폐지 후 소유권보존', '신탁재산 운용방법 변경의 신탁원부 기록'],
    sources: [
      { label: '부동산등기법 제28조', note: '채권자대위에 의한 등기신청', href: 'https://www.law.go.kr/법령/부동산등기법/제28조' },
      { label: '부동산등기법 제57조', note: '말소 시 이해관계 있는 제3자의 승낙', href: 'https://www.law.go.kr/법령/부동산등기법/제57조' },
      { label: '부동산등기 특별조치법 제3조', note: '소유권이전계약서 등의 검인', href: 'https://www.law.go.kr/법령/부동산등기특별조치법/제3조' },
      { label: '부동산등기규칙 제50조', note: '대위신청 정보와 표시', href: 'https://www.law.go.kr/법령/부동산등기규칙/제50조' },
    ],
  },
  'registration-tax-exemption-and-filing': {
    kind: 'registration-tax', summary: '등록면허세는 취득 자체가 아니라 등기·등록 행위에 붙는다. 비과세 주체를 먼저 확인하고, 등록 전 신고·납부 관문을 통과한다.',
    gate: [
      { question: '국가·지방자치단체 등이 자기를 위해 받는 등록인가?', answer: '비과세' },
      { question: '그 밖의 과세대상 등록인가?', answer: '등록 전 신고·납부' },
      { question: '신고서는 빠졌지만 등록 전 산출세액을 냈는가?', answer: '신고·납부한 것으로 의제' },
    ],
    timeline: ['과세대상 등록 확정', '과세표준·세율 적용', '등록 전 신고·납부', '등기·등록 접수'],
    fixedTax: '채권금액으로 과세표준을 정할 수 없는 등 법정 경우에는 채권금액이 없는 것으로 보아 정액세율 적용 여부를 판단한다.',
    sources: [
      { label: '지방세법 제26조', note: '국가·지방자치단체 등의 등록 비과세', href: 'https://www.law.go.kr/법령/지방세법/제26조' },
      { label: '지방세법 제28조', note: '등록 유형별 과세표준과 세율', href: 'https://www.law.go.kr/법령/지방세법/제28조' },
      { label: '지방세법 제30조', note: '등록 전 신고납부와 납부 시 신고의제', href: 'https://www.law.go.kr/법령/지방세법/제30조' },
    ],
  },
  'housing-project-plan-approval': {
    kind: 'housing-project', summary: '주택건설사업계획은 승인 검토 60일, 승인 후 착공 5년, 공구분할 600세대라는 숫자를 사건별 시간축에 고정한다.',
    milestones: [
      { number: '60일', event: '승인 여부 통보', base: '신청받은 날부터·정당한 사유 없을 때' },
      { number: '5년', event: '공사 착수', base: '사업계획승인일부터 원칙' },
      { number: '600세대', event: '공구별 분할 가능', base: '전체 세대수 기준' },
    ],
    extension: { cause: '승인 조건 이행 지연 등 정당한 사유', period: '사유가 없어진 날부터 3년 범위', denied: '대지소유권을 소송 외 방법으로 스스로 해결하느라 지연된 경우는 제외' },
    projectFlow: ['사업계획 신청', '관계기관 협의·검토', '60일 내 승인 여부 통보', '승인조건 이행', '5년 내 착공'],
    lightChanges: ['건축물 배치의 경미한 조정', '법정 범위의 총사업비 증감', '그 밖의 시행규칙상 경미한 사항'],
    sources: [
      { label: '주택법 제15조', note: '사업계획승인 대상과 승인절차', href: 'https://www.law.go.kr/법령/주택법/제15조' },
      { label: '주택법 제16조', note: '사업계획승인 후 착공과 연장', href: 'https://www.law.go.kr/법령/주택법/제16조' },
      { label: '주택법 시행령 제30조', note: '공구별 분할 건설·공급 기준', href: 'https://www.law.go.kr/법령/주택법시행령/제30조' },
      { label: '주택법 시행규칙 제13조', note: '경미한 변경사항', href: 'https://www.law.go.kr/법령/주택법시행규칙/제13조' },
    ],
  },
  'void-and-rescission-effect': {
    kind: 'void-effects', summary: '무효 뒤의 처리는 하나가 아니다. 원래 행위를 새로 되살리는 추인, 다른 행위로 살리는 전환, 무권리자 처분을 권리자가 받아들이는 추인을 구분해야 효력 시점을 맞힐 수 있다.',
    paths: [
      { name: '일반 무효행위의 추인', condition: '무효임을 알고 추인', effect: '새로운 법률행위', time: '추인 시부터 장래효' },
      { name: '무효행위의 전환', condition: '다른 행위 요건 + 가정적 의사', effect: '다른 법률행위로 유효', time: '전환된 행위의 법리에 따름' },
      { name: '무권리자 처분의 추인', condition: '권리자가 사후 승인', effect: '처분효과가 권리자에게 귀속', time: '원칙적으로 계약 때로 소급' },
    ],
    conversionTest: ['원래 행위는 무효인가?', '다른 법률행위의 요건을 갖췄나?', '무효를 알았다면 그 다른 행위를 원했을까?'],
    invalid: ['강행법규 위반 상태가 그대로인 추인', '무효임을 모르고 한 단순 승인'],
    sample: { before: '무효 가등기', event: '당사자가 유효한 등기로 전용 합의', after: '합의 시부터 효력 · 최초 등기시로 소급 X' },
    sources: [
      { label: '민법 제138조', note: '무효행위의 전환 요건', href: 'https://www.law.go.kr/법령/민법/제138조' },
      { label: '민법 제139조', note: '무효행위 추인과 새로운 법률행위', href: 'https://www.law.go.kr/법령/민법/제139조' },
      { label: '대법원 2001다44291', note: '무권리자 처분 추인의 소급효', href: 'https://www.law.go.kr/LSW/precInfoP.do?evtNo=2001다44291' },
    ],
  },
  'supply-elasticity-price-change': {
    kind: 'elasticity-market', summary: '수요 증가량이 같아도 공급곡선의 기울기에 따라 가격과 거래량의 몫이 달라진다. 비탄력적 공급은 가격이, 탄력적 공급은 거래량이 더 크게 움직인다.',
    curves: [
      { type: '비탄력적 공급', price: 80, quantity: 25, cue: '가격 큰 폭 ↑ · 수량 작은 폭 ↑' },
      { type: '탄력적 공급', price: 30, quantity: 75, cue: '가격 작은 폭 ↑ · 수량 큰 폭 ↑' },
      { type: '완전비탄력적 공급', price: 100, quantity: 0, cue: '수량 고정 · 가격만 변동' },
    ],
    movement: [
      { cause: '재화 자체 가격 변화', result: '같은 곡선 위 수요량·공급량 변화' },
      { cause: '소득·선호·원가 등 비가격요인', result: '수요·공급곡선 자체 이동' },
      { cause: '개별 수요의 시장 합계', result: '같은 가격에서 수평 합' },
    ],
    horizons: { short: '단기: 생산요소 조정 제약 → 상대적으로 비탄력적', long: '장기: 신규공급·용도전환 가능 → 상대적으로 탄력적' },
    tax: '세금의 초과부담은 수요·공급이 더 탄력적일수록 거래량 감소가 커져 일반적으로 확대된다.',
    sources: [
      { label: 'KOCW 미시경제학 강의', note: '수요·공급 탄력성과 조세 귀착·사중손실', href: 'https://www.kocw.net/home/search/kemView.do?kemId=1201081' },
      { label: '한국은행 경제교육', note: '수요·공급과 시장가격의 기초', href: 'https://www.bok.or.kr/portal/main/contents.do?menuNo=200429' },
    ],
  },
  'prohibited-conduct': {
    kind: 'prohibited-conduct', summary: '금지행위는 “중개업 질서를 누가 어떻게 왜곡했는가”로 묶는다. 모든 대리행위가 금지되는 것이 아니라 직접거래·쌍방대리 등 법이 열거한 행위가 금지된다.',
    groups: [
      { title: '지위·명의 남용', items: ['중개대상물 매매를 업으로 함', '무등록업자임을 알면서 의뢰·명의 제공'] },
      { title: '보수·판단 왜곡', items: ['법정 보수·실비 초과 수령', '중요사항 거짓말로 판단을 그르침'] },
      { title: '이해충돌', items: ['중개의뢰인과 직접 거래', '거래당사자 쌍방 대리'] },
      { title: '시장질서 훼손', items: ['금지된 증서 거래 중개', '탈세·전매제한 위반 투기 조장', '허위완료로 시세 영향', '공동중개 제한'] },
    ],
    notAlways: [
      { act: '중개의뢰인 한쪽을 대리해 임대', verdict: '그 자체만으로 제33조 금지행위 아님' },
      { act: '거래당사자 양쪽을 동시에 대리', verdict: '금지' },
      { act: '자기 명의·상호를 타인이 사용', verdict: '제19조 위반 + 등록취소 사유' },
    ],
    sources: [
      { label: '공인중개사법 제33조', note: '개업공인중개사등의 열거된 금지행위', href: 'https://www.law.go.kr/법령/공인중개사법/제33조' },
      { label: '공인중개사법 제19조', note: '성명·상호 사용과 등록증 양도·대여 금지', href: 'https://www.law.go.kr/법령/공인중개사법/제19조' },
      { label: '대법원 2019도14623', note: '분양권과 중개대상물·금지행위 판단', href: 'https://law.go.kr/precInfoP.do?precSeq=214455' },
    ],
  },
  'usufructuary-right-registration': {
    kind: 'usufruct-registry', summary: '용익권 등기는 권리마다 “무엇을 쓰는 권리인지”가 다르므로 목적·범위·대가·기간 칸을 따로 채운다. 토지 일부라면 위치를 도면으로 특정해야 한다.',
    rights: [
      { name: '지상권', essentials: ['설정 목적', '범위', '존속기간 약정'], money: '지료 약정 시 기록' },
      { name: '지역권', essentials: ['요역지 표시', '목적', '범위'], money: '승역지 등기기록에 설정' },
      { name: '전세권', essentials: ['전세금', '범위', '존속기간 약정'], money: '전세금 필수' },
      { name: '임차권', essentials: ['차임', '범위', '존속기간 약정'], money: '보증금 있으면 함께 기록' },
    ],
    partialLand: { whole: '한 필지 전부', part: '토지 일부', attachment: '일부를 표시한 지적도 첨부' },
    servantDominant: { dominant: '요역지: 편익을 받는 토지', servant: '승역지: 부담을 지는 토지', record: '지역권설정등기는 승역지 을구' },
    sources: [
      { label: '부동산등기법 제69조', note: '지상권 등기사항', href: 'https://www.law.go.kr/법령/부동산등기법/제69조' },
      { label: '부동산등기법 제70조', note: '지역권 등기사항과 요역지 기록', href: 'https://www.law.go.kr/법령/부동산등기법/제70조' },
      { label: '부동산등기법 제72·74조', note: '전세권·임차권의 등기사항', href: 'https://www.law.go.kr/법령/부동산등기법/제74조' },
      { label: '부동산등기규칙 제46조', note: '토지 일부 권리의 도면 첨부', href: 'https://www.law.go.kr/법령/부동산등기규칙/제46조' },
    ],
  },
  'joint-mortgage-and-maximum-mortgage': {
    kind: 'joint-mortgage', summary: '하나의 채권을 여러 부동산이 함께 담보하면 동시배당인지 순차배당인지부터 가른다. 근저당은 채권이 확정된 뒤에야 일반 저당권처럼 현재액을 계산한다.',
    properties: [{ name: 'A 부동산', value: 6, share: 3 }, { name: 'B 부동산', value: 4, share: 2 }],
    distribution: [
      { mode: '동시배당', rule: '각 부동산 경매대가 비례로 채권 부담', after: '후순위권리자의 대위 문제를 줄임' },
      { mode: '순차배당', rule: '먼저 경매된 부동산에서 전액 변제 가능', after: '그 부동산 후순위자는 다른 부동산의 선순위 저당권을 대위' },
    ],
    fixing: ['근저당 설정', '거래 계속', '확정사유 발생', '확정 뒤 새 원본채권은 불포함'],
    cap: '우선변제 범위는 실제 확정채권액과 등기된 채권최고액 중 작은 금액을 넘지 못한다.',
    sources: [
      { label: '민법 제357조', note: '근저당의 채권최고액과 확정 구조', href: 'https://www.law.go.kr/법령/민법/제357조' },
      { label: '민법 제368조', note: '공동저당 동시·순차배당', href: 'https://www.law.go.kr/법령/민법/제368조' },
      { label: '대법원 2017다225619', note: '공동저당 대가 산정과 후순위자 보호', href: 'https://law.go.kr/LSW/precInfoP.do?precSeq=240915' },
    ],
  },
  'elasticity-calculation': {
    kind: 'elasticity-calculation', summary: '탄력성은 결과의 변화율을 원인의 변화율로 나눈 값이다. 숫자보다 먼저 분자·분모와 부호를 정하면 수요·소득·교차탄력성 문제를 같은 방식으로 풀 수 있다.',
    formulas: [
      { name: '가격탄력성', formula: '수요량 변화율 ÷ 가격 변화율', read: '수요는 보통 절댓값으로 크기 비교' },
      { name: '소득탄력성', formula: '수요량 변화율 ÷ 소득 변화율', read: '＋ 정상재 · － 열등재' },
      { name: '교차탄력성', formula: 'X 수요량 변화율 ÷ Y 가격 변화율', read: '부호가 두 재화의 관계를 말함' },
    ],
    signs: [{ sign: '＋', relation: '대체재', meaning: 'Y 가격↑ → X 수요↑' }, { sign: '－', relation: '보완재', meaning: 'Y 가격↑ → X 수요↓' }, { sign: '0', relation: '독립재', meaning: '서로 영향 거의 없음' }],
    example: { input: '아파트 가격 +16% · 다세대 수요 +8%', math: '+8% ÷ +16% = +0.5', answer: '대체재 · 교차탄력성 0.5' },
    totalEffect: ['가격효과', '소득효과', '교차효과', '총 수요량 변화율'],
    sources: [
      { label: 'KOCW 미시경제학', note: '탄력성 공식과 수요·공급 분석', href: 'https://contents.kocw.net/document/Ch%2004%20Consumer%20Theory.pdf' },
      { label: '한국은행 경제교육', note: '수요·공급과 가격의 기초', href: 'https://www.bok.or.kr/portal/main/contents.do?menuNo=200429' },
    ],
  },
  'liability-insurance-guarantee': {
    kind: 'broker-guarantee', summary: '중개의뢰인 피해에 대비한 보증은 업무를 시작하기 전에 먼저 갖춰야 하고, 형태를 바꾸거나 기간을 갱신해도 보증의 공백이 생기면 안 된다.',
    amounts: [
      { type: '법인 개업공인중개사', amount: '4억 원 이상', extra: '분사무소마다 2억 원 이상 추가' },
      { type: '법인 아닌 개업공인중개사', amount: '2억 원 이상', extra: '사무소 단위 기본 보장' },
      { type: '다른 법률상 중개업자', amount: '2천만 원 이상', extra: '업무 개시 전 설정' },
    ],
    startFlow: ['개설등록', '보험·공제 가입 또는 공탁', '증명서류 신고', '업무 시작'],
    maintenance: [
      { event: '보증 변경', action: '기존 보증 유효기간 중 새 보증 설정', deadline: '공백 0일' },
      { event: '기간 만료', action: '만료일까지 다시 설정·신고', deadline: '만료 뒤 갱신 X' },
    ],
    scope: '보증은 개업공인중개사가 중개행위를 하면서 고의 또는 과실로 거래당사자에게 입힌 재산상 손해배상책임을 담보한다.',
    sources: [
      { label: '공인중개사법 제30조', note: '손해배상책임과 보증 설정 의무', href: 'https://www.law.go.kr/법령/공인중개사법/제30조' },
      { label: '시행령 제24조', note: '주체별 보장금액과 업무개시 전 신고', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제24조' },
      { label: '시행령 제25조', note: '변경·갱신 때 보증 공백 방지', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제25조' },
    ],
  },
  'provisional-registration': {
    kind: 'provisional-registration', summary: '가등기는 장래 본등기를 위한 순위 보전 장치다. 가등기 자체가 물권변동을 완성하는 것이 아니라, 본등기가 이루어질 때 그 순위만 가등기 시점으로 올라간다.',
    eligibility: [
      { claim: '물권의 설정·이전·변경·소멸 청구권', allowed: true, note: '등기할 수 있는 권리변동의 청구권' },
      { claim: '정지조건부·장래 확정될 청구권', allowed: true, note: '현재 확정되지 않아도 가능' },
      { claim: '단순 채권·소유권보존등기', allowed: false, note: '가등기 대상이 아님' },
    ],
    application: [
      { mode: '공동신청', route: '가등기권리자 + 가등기의무자', paper: '원칙' },
      { mode: '단독신청', route: '의무자 승낙 또는 법원의 가처분명령', paper: '승낙서·재판서 첨부' },
    ],
    effects: [
      { name: '순위보전 효력', when: '가등기 때', rule: '나중 본등기의 순위를 미리 확보' },
      { name: '물권변동 효력', when: '본등기 때', rule: '가등기 시점으로 소급해 물권취득하는 것은 아님' },
    ],
    sources: [
      { label: '부동산등기법 제88조', note: '가등기할 수 있는 청구권의 범위', href: 'https://www.law.go.kr/법령/부동산등기법/제88조' },
      { label: '부동산등기법 제89조', note: '가등기 신청방법', href: 'https://www.law.go.kr/법령/부동산등기법/제89조' },
      { label: '부동산등기규칙 제146조', note: '본등기 신청과 첨부정보', href: 'https://www.law.go.kr/법령/부동산등기규칙/제146조' },
    ],
  },
  'capital-gain-calculation-cases': {
    kind: 'capital-gain-machine', summary: '양도소득 계산은 먼저 실제 양도차익을 만들고, 실제 취득가액을 확인할 수 없을 때의 환산식과 고가 1세대1주택의 과세대상 안분식을 별도로 적용한다.',
    machines: [
      { name: '실지거래 양도차익', formula: '양도가액 − 취득가액 − 필요경비', when: '실제 거래가액을 확인할 수 있을 때' },
      { name: '환산취득가액', formula: '양도 실지가액 × 취득 기준시가 ÷ 양도 기준시가', when: '실제 취득가액을 확인할 수 없는 법정 경우' },
      { name: '고가주택 과세 양도차익', formula: '전체 양도차익 × (양도가액 − 12억) ÷ 양도가액', when: '1세대1주택 비과세 요건을 갖춘 고가주택' },
    ],
    example: { input: '25억 양도 · 전체 양도차익 5억', math: '5억 × (25억 − 12억) ÷ 25억', answer: '과세대상 양도차익 2.6억' },
    debtGift: '수증자가 인수한 채무액에 상당하는 부분은 증여자에게 대가를 지급한 유상양도로 보아 양도소득세를 계산한다.',
    sources: [
      { label: '소득세법 제97조', note: '양도차익에서 공제하는 취득가액·필요경비', href: 'https://www.law.go.kr/법령/소득세법/제97조' },
      { label: '시행령 제160조', note: '고가주택 양도차익 안분 산식', href: 'https://www.law.go.kr/법령/소득세법시행령/제160조' },
      { label: '시행령 제176조의2', note: '환산취득가액의 추계 산식', href: 'https://www.law.go.kr/법령/소득세법시행령/제176조의2' },
      { label: '소득세법 제88조', note: '부담부증여의 양도 해당 부분', href: 'https://www.law.go.kr/법령/소득세법/제88조' },
    ],
  },
  'maintenance-association-direct-implementation': {
    kind: 'renewal-consent', summary: '정비사업 숫자는 “누구의 동의”와 “어느 면적”인지 함께 읽어야 한다. 재개발 조합설립, 재건축의 별도 동의, 토지등소유자 직접시행은 서로 다른 문을 통과한다.',
    thresholds: [
      { type: '재개발 조합설립', people: '75%', land: '50%', note: '토지등소유자 4분의 3 + 토지면적 2분의 1 이상 토지소유자' },
      { type: '재건축 비주택단지 구역', people: '75%', land: '66.67%', note: '토지·건축물 소유자 4분의 3 + 토지면적 3분의 2 이상' },
    ],
    routes: [
      { title: '토지등소유자 직접시행', condition: '재개발의 토지등소유자가 20인 미만', result: '직접 또는 과반 동의로 공동시행 가능' },
      { title: '시장·군수등 지정개발', condition: '법정 지연·긴급·공공 필요 사유', result: '시장·군수등 또는 토지주택공사등 시행자 지정' },
    ],
    timer: ['조합설립인가', '3년', '사업시행계획인가 신청 없음', '법정 해제·공공개입 판단'],
    sources: [
      { label: '도시정비법 제25조', note: '재개발 시행자와 20인 미만 직접시행', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제25조' },
      { label: '도시정비법 제26조', note: '시장·군수등의 직접·지정 시행', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제26조' },
      { label: '도시정비법 제35조', note: '재개발·재건축 조합설립 동의율', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제35조' },
      { label: '도시정비법 제20조', note: '사업 지연 시 정비구역 해제 기준', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제20조' },
    ],
  },
  'mortgage-effect-scope': {
    kind: 'mortgage-scope', summary: '저당권은 등기된 부동산만 고립해서 보지 않고 경제적 일체를 이루는 부합물·종물까지 붙잡는다. 다만 일괄경매의 처분범위와 우선변제 범위는 반드시 나누어 읽는다.',
    scope: [
      { item: '독립성 없는 증축부분', included: true, reason: '기존 건물에 부합' },
      { item: '저당부동산의 종물', included: true, reason: '민법 제358조의 명문' },
      { item: '압류 뒤 발생한 차임채권', included: true, reason: '저당권 효력이 과실에 미침' },
      { item: '토지 저당 뒤 신축한 독립 건물', included: false, reason: '일괄경매 가능하나 담보가치에는 불포함' },
    ],
    auction: { bundle: '토지 + 신축 건물 함께 경매 가능', priority: '토지 매각대금에서만 우선변제' },
    rentFlow: ['저당부동산 압류', '압류 사실 통지', '그 뒤 발생한 차임', '저당권 효력 범위'],
    sources: [
      { label: '민법 제358조', note: '부합물·종물에 대한 저당권 효력', href: 'https://www.law.go.kr/법령/민법/제358조' },
      { label: '민법 제359조', note: '압류 후 과실에 대한 효력', href: 'https://www.law.go.kr/법령/민법/제359조' },
      { label: '민법 제365조', note: '저당지상 건물 일괄경매와 우선변제 범위', href: 'https://www.law.go.kr/법령/민법/제365조' },
    ],
  },
  'ratio-analysis-calculation': {
    kind: 'ratio-workbench', summary: '비율분석은 이름을 외우는 문제가 아니라 분자와 분모를 정확히 연결하는 작업이다. 총투자액·지분투자액, 유효총소득·순영업소득·현금흐름을 각각 제자리에 넣는다.',
    metrics: [
      { name: '총소득승수', numerator: '총투자액', denominator: '유효총소득', read: '낮을수록 회수 빠름' },
      { name: '순소득승수', numerator: '총투자액', denominator: '순영업소득', read: '자본환원율의 역수' },
      { name: '세전현금흐름승수', numerator: '지분투자액', denominator: '세전현금흐름', read: '지분 회수 배수' },
      { name: '부채감당률 DCR', numerator: '순영업소득', denominator: '부채서비스액', read: '1보다 클수록 상환여력' },
    ],
    example: { input: 'NOI 1.2억 · 부채서비스액 0.8억', math: '1.2 ÷ 0.8', answer: 'DCR 1.5' },
    defaultRate: '(영업경비 + 부채서비스액) ÷ 유효총소득',
    sources: [
      { label: 'KOCW 부동산학개론', note: '부동산투자 분석과 비율지표 강의자료', href: 'https://www.kocw.net/home/search/kemView.do?kemId=1201081' },
      { label: '한국은행 경제교육', note: '투자·금융 의사결정의 기초', href: 'https://www.bok.or.kr/portal/main/contents.do?menuNo=200429' },
    ],
  },
  'explanation-form-item-comparison': {
    kind: 'explanation-matrix', summary: '확인·설명서는 대상물에 따라 Ⅰ~Ⅳ 네 서식으로 갈린다. 공통 권리사항과 주거·토지에만 있는 생활환경 항목을 행과 열로 교차시키면 서식 함정을 빠르게 찾을 수 있다.',
    forms: [{ code: 'Ⅰ', name: '주거용 건축물' }, { code: 'Ⅱ', name: '비주거용 건축물' }, { code: 'Ⅲ', name: '토지' }, { code: 'Ⅳ', name: '입목·재단' }],
    items: [
      { item: '등기부 권리관계·거래예정금액', present: [true, true, true, true] },
      { item: '실제 권리관계·미공시 권리', present: [true, true, true, true] },
      { item: '비선호시설', present: [true, false, true, false] },
      { item: '일조·소음 등 환경조건', present: [true, false, true, false] },
      { item: '입지조건 중 교육시설', present: [true, false, false, false] },
    ],
    boundary: '주거용 서식의 내진설계 적용 여부는 개업공인중개사가 확인하는 기본 확인사항이고, 단독경보형감지기 설치 여부는 의뢰인 자료로 확인하는 세부 확인사항이다.',
    sources: [
      { label: '공인중개사법 제25조', note: '확인·설명의무와 근거자료 제시', href: 'https://www.law.go.kr/법령/공인중개사법/제25조' },
      { label: '시행령 제21조', note: '법정 확인·설명 항목', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제21조' },
      { label: '시행규칙 제16조', note: 'Ⅰ~Ⅳ 서식과 별지 제20호 계열', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제16조' },
      { label: '법제처 19-0434', note: '비선호시설 확인·설명 범위 해석', href: 'https://law.go.kr/LSW/expcInfoP.do?expcSeq=329279' },
    ],
  },
  'registration-applicant-capacity': {
    kind: 'registration-applicants', summary: '등기의 진정성을 위해 공동신청이 원칙이지만, 상대방이 없거나 판결·법률로 진정성이 따로 담보되는 경우에는 단독신청의 문이 열린다.',
    principle: '법률에 다른 규정이 없으면 공동신청',
    solo: [
      { case: '판결에 의한 등기', applicant: '승소한 등기권리자 또는 의무자', why: '확정판결이 상대방 협력을 대신' },
      { case: '상속에 의한 등기', applicant: '등기권리자', why: '포괄승계로 상대방 없음' },
      { case: '수용에 의한 소유권이전', applicant: '사업시행자', why: '법률상 단독신청' },
      { case: '가등기명의인의 가등기말소', applicant: '가등기명의인', why: '자기 명의 권리의 말소' },
    ],
    jointStill: ['근저당 채권최고액 감액 변경', '매매에 따른 소유권이전', '저당권 설정'],
    sources: [
      { label: '부동산등기법 제23조', note: '공동신청 원칙과 단독신청 예외', href: 'https://www.law.go.kr/법령/부동산등기법/제23조' },
      { label: '부동산등기법 제99조', note: '수용에 따른 단독신청', href: 'https://www.law.go.kr/법령/부동산등기법/제99조' },
      { label: '부동산등기법 제93조', note: '가등기 말소의 단독신청', href: 'https://www.law.go.kr/법령/부동산등기법/제93조' },
    ],
  },
  'capital-gain-relief-and-carryover': {
    kind: 'tax-relief-clock', summary: '양도세 특례는 사유별로 별도 시계가 돈다. 현행 혼인·동거봉양 특례는 모두 10년이지만 연령요건과 신고기한, 이월과세 배제·손익통산은 서로 다른 규칙이다.',
    clocks: [
      { name: '혼인 합가', period: '10년', condition: '각각 1주택인 사람이 혼인', action: '먼저 양도하는 주택에 특례' },
      { name: '동거봉양 합가', period: '10년', condition: '60세 이상 직계존속 봉양', action: '먼저 양도하는 주택에 특례' },
      { name: '부담부증여 양도분', period: '3개월', condition: '수증자가 인수한 채무 상당액', action: '양도월 말일부터 예정신고' },
    ],
    switches: [
      { title: '이월과세 배제', rule: '사업인정고시일부터 소급 2년 이전 증여자산이 수용되는 법정 경우' },
      { title: '양도차손 통산', rule: '같은 과세기간의 같은 소득종류 안에서 법정 순서로 통산' },
      { title: '일반 무신고 가산세', rule: '부정행위가 아닌 일반 무신고는 무신고납부세액의 20%' },
    ],
    currentNote: '혼인특례 5년은 개정 전 기준이다. 2024년 11월 이후 현행 소득세법 시행령 제155조는 10년을 적용한다.',
    sources: [
      { label: '소득세법 시행령 제155조', note: '혼인·동거봉양 1세대1주택 특례', href: 'https://www.law.go.kr/법령/소득세법시행령/제155조' },
      { label: '소득세법 제97조의2', note: '배우자 등 증여자산 이월과세', href: 'https://www.law.go.kr/법령/소득세법/제97조의2' },
      { label: '소득세법 제105조', note: '부담부증여 양도분 예정신고기한', href: 'https://www.law.go.kr/법령/소득세법/제105조' },
      { label: '국세청 양도세 안내', note: '현행 혼인특례 10년 적용 안내', href: 'https://www.nts.go.kr/webtv/na/ntt/selectNttList.do?bbsId=30148&mi=&nttSn=1346903' },
    ],
  },
  'urban-management-plan-decision-authority': {
    kind: 'plan-authority', summary: '도시·군관리계획은 국가적·광역적 사안인지 지역계획인지에 따라 결정권자가 달라진다. 결정 뒤 효력은 단순 결정고시가 아니라 지형도면을 고시한 날부터 발생한다.',
    authorities: [
      { actor: '국토교통부장관', matters: ['개발제한구역 지정', '국가계획 연계 시가화조정구역', '장관이 입안한 둘 이상 시·도 광역사항'] },
      { actor: '시·도지사 또는 대도시 시장', matters: ['도시자연공원구역', '지역 차원의 도시·군관리계획', '관할 구역 계획의 원칙적 결정'] },
      { actor: '시장·군수', matters: ['법이 맡긴 지구단위계획구역·계획', '시·군 관할의 위임된 결정'] },
    ],
    effect: '고시한 바로 그날 효력 발생',
    startedWork: [
      { zone: '일반 도시·군관리계획', rule: '결정 당시 적법하게 착수', action: '원칙적으로 계속 시행' },
      { zone: '시가화조정·수산자원보호구역', rule: '이미 허가받아 착수', action: '시장·군수등에게 신고 후 계속' },
    ],
    sources: [
      { label: '국토계획법 제30조', note: '결정권자·협의·심의와 고시', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제30조' },
      { label: '국토계획법 제31조', note: '지형도면 고시일의 효력과 착수사업', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제31조' },
      { label: '국토계획법 시행령 제25조', note: '중요한 계획과 공동위원회 기준', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제25조' },
    ],
  },
  'risk-allocation': {
    kind: 'risk-allocation', summary: '후발적 이행불능에서는 먼저 누구의 책임인지 찾는다. 쌍방 무과실이면 급부를 못 하게 된 채무자가 대가 위험을 지고, 채권자 책임이면 오히려 채무자가 반대급부를 청구할 수 있다.',
    cases: [
      { cause: '쌍방 책임 없음', article: '민법 제537조', price: '채무자: 상대방 대가 청구 X', followup: '받은 대가는 반환' },
      { cause: '채권자 책임', article: '민법 제538조', price: '채무자: 상대방 대가 청구 O', followup: '채무 면제로 얻은 이익은 상환' },
      { cause: '채무자 책임', article: '채무불이행', price: '손해배상·해제 문제', followup: '위험부담 규정의 중심사례 아님' },
    ],
    lightning: ['건물 매매계약', '낙뢰로 전소', '매도·매수인 모두 무과실', '매도인은 잔대금 청구 못 함'],
    refund: '제537조로 반대급부청구권이 소멸한 뒤 이미 받은 계약금·대금이 있다면 법률상 원인이 없어져 반환해야 한다.',
    sources: [
      { label: '민법 제537조', note: '쌍방 무과실의 채무자위험부담', href: 'https://www.law.go.kr/법령/민법/제537조' },
      { label: '민법 제538조', note: '채권자 귀책·수령지체 중 이행불능', href: 'https://www.law.go.kr/법령/민법/제538조' },
      { label: '대법원 2019다293036', note: '귀책사유에 따른 위험부담 법리 구분', href: 'https://law.go.kr/LSW/precInfoP.do?precSeq=216711' },
    ],
  },
  'market-equilibrium-shift': {
    kind: 'equilibrium-solver', summary: '균형점은 수요량과 공급량이 같아지는 가격이다. 곡선이 이동하면 바뀐 식만 교체해 다시 연립하고, 새 가격을 어느 한 식에 대입해 거래량을 검산한다.',
    before: { demand: 'Qd = 100 − 2P', supply: 'Qs = 20 + 2P', price: 20, quantity: 60 },
    after: { demand: 'Qd′ = 120 − 2P', price: 25, quantity: 70 },
    steps: ['이동한 곡선의 절편·기울기 확인', '새 Qd와 Qs를 같게 놓기', '가격 P 계산', 'P를 양쪽 식에 대입해 Q 일치 검산'],
    sources: [
      { label: 'KOCW 부동산학개론', note: '수요·공급함수와 시장균형 계산', href: 'https://contents.kocw.net/KOCW/document/2014/shinhan/kimseungwook/6.pdf' },
      { label: '한국은행 경제교육', note: '수요·공급과 균형가격의 원리', href: 'https://www.bok.or.kr/portal/main/contents.do?menuNo=200429' },
    ],
  },
  'agency-contract-comparison': {
    kind: 'agency-contracts', summary: '일반중개계약은 여러 중개사에게 열려 있는 의뢰이고, 전속중개계약은 한 중개사에게 맡기는 대신 서식·정보공개·통지·보존의무가 결합된 계약이다.',
    rows: [
      { axis: '중개의뢰', general: '여러 개업공인중개사 가능', exclusive: '특정 1명에게 전속' },
      { axis: '계약서', general: '요청 시 일반중개계약서 작성', exclusive: '법정 별지 제15호서식' },
      { axis: '정보공개', general: '법정 공개의무 없음', exclusive: '원칙 7일 이내 공개·지체 없이 통지' },
      { axis: '보존', general: '법정 3년 보존의무 없음', exclusive: '계약서 3년 보존' },
      { axis: '기본 유효기간', general: '당사자 약정', exclusive: '다른 약정 없으면 3개월' },
    ],
    example: '당사자가 유효기간을 2개월로 명시했다면 “다른 약정”이므로 2개월이 적용된다. 자동으로 3개월이 되지 않는다.',
    sources: [
      { label: '공인중개사법 제22조', note: '일반중개계약과 서면 작성 요청', href: 'https://www.law.go.kr/법령/공인중개사법/제22조' },
      { label: '공인중개사법 제23조', note: '전속중개계약·정보공개·계약서 보존', href: 'https://www.law.go.kr/법령/공인중개사법/제23조' },
      { label: '시행령 제20조', note: '전속계약 기본 3개월과 다른 약정', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제20조' },
      { label: '시행규칙 제14조', note: '별지 제15호서식과 3년 보존', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제14조' },
    ],
  },
  'application-and-attachment-info': {
    kind: 'application-packets', summary: '신청정보는 등기관에게 “무엇을 어떻게 등기해 달라”는 본문이고, 첨부정보는 원인·동의·자격·대리권 등 그 신청이 진실하다는 증빙이다.',
    application: ['토지 소재·지번·지목·면적', '신청인 성명·주소·등록번호', '등기원인과 연월일', '등기목적·등기소·신청일', '공동신청 때 등기의무자 등기필정보'],
    attachments: ['등기원인증명정보', '제3자 허가·동의·승낙', '법인 대표자 자격정보', '대리권 증명정보', '새 등기명의인의 주소·등록번호 증명'],
    notRequired: ['토지의 표시번호', '대리인의 주민등록번호', '법인 대표자의 주민등록번호'],
    deedInfo: '등기필정보는 “등기권리자의 것”을 붙이는 자료가 아니다. 공동신청 등 권리등기에서 처분하는 등기의무자의 등기필정보를 신청정보로 제공한다.',
    sources: [
      { label: '부동산등기규칙 제43조', note: '신청정보의 필수 내용', href: 'https://www.law.go.kr/법령/부동산등기규칙/제43조' },
      { label: '부동산등기규칙 제46조', note: '원인·동의·자격 등 첨부정보', href: 'https://www.law.go.kr/법령/부동산등기규칙/제46조' },
      { label: '부동산등기법 제34조', note: '토지 등기기록의 표시사항', href: 'https://www.law.go.kr/법령/부동산등기법/제34조' },
    ],
  },
  'property-tax-object-classification': {
    kind: 'property-tax-sort', summary: '재산세 계산은 물건을 먼저 토지·건축물·주택의 그릇에 넣는 데서 시작한다. 토지만 세 가지 합산유형으로 다시 나뉘고, 주택은 별도 과세체계를 사용한다.',
    buckets: [
      { name: '토지', items: ['종합합산', '별도합산', '분리과세'] },
      { name: '건축물', items: ['주택은 제외', '시설물 등 법정 범위'] },
      { name: '주택', items: ['건물 + 부속토지', '토지 합산유형과 별도'] },
    ],
    mixed: { housing: 50, nonHousing: 50, result: '주거용 50% 이상 → 건물 전체를 주택으로 판정' },
    landRule: '주택 부속토지의 경계가 명백하지 않으면 주택 바닥면적의 10배에 해당하는 토지를 부속토지로 본다.',
    sources: [
      { label: '지방세법 제104조', note: '재산세에서 토지·건축물·주택의 정의', href: 'https://www.law.go.kr/법령/지방세법/제104조' },
      { label: '지방세법 제106조', note: '토지 합산구분과 겸용주택 50% 기준', href: 'https://www.law.go.kr/법령/지방세법/제106조' },
      { label: '지방세법 시행령 제119조', note: '공부와 다른 경우 사실상 현황 과세', href: 'https://www.law.go.kr/법령/지방세법시행령/제119조' },
      { label: '대법원 2022두30756', note: '겸용건물의 사실상 주거용 판단', href: 'https://www.law.go.kr/LSW/precInfoP.do?precSeq=424000' },
    ],
  },
  'urban-planning-facility-decision-expiry': {
    kind: 'facility-expiry', summary: '장기미집행 시설은 10년째 매수청구의 문이 열리고 20년째 결정 자체가 실효된다. 두 시계의 대상·효과·후속기간을 분리해야 한다.',
    clocks: [
      { years: '10년', title: '매수청구 가능', effect: '지목이 대인 토지의 소유자' },
      { years: '20년', title: '시설결정 실효', effect: '20년이 되는 날의 다음 날' },
    ],
    purchaseFlow: [
      { at: '청구', action: '토지소유자가 매수청구' },
      { at: '6개월', action: '매수 여부 결정·통지' },
      { at: '통지 뒤 2년', action: '매수하기로 한 토지 매수' },
    ],
    nonPurchase: [
      { title: '매수하지 않기로 결정', rule: '개발행위허가를 받아 법정 건축 가능', note: '3층 이하 단독주택·제1·2종 근린생활시설 등' },
      { title: '도시·군계획시설채권', rule: '법정 사유에서 매수대금 지급수단', note: '상환기간 10년 이내' },
    ],
    sources: [
      { label: '국토계획법 제47조', note: '10년 매수청구·6개월 결정·2년 매수', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제47조' },
      { label: '국토계획법 제48조', note: '20년 장기미집행 결정의 다음 날 실효', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제48조' },
      { label: '국토계획법 시행령 제41조', note: '매수하지 않는 토지의 건축 범위', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제41조' },
      { label: '법제처 06-0013', note: '소유기간과 무관한 매수청구 요건', href: 'https://www.law.go.kr/DRF/lawService.do?ID=313114&OC=unicpla&mobileYn=Y&target=expc&type=HTML' },
    ],
  },
  'sub-agency': {
    kind: 'sub-agency', summary: '복대리인은 원대리인의 보조자가 아니라 본인의 대리인이다. 임의대리와 법정대리는 복대리인을 세울 수 있는 문턱과 원대리인의 책임 범위가 다르다.',
    types: [
      { type: '임의대리인', power: '본인 승낙 또는 부득이한 사유가 있을 때만 복임', liability: '원칙적으로 선임·감독 책임' },
      { type: '법정대리인', power: '자기 책임으로 언제든 복임 가능', liability: '원칙적으로 복대리인의 행위 전반에 책임' },
    ],
    voluntaryConditions: ['본인의 승낙', '부득이한 사유'],
    endRule: '복대리권은 원대리권에 의존한다. 원대리권이 소멸하면 특별한 사정이 없는 한 복대리권도 함께 소멸한다.',
    sources: [
      { label: '민법 제120조', note: '임의대리인의 제한된 복임권', href: 'https://www.law.go.kr/법령/민법/제120조' },
      { label: '민법 제121조', note: '임의대리인의 선임·감독 책임', href: 'https://www.law.go.kr/법령/민법/제121조' },
      { label: '민법 제122조', note: '법정대리인의 복임권과 책임', href: 'https://www.law.go.kr/법령/민법/제122조' },
      { label: '민법 제123조', note: '복대리인의 본인에 대한 권한·의무', href: 'https://www.law.go.kr/법령/민법/제123조' },
    ],
  },
  'amortization-schedule-calculation': {
    kind: 'amortization-ledger', summary: '원리금균등상환은 매회 납입액이 같아도 내부 구성은 바뀐다. 매 회차 시작 잔액에 이율을 곱해 이자를 먼저 구하고, 납입액에서 이자를 빼 원금을 계산한다.',
    formulas: [
      { name: '이번 회차 이자', formula: '기초 대출잔액 × 회차 이자율' },
      { name: '이번 회차 원금', formula: '고정 원리금 − 이번 회차 이자' },
      { name: '다음 회차 잔액', formula: '기초 잔액 − 이번 회차 원금' },
    ],
    rows: [
      { round: 1, open: '1,000.0', interest: '10.0', principal: '190.0', close: '810.0' },
      { round: 2, open: '810.0', interest: '8.1', principal: '191.9', close: '618.1' },
      { round: 3, open: '618.1', interest: '6.2', principal: '193.8', close: '424.3' },
    ],
    caution: '예제는 회차 이율 1%, 고정 원리금 200의 단순 구조다. 이자는 최초 원금 1,000이 아니라 매 회차 기초잔액에 다시 곱한다.',
    sources: [
      { label: '한국은행 경제교육', note: '이자·대출과 금융계산의 기초', href: 'https://www.bok.or.kr/portal/main/contents.do?menuNo=200429' },
      { label: 'KOCW 부동산금융론', note: '저당대출 상환방식과 잔액 계산', href: 'https://www.kocw.net/home/search/kemView.do?kemId=1201081' },
    ],
  },
  'foreigner-acquisition-report': {
    kind: 'foreigner-report', summary: '외국인등의 부동산 취득은 원인에 따라 거래신고로 끝나는 경우, 별도 취득신고가 필요한 경우, 계약 전에 허가를 받아야 하는 경우로 나뉜다.',
    routes: [
      { cause: '거래신고 대상 매매계약', report: '거래신고', deadline: '계약일부터 30일', note: '거래신고를 하면 별도 외국인 취득신고는 중복하지 않음' },
      { cause: '상속·경매·확정판결 등', report: '외국인 취득신고', deadline: '취득일부터 6개월', note: '계약 외 원인' },
      { cause: '내국인이 외국인등으로 변경', report: '계속보유신고', deadline: '변경일부터 6개월', note: '이미 가진 부동산을 계속 보유' },
      { cause: '거래신고 대상 아닌 취득계약', report: '외국인 취득신고', deadline: '계약일부터 60일', note: '제8조제1항' },
    ],
    permitZones: ['군사기지·군사시설 보호구역', '문화유산 보호구역', '생태·경관보전지역', '야생생물 특별보호구역'],
    permissionEffect: '허가대상 토지의 취득계약은 계약 체결 전에 허가를 받아야 하며, 허가 없이 체결한 계약은 효력이 발생하지 않는다.',
    sources: [
      { label: '부동산거래신고법 제2조', note: '외국인등의 법정 범위', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제2조' },
      { label: '부동산거래신고법 제8조', note: '취득·계속보유 신고와 기한', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제8조' },
      { label: '부동산거래신고법 제9조', note: '외국인 토지취득 허가구역과 무효', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제9조' },
      { label: '시행규칙 별지 제6호', note: '취득·계속보유·허가 신청 통합서식', href: 'https://www.law.go.kr/법령별표서식/(부동산거래신고등에관한법률시행규칙,별지서식6호)' },
    ],
  },
  'lot-numbering-and-registration-basics': {
    kind: 'lot-system', summary: '지번은 토지를 찾아가는 주소이고 축척은 그 토지를 그리는 배율이다. 바다로 변해 회복할 수 없는 토지는 통지·60일·직권말소 순서로 지적공부에서 정리한다.',
    numbering: { land: '123-4', forest: '산 123-4' },
    scales: { land: [500, 600, 1000, 1200, 2400, 3000, 6000], forest: [3000, 6000] },
    seaFlow: ['원상회복 불가능한 바다', '소유자에게 말소신청 통지', '통지일부터 60일', '미신청 시 지적소관청 직권말소'],
    sources: [
      { label: '공간정보관리법 제66조', note: '지번 부여의 원칙과 지적소관청', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제66조' },
      { label: '공간정보관리법 제82조', note: '바다가 된 토지의 등록말소', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제82조' },
      { label: '시행령 제56조', note: '지번 부여·변경의 세부 방법', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제56조' },
      { label: '시행규칙 제69조', note: '바다로 된 토지의 조사·통지 절차', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제69조' },
    ],
  },
  'tax-liability-establishment-date': {
    kind: 'tax-liability-time', summary: '납세의무 성립은 세금이 법률상 생기는 순간이다. 보유세는 과세기준일, 기간세는 과세기간 말, 취득세는 취득행위가 완성되는 시점으로 서로 다른 달력을 쓴다.',
    events: [
      { tax: '주민세 사업소분', when: '매년 7월 1일', trigger: '법정 과세기준일' },
      { tax: '재산세', when: '매년 6월 1일', trigger: '법정 과세기준일' },
      { tax: '종합부동산세', when: '매년 6월 1일', trigger: '법정 과세기준일' },
      { tax: '양도소득세', when: '과세기간이 끝나는 때', trigger: '양도일 자체가 성립일은 아님' },
      { tax: '증여에 의한 취득세', when: '증여계약일', trigger: '무상취득의 취득시기' },
    ],
    distinctions: [
      { name: '납세의무 성립일', meaning: '과세요건이 충족되어 추상적 납세의무가 생기는 때', example: '소득세: 과세기간 말' },
      { name: '법정기일', meaning: '담보권 등과 조세채권 우선순위를 가르는 기준일', example: '신고세목: 신고일 등 법정 유형별 판단' },
    ],
    caution: '토지를 8월에 양도해도 양도소득세 납세의무는 양도일이 아니라 그 소득이 속한 과세기간이 끝나는 때 성립한다.',
    sources: [
      { label: '국세기본법 제21조', note: '소득세·종합부동산세 등 국세 성립시기', href: 'https://www.law.go.kr/법령/국세기본법/제21조' },
      { label: '지방세기본법 제34조', note: '취득세·재산세·주민세 등 지방세 성립시기', href: 'https://www.law.go.kr/법령/지방세기본법/제34조' },
      { label: '지방세법 시행령 제20조', note: '무상취득 등 취득시기', href: 'https://www.law.go.kr/법령/지방세법시행령/제20조' },
    ],
  },
  'urban-development-zone-designation': {
    kind: 'development-zone', summary: '도시개발구역은 지정권자와 제안자를 구분해야 한다. 시·도지사·대도시 시장·법정 사유의 국토교통부장관은 지정할 수 있지만, 공공기관은 원칙적으로 지정을 제안하는 위치다.',
    designators: [
      { actor: '시·도지사', can: true, scope: '관할구역의 원칙적 지정권자' },
      { actor: '대도시 시장', can: true, scope: '도지사를 거치지 않고 직접 지정' },
      { actor: '국토교통부장관', can: true, scope: '국가 필요·긴급·광역 협의 불성립 등 법정 사유' },
      { actor: '한국토지주택공사 등', can: false, scope: '지정 제안 또는 사업시행 가능' },
    ],
    sizes: [
      { zone: '주거·상업·자연녹지', minimum: '1만㎡ 이상', note: '도시지역 최소규모' },
      { zone: '공업지역', minimum: '3만㎡ 이상', note: '도시지역 최소규모' },
      { zone: '생산녹지지역', minimum: '1만㎡ 이상', note: '구역 지정면적의 30% 이하 포함' },
    ],
    process: ['주민·전문가 의견청취', '관계 행정기관 협의', '도시계획위원회 심의', '구역 지정·고시'],
    sources: [
      { label: '도시개발법 제3조', note: '지정권자와 장관의 지정 사유', href: 'https://www.law.go.kr/법령/도시개발법/제3조' },
      { label: '도시개발법 제7조', note: '주민·전문가 의견청취', href: 'https://www.law.go.kr/법령/도시개발법/제7조' },
      { label: '도시개발법 제8조', note: '관계기관 협의와 도시계획위원회 심의', href: 'https://www.law.go.kr/법령/도시개발법/제8조' },
      { label: '도시개발법 시행령 제2조', note: '용도지역별 최소 지정규모', href: 'https://www.law.go.kr/법령/도시개발법시행령/제2조' },
    ],
  },
  'simultaneous-performance': {
    kind: 'rule-workbench', summary: '계약 이름보다 두 채무의 대가적 견련성과 이행기 도래를 먼저 본다. 상대방이 이행을 제공할 때까지 내 이행을 잠시 거절하는 권리다.',
    title: '서로 맞물린 이행의 자물쇠', columns: [
      { head: '매매', items: ['소유권이전등기 ↔ 잔대금', '민법 제568조'] },
      { head: '임대차 종료', items: ['보증금 반환 ↔ 목적물 반환', '판례상 공평의 원칙'] },
      { head: '계약 해제', items: ['각자의 원상회복 ↔ 상대방 원상회복', '민법 제549조'] },
    ], steps: ['상대방 채무도 변제기인가', '상대방이 이행제공을 했는가', '두 채무가 대가적 관계인가'],
    caution: '선이행의무자도 상대방의 이행이 곤란할 현저한 사유가 생기면 이행을 거절할 수 있다.',
    sources: [
      { label: '민법 제536조', note: '동시이행항변권·불안의 항변권', href: 'https://www.law.go.kr/법령/민법/제536조' },
      { label: '민법 제568조', note: '매매 당사자의 의무와 동시이행', href: 'https://www.law.go.kr/법령/민법/제568조' },
      { label: '민법 제549조', note: '원상회복의무에 제536조 준용', href: 'https://www.law.go.kr/법령/민법/제549조' },
    ],
  },
  'rental-policy-and-housing-welfare': {
    kind: 'rule-workbench', summary: '임대료 상한은 가격을 직접 누르고 부족량을 만들지만, 주거급여는 가구의 지급능력과 주택 상태를 지원한다.',
    title: '규제와 보조가 작동하는 자리', columns: [
      { head: '균형 이하 임대료 상한', items: ['가격 통제', 'Qd − Qs = 부족량', '민간 공급·품질 저하 가능'] },
      { head: '임차가구 주거급여', items: ['소비자 보조', '실제 임차료 지원', '주거 선택 폭 확대'] },
      { head: '자가가구 주거급여', items: ['주택 노후도별 수선', '자가 소유만으로 배제되지 않음'] },
    ], steps: ['정책이 가격을 통제하는가', '수요자 구매력을 보조하는가', '단기와 장기 효과를 구분'],
    caution: '가격상한 아래에서는 공급과잉이 아니라 수요량이 공급량을 초과하는 부족이 발생한다.',
    sources: [
      { label: '국토교통부 2026 주거급여', note: '임차·자가가구 지원 구조', href: 'https://www.molit.go.kr/USR/policyTarget/dtl.jsp?idx=1065' },
      { label: '주거급여법', note: '임차료·수선유지급여 근거', href: 'https://www.law.go.kr/법령/주거급여법' },
      { label: '국토교통부 2026 업무계획', note: '공적 임대주택·취약계층 지원', href: 'https://www.molit.go.kr/2026plan/sub3_realestate.html' },
    ],
  },
  'advertising-content-and-monitoring': {
    kind: 'rule-workbench', summary: '광고주를 특정하는 5개 실명항목에 인터넷 매물정보가 더해진다. 허위·과장 여부와 모니터링 사후절차까지 한 흐름으로 본다.',
    title: '매물 광고 게시 전 3중 검사', columns: [
      { head: '모든 표시·광고', items: ['사무소 명칭·소재지·연락처', '등록번호', '개업공인중개사 성명'] },
      { head: '인터넷 추가', items: ['소재지·면적·가격', '종류·거래형태 등'] },
      { head: '금지', items: ['없는·거래불가 매물', '거짓·과장', '중개보조원 사항 명시'] },
    ], steps: ['기본·수시 모니터링', '국토부가 결과 통보', '시·도지사·등록관청 조사·조치', '완료일부터 10일 내 결과 회신'],
    caution: '등록번호가 빠지면 일반 광고 단계부터 위반이다. 인터넷 광고만의 추가항목과 혼동하지 않는다.',
    sources: [
      { label: '공인중개사법 제18조의2', note: '명시사항·부당광고 금지', href: 'https://www.law.go.kr/법령/공인중개사법/제18조의2' },
      { label: '공인중개사법 제18조의3', note: '인터넷 광고 모니터링', href: 'https://www.law.go.kr/법령/공인중개사법/제18조의3' },
      { label: '시행령 제17조의2', note: '구체적인 광고 명시사항', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제17조의2' },
    ],
  },
  'cadastral-books-storage-and-maintenance': {
    kind: 'rule-workbench', summary: '지적공부는 청사 안 지적서고에 보존한다. 기존 등기부의 토지표시가 바뀌면 촉탁하지만 신규등록은 맞출 기존 등기부가 없다.',
    title: '지적서고에서 등기부까지', columns: [
      { head: '보존', items: ['지적소관청 청사', '지적서고', '온·습도 자동조절', '화재·도난 방지'] },
      { head: '등기촉탁 O', items: ['지목·지번·축척 변경', '합병', '기존 등기기록 정리'] },
      { head: '등기촉탁 X', items: ['신규등록', '기존 등기부가 없음'] },
    ], steps: ['토지이동 정리', '등기부 변경 필요 판단', '지체 없이 관할 등기관서 촉탁'],
    caution: '신규등록 토지의 소유자 정리는 증명서류에 따르지만 신규등록 자체를 등기촉탁하는 것은 아니다.',
    sources: [
      { label: '공간정보관리법 제69조', note: '지적공부 보존·반출 제한', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제69조' },
      { label: '공간정보관리법 제88조', note: '토지표시 변경의 등기촉탁', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제88조' },
      { label: '시행규칙 제75조', note: '지적서고 설치·관리', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제75조' },
    ],
  },
  'tax-collection-and-notice': {
    kind: 'rule-workbench', summary: '보통징수는 과세관청의 고지, 특별징수는 제3자의 징수·납입이다. 연대납세라도 절차상 고지서는 각자에게 송달한다.',
    title: '지방세가 걷히는 세 갈래 길', columns: [
      { head: '신고납부', items: ['납세의무자', '신고 → 직접 납부'] },
      { head: '보통징수', items: ['세무공무원', '과세결정 → 납세고지서'] },
      { head: '특별징수', items: ['특별징수의무자', '징수 → 지방자치단체 납입'] },
    ], steps: ['연대납세의무 성립', '모두에게 각각 고지서 송달', '한 사람의 납부 범위에서 공동 소멸'],
    caution: '연대책임은 한 장만 대표자에게 고지해도 된다는 뜻이 아니다.',
    sources: [
      { label: '지방세기본법 제2조', note: '징수방법의 정의', href: 'https://www.law.go.kr/법령/지방세기본법/제2조' },
      { label: '지방세기본법 제7조', note: '연대납세의무', href: 'https://www.law.go.kr/법령/지방세기본법/제7조' },
      { label: '지방세기본법 제30조', note: '연대납세의무자 서류 송달', href: 'https://www.law.go.kr/법령/지방세기본법/제30조' },
    ],
  },
  'replot-implementation-general': {
    kind: 'rule-workbench', summary: '환지계획 작성·인가에서 예정지 지정, 공사, 환지처분 공고까지 권리의 무대가 종전 토지에서 새 필지로 이동한다.',
    title: '환지방식 권리 이동 지도', columns: [
      { head: '계획·가격', items: ['비행정청은 환지계획 인가', '감정평가 → 토지평가협의회'] },
      { head: '환지예정지', items: ['효력일부터 예정지 사용·수익', '종전 토지는 사용·수익 불가'] },
      { head: '환지처분', items: ['공고 다음 날 권리변동', '무환지 토지 권리 소멸'] },
    ], steps: ['환지계획 작성', '인가', '예정지 지정·통지', '공사', '환지처분 공고', '다음 날 권리변동'],
    caution: '조성토지 가격은 개별공시지가로 정하지 않고 감정평가와 토지평가협의회 심의를 거친다.',
    sources: [
      { label: '도시개발법 제28조', note: '환지계획 작성', href: 'https://www.law.go.kr/법령/도시개발법/제28조' },
      { label: '도시개발법 제29조', note: '환지계획 인가', href: 'https://www.law.go.kr/법령/도시개발법/제29조' },
      { label: '도시개발법 제36조', note: '환지예정지 지정 효과', href: 'https://www.law.go.kr/법령/도시개발법/제36조' },
      { label: '도시개발법 제42조', note: '환지처분 효과', href: 'https://www.law.go.kr/법령/도시개발법/제42조' },
    ],
  },
  'sale-formation-earnest-money': {
    kind: 'sale-fruits-timeline', summary: '매매는 합의 순간 성립하지만, 과실과 대금이자는 인도·지급기라는 별도의 시계를 따라 움직인다.',
    moments: [
      { at: '합의', title: '매매 성립', detail: '재산권 이전 약정 + 대금 지급 약정', article: '민법 §563' },
      { at: '인도 전', title: '과실은 매도인', detail: '목적물을 계속 지배하는 쪽에 과실 귀속', article: '민법 §587' },
      { at: '인도 후', title: '대금이자 발생', detail: '매수인이 목적물을 받은 날부터', article: '민법 §587' },
    ],
    exception: '대금 지급기한을 따로 정했다면 그 기한부터 이자를 계산한다.',
    sources: [
      { label: '민법 제563조', note: '합의로 효력이 생기는 매매', href: 'https://www.law.go.kr/법령/민법/제563조' },
      { label: '민법 제587조', note: '과실 귀속·대금 이자와 지급기 예외', href: 'https://www.law.go.kr/법령/민법/제587조' },
    ],
  },
  'real-estate-tax-economic-effects': {
    kind: 'tax-incidence-scale', summary: '법률상 납세자가 아니라 가격 변화 뒤 실제 부담자를 찾는다. 덜 움직이는 쪽, 즉 탄력성이 작은 쪽이 더 많이 부담한다.',
    cases: [
      { title: '공급 완전비탄력', demand: 0, supply: 100, result: '토지소유자 100% 부담' },
      { title: '공급이 더 비탄력', demand: 35, supply: 65, result: '공급자 부담이 더 큼' },
      { title: '수요가 더 비탄력', demand: 70, supply: 30, result: '수요자 부담이 더 큼' },
    ],
    effects: ['보유세 → 보유비용 증가', '거래세 → 거래량 감소·초과부담', '양도세 중과 → 매각 지연(lock-in)'],
    sources: [
      { label: '한국은행 수요·공급 특강', note: '수요·공급과 가격탄력성의 공식 설명', href: 'https://www.bok.or.kr/portal/bbs/B0000216/view.do?menuNo=200646&nttId=10081781' },
      { label: '한국은행 가격과 시장', note: '탄력성과 시장 반응', href: 'https://www.bok.or.kr/portal/bbs/B0000216/view.do?listType=G&menuNo=200647&nttId=165624&pageIndex=10' },
    ],
  },
  'office-relocation-closure': {
    kind: 'office-relocation-route', summary: '이전 후 10일 안에 신고한다. 본사인지 분사무소인지, 같은 관할인지 다른 관할인지가 신고처와 후속서류를 가른다.',
    routes: [
      { case: '본사 · 같은 관할', to: '기존 등록관청', after: '등록증 변경기재 또는 재교부' },
      { case: '본사 · 다른 관할', to: '이전 후 등록관청', after: '종전 관청에 관련서류 송부 요청' },
      { case: '분사무소 이전', to: '주된 사무소 등록관청', after: '이전 전·후 관할청에 지체 없이 통보' },
    ],
    packet: ['이전신고서', '중개사무소등록증 또는 분사무소설치신고확인서', '사무소 확보 증명서류'],
    sources: [
      { label: '공인중개사법 제20조', note: '10일 기한·관할 외 이전·행정처분', href: 'https://www.law.go.kr/법령/공인중개사법/제20조' },
      { label: '시행규칙 제11조', note: '신고서류·재교부·서류송부', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제11조' },
      { label: '법제처 15-0122', note: '이전신고 수리 전 중개업무 가능', href: 'https://www.law.go.kr/DRF/lawService.do?ID=314950&OC=unicpla&mobileYn=Y&target=expc&type=HTML' },
    ],
  },
  'capital-gain-necessary-expense': {
    kind: 'expense-filter', summary: '필요경비는 취득가액·자본적 지출·양도비의 세 서랍으로 분류한다. 직접성, 증빙, 중복공제 여부를 차례로 검사한다.',
    drawers: [
      { name: '취득가액', items: ['실지 취득원가', '취득 관련 부대비용'] },
      { name: '자본적 지출', items: ['용도변경·개량', '소유권 확보 소송비용'] },
      { name: '양도비', items: ['신고서·계약서 작성비', '공증비·인지대·소개비', '명도비용'] },
    ],
    checks: ['양도 또는 가치증가에 직접 쓴 돈인가', '증명서류·금융거래로 확인되는가', '다른 소득에서 이미 공제하지 않았는가'],
    sources: [
      { label: '소득세법 제97조', note: '필요경비의 세 범주', href: 'https://www.law.go.kr/법령/소득세법/제97조' },
      { label: '소득세법 시행령 제163조', note: '양도비·증빙·소송비용의 세부 범위', href: 'https://www.law.go.kr/법령/소득세법시행령/제163조' },
    ],
  },
  'maintenance-project-basic-plan': {
    kind: 'maintenance-plan-clock', summary: '기본계획은 10년 단위로 세우고 5년마다 타당성을 검토한다. 수립·중대한 변경에는 주민공람과 지방의회 의견청취가 붙는다.',
    clocks: [
      { number: '10년', title: '기본계획 수립 단위', note: '도시·주거환경의 장기 방향' },
      { number: '5년', title: '타당성 검토 주기', note: '수립권자가 결과를 기본계획에 반영' },
      { number: '14일+', title: '주민 공람', note: '지방의회 의견청취와 함께 진행' },
    ],
    authority: ['특별시장·광역시장·특별자치시장·특별자치도지사', '시장', '대도시 아닌 시장의 계획은 도지사 승인'],
    caution: '정비예정구역 면적 20% 이상 변경은 경미한 변경으로 처리할 수 없다.',
    sources: [
      { label: '도시정비법 제4조', note: '기본계획 수립권자·10년·5년', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제4조' },
      { label: '도시정비법 제6조', note: '주민공람·지방의회 의견청취', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제6조' },
      { label: '도시정비법 시행령 제6조', note: '경미한 변경의 범위', href: 'https://www.law.go.kr/법령/도시및주거환경정비법시행령/제6조' },
    ],
  },
  'seller-warranty-liability': {
    kind: 'warranty-remedy-selector', summary: '하자의 종류, 매수인의 선의·악의, 계약목적 달성 가능성을 차례로 확인하면 감액·해제·손해배상의 범위가 갈린다.',
    cases: [
      { defect: '전부 타인 권리', fact: '이전 불가능', remedies: ['해제', '선의면 손해배상'], article: '§570' },
      { defect: '일부 타인 권리·수량부족', fact: '일부 미달', remedies: ['대금감액', '요건 시 해제·배상'], article: '§572·574' },
      { defect: '제한물권', fact: '목적 달성 불가', remedies: ['선의 매수인 해제', '그 밖에는 배상'], article: '§575' },
    ],
    precedent: '대법원 2017다202050: 토지에 매립된 폐기물도 통상 기대되는 품질·상태를 갖추지 못한 하자가 될 수 있다.',
    sources: [
      { label: '민법 제570조', note: '전부 타인 권리의 해제·배상', href: 'https://www.law.go.kr/법령/민법/제570조' },
      { label: '민법 제572조·제574조', note: '일부 권리·수량부족', href: 'https://www.law.go.kr/법령/민법/제574조' },
      { label: '대법원 2017다202050', note: '매립 폐기물의 하자 판단', href: 'https://lawclerk.scourt.go.kr/portal/news/NewsViewAction.work?gubun=4&seqnum=7627' },
    ],
  },
  'market-segmentation-stp': {
    kind: 'stp-funnel', summary: '시장을 동질적 집단으로 나누고, 공략할 집단을 고른 뒤, 그 고객 머릿속에 경쟁대안과 다른 자리를 만든다.',
    funnel: [
      { code: 'S', name: 'Segmentation', question: '누가 서로 비슷한가?', output: '수요자 소집단' },
      { code: 'T', name: 'Targeting', question: '어느 집단을 공략할까?', output: '표적시장' },
      { code: 'P', name: 'Positioning', question: '어떤 이미지로 기억될까?', output: '차별적 위치' },
    ],
    layers: [
      { title: '시장점유', tool: 'STP + 4P', view: '공급자·시장 중심' },
      { title: '고객점유', tool: 'A-I-D-A', view: '주의→관심→욕구→행동' },
      { title: '관계마케팅', tool: '지속적 관계', view: '재구매·장기 신뢰' },
    ],
    sources: [
      { label: 'KOCW 마케팅원론', note: '시장세분화·표적시장·포지셔닝', href: 'https://www.kocw.net/home/search/kemView.do?kemId=1309951' },
      { label: '한국은행 경제교육', note: '시장·수요자 선택의 경제 기초', href: 'https://www.bok.or.kr/portal/main/contents.do?menuNo=200429' },
    ],
  },
  'auction-agency-duties-and-fees': {
    kind: 'auction-agency-boundary', summary: '등록된 개업공인중개사가 위임받은 사건에서 직접 출석해 정해진 입찰행위만 대리한다. 서류 교부·보존과 보수 지급시점은 별도 의무다.',
    allowed: ['입찰표 작성·제출', '차순위매수신고', '공유자 우선매수신고', '보증 반환신청'],
    duties: [
      { at: '입찰 전', task: '권리·물건 확인설명', proof: '확인·설명서 교부' },
      { at: '매각기일', task: '본인이 직접 출석', proof: '대리 출석 불가' },
      { at: '업무 후', task: '서류 사본 보존', proof: '3년' },
      { at: '보수 수령', task: '영수증 교부', proof: '약정 없으면 대금 지급기한일' },
    ],
    sources: [
      { label: '공인중개사 매수신청대리인 등록규칙', note: '등록·업무범위의 대법원규칙', href: 'https://www.law.go.kr/법령/공인중개사의매수신청대리인등록등에관한규칙' },
      { label: '민사집행법 제113조', note: '매수신청 보증', href: 'https://www.law.go.kr/법령/민사집행법/제113조' },
      { label: '민사집행법 제140조', note: '공유자의 우선매수권', href: 'https://www.law.go.kr/법령/민사집행법/제140조' },
    ],
  },
  'mortgage-registration-detail': {
    kind: 'mortgage-registry-anatomy', summary: '저당권 등기는 채권액·채무자·원인과 범위를 공시한다. 금액이 없는 채권은 평가액으로 번역하고, 공동담보가 5개 이상이면 목록을 붙인다.',
    fields: [
      { label: '채권액', value: '일정 금액', note: '금액 없는 채권 → 평가액' },
      { label: '채무자', value: '성명·주소', note: '설정자와 같아도 기록' },
      { label: '이자·위약금', value: '약정이 있을 때', note: '등기할 사항' },
      { label: '채권최고액', value: '근저당', note: '확정 전 담보 한도' },
    ],
    joint: [1,2,3,4,5],
    transfer: '피담보채권 일부 양도 → 저당권 일부이전 + 양도액 기록',
    sources: [
      { label: '부동산등기법 제75조', note: '저당권 등기사항', href: 'https://www.law.go.kr/법령/부동산등기법/제75조' },
      { label: '부동산등기규칙 제127조', note: '공동담보목록 작성 기준', href: 'https://www.law.go.kr/법령/부동산등기규칙/제127조' },
      { label: '부동산등기규칙 제128조', note: '일부이전 등기', href: 'https://www.law.go.kr/법령/부동산등기규칙/제128조' },
    ],
  },
  'capital-gain-special-cases': {
    kind: 'capital-special-router', summary: '서로 다른 특례를 한 덩어리로 외우지 말고 과세표준 분리, 기준시가 평가, 부담부증여, 1세대1주택 특례의 네 문으로 나눈다.',
    gates: [
      { input: '양도소득', output: '종합·퇴직소득과 분리 계산', basis: '소득세법 §92' },
      { input: '지가급등 지정지역', output: '배율방법으로 기준시가', basis: '소득세법 §99' },
      { input: '배우자·직계존비속 부담부증여', output: '실제 인수 인정 채무만 양도부분', basis: '시행령 §151' },
      { input: '일시적 2주택 등', output: '사유별 처분기한 별도 확인', basis: '시행령 §155' },
    ],
    sources: [
      { label: '소득세법 제92조', note: '양도소득 과세표준 분리', href: 'https://www.law.go.kr/법령/소득세법/제92조' },
      { label: '소득세법 제99조', note: '기준시가 산정', href: 'https://www.law.go.kr/법령/소득세법/제99조' },
      { label: '소득세법 시행령 제151조', note: '부담부증여 채무액', href: 'https://www.law.go.kr/법령/소득세법시행령/제151조' },
      { label: '소득세법 시행령 제155조', note: '1세대1주택 특례', href: 'https://www.law.go.kr/법령/소득세법시행령/제155조' },
    ],
  },
  'building-permit-report': {
    kind: 'building-permit-switchboard', summary: '건축허가의 대지권원, 해체의 허가·신고, 건축허가 제한은 서로 다른 법률과 요건을 쓴다. 한 카드 안에서도 세 회로로 분리해야 한다.',
    circuits: [
      { title: '건축허가', trigger: '대지 소유권 원칙', exception: '사용권원 등 법정 예외', law: '건축법 §11' },
      { title: '건축물 해체', trigger: '허가 원칙', exception: '법정 소규모 등은 신고', law: '건축물관리법 §30' },
      { title: '허가·착공 제한', trigger: '2년 이내', exception: '1회·1년 이내 연장', law: '건축법 §18' },
    ],
    procedure: ['주민의견 청취', '건축위원회 심의', '목적·기간·대상 공고', '시·도 제한은 국토부 보고'],
    sources: [
      { label: '건축법 제11조', note: '건축허가와 대지권원', href: 'https://www.law.go.kr/법령/건축법/제11조' },
      { label: '건축법 제18조', note: '허가·착공 제한과 절차', href: 'https://www.law.go.kr/법령/건축법/제18조' },
      { label: '건축물관리법 제30조', note: '현행 해체 허가·신고', href: 'https://www.law.go.kr/법령/건축물관리법/제30조' },
      { label: '건축물관리법 시행령 제21조', note: '해체신고 대상', href: 'https://www.law.go.kr/법령/건축물관리법시행령/제21조' },
    ],
  },
  'contract-classification': {
    kind: 'contract-classification-cube', summary: '한 계약에 세 개의 독립 질문을 던진다. 의무 주체, 대가, 성립시점을 섞지 않으면 이름이 비슷해도 정확히 분류할 수 있다.',
    axes: [
      { axis: '의무 주체', left: '쌍무', right: '편무', cue: '서로 채무 ↔ 한쪽만 채무' },
      { axis: '대가', left: '유상', right: '무상', cue: '경제적 대가 있음 ↔ 없음' },
      { axis: '성립', left: '낙성', right: '요물', cue: '합의 ↔ 물건 인도·지정행위 완료' },
    ],
    contracts: [
      { name: '매매·임대차·도급', code: ['쌍무','유상','낙성'] },
      { name: '증여', code: ['편무','무상','낙성'] },
      { name: '사용대차', code: ['편무','무상','낙성'] },
      { name: '현상광고', code: ['편무','유상','요물'] },
    ],
    sources: [
      { label: '민법 제554조', note: '증여의 합의 성립', href: 'https://www.law.go.kr/법령/민법/제554조' },
      { label: '민법 제563조', note: '매매의 약정 성립', href: 'https://www.law.go.kr/법령/민법/제563조' },
      { label: '민법 제609조', note: '사용대차', href: 'https://www.law.go.kr/법령/민법/제609조' },
      { label: '민법 제675조', note: '현상광고와 지정행위 완료', href: 'https://www.law.go.kr/법령/민법/제675조' },
    ],
  },
  'demand-supply-shift-factors': {
    kind: 'curve-shift-compass', summary: '해당 재화의 가격 변화는 곡선 위 이동이고, 소득·선호·원가·기술 같은 가격 외 요인은 곡선 자체를 움직인다.',
    compass: [
      { side: '수요 →', plus: ['소득↑(정상재)','대체재 가격↑','금리↓','선호↑'], minus: ['소득↓','대체재 가격↓','금리↑','선호↓'] },
      { side: '공급 →', plus: ['건축비↓','기술 발전','보조금↑','업체 수↑'], minus: ['임금↑','자재가격↑','토지가격↑','규제비용↑'] },
    ],
    rule: [
      { change: '수요 증가', price: '↑', quantity: '↑' },
      { change: '수요 감소', price: '↓', quantity: '↓' },
      { change: '공급 증가', price: '↓', quantity: '↑' },
      { change: '공급 감소', price: '↑', quantity: '↓' },
    ],
    sources: [
      { label: '한국은행 수요와 공급', note: '수요·공급 법칙과 시장균형', href: 'https://www.bok.or.kr/portal/bbs/B0000216/view.do?menuNo=200646&nttId=10081781' },
      { label: '한국은행 공급 교육', note: '공급곡선과 생산비용', href: 'https://www.bok.or.kr/portal/bbs/B0000216/view.do?menuNo=200647&nttId=165607&type=YNGBGS' },
    ],
  },
  'mandatory-registration-cancellation': {
    kind: 'cancellation-decision-tree', summary: '조문 동사가 핵심이다. 제38조제1항의 “취소하여야 한다”와 제2항의 “취소할 수 있다”를 위반 유형별로 갈라 본다.',
    branches: [
      { type: '필수 취소', verb: '하여야 한다', items: ['사망·법인 해산','거짓·부정 등록','중대한 결격사유','이중등록·이중사무소','업무정지 중 중개업무'] },
      { type: '임의 취소', verb: '할 수 있다', items: ['등록기준 미달','6개월 초과 휴업','전속중개계약 정보 미공개','최근 1년 반복 처분 후 재위반'] },
    ],
    check: '“최근 1년 2회 + 다시 위반”은 반복성이 강해 보여도 제2항의 임의 취소다.',
    sources: [
      { label: '공인중개사법 제38조', note: '필수·임의 등록취소 전체 목록', href: 'https://www.law.go.kr/법령/공인중개사법/제38조' },
      { label: '공인중개사법 제39조', note: '업무정지와의 관계', href: 'https://www.law.go.kr/법령/공인중개사법/제39조' },
    ],
  },
  'provisional-registration-ex-officio-cancellation': {
    kind: 'provisional-cancellation-shield', summary: '가등기 본등기는 순위를 보전하지만 모든 후행등기를 지우지는 않는다. 본등기 권리를 침해하는지와 규칙상 보호 예외를 함께 본다.',
    modes: [
      { title: '소유권이전 본등기', erase: ['후행 소유권이전','지상권·저당권·임차권 등'], keep: ['가등기상 권리의 가압류·가처분','선행 압류 등에 의한 경매개시','대항 가능한 임차권등기'] },
      { title: '용익권 본등기', erase: ['본등기와 양립 불가능한 후행 용익권'], keep: ['소유권이전','저당권','압류·가압류'] },
    ],
    notice: '체납처분 압류는 즉시 기계적으로 말소하지 않고 직권말소대상 통지와 이의 절차를 거친다.',
    sources: [
      { label: '부동산등기법 제92조', note: '가등기 순위보전과 직권말소', href: 'https://www.law.go.kr/법령/부동산등기법/제92조' },
      { label: '부동산등기규칙 제147조', note: '말소 예외와 통지 절차', href: 'https://www.law.go.kr/법령/부동산등기규칙/제147조' },
      { label: '부동산등기규칙 제148조', note: '용익권 가등기의 본등기', href: 'https://www.law.go.kr/법령/부동산등기규칙/제148조' },
    ],
  },
  'preliminary-return-deadline': {
    kind: 'capital-return-calendar', summary: '신고기한은 양도일에 두 달을 더하지 않는다. 자산 유형별 기준월의 말일을 먼저 찾고 2개월 또는 3개월을 더한다.',
    calendars: [
      { asset: '토지·건물·부동산권리 등', event: '양도일 속한 달 말일', add: '+ 2개월', example: '3/21 양도 → 5/31' },
      { asset: '주식 등 법정 대상', event: '양도일 속한 반기 말일', add: '+ 2개월', example: '상·하반기 구분' },
      { asset: '부담부증여 채무부분', event: '양도일 속한 달 말일', add: '+ 3개월', example: '일반 부동산보다 1개월 추가' },
    ],
    extras: ['양도차익 0·차손도 예정신고','토지거래허가 전 청산은 허가일 기준','복수 예정신고 합산 누락 시 확정신고'],
    sources: [
      { label: '소득세법 제105조', note: '자산별 예정신고기한', href: 'https://www.law.go.kr/법령/소득세법/제105조' },
      { label: '소득세법 제110조', note: '확정신고', href: 'https://www.law.go.kr/법령/소득세법/제110조' },
      { label: '국세청 양도소득세 안내', note: '신고·납부 실무', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2304&cntntsId=7711' },
    ],
  },
  'building-report-temporary-structure': {
    kind: 'building-report-switch', summary: '건축신고는 허가대상 중 소규모 예외이고, 가설건축물 축조신고는 존치기간이 한정된 임시 구조물의 별도 절차다.',
    panels: [
      { title: '건축신고', rule: '신고하면 건축허가를 받은 것으로 봄', examples: ['85㎡ 이내 증축·개축·재축','법정 지역 200㎡ 미만·3층 미만','연면적 100㎡ 이하 신축'] },
      { title: '가설건축물 축조신고', rule: '임시성·용도별 열거', examples: ['견본주택','공사용 가설건축물','법정 비닐하우스·임시창고'] },
    ],
    timer: ['건축신고 수리','1년 내 착수 원칙','정당한 사유 → 1년 범위 연장','미착수 시 효력 상실'],
    sources: [
      { label: '건축법 제14조', note: '건축신고 대상·5일 수리·착수기한', href: 'https://www.law.go.kr/법령/건축법/제14조' },
      { label: '건축법 제20조', note: '가설건축물 허가·신고', href: 'https://www.law.go.kr/법령/건축법/제20조' },
      { label: '건축법 시행령 제15조', note: '가설건축물 유형·존치기간', href: 'https://www.law.go.kr/법령/건축법시행령/제15조' },
    ],
  },
  'unilateral-act-classification': {
    kind: 'unilateral-arrival-gate', summary: '단독행위는 상대방의 승낙이 필요 없지만, 상대방 있는 단독행위는 의사표시가 도달해야 효력이 생긴다.',
    gates: [
      { type: '상대방 있음', arrival: '도달 필요', examples: ['취소·해제','상계','무권대리 추인','최고','공유지분 포기'] },
      { type: '상대방 없음', arrival: '도달 상대 없음', examples: ['유언·유증','재단법인 설립행위'] },
    ],
    distinction: '계약은 상대방의 승낙까지 필요하지만, 상대방 있는 단독행위는 도달만 하면 상대방 의사와 무관하게 효과가 생긴다.',
    sources: [
      { label: '민법 제111조', note: '상대방 있는 의사표시의 도달주의', href: 'https://www.law.go.kr/법령/민법/제111조' },
      { label: '민법 제543조', note: '해지·해제권의 의사표시', href: 'https://www.law.go.kr/법령/민법/제543조' },
      { label: '민법 제1073조', note: '유언의 효력발생 시기', href: 'https://www.law.go.kr/법령/민법/제1073조' },
    ],
  },
  'income-capitalization-method': {
    kind: 'cap-rate-balance', summary: '직접환원은 한 해의 순영업소득을 시장이 요구하는 환원율로 나눈다. 금리·위험이 올라 환원율이 커지면 같은 소득의 가치는 내려간다.',
    formula: { income: 'NOI 3,500만원', rate: '7%', value: '5억원' },
    drivers: [
      { factor: '시장금리 ↑', rate: '환원율 ↑', value: '가치 ↓' },
      { factor: '투자위험 ↑', rate: '환원율 ↑', value: '가치 ↓' },
      { factor: '투자수요 ↑', rate: '가격 ↑', value: '환원율 ↓' },
    ],
    methods: ['시장추출법','조성법','투자결합법','부채감당법'],
    sources: [
      { label: '감정평가에 관한 규칙 제22조', note: '수익환원법과 할인현금흐름분석법', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제22조' },
      { label: '한국은행 금리 교육', note: '금리와 자산가치의 기초', href: 'https://www.bok.or.kr/portal/main/contents.do?menuNo=200429' },
    ],
  },
  'employed-broker-and-assistant': {
    kind: 'broker-role-badges', summary: '자격이 있는 소속공인중개사는 중개업무를 수행할 수 있지만, 중개보조원은 현장안내·일반서무 같은 단순 보조업무만 할 수 있다.',
    roles: [
      { role: '소속공인중개사', license: '공인중개사 자격 O', can: ['중개업무 수행','확인·설명서 공동 서명·날인'], cannot: ['독립 개업 없이 자기 명의 영업'] },
      { role: '중개보조원', license: '공인중개사 자격 X', can: ['현장안내','일반서무','단순 보조'], cannot: ['중개의뢰 접수·계약 협의','확인·설명','거래계약서 작성'] },
    ],
    timeline: ['교육 수료','업무개시 전 고용신고','업무 수행','종료일부터 10일 내 신고'],
    cap: '중개보조원 ≤ 개업공인중개사와 소속공인중개사 합계의 5배',
    sources: [
      { label: '공인중개사법 제2조', note: '소속공인중개사·중개보조원 정의', href: 'https://www.law.go.kr/법령/공인중개사법/제2조' },
      { label: '공인중개사법 제15조', note: '고용신고·행위 귀속·인원 한도', href: 'https://www.law.go.kr/법령/공인중개사법/제15조' },
      { label: '시행규칙 제8조', note: '업무개시 전·종료 후 10일', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제8조' },
      { label: '법제처 20-0498', note: '중개보조원의 확인·설명 업무 불가', href: 'https://www.law.go.kr/DRF/lawService.do?ID=328871&OC=unicpla&mobileYn=Y&target=expc&type=HTML' },
    ],
  },
  'area-registration-rounding': {
    kind: 'area-rounding-ruler', summary: '등록단위를 먼저 고르고 그 다음 끝수를 처리한다. 정확히 절반인 5는 무조건 올림이 아니라 앞자리 홀짝으로 판정한다.',
    units: [
      { area: '축척 1/600·좌표등록부 지역', unit: '0.1㎡', digits: '소수 첫째 자리' },
      { area: '그 밖의 지역', unit: '1㎡', digits: '정수 단위' },
    ],
    samples: [
      { raw: '145.449', result: '145.4', reason: '0.05 미만 → 버림' },
      { raw: '145.450', result: '145.4', reason: '정확히 5 + 앞자리 4 짝수' },
      { raw: '145.550', result: '145.6', reason: '정확히 5 + 앞자리 5 홀수' },
      { raw: '145.551', result: '145.6', reason: '0.05 초과 → 올림' },
    ],
    sources: [
      { label: '공간정보관리법 시행령 제60조', note: '면적 결정 단위', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제60조' },
      { label: '공간정보관리법 시행규칙 제68조', note: '면적 끝수 계산', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제68조' },
    ],
  },
  'capital-gain-tax-rate-by-period': {
    kind: 'capital-rate-timeline', summary: '자산 종류를 먼저 고른 뒤 보유기간 구간을 찾고, 해당 단기세율과 기본세율로 계산한 세액 중 큰 것을 적용한다.',
    tracks: [
      { asset: '일반 토지·건물', periods: [{until:'1년 미만',rate:'50%'},{until:'1년 이상~2년 미만',rate:'40%'},{until:'2년 이상',rate:'기본세율'}] },
      { asset: '분양권', periods: [{until:'1년 미만',rate:'70%'},{until:'1년 이상',rate:'60%'}] },
    ],
    maxRule: '둘 이상 세율에 해당하면 각각 계산한 산출세액 중 큰 금액',
    sources: [
      { label: '소득세법 제104조', note: '자산별·보유기간별 세율과 큰 세액 원칙', href: 'https://www.law.go.kr/법령/소득세법/제104조' },
      { label: '국세청 양도소득세 세율', note: '현행 세율 실무 안내', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2308&cntntsId=7716' },
    ],
  },
  'building-use-change': {
    kind: 'use-group-elevator', summary: '시설군 번호가 작은 상위군으로 올라가면 허가, 번호가 큰 하위군으로 내려가면 신고다. 같은 시설군 안에서는 건축물대장 변경 여부를 본다.',
    floors: [
      { no: 1, name: '자동차 관련 시설군' }, { no: 2, name: '산업 등 시설군' }, { no: 3, name: '전기통신 시설군' },
      { no: 4, name: '문화집회 시설군' }, { no: 5, name: '영업 시설군' }, { no: 6, name: '교육·복지 시설군' },
      { no: 7, name: '근린생활 시설군' }, { no: 8, name: '주거업무 시설군' }, { no: 9, name: '그 밖의 시설군' },
    ],
    directions: [{move:'번호 감소 ↑',action:'용도변경 허가'},{move:'번호 증가 ↓',action:'용도변경 신고'},{move:'같은 시설군',action:'건축물대장 기재변경 검토'}],
    approval: '허가·신고 대상 변경면적 합계 100㎡ 이상 → 사용승인 준용',
    sources: [
      { label: '건축법 제19조', note: '상·하위군 허가·신고와 100㎡ 사용승인', href: 'https://www.law.go.kr/법령/건축법/제19조' },
      { label: '건축법 시행령 제14조', note: '용도변경 세부기준', href: 'https://www.law.go.kr/법령/건축법시행령/제14조' },
    ],
  },
  'boundary-passage-right': {
    kind: 'passage-route-map', summary: '맹지 구제와 주위토지 손해 최소화를 동시에 만족하는 현재의 최소 통로를 찾는다. 필요성이 사라지면 법정통행권도 끝난다.',
    route: ['공로 출입 불가·부적합','현재 토지용도 확인','가장 손해 적은 장소·방법','손해 보상','공로 신설 시 소멸'],
    cases: [
      { situation: '좁지만 실제 사용 가능한 통로', result: '추가 통행권 제한', why: '필요성 없음' },
      { situation: '통로가 있으나 이용에 부적합', result: '별도 통행권 가능', why: '기능 부족' },
      { situation: '장래 아파트 신축 예정', result: '현재 필요 폭만', why: '장래 사정 선반영 X' },
    ],
    sources: [
      { label: '민법 제219조', note: '주위토지통행권·손해 최소·보상', href: 'https://www.law.go.kr/법령/민법/제219조' },
      { label: '대법원 97다47118', note: '공로 개설로 필요성 소멸 시 통행권 소멸', href: 'https://www.law.go.kr/판례/(97다47118)' },
    ],
  },
  'equilibrium-shift-direction-judgment': {
    kind: 'equilibrium-four-board', summary: '수요·공급이 같은 방향이면 수량이 확정되고, 반대 방향이면 가격이 확정된다. 나머지는 변화폭을 비교한다.',
    quadrants: [
      { demand: 'D ↑', supply: 'S ↑', fixed: 'Q ↑', contest: 'P는 변화폭 대결' },
      { demand: 'D ↓', supply: 'S ↓', fixed: 'Q ↓', contest: 'P는 변화폭 대결' },
      { demand: 'D ↑', supply: 'S ↓', fixed: 'P ↑', contest: 'Q는 변화폭 대결' },
      { demand: 'D ↓', supply: 'S ↑', fixed: 'P ↓', contest: 'Q는 변화폭 대결' },
    ],
    example: { inputs: 'D 감소폭 < S 증가폭', answer: 'P ↓ · Q ↑', reason: '가격은 확정, 수량은 공급 증가가 우세' },
    sources: [
      { label: '한국은행 수요와 공급', note: '시장균형과 곡선 이동의 기초', href: 'https://www.bok.or.kr/portal/bbs/B0000216/view.do?menuNo=200646&nttId=10081781' },
      { label: 'KOCW 경제학원론', note: '수요·공급 변화와 균형 비교정태', href: 'https://www.kocw.net/home/search/kemView.do?kemId=1310172' },
    ],
  },
  'registration-disqualification-grounds': {
    kind: 'disqualification-locks', summary: '결격 여부는 처분 이름과 기산일을 짝지어 판정한다. 집행유예는 유예 종료와 동시에 풀리는 것이 아니라 그 후 2년이 더 필요하다.',
    locks: [
      { event: '실형', start: '집행 종료·면제일', wait: '3년' },
      { event: '집행유예', start: '유예기간 만료일', wait: '2년' },
      { event: '공인중개사 자격취소', start: '취소일', wait: '3년' },
      { event: '법정 사유 등록취소', start: '취소일', wait: '3년' },
    ],
    noLock: ['형의 선고유예','피특정후견인','법인 사망·해산 취소의 종전 대표'],
    sources: [
      { label: '공인중개사법 제10조', note: '개설등록·고용 결격사유와 기간', href: 'https://www.law.go.kr/법령/공인중개사법/제10조' },
      { label: '공인중개사법 제38조', note: '등록취소 유형', href: 'https://www.law.go.kr/법령/공인중개사법/제38조' },
    ],
  },
  'survey-appeal-procedure': {
    kind: 'survey-appeal-stairs', summary: '최초 심사는 시·도지사를 거쳐 지방지적위원회로, 재심사는 국토교통부장관을 거쳐 중앙지적위원회로 올라간다.',
    stairs: [
      { day: '청구', actor: '토지소유자·이해관계인·수행자', action: '시·도지사를 거쳐 적부심사' },
      { day: '30일', actor: '시·도지사', action: '조사 후 지방지적위원회 회부' },
      { day: '60일', actor: '지방지적위원회', action: '심의·의결(30일 1회 연장)' },
      { day: '7일', actor: '시·도지사', action: '의결서 통지' },
      { day: '90일', actor: '불복 당사자', action: '국토부 거쳐 중앙위 재심사' },
    ],
    sources: [
      { label: '공간정보관리법 제29조', note: '적부심사·회부·의결·재심사 전 절차', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제29조' },
      { label: '공간정보관리법 시행령 제26조', note: '재심사 청구·처리', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제26조' },
    ],
  },
  'property-tax-trust-and-special-levy': {
    kind: 'trust-tax-handoff', summary: '등기명의와 세법상 납세의무자를 분리한다. 신탁재산은 위탁자가 본래 납세의무자이고, 체납 회수 단계에서 수탁자의 물적납세의무가 등장한다.',
    actors: [
      { role: '위탁자', status: '본래 납세의무자', duty: '재산세 신고·납부' },
      { role: '수탁자', status: '등기명의자', duty: '원칙적 납세의무자 아님' },
      { role: '수탁자(체납 시)', status: '물적납세의무자', duty: '해당 신탁재산 한도' },
    ],
    trigger: ['위탁자 재산세 체납','다른 재산 강제징수로 부족','수탁자에게 납부통지','신탁재산 범위에서 납부'],
    sources: [
      { label: '지방세법 제107조', note: '신탁재산의 위탁자 납세의무', href: 'https://www.law.go.kr/법령/지방세법/제107조' },
      { label: '지방세법 제119조의2', note: '수탁자의 물적납세의무', href: 'https://www.law.go.kr/법령/지방세법/제119조의2' },
      { label: '지방세법 시행규칙 별지 제64호의2', note: '위탁자 납세의무 안내 서식', href: 'https://law.go.kr/LSW/flDownload.do?bylClsCd=110202&flSeq=150492477&gubun=' },
    ],
  },
  'building-agreement': {
    kind: 'building-agreement-consensus', summary: '처음 체결은 소유자등 전원 합의, 운영회 구성·변경·폐지는 과반수 동의가 핵심이다. 인가·공고 뒤에는 승계인도 원칙적으로 구속된다.',
    votes: [
      { stage: '협정 체결', vote: '전원 합의', next: '협정서 작성' },
      { stage: '인가 신청', vote: '대표자 또는 체결자', next: '건축위원회 심의' },
      { stage: '변경·폐지', vote: '과반수 동의', next: '변경인가·폐지인가' },
    ],
    integrated: ['건폐율','지하층 설치','부설주차장','개인하수처리시설'],
    separate: '계단 설치는 개별 건축물 기준 적용',
    sources: [
      { label: '건축법 제77조의4', note: '전원 합의·협정 내용', href: 'https://www.law.go.kr/법령/건축법/제77조의4' },
      { label: '건축법 제77조의6', note: '인가·공고', href: 'https://www.law.go.kr/법령/건축법/제77조의6' },
      { label: '건축법 제77조의9', note: '변경·폐지', href: 'https://www.law.go.kr/법령/건축법/제77조의9' },
      { label: '건축법 제77조의13', note: '협정 특례의 통합 적용', href: 'https://www.law.go.kr/법령/건축법/제77조의13' },
    ],
  },
  'apparent-agency': {
    kind: 'apparent-agency-three-doors', summary: '표현대리는 하나의 포괄 규칙이 아니다. 본인이 만든 외관이 어느 문에 해당하는지 먼저 고르고, 상대방의 선의·무과실 또는 정당한 이유를 따로 확인한다.',
    doors: [
      { article: '제125조', title: '수여 표시', appearance: '본인이 제3자에게 대리권이 있다고 표시', trust: '선의·무과실', example: '권한을 주었다고 직접 알림' },
      { article: '제126조', title: '권한 초과', appearance: '기본대리권은 있으나 범위를 넘어 행동', trust: '정당한 이유', example: '담보설정 권한으로 매도' },
      { article: '제129조', title: '권한 소멸 후', appearance: '과거 대리권이 있었으나 이미 소멸', trust: '선의·무과실', example: '해임 사실을 모른 채 거래' },
    ],
    claimRule: '유권대리 주장 ≠ 표현대리 주장: 무권대리인·행위·해당 유형을 특정하여 별도로 주장·증명',
    sources: [
      { label: '민법 제125조', note: '대리권수여 표시', href: 'https://www.law.go.kr/법령/민법/제125조' },
      { label: '민법 제126조', note: '권한을 넘은 표현대리', href: 'https://www.law.go.kr/법령/민법/제126조' },
      { label: '민법 제129조', note: '대리권 소멸 후 표현대리', href: 'https://www.law.go.kr/법령/민법/제129조' },
      { label: '대법원 83다카1819', note: '유권대리와 별도 주장·행위 특정', href: 'https://www.law.go.kr/판례/(83다카1819)' },
    ],
  },
  'amortization-methods': {
    kind: 'repayment-profile-race', summary: '무엇을 고정하거나 뒤로 미뤘는지를 보면 상환액·잔액·총이자의 모양이 동시에 보인다. 동일 금리·기간이라면 원금이 빨리 줄수록 총이자는 작다.',
    profiles: [
      { name: '원리금균등', fixed: '매회 총액 고정', payment: ['▆','▆','▆','▆','▆'], balance: ['█','▇','▅','▃','▁'], cue: '이자↓ · 원금↑' },
      { name: '원금균등', fixed: '매회 원금 고정', payment: ['█','▇','▆','▅','▄'], balance: ['█','▆','▄','▂','▁'], cue: '초기 부담↑ · 총이자↓' },
      { name: '체증식', fixed: '상환액 점차 증가', payment: ['▂','▃','▄','▆','█'], balance: ['█','█','▇','▅','▁'], cue: '장래 소득 증가형' },
      { name: '만기일시', fixed: '이자만 납부', payment: ['▂','▂','▂','▂','█'], balance: ['█','█','█','█','▁'], cue: '원금 만기 일시상환' },
    ],
    ranking: ['원금 감소 빠름','이자 발생 기간 짧음','총이자 작음'],
    sources: [
      { label: '한국주택금융공사 용어사전', note: '원리금균등·원금균등 상환 구조', href: 'https://www.hf.go.kr/ko/sub05/sub05_08_01.do' },
      { label: '주택금융공사 보금자리론', note: '원리금균등·원금균등·체증식 선택', href: 'https://www.hf.go.kr/ko/sub01/sub01_01_01.do' },
    ],
  },
  'duty-of-explanation': {
    kind: 'explanation-duty-checkpoint', summary: '말로 설명하는 시점과 서면을 만드는 시점이 다르다. 먼저 권리 취득 의뢰인에게 근거자료를 제시해 설명하고, 계약서 작성 때 확인·설명서를 양 당사자에게 교부한다.',
    checkpoints: [
      { when: '중개 완성 전', action: '확인·설명', to: '권리를 취득하려는 중개의뢰인', proof: '등기사항증명서·신탁원부·대장 등 근거자료' },
      { when: '거래계약서 작성 때', action: '서면 작성·교부', to: '거래당사자', proof: '원본·사본·전자문서 3년 보존' },
    ],
    scope: [
      { item: '등기된 채권최고액', result: '확인·설명 O' },
      { item: '실제 피담보채무액', result: '별도 조사 의무 X' },
      { item: '중요하지만 법정 열거 밖 정보', result: '거짓 전달 X' },
      { item: '임대인이 자료요구 불응', result: '그 사실을 서면에 기재' },
    ],
    sources: [
      { label: '공인중개사법 제25조', note: '확인·설명, 근거자료, 서면 교부', href: 'https://www.law.go.kr/법령/공인중개사법/제25조' },
      { label: '공인중개사법 시행령 제21조', note: '확인·설명사항과 보존기간', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제21조' },
      { label: '대법원 2020다265857', note: '중요사항의 그릇된 정보 제공 금지', href: 'https://www.law.go.kr/판례/(2020다265857)' },
    ],
  },
  'land-record-notification-procedure': {
    kind: 'cadastral-notice-two-clocks', summary: '지적공부 정리 뒤 통지기한은 정리일 하나로 계산하지 않는다. 표시변경등기가 필요한지는 등기완료 통지 접수일, 필요 없는지는 지적공부 등록일이 출발점이다.',
    clocks: [
      { condition: '표시변경등기 필요', start: '등기완료 통지서 접수', due: '15일 이내', route: '지적정리 → 등기촉탁 → 완료통지 접수 → 소유자 통지' },
      { condition: '표시변경등기 불필요', start: '지적공부 등록', due: '7일 이내', route: '지적정리 → 소유자 통지' },
    ],
    ownerRule: '신규등록은 참조할 등기부가 없으므로 지적소관청이 소유자를 직접 조사하여 등록',
    sources: [
      { label: '공간정보관리법 제88조', note: '토지소유자 등록', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제88조' },
      { label: '공간정보관리법 제89조', note: '토지표시 변경등기 촉탁', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제89조' },
      { label: '공간정보관리법 제90조', note: '지적정리 등의 통지', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제90조' },
      { label: '같은 법 시행령 제85조', note: '15일·7일 기산점', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제85조' },
    ],
  },
  'acquisition-tax-standard-rate': {
    kind: 'acquisition-rate-shelves', summary: '같은 부동산도 취득 원인과 농지 여부가 세율을 바꾼다. 먼저 취득 원인을 고르고, 공유물 분할은 본인 지분 초과분을 별도로 떼어 판정한다.',
    rates: [
      { rate: '2.3%', cases: ['농지 상속','공유·합유·총유물 분할의 법정 범위'] },
      { rate: '2.8%', cases: ['농지 외 상속','원시취득','법정 비영리사업자 무상취득'] },
      { rate: '3.0%', cases: ['농지 유상 등 그 밖의 취득'] },
      { rate: '3.5%', cases: ['상속 외 일반 무상취득'] },
      { rate: '4.0%', cases: ['농지 외 유상 등 그 밖의 취득'] },
    ],
    exception: '공유물 분할로 본인 지분을 초과하여 취득한 부분은 2.3% 분할세율 대상에서 제외',
    sources: [
      { label: '지방세법 제11조', note: '부동산 취득 원인별 표준세율', href: 'https://www.law.go.kr/법령/지방세법/제11조' },
      { label: '대법원 2020두47397', note: '공유물 분할의 지분 초과 판정', href: 'https://www.law.go.kr/판례/(2020두47397)' },
    ],
  },
  'metropolitan-plan': {
    kind: 'metropolitan-authority-router', summary: '광역도시계획은 권역의 행정구역 조합에 따라 공동 수립자가 달라지고, 수립자보다 한 단계 위 기관이 승인하는 구조다. 다만 도지사가 요청받아 공동 수립하는 경우는 승인 예외다.',
    routes: [
      { area: '같은 도 안의 시·군', maker: '시장·군수 공동', approver: '도지사 승인' },
      { area: '둘 이상 시·도', maker: '시·도지사 공동', approver: '국토부장관 승인' },
      { area: '시장·군수 요청', maker: '도지사 + 시장·군수 공동', approver: '국토부 승인 불필요' },
      { area: '지정 후 3년간 승인신청 없음', maker: '도지사가 수립', approver: '제11조 제3항 예외' },
    ],
    finish: ['공청회','지방의회·관계기관 의견','승인','관계 시·도지사가 공고·열람'],
    sources: [
      { label: '국토계획법 제11조', note: '광역도시계획 수립권자', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제11조' },
      { label: '국토계획법 제14조', note: '공청회', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제14조' },
      { label: '국토계획법 제15조', note: '지방의회·관계기관 의견', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제15조' },
      { label: '국토계획법 제16조', note: '승인과 공고·열람', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제16조' },
    ],
  },
  'contract-rescission': {
    kind: 'rescission-signal-console', summary: '해제·해지는 상대방에게 보내는 형성권의 신호다. 명시적 문구가 없어도 행동 전체로 종료 의사가 객관적으로 드러날 수 있지만, 일단 도달하면 일방적으로 되돌릴 수 없다.',
    signal: ['해제권·해지권 발생','명시 또는 묵시 의사표시','상대방에게 도달','철회 불가'],
    tests: [
      { question: '말로 “해제한다”고 했는가?', answer: '필수 아님', detail: '행동·정황으로도 명백하면 묵시적 표시 가능' },
      { question: '상당한 기간을 최고했는가?', answer: '이행지체 해제의 원칙', detail: '정확한 날짜를 반드시 적을 필요는 없음' },
      { question: '정기행위인가?', answer: '무최고 해제 가능', detail: '기한을 넘기면 목적 달성이 불가능한 경우' },
    ],
    sources: [
      { label: '민법 제543조', note: '상대방에 대한 의사표시·철회 금지', href: 'https://www.law.go.kr/법령/민법/제543조' },
      { label: '민법 제544조', note: '이행지체와 상당기간 최고', href: 'https://www.law.go.kr/법령/민법/제544조' },
      { label: '민법 제545조', note: '정기행위의 무최고 해제', href: 'https://www.law.go.kr/법령/민법/제545조' },
      { label: '대법원 2008다23436', note: '묵시적 합의해제의 판단', href: 'https://www.law.go.kr/판례/(2008다23436)' },
    ],
  },
  'cost-approach-appraisal': {
    kind: 'cost-approach-restoration-lab', summary: '원가법은 기준시점에 새로 만드는 비용에서 현재의 감가를 차감해 적산가액을 복원한다. 물리적 낡음뿐 아니라 기능적·경제적 가치 하락도 감가에 포함된다.',
    machine: [{ label: '재조달원가', value: '기준시점 신축·조성 비용', sign: '+' },{ label: '감가수정', value: '물리·기능·경제적 감가', sign: '−' },{ label: '적산가액', value: '현재 대상물건 가액', sign: '=' }],
    example: { cost: '3억원', life: '30년', elapsed: '10년', residual: '0%', depreciation: '1억원', value: '2억원' },
    formula: '정액법 연간 감가액 = 재조달원가 × (1 − 잔가율) ÷ 경제적 내용연수',
    sources: [
      { label: '감정평가에 관한 규칙 제2조', note: '원가법의 법정 정의', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제2조' },
      { label: '감정평가에 관한 규칙 제15조', note: '건물의 원가법 적용', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제15조' },
      { label: '감정평가 실무기준', note: '재조달원가와 감가수정 세부기준', href: 'https://www.law.go.kr/행정규칙/감정평가실무기준' },
    ],
  },
  'fee-calculation-case-problems': {
    kind: 'brokerage-fee-routing-calculator', summary: '중개보수 계산은 곱셈보다 요율표 선택이 먼저다. 겸용건축물의 주택 면적, 복합거래 여부, 월차임 환산 순으로 세 개의 스위치를 통과한다.',
    switches: [{ test: '주택 면적 ≥ 전체의 1/2?', yes: '전체에 주택 요율', no: '주택 외 요율' },{ test: '동일 대상·당사자·기회 + 매매 포함?', yes: '매매금액만 적용', no: '각 거래유형 판정' },{ test: '보증금 + 월차임×100 < 5천만원?', yes: '×70으로 재환산', no: '×100 유지' }],
    worked: { input: '보증금 1,000만원 + 월 30만원', first: '1,000 + 30×100 = 4,000만원', second: '5천만원 미만 → 1,000 + 30×70', result: '거래금액 3,100만원' },
    sources: [
      { label: '공인중개사법 제32조', note: '중개보수 지급과 한도', href: 'https://www.law.go.kr/법령/공인중개사법/제32조' },
      { label: '공인중개사법 시행규칙 제20조', note: '주택·오피스텔 보수 기준', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제20조' },
      { label: '시행규칙 별표 1', note: '주택 중개보수와 거래금액 산정', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/별표1' },
    ],
  },
  'boundary-determination-standards': {
    kind: 'boundary-cross-section-atlas', summary: '지상경계는 평면 지도의 선을 실제 지형의 어느 점에 꽂을지 정하는 규칙이다. 높이차·제방·수면은 각각 하단, 바깥쪽 어깨, 최대 수위라는 서로 다른 단면점을 쓴다.',
    sections: [{ terrain: '연접토지 높낮이 차', marker: '구조물 하단부', sketch: '▔▔│__' },{ terrain: '공유수면매립지 제방 편입', marker: '바깥쪽 어깨부분', sketch: '___╱▔╲≈' },{ terrain: '해면에 접하는 토지', marker: '최대만조위선', sketch: '▔▔▔≈≈' },{ terrain: '수면에 접하는 토지', marker: '최대만수위선', sketch: '▔▔▔≋≋' }],
    buildingRule: '분할선은 원칙적으로 지상건축물을 걸치지 않게 결정 · 확정판결 등 법정 예외는 허용',
    sources: [
      { label: '공간정보관리법 제65조', note: '지상경계의 구분·등록', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제65조' },
      { label: '같은 법 시행령 제55조', note: '하단·어깨·최대만조·만수위 기준', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제55조' },
    ],
  },
  'registration-tax-standard-rate': {
    kind: 'registration-tax-rights-ledger', summary: '0.2%라는 세율만 외우면 절반만 맞는다. 권리별로 무엇에 0.2%를 곱하는지 과세표준을 함께 연결해야 한다.',
    rights: [{ right: '지상권', base: '부동산 가액', rate: '0.2%' },{ right: '저당권', base: '채권금액', rate: '0.2%' },{ right: '지역권', base: '요역지 가액', rate: '0.2%' },{ right: '전세권', base: '전세금액', rate: '0.2%' },{ right: '임차권', base: '월 임대차금액', rate: '0.2%' }],
    example: '전세금 2억원 × 0.2% = 등록면허세 40만원(지방교육세 등 별도)',
    place: '재산이 둘 이상 지방자치단체에 걸치고 세액 배분이 불가능 → 등록관청 소재지',
    sources: [
      { label: '지방세법 제25조', note: '등록면허세 납세지', href: 'https://www.law.go.kr/법령/지방세법/제25조' },
      { label: '지방세법 제27조', note: '등록별 과세표준', href: 'https://www.law.go.kr/법령/지방세법/제27조' },
      { label: '지방세법 제28조', note: '권리별 표준세율', href: 'https://www.law.go.kr/법령/지방세법/제28조' },
    ],
  },
  'use-district-subdivision-types': {
    kind: 'use-district-family-tree', summary: '용도지구 세분은 비슷한 이름을 다른 가족에 끼워 넣는 방식으로 출제된다. 상위 지구마다 실제 자녀 명칭을 묶고, 존재하지 않는 가짜 명칭을 별도 격리한다.',
    families: [{ parent: '경관지구', children: ['자연경관','시가지경관','특화경관'] },{ parent: '방재지구', children: ['시가지방재','자연방재'] },{ parent: '보호지구', children: ['역사문화환경보호','중요시설물보호','생태계보호'] },{ parent: '취락지구', children: ['자연취락','집단취락'] },{ parent: '개발진흥지구', children: ['주거','산업·유통','관광·휴양','복합','특정'] }],
    fakes: ['주거경관지구','특정개발방재지구','농어촌취락지구','중요시설물개발진흥지구'],
    sources: [
      { label: '국토계획법 제37조', note: '용도지구의 지정 목적과 종류', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제37조' },
      { label: '국토계획법 시행령 제31조', note: '용도지구의 세분', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제31조' },
    ],
  },
  'earnest-money-rescission': {
    kind: 'earnest-money-exit-gate', summary: '해약금 해제는 채무불이행을 묻지 않고 빠져나가는 출구지만, 당사자 한쪽이 객관적으로 이행에 착수하면 문이 닫힌다. 매도인은 배액을 말로 약속하는 데 그치지 않고 실제 상환 또는 이행제공해야 한다.',
    gate: [
      { actor: '매수인', action: '교부한 계약금 포기', effect: '해제' },
      { actor: '매도인', action: '받은 계약금 배액 상환·이행제공', effect: '해제' },
    ],
    timeline: ['계약금 교부','해약금 추정','상대방 이행착수 전','포기·배액상환','계약 종료'],
    closes: ['중도금 지급 등 이행착수','해약금 해제 배제 특약'],
    sources: [
      { label: '민법 제565조', note: '해약금 해제와 이행착수 제한', href: 'https://www.law.go.kr/법령/민법/제565조' },
      { label: '대법원 2020다213364', note: '배액의 현실 상환·이행제공 필요', href: 'https://www.law.go.kr/판례/(2020다213364)' },
      { label: '대법원 2023다302920', note: '이행기 전 이행착수와 예외', href: 'https://www.law.go.kr/판례/(2023다302920)' },
    ],
  },
  'official-land-price-system': {
    kind: 'official-price-twin-process', summary: '표준지는 전국 가격의 기준점을 만들고, 개별지는 그 기준점에 토지가격비준표를 적용한다. 두 절차 모두 공시 후 30일 이의신청이지만 결정 주체와 쓰임이 다르다.',
    lanes: [
      { name: '표준지공시지가', actor: '국토교통부장관', process: ['조사·평가 의뢰','중앙위원회 심의','공시','30일 이의신청'], use: '지가산정·감정평가의 기준' },
      { name: '개별공시지가', actor: '시장·군수·구청장', process: ['표준지 선택','비준표 적용·산정','검증·위원회 심의','결정·공시','30일 이의신청'], use: '부담금·조세 등 개별 필지 기준' },
    ],
    noIndividual: ['표준지로 선정된 토지','법정 부담금·국세 등의 대상이 아닌 일부 토지'],
    sources: [
      { label: '부동산가격공시법 제3조', note: '표준지공시지가 조사·평가·공시', href: 'https://www.law.go.kr/법령/부동산가격공시에관한법률/제3조' },
      { label: '같은 법 제7조', note: '표준지 이의신청 30일', href: 'https://www.law.go.kr/법령/부동산가격공시에관한법률/제7조' },
      { label: '같은 법 제10조', note: '개별공시지가 결정·공시', href: 'https://www.law.go.kr/법령/부동산가격공시에관한법률/제10조' },
      { label: '같은 법 제11조', note: '개별지가 이의신청 30일', href: 'https://www.law.go.kr/법령/부동산가격공시에관한법률/제11조' },
    ],
  },
  'reward-reporting-center': {
    kind: 'reward-claim-funnel', summary: '신고했다고 바로 50만원이 생기지 않는다. 행정기관이 먼저 적발하기 전 신고하고, 검사의 공소제기 또는 기소유예를 거쳐 등록관청에 신청해야 한다.',
    funnel: ['법정 위반행위 발견','선제 신고·고발','공소제기 또는 기소유예','등록관청에 지급신청','결정일부터 1개월 내 50만원'],
    allocation: [
      { situation: '2인 이상 공동신고', result: '합의 우선 · 없으면 균등배분' },
      { situation: '같은 사건에 별개 신고 2건 이상', result: '최초 신고·고발자만 지급' },
    ],
    targets: ['무등록 중개업','부정한 개설등록','등록증·자격증 양도·대여','무자격 표시·광고','법정 시세교란·업무방해'],
    sources: [
      { label: '공인중개사법 제46조', note: '포상금 대상행위', href: 'https://www.law.go.kr/법령/공인중개사법/제46조' },
      { label: '공인중개사법 시행령 제36조의2', note: '50만원·공소제기·기소유예', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제36조의2' },
      { label: '공인중개사법 시행규칙 제28조', note: '신청·지급·공동·중복 신고', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제28조' },
    ],
  },
  'land-integrated-registry': {
    kind: 'integrated-register-dashboard', summary: '부동산종합공부는 새 원본을 만드는 장부가 아니라 여러 관리기관의 원본 정보를 한 화면에 연결하는 대시보드다. 불일치는 해당 원본 관리기관에 정정 요청이 전달된다.',
    feeds: [
      { source: '지적공부', data: '토지 표시·소유자' },
      { source: '건축물대장', data: '건축물 표시·소유자' },
      { source: '토지이용계획확인서', data: '이용·규제' },
      { source: '가격공시', data: '지가·주택가격' },
      { source: '부동산등기', data: '권리에 관한 사항' },
    ],
    services: ['지적소관청 관리·영구보존','지적소관청·읍면동 열람','전부·일부 증명서 발급','불일치 확인 → 원본기관 정정'],
    sources: [
      { label: '공간정보관리법 제76조의2', note: '관리·운영·영구보존', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제76조의2' },
      { label: '같은 법 제76조의3', note: '등록사항 5개 정보군', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제76조의3' },
      { label: '같은 법 제76조의4', note: '열람·증명서 발급', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제76조의4' },
      { label: '같은 법 시행령 제62조의3', note: '불일치 등록사항 정정', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제62조의3' },
    ],
  },
  'property-tax-fair-market-ratio': {
    kind: 'fair-market-ratio-mixer', summary: '재산세 과세표준은 시가표준액을 그대로 쓰지 않고 물건별 혼합비율을 적용한다. 2026년 1세대 1주택은 9억원 초과 여부와 무관하게 세 구간 43%·44%·45%를 적용한다.',
    standard: [{ asset: '토지·건축물', ratio: 70 },{ asset: '일반 주택', ratio: 60 }],
    oneHome2026: [{ range: '3억원 이하', ratio: 43 },{ range: '3억원 초과~6억원 이하', ratio: 44 },{ range: '6억원 초과', ratio: 45 }],
    example: '시가표준액 5억원 일반 토지 × 70% = 과세표준 3억 5천만원',
    sources: [
      { label: '지방세법 제110조', note: '재산세 과세표준 산식', href: 'https://www.law.go.kr/법령/지방세법/제110조' },
      { label: '지방세법 시행령 제109조', note: '2026년 70·60·43·44·45%', href: 'https://www.law.go.kr/법령/지방세법시행령/제109조' },
      { label: '지방세법 시행령 제110조의2', note: '1세대 1주택 인정범위', href: 'https://www.law.go.kr/법령/지방세법시행령/제110조의2' },
    ],
  },
  'floor-area-ratio-comparison': {
    kind: 'floor-area-ratio-skyline', summary: '용적률은 대지면적 대비 연면적 비율이다. 시험 수치는 시행령이 정한 전국 상한이고, 실제 적용값은 그 범위 안에서 도시·군계획조례가 정한다.',
    skyline: [
      { zone: '보전녹지·농림', max: 80 },{ zone: '계획관리', max: 100 },{ zone: '제3종일반주거', max: 300 },{ zone: '일반공업', max: 350 },{ zone: '준공업', max: 400 },{ zone: '준주거', max: 500 },{ zone: '근린상업', max: 900 },
    ],
    formula: '용적률 = 대지 안 건축물 연면적 ÷ 대지면적 × 100',
    caution: '시행령 상한 ≠ 모든 지역의 실제 허용치 · 조례와 지구단위계획 등 추가 확인',
    sources: [
      { label: '국토계획법 제78조', note: '용도지역별 용적률', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제78조' },
      { label: '국토계획법 시행령 제85조', note: '지역별 법정 범위와 상한', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제85조' },
    ],
  },
  'repurchase-right': {
    kind: 'repurchase-boomerang-timeline', summary: '환매특약은 소유권이 돌아올 수 있는 길을 매매와 동시에 열어 두는 장치다. 제3자에게도 주장하려면 매매등기와 동시에 특약을 등기하고, 부동산 환매기간은 최장 5년에서 멈춘다.',
    stages: [{ name: '매매계약', detail: '매도인 → 매수인' },{ name: '동시 등기', detail: '소유권이전 + 환매특약' },{ name: '제3자 취득', detail: '등기된 특약이면 대항' },{ name: '환매 실행', detail: '대금·매매비용 반환' }],
    clocks: [{ condition: '기간을 정함', result: '부동산 최장 5년', note: '5년 초과 약정은 5년으로 단축' },{ condition: '기간을 정하지 않음', result: '5년', note: '나중에 연장할 수 없음' }],
    case: 'A가 B에게 토지를 팔면서 7년 환매를 약정해도 환매기간은 5년이다. 특약등기가 매매등기보다 늦으면 그 사이 취득한 C에게 대항하기 어렵다.',
    sources: [{ label: '민법 제590조', note: '환매의 의의·환매대금', href: 'https://www.law.go.kr/법령/민법/제590조' },{ label: '민법 제591조', note: '부동산 5년·연장 금지', href: 'https://www.law.go.kr/법령/민법/제591조' },{ label: '민법 제592조', note: '환매등기의 제3자 효력', href: 'https://www.law.go.kr/법령/민법/제592조' }],
  },
  'business-cycle-cobweb': {
    kind: 'cobweb-stability-spirals', summary: '거미집이론은 생산에 시간이 걸려 오늘의 가격을 보고 다음 기의 공급량을 정할 때 가격·수량이 균형으로 모이는지 판정한다. 축의 기울기 절댓값을 같은 방식으로 비교해야 한다.',
    patterns: [{ type: '수렴형', demand: '|수요 기울기| > 공급 기울기', points: [92,74,60,51,46], cue: '충격이 점점 작아짐' },{ type: '순환형', demand: '|수요 기울기| = 공급 기울기', points: [88,35,88,35,88], cue: '같은 폭 반복' },{ type: '발산형', demand: '|수요 기울기| < 공급 기울기', points: [54,66,82,98,116], cue: '충격이 점점 커짐' }],
    delay: ['올해 가격 관찰','생산량 결정','다음 기 공급','새 가격 형성'],
    example: '수요곡선 기울기 절댓값 3, 공급곡선 기울기 1이면 3 > 1이므로 수렴형이다.',
    sources: [{ label: 'KOCW 경제학개론', note: '시장균형과 동태적 조정 학습자료', href: 'http://www.kocw.net/home/search/kemView.do?kemId=1050166' },{ label: '공인중개사 시험 출제범위', note: '부동산학개론 경제론', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' }],
  },
  'transaction-report-form': {
    kind: 'transaction-form-blueprint', summary: '거래신고서는 계약 내용을 칸에 옮기는 지도다. 건축물 종류에 따라 면적 칸을 바꾸고, 여러 부동산이면 각각의 거래가격을 분리하며, 실제 조건·기한이 있을 때만 조건란을 채운다.',
    fields: [{ label: '당사자', value: '매도인·매수인 인적사항', tone: 'party' },{ label: '대상', value: '소재지·지목·면적', tone: 'object' },{ label: '가격', value: '부동산별 거래가격', tone: 'price' },{ label: '계약', value: '계약일·중도금·잔금일', tone: 'date' }],
    areaChoice: [{ building: '집합건축물', use: '전유부분 면적' },{ building: '그 밖의 건축물', use: '연면적' }],
    checks: ['둘 이상 부동산 → 각각 가격 기재','조건·기한 → 실제 약정한 경우만','개업공인중개사 작성 계약 → 중개사 정보 기재'],
    sources: [{ label: '부동산거래신고법 제3조', note: '계약일부터 30일 내 공동신고', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제3조' },{ label: '같은 법 시행규칙 제2조', note: '신고서 제출·서명 방식', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률시행규칙/제2조' },{ label: '시행규칙 별지 제1호서식', note: '현행 부동산거래계약 신고서', href: 'https://www.law.go.kr/법령별표서식/(부동산거래신고등에관한법률시행규칙,서식1)' }],
  },
  'survey-required-cases-and-types': {
    kind: 'survey-necessity-detector', summary: '지적측량 필요 여부는 장부가 바뀌는지가 아니라 새 경계·좌표·면적을 정하거나 현황과 등록경계를 맞춰 볼 필요가 있는지로 판정한다. 합병은 없애는 경계만 있어 원칙적으로 측량하지 않는다.',
    inputs: [{ event: '신규등록·등록전환', verdict: '측량', type: '등록측량' },{ event: '분할·경계복원', verdict: '측량', type: '경계 결정·복원' },{ event: '건축물 현황 대조', verdict: '측량', type: '지적현황측량' },{ event: '토지 합병', verdict: '측량 없음', type: '새 경계·좌표 없음' }],
    compare: [{ type: '경계복원측량', question: '도면의 경계를 땅 위에 되살리는가?' },{ type: '지적현황측량', question: '건축물 등 실제 현황을 등록경계와 대조하는가?' }],
    sources: [{ label: '공간정보관리법 제23조', note: '지적측량 실시 사유', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제23조' },{ label: '공간정보관리법 제24조', note: '토지소유자 등의 측량 의뢰', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제24조' },{ label: '지적측량 시행규칙 제28조', note: '경계복원·지적현황측량', href: 'https://www.law.go.kr/행정규칙/지적측량시행규칙/제28조' }],
  },
  'tax-appeal-procedure': {
    kind: 'tax-appeal-route-map', summary: '현행 지방세 불복의 본선은 90일짜리 두 갈래다. 이의신청을 거친 뒤 심판청구하거나 바로 심판청구할 수 있고, 과태료는 이 선로에 들어오지 않는다.',
    routes: [{ start: '지방세 처분 통지', path: ['90일 내 이의신청','결정 통지','90일 내 심판청구','행정소송'] },{ start: '지방세 처분 통지', path: ['90일 내 곧바로 심판청구','결정 통지','행정소송'] }],
    excluded: ['지방세기본법상 과태료 부과','통고처분'],
    family: { threshold: '신청금액 2천만원 미만', people: ['배우자','4촌 이내 혈족','배우자의 4촌 이내 혈족'] },
    sources: [{ label: '지방세기본법 제89조', note: '불복 대상과 제외 처분', href: 'https://www.law.go.kr/법령/지방세기본법/제89조' },{ label: '지방세기본법 제90조', note: '이의신청 90일', href: 'https://www.law.go.kr/법령/지방세기본법/제90조' },{ label: '지방세기본법 제91조', note: '심판청구 두 경로·90일', href: 'https://www.law.go.kr/법령/지방세기본법/제91조' },{ label: '지방세기본법 제93조', note: '2천만원 미만 가족 대리', href: 'https://www.law.go.kr/법령/지방세기본법/제93조' }],
  },
  'urban-planning-facility-project-implementation': {
    kind: 'facility-project-control-panel', summary: '도시·군계획시설사업은 먼저 사업 범위로 시행자 결정권자를 찾고, 다음에는 시행자가 행정청인지로 토지 출입 허가 여부를 가른다. 민간 시행자 지정에는 원칙적으로 토지 3분의 2 소유와 소유자 총수 2분의 1 동의가 함께 필요하다.',
    scope: [{ area: '한 행정구역', authority: '관할 지자체 시행' },{ area: '같은 도의 둘 이상 시·군', authority: '협의 불성립 → 도지사' },{ area: '둘 이상 시·도', authority: '협의 불성립 → 국토부장관' }],
    access: [{ actor: '행정청인 시행자', action: '7일 전 통지', permit: '출입허가 불필요' },{ actor: '비행정청 시행자', action: '시장·군수 허가', permit: '허가 후 출입' },{ actor: '타인 토지 일시사용', action: '미리 허가', permit: '손실은 보상' }],
    privateGate: ['대상 토지 2/3 이상 소유','토지소유자 총수 1/2 이상 동의'],
    sources: [{ label: '국토계획법 제86조', note: '시행자 결정·지정', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제86조' },{ label: '국토계획법 시행령 제96조', note: '민간 시행자 소유·동의 요건', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제96조' },{ label: '국토계획법 제130조', note: '출입·일시사용·사전통지', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제130조' },{ label: '국토계획법 제131조', note: '출입 등에 따른 손실보상', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제131조' }],
  },
  'unilateral-promise-to-sell': {
    kind: 'reservation-option-console', summary: '매매의 일방예약은 완결권자가 스위치를 누르는 순간 본계약이 성립하는 옵션이다. 행사기간 약정이 없을 때만 판례상 10년 제척기간이 적용되고, 예약자는 상당기간을 정해 확답을 최고할 수 있다.',
    switchFlow: ['일방예약 성립','완결권 보유','완결 의사표시','매매 효력 발생'],
    timers: [{ setting: '행사기간 약정 있음', due: '약정기간', note: '기간 길이에 특별한 법정 상한 없음' },{ setting: '행사기간 약정 없음', due: '예약일부터 10년', note: '제척기간 · 점유해도 중단되지 않음' }],
    demand: { actor: '예약자', action: '상당한 기간을 정해 확답 최고', silence: '기간 내 확답 없음 → 예약 효력 상실' },
    sources: [{ label: '민법 제564조', note: '일방예약·완결·확답 최고', href: 'https://www.law.go.kr/법령/민법/제564조' },{ label: '대법원 2016다42077', note: '10년 제척기간·약정기간 상한 없음', href: 'https://www.law.go.kr/판례/(2016다42077)' },{ label: '대법원 91다44766', note: '점유해도 제척기간 소멸', href: 'https://www.law.go.kr/판례/(91다44766)' }],
  },
  'location-theory-huff-reilly': {
    kind: 'retail-gravity-balance', summary: '레일리는 큰 도시와 가까운 도시가 더 강하게 구매력을 끌어당긴다고 보고, 컨버스는 두 도시의 끌림이 같아지는 분기점을 거리 위에 찍는다.',
    cities: [{ name: 'A도시', population: '40만', strength: 4 },{ name: 'B도시', population: '10만', strength: 1 }],
    formula: 'A에서 분기점까지 거리 = 도시 간 거리 ÷ (1 + √(B인구 ÷ A인구))',
    worked: ['도시 간 30km','30 ÷ (1 + √10/40)','30 ÷ 1.5','A에서 20km · B에서 10km'],
    laws: [{ name: '레일리', cue: '흡인력', rule: '인구에 비례 · 거리²에 반비례' },{ name: '컨버스', cue: '경계점', rule: '두 상권 구매지향력이 같은 지점' },{ name: '허프', cue: '선택확률', rule: '개별 소비자의 매장 이용확률' }],
    sources: [{ label: 'Q-Net 출제기준', note: '부동산학개론 시장론·입지론', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },{ label: 'KOCW 부동산학개론', note: '상권·입지 이론 공개강의', href: 'http://www.kocw.net/home/search/kemView.do?kemId=1050166' }],
  },
  'transaction-report-penalty': {
    kind: 'transaction-sanction-scale', summary: '같은 신고법 위반도 제재 축이 다르다. 무허가 토지계약은 토지가격에 연동된 형사벌이고, 거래대금 증빙자료 미제출·거짓제출은 행정질서벌인 과태료다.',
    lanes: [{ violation: '무허가·부정허가 토지계약', sanction: '2년 이하 징역', alternative: '토지가격 30% 이하 벌금', type: '형사벌' },{ violation: '거래대금 증빙 미제출·거짓제출', sanction: '3천만원 이하', alternative: '과태료', type: '행정질서벌' }],
    calculator: { land: '개별공시지가 기준 2억원', rate: '× 30%', maximum: '벌금 상한 6천만원' },
    validity: ['허가 전 계약','유동적 무효','허가 → 확정적 유효','불허가 → 확정적 무효'],
    sources: [{ label: '부동산거래신고법 제11조', note: '토지거래계약 허가', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제11조' },{ label: '같은 법 제26조', note: '2년·토지가격 30% 이하', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제26조' },{ label: '같은 법 제28조', note: '자료 미제출 3천만원 이하 과태료', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제28조' }],
  },
  'cadastral-committee-composition': {
    kind: 'cadastral-committee-table', summary: '중앙지적위원회 문제는 사람 수, 당연직 자리, 회의 통지, 심의사항을 네 칸으로 분리하면 섞이지 않는다. 특히 지적재조사 기본계획은 이 위원회의 법정 심의사항이 아니다.',
    seats: { minimum: 5, maximum: 10, chair: '지적업무 담당 국장', vice: '지적업무 담당 과장', memberTerm: '그 밖의 위원 임기 2년' },
    meeting: [{ item: '소집 통지', value: '회의 5일 전까지 서면' },{ item: '개의', value: '재적위원 과반수 출석' },{ item: '의결', value: '출석위원 과반수 찬성' }],
    agenda: [{ name: '적부심사 재심사', result: '심의·의결' },{ name: '지적기술자 양성', result: '심의·의결' },{ name: '지적측량 기술 개발·보급', result: '심의·의결' },{ name: '지적재조사 기본계획', result: '해당 없음' }],
    sources: [{ label: '공간정보관리법 제28조', note: '중앙지적위원회 심의사항', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제28조' },{ label: '같은 법 시행령 제20조', note: '5~10명·위원장·임기', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제20조' },{ label: '같은 법 시행령 제21조', note: '5일 전 통지·회의 운영', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제21조' }],
  },
  'acquisition-tax-base': {
    kind: 'acquisition-price-basket', summary: '취득세 취득가격은 명칭보다 취득을 위해 실제로 부담한 대가인지로 장바구니에 넣는다. 인수채무와 법정 채권 매각차손은 포함되지만 전기사용자 분담금은 제외된다.',
    basket: [{ item: '매도인 채무 인수·변제', result: '포함', why: '취득대가의 일부' },{ item: '국민주택채권 매각차손', result: '포함', why: '법령상 의무매입 관련 비용' },{ item: '할부·연부 이자', result: '포함', why: '취득자가 부담하는 간접비용' },{ item: '전기사용자 분담 비용', result: '제외', why: '법정 제외항목' }],
    equation: ['직접 지급액','+ 인수채무','+ 간접비용','− 법정 제외비용','= 취득가격'],
    example: '매매대금 3억원 + 매도인 채무 5천만원 + 채권 매각차손 200만원 = 취득가격 3억 5,200만원',
    sources: [{ label: '지방세법 제10조의3', note: '유상승계취득 과세표준', href: 'https://www.law.go.kr/법령/지방세법/제10조의3' },{ label: '지방세법 시행령 제18조', note: '사실상취득가격 포함·제외항목', href: 'https://www.law.go.kr/법령/지방세법시행령/제18조' }],
  },
  'development-density-facility-charge-district': {
    kind: 'density-charge-twin-board', summary: '두 구역은 기반시설 부족에 대응하지만 처방이 다르다. 개발밀도관리구역은 건폐율·용적률을 강화하고, 기반시설부담구역은 설치계획과 비용부담으로 시설을 확보한다.',
    twins: [{ name: '개발밀도관리구역', symptom: '공급·수용능력 부족 예상', tool: '건폐율·용적률 강화', process: ['지정기준 검토','지방도시계획위원회 심의','지정·고시'], color: 'density' },{ name: '기반시설부담구역', symptom: '개발로 기반시설 부족 예상', tool: '설치계획 + 설치비용', process: ['주민의견 청취','지방도시계획위원회 심의','지정·고시'], color: 'charge' }],
    locks: ['같은 지역에 중복 지정 불가','설치계획 1년 내 미수립 → 다음 날 지정 해제','철거 후 신축 → 기존 연면적 초과분만 부과'],
    sources: [{ label: '국토계획법 제66조', note: '개발밀도관리구역과 강화 적용', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제66조' },{ label: '국토계획법 제67조', note: '기반시설부담구역 지정', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제67조' },{ label: '국토계획법 제68조', note: '기반시설설치비용 부과대상', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제68조' },{ label: '국토계획법 시행령 제63조', note: '밀도 강화 범위·지정기준', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제63조' }],
  },
  'exchange-contract': {
    kind: 'exchange-contract-scales', summary: '교환은 금전이 아닌 재산권을 서로 이전하기로 합의하면 성립한다. 실제 인도나 서면은 성립요건이 아니며, 가치 차이를 메우는 보충금 부분만 매매대금 규정을 따라간다.',
    sides: [{ party: '甲', gives: 'A토지', receives: 'B상가' },{ party: '乙', gives: 'B상가', receives: 'A토지' }],
    traits: ['낙성계약','불요식계약','유상·쌍무계약','금전 외 재산권 상호이전'],
    supplement: { imbalance: 'A토지 5억원 ↔ B상가 4억원', cash: '乙이 보충금 1억원 지급', rule: '1억원에 매매대금 규정 준용' },
    risk: ['쌍방 무귀책 불능','민법 제537조','상대방 급부도 청구 불가'],
    sources: [{ label: '민법 제596조', note: '교환의 성립·재산권 상호이전', href: 'https://www.law.go.kr/법령/민법/제596조' },{ label: '민법 제597조', note: '보충금에 매매대금 규정 준용', href: 'https://www.law.go.kr/법령/민법/제597조' },{ label: '민법 제537조', note: '채무자 위험부담 원칙', href: 'https://www.law.go.kr/법령/민법/제537조' }],
  },
  'huff-probability-model': {
    kind: 'huff-probability-lab', summary: '허프모형은 각 매장의 매력도를 거리저항으로 할인한 뒤 전체 점수에서 차지하는 비율을 방문확률로 바꾼다. 마찰계수가 클수록 먼 매장이 더 빠르게 불리해진다.',
    formula: 'Pᵢⱼ = (Sⱼ ÷ Dᵢⱼᵇ) ÷ Σ(Sₖ ÷ Dᵢₖᵇ)',
    stores: [{ name: 'A매장', size: 400, distance: 2, score: 100, probability: 80 },{ name: 'B매장', size: 100, distance: 2, score: 25, probability: 20 }],
    friction: [{ good: '편의품·교통 불편', beta: 'b 큼', effect: '거리저항 강함' },{ good: '전문품·교통 편리', beta: 'b 작음', effect: '먼 거리도 감수' }],
    sales: '상권 소비지출 5억원 × A 방문확률 80% = A 예상매출 4억원',
    sources: [{ label: 'Q-Net 출제기준', note: '부동산학개론 입지·상권 이론', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },{ label: 'KOCW 부동산학개론', note: '입지론 공개강의', href: 'http://www.kocw.net/home/search/kemView.do?kemId=1050166' }],
  },
  'housing-lease-reporting': {
    kind: 'lease-report-threshold-gate', summary: '주택임대차 신고는 세 숫자를 순서대로 통과한다. 보증금 6천만원 초과 또는 월차임 30만원 초과이면 계약일부터 30일 이내 신고하고, 상대방이 거부하면 단독신고가 가능하다.',
    gates: [{ test: '보증금', pass: '6천만원 초과' },{ test: '월차임', pass: '30만원 초과' },{ test: '신고기한', pass: '계약일부터 30일' }],
    cases: [{ contract: '보증금 6천만원 · 월 30만원', result: '신고대상 아님', why: '둘 다 “초과”하지 않음' },{ contract: '보증금 6,001만원 · 월 0원', result: '신고대상', why: '보증금 기준 통과' },{ contract: '보증금 1천만원 · 월 31만원', result: '신고대상', why: '월차임 기준 통과' }],
    routes: ['공동신고 원칙','상대방 거부 → 단독신고','전입신고 때 계약서 제출 → 임대차신고 의제','신고 접수 → 확정일자 자동 부여'],
    sources: [{ label: '부동산거래신고법 제6조의2', note: '30일·공동 및 단독신고', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제6조의2' },{ label: '같은 법 제6조의3', note: '변경·해제 신고와 거부 예외', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제6조의3' },{ label: '같은 법 시행령 제4조의3', note: '6천만원·30만원 초과', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률시행령/제4조의3' },{ label: '같은 법 제6조의5', note: '전입신고 의제·확정일자', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제6조의5' }],
  },
  'survey-request-and-benchmark-access': {
    kind: 'survey-request-switchboard', summary: '지적측량 문제는 먼저 의뢰 가능한 사유인지 확인하고, 성과를 찾을 때는 기준점 등급에 맞는 창구를 고른다. 지적삼각점만 시·도지사와 지적소관청 두 창구를 쓸 수 있다.',
    request: [{ situation: '토지소유자·이해관계인의 법정 측량 필요', route: '지적측량수행자에게 의뢰' },{ situation: '지적측량성과 검사', route: '개인 의뢰 대상 아님' },{ situation: '지적재조사사업 측량', route: '개인 의뢰 대상 아님' }],
    desk: [{ point: '지적삼각점성과', office: '시·도지사 또는 지적소관청' },{ point: '지적삼각보조점성과', office: '지적소관청' },{ point: '지적도근점성과', office: '지적소관청' }],
    plan: ['측량 의뢰 접수','다음 날까지 수행계획서 제출','측량기간·일자·수수료 기재','지적소관청 확인'],
    sources: [{ label: '공간정보관리법 제24조', note: '지적측량 의뢰 주체·사유', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제24조' },{ label: '같은 법 시행규칙 제25조', note: '의뢰서·수행계획서', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제25조' },{ label: '같은 법 시행규칙 제26조', note: '기준점별 열람·발급 창구', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제26조' }],
  },
  'acquisition-timing': {
    kind: 'acquisition-clock-dial', summary: '취득세 시계는 등기일 하나로 고정되지 않는다. 취득 원인별 사실상 권리취득 시점을 먼저 찾고, 그보다 앞서 등기·등록하면 조기 등기일이 시계를 당긴다.',
    clocks: [{ cause: '상속', time: '상속개시일', cue: '등기일 무관' },{ cause: '유상승계', time: '사실상 잔금지급일', cue: '객관적 취득가격 입증' },{ cause: '연부취득', time: '사실상 연부금 지급일마다', cue: '등기 먼저 하면 등기일' },{ cause: '재건축 비조합원용 토지', time: '소유권이전고시 다음 날', cue: '조합 취득' }],
    override: ['사실상 취득일','등기·등록일','둘 중 앞선 날'],
    example: '잔금일이 8월 30일인데 8월 10일 먼저 소유권이전등기를 했다면 취득일은 8월 10일이다.',
    sources: [{ label: '지방세법 제7조', note: '사실상 취득과 납세의무', href: 'https://www.law.go.kr/법령/지방세법/제7조' },{ label: '지방세법 시행령 제20조', note: '원인별 취득시기·조기등기', href: 'https://www.law.go.kr/법령/지방세법시행령/제20조' }],
  },
  'infrastructure-inducing-coefficient': {
    kind: 'infrastructure-demand-meter', summary: '기반시설유발계수는 건축물 1㎡가 만들어내는 기반시설 수요의 상대값이다. 관광휴게시설은 1.9로 큰 편이며, 별표상 용도계수와 법정 제외시설 여부를 차례로 판정한다.',
    meter: [{ use: '관광휴게시설', coefficient: 1.9 },{ use: '제2종 근린생활시설', coefficient: 1.6 },{ use: '단독주택', coefficient: 0.7 },{ use: '비금속 광물 제조공장', coefficient: 0.4 }],
    excluded: [{ facility: '사립유치원', result: '제외' },{ facility: '주한 국제기구 소유 건축물', result: '제외' },{ facility: '재정비촉진 임대주택', result: '제외' },{ facility: '상업지역 농수산물집하장', result: '부과대상' }],
    formula: '기반시설설치비용 = 기반시설 표준시설비용 × 용지환산계수 × 건축연면적 × 유발계수 등',
    sources: [{ label: '국토계획법 제68조', note: '기반시설설치비용 부과대상', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제68조' },{ label: '국토계획법 시행령 제64조', note: '유발시설·제외범위', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제64조' },{ label: '시행령 별표 1의3', note: '용도별 유발계수 0.4~1.9', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/별표1의3' }],
  },
  'lease-cost-reimbursement': {
    kind: 'lease-expense-triage', summary: '임차인의 지출은 목적과 시점으로 분류한다. 보존을 위한 필요비는 지출 즉시, 객관적 가치 증가를 위한 유익비는 임대차 종료 시 증가가 남아 있을 때 청구한다.',
    triage: [{ type: '필요비', purpose: '임차물 보존', when: '지출 즉시', example: '누수 긴급수리' },{ type: '유익비', purpose: '객관적 가치 증가', when: '임대차 종료 시', example: '건물 자체 가치가 남는 개량' },{ type: '특수목적비', purpose: '임차인 영업·취향', when: '상환 불가', example: '카페 전용 인테리어' }],
    choice: ['실제 지출액','현존 가치증가액','임대인이 하나를 선택'],
    delay: '법원은 임대인의 청구가 있으면 유익비에 상당한 상환기간을 허여할 수 있다.',
    sources: [{ label: '민법 제626조', note: '필요비·유익비 상환시기와 범위', href: 'https://www.law.go.kr/법령/민법/제626조' },{ label: '대법원 91다8029', note: '객관적 가치증가와 특수목적비 구별', href: 'https://www.law.go.kr/판례/(91다8029)' },{ label: '대법원 2001다64752', note: '지출액·증가액 중 임대인의 선택', href: 'https://www.law.go.kr/판례/(2001다64752)' }],
  },
  'location-quotient-calculation': {
    kind: 'location-quotient-calculator', summary: '입지계수는 지역 안에서 그 산업이 차지하는 비중을 전국의 같은 산업 비중으로 나눈 값이다. 1을 넘으면 전국 평균보다 특화되어 외부수요를 담당하는 기반산업으로 본다.',
    inputs: { localIndustry: 200, localTotal: 1000, nationalIndustry: 1000, nationalTotal: 10000 },
    steps: ['지역 산업비중 200÷1,000 = 20%','전국 산업비중 1,000÷10,000 = 10%','LQ = 20%÷10% = 2.0'],
    verdicts: [{ range: 'LQ > 1', result: '특화 · 기반산업' },{ range: 'LQ = 1', result: '전국 평균 수준' },{ range: 'LQ < 1', result: '비특화 · 비기반산업' }],
    sources: [{ label: 'Q-Net 출제기준', note: '부동산학개론 입지·도시경제 이론', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },{ label: 'KOSIS 지역산업 자료', note: '산업별 종사자 통계 원자료', href: 'https://kosis.kr/' }],
  },
  'foreigner-acquisition-deadlines-and-permits': {
    kind: 'foreigner-acquisition-calendar', summary: '외국인등의 취득은 원인별 신고시계와 민감구역의 사전허가 게이트를 나눠 본다. 계약취득 60일, 계약 외 취득 6개월이며 허가대상 토지는 계약 전에 허가를 받아야 한다.',
    clocks: [{ cause: '매매·증여 등 계약', deadline: '계약일부터 60일' },{ cause: '상속·경매·확정판결·신축', deadline: '취득일부터 6개월' },{ cause: '국민·국내법인이 외국인등으로 변경', deadline: '변경일부터 6개월' }],
    permit: ['허가대상 구역 확인','계약체결 전 허가신청','원칙 15일 내 처분','부득이하면 30일 범위 연장'],
    overlap: '토지거래계약허가를 받은 경우 같은 토지의 외국인 토지취득허가는 다시 받지 않는다.',
    sources: [{ label: '부동산거래신고법 제8조', note: '60일·6개월 취득·보유 신고', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제8조' },{ label: '같은 법 제9조', note: '허가대상 토지와 사전허가', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제9조' },{ label: '같은 법 시행령 제6조', note: '15일 처리·30일 연장', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률시행령/제6조' }],
  },
  'registration-rejection-grounds': {
    kind: 'registration-rejection-filter', summary: '등기관은 신청을 실체심사하는 재판관이 아니지만 법정 각하사유는 걸러야 한다. 특히 법률상 성립할 수 없는 등기와 공동상속 일부지분만의 상속등기는 제29조제2호 필터에서 멈춘다.',
    filters: [{ request: '농지 전세권설정', verdict: '각하', reason: '사건이 등기할 것이 아님' },{ request: '전유부분·대지사용권 분리처분', verdict: '각하', reason: '분리처분금지 위반' },{ request: '공동상속인 일부의 자기지분만 상속등기', verdict: '각하', reason: '규칙 제52조 명시' },{ request: '소유권 외 권리 있는 일반건물 멸실등기', verdict: '각하', reason: '이해관계 권리 존속' }],
    process: ['신청 접수','제29조 각 호 대조','보정 가능한 흠은 보정명령','보정 없음·불가능 → 이유를 적어 각하'],
    sources: [{ label: '부동산등기법 제29조', note: '등기신청 각하사유', href: 'https://www.law.go.kr/법령/부동산등기법/제29조' },{ label: '부동산등기규칙 제52조', note: '사건이 등기할 것이 아닌 구체적 경우', href: 'https://www.law.go.kr/법령/부동산등기규칙/제52조' }],
  },
  'deemed-acquisition-trust': {
    kind: 'deemed-acquisition-xray', summary: '과점주주 간주취득은 주식 취득으로 법인 자산을 사실상 지배하게 된 변화를 포착한다. 설립 당시 주식 취득이나 지배비율 증가가 없는 내부이전처럼 새 지배가 없으면 과세하지 않는다.',
    shareholder: [{ event: '법인설립 때 발행주식 취득', result: '간주취득 아님' },{ event: '기존 주식 취득으로 최초 과점주주', result: '법인 자산 간주취득' },{ event: '과점주주 지분비율 증가', result: '증가분 간주취득' },{ event: '과점주주 집단 내부·총비율 불변', result: '새 간주취득 없음' }],
    trust: [{ move: '위탁자 → 수탁자 신탁이전', result: '법정 비과세' },{ move: '신탁 종료·수탁자 변경 이전', result: '법정 비과세' },{ move: '신탁재산의 실질적 유상취득', result: '별도 과세요건 검토' }],
    sources: [{ label: '지방세법 제7조', note: '과점주주 간주취득', href: 'https://www.law.go.kr/법령/지방세법/제7조' },{ label: '지방세법 제9조', note: '신탁재산 이전 비과세와 예외', href: 'https://www.law.go.kr/법령/지방세법/제9조' },{ label: '지방세법 시행령 제11조', note: '과점주주 취득비율 산정', href: 'https://www.law.go.kr/법령/지방세법시행령/제11조' }],
  },
  'common-utility-tunnel-installation': {
    kind: 'utility-tunnel-cross-section', summary: '공동구는 도로를 반복 굴착하지 않도록 여러 공급관로를 한 통로에 모은다. 설치의무 개발구역, 당연수용 시설, 협의회 심의 후 수용 시설을 세 층으로 나누면 된다.',
    zones: ['도시개발구역','택지개발지구','공공주택지구','정비구역','도청이전신도시'],
    tunnel: [{ utility: '전선로', route: '의무수용' },{ utility: '통신선로', route: '의무수용' },{ utility: '수도관·중수도관', route: '의무수용' },{ utility: '열·쓰레기수송관', route: '의무수용' },{ utility: '가스관·하수도관', route: '협의회 심의 후' }],
    maintenance: ['매년 안전·유지관리계획 수립·시행','공동구협의회를 통한 주요사항 심의','관리비용은 점용자 부담 원칙'],
    sources: [{ label: '국토계획법 제44조', note: '공동구 설치·수용시설', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제44조' },{ label: '국토계획법 시행령 제35조의2', note: '설치의무 지역·규모', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제35조의2' },{ label: '국토계획법 제44조의2', note: '공동구 관리·안전계획', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제44조의2' }],
  },
  'unauthorized-sublease': {
    kind: 'sublease-consent-router', summary: '전대차는 임차인과 전차인 사이에서는 동의 없이도 성립하지만, 임대인과의 관계는 동의 여부로 갈린다. 동의 없는 전대가 신뢰관계를 깨면 임대인은 원임대차를 해지할 수 있다.',
    routes: [{ consent: '임대인 동의 있음', tenant: '전대차 유효', landlord: '전차인이 직접 의무 부담', end: '합의종료로 전차권 소멸 못함' },{ consent: '임대인 동의 없음', tenant: '전대차 자체는 유효', landlord: '원칙적으로 원임대차 해지 가능', end: '배신행위 아닌 특별사정은 예외' }],
    smallPart: '건물의 소부분을 타인에게 사용하게 하는 경우에는 민법 제629조·제630조가 적용되지 않는다.',
    payment: ['전대차 차임 지급기 도래 전 지급','전대인에게 선불','임대인에게 대항 불가'],
    sources: [{ label: '민법 제629조', note: '무단 양도·전대와 해지', href: 'https://www.law.go.kr/법령/민법/제629조' },{ label: '민법 제630조', note: '동의부 전대의 직접 의무', href: 'https://www.law.go.kr/법령/민법/제630조' },{ label: '민법 제632조', note: '건물 소부분 전대 특례', href: 'https://www.law.go.kr/법령/민법/제632조' },{ label: '대법원 2006다45459', note: '전차인의 차임지급 대항 범위', href: 'https://www.law.go.kr/판례/(2006다45459)' }],
  },
  'weber-least-cost-theory': {
    kind: 'weber-location-compass', summary: '베버의 공장입지는 수익 최대화가 아니라 운송비·노동비·집적효과를 합친 총비용 최소화 문제다. 원료지수로 첫 방향을 잡고 임계등비용선으로 저임금지 이동 여부를 판정한다.',
    triangle: [{ point: '원료지 M₁', weight: 4 },{ point: '원료지 M₂', weight: 2 },{ point: '시장 C', weight: 3 }],
    material: [{ index: 'MI > 1', direction: '원료지향', reason: '국지원료 중량이 제품보다 큼' },{ index: 'MI = 1', direction: '중립', reason: '중량 손실 없음' },{ index: 'MI < 1', direction: '시장지향', reason: '제품 쪽 운송부담 상대적 증가' }],
    isodapane: ['최소운송비점','이동에 따른 추가운송비','노동비 절감액과 같아지는 선','임계등비용선'],
    sources: [{ label: 'Q-Net 출제기준', note: '부동산학개론 공업입지론', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },{ label: 'KOCW 경제지리학', note: '베버 최소비용 입지이론 공개강의', href: 'http://www.kocw.net/home/search/kemView.do?kemId=1292472' }],
  },
  'land-use-obligation': {
    kind: 'land-use-enforcement-clock', summary: '허가받은 토지를 목적대로 쓰지 않으면 먼저 3개월 이내 이행기간을 준다. 시정하지 않을 때 방치 10%, 임대 7% 등 위반유형별 이행강제금을 최초 명령일 기준 매년 한 번 부과한다.',
    clock: ['이용의무 위반 확인','문서로 이행명령','3개월 이내 이행기간','미이행 시 부과','최초 명령일 기준 매년 1회'],
    rates: [{ violation: '방치', rate: 10 },{ violation: '직접 이용하지 않고 임대', rate: 7 },{ violation: '목적 무단변경', rate: 5 },{ violation: '그 밖의 위반', rate: 7 }],
    stop: ['명령 이행 → 새로운 부과 즉시 중지','이미 부과된 금액은 징수','이용의무기간 종료 후 새 부과 불가'],
    sources: [{ label: '부동산거래신고법 제18조', note: '반복부과·중지·기간 종료', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제18조' },{ label: '같은 법 시행령 제16조', note: '3개월·위반유형별 비율', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률시행령/제16조' }],
  },
  'registration-objection-procedure': {
    kind: 'registrar-objection-conveyor', summary: '등기관 처분 이의는 법원이 판단하지만 접수창구는 처분한 등기관이 속한 등기소다. 새 사실·증거를 보태는 절차가 아니고, 신청만으로 다른 등기의 집행이 멈추지도 않는다.',
    conveyor: ['등기관 결정·처분','등기소에 이의신청서/전자정보 제출','등기관 자체 시정 또는 법원 송부','관할 지방법원 결정','인용 시 기록명령'],
    blocks: [{ claim: '새로운 사실·증거방법', result: '이의근거 불가' },{ claim: '이의 제기만으로 집행정지', result: '정지효력 없음' },{ claim: '제3자의 각하결정 불복', result: '신청인 아닌 제3자 불가' }],
    afterOrder: '기록명령 후에도 그 사이 사건이 등기할 것이 아니게 되었거나 재제공 명령에 불응하면 실행하지 않는다.',
    sources: [{ label: '부동산등기법 제100~104조', note: '관할·방법·새 사실 금지·집행 부정지', href: 'https://www.law.go.kr/법령/부동산등기법/제100조' },{ label: '부동산등기법 제107조', note: '법원 명령에 따른 등기기록', href: 'https://www.law.go.kr/법령/부동산등기법/제107조' },{ label: '부동산등기규칙 제161조', note: '기록명령을 실행할 수 없는 경우', href: 'https://www.law.go.kr/법령/부동산등기규칙/제161조' }],
  },
  'structural-component-acquisition': {
    kind: 'building-component-xray', summary: '취득세는 설비 설치비를 누가 냈는지보다 주체구조부와 일체가 되어 건축물 효용을 이루는지 본다. 일체화되면 제3자나 임차인이 설치해도 건물 취득자가 함께 취득한 것으로 본다.',
    layers: [{ layer: '주체구조부', examples: '기둥·벽·바닥·지붕', owner: '건물 취득자' },{ layer: '일체형 조작·부대설비', examples: '건물 효용에 결합된 냉난방·승강설비', owner: '건물 취득자에게 귀속' },{ layer: '분리 가능한 독립설비', examples: '이동식 장비·영업용 집기', owner: '별도 취득 판단' }],
    tests: ['물리적·기능적으로 결합?', '건축물 효용가치 구성?', '독립적 분리·거래 가능?', '설치자 아닌 구조부 취득자 귀속?'],
    case: '임차인이 중앙냉난방 설비를 설치했더라도 건물과 하나가 되어 효용을 이루면 취득세상 건물 소유자가 함께 취득한 것으로 본다.',
    sources: [{ label: '지방세법 제7조 제3항', note: '부대설비의 주체구조부 취득자 귀속', href: 'https://www.law.go.kr/법령/지방세법/제7조' },{ label: '지방세법 제6조', note: '건축물·개수 등 취득세 용어', href: 'https://www.law.go.kr/법령/지방세법/제6조' }],
  },
  'facilities-without-management-plan-decision': {
    kind: 'facility-plan-passport', summary: '도시지역 기반시설은 도시·군관리계획 결정이 원칙이다. 다만 법령이 열거한 소규모·특정 시설만 무결정 통로를 통과하므로 시설 이름과 설치형태를 함께 확인해야 한다.',
    passports: [{ facility: '건축물부설광장이 아닌 광장', pass: '결정 없이 가능' },{ facility: '방송대학·통신대학·방송통신대학', pass: '결정 없이 가능' },{ facility: '도심공항터미널', pass: '결정 없이 가능' },{ facility: '법정 규모 미만 도축장', pass: '결정 없이 가능' },{ facility: '옥외 변전시설', pass: '관리계획 결정 필요' },{ facility: '일반 재활용시설', pass: '목록·규모 별도 확인' }],
    principle: ['도시지역 기반시설','도시·군관리계획 결정 원칙','시행령·시행규칙 열거 예외만 통과'],
    sources: [{ label: '국토계획법 제43조', note: '기반시설 설치의 계획결정 원칙', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제43조' },{ label: '국토계획법 시행령 제35조', note: '결정 없이 설치 가능한 시설', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제35조' },{ label: '국토계획법 시행규칙 제6조', note: '시설별 규모·범위', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행규칙/제6조' }],
  },
  'unfair-juridical-act': {
    kind: 'unfairness-balance-lab', summary: '민법 제104조는 단순히 싸게 팔았다는 이유만으로 적용되지 않는다. 현저한 급부 불균형과 피해자의 궁박·경솔·무경험 중 하나, 상대방의 인식과 이용이 함께 맞물려야 무효가 된다.',
    gates: [{ label: '객관', test: '급부와 반대급부가 현저히 불균형?', pass: '가격 차이만으로는 부족' },{ label: '피해자', test: '궁박·경솔·무경험 중 하나?', pass: '셋 모두 필요하지 않음' },{ label: '상대방', test: '그 사정을 알고 이용했나?', pass: '폭리 의사 필요' }],
    agency: [{ factor: '궁박', standard: '본인 기준' },{ factor: '경솔', standard: '대리인 기준' },{ factor: '무경험', standard: '대리인 기준' }],
    exclusions: ['증여 등 무상행위에는 원칙적으로 적용 안 됨','법원의 공적 절차인 경매에는 적용 안 됨'],
    case: '시가 2억 원인 토지를 5천만 원에 샀더라도 가격 차이만으로 무효는 아니다. 매수인이 매도인의 급박한 곤궁을 알고 이를 이용했다는 사정까지 입증되어야 한다.',
    sources: [{ label: '민법 제104조', note: '불공정한 법률행위의 무효', href: 'https://www.law.go.kr/법령/민법/제104조' },{ label: '대법원 2002다38927', note: '현저한 불균형·이용의사 및 대리 판단기준', href: 'https://www.law.go.kr/판례/(2002다38927)' }],
  },
  'dcf-calculation-problems': {
    kind: 'dcf-discount-workbench', summary: 'DCF는 미래 돈을 같은 시점의 돈으로 번역하는 작업이다. 각 연도 현금흐름을 따로 할인한 뒤 합쳐야 하며, 매각대금은 매각되는 연도의 현금흐름에 넣는다.',
    rate: 10, investment: 250,
    cashflows: [{ year: 1, cash: 80, factor: 0.909, pv: 72.72 },{ year: 2, cash: 90, factor: 0.826, pv: 74.34 },{ year: 3, cash: 110, factor: 0.751, pv: 82.61 },{ year: 3, cash: 70, factor: 0.751, pv: 52.57, tag: '매각대금' }],
    results: [{ metric: '유입 현가', value: '282.24' },{ metric: 'NPV', value: '+32.24' },{ metric: 'PI', value: '1.129' }],
    formulas: ['PVₜ = CFₜ ÷ (1+r)ᵗ','NPV = 유입 현가 − 유출 현가','PI = 유입 현가 ÷ 유출 현가'],
    decision: 'NPV > 0이고 PI > 1이므로 독립투자안이라면 채택한다. 반올림은 중간 단계보다 마지막 계산에서 하는 것이 안전하다.',
    sources: [{ label: 'Q-Net 공인중개사 출제기준', note: '부동산투자분석·할인현금수지분석', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },{ label: 'KOCW 부동산투자론', note: '공개 강의 기반 보충학습', href: 'http://www.kocw.net/home/search/kemView.do?kemId=1214120' }],
  },
  'hlpa-priority-vs-enforceability': {
    kind: 'lease-rights-timeline', summary: '대항력은 새 집주인에게 “내 임대차가 유효하다”고 주장하는 방패이고, 우선변제권은 경매대금에서 후순위권리자보다 먼저 받는 배당표다. 발생요건과 효력 시점을 따로 봐야 한다.',
    tracks: [{ right: '대항력', ingredients: ['주택 인도','주민등록'], time: '두 요건을 마친 다음 날 0시', power: '양수인 등 제3자에게 임대차 주장' },{ right: '우선변제권', ingredients: ['대항요건','계약증서 확정일자'], time: '세 요건을 모두 갖춘 때', power: '경매·공매대금에서 후순위보다 우선변제' },{ right: '소액 최우선변제', ingredients: ['경매신청 등기 전 대항요건','시행령상 소액보증금'], time: '배당요구 종기까지 요건 유지', power: '확정일자 없이도 일정액 최우선' }],
    race: [{ time: '4/1', event: '인도 + 전입신고' },{ time: '4/2 0시', event: '대항력 발생' },{ time: '4/3', event: '확정일자 취득 → 우선변제권 완성' }],
    cautions: ['확정일자만 받아서는 우선변제권이 생기지 않는다','소액임차인 기준은 최초 담보물권 설정 당시 시행령을 확인한다','배당을 받은 뒤 주택을 인도해야 보증금을 실제 수령할 수 있다'],
    sources: [{ label: '주택임대차보호법 제3조', note: '인도·주민등록과 대항력', href: 'https://www.law.go.kr/법령/주택임대차보호법/제3조' },{ label: '같은 법 제3조의2', note: '확정일자부 우선변제권', href: 'https://www.law.go.kr/법령/주택임대차보호법/제3조의2' },{ label: '같은 법 제8조', note: '소액보증금 최우선변제', href: 'https://www.law.go.kr/법령/주택임대차보호법/제8조' }],
  },
  'trust-registration-detail': {
    kind: 'trust-registry-layers', summary: '신탁부동산 등기는 권리등기와 신탁등기를 한 묶음으로 공시한다. 누가 신청하는지보다 어떤 변동과 동시에 처리해야 하는지를 먼저 잡으면 절차가 보인다.',
    layers: [{ layer: '권리등기', record: '수탁자 명의 설정·보존·이전·변경' },{ layer: '신탁등기', record: '신탁원부 번호와 신탁재산임을 공시' },{ layer: '신탁원부', record: '목적·수익자·관리·처분 조항 확인' }],
    routes: [{ event: '처음 신탁재산 편입', applicant: '수탁자 중심', pair: '권리등기와 동시에 신탁등기' },{ event: '수탁자가 신청하지 않음', applicant: '위탁자·수익자가 대위', pair: '동시신청 원칙의 예외' },{ event: '신탁재산에서 이탈', applicant: '수탁자', pair: '권리이전·말소와 신탁말소 동시' },{ event: '수탁자 임무 종료', applicant: '신수탁자 단독', pair: '권리이전등기' }],
    coTrustees: '수탁자가 여러 명이면 지분공유가 아니라 신탁재산이 수탁자들의 합유라는 뜻을 기록한다.',
    sources: [{ label: '부동산등기법 제81조', note: '신탁원부의 등기기록 편입', href: 'https://www.law.go.kr/법령/부동산등기법/제81조' },{ label: '같은 법 제82조', note: '동시신청과 대위신청', href: 'https://www.law.go.kr/법령/부동산등기법/제82조' },{ label: '같은 법 제83·84조', note: '신수탁자 단독신청·복수수탁자 합유', href: 'https://www.law.go.kr/법령/부동산등기법/제83조' }],
  },
  'property-tax-taxable-object': {
    kind: 'property-tax-exemption-filter', summary: '재산세 비과세는 재산 이름만 보고 결정하지 않는다. 과세기준일 현재의 사용기간·실제 용도·철거 범위를 순서대로 통과시켜야 한다.',
    filters: [{ item: '임시사용 건축물', condition: '과세기준일 현재 1년 미만', verdict: '비과세' },{ item: '농업용 구거', condition: '실제 농업용으로 제공', verdict: '비과세' },{ item: '채종림·시험림', condition: '법률에 따라 지정', verdict: '비과세' },{ item: '철거명령 받은 주택', condition: '해당 연도 철거계획 확정', verdict: '건물부분 비과세' },{ item: '위 주택의 부속토지', condition: '철거 대상 건물과 구분', verdict: '과세' }],
    date: '6월 1일 재산세 과세기준일의 상태로 판정',
    examples: [{ case: '가설건축물 10개월', result: '비과세' },{ case: '가설건축물 1년 1일', result: '기간 요건 탈락' },{ case: '철거명령 주택의 대지', result: '토지는 계속 과세' }],
    sources: [{ label: '지방세법 제109조', note: '재산세 비과세 대상', href: 'https://www.law.go.kr/법령/지방세법/제109조' },{ label: '지방세법 시행령 제108조', note: '비과세 토지·철거예정 건축물의 범위', href: 'https://www.law.go.kr/법령/지방세법시행령/제108조' },{ label: '지방세법 제114조', note: '재산세 과세기준일', href: 'https://www.law.go.kr/법령/지방세법/제114조' }],
  },
  'maintenance-project-types': {
    kind: 'renewal-project-selector', summary: '정비사업은 “기반시설 상태 + 건축물 상태 + 사업 규모”를 함께 본다. 가로주택정비는 도시정비법상 3종 사업 바깥의 별도 특례법상 소규모 사업이라는 점이 첫 갈림길이다.',
    projects: [{ name: '주거환경개선', infra: '극히 열악', stock: '노후·불량 과도 밀집 또는 보전 필요', method: '현지개량·수용/사용·환지·관리처분' },{ name: '재개발', infra: '열악', stock: '노후·불량 밀집', method: '환지 또는 관리처분' },{ name: '재건축', infra: '양호', stock: '노후·불량 공동주택 밀집', method: '관리처분 중심' },{ name: '가로주택정비', infra: '종전 가로 유지', stock: '법정 가로구역·노후도 요건', method: '소규모주택정비법' }],
    housingCounts: [{ composition: '단독주택만', threshold: '10호 이상' },{ composition: '공동주택만', threshold: '20세대 이상' },{ composition: '단독+공동 혼합', threshold: '합계 20채 이상' }],
    route: ['도시정비법 적용?', '3종 중 대상지역 판정', '시행방법 연결', '가로 유지 소규모면 별도 법률 확인'],
    case: '기반시설이 양호한 낡은 아파트단지는 재개발이 아니라 재건축이다. 같은 낡은 주택이라도 도로망을 유지하는 작은 가로구역 사업이면 가로주택정비를 검토한다.',
    sources: [{ label: '도시정비법 제2조', note: '정비사업 3종의 정의', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제2조' },{ label: '도시정비법 제23조', note: '사업별 시행방법', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제23조' },{ label: '소규모주택정비법 제2조', note: '가로주택정비사업의 별도 법적 근거', href: 'https://www.law.go.kr/법령/빈집및소규모주택정비에관한특례법/제2조' },{ label: '같은 법 시행령 제3조', note: '주택 구성별 최소 호수·세대수', href: 'https://www.law.go.kr/법령/빈집및소규모주택정비에관한특례법시행령/제3조' }],
  },
  'mortgage-general-nature': {
    kind: 'mortgage-tether-map', summary: '저당권은 담보채권에 매달린 권리라서 채권과 따로 양도되지 않는다. 그러나 저당부동산의 소유자는 바뀔 수 있고, 제3취득자는 경매 참여·변제·비용상환이라는 독립된 방어수단을 가진다.',
    tether: [{ asset: '담보채권', role: '주된 권리' },{ asset: '저당권', role: '부종·수반하는 권리' }],
    rules: [{ change: '채권 전부 양도', mortgage: '저당권도 함께 이전' },{ change: '저당권만 따로 양도', mortgage: '불가' },{ change: '담보채권 소멸', mortgage: '저당권도 소멸' },{ change: '제3자가 소유권 취득', mortgage: '저당권은 그대로 존속' }],
    thirdParty: [{ tool: '경매인이 되기', article: '민법 제363조' },{ tool: '채권 변제 후 저당권 소멸 청구', article: '민법 제364조' },{ tool: '필요비·유익비 우선상환', article: '민법 제367조' }],
    case: '甲의 채무를 위해 乙이 자기 건물에 저당권을 설정할 수 있다. 乙은 물상보증인이고, 채무자와 설정자가 같아야 한다는 명제는 틀리다.',
    sources: [{ label: '민법 제361조', note: '저당권의 처분 제한', href: 'https://www.law.go.kr/법령/민법/제361조' },{ label: '민법 제363·364조', note: '제3취득자의 경매 참여와 변제', href: 'https://www.law.go.kr/법령/민법/제363조' },{ label: '민법 제367조', note: '필요비·유익비 우선상환', href: 'https://www.law.go.kr/법령/민법/제367조' }],
  },
  'loan-limit-ltv-dcr': {
    kind: 'loan-limit-dual-gauge', summary: '대출한도는 담보가치가 허용하는 LTV 한도와 영업소득이 감당하는 DCR 한도를 각각 계산한 뒤 더 작은 값으로 잠근다. DCR에서는 연간 원리금상환액을 먼저 구한 뒤 저당상수로 원금을 역산한다.',
    inputs: [{ label: '부동산가치', value: '5억원' },{ label: 'LTV', value: '60%' },{ label: 'NOI', value: '3,000만원' },{ label: '최소 DCR', value: '1.5' },{ label: '저당상수', value: '8%' }],
    gauges: [{ standard: 'LTV', formula: '5억원 × 60%', limit: '3억원', ratio: 100 },{ standard: 'DCR', formula: '(3,000만원 ÷ 1.5) ÷ 8%', limit: '2억5천만원', ratio: 83 }],
    dcrSteps: ['허용 원리금상환액 = NOI ÷ DCR = 2,000만원','대출원금 = 원리금상환액 ÷ 저당상수 = 2억5천만원','두 한도 중 작은 2억5천만원 채택'],
    caution: 'DCR = NOI ÷ 부채서비스액이다. DCR을 NOI에 곱하거나, 허용 상환액을 곧바로 대출원금으로 선택하면 안 된다.',
    sources: [{ label: 'Q-Net 공인중개사 출제기준', note: '부동산금융론·저당대출 분석', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },{ label: 'KOCW 부동산금융론', note: '공개 강의 기반 계산 보충', href: 'http://www.kocw.net/home/search/kemView.do?kemId=1214120' }],
  },
  'auction-bidding-agent': {
    kind: 'auction-agent-license-desk', summary: '매수신청대리는 중개사무소 개설등록만으로 바로 할 수 없다. 등록 가능한 개업공인중개사가 실무교육과 보증을 갖추어 주된 사무소 관할 지방법원장에게 별도로 등록해야 한다.',
    applicants: [{ actor: '공인중개사인 개업공인중개사', result: '등록 가능' },{ actor: '법인인 개업공인중개사', result: '주된 사무소로 등록' },{ actor: '소속공인중개사', result: '등록 불가' },{ actor: '중개보조원', result: '등록 불가' }],
    checklist: ['부동산경매 실무교육 이수','보증보험·공제 가입 또는 공탁','관할 지방법원장에게 등록','각 대리행위마다 대리권 증명문서 제출'],
    scope: [{ task: '민사집행법상 경매 매수신청·입찰', court: '등록 업무' },{ task: '국세징수법상 공매 입찰', court: '이 규칙상 등록 대상 아님' },{ task: '권리분석·취득 알선', court: '등록 업무에 부수' }],
    restart: '폐업신고에 따른 등록취소는 일반적인 “취소 후 3년” 결격에서 제외된다. 다만 업무정지 중 폐업했다면 남은 정지기간은 계속 진행된다.',
    sources: [{ label: '매수신청대리인 등록규칙 제4~6조', note: '등록관청·요건·결격사유', href: 'https://www.law.go.kr/법령/공인중개사의매수신청대리인등록등에관한규칙/제4조' },{ label: '같은 규칙 제14조', note: '각 대리행위의 대리권 증명', href: 'https://www.law.go.kr/법령/공인중개사의매수신청대리인등록등에관한규칙/제14조' },{ label: '같은 규칙 제21조', note: '등록취소 사유', href: 'https://www.law.go.kr/법령/공인중개사의매수신청대리인등록등에관한규칙/제21조' }],
  },
  'sub-registration-and-priority': {
    kind: 'subregistration-priority-stack', summary: '부기등기는 새 순위를 만드는 별도 줄이 아니라 기존 주등기에 가지번호를 붙이는 방식이다. 주등기의 순위를 이어받되, 같은 주등기에 달린 부기등기끼리는 자기들 사이의 등기 순서로 겨룬다.',
    stack: [{ number: '3', label: '주등기 · 지상권 설정', priority: '기준 순위' },{ number: '3-1', label: '부기 · 지상권 이전', priority: '3번 순위 승계' },{ number: '3-2', label: '부기 · 다시 이전', priority: '3-1 뒤' },{ number: '4', label: '주등기 · 저당권 설정', priority: '3번 다음 순위' }],
    types: [{ event: '권리의 이전등기', form: '부기등기' },{ event: '등기명의인 표시변경', form: '부기등기' },{ event: '환매특약', form: '소유권이전과 함께 부기' },{ event: '채권최고액 증액 변경', form: '제3자 승낙 있어야 부기' }],
    consent: [{ situation: '이해관계인 없음', result: '부기로 변경' },{ situation: '있고 승낙정보 제공', result: '부기로 변경' },{ situation: '있고 승낙 없음', result: '주등기로 변경·후순위' }],
    sources: [{ label: '부동산등기법 제4·5조', note: '권리 순위와 부기등기 순위', href: 'https://www.law.go.kr/법령/부동산등기법/제4조' },{ label: '부동산등기법 제52조', note: '이해관계 있는 제3자와 변경등기', href: 'https://www.law.go.kr/법령/부동산등기법/제52조' },{ label: '부동산등기규칙 제2조', note: '부기등기의 가지번호', href: 'https://www.law.go.kr/법령/부동산등기규칙/제2조' }],
  },
  'property-tax-rate-progressive': {
    kind: 'land-tax-bracket-elevator', summary: '종합합산 토지는 전국의 해당 토지 과세표준을 합쳐 3단 누진세율을 적용한다. 최고세율 0.5%를 전체 금액에 곱하는 것이 아니라 각 구간을 지나온 누적세액에 초과분 세율을 더한다.',
    brackets: [{ floor: '1구간', range: '5천만원 이하', rate: '0.2%', base: '과세표준 × 0.2%' },{ floor: '2구간', range: '5천만원 초과~1억원', rate: '0.3%', base: '10만원 + 5천만원 초과분 × 0.3%' },{ floor: '3구간', range: '1억원 초과', rate: '0.5%', base: '25만원 + 1억원 초과분 × 0.5%' }],
    example: { standard: '과세표준 1억6천만원', layers: ['첫 5천만원 → 10만원','다음 5천만원 → 15만원','나머지 6천만원 → 30만원'], total: '산출세액 55만원' },
    compare: [{ class: '종합합산', top: '0.5%', note: '나대지 등' },{ class: '별도합산', top: '0.4%', note: '사업용 토지 등' },{ class: '분리과세', top: '대상별 단일세율', note: '농지·고율대상 등' }],
    sources: [{ label: '지방세법 제106조', note: '토지 과세대상 구분', href: 'https://www.law.go.kr/법령/지방세법/제106조' },{ label: '지방세법 제111조', note: '종합합산 3단 누진 표준세율', href: 'https://www.law.go.kr/법령/지방세법/제111조' },{ label: '지방세법 시행규칙 별지 제59호', note: '공식 재산세 산출 구조', href: 'https://www.law.go.kr/법령/지방세법시행규칙' }],
  },
  'urban-basic-plan-formulation': {
    kind: 'urban-basic-plan-control-room', summary: '도시·군기본계획은 장기 방향을 정하는 상위 종합계획이다. 같은 계획이라도 특별·광역시 계열은 자체 확정하고, 시장·군수는 도지사 승인을 받는 두 개의 통제 경로로 나뉜다.',
    routes: [{ maker: '특별시장·광역시장·특별자치시장·특별자치도지사', stages: ['기초조사·계획안','공청회','지방의회 의견','관계 행정기관 협의','지방도시계획위원회 심의','확정·공고·열람'] },{ maker: '시장·군수', stages: ['기초조사·계획안','공청회','지방의회 의견','도지사 승인 신청','도지사가 관계기관 협의·위원회 심의','승인 후 공고·열람'] }],
    clocks: [{ number: '5년마다', task: '타당성 전반 재검토·정비' },{ number: '30일 이내', task: '지방의회의 의견 제시 원칙' },{ number: '30일 이내', task: '관계 행정기관 의견 제시 원칙' }],
    hierarchy: ['광역도시계획·국가계획','도시·군기본계획','도시·군관리계획','개별 개발행위'],
    caution: '토지적성평가·재해취약성분석의 생략 요건은 관리계획 입안 문제와 구분한다. 기본계획의 5년은 “타당성 재검토 주기”다.',
    sources: [{ label: '국토계획법 제18~21조', note: '수립권자·내용·공청회·의회 의견', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제18조' },{ label: '국토계획법 제22·22조의2', note: '자체 확정과 도지사 승인 경로', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제22조' },{ label: '국토계획법 제23조', note: '5년마다 전반적 재검토', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제23조' }],
  },
  'mutual-rescission': {
    kind: 'mutual-rescission-mixer', summary: '합의해제는 법정해제권의 행사가 아니라 기존 계약을 없애는 새 계약이다. 따라서 무엇을 돌려줄지, 이자·손해배상을 붙일지는 먼저 합의 내용을 보고, 합의가 비어 있을 때 판례의 보충규칙을 적용한다.',
    compare: [{ item: '발생원인', statutory: '채무불이행 등 + 해제권 행사', mutual: '당사자의 새 합의' },{ item: '금전반환 이자', statutory: '민법 제548조제2항', mutual: '별도 약정 없으면 당연 가산 안 됨' },{ item: '손해배상', statutory: '제551조에 따라 가능', mutual: '별도 약정 없으면 당연 발생 안 됨' },{ item: '제3자 보호', statutory: '제548조 단서', mutual: '합의 내용·제3자 관계 별도 판단' }],
    signals: ['명시적 “해제 합의”','쌍방이 이행·최고 없이 장기간 방치','계약을 실현하지 않을 의사의 객관적 일치'],
    ownership: ['매매로 소유권이전등기','당사자 합의해제','특별사정 없으면 매도인에게 물권 복귀','제3자에게 주장하려면 등기 문제 별도'],
    case: '매도인과 매수인이 받은 것만 서로 돌려주기로 합의했다면, 매도대금에 법정해제처럼 자동으로 이자를 붙이거나 채무불이행 손해배상을 더할 수 없다.',
    sources: [{ label: '민법 제548조', note: '법정해제의 원상회복·이자와 제3자', href: 'https://www.law.go.kr/법령/민법/제548조' },{ label: '민법 제551조', note: '법정해제와 손해배상', href: 'https://www.law.go.kr/법령/민법/제551조' },{ label: '대법원 2004다37904·37911', note: '묵시적 합의해제 판단', href: 'https://www.law.go.kr/판례/(2004다37904)' }],
  },
  'asset-specific-appraisal-method': {
    kind: 'appraisal-method-matching-wall', summary: '물건별 주된 방법은 “만드는 비용·비슷한 거래·창출하는 수익” 중 어떤 자료가 가치 형성에 가장 직접적인지를 고르는 매칭 문제다. 주된 방법이 곤란하면 다른 방법을 적용할 수 있지만 그 이유를 적어야 한다.',
    methods: [{ method: '원가법', cue: '재조달원가 − 감가수정', assets: ['건물','건설기계','선박','항공기'], tone: 'cost' },{ method: '거래사례비교법', cue: '유사 거래사례 비교', assets: ['자동차','과수원','구분건물 일괄'], tone: 'market' },{ method: '수익환원법', cue: '장래 순수익을 현재가치화', assets: ['광업재단','기업가치','영업권·지식재산권'], tone: 'income' },{ method: '임대사례비교법', cue: '유사 임대사례 비교', assets: ['임대료'], tone: 'rent' }],
    traps: [{ pair: '자동차 ↔ 선박', answer: '거래사례비교법 ↔ 원가법' },{ pair: '임대료 ↔ 영업권', answer: '임대사례비교법 ↔ 수익환원법' },{ pair: '수익분석법', answer: '가액이 아니라 임대료 산정 방식' }],
    fallback: '주된 방법을 적용하는 것이 곤란하거나 부적절하면 다른 감정평가방법을 적용할 수 있고, 감정평가서에 그 이유를 기재한다.',
    sources: [{ label: '감정평가에 관한 규칙 제12조', note: '주된 방법과 다른 방법의 합리성 검토', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제12조' },{ label: '같은 규칙 제15~26조', note: '물건별 주된 감정평가방법', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제15조' },{ label: '감정평가 실무기준', note: '국토교통부 고시의 세부 적용기준', href: 'https://www.law.go.kr/행정규칙/감정평가실무기준' }],
  },
  'corporate-registration-standard': {
    kind: 'corporate-broker-blueprint', summary: '법인 개설등록은 법인형태·자본·목적·인력·교육·사무실의 여섯 칸을 모두 채워야 한다. 대표자는 별도 자격문이고, 3분의 1은 대표자를 뺀 임원·사원만으로 계산한다.',
    blueprint: [{ zone: '법인형태', rule: '상법상 회사 또는 법정 협동조합' },{ zone: '자본', rule: '5천만원 이상' },{ zone: '목적', rule: '법 제14조 업무만 영위' },{ zone: '대표자', rule: '공인중개사 필수' },{ zone: '임원·사원', rule: '대표자 제외 1/3 이상 공인중개사' },{ zone: '사무실', rule: '건축물대장 기재 건물 사용권 확보' }],
    calculator: { officers: 6, required: 2, representative: '별도로 공인중개사' },
    education: [{ person: '대표자', status: '전원 실무교육' },{ person: '임원·사원', status: '자격 유무와 무관하게 전원' },{ person: '분사무소 책임자', status: '설치할 때 교육' }],
    trap: '대표자를 포함해 7명 중 3분의 1을 계산하는 것이 아니다. 대표자를 제외한 6명 중 2명 이상 + 대표자 자격을 각각 충족한다.',
    sources: [{ label: '공인중개사법 시행령 제13조', note: '법인 개설등록 6개 기준', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제13조' },{ label: '공인중개사법 제14조', note: '법인인 개업공인중개사의 업무범위', href: 'https://www.law.go.kr/법령/공인중개사법/제14조' },{ label: '공인중개사법 제34조', note: '실무교육', href: 'https://www.law.go.kr/법령/공인중개사법/제34조' }],
  },
  'cadastral-books-restoration': {
    kind: 'cadastral-restoration-lab', summary: '지적공부 복구는 새로 조사해 임의로 만드는 일이 아니라 멸실·훼손 당시 장부와 가장 부합하는 법정 자료를 조립하는 절차다. 토지표시와 소유자는 증거 통로도 다르다.',
    evidence: [{ document: '지적공부 등본·복제본', use: '표시 복구', accepted: true },{ document: '측량 결과도·이동정리 결의서', use: '표시 복구', accepted: true },{ document: '등기사실 증명서류', use: '소유자 복구', accepted: true },{ document: '법원 확정판결서', use: '표시·소유자 근거', accepted: true },{ document: '토지이용계획확인서', use: '용도규제 확인', accepted: false }],
    procedure: ['복구자료 조사','조사서·복구자료도 작성','허용범위 초과·자료 없음 → 복구측량','토지표시 등을 15일 이상 게시','이의 있으면 지방지적위원회 의결','지적공부 복구'],
    split: [{ target: '토지의 표시', source: '멸실 당시와 가장 부합하는 관계자료' },{ target: '소유자', source: '부동산등기부 또는 법원 확정판결' }],
    case: '화재 뒤 현재 이용현황만 보고 경계를 새로 정하지 않는다. 측량 결과도와 복제 장부를 맞추고, 차이가 허용범위를 넘으면 복구측량과 게시 절차를 거친다.',
    sources: [{ label: '공간정보관리법 제74조', note: '멸실·훼손 시 지체 없는 복구', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제74조' },{ label: '같은 법 시행령 제61조', note: '표시·소유자별 복구 근거', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제61조' },{ label: '같은 법 시행규칙 제72·73조', note: '복구자료 7종과 15일 게시 절차', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제72조' }],
  },
  'capital-gain-acquisition-timing': {
    kind: 'acquisition-time-switchyard', summary: '양도소득세의 취득·양도시기는 원칙적으로 대금청산일이다. 예외에서는 등기일, 사실상 사용일, 사용승인일, 환지처분 공고 다음 날처럼 자산을 실질적으로 취득한 사건을 스위치한다.',
    switches: [{ event: '일반 유상양도', first: '대금청산일', fallback: '불분명하면 등기·등록접수일' },{ event: '청산 전에 등기', first: '등기·등록접수일', fallback: '청산일까지 기다리지 않음' },{ event: '자기가 건설한 건축물', first: '사용승인서 교부일', fallback: '그 전 사실상 사용일 또는 사용검사일' },{ event: '사용승인 없는 건축물', first: '사실상의 사용일', fallback: '객관적 사용 개시 확인' },{ event: '환지 증감면적', first: '환지처분 공고 다음 날', fallback: '증가·감소분에 한정' }],
    timeline: ['계약일','잔금청산일','등기접수일','사실상 사용일','법정 예외가 앞선 시점을 선택하기도 함'],
    exchange: { old: '종전 토지의 환지', time: '종전 토지 취득시기 승계', delta: '권리면적 증감분', deltaTime: '환지처분 공고 다음 날' },
    caution: '환지로 받은 토지 전체의 취득시기를 공고 다음 날로 바꾸는 것이 아니다. 종전 토지에 대응하는 부분은 원래 취득시기를 이어가고, 증가·감소 면적만 특례시점을 적용한다.',
    sources: [{ label: '소득세법 제98조', note: '취득·양도시기의 위임 근거', href: 'https://www.law.go.kr/법령/소득세법/제98조' },{ label: '소득세법 시행령 제162조', note: '대금청산·건축·환지 등 시기 특례', href: 'https://www.law.go.kr/법령/소득세법시행령/제162조' },{ label: '대법원 2001두6157', note: '환지 증감면적 취득시기 시험문제 판결', href: 'https://www.law.go.kr/판례/(2001두6157)' }],
  },
  'resident-plan-proposal-consent': {
    kind: 'resident-proposal-consent-gate', summary: '주민 입안 제안은 무엇이든 가능한 청원이 아니다. 법 제26조가 열거한 4개 묶음만 통과하며, 제1호 기반시설·제5호 입체복합구역은 5분의 4, 제2호 지구단위계획·제3호 용도지구는 3분의 2 동의가 필요하다.',
    gates: [{ clause: '제1호', proposal: '기반시설 설치·정비·개량', consent: '4/5 이상' },{ clause: '제2호', proposal: '지구단위계획구역·지구단위계획', consent: '2/3 이상' },{ clause: '제3호', proposal: '산업·유통개발진흥지구·대체형 용도지구', consent: '2/3 이상' },{ clause: '제5호', proposal: '도시·군계획시설입체복합구역', consent: '4/5 이상' }],
    excluded: ['입지규제최소구역 제4호 · 2024년 삭제','시가화조정구역 지정·변경','일반적인 용도지역 지정·변경'],
    calculation: { whole: '대상 토지 10,000㎡', public: '국·공유지 2,000㎡ 제외', denominator: '동의 산정면적 8,000㎡', fourFifths: '6,400㎡', twoThirds: '약 5,333.34㎡ 이상' },
    process: ['계획도서·설명서 첨부 제안','입안권자 검토','45일 이내 반영 여부 통보','부득이하면 1회 30일 연장','협의하여 비용 전부·일부 부담 가능'],
    sources: [{ label: '국토계획법 제26조', note: '현행 주민 제안대상 1·2·3·5호', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제26조' },{ label: '국토계획법 시행령 제19조의2', note: '4/5·2/3 동의와 국·공유지 제외', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제19조의2' },{ label: '국토계획법 시행령 제20조', note: '45일 통보·30일 연장', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제20조' }],
  },
  'rescission-effect-third-party': {
    kind: 'rescission-thirdparty-airlock', summary: '해제는 당사자 사이의 물권을 원상태로 돌리지만 거래사슬의 제3자까지 모두 밀어내지는 않는다. 해제 전 취득자와 해제 후 원상회복등기 전 취득자는 서로 다른 보호요건을 통과한다.',
    airlocks: [{ timing: '해제 전', relation: '해제되는 계약의 효과를 기초로 새 이해관계', requirement: '등기·인도 등 완전한 권리 취득', goodFaith: '선의 요건은 판례상 요구되지 않음', result: '제548조 단서 보호' },{ timing: '해제 후~원상회복등기 전', relation: '해제 주장자와 양립 불가능한 법률관계', requirement: '등기 등 권리 취득', goodFaith: '해제 사실을 몰라야 함', result: '판례상 보호' },{ timing: '원상회복등기 후', relation: '이미 원소유자 명의 회복', requirement: '무권리자에게서 취득', goodFaith: '부동산 선의취득 없음', result: '원칙적으로 보호 안 됨' }],
    restitution: [{ duty: '받은 목적물 반환', pair: '상대방 반환의무와 동시이행' },{ duty: '금전 반환', pair: '받은 날부터 이자 가산' },{ duty: '손해배상', pair: '해제와 별도로 청구 가능' }],
    chain: ['甲 매도','乙 이전등기','丙에게 재매도·등기','甲-乙 계약 해제','丙의 완전한 권리 보호'],
    case: '丙이 해제 후에 샀다는 이유만으로 곧바로 탈락하지 않는다. 甲의 원상회복등기 전이고, 해제 사실을 몰랐으며 등기를 마쳤는지가 핵심이다.',
    sources: [{ label: '민법 제548조', note: '원상회복과 제3자 보호·금전 이자', href: 'https://www.law.go.kr/법령/민법/제548조' },{ label: '민법 제549·551조', note: '동시이행과 손해배상', href: 'https://www.law.go.kr/법령/민법/제549조' },{ label: '대법원 2005다6341', note: '해제 후 원상회복 전 선의 제3자', href: 'https://www.law.go.kr/판례/(2005다6341)' }],
  },
  'direct-capitalization-income-calculation': {
    kind: 'direct-capitalization-waterfall', summary: '직접환원법은 임대수입을 순영업소득까지 정제한 뒤 환원율로 나누는 한 줄 계산이다. 금융조건과 소유자의 세금은 부동산 자체의 영업성과가 아니므로 NOI 폭포에 넣지 않는다.',
    waterfall: [{ stage: '가능총소득 PGI', amount: 5000, sign: '+' },{ stage: '공실·대손', amount: 500, sign: '−' },{ stage: '기타수입', amount: 200, sign: '+' },{ stage: '영업경비', amount: 1200, sign: '−' },{ stage: '순영업소득 NOI', amount: 3500, sign: '=' }],
    include: [{ item: '유지관리비', bucket: '영업경비' },{ item: '재산세·보험료', bucket: '영업경비' },{ item: '원리금상환액', bucket: '제외' },{ item: '소득세·법인세', bucket: '제외' },{ item: '감가상각비', bucket: '제외' }],
    calculator: { noi: '3,500만원', capRate: '7%', value: '5억원', inverse: '환원율 = NOI ÷ 수익가액' },
    sensitivity: [{ rate: '6%', value: '5.83억원' },{ rate: '7%', value: '5억원' },{ rate: '8%', value: '4.375억원' }],
    sources: [{ label: '감정평가에 관한 규칙 제23조', note: '수익환원법과 직접환원법', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제23조' },{ label: '감정평가 실무기준', note: '순수익·환원율 산정 세부기준', href: 'https://www.law.go.kr/행정규칙/감정평가실무기준' },{ label: 'Q-Net 공인중개사 출제기준', note: '감정평가 수익방식', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' }],
  },
  'office-name-and-advertising': {
    kind: 'broker-signboard-compliance', summary: '간판 설치 자체는 의무가 아니지만 설치한다면 등록된 사무소임을 오인시키지 않도록 명칭과 성명을 정확히 표시해야 한다. 이전·폐업·등록취소 때에는 지체 없이 철거하고, 휴업은 철거 사유가 아니다.',
    signboards: [{ office: '공인중개사 개업', required: '공인중개사사무소', name: '개업공인중개사 성명' },{ office: '법인 개업', required: '공인중개사사무소 또는 부동산중개', name: '대표자 성명' },{ office: '분사무소', required: '법정 명칭', name: '분사무소 책임자 성명' },{ office: '무등록자', required: '법정 명칭 사용 금지', name: '오인 간판 철거 대상' }],
    removal: [{ event: '사무소 이전', action: '종전 간판 즉시 철거' },{ event: '폐업신고', action: '간판 즉시 철거' },{ event: '개설등록 취소', action: '간판 즉시 철거' },{ event: '3개월 초과 휴업', action: '철거의무 없음' }],
    enforcement: ['등록관청의 철거 명령','불이행','행정대집행법에 따른 대집행'],
    trap: '“간판을 반드시 설치해야 한다”는 문장은 틀리다. 설치 여부는 자유지만, 설치한 옥외광고물에는 등록증상 성명을 표시해야 한다.',
    sources: [{ label: '공인중개사법 제18조', note: '사무소 명칭·성명 표시·철거·대집행', href: 'https://www.law.go.kr/법령/공인중개사법/제18조' },{ label: '공인중개사법 제21조', note: '3개월 초과 휴업·폐업 신고', href: 'https://www.law.go.kr/법령/공인중개사법/제21조' },{ label: '공인중개사법 제51조', note: '명칭 규정 위반 과태료', href: 'https://www.law.go.kr/법령/공인중개사법/제51조' }],
  },
  'co-ownership-registration': {
    kind: 'coownership-registry-ledger', summary: '공유는 지분을 숫자로 공시하지만 합유는 합유라는 관계만 적고 각 합유지분은 표시하지 않는다. 미등기 공유부동산의 보존은 1인이 신청해도 자기 지분 한 줄이 아니라 전체 부동산을 한꺼번에 올린다.',
    ledgers: [{ type: '공유', record: ['甲 1/2','乙 1/3','丙 1/6'], disposal: '각자 지분 처분 가능' },{ type: '합유', record: ['甲·乙·丙 합유','개별 지분 표시 없음'], disposal: '합유물 처분은 전원 동의' }],
    preservation: { property: '미등기 토지 전체', owners: ['甲 1/2','乙 1/2'], applicant: '甲 단독 신청 가능', result: '甲 지분만 × / 전체 공유자 명의 보존 ○' },
    attachments: [{ case: '농지 공유물분할 이전', document: '농지취득자격증명 불필요' },{ case: '법인 아닌 사단 부동산 매도', document: '사원총회 결의정보 원칙' },{ case: '합유자 변경', document: '합유관계에 맞는 공동신청 구조 확인' }],
    sources: [{ label: '민법 제262·271조', note: '공유지분과 합유의 법률관계', href: 'https://www.law.go.kr/법령/민법/제262조' },{ label: '부동산등기법 제65조', note: '소유권보존등기의 신청인', href: 'https://www.law.go.kr/법령/부동산등기법/제65조' },{ label: '부동산등기규칙 제46·48조', note: '법인 아닌 사단 첨부정보', href: 'https://www.law.go.kr/법령/부동산등기규칙/제46조' }],
  },
  'property-tax-taxpayer-determination': {
    kind: 'property-taxpayer-detective', summary: '재산세는 6월 1일 사실상 소유자가 원칙이지만 소유자를 즉시 확정하기 어려운 재산에는 법정 대체 납세의무자를 세운다. 공부 명의·신고 여부·사업 단계가 탐정의 단서다.',
    cases: [{ clue: '종중재산을 개인 명의로 등재 + 종중소유 미신고', taxpayer: '공부상 소유자' },{ clue: '상속등기 없음 + 사실상 소유자 미신고', taxpayer: '주된 상속자' },{ clue: '도시개발·재개발 환지계획의 체비지·보류지', taxpayer: '사업시행자' },{ clue: '파산선고 후 파산종결 전 파산재단', taxpayer: '공부상 소유자' },{ clue: '소유권 귀속 자체가 불분명', taxpayer: '사용자' }],
    primary: ['6월 1일 과세기준일','사실상 소유자 확인','법 제107조 특례 대조','납세의무자 확정'],
    heir: { order: '민법상 상속지분이 가장 높은 사람', tie: '최연장자', report: '사실상 소유자를 신고하면 신고된 소유자로 판정' },
    trap: '파산재단의 관리인이 실질적으로 관리한다고 해서 파산관재사가 납세의무자가 되는 것은 아니다. 현행 조문은 공부상 소유자를 지정한다.',
    sources: [{ label: '지방세법 제107조', note: '사실상 소유자 원칙과 사례별 특례', href: 'https://www.law.go.kr/법령/지방세법/제107조' },{ label: '지방세법 제114조', note: '6월 1일 과세기준일', href: 'https://www.law.go.kr/법령/지방세법/제114조' },{ label: '지방세법 시행규칙 제53조', note: '주된 상속자의 결정 순서', href: 'https://www.law.go.kr/법령/지방세법시행규칙/제53조' }],
  },
  'development-activity-permit': {
    kind: 'development-permit-command-center', summary: '개발행위허가는 건축·형질변경·토석채취·토지분할·물건적치의 5개 레이더로 시작한다. 대상이면 면제·경미변경·심의·조건·준공검사·제한지역을 차례로 통과시킨다.',
    radar: [{ action: '건축물 건축·공작물 설치', permit: '원칙 허가' },{ action: '토지 형질변경', permit: '경작 목적 법정 예외' },{ action: '토석 채취', permit: '원칙 허가' },{ action: '토지 분할', permit: '건축물 있는 대지 등 구분' },{ action: '물건 1개월 이상 적치', permit: '녹지·관리·자연환경보전지역' }],
    bypass: [{ event: '도시·군계획사업에 의한 행위', route: '허가 제외' },{ event: '재해복구·재난수습 응급조치', route: '허가 없이 가능' },{ event: '부지·연면적 5% 이내 축소', route: '허가변경 없이 통지' },{ event: '국가·지자체 시행', route: '이행보증금 면제' }],
    restriction: [{ phase: '최초 제한', period: '1회·3년 이내', review: '도시계획위원회 심의' },{ phase: '법정 대상 연장', period: '1회·2년 이내', review: '원칙 심의' },{ phase: '기반시설부담구역 연장', period: '2년 이내', review: '심의 예외' }],
    process: ['허가대상 판정','허가기준·위원회 심의','필요 시 신청자 의견 듣고 조건 부가','허가·이행보증금','공사 완료','준공검사 또는 건축법 사용승인 특례'],
    sources: [{ label: '국토계획법 제56조', note: '개발행위 5종과 허가 제외', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제56조' },{ label: '국토계획법 제57·60·62조', note: '절차·이행보증금·준공검사', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제57조' },{ label: '국토계획법 제63조', note: '3년 제한과 2년 연장', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제63조' },{ label: '국토계획법 시행령 제52조', note: '5% 축소 등 경미한 변경 통지', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제52조' }],
  },
  'lease-terms-rent-deposit': {
    kind: 'lease-deposit-counterweight', summary: '보증금 반환과 목적물 반환은 맞물리지만, 적법한 점유와 무상 사용은 같은 말이 아니다. 점유·사용·수익을 세 칸으로 분리하면 판례의 결론이 선명해진다.',
    balance: [{ side: '임대인', duty: '보증금 반환 제공', effect: '제공 전에는 인도 지체 책임 제한' },{ side: '임차인', duty: '목적물 반환', effect: '동시이행항변으로 계속 점유 가능' }],
    states: [{ act: '열쇠 보관·사용하지 않음', result: '불법점유 아님', money: '사용이익 없음' },{ act: '계속 영업·거주', result: '점유 자체는 불법 아님', money: '실제 이익은 부당이득 가능' },{ act: '보증금 반환 제공 후 미인도', result: '항변 소멸 가능', money: '지체책임 검토' }],
    rent: ['경제사정 등으로 차임이 상당하지 않음','당사자 일방의 증감청구','장래에 향해 효력'],
    sources: [{ label: '민법 제536조', note: '동시이행항변권', href: 'https://www.law.go.kr/법령/민법/제536조' },{ label: '민법 제628조', note: '차임 증감청구권', href: 'https://www.law.go.kr/법령/민법/제628조' },{ label: '대법원 98다15545', note: '계속 점유와 실제 사용이익의 구별', href: 'https://www.law.go.kr/판례/(98다15545)' }],
  },
  'sales-comparison-adjustment-calculation': {
    kind: 'sales-comparison-adjustment-console', summary: '거래사례의 가격을 출발점으로 두고 사정·시점·지역·개별요인을 차례로 곱한다. 대상이 더 우세한 요인은 1보다 큰 보정치가 되어야 한다.',
    formula: ['사례가격 100만원/㎡','사정보정 1.00','시점수정 1.05','지역요인 0.98','개별요인 1.10'],
    result: '113.19만원/㎡',
    factors: [{ name: '사정보정', question: '비정상 거래였나?', cue: '정상가격으로 복원' },{ name: '시점수정', question: '가격시점이 다른가?', cue: '지가변동 등 반영' },{ name: '지역요인', question: '지역 수준이 다른가?', cue: '대상지역 ÷ 사례지역' },{ name: '개별요인', question: '획지 조건이 다른가?', cue: '대상 우세면 > 1' }],
    checks: ['단위면적 가격인지 확인','상승식은 각 (1±격차율)을 곱함','마지막에 대상 면적을 곱해 총액 산정'],
    sources: [{ label: '감정평가에 관한 규칙 제16조', note: '토지 감정평가의 비교방식', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제16조' },{ label: '감정평가 실무기준', note: '사정보정·시점수정·요인비교', href: 'https://www.law.go.kr/행정규칙/감정평가실무기준' },{ label: 'Q-Net 출제기준', note: '감정평가론 계산 범위', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' }],
  },
  'exclusive-agency-contract': {
    kind: 'exclusive-brokerage-calendar', summary: '전속중개계약의 숫자는 한 줄 암기가 아니라 서로 다른 의무의 시계다. 7일·즉시·2주·3개월·3년을 사건별로 걸어 두어야 한다.',
    timeline: [{ time: '계약일', task: '법정 서식으로 전속계약 체결' },{ time: '7일 이내', task: '정보망 또는 일간신문에 공개' },{ time: '공개 즉시', task: '공개 내용을 의뢰인에게 문서통지' },{ time: '2주마다', task: '중개업무 처리상황 문서통지' }],
    clocks: [{ number: '3개월', label: '기간 약정이 없을 때 유효기간' },{ number: '3년', label: '전속중개계약서 보존기간' }],
    privacy: ['의뢰인의 비공개 요청 → 공개 금지','권리자의 인적사항 → 공개 금지','임대차 → 공시지가 공개 생략 가능'],
    sources: [{ label: '공인중개사법 제23조', note: '전속계약·정보공개 의무', href: 'https://www.law.go.kr/법령/공인중개사법/제23조' },{ label: '공인중개사법 시행령 제20조', note: '유효기간과 공개정보', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제20조' },{ label: '시행규칙 별지 제15호서식', note: '7일·2주 통지와 계약서 내용', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙' }],
  },
  'development-project-special-case': {
    kind: 'development-land-movement-dock', summary: '대규모 개발지역은 필지별 신청보다 사업시행자가 단계별 신고와 일괄 토지이동 신청을 맡는다. 신고 시계와 토지이동 발생시점을 분리한다.',
    dock: [{ phase: '착수', clock: '사유 발생일부터 15일', record: '사업지역·시행자 신고' },{ phase: '변경', clock: '사유 발생일부터 15일', record: '변경 내용 신고' },{ phase: '완료', clock: '사유 발생일부터 15일', record: '완료 신고 후 이동 정리' }],
    rules: [{ issue: '토지이동 발생시점', answer: '형질변경 등 공사가 준공된 때' },{ issue: '원칙 신청자', answer: '해당 개발사업 시행자' },{ issue: '시행자 신청 불능', answer: '법정 대체신청자 확인' }],
    substitutes: ['주택법상 공동주택 부지 → 집합건물법상 관리인','관리인이 없으면 → 공유자가 선임한 대표자','개별 토지소유자는 먼저 시행자에게 이동신청 요청'],
    sources: [{ label: '공간정보관리법 제86조', note: '신고·신청·준공시점·대체신청', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제86조' },{ label: '같은 법 시행령 제83조', note: '대상 사업과 15일 신고', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제83조' },{ label: '같은 법 시행규칙 제95조', note: '신고서와 첨부서류', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제95조' }],
  },
  'tax-liability-priority': {
    kind: 'tax-priority-race', summary: '조세 배분은 압류 날짜부터 보지 않는다. 매각재산이 납세담보물인지 먼저 확인하면, 담보된 국세·강제징수비가 일반 압류 순위보다 앞선다.',
    gates: [{ test: '납세담보물인가?', yes: '제37조 특별우선 적용', no: '일반 압류선착수 검토' },{ test: '담보된 국세인가?', yes: '매각대금에서 최우선', no: '다른 국세·지방세 칸' }],
    podium: [{ rank: '1', claim: '그 재산에 담보된 국세 + 강제징수비', reason: '납세담보물 특별우선' },{ rank: '2', claim: '다른 국세·강제징수비·지방세', reason: '관계 법령에 따라 배분' }],
    warnings: ['납세담보 ≠ 사인 간 저당권','압류가 먼저라는 이유만으로 담보국세를 이기지 않음','일반 압류끼리의 선착수 규정과 분리'],
    sources: [{ label: '국세기본법 제36조', note: '압류에 의한 우선', href: 'https://www.law.go.kr/법령/국세기본법/제36조' },{ label: '국세기본법 제37조', note: '담보 있는 국세의 특별우선', href: 'https://www.law.go.kr/법령/국세기본법/제37조' },{ label: '지방세기본법 제73조', note: '압류 관련 지방세 우선', href: 'https://www.law.go.kr/법령/지방세기본법/제73조' }],
  },
  'use-zone-district-area-general': {
    kind: 'zoning-three-layer-atlas', summary: '용도지역·용도지구·용도구역은 역할도 지정 방식도 다르다. 조례 신설, 매립준공, 다른 법률의 의제는 같은 지도 위의 서로 다른 스위치다.',
    layers: [{ layer: '용도지역', role: '토지의 이용·건축 규모를 기본 배분', overlap: '상호 중복 지정 불가' },{ layer: '용도지구', role: '지역 제한을 강화·완화해 보완', overlap: '법정 기준 아래 조례형 신설 가능' },{ layer: '용도구역', role: '시가지 확산·보전 등 광역 목적', overlap: '별도 법정 목적' }],
    switches: [{ event: '새 용도지구', route: '부득이한 사유 등 시행령 기준 → 조례로 내용 → 관리계획 지정' },{ event: '공유수면 매립준공', route: '매립목적·인접 용도지역 일치 여부 판정' },{ event: '택지개발지구', route: '도시지역 결정·고시 의제' },{ event: '관리지역의 농업진흥지역', route: '농림지역 결정·고시 의제' }],
    locks: ['도시·군기본계획이 아니라 도시·군관리계획으로 결정','조례만 만들었다고 특정 토지가 자동 지정되는 것은 아님','둘 이상 용도지역과 접하면 자동으로 큰 쪽을 따르지 않음'],
    sources: [{ label: '국토계획법 제37조', note: '용도지구 지정과 조례형 지구', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제37조' },{ label: '국토계획법 시행령 제31조', note: '조례형 용도지구 신설 기준', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제31조' },{ label: '국토계획법 제41·42조', note: '매립준공구역·용도지역 의제', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제41조' }],
  },
  'attachment-of-property': {
    kind: 'attachment-independence-lab', summary: '부합은 “누가 붙였나”보다 “떼어도 독립한 물건으로 남나”를 먼저 본다. 독립성·분리가치·권원의 세 관문을 순서대로 통과시킨다.',
    gates: [{ test: '구조·이용상 독립한가?', yes: '별개 건물·물건 가능성', no: '기존 부동산 구성부분' },{ test: '분리 후 경제적 가치가 남나?', yes: '권원 관문으로', no: '강한 부합 → 원소유자 귀속' },{ test: '부속시킬 정당한 권원이 있나?', yes: '제256조 단서상 원소유 유지', no: '부동산 소유자에게 귀속' }],
    cases: [{ fixture: '독립성 없는 증축 방', title: '임차인이 설치', result: '기존 건물에 부합' },{ fixture: '임차권으로 설치한 분리가능 기계', title: '정당한 권원', result: '설치자 소유 가능' },{ fixture: '권원 없이 심은 수목', title: '권원 없음', result: '토지소유자 귀속' }],
    restitution: '부합으로 소유권을 잃은 사람의 손실은 소유권 주장과 별개로 민법 제261조의 부당이득 구상 문제를 검토한다.',
    sources: [{ label: '민법 제256조', note: '부동산 부합과 권원 예외', href: 'https://www.law.go.kr/법령/민법/제256조' },{ label: '민법 제261조', note: '첨부로 인한 구상권', href: 'https://www.law.go.kr/법령/민법/제261조' },{ label: '대법원 2015다69907', note: '분리 후 경제적 가치와 권원 예외의 한계', href: 'https://www.law.go.kr/판례/(2015다69907)' }],
  },
  'real-estate-business-cycle-phases': {
    kind: 'business-cycle-waveboard', summary: '부동산경기는 회복·상향·후퇴·하향의 파도를 돌지만 지역과 상품마다 진폭과 시차가 다르다. 각 국면의 가격·거래량·시장주도자를 함께 읽는다.',
    phases: [{ phase: '회복', price: '바닥 탈출·상승 전환', volume: '증가 시작', leader: '매수자 → 매도자' },{ phase: '상향', price: '상승 지속', volume: '활발', leader: '매도자 우위' },{ phase: '후퇴', price: '정점 후 상승 둔화', volume: '감소 전환', leader: '매도자 → 매수자' },{ phase: '하향', price: '하락 지속', volume: '위축', leader: '매수자 우위' }],
    signals: [{ signal: '상승국면', clue: '직전 거래가격이 새 거래의 하한 경향' },{ signal: '하향국면', clue: '건축허가 신청 감소' },{ signal: '안정시장', clue: '과거 거래가격의 기준성 확대' }],
    cautions: ['일반경기와 같은 주기·진폭이 아님','지역·용도별 비동조성','공급의 긴 시차로 진폭 확대 가능'],
    sources: [{ label: 'Q-Net 공인중개사 출제기준', note: '부동산 경기변동 학습범위', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },{ label: '한국부동산원 R-ONE', note: '가격·거래·시장지표 공식 통계', href: 'https://www.reb.or.kr/r-one/' },{ label: '국가통계포털 주택거래', note: '국면 판독용 공식 거래량 통계', href: 'https://kosis.kr/' }],
  },
  'permit-zone-designation-and-contract-validity': {
    kind: 'land-permit-validity-airlock', summary: '토지거래허가계약은 공고 효력, 면적 문턱, 계약 효력의 세 에어록을 지난다. 허가 전은 확정적 무효가 아니라 허가 여부가 열려 있는 유동적 무효다.',
    designation: [{ event: '지정 공고', day: 'D' },{ event: '유예기간', day: '5일' },{ event: '지정 효력 발생', day: 'D+5' }],
    thresholds: [{ zone: '주거지역', area: '60㎡ 이하' },{ zone: '상업·공업지역', area: '150㎡ 이하' },{ zone: '녹지지역', area: '200㎡ 이하' },{ zone: '미지정 구역', area: '60㎡ 이하' }],
    states: [{ state: '허가 전', effect: '유동적 무효', action: '허가 협력의무·임의 철회 제한' },{ state: '허가', effect: '소급해 유효', action: '계약상 이행청구 가능' },{ state: '불허가·쌍방 거절', effect: '확정적 무효', action: '급부 반환·무효 주장' }],
    sources: [{ label: '부동산거래신고법 제10·11조', note: '허가구역 지정과 계약허가', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제10조' },{ label: '같은 법 시행령 제9조', note: '용도지역별 면제면적', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률시행령/제9조' },{ label: '대법원 90다12243', note: '허가 전 유동적 무효 법리', href: 'https://www.law.go.kr/판례/(90다12243)' }],
  },
  'boundary-point-register': {
    kind: 'boundary-point-fieldbook', summary: '지상경계점등록부는 토지대장의 축소판이 아니라 현장에서 경계점을 다시 찾기 위한 필드북이다. 위치설명도·표지·좌표·사진을 한 점씩 묶는다.',
    sheet: [{ field: '토지소재·지번', value: '어느 필지인가' },{ field: '경계점 위치 설명도', value: '주변 지형·지물과 위치' },{ field: '경계점표지 종류', value: '콘크리트·금속 등 현장 표지' },{ field: '경계점 좌표', value: '좌표등록부 시행지역' },{ field: '사진파일', value: '현장 식별 자료' }],
    scene: [{ point: 'P1', marker: '금속표지', clue: '담장 모서리' },{ point: 'P2', marker: '콘크리트 말뚝', clue: '도로 경계' },{ point: 'P3', marker: '표지 없음', clue: '설명도·좌표로 복원' }],
    excluded: ['지목·면적은 토지대장 영역','소유권은 등기부 영역','경계점 현장정보가 이 장부의 핵심'],
    sources: [{ label: '공간정보관리법 제65조', note: '지상경계의 결정과 등록', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제65조' },{ label: '같은 법 시행규칙 제60조', note: '경계점표지 설치·관리', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제60조' },{ label: '시행규칙 별지 제58호서식', note: '지상경계점등록부 공식 서식', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙' }],
  },
  'non-filing-penalty': {
    kind: 'nonfiling-penalty-meter', summary: '무신고가산세는 신고 누락의 성격부터 가른다. 일반 무신고는 20%, 부정행위가 결합된 무신고는 40%를 기본 축으로 계산하고 감면 여부는 별도 단계다.',
    meters: [{ type: '일반 무신고', rate: 20, basis: '무신고 납부세액 × 20%' },{ type: '부정 무신고', rate: 40, basis: '무신고 납부세액 × 40%' }],
    example: { tax: '무신고 납부세액 1,000만원', normal: '일반 → 200만원', fraud: '부정 → 400만원' },
    route: ['법정신고기한까지 신고했는가','무신고 납부세액 산정','사기·그 밖의 부정한 행위인가','법정 세율 적용','기한 후 신고 등 감면요건 별도 검토'],
    warnings: ['본세가 사라지는 것이 아님','과소신고가산세와 구분','납부지연가산세가 별도로 붙을 수 있음'],
    sources: [{ label: '국세기본법 제47조의2', note: '국세 무신고가산세 20%·40%', href: 'https://www.law.go.kr/법령/국세기본법/제47조의2' },{ label: '지방세기본법 제53조', note: '지방세 무신고가산세', href: 'https://www.law.go.kr/법령/지방세기본법/제53조' },{ label: '국세기본법 제48조', note: '가산세 감면', href: 'https://www.law.go.kr/법령/국세기본법/제48조' }],
  },
  'building-permit-miscellaneous': {
    kind: 'building-compliance-switchboard', summary: '건축법의 산발적 숫자는 하나의 암기문장이 아니라 공작물·이행강제금·안전예치·특수대지·조경·구조안전의 여섯 스위치로 분리해야 한다.',
    switches: [{ desk: '공작물 신고', rule: '옹벽·담장 2m 초과 등 종류별 문턱' },{ desk: '이행강제금', rule: '허가위반 > 용적률 > 건폐율 > 신고위반' },{ desk: '안전관리예치금', rule: '조례상 연면적 1천㎡ 이상·공사비 1% 이내' },{ desk: '구분지상권', rule: '국가·지자체 대지의 법정 시설 특례' },{ desk: '대지 조경', rule: '녹지·관리지역과 일정 공장 예외' },{ desk: '구조안전', rule: '높이 13m 이상 또는 기둥간 10m 이상 등' }],
    objects: [{ object: '담장', threshold: '2m 초과' },{ object: '광고탑', threshold: '4m 초과' },{ object: '고가수조', threshold: '8m 초과' },{ object: '지하대피호', threshold: '30㎡ 초과' }],
    ladder: ['무허가 건축','용적률 초과','건폐율 초과','무신고 건축'],
    sources: [{ label: '건축법 제13조', note: '건축공사현장 안전관리예치금', href: 'https://www.law.go.kr/법령/건축법/제13조' },{ label: '건축법 제83조·시행령 제118조', note: '공작물 축조신고 대상', href: 'https://www.law.go.kr/법령/건축법시행령/제118조' },{ label: '건축법 제80조·시행령 별표15', note: '이행강제금 산정', href: 'https://www.law.go.kr/법령/건축법/제80조' },{ label: '건축법 시행령 제32조', note: '구조 안전 확인 대상', href: 'https://www.law.go.kr/법령/건축법시행령/제32조' }],
  },
  'mortgage-subrogation': {
    kind: 'mortgage-value-transformer', summary: '물상대위는 저당목적물의 교환가치가 보험금·보상금·매각대금으로 모습을 바꿔도 따라가는 장치다. 다만 지급 전에 채권을 특정해 압류해야 한다.',
    transform: [{ from: '저당건물 화재', to: '화재보험금청구권' },{ from: '공용수용', to: '수용보상금청구권' },{ from: '멸실·훼손', to: '손해배상청구권' }],
    process: ['대체가치 발생','제3채무자가 지급하기 전','저당권 증빙서류로 채권압류 신청','전부명령 또는 배당요구','배당요구 종기까지 우선권 행사'],
    races: [{ event: '일반채권자가 먼저 압류', result: '저당권자의 후속 압류·배당요구 가능' },{ event: '대체금이 이미 지급됨', result: '특정성 상실 → 물상대위 곤란' },{ event: '전세권이 저당목적', result: '전세금반환채권에 물상대위 가능' }],
    sources: [{ label: '민법 제342·370조', note: '저당권 물상대위와 지급 전 압류', href: 'https://www.law.go.kr/법령/민법/제342조' },{ label: '민사집행법 제273조', note: '담보권 실행을 위한 채권압류', href: 'https://www.law.go.kr/법령/민사집행법/제273조' },{ label: '대법원 2015다236547', note: '배당요구 종기까지 권리행사', href: 'https://www.law.go.kr/판례/(2015다236547)' }],
  },
  'housing-finance-and-ltv-dti-concepts': {
    kind: 'housing-finance-three-gauges', summary: 'LTV는 담보, DTI와 DSR은 소득을 분모로 쓴다. DTI는 주택담보대출 원리금과 기타대출 이자를, DSR은 모든 대출 원리금을 더해 더 넓게 본다.',
    gauges: [{ name: 'LTV', numerator: '주택담보대출액', denominator: '담보가치', example: '3억 ÷ 5억 = 60%' },{ name: 'DTI', numerator: '주담대 원리금 + 기타대출 이자', denominator: '연소득', example: '주택대출 중심' },{ name: 'DSR', numerator: '모든 가계대출 원리금', denominator: '연소득', example: '2천만 ÷ 5천만 = 40%' }],
    equity: [{ ltv: 'LTV 40%', equity: '자기자본 60%' },{ ltv: 'LTV 60%', equity: '자기자본 40%' },{ ltv: 'LTV 80%', equity: '자기자본 20%' }],
    risk: [{ rate: '변동금리', bearer: '차입자가 금리위험 부담' },{ rate: '고정금리', bearer: '대출자가 금리위험 부담' }],
    sources: [{ label: '은행업감독규정', note: 'LTV·DTI·DSR 감독기준', href: 'https://www.law.go.kr/행정규칙/은행업감독규정' },{ label: '금융위원회 DSR 안내', note: '모든 대출 원리금 ÷ 연소득', href: 'https://www.fsc.go.kr/no040101?cnId=1185' },{ label: '주택도시기금법 제9조', note: '기금의 법정 용도', href: 'https://www.law.go.kr/법령/주택도시기금법/제9조' }],
  },
  'sequential-title-trust': {
    kind: 'three-party-title-trust-chain', summary: '3자간 명의신탁은 계약선과 등기선을 분리한다. 신탁자·매도인의 매매계약은 살고, 수탁자 명의 등기는 무효지만, 수탁자와 거래한 제3자는 법이 별도로 보호한다.',
    actors: [{ actor: '甲 신탁자', role: '매매계약의 진짜 당사자' },{ actor: '乙 매도인', role: '소유권이 여전히 귀속' },{ actor: '丙 수탁자', role: '무효 등기의 명의인' },{ actor: '丁 제3자', role: '제4조제3항으로 권리취득' }],
    lines: [{ from: '甲', to: '乙', line: '매매계약 유효' },{ from: '乙', to: '丙', line: '직접 이전등기 무효' },{ from: '丙', to: '丁', line: '처분 시 제3자 권리 유효' }],
    remedies: [{ situation: '처분 전', claim: '甲이 乙에게 이전등기청구 + 乙 대위해 丙 말소청구' },{ situation: '丙이 5억원 처분', claim: '甲이 丙에게 처분이익 부당이득 직접청구' },{ situation: '丁이 명의신탁을 앎', claim: '악의만으로 제3자 보호 배제 안 됨' }],
    sources: [{ label: '부동산실명법 제4조', note: '약정·등기 무효와 제3자 보호', href: 'https://www.law.go.kr/법령/부동산실권리자명의등기에관한법률/제4조' },{ label: '대법원 2004다6764', note: '매매계약과 이전등기청구', href: 'https://www.law.go.kr/판례/(2004다6764)' },{ label: '대법원 2018다284233', note: '처분이익 직접 부당이득청구', href: 'https://www.law.go.kr/판례/(2018다284233)' }],
  },
  'cadastral-survey-period': {
    kind: 'cadastral-survey-dual-clock', summary: '지적측량은 측량 5일과 검사 4일의 두 시계가 기본이다. 기준점 설치가 들어오면 15점 이하 4일, 초과 4점마다 1일을 각각 해당 시계에 더한다.',
    clocks: [{ task: '측량기간', base: 5, color: 'survey' },{ task: '측량검사기간', base: 4, color: 'inspect' }],
    increments: [{ points: '기준점 15점 이하', add: '+4일' },{ points: '15점 초과', add: '+4일 + 초과 4점마다 1일' },{ points: '19점 예시', add: '+5일' }],
    agreement: { whole: '합의한 전체기간', survey: '4분의 3 · 측량', inspect: '4분의 1 · 검사' },
    calendar: ['의뢰 접수','다음 날까지 수행계획서','측량 실시','성과 검사','결과 교부'],
    sources: [{ label: '공간정보관리법 시행규칙 제25조', note: '5일·4일·기준점 가산과 합의기간', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제25조' },{ label: '공간정보관리법 제24조', note: '지적측량 의뢰', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제24조' }],
  },
  'tax-liability-extinction': {
    kind: 'tax-liability-extinction-vault', summary: '납부의무가 없어지는 문은 세 개뿐이다. 돈으로 끝내는 납부·충당, 징수권의 시간 경과, 부과권의 시간 경과를 승계사유와 분리한다.',
    doors: [{ door: '납부·충당', clock: '채무 이행', result: '징수금 소멸' },{ door: '징수권 소멸시효 완성', clock: '확정 후 징수 시간', result: '징수할 권리 소멸' },{ door: '부과 제척기간 만료', clock: '성립 후 부과 시간', result: '새로 확정할 수 없음' }],
    transfers: [{ event: '법인 합병', route: '합병법인에게 승계' },{ event: '납세의무자 사망', route: '상속인에게 승계' },{ event: '사업 양도', route: '법정 제2차 납세의무 별도 검토' }],
    compare: [{ term: '제척기간', target: '부과권', interruption: '중단·정지 없음이 원칙' },{ term: '소멸시효', target: '징수권', interruption: '독촉·압류 등 중단 가능' }],
    sources: [{ label: '지방세기본법 제37조', note: '지방자치단체 징수금 납부의무 소멸', href: 'https://www.law.go.kr/법령/지방세기본법/제37조' },{ label: '지방세기본법 제38조', note: '부과 제척기간', href: 'https://www.law.go.kr/법령/지방세기본법/제38조' },{ label: '지방세기본법 제39조', note: '징수권 소멸시효', href: 'https://www.law.go.kr/법령/지방세기본법/제39조' }],
  },
  'housing-administrative-miscellaneous': {
    kind: 'housing-administration-casefiles', summary: '한 카드에 섞인 주택법 규정은 사건파일로 분리한다. 사용검사 후 대지권 회복, 불이익처분 전 청문, 공급질서 교란 제재는 요건과 효과가 전혀 다르다.',
    files: [{ file: 'A', title: '사용검사 후 대지 소유권 회복', trigger: '종전 소유자의 사용검사 전 소송 등 법정 사유', effect: '사업주체의 회복 특례 검토' },{ file: 'B', title: '불이익처분 전 청문', trigger: '사업등록 말소·사업계획승인 취소·조합인가 취소 등', effect: '처분 전 의견진술 기회' },{ file: 'C', title: '공급질서 교란', trigger: '입주지위·상환사채·입주자저축증서 양수도·알선', effect: '지위 무효 또는 공급계약 취소' },{ file: 'D', title: '선의 매수인 보호', trigger: '교란 사실을 몰랐고 무관함을 소명', effect: '이미 체결된 계약 취소 금지' }],
    sanctions: ['교란 증서·지위 양도·양수 금지','알선·광고도 금지','거짓·부정한 공급 취득 금지','상속·저당은 양도·양수에서 제외'],
    hearing: ['주택건설사업 등록말소','사업계획승인 취소','주택조합 설립인가 취소','행위허가 취소 등 법정 열거'],
    sources: [{ label: '주택법 제22조', note: '매도청구 소송과 사용검사 후 특례', href: 'https://www.law.go.kr/법령/주택법/제22조' },{ label: '주택법 제65조', note: '공급질서 교란 금지와 제재·선의 매수인', href: 'https://www.law.go.kr/법령/주택법/제65조' },{ label: '주택법 제97조', note: '등록말소·인가취소 등 청문', href: 'https://www.law.go.kr/법령/주택법/제97조' }],
  },
  'transfer-security': {
    kind: 'transfer-security-two-layer-ledger', summary: '양도담보는 등기부의 겉모습과 당사자 사이의 담보 실질을 겹쳐 읽는다. 특별한 반대 약정이 없으면 설정자가 계속 사용·수익하고 임대할 수 있다.',
    layers: [{ layer: '대외적 겉모습', owner: '채권자 명의 이전등기', purpose: '교환가치 확보' },{ layer: '대내적 실질', owner: '채무자에게 사용·수익', purpose: '채권담보' }],
    lease: ['양도담보 설정','반대 약정 없음','설정자가 계속 점유','설정자 명의로 임대 가능'],
    forks: [{ event: '채무 전액 변제', result: '소유권 회복 청구' },{ event: '채무 불이행', result: '담보권 실행·청산' },{ event: '권리자가 사용하기로 특약', result: '설정자 사용·임대 원칙 배제' }],
    sources: [{ label: '대법원 2001다40213', note: '설정자의 사용·수익권과 임대권한', href: 'https://www.law.go.kr/판례/(2001다40213)' },{ label: '가등기담보법 제3·4조', note: '실행 통지·청산금과 소유권 취득', href: 'https://www.law.go.kr/법령/가등기담보등에관한법률/제3조' },{ label: '민법 제372조', note: '저당권 규정의 질권 준용', href: 'https://www.law.go.kr/법령/민법/제372조' }],
  },
  'real-estate-system-timeline-status': {
    kind: 'real-estate-policy-timeline', summary: '부동산제도는 도입 연도와 현재 상태를 별도 축으로 읽는다. 일반 실거래 신고는 현행이지만 특정 지역을 지정하던 별도 주택거래신고제는 2015년 폐지되었다.',
    timeline: [{ year: '1983', name: '공인중개사제도', state: '현행' },{ year: '1995', name: '부동산실명제', state: '현행' },{ year: '1998', name: '자산유동화제도', state: '현행' },{ year: '2006', name: '부동산거래신고제', state: '현행' },{ year: '2015', name: '주택거래신고지역제', state: '폐지' }],
    status: [{ state: '현행', items: '실거래 신고 · 토지거래허가 · 개발이익환수 · 종합부동산세' },{ state: '폐지', items: '택지소유상한 · 토지초과이득세 · 공한지세 · 별도 주택거래신고' }],
    trap: '이름이 비슷한 “부동산거래신고”와 “주택거래신고지역”을 합치지 않는다.',
    sources: [{ label: '부동산거래신고법 제3조', note: '현행 부동산 거래신고', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제3조' },{ label: '주택법 2015년 개정이유', note: '주택거래신고지역 지정제도 폐지', href: 'https://www.law.go.kr/법령/주택법/(13474,20150811)' },{ label: '부동산실명법', note: '1995년 제정·시행 연혁', href: 'https://www.law.go.kr/법령/부동산실권리자명의등기에관한법률' }],
  },
  'hlpa-general-application': {
    kind: 'housing-lease-protection-envelope', summary: '주택임대차보호법은 실제 주거용도라는 봉투 안에서 기간·갱신·승계를 임차인 보호 방향으로 묶는다. 2년 미만 약정은 임차인만 짧은 기간의 유효를 선택할 수 있다.',
    scope: [{ case: '실제 주거용', result: '적용' },{ case: '일부 비주거 사용', result: '적용' },{ case: '미등기 전세', result: '준용' },{ case: '공부상 주택이나 실제 비주거', result: '실제 용도로 판정' }],
    clocks: [{ trigger: '2년 미만 약정', clock: '원칙 2년', option: '임차인은 짧은 약정 주장 가능' },{ trigger: '묵시적 갱신', clock: '2년', option: '임차인은 언제든 해지통지' },{ trigger: '갱신 후 해지통지', clock: '3개월', option: '임대인 도달 후 효력' }],
    succession: ['대항력 있는 주택 양수인 → 임대인 지위 승계','상속인 없는 사망 → 법정 요건의 사실혼 배우자 승계'],
    sources: [{ label: '주택임대차보호법 제2조', note: '주거용 건물·일부 비주거·미등기 전세', href: 'https://www.law.go.kr/법령/주택임대차보호법/제2조' },{ label: '같은 법 제4조', note: '2년과 임차인의 단기약정 주장', href: 'https://www.law.go.kr/법령/주택임대차보호법/제4조' },{ label: '같은 법 제6·6조의2', note: '묵시적 갱신과 3개월 해지', href: 'https://www.law.go.kr/법령/주택임대차보호법/제6조' }],
  },
  'repurchase-registration': {
    kind: 'repurchase-registration-form', summary: '환매특약등기는 되살 때 정산할 금액과 기간을 공시하는 작은 서식이다. 지급대금·매매비용은 기록하고, 환매기간은 등기원인에 약정이 있을 때만 기록한다.',
    fields: [{ field: '매수인이 지급한 대금', value: '3억원', required: '기록' },{ field: '매매비용', value: '500만원', required: '기록' },{ field: '환매기간', value: '3년 약정', required: '약정 시 기록' }],
    rejected: ['채권최고액','이자지급시기','채무자 신용등급'],
    process: ['매매와 동시에 환매특약','소유권이전등기 신청','환매특약을 부기등기','약정사항 중 법정 항목 기록'],
    sources: [{ label: '부동산등기법 제53조', note: '대금·비용·약정된 환매기간', href: 'https://www.law.go.kr/법령/부동산등기법/제53조' },{ label: '민법 제590조', note: '환매의 의의와 동시 특약', href: 'https://www.law.go.kr/법령/민법/제590조' },{ label: '민법 제591조', note: '환매기간의 제한', href: 'https://www.law.go.kr/법령/민법/제591조' }],
  },
  'property-tax-taxpayer-co-ownership': {
    kind: 'coowner-property-tax-splitter', summary: '공유재산의 재산세는 대표자 한 명에게 몰지 않고 과세기준일 현재 각 지분에 나눈다. 지분 표시가 없으면 균등지분으로 본다.',
    formula: '전체 재산세 × 각 공유지분 = 각 지분권자의 납세 부분',
    examples: [{ setup: '甲 1/2 · 乙 1/3 · 丙 1/6', tax: '재산세 120만원', split: '甲 60 · 乙 40 · 丙 20만원' },{ setup: '3인 · 지분 표시 없음', tax: '재산세 120만원', split: '각 40만원' }],
    gates: ['6월 1일 현재 사실상 소유자 확인','공유재산인지 확인','등기·공부의 지분 확인','미표시면 균등 배분'],
    sources: [{ label: '지방세법 제107조', note: '공유재산 지분권자와 균등지분', href: 'https://www.law.go.kr/법령/지방세법/제107조' },{ label: '지방세법 제114조', note: '재산세 과세기준일 6월 1일', href: 'https://www.law.go.kr/법령/지방세법/제114조' }],
  },
  'farmland-entrusted-management-reasons': {
    kind: 'farmland-entrustment-gate', summary: '소유 농지의 위탁경영은 노동력이 모자란다는 사정만으로 열리지 않는다. 법이 정한 신분·장소·기간·사업계획의 문을 통과해야 한다.',
    allowed: [{ reason: '징집·소집', threshold: '병역법상' },{ reason: '국외여행', threshold: '3개월 이상' },{ reason: '질병·부상 치료', threshold: '3개월 이상' },{ reason: '선거로 공직 취임', threshold: '자경 곤란' },{ reason: '농업법인 청산', threshold: '청산 중' },{ reason: '농지이용증진사업', threshold: '시행계획에 따라' }],
    denied: [{ case: '국내여행 6개월', why: '국외가 아님' },{ case: '치료 2개월', why: '3개월 미달' },{ case: '단순 노동력 부족', why: '법정 사유 아님' }],
    decision: ['위탁하려는 범위 확인','농지법 제9조 법정사유 대조','기간·장소 문턱 확인','증빙을 갖춰 위탁경영'],
    sources: [{ label: '농지법 제9조', note: '소유 농지 위탁경영의 제한과 예외', href: 'https://www.law.go.kr/법령/농지법/제9조' },{ label: '농지법 제6조', note: '자기 농업경영 이용 원칙', href: 'https://www.law.go.kr/법령/농지법/제6조' },{ label: '농지법 제17조', note: '농지이용증진사업 시행계획', href: 'https://www.law.go.kr/법령/농지법/제17조' }],
  },
  'land-lessee-rights': {
    kind: 'land-lessee-protection-ladder', summary: '건물 소유 목적 토지임차인은 건물 보존등기로 대항력을 만들고, 기간 만료 때 갱신을 먼저 청구한 뒤 거절되면 지상물 매수를 청구한다.',
    ladder: [{ step: '토지임대차', condition: '건물 소유 목적' },{ step: '건물 보존등기', condition: '임차인 자기 명의' },{ step: '제3자 대항', condition: '토지임대차 미등기도 가능' },{ step: '기간 만료', condition: '건물 등 지상시설 현존' },{ step: '갱신 거절', condition: '상당가액 매수청구' }],
    gates: [{ case: '기간 만료 + 건물 현존', result: '갱신·매수청구 가능' },{ case: '차임연체로 계약 해지', result: '매수청구 불가' },{ case: '무허가 건물', result: '특별사정 없으면 대상 가능' }],
    price: '매수가액은 청구 당시 건물의 객관적 거래가액이며, 건물에서 얻은 영업상 수익까지 더하지 않는다.',
    sources: [{ label: '민법 제622조', note: '건물등기 있는 토지임대차의 대항력', href: 'https://www.law.go.kr/법령/민법/제622조' },{ label: '민법 제643조', note: '갱신청구권과 매수청구권', href: 'https://www.law.go.kr/법령/민법/제643조' },{ label: '대법원 97다37753', note: '무허가건물과 상당가액의 범위', href: 'https://www.law.go.kr/판례/(97다37753)' }],
  },
  'public-rental-housing-types': {
    kind: 'public-rental-housing-portfolio', summary: '공공임대주택 8종은 대상·기간·조달방식으로 분류한다. 행복주택은 젊은 층, 통합공공임대는 여러 계층을 포괄하며, 공공지원민간임대는 별도 법률의 민간주택이다.',
    portfolio: [{ name: '영구임대', cue: '최저소득층', term: '50년 이상·영구' },{ name: '국민임대', cue: '저소득 서민', term: '30년 이상' },{ name: '행복주택', cue: '대학생·청년·신혼부부', term: '젊은 층' },{ name: '통합공공임대', cue: '여러 소득·취약계층', term: '통합형' },{ name: '장기전세', cue: '전세계약 방식', term: '20년 의무기간' },{ name: '분양전환', cue: '임대 후 소유 전환', term: '일정 기간' },{ name: '매입임대', cue: '기존주택 매입', term: '재공급' },{ name: '전세임대', cue: '기존주택 임차', term: '수요자에게 전대' }],
    routes: [{ verb: '건설·장기임대', types: '영구 · 국민 · 행복 · 통합' },{ verb: '계약방식', types: '장기전세 · 분양전환' },{ verb: '기존재고 활용', types: '매입임대 · 전세임대' }],
    outsider: '공공지원민간임대주택 → 민간임대주택법상 제도, 공공주택 특별법상 공공임대 8종 밖',
    sources: [{ label: '공공주택 특별법 제2조', note: '공공주택·공공임대주택 정의', href: 'https://www.law.go.kr/법령/공공주택특별법/제2조' },{ label: '같은 법 시행령 제2조', note: '공공임대주택 8개 유형', href: 'https://www.law.go.kr/법령/공공주택특별법시행령/제2조' },{ label: '민간임대주택법 제2조', note: '공공지원민간임대의 별도 정의', href: 'https://www.law.go.kr/법령/민간임대주택에관한특별법/제2조' }],
  },
  'commercial-lease-renewal': {
    kind: 'commercial-renewal-control-panel', summary: '상가 갱신요구는 만료 6개월 전부터 1개월 전까지 누르는 버튼이고 보호총량은 최초 계약부터 10년이다. 3기 연체·무단전대 등 법정 거절사유가 있으면 버튼이 잠긴다.',
    window: [{ mark: '만료 −6개월', state: '요구 가능 시작' },{ mark: '만료 −1개월', state: '요구 가능 종료' },{ mark: '만료일', state: '이후 새 요구 불가' }],
    total: [{ elapsed: '8년', result: '10년 이내 범위로 갱신 가능' },{ elapsed: '10년', result: '갱신요구권 보호총량 도달' }],
    locks: ['3기 차임액에 달하는 연체','거짓·부정한 방법으로 임차','임대인 동의 없는 전대','고의·중대한 과실로 파손','철거·재건축의 법정 사유'],
    exception: '환산보증금 초과 + 기간을 정하지 않은 임대차는 1년 기간의제가 적용되지 않아 갱신요구권이 발생하지 않는다는 판례가 있다.',
    sources: [{ label: '상가임대차법 제10조', note: '행사기간·10년·갱신거절사유', href: 'https://www.law.go.kr/법령/상가건물임대차보호법/제10조' },{ label: '대법원 2021다233730', note: '고액·기간 미정 임대차의 갱신요구', href: 'https://www.law.go.kr/판례/(2021다233730)' },{ label: '같은 법 제10조의8', note: '3기 연체와 계약해지', href: 'https://www.law.go.kr/법령/상가건물임대차보호법/제10조의8' }],
  },
  'land-category-types': {
    kind: 'cadastral-category-constellation', summary: '지목은 토지의 주된 용도에 따라 법이 닫힌 목록으로 정한 28개뿐이다. 도면에는 정식 명칭 대신 법정 부호를 쓰며 “선로용지” 같은 생활용어를 새 지목으로 만들 수 없다.',
    families: [{ family: '농업·자연', items: ['전','답','과수원','목장용지','임야','광천지','염전'] },{ family: '건축·사업', items: ['대','공장용지','학교용지','주차장','주유소용지','창고용지'] },{ family: '교통·수계', items: ['도로','철도용지','제방','하천','구거','유지'] },{ family: '공공·여가', items: ['양어장','수도용지','공원','체육용지','유원지'] },{ family: '문화·기타', items: ['종교용지','사적지','묘지','잡종지'] }],
    symbols: [{ name: '전', code: '전' },{ name: '공장용지', code: '장' },{ name: '주차장', code: '차' },{ name: '하천', code: '천' },{ name: '유원지', code: '원' },{ name: '잡종지', code: '잡' }],
    trap: '철도 선로·역사 등의 부지는 “선로용지”가 아니라 철도용지다.',
    sources: [{ label: '공간정보관리법 제67조', note: '지목의 종류와 설정 원칙', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률/제67조' },{ label: '같은 법 시행령 제58조', note: '28개 지목별 구분 기준', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행령/제58조' },{ label: '같은 법 시행규칙 제64조', note: '지적도·임야도의 지목 부호', href: 'https://www.law.go.kr/법령/공간정보의구축및관리등에관한법률시행규칙/제64조' }],
  },
  'property-tax-base-date': {
    kind: 'june-first-tax-snapshot', summary: '재산세와 종합부동산세는 매년 6월 1일 0시의 소유관계를 한 장의 사진처럼 고정한다. 7월·9월은 납부 시기일 뿐 납세자를 다시 정하는 날이 아니다.',
    calendar: [{ date: '5월 31일', event: '매수 전', taxpayer: '매도인 보유' },{ date: '6월 1일', event: '과세 스냅샷', taxpayer: '이날 사실상 소유자' },{ date: '6월 15일', event: '소유권 이전', taxpayer: '그 해 기준일은 이미 지남' },{ date: '7·9월', event: '재산세 납기', taxpayer: '기준일 납세자가 납부' }],
    compare: [{ tax: '재산세', statute: '지방세법 제114조', date: '6월 1일' },{ tax: '종합부동산세', statute: '종부세법 제3조 → 지방세법 준용', date: '6월 1일' }],
    settlement: '매매계약에서 재산세를 일할 정산해도 이는 당사자 내부 부담 약정이며 법정 납세의무자를 바꾸지 않는다.',
    sources: [{ label: '지방세법 제114조', note: '재산세 과세기준일 매년 6월 1일', href: 'https://www.law.go.kr/법령/지방세법/제114조' },{ label: '지방세법 제107조', note: '과세기준일의 사실상 소유자', href: 'https://www.law.go.kr/법령/지방세법/제107조' },{ label: '종합부동산세법 제3조', note: '재산세 과세기준일 준용', href: 'https://www.law.go.kr/법령/종합부동산세법/제3조' }],
  },
  'urban-development-association': {
    kind: 'urban-association-consent-blueprint', summary: '도시개발조합은 전부 환지방식의 시행자다. 7명이 정관을 만들고, 전체 면적 3분의 2와 소유자 수 2분의 1의 이중 동의를 받아 인가·등기로 완성한다.',
    blueprint: [{ step: '발기', value: '토지 소유자 7명 이상' },{ step: '정관', value: '법정 사항 작성' },{ step: '면적 동의', value: '전체 토지면적 2/3 이상' },{ step: '인원 동의', value: '소유자 총수 1/2 이상' },{ step: '설립인가', value: '지정권자' },{ step: '성립', value: '주된 사무소에서 등기' }],
    landRule: [{ scene: '환지방식 조합 설립', publicLand: '국공유지 포함', denominator: '구역 전체 면적' },{ scene: '수용방식 특정 시행자 요건', publicLand: '국공유지 제외 규정 있음', denominator: '장면을 분리' }],
    memory: '면적은 2/3, 사람은 1/2. 조합설립의 분모에는 국공유지도 포함한다.',
    sources: [{ label: '도시개발법 제11조', note: '전부 환지방식의 조합 시행자', href: 'https://www.law.go.kr/법령/도시개발법/제11조' },{ label: '도시개발법 제13조', note: '7명·면적 2/3·인원 1/2·인가', href: 'https://www.law.go.kr/법령/도시개발법/제13조' },{ label: '도시개발법 제14조', note: '조합원과 등기에 의한 성립', href: 'https://www.law.go.kr/법령/도시개발법/제14조' },{ label: '도시개발업무지침', note: '국공유지를 포함한 면적 산정', href: 'https://www.law.go.kr/행정규칙/도시개발업무지침' }],
  },
  'non-genuine-intent-expression': {
    kind: 'non-genuine-intent-three-minds', summary: '비진의표시는 “원하지 않았다”가 아니라 표시와 법률효과를 발생시키려는 의사가 어긋났는지를 본다. 상대방의 선의·과실 여부가 유효와 무효를 가른다.',
    minds: [{ layer: '내심의 소망', question: '정말 결과를 바랐나?', effect: '진의 판단의 직접 기준 아님' },{ layer: '표시 의사', question: '그 말·서명을 하려 했나?', effect: '있을 수 있음' },{ layer: '효과 의사', question: '표시대로 법률효과를 내려 했나?', effect: '없음을 스스로 알면 비진의' }],
    matrix: [{ speaker: '진의 아님을 앎', listener: '선의·무과실', result: '원칙 유효' },{ speaker: '진의 아님을 앎', listener: '악의 또는 과실', result: '무효' },{ speaker: '불이익을 피하려 실제 사직 선택', listener: '누구든', result: '비진의 아님' }],
    thirdParty: ['당사자 사이 무효','선의 제3자 등장','무효를 제3자에게 대항 못 함'],
    sources: [{ label: '민법 제107조', note: '비진의표시의 효력과 제3자 보호', href: 'https://www.law.go.kr/법령/민법/제107조' },{ label: '대법원 90다13222', note: '형식적 사직·재입사의 비진의 판단', href: 'https://www.law.go.kr/판례/(90다13222)' },{ label: '서울고법 90나6387', note: '불이익을 고려한 사직은 비진의가 아님', href: 'https://www.law.go.kr/판례/(90나6387)' }],
  },
  'mbs-securitization': {
    kind: 'mbs-risk-routing-board', summary: 'MBS는 기초대출에서 생긴 조기상환·채무불이행 위험과 현금흐름을 누구에게 보낼지 설계한다. MPTS·MBB·MPTB·CMO의 배관을 비교하면 암기가 계산처럼 바뀐다.',
    products: [{ name: 'MPTS', form: '지분형', cash: '원리금 그대로 통과', prepay: '투자자', defaultRisk: '투자자' },{ name: 'MBB', form: '채권형', cash: '약정 원리금', prepay: '발행자', defaultRisk: '발행자·초과담보' },{ name: 'MPTB', form: '혼합형', cash: '상환액 통과', prepay: '투자자', defaultRisk: '발행자' },{ name: 'CMO', form: '다계층형', cash: '트랜치별 재배분', prepay: '층별 배분', defaultRisk: '신용보강 구조' }],
    prepayFlow: ['시장금리 하락','차입자 대환·조기상환 증가','투자자 원금 조기 회수','낮은 금리에 재투자 위험'],
    caution: '“MBB 투자자는 아무 위험도 없다”가 아니라 기초 저당대출의 두 위험을 발행자가 직접 흡수한다는 비교다.',
    sources: [{ label: '한국주택금융공사 K-MBS', note: 'MBS·MBB 구조와 발행상품', href: 'https://kmbs.hf.go.kr/biz/prodExpln/prodExplnMbs.do?MENU_ID=SM1000&SES_MENU_ID=SM0001' },{ label: 'HF 주택금융리서치 2024', note: 'CMO 다중 만기 트랜치 구조', href: 'https://researcher.hf.go.kr/researcher/sub02/sub02_08.do?articleNo=592214' },{ label: '한국주택금융공사법 제32조', note: '주택저당채권 유동화 업무', href: 'https://www.law.go.kr/법령/한국주택금융공사법/제32조' }],
  },
  'commercial-lease-scope-and-enforceability': {
    kind: 'commercial-deposit-threshold-xray', summary: '환산보증금 문턱을 넘으면 법 전체가 사라지는 것이 아니다. 대항력·갱신·권리금·3기 연체는 살아남고, 확정일자 우선변제·1년 기간의제·소액 최우선변제는 빠진다.',
    formula: '환산보증금 = 보증금 + (월차임 × 100)',
    survives: [{ rule: '대항력', article: '제3조' },{ rule: '계약갱신요구', article: '제10조' },{ rule: '권리금 회수기회', article: '제10조의4' },{ rule: '3기 연체 해지', article: '제10조의8' }],
    excluded: [{ rule: '확정일자 우선변제', article: '제5조' },{ rule: '1년·존속 기간의제', article: '제9조' },{ rule: '소액보증금 최우선변제', article: '제14조' }],
    case: { deposit: '보증금 5억원', rent: '월차임 500만원', converted: '환산 10억원', result: '지역 한도와 비교 → 초과 시 X-ray 표 적용' },
    sources: [{ label: '상가임대차법 제2조', note: '환산보증금과 초과 임대차 적용조항', href: 'https://www.law.go.kr/법령/상가건물임대차보호법/제2조' },{ label: '상가임대차법 제3·5조', note: '대항력과 확정일자 우선변제의 구별', href: 'https://www.law.go.kr/법령/상가건물임대차보호법/제3조' },{ label: '대법원 2021다233730', note: '초과·기간 미정 임대차의 갱신요구', href: 'https://www.law.go.kr/판례/(2021다233730)' }],
  },
  'building-status-registration': {
    kind: 'building-registry-two-desk', summary: '건물 합병은 표제부의 물리적 현황을 고치는 표시등기이고, 저당권 이전은 을구의 권리 승계를 적는 부기등기다. 담당 창구와 목적을 먼저 분리한다.',
    desks: [{ desk: '표제부', subject: '건물의 표시', fields: ['소재·지번','종류·구조','면적','합병·분할'], clock: '대장 합병등록 후 1개월' },{ desk: '갑·을구', subject: '권리에 관한 등기', fields: ['소유권','저당권','전세권','임차권'], clock: '저당권 이전은 부기등기' }],
    merger: ['건축물대장 합병등록','등기명의인의 1개월 내 신청','기존 등기기록 정리·폐쇄','새 건물 표제부에 합병 반영'],
    rank: [{ registry: '주등기', rank: '접수 순서로 독립 순위' },{ registry: '부기등기', rank: '기초가 된 주등기의 순위 승계' }],
    sources: [{ label: '부동산등기법 제3조', note: '표시와 권리에 관한 등기 대상', href: 'https://www.law.go.kr/법령/부동산등기법/제3조' },{ label: '부동산등기법 제41조', note: '변경·합병 등의 등기 신청', href: 'https://www.law.go.kr/법령/부동산등기법/제41조' },{ label: '부동산등기규칙 제2조', note: '부기등기의 번호와 기초등기 표시', href: 'https://www.law.go.kr/법령/부동산등기규칙/제2조' },{ label: '부동산등기규칙 제98조', note: '건물 분할·합병 등기 실행', href: 'https://www.law.go.kr/법령/부동산등기규칙/제98조' }],
  },
  'property-tax-payment-in-kind': {
    kind: 'property-tax-payment-in-kind-checkpoint', summary: '재산세 물납은 1천만원 초과만 보는 제도가 아니다. 세액·신청시계·관할·자산 적격성·허가의 다섯 검문소를 모두 통과해야 한다.',
    checkpoints: [{ gate: '세액', pass: '도시지역분 포함 1천만원 초과' },{ gate: '기한', pass: '납부기한 10일 전까지 신청' },{ gate: '장소', pass: '해당 시·군·구 관할구역' },{ gate: '재산', pass: '관리·처분 가능한 부동산' },{ gate: '처분', pass: '지자체장 허가' }],
    clock: [{ day: 'D−10', action: '물납허가 신청 마감' },{ day: '신청+5일', action: '허가 여부 서면통지' },{ day: '불허통지+10일', action: '다른 부동산 변경신청 가능' },{ day: '납부기한', action: '허가 부동산 물납 완료' }],
    example: { tax: '도시지역분 포함 1,200만원', property: '다른 시 소재 토지', verdict: '금액 ○ · 관할 × → 그대로는 물납 불가' },
    sources: [{ label: '지방세법 제117조', note: '1천만원 초과와 관할 부동산 물납', href: 'https://www.law.go.kr/법령/지방세법/제117조' },{ label: '지방세법 시행령 제113조', note: '10일 전 신청·5일 내 통지', href: 'https://www.law.go.kr/법령/지방세법시행령/제113조' },{ label: '지방세법 시행령 제114조', note: '부적당 재산과 변경신청', href: 'https://www.law.go.kr/법령/지방세법시행령/제114조' }],
  },
  'maintenance-plan-designation-procedure': {
    kind: 'maintenance-zone-procedure-rail', summary: '정비구역은 조사부터 지정·고시까지 한 노선을 탄다. 일반 절차의 30일 공람·60일 의회 의견과 공공재개발 예정구역의 30일 심의를 서로 다른 시계로 분리한다.',
    rail: [{ station: '기초조사', detail: '주민·산업·소유·가격·교통' },{ station: '정비계획안', detail: '입안권자가 작성' },{ station: '서면통보·설명회', detail: '주민에게 계획 공개' },{ station: '주민공람', detail: '30일 이상' },{ station: '지방의회 의견', detail: '통지일부터 60일' },{ station: '도시계획위원회', detail: '심의' },{ station: '지정·고시', detail: '정비구역 효력 공시' }],
    clocks: [{ task: '일반 주민공람', period: '30일 이상' },{ task: '지방의회 의견제시', period: '60일 이내' },{ task: '공공재개발 예정구역 심의', period: '30일 + 불가피 시 30일' }],
    integrated: ['건축 심의','경관 심의','교통영향평가 등 법정 심의','통합심의 결과를 특별한 사유 없으면 인가에 반영'],
    sources: [{ label: '도시정비법 제9조', note: '정비계획의 내용과 기초조사', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제9조' },{ label: '도시정비법 제15조', note: '서면통보·설명회·30일 공람·의회 의견', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제15조' },{ label: '도시정비법 제16조', note: '정비구역 지정·고시', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제16조' },{ label: '같은 법 시행령 제81조', note: '공공재개발 30일 심의', href: 'https://www.law.go.kr/법령/도시및주거환경정비법시행령/제81조' }],
  },
  'acquisitive-prescription': {
    kind: 'prescription-two-engine', summary: '부동산 취득시효는 20년 점유형과 10년 등기부형이라는 두 엔진이 다르다. 자주점유 추정은 출발점일 뿐, 취득원인이 없음을 알면서 한 무단점유가 입증되면 특별한 사정이 없는 한 꺼진다.',
    engines: [{ name: '점유취득시효', period: '20년', requirements: ['소유의 의사','평온·공연한 점유','완성 후 이전등기'] },{ name: '등기부취득시효', period: '10년', requirements: ['소유자로 등기','소유의 의사·평온·공연','선의·무과실'] }],
    tests: [{ fact: '타인 소유임만 알았음', verdict: '그 사정만으로 번복 아님' },{ fact: '매매 등 권원 성질이 타주점유', verdict: '추정 번복' },{ fact: '취득원인 없음을 알면서 무단점유', verdict: '추정 번복' },{ fact: '취득서류 없지만 적법취득 가능성 존재', verdict: '사정 종합' }],
    finish: '20년이 지났다는 사실만으로 소유권이 자동 이전되지 않는다. 점유취득시효 완성자는 등기를 해야 소유권을 취득한다.',
    sources: [{ label: '민법 제197조', note: '자주·선의·평온·공연 점유의 추정', href: 'https://www.law.go.kr/법령/민법/제197조' },{ label: '민법 제245조', note: '20년 점유형과 10년 등기부형', href: 'https://www.law.go.kr/법령/민법/제245조' },{ label: '대법원 95다28625 전원합의체', note: '악의의 무단점유와 추정 번복', href: 'https://www.law.go.kr/판례/(95다28625)' },{ label: '대법원 2006다28065', note: '외형적·객관적 자주점유 판단', href: 'https://www.law.go.kr/판례/(2006다28065)' }],
  },
  'auction-rights-extinction-and-assumption': {
    kind: 'auction-rights-lifeboat', summary: '경매는 등기순서만 외우는 문제가 아니다. 먼저 저당권·압류 등 말소기준권리를 세우고, 대항할 수 없는 권리는 물속으로, 선순위 대항권과 유치권은 매수인 쪽 구명정으로 보낸다.',
    rights: [{ right: '저당권·근저당권', result: '소멸', condition: '순위와 무관하게 매각으로 소멸' },{ right: '후순위 지상권·지역권·전세권', result: '소멸', condition: '저당권·압류 등에 대항할 수 없음' },{ right: '최선순위 전세권', result: '조건부', condition: '배당요구하면 소멸, 하지 않으면 인수' },{ right: '선순위 지상권·지역권·등기임차권', result: '인수', condition: '말소기준권리에 대항 가능' },{ right: '대항력 없는 임차권', result: '소멸', condition: '매각으로 소멸' },{ right: '적법한 유치권', result: '인수', condition: '매수인이 담보채권 변제 책임' }],
    clock: ['매각허가결정','대금지급기한','매각대금 완납','매수인이 권리 취득'],
    sources: [{ label: '민사집행법 제91조', note: '저당권·전세권·지상권·유치권의 소멸과 인수', href: 'https://www.law.go.kr/법령/민사집행법/제91조' },{ label: '민사집행법 제135조', note: '대금 완납 때 권리 취득', href: 'https://www.law.go.kr/법령/민사집행법/제135조' },{ label: '대법원 2010마1544', note: '압류 효력 전 취득한 유치권의 대항력', href: 'https://www.law.go.kr/판례/(2010마1544)' }],
  },
  'broker-license-issuance': {
    kind: 'broker-license-security-card', summary: '자격증은 합격 공고 뒤 1개월 안에 교부되는 개인 전용 보안카드다. 빌려주는 사람·빌려 쓰는 사람뿐 아니라 그 거래를 알선한 사람까지 법이 각각 금지한다.',
    issue: [{ step: '합격자 결정 공고', detail: '시·도지사가 합격자 결정' },{ step: '교부대장 기재', detail: '합격자 사항과 자격증 번호 기록' },{ step: '자격증 교부', detail: '공고일부터 1개월 이내' }],
    prohibitions: [{ actor: '자격증 보유자', ban: '성명사용 허용·양도·대여 금지', effect: '자격취소·형사책임' },{ actor: '사용자', ban: '양수·대여받아 사용 금지', effect: '형사책임' },{ actor: '알선자', ban: '금지행위 알선 금지', effect: '형사책임' }],
    memory: '교부는 시행규칙 제3조의 “1개월”, 보안은 법 제7조의 “주는 자·쓰는 자·알선자” 세 방향으로 분리한다.',
    sources: [{ label: '공인중개사법 시행규칙 제3조', note: '교부대장과 공고일부터 1개월 이내 교부', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제3조' },{ label: '공인중개사법 제7조', note: '성명사용·양도·대여·사용·알선 금지', href: 'https://www.law.go.kr/법령/공인중개사법/제7조' },{ label: '공인중개사법 제35조', note: '자격증 대여 등의 자격취소', href: 'https://www.law.go.kr/법령/공인중개사법/제35조' },{ label: '공인중개사법 제49조', note: '금지행위의 형사처벌', href: 'https://www.law.go.kr/법령/공인중개사법/제49조' }],
  },
  'building-coverage-floor-ratio': {
    kind: 'coverage-ratio-sky-map', summary: '건폐율은 대지 위를 얼마나 덮는지 보는 수평 밀도다. 시행령의 범위 안에서 실제 상한은 도시·군계획조례가 정하므로, 전국 최대치와 해당 지자체 적용값을 같은 숫자로 읽으면 안 된다.',
    zones: [{ zone: '생산녹지', cap: 20 },{ zone: '계획관리', cap: 40 },{ zone: '근린상업', cap: 70 },{ zone: '유통상업', cap: 80 },{ zone: '중심상업', cap: 90 }],
    specials: [{ place: '자연녹지 개발진흥지구', cap: '30% 이하' },{ place: '수산자원보호구역', cap: '40% 이하' },{ place: '자연공원', cap: '60% 이하' },{ place: '계획관리 산업·유통개발진흥지구', cap: '60% 이하' },{ place: '농공단지', cap: '70% · 조건부 80%' }],
    localRule: '시행령은 조례가 정할 수 있는 범위를 제시한다. 실제 허용 건폐율은 해당 특별시·광역시·시·군의 도시·군계획조례를 다시 확인한다.',
    sources: [{ label: '국토계획법 제77조', note: '용도지역 건폐율과 조례 위임', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제77조' },{ label: '국토계획법 시행령 제84조', note: '용도지역별 건폐율 범위와 특례', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제84조' },{ label: '건축법 제55조', note: '건폐율은 국토계획법 기준에 따름', href: 'https://www.law.go.kr/법령/건축법/제55조' }],
  },
  'capital-gains-tax-exemption': {
    kind: 'emigration-tax-countdown', summary: '해외이주 특례는 “언젠가 팔면 비과세”가 아니다. 해외이주로 세대전원이 출국하고, 출국일 현재 국내 1주택을 보유하며, 그 주택을 출국일부터 2년 안에 양도해야 한다.',
    timeline: [{ mark: 'D−', event: '국내 1주택 보유', state: '출국일 현재 확인' },{ mark: 'D', event: '세대전원 해외이주 출국', state: '카운트 시작' },{ mark: 'D+1년 6개월', event: '주택 양도', state: '2년 이내' },{ mark: 'D+2년', event: '특례 양도기한', state: '마감' }],
    gates: ['해외이주법에 따른 해외이주','세대전원 출국','출국일 현재 국내 1주택','출국일부터 2년 이내 양도'],
    cases: [{ sale: '출국 후 1년 11개월 양도', result: '비과세 특례 가능' },{ sale: '출국 후 2년 1개월 양도', result: '이 특례 적용 불가' }],
    sources: [{ label: '소득세법 제89조', note: '1세대 1주택 양도소득 비과세', href: 'https://www.law.go.kr/법령/소득세법/제89조' },{ label: '소득세법 시행령 제154조', note: '해외이주·세대전원·출국일 현재 1주택·2년', href: 'https://www.law.go.kr/법령/소득세법시행령/제154조' },{ label: '국세청 양도소득세 안내', note: '1세대 1주택 비과세 공식 세무 안내', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2304&cntntsId=7705' }],
  },
  'farmland-acquisition-certificate': {
    kind: 'farmland-certificate-gate', summary: '주말·체험영농 농지는 개인별 1천㎡가 아니라 세대원 전원의 소유면적 합계가 1천㎡ 미만이어야 한다. 농지취득자격증명은 신청 유형에 따라 4·7·14일의 서로 다른 처리시계를 탄다.',
    area: { a: '600㎡', b: '500㎡', total: '1,100㎡', verdict: '1천㎡ 미만 아님 → 취득 불가' },
    clocks: [{ type: '계획서 면제', days: '4일', note: '법 제8조제2항 단서' },{ type: '일반 신청', days: '7일', note: '농업·주말체험 계획서 심사' },{ type: '농지위원회 심의', days: '14일', note: '투기우려지역 등 법정 대상' }],
    route: ['농지 소재지 시·구·읍·면에 신청','서류·현장·소유상한 확인','필요하면 농지위원회 심의','자격증명 발급','소유권등기 신청 때 첨부'],
    sources: [{ label: '농지법 제7조', note: '주말·체험영농 세대 합산 1천㎡ 미만', href: 'https://www.law.go.kr/법령/농지법/제7조' },{ label: '농지법 제8조', note: '발급기관·계획서·4·7·14일·등기 첨부', href: 'https://www.law.go.kr/법령/농지법/제8조' },{ label: '농지법 제44조', note: '농지위원회의 설치·심의', href: 'https://www.law.go.kr/법령/농지법/제44조' },{ label: '농림축산식품부 농지업무편람', note: '자격증명 신청·심사 실무', href: 'https://www.law.go.kr/행정규칙/농지취득자격증명발급심사요령' }],
  },
  'private-investment-project-types': {
    kind: 'pfi-ownership-timeline', summary: '네 방식은 모두 민간이 짓지만 소유권이 이동하는 시점과 민간의 수입원이 다르다. 이름의 동사 순서를 준공 시점의 소유권 타임라인으로 바꾸면 BTO·BTL·BOT·BOO가 한 번에 갈린다.',
    methods: [{ name: 'BTO', words: 'Build → Transfer → Operate', steps: ['민간 건설','준공 즉시 국가 귀속','민간에 관리운영권'] , revenue: '시설 이용자 사용료' },{ name: 'BTL', words: 'Build → Transfer → Lease', steps: ['민간 건설','준공 즉시 국가 귀속','국가 등이 임차·사용수익'], revenue: '정부 지급 임대료' },{ name: 'BOT', words: 'Build → Operate → Transfer', steps: ['민간 건설·소유','일정기간 민간 운영','기간 만료 후 국가 귀속'], revenue: '운영기간 사용료' },{ name: 'BOO', words: 'Build → Own → Operate', steps: ['민간 건설','민간 소유권 인정','민간 계속 운영'], revenue: '민간 소유·운영 수입' }],
    axis: 'BTO·BTL은 준공 즉시 국가 귀속, BOT는 운영기간 뒤 귀속, BOO는 법정 순서에 국가 귀속 단계가 없다.',
    sources: [{ label: '민간투자법 제4조', note: 'BTO·BTL·BOT·BOO의 법정 추진방식', href: 'https://www.law.go.kr/법령/사회기반시설에대한민간투자법/제4조' },{ label: '민간투자사업기본계획 제3조', note: '방식별 소유·운영 구조와 추가 방식', href: 'https://www.law.go.kr/행정규칙/민간투자사업기본계획/제3조' },{ label: 'KDI PIMAC 민간투자사업', note: '공공투자관리센터 공식 사업 안내', href: 'https://pimac.kdi.re.kr/' }],
  },
  'official-house-price-system': {
    kind: 'house-price-three-offices', summary: '주택가격 공시는 한 관청이 모두 처리하지 않는다. 표준주택과 공동주택은 국토교통부장관, 개별주택은 시장·군수·구청장이 맡고, 이의신청도 그 처분청을 따라간다.',
    offices: [{ price: '표준주택가격', actor: '국토교통부장관', method: '단독주택 중 표준주택 · 한국부동산원 조사·산정', appeal: '국토교통부장관 · 30일' },{ price: '개별주택가격', actor: '시장·군수·구청장', method: '표준주택가격 + 주택가격비준표 · 위원회 심의', appeal: '시장·군수·구청장 · 30일' },{ price: '공동주택가격', actor: '국토교통부장관', method: '공동주택 조사·산정 · 중앙위원회 심의', appeal: '국토교통부장관 · 30일' }],
    flow: ['공시기준일 현재 조사·산정','소유자 의견청취','가격공시위원회 심의','결정·공시','30일 이의신청'],
    trap: '표준주택은 단독주택에서 고른다. 공동주택가격의 이의신청을 시장·군수·구청장에게 보내지 않는다.',
    sources: [{ label: '부동산공시법 제16조', note: '표준주택 선정·한국부동산원 조사·산정·공시', href: 'https://www.law.go.kr/법령/부동산가격공시에관한법률/제16조' },{ label: '부동산공시법 제17조', note: '개별주택가격과 이의신청 준용', href: 'https://www.law.go.kr/법령/부동산가격공시에관한법률/제17조' },{ label: '부동산공시법 제18조', note: '공동주택가격 조사·산정·공시·이의', href: 'https://www.law.go.kr/법령/부동산가격공시에관한법률/제18조' },{ label: '한국부동산원 부동산공시가격', note: '공식 가격 열람·이의신청 서비스', href: 'https://www.realtyprice.kr/' }],
  },
  'real-estate-auction-basics': {
    kind: 'auction-bid-control-room', summary: '경매 입찰은 매각방법 선택, 보증 제공, 최고가 결정, 차순위 신고 순으로 움직인다. 보증률 10%는 법률 본문이 아니라 집행법원이 달리 정하지 않은 경우의 대법원규칙상 기본값이다.',
    methods: ['호가경매','기일입찰','기간입찰'],
    calc: { minimum: '2억원', rate: '10%', deposit: '2천만원' },
    route: ['경매개시결정·압류','현황조사·감정평가','매각물건명세서·최저가','매각기일 입찰','최고가·차순위 신고','매각허가·대금납부'],
    nextBid: '최고가 2억5천만원, 보증 2천만원이면 차순위 신고액은 2억3천만원을 “넘어야” 한다. 정확히 같은 금액은 부족하다.',
    sources: [{ label: '민사집행법 제103조', note: '호가경매·기일입찰·기간입찰', href: 'https://www.law.go.kr/법령/민사집행법/제103조' },{ label: '민사집행법 제113·114조', note: '매수신청 보증과 차순위매수신고', href: 'https://www.law.go.kr/법령/민사집행법/제113조' },{ label: '민사집행규칙 제63조', note: '최저매각가격 10분의 1 기본 보증액', href: 'https://www.law.go.kr/법령/민사집행규칙/제63조' },{ label: '대한민국 법원 법원경매정보', note: '공식 매각공고·물건명세서 확인', href: 'https://www.courtauction.go.kr/' }],
  },
  'maintenance-disposition-plan': {
    kind: 'disposition-plan-change-gate', summary: '관리처분계획은 분양신청 종료 뒤 권리의 배분표를 확정하는 단계다. 변경은 원칙적으로 변경인가지만 시행령이 정한 경미한 사항만 신고로 지나가며, 단순정정도 누군가 불이익을 받으면 신고문이 닫힌다.',
    changes: [{ change: '계산착오·오기·누락 단순정정', route: '신고', condition: '불이익 받는 자가 없을 때' },{ change: '사업시행자 변동에 따른 권리·의무 변경', route: '신고', condition: '분양설계 변경이 없을 때' },{ change: '매도청구 판결에 따른 변경', route: '신고', condition: '시행령상 경미한 변경' },{ change: '분양설계·권리배분의 본질적 변경', route: '변경인가', condition: '경미한 사항 밖' },{ change: '단순정정이지만 불이익 발생', route: '변경인가', condition: '신고 예외 불충족' }],
    rail: ['분양공고·통지','분양신청','관리처분계획 수립','총회 의결','인가·고시','철거·착공','준공·이전고시'],
    use: '인가·고시 뒤 종전 토지·건축물은 원칙적으로 사용·수익이 정지되지만, 사업시행자 동의를 받는 등 법정 예외는 별도로 확인한다.',
    sources: [{ label: '도시정비법 제72조', note: '분양공고·신청과 20일 범위 1회 연장', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제72조' },{ label: '도시정비법 제74조', note: '관리처분계획 수립·인가·경미한 변경 신고', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제74조' },{ label: '도시정비법 시행령 제61조', note: '신고 가능한 경미한 변경', href: 'https://www.law.go.kr/법령/도시및주거환경정비법시행령/제61조' },{ label: '도시정비법 제81조', note: '인가고시 후 사용·수익 정지와 예외', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제81조' }],
  },
  'building-area-calculation-method': {
    kind: 'building-area-layer-cake', summary: '건축면적·바닥면적·연면적·용적률용 연면적은 같은 케이크가 아니다. 먼저 어느 층과 시설을 어느 면적에 넣는지 레이어를 고른 뒤, 마지막에 대지면적으로 나눈다.',
    layers: [{ layer: '건축면적', formula: '외벽 중심선의 수평투영면적', rules: ['지하주차장 경사로 제외 요건','대지 위 덮는 면적'] },{ layer: '바닥면적', formula: '각 층 벽·기둥 중심선 안 수평투영면적', rules: ['구획 없으면 지붕 끝에서 1m 후퇴','승강기탑·법정 조경시설 등 제외'] },{ layer: '연면적', formula: '각 층 바닥면적의 합계', rules: ['지하층도 일반 연면적에는 포함','층별 바닥면적 누적'] },{ layer: '용적률용 연면적', formula: '연면적 − 법정 제외면적', rules: ['지하층 면적 제외','지상 부속용도 주차장 제외'] }],
    floor: [{ case: '부분별 층수가 다름', rule: '가장 많은 층수' },{ case: '층 구분이 명확하지 않음', rule: '높이 4m마다 1개 층' },{ case: '1층 전체 필로티 높이', rule: '높이 제한 산정에 원칙적 포함' }],
    worked: '대지 1,500㎡ · 지상 11층×1,000㎡ · 지상 부속주차 500㎡ → (11,000−500)÷1,500×100 = 용적률 700%',
    sources: [{ label: '건축법 시행령 제119조', note: '대지·건축·바닥·연면적·높이·층수 산정', href: 'https://www.law.go.kr/법령/건축법시행령/제119조' },{ label: '국토계획법 제78조', note: '용적률의 법률상 기준', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제78조' },{ label: '국토교통부 건축행정시스템 세움터', note: '공식 건축행정·법령정보', href: 'https://www.eais.go.kr/' }],
  },
  'speculation-overheated-district': {
    kind: 'regulated-area-twin-radar', summary: '두 규제지역은 지정권자가 다르다. 투기과열지구는 국토교통부장관 또는 시·도지사가 각 주거정책심의위원회를 거치지만, 조정대상지역은 국토교통부장관만 중앙 주거정책심의위원회를 거쳐 지정한다.',
    areas: [{ name: '투기과열지구', actor: '국토부장관 또는 시·도지사', tests: ['주택가격상승률이 물가상승률보다 현저히 높음','청약·가격·보급률·공급계획 등으로 투기 성행 우려','시·도지사는 시·도 주거정책심의위원회'], review: '반기마다 유지 여부 재검토' },{ name: '조정대상지역', actor: '국토교통부장관', tests: ['과열·과열우려 또는 거래 위축·위축우려','대통령령상 정량기준 충족','중앙 주거정책심의위원회'], review: '반기마다 유지 여부 재검토' }],
    numbers: [{ signal: '청약경쟁률', value: '2개월 모두 5:1 초과' },{ signal: '국민주택규모 청약', value: '2개월 모두 10:1 초과' },{ signal: '분양계획 감소', value: '직전월 대비 30% 이상' }],
    memory: '고정 3년 지정이 아니다. 지정 목적 달성에 필요한 최소 범위로 지정하고, 사유가 없어지면 심의를 거쳐 해제한다.',
    sources: [{ label: '주택법 제63조', note: '투기과열지구 지정권자·기준·반기 재검토', href: 'https://www.law.go.kr/법령/주택법/제63조' },{ label: '주택법 시행규칙 제25조', note: '2개월 5:1·10:1·분양계획 30%', href: 'https://www.law.go.kr/법령/주택법시행규칙/제25조' },{ label: '주택법 제63조의2', note: '조정대상지역 지정·해제·반기 재검토', href: 'https://www.law.go.kr/법령/주택법/제63조의2' },{ label: '국토교통부 정책자료', note: '규제지역 지정·해제 공식 발표', href: 'https://www.molit.go.kr/' }],
  },
  'sales-comparison-standard-price-method': {
    kind: 'standard-price-adjustment-lab', summary: '비교표준지 공시지가를 출발점으로 시간·지역·필지 차이를 빠짐없이 보정한다. 곱셈 순서 자체보다 올바른 표준지 선정, 비교 방향, 요인 누락 여부가 핵심이다.',
    selection: ['인근지역 우선','용도지역 같거나 비슷함','이용상황·주변환경 유사','없으면 같은 수급권 유사지역'],
    factors: [{ name: '표준지 공시지가', value: '200만원' },{ name: '시점수정', value: '× 1.05' },{ name: '지역요인', value: '× 0.98' },{ name: '개별요인', value: '× 1.10' },{ name: '그 밖의 요인', value: '× 1.00' }],
    result: '㎡당 약 226.38만원', check: '대상 토지가 더 우세한 비교항목이라면 그 비교치는 원칙적으로 1보다 커야 한다.',
    sources: [{ label: '감정평가에 관한 규칙 제14조', note: '토지 공시지가기준법·비교표준지와 보정', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제14조' },{ label: '감정평가법 제3조', note: '토지 감정평가의 기준', href: 'https://www.law.go.kr/법령/감정평가및감정평가사에관한법률/제3조' }],
  },
  'maintenance-project-implementation-general': {
    kind: 'maintenance-implementer-handoff', summary: '정비사업은 시행자 지위의 인계와 사업시행계획인가의 의제효과를 분리해 본다. 조합·감사·공공시행자의 역할과 의제 목록은 서로 섞지 않는다.',
    handoff: ['조합설립인가','공공시행자 지정·고시','고시일에 기존 조합설립인가 취소 간주'],
    roles: [{ actor: '조합', rule: '명칭에 정비사업조합' },{ actor: '감사', rule: '조합장이 자신을 위해 조합과 소송할 때 대표' },{ actor: '오피스텔', rule: '준주거·상업지역, 전체 연면적 30% 이하' }],
    permits: [{ name: '농지전용허가', result: '의제 목록' },{ name: '개인하수처리시설 설치신고', result: '의제 목록' },{ name: '대규모점포등 등록', result: '의제 목록' },{ name: '사도개설허가', result: '목록에 없음' }],
    sources: [{ label: '도시정비법 제25~27조', note: '사업시행자와 공공시행자 지정', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제25조' },{ label: '도시정비법 제41조', note: '조합 명칭과 대표', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제41조' },{ label: '도시정비법 제57조', note: '사업시행계획인가의 인허가 의제', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제57조' }],
  },
  'building-preliminary-determination': {
    kind: 'predecision-permit-bundle', summary: '사전결정은 건축허가 전 입지·규모를 먼저 확인하는 절차다. 현행법은 하천점용허가도 의제하므로 제외 항목으로 외우면 틀린다.',
    bundle: [{ permit: '개발행위허가', state: '의제' },{ permit: '도시지역 보전산지 전용·일시사용', state: '의제' },{ permit: '농지전용 허가·신고·협의', state: '의제' },{ permit: '하천점용허가', state: '의제' }],
    clocks: [{ mark: '협의 요청', value: '15일', note: '관계기관 의견, 무응답이면 협의 간주' },{ mark: '사전결정 통지', value: '2년', note: '건축허가 신청 기한' }],
    sources: [{ label: '건축법 제10조', note: '사전결정·인허가 의제·15일·2년', href: 'https://www.law.go.kr/법령/건축법/제10조' }],
  },
  'housing-remodeling': {
    kind: 'remodeling-expansion-dashboard', summary: '리모델링 숫자는 면적 30·40, 세대수 15, 동의율 75·50으로 나눠 기억한다. 같은 퍼센트라도 적용 대상이 전혀 다르다.',
    gauges: [{ label: '전용면적 원칙', value: 30, suffix: '%' },{ label: '85㎡ 미만 세대', value: 40, suffix: '%' },{ label: '세대수 증가', value: 15, suffix: '%' }],
    votes: [{ scope: '단지 전체', main: '전체 75%', sub: '각 동 50%' },{ scope: '한 동만', main: '해당 동 75%', sub: '구분소유자·의결권 각각' }],
    route: ['사용검사 후 15년 이상','조합 결의·동의','증축형 안전진단','허가·행위'],
    sources: [{ label: '주택법 제2조', note: '리모델링 정의·30·40·15%', href: 'https://www.law.go.kr/법령/주택법/제2조' },{ label: '주택법 시행령 제75조·별표4', note: '허가기준과 75·50% 동의율', href: 'https://www.law.go.kr/법령/주택법시행령/제75조' }],
  },
  'special-type-housing': {
    kind: 'special-housing-three-models', summary: '세 유형은 공간, 규모, 소유권이라는 서로 다른 축으로 구별한다. 세대구분형은 나뉘어도 1세대, 도시형은 300세대 미만, 토지임대부는 토지와 건물의 소유자가 갈라진다.',
    models: [{ name: '세대구분형', visual: '공간 A │ 공간 B', rules: ['각각 욕실·부엌·현관','세대수는 1세대'] },{ name: '도시형생활주택', visual: '< 300세대', rules: ['국민주택규모','도시지역에 건설'] },{ name: '토지임대부', visual: '토지 ≠ 건물', rules: ['토지: 사업시행자','건물·복리시설: 분양자'] }],
    lease: { term: '40년 이내', renewal: '소유자 75% 이상 청구 → 40년 이내 갱신' },
    sources: [{ label: '주택법 제2조', note: '도시형생활주택 300세대 미만', href: 'https://www.law.go.kr/법령/주택법/제2조' },{ label: '주택법 시행령 제9·10조', note: '세대구분형·도시형생활주택 요건', href: 'https://www.law.go.kr/법령/주택법시행령/제9조' },{ label: '주택법 제78조', note: '토지임대기간과 75% 갱신청구', href: 'https://www.law.go.kr/법령/주택법/제78조' }],
  },
  'agency-contract-form-items': {
    kind: 'agency-form-overlay', summary: '일반·전속 서식을 겹쳐 보면 공통 바탕 위에 전속계약만의 통지·공개·위약금 조항이 추가된다. 숫자는 3개월·2주·7일로 나눠 고정한다.',
    common: ['성실한 중개 노력','확인·설명 협조','유효기간 3개월 원칙','중개보수·대상물 표시'],
    exclusive: [{ duty: '처리상황 문서 통지', clock: '2주일에 1회 이상' },{ duty: '거래정보망·일간신문 공개', clock: '계약 후 7일 이내' },{ duty: '공개내용 문서 통지', clock: '공개 후 지체 없이' }],
    penalties: [{ case: '다른 중개사 또는 소개 상대방과 직거래', cost: '중개보수 상당 위약금' },{ case: '스스로 찾은 상대방과 거래', cost: '중개보수 50% 범위 실제비용' }],
    sources: [{ label: '공인중개사법 제22·23조', note: '일반·전속중개계약', href: 'https://www.law.go.kr/법령/공인중개사법/제22조' },{ label: '시행규칙 별지 제14호서식', note: '일반중개계약서 공식 서식', href: 'https://www.law.go.kr/flDownload.do?flSeq=141860929' },{ label: '시행규칙 별지 제15호서식', note: '전속중개계약서 공식 서식', href: 'https://www.law.go.kr/flDownload.do?flSeq=42838541' }],
  },
  'possessor-recoverer-relation': {
    kind: 'possessor-recoverer-ledger', summary: '선의 점유자는 과실을 취득하는 대신 통상의 필요비를 청구하지 못한다. 악의 점유자는 그 반대다 — 두 권리를 같은 사람이 동시에 다 갖는 조합은 없다.',
    rows: [
      { type: '선의 점유자', fruit: '과실 취득 O (제201조 제1항)', necessary: '통상 필요비 청구 X', useful: '유익비 청구 O' },
      { type: '악의 점유자', fruit: '과실 취득 X · 반환·대가보상 의무', necessary: '통상 필요비 청구 O', useful: '유익비 청구 O (법원이 상환기간 허여 가능)' },
    ],
    note: '유익비는 선의·악의를 불문하고 가액의 증가가 현존하는 경우에 한해, 회복자의 선택에 좇아 지출금액이나 증가액의 상환을 청구할 수 있다.',
    sources: [
      { label: '민법 제201조', note: '선의 점유자의 과실취득권', href: 'https://www.law.go.kr/법령/민법/제201조' },
      { label: '민법 제203조', note: '점유자의 상환청구권과 필요비 단서', href: 'https://www.law.go.kr/법령/민법/제203조' },
    ],
  },
  'lien': {
    kind: 'lien-connexity-filter', summary: '유치권은 채권과 목적물 사이의 견련관계를 통과해야 성립한다. 계약에서 생긴 채권이라도 목적물 자체에서 발생한 것이 아니면 걸러진다.',
    gates: [
      { q: '채권이 목적물 자체로부터 발생했는가?', pass: '예 → 견련관계 인정', fail: '아니오 → 유치권 불성립' },
      { q: '그 목적물이 타인 소유인가?', pass: '예 → 유치권 성립 가능', fail: '아니오(자기 소유) → 유치권 불성립' },
    ],
    examples: [
      { claim: '건물 수리비 채권', pass: true, note: '목적물(건물) 자체에서 발생 → 유치권 O' },
      { claim: '임차보증금반환청구권', pass: false, note: '임대차 계약에서 발생, 건물 자체와는 무관 → 유치권 X' },
    ],
    aside: '유치권자는 원칙적으로 우선변제권이 없다 — 다만 경매를 신청할 권리는 별도로 인정된다.',
    sources: [
      { label: '민법 제320조', note: '유치권의 내용과 견련관계', href: 'https://www.law.go.kr/법령/민법/제320조' },
      { label: '민법 제322조', note: '유치권자의 경매권', href: 'https://www.law.go.kr/법령/민법/제322조' },
    ],
  },
  'capital-gains-tax-rate': {
    kind: 'holding-period-rate-track', summary: '보유기간이 짧을수록 세율은 무거워지고, 일정 기간을 넘기면 다시 기본세율(누진세율) 체계로 돌아온다. 다주택자 중과는 이 축과는 별개다.',
    track: [
      { stage: '1년 미만 보유', rate: '상대적으로 높은 단일세율', tag: '단기 보유' },
      { stage: '1년 이상 보유', rate: '기본세율(누진세율) 적용', tag: '예: 1년 6개월 보유 1주택' },
    ],
    sideNote: { label: '다주택자 중과세율', text: '보유기간과는 별개로, 주택 수 기준에 따라 추가로 적용될 수 있다.' },
    caution: '‘100분의 40’ 같은 단기 중과세율을 1년 6개월 보유 1주택에 적용하는 것은 오답이다 — 이 구간은 기본세율이 적용된다.',
    sources: [
      { label: '소득세법 제104조', note: '보유기간별 양도소득세 세율', href: 'https://www.law.go.kr/법령/소득세법/제104조' },
    ],
  },
  'efficient-market-hypothesis': {
    kind: 'market-efficiency-radius', summary: '세 단계 효율적 시장은 “어디까지의 정보가 이미 가격에 반영되어 있는가”로 구분된다. 약성 → 준강성 → 강성 순으로 반영 범위가 넓어진다.',
    rings: [
      { level: '약성 효율적 시장', scope: '과거 정보', width: 34 },
      { level: '준강성 효율적 시장', scope: '과거 정보 + 공표된 정보', width: 67 },
      { level: '강성 효율적 시장', scope: '과거 + 공표 + 비공표 정보 전부', width: 100 },
    ],
    traits: ['개별성(이질성)으로 인해 다른 부동산으로 대체되기 어렵다', '공매(short selling)는 주식시장과 달리 거의 불가능하다'],
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산경제론 · 효율적 시장이론', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'leverage-effect': {
    kind: 'leverage-amplifier', summary: '레버리지는 자기자본수익률을 총자본수익률 기준으로 증폭시키는 배율장치다. 수익만 키우는 게 아니라 위험(변동성)도 함께 키운다.',
    states: [
      { type: '정(+)의 레버리지', condition: '총자본수익률 > 저당수익률(이자율)', effect: '자기자본수익률이 총자본수익률보다 커진다' },
      { type: '중립적 레버리지', condition: '총자본수익률 = 저당수익률', effect: '자기자본수익률이 총자본수익률과 같다' },
      { type: '부(-)의 레버리지', condition: '총자본수익률 < 저당수익률', effect: '자기자본수익률이 총자본수익률보다 작아진다' },
    ],
    ratioClarify: { ratio: '부채비율 50%', meaning: '자기자본 : 부채 = 2 : 1 (부채가 자기자본의 절반)' },
    caution: '레버리지는 위험(변동성)을 항상 증가시킨다 — “위험이 감소한다”는 서술은 틀렸다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산투자론 · 지렛대효과', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'prohibited-conduct-scope-and-penalty': {
    kind: 'prohibition-scope-penalty-grid', summary: '같은 “금지행위”라도 누구에게 적용되는지, 얼마나 무겁게 처벌되는지는 서로 다른 조문이다. 두 축을 각각 확인해야 헷갈리지 않는다.',
    columns: [
      { title: '개업공인중개사등 · 중한 벌칙', tag: '3년 이하 징역 또는 3천만원 이하 벌금', items: ['분양 관련 증서 매매의 중개', '중개의뢰인과의 직접거래', '거래당사자 쌍방대리', '단체 구성 후 특정 중개대상물 중개 제한'] },
      { title: '개업공인중개사등 · 그보다 가벼운 벌칙', tag: '경한 벌칙', items: ['법정 중개보수를 초과해 수수'] },
      { title: '누구든지 (별도 규정)', tag: '개업공인중개사등이 아님', items: ['시세교란 목적의 유도행위', '정당한 표시·광고를 방해하는 행위'] },
    ],
    extra: '소속공인중개사에게 특유한 금지행위: “공인중개사” 명칭을 단독으로 사용하는 행위.',
    caution: '법정 중개보수를 초과 수수하는 행위도 3년 이하 징역의 중한 벌칙 대상이라고 착각하기 쉽다 — 실제로는 그보다 가벼운 벌칙이 적용된다.',
    sources: [
      { label: '공인중개사법 제33조', note: '금지행위의 범위', href: 'https://www.law.go.kr/법령/공인중개사법/제33조' },
      { label: '공인중개사법 제48·49조', note: '벌칙 조항과 처벌 수준', href: 'https://www.law.go.kr/법령/공인중개사법/제48조' },
    ],
  },
  'housing-lease-protection-act': {
    kind: 'lease-protection-scope-gate', summary: '적용범위는 등기 여부가 아니라 일시사용인지로 가른다. 대항력과 우선변제권은 요건이 겹치지 않는 별개의 사다리다.',
    gate: [
      { case: '미등기 주택', result: '적용 O', note: '등기 여부와 무관 — 인도 + 주민등록만 갖추면 대항력(제3조)' },
      { case: '일시사용이 명백한 임대차', result: '적용 X', note: '제11조' },
    ],
    ladder: [
      { right: '대항력', need: ['주택의 인도', '주민등록(전입신고)'] },
      { right: '우선변제권', need: ['대항요건', '확정일자'] },
    ],
    caution: '확정일자가 없으면 대항력은 인정되어도 경매 시 후순위 권리자보다 먼저 배당받을 수 없다(우선변제권 없음).',
    sources: [
      { label: '주택임대차보호법 제3조', note: '대항력의 요건과 효력발생시점', href: 'https://www.law.go.kr/법령/주택임대차보호법/제3조' },
      { label: '주택임대차보호법 제11조', note: '일시사용 임대차 적용배제', href: 'https://www.law.go.kr/법령/주택임대차보호법/제11조' },
    ],
  },
  'commercial-lease-protection-act': {
    kind: 'commercial-lease-priority-ladder', summary: '상가임대차도 대항력과 우선변제권의 사다리 구조는 주택과 대칭이다 — "주민등록" 자리에 "사업자등록"이 들어간다.',
    ladder: [
      { right: '대항력', need: ['건물의 인도', '사업자등록'] },
      { right: '우선변제권', need: ['대항요건', '확정일자'] },
    ],
    exclude: { rule: '사업자등록의 대상이 되지 않는 건물에는 이 법이 적용되지 않는다', example: '비영리 종교시설 등 사업자등록 대상이 아닌 건물' },
    overCap: { rule: '환산보증금이 지역별 기준금액을 초과하는 임대차', keep: ['대항력(제3조)', '계약갱신요구권(제10조)', '권리금 회수기회 보호'], lose: ['확정일자 우선변제권(제5조)', '소액임차인 최우선변제권(제14조)'] },
    twin: '주택임대차보호법의 "주민등록" 자리에 "사업자등록"이 들어가는 대칭 구조로 이해하면 암기가 쉽다.',
    caution: '확정일자를 대항력의 요건으로 착각하기 쉽다 — 확정일자는 우선변제권만의 요건이다. 환산보증금을 초과해도 대항력·계약갱신요구권은 유지되지만 우선변제권·최우선변제권은 적용되지 않는다.',
    sources: [
      { label: '상가건물 임대차보호법 제2조', note: '적용범위·환산보증금 초과 시 적용 조문', href: 'https://www.law.go.kr/법령/상가건물임대차보호법/제2조' },
      { label: '상가건물 임대차보호법 제3조', note: '대항력의 요건', href: 'https://www.law.go.kr/법령/상가건물임대차보호법/제3조' },
      { label: '상가건물 임대차보호법 제5조', note: '우선변제권과 환산보증금 한도', href: 'https://www.law.go.kr/법령/상가건물임대차보호법/제5조' },
    ],
  },
  'comprehensive-real-estate-tax-basics': {
    kind: 'comprehensive-tax-threshold-dial', summary: '과세기준금액은 대상자 유형에 따라 다이얼처럼 달라진다. 일반은 9억원, 1세대 1주택자는 12억원으로 더 높다.',
    thresholds: [
      { who: '일반(2주택 이상 등)', amount: '9억원' },
      { who: '1세대 1주택자', amount: '12억원 (별도 상향 기준)' },
    ],
    method: { default: '관할 세무서장이 부과·징수', option: '납세의무자가 선택하면 신고납부도 가능' },
    caution: '과세기준금액을 5억원으로 착각하기 쉽다 — 일반 기준은 9억원, 1세대 1주택자는 12억원이다.',
    sources: [
      { label: '종합부동산세법 제7조', note: '주택에 대한 과세 및 납세의무자', href: 'https://www.law.go.kr/법령/종합부동산세법/제7조' },
      { label: '종합부동산세법 제8조', note: '과세표준과 공제금액', href: 'https://www.law.go.kr/법령/종합부동산세법/제8조' },
      { label: '종합부동산세법 제16조', note: '부과·징수와 신고납부 선택', href: 'https://www.law.go.kr/법령/종합부동산세법/제16조' },
    ],
  },
  'rental-income-exclusion': {
    kind: 'rental-income-exclusion-filter', summary: '지상권 대여소득이 통째로 빠지는 게 아니다 — "공익사업과 관련되어 있는가"를 통과해야 기타소득으로 예외 처리된다.',
    filter: [
      { q: '지역권·지상권의 설정·대여가 공익사업과 관련되어 있는가?', yes: '기타소득 (부동산임대업 소득에서 제외)', no: '부동산임대소득에 포함' },
    ],
    overseas: { rule: '국외 소재 주택의 임대소득은 주택 수와 무관하게 과세', note: '국내 1주택 비과세 특례가 적용되지 않는다' },
    caution: '지상권 대여소득은 예외 없이 전부 부동산임대업에서 제외된다고 착각하기 쉽다 — 공익사업과 관련된 경우에만 제외된다.',
    sources: [
      { label: '소득세법 제19조 제1항 제12호', note: '부동산업 소득과 공익사업 관련 제외', href: 'https://www.law.go.kr/법령/소득세법/제19조' },
      { label: '소득세법 제21조 제1항 제9호', note: '공익사업 관련 지역권·지상권의 기타소득', href: 'https://www.law.go.kr/법령/소득세법/제21조' },
    ],
  },
  'use-zone-district': {
    kind: 'use-zone-four-tier-map', summary: '용도지역은 4단 지도다. 세부 명칭만 보고 도시지역인지 관리지역 계열인지 즉시 판별해야 한다.',
    tiers: [
      { tier: '도시지역', subs: ['주거지역', '상업지역', '공업지역', '녹지지역(자연·생산·보전)'] },
      { tier: '관리지역', subs: ['보전관리지역', '생산관리지역', '계획관리지역'] },
      { tier: '농림지역', subs: [] },
      { tier: '자연환경보전지역', subs: [] },
    ],
    check: [
      { name: '계획관리지역', tier: '관리지역', isUrban: false },
      { name: '자연녹지지역', tier: '도시지역', isUrban: true },
      { name: '근린상업지역', tier: '도시지역', isUrban: true },
      { name: '전용공업지역', tier: '도시지역', isUrban: true },
      { name: '생산녹지지역', tier: '도시지역', isUrban: true },
    ],
    caution: '계획관리지역은 이름에 "계획"이 들어가 도시지역처럼 보이지만, 관리지역의 하위 분류이며 도시지역이 아니다.',
    sources: [
      { label: '국토계획법 제6조', note: '국토의 용도 구분 4단 분류', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제6조' },
      { label: '국토계획법 제36조', note: '용도지역의 지정과 세분', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제36조' },
    ],
  },
  'district-unit-plan': {
    kind: 'district-unit-plan-rule-board', amended: true, summary: '지구단위계획은 결정권자·지정대상·의무지정 사유·완화특례를 각각 다른 조문에서 따로 확인해야 하는 종합문제다.',
    decide: '도시·군관리계획으로 결정한다 (도시·군기본계획이 아님)',
    zones: ['관광특구·관광단지의 전부 또는 일부', '「도시개발법」상 도시개발구역의 전부 또는 일부'],
    mandatory: { trigger: '택지개발지구 등 사업 종료 후 10년 경과 + 토지이용·건축계획 미수립', rule: '지구단위계획구역으로 의무 지정' },
    relax: { item: '차량진입금지구간 지정 시 주차장 설치기준', value: '최대 100%까지 완화 (80%가 아님)' },
    trap: '"세 개 이상의 노선이 교차하는 대중교통 결절지로부터 1km 이내"는 지구단위계획구역으로 지정할 수 있는 대상일 뿐 의무 지정 사유가 아니다 — "두 개 노선·2km"로 숫자를 바꿔 쓴 지문은 틀린 지문이다.',
    sources: [
      { label: '국토계획법 제51조', note: '지구단위계획구역의 지정 대상과 의무 지정 사유', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제51조' },
      { label: '국토계획법 시행령 제43조', note: '지구단위계획구역 지정 요건 세부', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제43조' },
    ],
  },
  'mistake-fraud-duress': {
    kind: 'misrepresentation-classifier', summary: '서류상 표시가 잘못됐을 뿐 진의가 일치했다면 애초에 착오가 아니다(오표시무해). 착오·사기·강박은 무효가 아니라 취소사유라는 점도 통정허위표시와 다르다.',
    compare: [
      { case: '구두로는 X토지, 서류에는 실수로 Y토지', result: 'X토지로 유효 성립', tag: '오표시무해 — 착오 문제 아님' },
      { case: '실제로 착각·기망·강박에 의해 의사표시', result: '취소할 수 있는 법률행위', tag: '민법 제109·110조' },
    ],
    effectCompare: [
      { type: '착오·사기·강박', effect: '취소 가능 (유효 → 취소로 소급 무효)' },
      { type: '통정허위표시', effect: '처음부터 무효' },
    ],
    caution: '오표시무해 사안을 착오취소의 문제로 접근하기 쉽다 — 당사자의 진의가 합치했다면 애초에 취소할 착오 자체가 없다.',
    sources: [
      { label: '민법 제109조', note: '착오로 인한 의사표시의 취소', href: 'https://www.law.go.kr/법령/민법/제109조' },
      { label: '민법 제110조', note: '사기·강박에 의한 의사표시의 취소', href: 'https://www.law.go.kr/법령/민법/제110조' },
    ],
  },
  'numerus-clausus': {
    kind: 'real-right-source-gate', summary: '물권을 만들어낼 수 있는 통로는 두 개뿐이다 — 국회가 만든 형식적 의미의 법률과 관습법. 명령·규칙이나 당사자 합의로는 새 물권을 만들 수 없다.',
    gates: [
      { name: '형식적 의미의 법률 (국회 제정)', valid: true },
      { name: '관습법', valid: true },
      { name: '명령·규칙 (행정입법)', valid: false },
      { name: '당사자 간 계약·합의', valid: false },
    ],
    customExamples: ['분묘기지권', '관습법상 법정지상권'],
    caution: '행정입법(명령·규칙)으로도 새로운 물권을 만들 수 있다고 착각하기 쉽다 — 반드시 형식적 의미의 "법률" 또는 관습법이어야 한다.',
    sources: [
      { label: '민법 제185조', note: '물권법정주의', href: 'https://www.law.go.kr/법령/민법/제185조' },
    ],
  },
  'title-trust': {
    kind: 'title-trust-auction-shield', summary: '같은 계약명의신탁이라도 일반 매매인지 경매인지에 따라 매도인의 선의·악의가 결과를 좌우하는지가 갈린다.',
    types: [
      { name: '계약명의신탁', desc: '신탁자가 자금을 대고 수탁자 명의로 매도인과 직접 계약·등기' },
      { name: '3자간 등기명의신탁', desc: '신탁자가 매도인과 직접 계약하되 등기만 수탁자 명의로' },
    ],
    auctionRule: {
      normal: '일반 매매의 계약명의신탁: 매도인이 선의면 유효, 악의면 무효',
      auction: '경매의 계약명의신탁: 소유자(채무자)가 명의신탁 사실을 알았더라도 낙찰자(수탁자)는 유효하게 소유권을 취득',
    },
    caution: '"경매에서도 원소유자가 알았다면 수탁자가 취득하지 못한다"는 서술은 틀렸다 — 경매는 공적 절차의 안정성 때문에 선의·악의를 묻지 않는다.',
    sources: [
      { label: '부동산실명법 제4조', note: '명의신탁약정의 효력과 경매의 특례', href: 'https://www.law.go.kr/법령/부동산실권리자명의등기에관한법률/제4조' },
      { label: '대법원 2012다69197', note: '경매 계약명의신탁과 소유자의 선의·악의 불문', href: 'https://casenote.kr/대법원/2012다69197' },
    ],
  },
  'comprehensive-real-estate-tax-housing': {
    kind: 'joint-ownership-tax-election', summary: '부부 공동명의 1주택은 자동으로 혜택을 받지 못한다 — 매년 9월 신청이라는 관문을 통과해야 1세대 1주택자 방식으로 전환된다.',
    route: ['세대원 중 1인 + 배우자만 공동으로 1주택 소유', '혼인관계증명서 첨부, 9월 16일~9월 30일 신청', '1인을 공동명의 1주택자로 지정 → 1세대 1주택자 방식 과세'],
    noApply: '신청하지 않으면 원칙대로 지분별 각자 과세된다.',
    caution: '신청 없이도 자동으로 1주택자 특례가 적용된다고 착각하기 쉽다 — 반드시 매년 정해진 기간에 "신청"해야 한다.',
    sources: [
      { label: '종합부동산세법 제10조의2', note: '공동명의 1주택자에 대한 과세특례', href: 'https://www.law.go.kr/법령/종합부동산세법/제10조의2' },
    ],
  },
  'capital-gains-tax-scope': {
    kind: 'transfer-exclusion-filter', summary: '양도소득세는 "유상 이전"에만 붙는다. 대가 없이 넘어가거나 경제적 이전이 없는 경우는 애초에 과세대상인 "양도" 자체가 아니다.',
    excluded: [
      { case: '무상이전 (증여·상속 등)', reason: '유상이전이 아님' },
      { case: '환지처분에 따른 지목변경', reason: '실질적 경제적 이전이 없음' },
    ],
    included: '전세권·영업권도 양도소득세 과세대상 자산에 포함된다.',
    caution: '환지처분에 따른 지목변경을 양도로 착각해 과세대상으로 보는 실수를 하기 쉽다.',
    sources: [
      { label: '소득세법 제88조', note: '양도의 정의와 과세대상 자산', href: 'https://www.law.go.kr/법령/소득세법/제88조' },
    ],
  },
  'urban-innovation-zone-special-matters': {
    kind: 'urban-innovation-override-list', amended: true, summary: '2024년 개정으로 신설된 도시혁신구역은 도시계획적 기준 몇 가지만 특례로 따로 정할 수 있다 — 다른 법률의 인허가 절차 전체를 무시하는 것은 아니다.',
    overrides: ['도시공원·녹지 확보기준', '건축물에 대한 미술작품 설치', '부설주차장 설치', '학교용지의 조성·개발 기준'],
    notOverride: '「체육시설의 설치·이용에 관한 법률」상 사업계획의 승인은 도시혁신계획으로 따로 정할 수 있는 사항이 아니다.',
    caution: '도시혁신구역의 특례가 사실상 모든 인허가 절차에 적용된다고 확대 해석하기 쉽다 — 특례 목록에 없는 절차는 그대로 적용된다.',
    sources: [
      { label: '국토계획법 제40조의3', note: '도시혁신구역의 지정 (2024. 8. 7. 시행)', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제40조의3' },
      { label: '국토계획법 제83조의3', note: '도시혁신구역에서의 다른 법률 적용 특례', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제83조의3' },
    ],
  },
  'superficies': {
    kind: 'superficies-independence-badge', summary: '지상권은 채권인 임대차와 달리 독립된 물권이다. 건물이 아직 없어도 성립할 수 있고, 토지소유자의 동의 없이도 자유롭게 처분할 수 있다.',
    facts: [
      { q: '설정 당시 건물·공작물이 없어도 성립하는가?', a: '가능 — 장래 소유 목적이면 유효하게 성립(판례)' },
      { q: '지상권 양도에 토지소유자의 동의가 필요한가?', a: '불필요 — 독립된 물권이므로 자유롭게 양도·담보제공' },
      { q: '지상권자가 부속시킨 물건은 누구 소유인가?', a: '지상권자 소유 — 토지에 부합하지 않음(제256조 단서)' },
    ],
    caution: '"지상권 양도에는 토지소유자의 동의가 필요하다"는 서술은 틀렸다 — 지상권은 독립된 물권이므로 동의가 필요 없다.',
    sources: [
      { label: '민법 제279조', note: '지상권의 내용', href: 'https://www.law.go.kr/법령/민법/제279조' },
      { label: '민법 제282조', note: '지상권의 양도·임대', href: 'https://www.law.go.kr/법령/민법/제282조' },
    ],
  },
  'easement': {
    kind: 'easement-accessory-chain', summary: '지역권은 사람이 아니라 토지에 딸린 권리다. 요역지 소유권이 넘어가면 별도 절차 없이 지역권도 자동으로 함께 넘어간다.',
    chain: ['요역지 소유권 이전', '별도 등기·의사표시 불요', '지역권도 자동으로 함께 이전'],
    extra: '지상권자도 자신의 지상권 행사에 필요한 범위 내에서 인접 토지에 통행지역권을 시효취득할 수 있다.',
    caution: '지상권자는 지역권을 시효취득할 수 없다고 오해하기 쉽다 — 판례는 자신의 지상권 행사에 필요한 범위에서는 가능하다고 본다.',
    sources: [
      { label: '민법 제292조', note: '지역권의 부종성', href: 'https://www.law.go.kr/법령/민법/제292조' },
    ],
  },
  'chonsegwon': {
    kind: 'chonsegwon-dual-nature', summary: '전세권은 한 몸에 두 성격을 가진다 — 부동산을 쓰는 용익물권이면서 동시에 전세금을 담보하는 담보물권이다.',
    natures: [
      { type: '용익물권적 성격', desc: '부동산을 사용·수익할 권리' },
      { type: '담보물권적 성격', desc: '전세금에 대한 우선변제권' },
    ],
    facts: [
      { q: '전세금은 반드시 현실적으로 수수돼야 하는가?', a: '아니다 — 기존 채권으로 갈음할 수 있다(판례)' },
      { q: '전세권 소멸 시 무엇과 무엇이 동시이행 관계인가?', a: '전세금 반환 ↔ 목적물 인도·전세권설정등기 말소' },
    ],
    caution: '"전세금은 반드시 현실적으로 수수되어야 하고 기존 채권으로 갈음할 수 없다"는 서술은 틀렸다.',
    sources: [
      { label: '민법 제303조', note: '전세권의 내용', href: 'https://www.law.go.kr/법령/민법/제303조' },
    ],
  },
  'land-transaction-permit-act': {
    kind: 'floating-invalidity-timeline', summary: '토지거래허가구역 내 계약은 확정적 무효가 아니라 허가 여부가 정해지기 전까지 붕 떠 있는 유동적 무효 상태다.',
    timeline: [
      { stage: '허가 전', state: '유동적 무효' },
      { stage: '허가 취득', state: '계약체결 시로 소급하여 유효' },
      { stage: '불허가 확정', state: '확정적 무효' },
    ],
    extra: '매수인이 지급한 계약금은 해약금으로 추정된다(민법 제565조 제1항).',
    caution: '유동적 무효를 통정허위표시·반사회질서 법률행위 같은 확정적 무효로 착각하기 쉽다 — 허가 여부에 따라 유효·무효가 갈리는 잠정적 상태다.',
    sources: [
      { label: '민법 제565조', note: '해약금 추정', href: 'https://www.law.go.kr/법령/민법/제565조' },
    ],
  },
  'unauthorized-agency': {
    kind: 'ratification-demand-clock', summary: '무권대리는 본인의 추인 여부로 운명이 갈린다. 상대방의 최고에 본인이 기간 내 답하지 않으면 "추인 거절"로 확정된다 — 반대로 외우기 쉬운 함정이다.',
    rule: [
      { event: '본인이 추인', effect: '유효 (소급)' },
      { event: '본인이 최고 기간 내 무응답', effect: '추인을 거절한 것으로 본다' },
    ],
    extra: '표현대리는 상대방이 주장할 수 있는 제도이지, 무권대리인 자신이 유효를 주장하기 위해 원용할 수 없다.',
    caution: '최고에 본인이 기간 내 확답하지 않으면 "추인한 것으로 본다"고 잘못 암기하기 쉽다 — 정반대로 "추인을 거절한 것으로 본다"가 맞다.',
    sources: [
      { label: '민법 제130조', note: '무권대리인의 계약과 본인의 추인', href: 'https://www.law.go.kr/법령/민법/제130조' },
      { label: '민법 제131조', note: '상대방의 최고권', href: 'https://www.law.go.kr/법령/민법/제131조' },
    ],
  },
  'comprehensive-real-estate-tax-land': {
    kind: 'tax-base-date-anchor', summary: '종합부동산세 납세의무자는 계약일이 아니라 매년 6월 1일(과세기준일) 현재의 소유자로 고정된다.',
    anchor: '과세기준일 = 매년 6월 1일',
    rule: '계약서 작성일·잔금일·등기일과 무관하게, 과세기준일 현재 소유자(대장상 소유자)가 납세의무자다.',
    exclusion: '자연공원법상 공원자연환경지구의 임야는 재산세 저율분리과세 대상이므로 종합부동산세 합산배제 대상이 되어 납세의무가 없다.',
    caution: '매매계약서 작성일을 기준으로 납세의무자를 판단하는 실수를 하기 쉽다 — 반드시 "과세기준일 현재" 소유자를 기준으로 판단해야 한다.',
    sources: [
      { label: '종합부동산세법 제3조', note: '과세기준일', href: 'https://www.law.go.kr/법령/종합부동산세법/제3조' },
      { label: '종합부동산세법 제7조', note: '납세의무자', href: 'https://www.law.go.kr/법령/종합부동산세법/제7조' },
    ],
  },
  'real-right-claim': {
    kind: 'real-right-claim-scope-fence', summary: '물권적 청구권으로 청구할 수 있는 것은 "돈"이 아니라 "행위"다. 방해제거·예방 비용 자체는 부당이득이나 손해배상으로 별도 해결해야 한다.',
    allowed: '방해의 제거·예방이라는 행위 자체를 청구',
    notAllowed: '방해제거·예방에 드는 비용 자체의 청구 — 물권적 청구권의 범위 밖',
    holder: '현재 물권을 가진 자만 행사할 수 있다.',
    caution: '물권적 청구권을 "비용 지급 청구권"으로 오해하기 쉽다 — 청구할 수 있는 것은 어디까지나 방해제거·예방이라는 행위다.',
    sources: [
      { label: '민법 제213조', note: '소유물반환청구권', href: 'https://www.law.go.kr/법령/민법/제213조' },
      { label: '민법 제214조', note: '소유물방해제거·예방청구권', href: 'https://www.law.go.kr/법령/민법/제214조' },
    ],
  },
  'real-right-change-registration': {
    kind: 'registration-requirement-split', summary: '등기가 필요한지는 "법률행위인가 아닌가"로 갈린다. 상속·형성판결은 등기 없이 효력이 생기지만, 협의·조정은 법률행위라 등기해야 한다.',
    noRegistration: ['상속 — 등기 없이도 즉시 이전(제187조)', '공유물분할 판결(형성판결) — 등기 없이도 효력 발생'],
    registrationRequired: ['공유물분할 협의·조정 — 당사자 합의(법률행위)이므로 등기해야 물권변동'],
    caution: '공유물분할과 관련된 물권변동은 늘 등기가 필요 없다고 일반화하기 쉽다 — "협의"에 의한 분할인지 "판결"에 의한 분할인지에 따라 결론이 달라진다.',
    sources: [
      { label: '민법 제186조', note: '법률행위로 인한 물권변동과 등기', href: 'https://www.law.go.kr/법령/민법/제186조' },
      { label: '민법 제187조', note: '법률규정에 의한 물권변동과 등기', href: 'https://www.law.go.kr/법령/민법/제187조' },
    ],
  },
  'offer-and-acceptance': {
    kind: 'offer-invitation-gate', summary: '청약은 "승낙만으로 계약이 완성될 만큼" 구체적·확정적이어야 한다. 그 정도에 못 미치면 청약의 유인일 뿐이다.',
    gate: [
      { item: '가격·조건을 구체적으로 못박은 매물 광고', result: '청약' },
      { item: '"문의 환영" 같은 단순 안내·광고', result: '청약의 유인' },
    ],
    match: '계약은 청약·승낙 사이에 당사자(주관적)와 내용(객관적)이 모두 합치해야 성립한다.',
    extra: '조건을 붙이거나 내용을 변경한 승낙은 승낙이 아니라 새로운 청약으로 취급된다.',
    caution: '구체성이 부족한 안내·광고성 제안까지 "청약"으로 오인하기 쉽다 — 이는 대개 청약의 유인에 그친다.',
    sources: [
      { label: '민법 제527조', note: '청약의 구속력', href: 'https://www.law.go.kr/법령/민법/제527조' },
    ],
  },
  'contract-for-third-party': {
    kind: 'third-party-benefit-limits', summary: '수익자는 계약의 "당사자"가 아니라 "이익만 받는 자"다. 권리를 확정할 수는 있어도 계약 자체를 좌우하는 힘은 없다.',
    rights: { who: '수익자(제3자)', has: ['수익의 의사표시로 권리 확정(제541조)'], not: ['계약 해제권', '해제로 인한 원상회복청구권'] },
    timing: '수익자는 계약체결 당시 현존하지 않아도 되고, 수익의 의사표시를 할 때 특정될 수 있으면 충분하다.',
    caution: '수익자도 계약 당사자처럼 해제권을 행사할 수 있다고 착각하기 쉽다 — 해제권은 계약 당사자(요약자)에게만 있다.',
    sources: [
      { label: '민법 제539조', note: '제3자를 위한 계약', href: 'https://www.law.go.kr/법령/민법/제539조' },
      { label: '민법 제541조', note: '수익자의 권리 확정', href: 'https://www.law.go.kr/법령/민법/제541조' },
    ],
  },
  'aggregate-building-act': {
    kind: 'reconstruction-vote-threshold', summary: '재건축이라는 중대 결정에는 아주 높은 동의율이 걸려 있다 — 과반수도 3분의 2도 아닌 "구분소유자·의결권 각 5분의 4 이상"이다.',
    threshold: '구분소유자 및 의결권의 각 5분의 4 이상',
    defs: '전유부분 = 구분소유권의 목적인 건물부분(제2조 제3호)',
    extra: '공용부분에 관한 지분은 전유부분과 분리하여 처분할 수 없다 — 전유부분의 처분에 따른다.',
    caution: '재건축 결의 요건을 과반수나 3분의 2로 착각하기 쉽다 — 정확히는 "5분의 4 이상"이다.',
    sources: [
      { label: '집합건물법 제2조', note: '전유부분의 정의', href: 'https://www.law.go.kr/법령/집합건물의소유및관리에관한법률/제2조' },
      { label: '집합건물법 제47조', note: '재건축 결의', href: 'https://www.law.go.kr/법령/집합건물의소유및관리에관한법률/제47조' },
    ],
  },
  'provisional-registration-security-act': {
    kind: 'liquidation-sequence-clock', summary: '가등기담보는 순서가 생명이다 — 채무자가 먼저 갚아야 하고(선이행), 채권자의 가등기 말소는 그 다음이다. 둘은 동시이행이 아니다.',
    sequence: ['채권자가 청산금 평가액을 채무자에게 통지', '청산기간(통지 도달일로부터 2개월) 경과', '채무자가 미변제 시 채권자에게 소유권 확정적 귀속'],
    order: '채무자의 채무변제의무(선이행) → 채권자의 가등기말소의무(후이행) — 동시이행관계 아님',
    caution: '채무변제의무와 가등기말소의무를 동시이행관계로 착각하기 쉽다 — 변제가 먼저 이루어져야 하는 선이행의무 관계다.',
    sources: [
      { label: '가등기담보법 제3조', note: '청산금의 평가액 통지', href: 'https://www.law.go.kr/법령/가등기담보등에관한법률/제3조' },
      { label: '가등기담보법 제4조', note: '청산금 지급과 소유권 취득', href: 'https://www.law.go.kr/법령/가등기담보등에관한법률/제4조' },
    ],
  },
  'juridical-act-effective-time': {
    kind: 'arrival-principle-shield', summary: '상대방 있는 의사표시는 "도달"해야 효력이 생긴다. 일단 발송하고 나면 표의자에게 무슨 일이 생기든 이미 완성된 효력에는 영향이 없다.',
    rule: '상대방 있는 의사표시는 그 통지가 상대방에게 도달한 때로부터 효력이 생긴다(발신한 때가 아님).',
    shield: '표의자가 통지를 발송한 후 사망하거나 행위능력을 상실해도 의사표시의 효력에는 영향이 없다(제111조 제2항).',
    exception: '격지자 간 계약의 승낙처럼 예외적으로 발신주의가 적용되는 경우와는 구별해야 한다.',
    caution: '"표의자가 발송 후 사망하면 의사표시의 효력을 잃는다"는 서술은 틀렸다 — 도달 전 사망해도 효력에는 영향이 없다.',
    sources: [
      { label: '민법 제111조', note: '의사표시의 효력발생시기', href: 'https://www.law.go.kr/법령/민법/제111조' },
    ],
  },
  'conditional-time-limited-act': {
    kind: 'condition-outcome-matrix', summary: '이미 벌어진 일(기성조건)을 조건으로 걸면 정지조건인지 해제조건인지에 따라 결과가 정반대로 갈린다.',
    matrix: [
      { condition: '기성조건을 정지조건으로', result: '조건 없는 법률행위 (그대로 유효)' },
      { condition: '기성조건을 해제조건으로', result: '무효' },
    ],
    extra: '채무면제 같은 단독행위는 원칙적으로 조건을 붙일 수 없으나, 상대방이 동의하면 예외적으로 붙일 수 있다.',
    caution: '"기성조건을 정지조건으로 하면 무효"라고 잘못 암기하기 쉽다 — 무효가 되는 것은 기성조건을 "해제조건"으로 한 경우다.',
    sources: [
      { label: '민법 제151조', note: '불법조건·기성조건', href: 'https://www.law.go.kr/법령/민법/제151조' },
    ],
  },
  'administrative-fine': {
    kind: 'fine-authority-router', summary: '과태료는 절차 위반에 붙는 행정질서벌이고, 부과 기관은 위반 내용에 따라 셋으로 나뉜다. 실체적 금지행위는 아예 과태료가 아니라 형사처벌이다.',
    routers: [
      { who: '국토교통부장관', items: ['거래정보망 운영규정 위반', '거래정보사업자 보고의무 위반', '공제사업 운용실적 미공시', '협회 임원 징계요구 불이행'] },
      { who: '시·도지사', items: ['연수교육 미이수(정당한 사유 없이)', '자격취소자의 자격증 미반납'] },
      { who: '등록관청', items: ['등록증 미게시', '이전·휴업·재개신고 위반', '확인·설명 불성실', '표시·광고 명시사항 위반'] },
    ],
    notFine: '무등록 중개업, 자격증의 대여·양수, 유사명칭 사용, 거짓 언행에 의한 금지행위는 과태료가 아니라 징역·벌금형(형사처벌) 대상이다.',
    caution: '연수교육 미이수나 자격증 미반납의 부과권자를 등록관청으로 착각하기 쉽다 — 자격 관련 사항이므로 시·도지사 소관이다.',
    sources: [
      { label: '공인중개사법 제51조', note: '과태료의 부과권자와 대상', href: 'https://www.law.go.kr/법령/공인중개사법/제51조' },
    ],
  },
  'criminal-penalty': {
    kind: 'penalty-tier-scale', summary: '같은 "형사처벌"이라도 위반의 무게에 따라 형량 구간이 나뉜다. 자격증 대여·명칭 무단사용은 무등록 중개업보다 가벼운 구간이다.',
    tiers: [
      { level: '1년 이하 징역 또는 1천만원 이하 벌금', items: ['공인중개사자격증 대여', '공인중개사가 아닌 자의 명칭 사용'] },
      { level: '3년 이하 징역 또는 3천만원 이하 벌금 (더 무거움)', items: ['무등록 중개업 등'] },
    ],
    caution: '자격증 대여의 형량을 무등록 중개업과 같은 더 무거운 형량으로 착각하기 쉽다 — 각 위반 유형별 형량을 구분해 암기해야 한다.',
    sources: [
      { label: '공인중개사법 제48·49조', note: '벌칙 조항과 형량 구간', href: 'https://www.law.go.kr/법령/공인중개사법/제48조' },
    ],
  },
  'sanction-jurisdiction': {
    kind: 'jurisdiction-location-rule', summary: '자격취소처분은 "자격증을 준 곳"이 아니라 "실제로 활동하는 곳"이 담당한다. 같은 위반도 지위에 따라 다른 처분이 내려진다.',
    rule: '자격증 교부 시·도지사와 사무소 소재지 관할 시·도지사가 다르면, 자격취소처분은 사무소 소재지 관할 시·도지사가 행한다.',
    dualEffect: [
      { who: '개업공인중개사의 인장등록 미이행', effect: '업무정지 사유' },
      { who: '소속공인중개사의 인장등록 미이행', effect: '자격정지 사유' },
    ],
    caution: '자격취소처분을 자격증을 교부한 시·도지사가 항상 담당한다고 착각하기 쉽다 — 사무소 소재지 관할 시·도지사가 우선한다.',
    sources: [
      { label: '공인중개사법 제35조', note: '자격취소', href: 'https://www.law.go.kr/법령/공인중개사법/제35조' },
      { label: '공인중개사법 제36조', note: '자격정지', href: 'https://www.law.go.kr/법령/공인중개사법/제36조' },
    ],
  },
  'escrow-deposit-agent': {
    kind: 'escrow-agent-eligibility-gate', summary: '계약금등의 예치명의자는 믿을 수 있는 제3의 기관이거나 개업공인중개사여야 한다 — 거래당사자 본인은 절대 될 수 없다.',
    eligible: ['개업공인중개사', '보험회사', '신탁업자', '은행', '공제사업을 하는 공인중개사협회', '계약이행보장 전문회사'],
    ineligible: ['거래당사자 중 일방', '투자중개업자', '한국지방재정공제회'],
    caution: '거래당사자 중 일방도 예치명의자가 될 수 있다고 착각하기 쉽지만, 예치명의자는 제3의 기관·전문회사이거나 개업공인중개사여야 하며 거래당사자 본인은 될 수 없다.',
    sources: [
      { label: '공인중개사법 제31조', note: '계약금등의 반환채무이행의 보장', href: 'https://www.law.go.kr/법령/공인중개사법/제31조' },
    ],
  },
  'local-income-tax-capital-gains': {
    kind: 'income-tax-base-split', summary: '개인지방소득세는 소득 종류별로 따로 계산한다 — 양도소득분과 종합·퇴직소득분을 섞어 합산하지 않는다.',
    split: [
      { type: '양도소득분', calc: '별도로 계산' },
      { type: '종합소득·퇴직소득분', calc: '별도로 계산' },
    ],
    rule: '지방소득세는 통상 소득세 산출세액에 일정 비율을 부가하는 방식으로 계산되며, 양도소득세 신고 시 함께 신고·납부하는 것이 일반적이다.',
    caution: '양도소득분과 종합소득분 지방소득세를 합산해서 계산한다고 착각하기 쉽다 — 서로 구분하여 계산한다.',
    sources: [
      { label: '지방세법 제103조의3', note: '개인지방소득세 과세표준의 구분 계산', href: 'https://www.law.go.kr/법령/지방세법/제103조의3' },
    ],
  },
  'acquisition-cost-interest': {
    kind: 'acquisition-cost-exclusion-line', summary: '취득원가는 "자산 자체의 대가"만 담는다. 지급이 늦어져 추가로 문 이자는 자산의 가치와 무관하므로 원가에서 빠진다.',
    included: '실지거래가액 — 자산 자체의 대가',
    excluded: '당초 약정에 의한 지급기일 지연으로 추가 발생한 이자상당액',
    caution: '지연이자도 취득을 위해 지출했으니 취득원가에 포함된다고 착각하기 쉽다 — 명시적으로 제외되는 항목이다.',
    sources: [
      { label: '소득세법 시행령 제163조', note: '취득가액의 범위와 지연이자 제외', href: 'https://www.law.go.kr/법령/소득세법시행령/제163조' },
    ],
  },
  'non-business-land': {
    kind: 'farmland-substance-test', summary: '농지인지는 서류(지목)가 아니라 실제로 경작에 쓰이는지로 판정한다. 지목이 대지라도 실제로 농사를 짓고 있으면 농지다.',
    test: '지적공부상 지목이 아니라 실제 이용 상황(경작 여부)이 판정 기준',
    included: ['농막', '퇴비사', '양수장', '지소', '농도·수로'],
    extra: '파산선고에 의한 처분으로 발생하는 소득은 비과세된다.',
    caution: '농지 여부를 지적공부상 지목만으로 판단하는 실수를 하기 쉽다 — 실제 이용 상황이 기준이다.',
    sources: [
      { label: '소득세법 제104조의3', note: '비사업용 토지의 범위', href: 'https://www.law.go.kr/법령/소득세법/제104조의3' },
    ],
  },
  'unregistered-transfer': {
    kind: 'unregistered-transfer-penalty-gate', summary: '미등기양도는 100분의 70이라는 무거운 단일세율로 응징된다 — 다만 등기하고 싶어도 법적으로 못 하는 정당한 사정은 예외다.',
    penalty: '양도소득 과세표준의 100분의 70 (비과세 규정 적용 불가)',
    exception: '건축허가를 받지 못해 등기가 불가능한 1세대 1주택 비과세 요건 충족 자산 → 미등기양도제외자산으로 취급되어 중과세 대상에서 제외',
    caution: '등기가 불가능한 모든 자산을 미등기양도로 중과세한다고 일반화하기 쉽다 — 법령상 미등기양도제외자산 목록에 해당하면 예외가 인정된다.',
    sources: [
      { label: '소득세법 제104조', note: '미등기양도자산의 세율', href: 'https://www.law.go.kr/법령/소득세법/제104조' },
      { label: '소득세법 시행령 제168조', note: '미등기양도제외자산', href: 'https://www.law.go.kr/법령/소득세법시행령/제168조' },
    ],
  },
  'overseas-asset-preliminary-return': {
    kind: 'overseas-filing-parity', summary: '국외자산이라고 신고 절차까지 면제되지 않는다 — 과세대상이 되면 국내자산과 똑같이 예정신고해야 한다.',
    requirement: '양도일까지 계속 5년 이상 국내에 주소를 둔 거주자의 국외 토지 양도 → 국외자산 양도소득세 과세대상',
    rule: '이 경우에도 양도소득과세표준을 예정신고해야 하며, 예정신고기한 등 절차는 국내자산 규정을 준용한다.',
    caution: '국외자산은 예정신고 의무가 없다고 착각하기 쉽다 — 과세대상이 되면 국내자산과 동일하게 예정신고해야 한다.',
    sources: [
      { label: '소득세법 제118조의8', note: '국외자산 양도소득의 예정신고', href: 'https://www.law.go.kr/법령/소득세법/제118조의8' },
    ],
  },
  'overseas-asset-transfer': {
    kind: 'overseas-liability-scope-fence', summary: '국외자산 양도소득세는 "5년 이상 국내 거주"라는 문턱을 넘어야 과세되고, 국내용 중과 장치(미등기양도)는 아예 적용되지 않는다.',
    liability: '양도일까지 계속 5년 이상 국내에 주소·거소를 둔 거주자에게만 납세의무가 있다.',
    excluded: '미등기 양도에 관한 중과 규정(제91조)은 국외자산에는 적용되지 않는다.',
    included: '비과세 양도소득에 관한 규정은 국외자산 양도에도 준용된다.',
    caution: '국외자산 미등기 양도도 국내 자산처럼 중과세된다고 착각하기 쉽다 — 국외자산에는 미등기양도 중과 규정이 적용되지 않는다.',
    sources: [
      { label: '소득세법 제118조의2', note: '국외자산 양도소득세의 납세의무자', href: 'https://www.law.go.kr/법령/소득세법/제118조의2' },
    ],
  },
  'real-estate-concept-fixture': {
    kind: 'complex-concept-lens', summary: '부동산은 한 가지 잣대로 안 보인다 — 법률·경제·물리 세 렌즈를 겹쳐야 복합개념이 완성된다.',
    lenses: [
      { type: '경제적 측면', items: ['자본', '소비재', '생산요소', '자산'] },
      { type: '물리적(기술적) 측면', items: ['공간', '자연', '위치'] },
    ],
    extra: '법률적 측면: 토지소유자는 법률이 정한 범위 내에서 사용·수익·처분할 권리가 있다(민법 제211조).',
    caution: '경제적 개념과 물리적 개념의 세부 항목을 서로 바꿔서 분류하기 쉽다 — "자본·자산"은 경제적, "공간·자연"은 물리적 개념임을 구분해야 한다.',
    sources: [
      { label: '민법 제211조', note: '소유권의 내용', href: 'https://www.law.go.kr/법령/민법/제211조' },
    ],
  },
  'housing-building-classification': {
    kind: 'housing-type-threshold-board', summary: '연립주택과 다중주택은 층수·면적이라는 두 숫자로 갈린다. 660㎡를 넘으면 연립, 이하면 다중(또는 다세대)이다.',
    types: [
      { name: '연립주택', floor: '4개 층 이하', area: '동당 바닥면적 합계 660㎡ 초과' },
      { name: '다중주택', floor: '3개 층 이하', area: '바닥면적 합계 660㎡ 이하' },
    ],
    extra: '기숙사는 취사시설이 없는 학교·공장 등의 부속 숙소로 분류된다.',
    caution: '연립주택과 다세대주택의 면적 기준(660㎡ 초과·이하)을 혼동하기 쉽다 — 660㎡를 넘으면 연립주택, 이하이면 다세대주택이다.',
    sources: [
      { label: '건축법 시행령 별표1', note: '용도별 건축물의 종류', href: 'https://www.law.go.kr/법령/건축법시행령' },
    ],
  },
  'flow-stock-variables': {
    kind: 'flow-stock-classifier', summary: '"얼마 동안"이 붙으면 유량, "어느 시점 현재"가 붙으면 저량이다 — 같은 주택도 재고냐 신규공급이냐에 따라 갈린다.',
    flow: ['가계소득', '신규주택 공급량', '주택거래량', '임대료 수입', '연간 이자비용'],
    stock: ['주택재고(량)', '자본총량', '통화량'],
    test: '"일정 기간 동안" 측정되면 유량, "특정 시점"에서 측정되면 저량.',
    caution: '주택거래량을 저량으로 착각하기 쉽지만, 일정 기간(예: 1년) 동안 거래된 양이므로 유량이다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산경제론 · 유량과 저량', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'christaller-central-place-theory': {
    kind: 'central-place-range-scale', summary: '최소요구치가 도달범위 안에 들어와야 그 상업기능이 살아남는다 — 장사가 유지되는 최소 매출선이 손님을 끌 수 있는 한계 안에 있어야 한다.',
    concepts: [
      { term: '도달범위', desc: '중심지가 재화·서비스를 제공할 수 있는 최대 거리' },
      { term: '최소요구치', desc: '중심지 기능이 유지되기 위해 필요한 최소한의 수요 규모' },
    ],
    rule: '최소요구치가 도달범위 안에 있어야 판매자가 존속할 수 있다.',
    extra: '배후지는 중심지로부터 재화·서비스를 제공받는 주변지역이다 (중심지가 배후지에 제공하는 것이지 그 반대가 아님).',
    caution: '배후지를 "중심지에 재화·서비스를 제공하는 곳"으로 거꾸로 착각하기 쉽다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산시장론 · 입지론', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'housing-filtering-market-segregation': {
    kind: 'market-efficiency-tier-recap', summary: '효율적 시장의 강성·준강성 구분은 "어디까지의 정보가 반영됐는가"로 다시 갈린다 — 주거분리는 이와 별개로 소득계층별 주거지 분리 현상이다.',
    tiers: [
      { level: '준강성 효율적 시장', scope: '공표된 정보만 반영' },
      { level: '강성 효율적 시장', scope: '공표 + 비공표 정보 모두 반영' },
    ],
    extra: '주거분리는 소득계층별로 주거지가 나뉘는 현상이며, 불완전경쟁 시장에서도 자원이 최선으로 배분되면 할당효율성은 달성될 수 있다.',
    caution: '강성과 준강성의 정의를 뒤바꿔 서술하는 지문에 주의해야 한다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산시장론 · 효율적 시장', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'market-failure-intervention': {
    kind: 'intervention-direct-indirect-sort', summary: '정부가 물량·가격을 직접 통제하는지, 세금·부담금으로 유인만 조정하는지로 개입 수단이 갈린다. 개발부담금은 세금이므로 간접개입이다.',
    direct: ['토지수용', '공공임대주택 건설'],
    indirect: ['개발부담금 부과 등 조세·부담금'],
    causes: ['공공재의 비배제성·비경합성', '외부효과'],
    caution: '"개발부담금 부과 = 직접개입"이라고 착각하기 쉽다 — 조세·부담금은 간접개입 수단이다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산정책론 · 시장개입', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'non-discounted-methods': {
    kind: 'ratio-formula-panel', summary: '비할인법 비율들은 분자·분모 조합만 정확히 구분하면 헷갈리지 않는다 — DCR은 NOI÷부채서비스액, 부채비율은 부채÷지분이다.',
    formulas: [
      { name: 'DCR (부채감당률)', formula: '순영업소득(NOI) ÷ 부채서비스액' },
      { name: '채무불이행률 (손익분기율)', formula: '(영업경비+부채서비스액) ÷ 유효총소득' },
      { name: '부채비율', formula: '부채 ÷ 지분' },
      { name: '대부비율 (LTV)', formula: '부채 ÷ 부동산가치' },
    ],
    extra: 'DCR이 1보다 작으면 NOI가 부채서비스액을 감당하지 못한다. 부채서비스액은 이자지급액과 원금상환액을 모두 포함한다.',
    caution: 'DCR의 분자·분모를 바꿔서 계산하는 실수를 하기 쉽다 — 분자는 NOI, 분모는 부채서비스액이다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산투자론 · 비할인법', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'portfolio-theory': {
    kind: 'risk-diversification-dial', summary: '분산투자가 지울 수 있는 위험과 못 지우는 위험은 따로 있다 — 시장 전체가 흔들리는 체계적 위험은 아무리 섞어도 남는다.',
    risks: [
      { type: '비체계적 위험 (개별 위험)', effect: '분산투자로 제거 가능' },
      { type: '체계적 위험 (시장 위험)', effect: '분산투자로도 제거 불가' },
    ],
    optimal: '자산 간 상관계수가 -1(완전 부의 상관관계)일 때 위험감소 효과가 최대가 된다.',
    caution: '"분산투자로 체계적 위험이 감소한다"는 서술은 틀렸다 — 체계적 위험은 시장 전체에 영향을 미치는 위험이라 분산으로 제거되지 않는다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산투자론 · 포트폴리오이론', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'reverse-mortgage-pension': {
    kind: 'reverse-mortgage-eligibility-board', summary: '주택연금은 한국주택금융공사가 보증하고, 주거목적 오피스텔까지는 되지만 업무시설 오피스텔은 안 된다 — 배우자도 생존기간 내내 받을 수 있다.',
    guarantor: '보증기관: 한국주택금융공사 (담보주택 가격하락 위험도 공사가 부담)',
    eligible: ['저당권 설정 등기 방식', '신탁 등기 방식', '준주택 중 주거목적 오피스텔'],
    ineligible: '업무시설인 오피스텔',
    extra: '주택소유자뿐 아니라 배우자도 생존하는 동안 매월 지급받을 수 있으며, 수급권은 양도·압류할 수 없다.',
    caution: '업무시설인 오피스텔도 주택연금의 담보주택 대상이라고 착각하기 쉽지만, 주거목적으로 사용되는 오피스텔만 대상이다.',
    sources: [
      { label: '한국주택금융공사법', note: '주택담보노후연금보증', href: 'https://www.law.go.kr/법령/한국주택금융공사법' },
    ],
  },
  'reits-structure': {
    kind: 'reits-type-capital-board', summary: 'REITs는 누가 운용하는지에 따라 세 갈래로 나뉘고, 자기관리형은 설립 시 최저자본금 문턱(5억원)을 넘어야 한다.',
    types: ['자기관리 REITs', '위탁관리 REITs', '기업구조조정 REITs'],
    capital: '자기관리 REITs 설립 시 최저자본금 5억원 이상',
    extra: '주주 1인당 주식소유 한도 제한은 일반투자자를 보호하기 위한 장치다.',
    caution: '자기관리·위탁관리 REITs의 자산운용 주체를 혼동하기 쉽다 — 자기관리는 자체 인력이, 위탁관리는 자산관리회사가 운용한다.',
    sources: [
      { label: '부동산투자회사법 제6조', note: '자기관리 부동산투자회사의 설립자본금', href: 'https://www.law.go.kr/법령/부동산투자회사법/제6조' },
    ],
  },
  'property-management-methods': {
    kind: 'management-tradeoff-scale', summary: '위탁관리는 전문성과 기밀유지를 맞바꾸는 거래다. 재산관리(PM)의 업무 범위에는 대출알선 같은 금융서비스가 들어가지 않는다.',
    tradeoff: { outsourced: '위탁(외주)관리 — 전문성 높음 · 기밀유지 어려움' },
    pmScope: '재산관리(PM) = 임대차 운영, 시설 유지보수 등 개별 부동산의 일상적 운영관리',
    notAllowed: '대출알선(금융서비스)은 위탁관리형 주택임대관리업자의 법정 업무 범위에 포함되지 않는다.',
    caution: '주택임대관리업자의 업무 범위에 금융서비스(대출알선)까지 포함된다고 착각하기 쉽다 — 법정 업무 범위 밖이다.',
    sources: [
      { label: '민간임대주택법', note: '주택임대관리업의 업무 범위', href: 'https://www.law.go.kr/법령/민간임대주택에관한특별법' },
    ],
  },
  'percentage-lease-analysis': {
    kind: 'percentage-lease-calc-steps', summary: '비율임대차는 "기본임대료 + 매출 초과분 성과급" 구조다 — 추가임대료율은 반드시 손익분기점을 넘은 매출에만 곱한다.',
    steps: ['초과매출액 = 총매출액 − 손익분기점 매출액', '추가임대료 = 초과매출액 × 추가임대료율', '총임대료 = 기본임대료 + 추가임대료'],
    example: '총매출 7억 5천만원, 손익분기점 4억 5천만원 → 초과매출 3억원 × 추가임대료율 15% = 추가임대료 4,500만원',
    caution: '추가임대료율을 총매출액 전체에 곱하는 실수를 하기 쉽다 — 반드시 손익분기점을 초과한 매출액에만 곱해야 한다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산관리론 · 비율임대차', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'policy-review-committee': {
    kind: 'committee-chair-scope-board', summary: '정책심의위원회는 국토교통부장관이 아니라 제1차관이 위원장을 맡는다 — 중개보수 변경처럼 굵직한 사항이 이 위원회 소관이다.',
    chair: '위원장: 국토교통부 제1차관',
    scope: ['중개보수 변경에 관한 사항', '공인중개사의 자격취득 및 시험에 관한 사항', '부동산중개업의 육성에 관한 사항'],
    caution: '위원장을 국토교통부장관으로 착각하기 쉽다 — 정확히는 "국토교통부 제1차관"이다.',
    sources: [
      { label: '공인중개사법 제2조의2', note: '공인중개사 정책심의위원회', href: 'https://www.law.go.kr/법령/공인중개사법/제2조의2' },
    ],
  },
  'subject-matter-of-brokerage': {
    kind: 'brokerage-subject-scope-gate', summary: '분양권처럼 아직 완공 안 된 건물도 피분양자가 특정되면 중개대상물이다. 재등록자 처분은 폐업기간 1년을 기준으로 갈린다.',
    included: '피분양자가 선정된 장차 건축될 특정 건물(분양권) — 판례상 중개대상물에 해당',
    reregistration: [
      { threshold: '폐업기간 1년 미만', effect: '폐업기간·폐업사유를 고려사항으로 삼아 등록취소처분 가능' },
      { threshold: '폐업기간 1년 초과', effect: '폐업신고 전 위반행위를 이유로 한 등록취소·업무정지 처분 제한' },
    ],
    caution: '분양권처럼 아직 완공되지 않은 건물은 중개대상물이 아니라고 착각하기 쉽다 — 피분양자가 특정되면 중개대상물에 해당한다.',
    sources: [
      { label: '공인중개사법 제10조', note: '등록의 결격사유 등과 재등록 처분', href: 'https://www.law.go.kr/법령/공인중개사법/제10조' },
    ],
  },
  'broker-education-types': {
    kind: 'education-type-timing-board', summary: '실무교육은 처음 진입하는 사람을 위한 사전교육이고, 연수교육은 이미 활동 중인 사람을 위한 주기적 재교육이다.',
    types: [
      { name: '실무교육', target: '분사무소 책임자가 되려는 자 등 신규 진입자', timing: '고용신고일 전 1년 이내', authority: '위탁이 없으면 시·도지사가 실시' },
      { name: '연수교육', target: '이미 등록·고용된 공인중개사등', timing: '일정 주기마다' },
    ],
    caution: '분사무소 책임자의 사전교육을 연수교육으로 착각하기 쉽다 — 정확히는 실무교육이다.',
    sources: [
      { label: '공인중개사법 제34조', note: '실무교육·연수교육 등', href: 'https://www.law.go.kr/법령/공인중개사법/제34조' },
    ],
  },
  'seal-registration': {
    kind: 'seal-registration-rule-board', summary: '인장등록은 실제로 날인하는 사람(개업·소속공인중개사)의 의무이고, 변경은 7일 이내, 분사무소 인장도 결국 주된 사무소 관할청에 등록한다.',
    who: ['개업공인중개사', '소속공인중개사'],
    notWho: '중개보조원',
    changeDeadline: '등록한 인장을 변경한 경우 변경일부터 7일 이내에 변경등록',
    branchRule: '분사무소에서 사용할 인장도 분사무소 소재지가 아니라 주된 사무소를 관할하는 등록관청에 등록한다.',
    caution: '분사무소 인장은 분사무소 소재지 관할 관청에 등록한다고 착각하기 쉽지만, 실제로는 주된 사무소를 관할하는 등록관청에 등록한다.',
    sources: [
      { label: '공인중개사법 시행규칙 제9조', note: '인장의 등록·변경등록', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙/제9조' },
    ],
  },
  'office-establishment-standard': {
    kind: 'one-office-principle-map', summary: '하나의 등록으로 여러 곳에서 영업하는 것을 막기 위해, 등록관청 관할구역 안에는 사무소를 딱 하나만 둘 수 있다 — 분사무소도 예외가 아니다.',
    rule: '개업공인중개사는 등록관청 관할구역 안에 1개의 중개사무소만을 둘 수 있다.',
    branchRule: '주된 사무소가 있는 등록관청 관할구역(동일 군 등) 내에는 분사무소를 둘 수 없다.',
    extra: '분사무소는 주된 사무소가 소재하는 시·군·구를 제외한 시·군·구별로 1개소를 초과할 수 없다.',
    caution: '분사무소를 주된 사무소와 같은 군(郡) 내에도 자유롭게 설치할 수 있다고 착각하기 쉽다 — 동일 관할구역 내에는 설치할 수 없다.',
    sources: [
      { label: '공인중개사법 제13조', note: '중개사무소의 개설등록 기준과 분사무소', href: 'https://www.law.go.kr/법령/공인중개사법/제13조' },
    ],
  },
  'concurrent-business-restriction': {
    kind: 'concurrent-business-allow-deny-list', summary: '법인 개업공인중개사의 겸업은 중개업과 밀접한 부수 서비스까지만 허용된다 — 직접 임대인이 되거나 토지 자체를 다루는 업무는 겸업 밖이다.',
    allowed: ['주택·상업용 건축물의 분양대행·관리대행', '부동산의 이용·개발에 관한 상담', '중개업의 경영기법·경영정보 제공', '주거이전에 부수되는 용역의 알선', '공매대상 부동산의 취득알선·입찰신청대리'],
    denied: ['주택의 임대업 자체', '토지(주택용지 포함)의 분양대행', '금융의 알선', '공제업무의 대행', '동산에 대한 입찰신청대리'],
    caution: '임대관리와 임대업 자체를 같은 업무로 혼동하기 쉽다 — 관리대행은 겸업 가능하지만 직접 임대업은 겸업범위 밖이다.',
    sources: [
      { label: '공인중개사법 제14조', note: '법인의 겸업 범위', href: 'https://www.law.go.kr/법령/공인중개사법/제14조' },
    ],
  },
  'license-revocation-cause': {
    kind: 'license-revocation-flow-board', summary: '자격취소는 "자격증을 교부한" 시·도지사가 청문을 거쳐 행하고, 그 뒤에도 5일·7일이라는 서로 다른 두 시계가 돌아간다.',
    authority: '취소권자: 자격증을 교부한 시·도지사 (중개사무소 소재지 관할 시·도지사 아님)',
    procedure: ['청문 실시', '취소 후 5일 이내 국토교통부장관 보고 · 다른 시·도지사 통지', '당사자는 처분일로부터 7일 이내 자격증 반납 (분실 시 사유서 제출)'],
    causes: ['부정한 방법으로 자격을 취득', '자격증을 다른 사람에게 대여', '자격정지기간 중 중개업무 또는 소속공인중개사·임원 취임', '이 법을 위반해 징역형(집행유예 포함) 선고'],
    caution: '자격취소권자를 "중개사무소 소재지 관할 시·도지사"로 착각하기 쉽지만, 실제로는 "자격증을 교부한 시·도지사"가 취소권자다.',
    sources: [
      { label: '공인중개사법 제35조', note: '자격의 취소', href: 'https://www.law.go.kr/법령/공인중개사법/제35조' },
    ],
  },
  'license-suspension-cause': {
    kind: 'suspension-vs-revocation-scale', summary: '자격정지는 절차상 실수, 자격취소는 자격 자체를 흔드는 중대 위반이다 — 자격증 대여는 정지가 아니라 취소감이다.',
    suspension: '거래계약서에 서명·날인을 하지 않은 경우',
    revocation: '공인중개사자격증을 다른 사람에게 대여한 경우',
    caution: '자격증 대여를 자격정지사유로 착각하기 쉽다 — 대여는 훨씬 무거운 자격취소사유다.',
    sources: [
      { label: '공인중개사법 제36조', note: '자격의 정지', href: 'https://www.law.go.kr/법령/공인중개사법/제36조' },
    ],
  },
  'sanction-succession': {
    kind: 'closure-period-succession-gate', summary: '폐업이 제재를 피하는 수단이 되지 않도록, 1년 이내 재등록이면 폐업 전 위반의 책임이 따라온다. 1년을 넘기면 더는 추적하지 않는다.',
    gate: [
      { period: '폐업기간 1년 이내 재등록', effect: '폐업신고 전 위반행위를 이유로 한 제재가 승계될 수 있다' },
      { period: '폐업기간 1년 초과 재등록', effect: '폐업신고 전 사유로 업무정지처분을 할 수 없다' },
    ],
    extra: '폐업하려는 개업공인중개사는 국토교통부장관이 아니라 등록관청에 미리 신고해야 한다.',
    caution: '폐업신고 관청을 국토교통부장관으로 착각하기 쉽다 — 정확히는 등록관청에 신고해야 한다.',
    sources: [
      { label: '공인중개사법 제10조', note: '행정제재처분 효과의 승계', href: 'https://www.law.go.kr/법령/공인중개사법/제10조' },
    ],
  },
  'mutual-aid-business': {
    kind: 'mutual-aid-supervision-chain', summary: '협회의 공제사업은 큰돈이 오가는 만큼, 규정 제정부터 운영 방식까지 국토교통부장관의 감독을 받는다.',
    chain: ['협회가 공제규정을 제정', '국토교통부장관의 승인을 얻어야 시행 가능', '국토교통부장관은 업무집행방법의 변경을 명할 수 있음'],
    caution: '공제규정 제정에 국토교통부장관의 승인이 필요 없다고 착각하기 쉽다 — 반드시 승인을 받아야 한다.',
    sources: [
      { label: '공인중개사법 제42조', note: '공제사업', href: 'https://www.law.go.kr/법령/공인중개사법/제42조' },
    ],
  },
  'fee-payment-obligors': {
    kind: 'fee-obligation-filter', summary: '수수료는 관청에 "새로운 처리"를 요청할 때만 붙는다 — 기존 상태를 바꾸는 신고(휴업, 인장변경)에는 붙지 않는다.',
    required: ['지방자치단체 시행 자격시험 응시', '자격증 재교부 신청', '중개사무소 개설등록 신청', '등록증·신고확인서 재교부 신청', '분사무소 설치신고'],
    notRequired: ['등록인장의 변경신고', '중개사무소의 휴업신고', '국토교통부장관 시행 자격시험 응시'],
    caution: '국토교통부장관이 시행하는 자격시험도 수수료 납부 대상이라고 착각하기 쉽지만, 수수료 납부 대상은 지방자치단체가 시행하는 시험에 응시하는 경우다.',
    sources: [
      { label: '공인중개사법 제47조', note: '수수료', href: 'https://www.law.go.kr/법령/공인중개사법/제47조' },
    ],
  },
  'document-retention': {
    kind: 'document-retention-exemption-rule', summary: '확인·설명서는 원칙적으로 보존해야 하지만, 공인전자문서센터에 안전하게 전자보관되어 있다면 실물 보존 의무 자체가 사라진다.',
    rule: '중개대상물 확인·설명서는 원칙적으로 일정 기간 보존해야 한다.',
    exemption: '공인전자문서센터에 보관된 경우에는 그 보존의무가 면제된다.',
    caution: '전자보관 여부와 무관하게 실물 보존이 항상 필요하다고 착각하기 쉽다 — 공인전자문서센터 보관 시에는 면제된다.',
    sources: [
      { label: '공인중개사법 제25조', note: '중개대상물의 확인·설명', href: 'https://www.law.go.kr/법령/공인중개사법/제25조' },
    ],
  },
  'zoning-negative-externality': {
    kind: 'externality-policy-rationale', summary: '용도지역·지구제는 시장이 못 푸는 부(-)의 외부효과를 정부가 규제로 해결하는 장치다. 지역은 한 자리에 하나, 지구는 중복 지정될 수 있다는 차이도 함께 기억한다.',
    rationale: '사적 시장이 외부효과에 대한 효율적 해결책을 제시하지 못할 때 정부가 채택하는 정책수단 — 토지이용에 따른 부(-)의 외부효과를 제거·감소시킨다.',
    compare: [
      { item: '용도지역', trait: '하나의 토지에 하나만 지정 (중복 불가)' },
      { item: '용도지구', trait: '용도지역과 달리 하나의 대지에 중복 지정될 수 있음' },
    ],
    boundaryCheck: [
      { name: '준주거지역·근린상업지역·자연녹지지역', tier: '도시지역' },
      { name: '계획관리지역', tier: '관리지역 (도시지역 아님)' },
    ],
    caution: '계획관리지역을 도시지역의 세분으로 착각하기 쉽지만, 계획관리지역은 도시지역이 아니라 관리지역의 세분이다.',
    sources: [
      { label: '국토계획법 제6조', note: '국토의 용도 구분', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제6조' },
    ],
  },
  'sale-price-cap-rent-subsidy': {
    kind: 'sale-price-formula-board', summary: '분양가상한제는 땅값과 건축비를 그대로 더한 원가주의 상한이다. 공공택지 공동주택도 대상이 될 수 있고, 전매제한이라는 보조 장치가 함께 붙는다.',
    formula: '분양가 = 택지비 + 건축비',
    scope: '국민주택건설사업 등 공공사업으로 개발·조성되는 용지에 건설되는 공동주택도 분양가 제한 대상이 될 수 있다.',
    extra: '분양가상한제 적용주택 및 그 입주자로 선정된 지위(분양권)는 전매를 제한할 수 있다.',
    caution: '분양가 산정식에 "택지비 + 건축비" 외의 다른 항목을 추가하는 지문에 주의해야 한다.',
    sources: [
      { label: '주택법 제57조', note: '주택의 분양가격 제한 등', href: 'https://www.law.go.kr/법령/주택법/제57조' },
    ],
  },
  'real-estate-tax-policy': {
    kind: 'tax-classification-grid', summary: '부동산 세금은 국세·지방세, 취득·보유·처분이라는 두 축의 표로 정리하면 세목이 늘어도 위치를 잃지 않는다. 상속·증여세는 취득단계라는 점이 자주 틀리는 함정이다.',
    grid: [
      { stage: '취득단계', national: ['상속세', '증여세'], local: ['취득세'] },
      { stage: '보유단계', national: ['종합부동산세'], local: ['재산세'] },
      { stage: '처분단계', national: ['양도소득세'], local: [] },
    ],
    extra: '등록면허세는 지방세, 부가가치세는 국세다. 국세이면서 보유세인 세목은 종합부동산세뿐이다(재산세는 지방세).',
    caution: '상속세·증여세를 보유단계나 처분단계 세금으로 착각하기 쉽지만, 둘 다 취득단계에 부과되는 국세다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산정책론 · 조세정책', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'time-value-of-money': {
    kind: 'coefficient-purpose-matcher', summary: '"무엇을 구하려 하는가"로 계수를 고른다 — 매달 갚을 돈은 저당상수, 미래에 모을 돈은 감채기금계수.',
    matches: [
      { coef: '저당상수', use: '매기 상환할 원리금 계산' },
      { coef: '감채기금계수', use: '미래 목표 금액을 만들기 위한 매기 적립액 계산' },
    ],
    extra: '잔금비율(남은 원금 비율)과 상환비율(상환된 원금 비율)의 합은 항상 1이다.',
    caution: '저당상수와 감채기금계수의 용도를 서로 바꿔 적용하는 실수가 잦다 — 상환액 계산은 저당상수, 적립액 계산은 감채기금계수다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산투자론 · 화폐의 시간가치', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'operating-cash-flow': {
    kind: 'cash-flow-waterfall', summary: '운영수지는 위에서 아래로 하나씩 걷어내는 폭포수 구조다 — PGI에서 공실, 영업경비, 부채서비스액, 세금을 순서대로 뺀다.',
    steps: ['가능총소득(PGI) = 단위면적당 추정 임대료 × 임대면적', '− 공실·불량부채 → 유효총소득(EGI)', '− 영업경비 → 순영업소득(NOI)', '− 부채서비스액 → 세전현금흐름', '− 영업소득세 → 세후현금흐름'],
    caution: '각 단계에서 차감하는 항목의 순서(공실→영업경비→부채서비스액→세금)를 뒤바꾸는 실수를 하기 쉽다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산투자론 · 현금수지 계산', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'expected-return-calculation': {
    kind: 'expected-return-formula-panel', summary: '기대수익률은 시나리오별 확률로 가중평균한 값이고, 투자가치는 그 요구수익률로 순수익을 자본환원한 값이다 — 서로 다른 계산이지만 둘 다 위험을 반영한다.',
    formulas: [
      { name: '기대수익률', formula: 'Σ(상황별 예상수익률 × 발생확률)' },
      { name: '요구수익률', formula: '무위험률 + 위험할증률 + 예상인플레이션율' },
      { name: '투자가치', formula: '예상순수익 ÷ 요구수익률' },
    ],
    rule: '평균-분산 지배원리: 기대수익률이 같으면 위험(분산)이 작은 자산이, 위험이 같으면 기대수익률이 높은 자산이 더 선호된다.',
    caution: '위험할증률과 예상인플레이션율을 요구수익률 계산에서 빠뜨리기 쉽다 — 요구수익률은 무위험률·위험할증률·예상인플레이션율을 모두 더해 구한다.',
    sources: [
      { label: 'Q-Net 공인중개사 출제기준', note: '부동산투자론 · 수익과 위험', href: 'https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=9630' },
    ],
  },
  'statutory-superficies-and-purchase-right': {
    kind: 'customary-superficies-requirements', summary: '관습법상 법정지상권은 건축 허가 여부를 따지지 않는다 — 철거특약이 없고 건물 요건만 갖추면 무허가건물도 보호받는다.',
    rule: '철거특약이 없고 건물로서의 요건을 갖추었다면, 무허가건물이라도 관습상 법정지상권이 인정된다.',
    succession: '종전 임차인이 신축한 건물을 매수한 새로운 임차인도 지상물매수청구권을 행사할 수 있는 임차인에 해당한다.',
    extra: '관습법상 법정지상권은 등기 없이도 성립하지만, 이를 처분(양도)하려면 등기가 필요하다.',
    caution: '무허가건물에는 법정지상권이 인정되지 않는다고 착각하기 쉽다 — 철거특약이 없고 건물 요건을 갖췄다면 인정된다.',
    sources: [
      { label: '민법 제187조', note: '법률규정에 의한 물권취득', href: 'https://www.law.go.kr/법령/민법/제187조' },
    ],
  },
  'co-ownership-exclusive-use': {
    kind: 'minority-co-owner-remedy-fence', summary: '공유물을 독점한 다른 공유자를 쫓아낼 순 없다 — 대법원 전원합의체는 "인도청구"라는 강한 수단 대신 완화된 수단만 허용했다.',
    denied: '공유물 전부의 인도청구 (지분이 동일해도 불가)',
    allowed: ['자신의 지분권에 기초한 방해배제청구', '부당이득반환청구'],
    precedent: '대법원 2018다287522 전원합의체 판결(2020. 5. 21. 선고)',
    caution: '지분권자라면 누구나 인도청구를 할 수 있다고 착각하기 쉽다 — 동일 지분 공유관계에서는 인도청구가 허용되지 않는다.',
    sources: [
      { label: '대법원 2018다287522', note: '소수지분권자의 인도·방해배제청구', href: 'https://casenote.kr/대법원/2018다287522' },
    ],
  },
  'contract-title-trust': {
    kind: 'seller-knowledge-outcome-fork', summary: '계약명의신탁의 결과는 매도인이 신탁약정을 알았는가 하나로 갈린다 — 몰랐으면 수탁자가, 알았으면 매도인이 소유권을 갖는다.',
    fork: [
      { state: '매도인 선의 (몰랐음)', outcome: '수탁자 명의 등기 유효 → 수탁자가 소유권 취득', remedy: '신탁자는 수탁자에게 매수자금 상당의 부당이득반환청구만 가능' },
      { state: '매도인 악의 (알았음)', outcome: '수탁자 명의 등기 무효 → 매도인이 소유권 보유', remedy: '신탁자는 매도인·수탁자 누구에게도 이전등기 청구 불가' },
    ],
    extra: '수탁자로부터 부동산을 매수한 제3자는 명의신탁 사실을 알았더라도 유효하게 소유권을 취득한다.',
    caution: '계약명의신탁에서는 매도인의 선의·악의와 무관하게 명의신탁약정 자체는 항상 무효라는 점과, 등기의 효력(수탁자의 소유권 취득 여부)은 매도인의 선의·악의에 따라 갈린다는 점을 혼동하기 쉽다.',
    sources: [
      { label: '부동산실명법 제4조', note: '명의신탁약정의 효력', href: 'https://www.law.go.kr/법령/부동산실권리자명의등기에관한법률/제4조' },
    ],
  },
  'real-name-act-general-and-sanctions': {
    kind: 'real-name-act-exception-penalty-board', summary: '배우자·종중 명의는 탈세 목적이 없으면 예외로 봐주지만, 위반자에게는 과징금과 이행강제금이라는 이중 금전제재가 따른다.',
    exception: '배우자·종중 명의로 등기한 경우, 조세포탈 등의 목적이 없으면 명의신탁약정과 등기가 유효하다.',
    penalty: { who: '부과대상: 명의신탁자 (명의수탁자가 아님)', types: ['과징금 (부동산 가액에 비례, 물납 불가·전부 금전 납부)', '시정명령 불이행 시 이행강제금 추가 부과'] },
    extension: '과징금 납부기한 연장 신청은 통지받은 날부터 30일 이내에 해야 한다.',
    caution: '명의신탁 관련 과징금·이행강제금의 부과대상을 명의수탁자로 착각하기 쉽지만, 실제 부과대상은 명의신탁자다.',
    sources: [
      { label: '부동산실명법 제8조', note: '종중·배우자 특례', href: 'https://www.law.go.kr/법령/부동산실권리자명의등기에관한법률/제8조' },
      { label: '부동산실명법 제5조', note: '과징금', href: 'https://www.law.go.kr/법령/부동산실권리자명의등기에관한법률/제5조' },
    ],
  },
  'permit-zone-designation': {
    kind: 'permit-zone-effective-timeline', summary: '허가구역 지정은 공고 즉시가 아니라 5일의 유예기간을 두고 나서야 효력이 생긴다 — 이해관계인이 대응할 시간을 주기 위해서다.',
    timeline: [{ event: '지정 공고' }, { event: '5일 경과' }, { event: '지정 효력 발생' }],
    extra: '거래계약신고서에는 매도인·매수인의 성명 및 주소 등이 기재사항으로 포함된다.',
    caution: '허가구역 지정이 공고 즉시 효력을 발생한다고 착각하기 쉽다 — 공고일로부터 5일 후에 효력이 생긴다.',
    sources: [
      { label: '부동산거래신고법 제10조', note: '토지거래허가구역의 지정과 효력발생', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제10조' },
    ],
  },
  'permit-exemption': {
    kind: 'permit-exemption-case-list', summary: '이미 다른 절차로 충분히 통제됐거나 공적 주체가 개입하는 거래까지 중복으로 허가를 요구하지는 않는다.',
    cases: ['지방자치단체가 허가구역 내 토지의 매수할 자로 지정된 경우', '외국인이 별도로 토지취득 허가를 받은 경우', '국가·지방자치단체가 계약 당사자가 되는 경우'],
    caution: '외국인의 토지취득 허가와 일반 토지거래허가를 동시에 받아야 한다고 착각하기 쉽다 — 외국인 토지취득 허가를 받았다면 토지거래허가는 배제된다.',
    sources: [
      { label: '부동산거래신고법 제14조', note: '허가에 관한 특례', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제14조' },
    ],
  },
  'graveyard-usage-right': {
    kind: 'grave-right-timeline-fork', amended: true, summary: '분묘기지권은 장사법 시행일(2001.1.13.)을 기점으로 시효취득 인정 여부가 갈리고, 2021년 전원합의체 판결로 지료 지급의무까지 추가로 확정됐다.',
    timeline: [
      { date: '~2001.1.12.', event: '설치된 분묘', result: '20년 평온·공연 점유 시 관습법상 시효취득 인정' },
      { date: '2001.1.13.~', event: '장사법 시행 이후 설치', result: '시효취득에 의한 분묘기지권 불인정' },
    ],
    precedent: { date: '2021.4.29. 대법원 전원합의체(2017다228007)', rule: '시효취득형 분묘기지권자도 토지소유자가 지료를 청구한 날부터는 지료를 지급해야 한다' },
    caution: '시효취득으로 분묘기지권을 얻으면 지료가 아예 면제된다고 착각하기 쉽다 — 2021년 전원합의체 판결 이후에는 토지소유자의 청구가 있으면 청구일부터 지료를 내야 한다.',
    sources: [
      { label: '장사 등에 관한 법률 부칙', note: '2001.1.13. 시행 — 무단 분묘 설치의 시효취득 제한', href: 'https://www.law.go.kr/법령/장사등에관한법률' },
      { label: '대법원 2021.4.29. 선고 2017다228007 전원합의체 판결', note: '시효취득형 분묘기지권자의 지료 지급의무', href: 'https://casenote.kr/대법원/2017다228007' },
    ],
  },
  'explanation-form-details': {
    kind: 'cadastral-ledger-split', summary: '확인·설명서의 토지 항목은 지적도와 토지대장 중 어느 공부(公簿)에서 확인하는지가 정확히 나뉘어 있다.',
    ledgers: [
      { name: '지적도', items: ['소재지', '지목', '지형', '경계'] },
      { name: '토지대장', items: ['지목', '면적', '소유자'] },
    ],
    exception: '취득 시 부담할 조세의 종류 및 세율은 매매의 경우 기재하지만, 임대차의 경우에는 기재를 생략할 수 있다.',
    caution: '지적도와 토지대장의 확인 항목을 서로 바꿔서 암기하기 쉽다 — "경계"는 지적도, "소유자"는 토지대장에서 확인한다.',
    sources: [
      { label: '공인중개사법 시행규칙 별지 서식', note: '중개대상물 확인·설명서 작성 근거자료', href: 'https://www.law.go.kr/법령/공인중개사법시행규칙' },
    ],
  },
  'aggregate-building-liability': {
    kind: 'common-area-defect-presumption', summary: '지하실처럼 구조상 여러 세대가 함께 쓰는 공간은 전유부분이 될 수 없고, 하자 발생 시 책임 소재가 불명확하면 일단 공용부분의 하자로 추정한다.',
    exclusive: { label: '전유부분', desc: '독립하여 구분소유권의 목적이 될 수 있는 건물부분' },
    common: { label: '공용부분', desc: '아파트 지하실 등 구조상 여러 세대가 공유 — 별도 구분소유 불가' },
    presumption: '건물의 설치·보존상의 흠으로 손해가 발생하면 그 흠은 공용부분에 존재하는 것으로 추정된다.',
    caution: '아파트 지하실을 특정 세대의 전유부분으로 등기할 수 있다고 착각하기 쉽다 — 원칙적으로 구조상 공용부분이라 불가능하다.',
    sources: [
      { label: '집합건물의 소유 및 관리에 관한 법률 제2조', note: '전유부분·공용부분의 정의', href: 'https://www.law.go.kr/법령/집합건물의소유및관리에관한법률/제2조' },
    ],
  },
  'funeral-act-grave-area': {
    kind: 'grave-area-limit-dial', summary: '묘지 면적 상한은 묘지 유형별로 정해져 있고, 개인묘지의 "30㎡"가 가장 헷갈리는 숫자다.',
    limits: [
      { type: '개인묘지', area: '30㎡ 이하', note: '"20㎡"로 잘못 암기하기 쉬움' },
      { type: '가족묘지', area: '가족당 1개소 · 100㎡ 이하', note: '' },
      { type: '공설·종중·법인묘지 내 분묘 1기', area: '10㎡ 이하(합장 15㎡ 이하)', note: '' },
    ],
    caution: '개인묘지의 면적 상한을 "20㎡"로 잘못 암기하기 쉽다 — 정확히는 "30㎡"다.',
    sources: [
      { label: '장사 등에 관한 법률 제14조', note: '개인묘지·가족묘지 등의 설치기준', href: 'https://www.law.go.kr/법령/장사등에관한법률/제14조' },
      { label: '장사 등에 관한 법률 시행령 별표2', note: '분묘 1기당 점유면적 기준', href: 'https://www.law.go.kr/법령/장사등에관한법률시행령' },
    ],
  },
  'hlpa-renewal-and-registration': {
    kind: 'renewal-notice-registration-gate', summary: '계약갱신요구권은 기간이 끝나기 6개월~2개월 전 사이에만 행사할 수 있고, 임차권등기명령은 이사를 나가도 이미 얻은 권리를 붙잡아 두는 장치다.',
    window: { label: '갱신요구·묵시적 갱신 통지 가능 기간', from: '기간 만료 전 6개월', to: '기간 만료 전 2개월', note: '1회에 한해 행사 가능' },
    terminate: '갱신된 계약에서 임차인은 언제든지 해지통지 가능 — 임대인이 통지받은 날부터 3개월 경과 시 효력 발생',
    registration: '임차권등기명령에 따라 등기를 마치면, 이후 대항요건을 상실해도 이미 취득한 대항력·우선변제권을 잃지 않는다.',
    caution: '갱신요구권 행사로 갱신되면 임대인이 차임을 증액할 수 없다고 착각하기 쉽다 — 실제로는 법정 한도 내에서 증액청구가 가능하다.',
    sources: [
      { label: '주택임대차보호법 제6조의3', note: '계약갱신 요구 등', href: 'https://www.law.go.kr/법령/주택임대차보호법/제6조의3' },
      { label: '주택임대차보호법 제6조의2', note: '묵시적 갱신의 경우 계약의 해지', href: 'https://www.law.go.kr/법령/주택임대차보호법/제6조의2' },
      { label: '주택임대차보호법 제3조의3', note: '임차권등기명령', href: 'https://www.law.go.kr/법령/주택임대차보호법/제3조의3' },
    ],
  },
  'transaction-contract-document': {
    kind: 'contract-document-checklist', summary: '거래계약서는 서명과 날인을 모두 갖춰야 하고, 5년간 보존해야 하며, 이중 작성 시에는 업무정지가 아니라 등록취소 대상이다.',
    checklist: [
      { item: '서명 및 날인', rule: '서명 또는 날인 중 하나만으로는 부족 — 반드시 둘 다' },
      { item: '보존기간', rule: '원본·사본·전자문서 5년간 보존(공인전자문서센터 보관 시 예외)' },
      { item: '표준서식 사용', rule: '국토교통부장관이 권장할 수 있을 뿐 강제 아님 — 미사용도 제재사유 아님' },
      { item: '이중 거래계약서 작성', rule: '등록관청이 개설등록을 취소해야 함(업무정지 아님)' },
    ],
    caution: '거래계약서에 서명 또는 날인 중 하나만 하면 된다고 착각하기 쉽지만, 실제로는 서명과 날인을 모두 해야 한다.',
    sources: [
      { label: '공인중개사법 제26조', note: '거래계약서의 작성 등', href: 'https://www.law.go.kr/법령/공인중개사법/제26조' },
      { label: '공인중개사법 시행령 제22조', note: '거래계약서 서명 및 날인, 보존기간', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제22조' },
    ],
  },
  'subject-matter-case-law-qualification': {
    kind: 'brokerage-subject-matter-case-filter', summary: '판례는 "특정된 물건이나 그에 대한 구체적 권리인가"를 기준으로 중개대상물 해당 여부를 가른다.',
    included: [
      { case: '동·호수가 특정되어 분양계약이 체결된 아파트분양권', reason: '특정 물건에 대한 구체적 권리' },
      { case: '기둥·지붕·주벽을 갖춘 신축 중인 미등기 건물', reason: '건물로서의 실체를 갖춤' },
      { case: '「입목에 관한 법률」상 입목', reason: '별도 등기 가능한 독립된 물건' },
    ],
    excluded: [
      { case: '아파트 입주권(분양예정자로 선정될 지위)', reason: '추첨을 거쳐야 확정되는 지위일 뿐' },
      { case: '대토권(이주자택지 공급받을 지위)', reason: '특정 물건에 관한 권리로 미확정' },
      { case: '피담보채권, 권리금(영업상 이점)', reason: '물건과 분리된 무형의 재산적 가치' },
    ],
    caution: '분양권과 입주권을 모두 중개대상물로 착각하기 쉽지만, 이미 동·호수가 특정된 분양권과 달리 추첨으로 선정되는 지위인 입주권은 중개대상물이 아니다.',
    sources: [
      { label: '대법원 2005다37088 판결', note: '아파트 입주권의 중개대상물 해당 여부', href: 'https://casenote.kr/대법원/2005다37088' },
    ],
  },
  'office-posting-requirements': {
    kind: 'office-posting-checklist', summary: '사무소 게시의무는 의뢰인이 그 자리에서 자격·등록을 확인할 수 있게 하려는 취지이며, 위반 시 벌칙 수준을 정확히 구분해야 한다.',
    postings: ['중개사무소등록증 원본', '공인중개사자격증 원본(소속공인중개사가 있으면 그 자격증도)', '사업자등록증', '보증 설정 증명서류', '중개보수·실비의 요율 및 한도액표', '분사무소는 분사무소설치신고확인서 원본'],
    penalty: { violation: '개업공인중개사가 아닌 자의 "부동산중개" 명칭 사용', rule: '1년 이하의 징역 또는 1천만원 이하의 벌금 — 3년/3천만원이 아님' },
    caution: '부동산중개 명칭을 무단 사용한 자의 벌칙을 3년 이하 징역·3천만원 이하 벌금으로 착각하기 쉽지만, 실제로는 1년 이하의 징역 또는 1천만원 이하의 벌금이다.',
    sources: [
      { label: '공인중개사법 제17조', note: '중개사무소의 게시의무', href: 'https://www.law.go.kr/법령/공인중개사법/제17조' },
      { label: '공인중개사법 제49조', note: '유사명칭 사용 등에 대한 벌칙', href: 'https://www.law.go.kr/법령/공인중개사법/제49조' },
    ],
  },
  'posting-obligation': {
    kind: 'posting-obligation-include-exclude', summary: '게시의무는 실제 자격을 증명하는 핵심 서류만 대상으로 하며, 교육 이수를 증명하는 부수적 서류는 제외된다.',
    include: ['중개사무소등록증', '공인중개사자격증(대표자 및 고용된 소속공인중개사 모두)', '손해배상책임보장 증명서류', '중개보수·실비 요율 및 한도액표'],
    exclude: ['실무교육 수료확인증'],
    caution: '실무교육 수료확인증도 게시 대상이라고 착각하기 쉽다 — 게시의무 대상 목록에 포함되지 않는다.',
    sources: [
      { label: '공인중개사법 제17조', note: '중개사무소의 게시의무', href: 'https://www.law.go.kr/법령/공인중개사법/제17조' },
    ],
  },
  'branch-office-registration': {
    kind: 'branch-registration-form-fields', summary: '사무소 확보 요건은 "소유"가 아니라 "사용할 수 있는 권리"만 있으면 충분하고, 분사무소 신고서는 본사와의 연결관계를 기재하도록 한다.',
    notRequired: '중개사무소로 개설등록할 건물의 소유권을 반드시 확보할 필요는 없다 — 임차 등 사용권만 있어도 된다.',
    fields: ['본사(주된 사무소)의 명칭', '분사무소의 소재지', '분사무소 책임자의 성명·주소'],
    extra: '분사무소를 설치하려면 책임자가 실무교육을 이수해야 한다는 요건도 함께 충족해야 한다.',
    caution: '중개사무소 개설을 위해 건물 소유권까지 확보해야 한다고 착각하기 쉽다 — 사용권만 있으면 충분하다.',
    sources: [
      { label: '공인중개사법 시행령 제13조', note: '분사무소 설치신고 등', href: 'https://www.law.go.kr/법령/공인중개사법시행령/제13조' },
    ],
  },
  'real-estate-information-network': {
    kind: 'info-network-designation-flow', summary: '부동산거래정보망은 아무나 운영할 수 없고, 국토교통부장관의 지정과 법정 요건 충족을 거쳐야 한다.',
    flow: ['설치·운영 희망자가 지정 신청', '가입 개업공인중개사 수·자본금 등 법정 요건 충족 확인', '국토교통부장관의 지정', '지정 후 가입 개업공인중개사가 제공한 정보만 공개'],
    caution: '지정 요건의 숫자(가입자 수, 자본금 등)를 다른 제도의 기준과 혼동하기 쉬우므로 정확히 구분해 암기해야 한다.',
    sources: [
      { label: '공인중개사법 제24조', note: '부동산거래정보망의 지정 및 이용', href: 'https://www.law.go.kr/법령/공인중개사법/제24조' },
    ],
  },
  'market-order-disturbance': {
    kind: 'market-disturbance-report-flow', summary: '거래질서교란행위는 기존 개별 금지행위·벌칙만으로 포섭하기 어려운 새로운 유형의 시장교란 행위를 별도로 묶어 규율하는 범주다.',
    example: '공인중개사자격증의 양도·대여를 알선한 행위',
    flow: ['거래질서교란행위 발생', '부동산거래질서교란행위 신고센터에 신고', '신고센터가 조사', '국토교통부장관 등에게 통보'],
    caution: '거래질서교란행위를 단순 금지행위와 동일시하기 쉽다 — 별도의 신고·처리 체계(신고센터)를 가진 범주라는 점을 기억해야 한다.',
    sources: [
      { label: '공인중개사법 제47조의2', note: '부동산거래질서교란행위 신고센터의 설치·운영', href: 'https://www.law.go.kr/법령/공인중개사법/제47조의2' },
    ],
  },
  'ksic-real-estate-business-classification': {
    kind: 'ksic-industry-branch-map', summary: '부동산업은 "내가 직접 임대·공급하는가"와 "남의 부동산을 관리·중개·평가해주는가"로 먼저 나눈 뒤 후자를 세분한다.',
    branches: [
      { name: '부동산 임대 및 공급업', subs: ['부동산 임대업', '부동산 개발 및 공급업'], isService: false },
      { name: '부동산 관련 서비스업', subs: ['부동산 관리업(주거용·비주거용)', '부동산 중개 및 대리업', '부동산 투자 자문업', '부동산 감정평가업'], isService: true },
    ],
    excluded: ['부동산 개발 및 공급업(임대·공급업 계열)', '사업시설 유지·관리(청소·경비 등 시설관리 용역)', '부동산 분양 대행업'],
    caution: '부동산 개발 및 공급업을 부동산 "관련 서비스업"으로 착각하기 쉽지만, 이는 부동산 임대 및 공급업 계열에 속해 서비스업 분류에는 포함되지 않는다.',
    sources: [
      { label: '통계청 한국표준산업분류(KSIC)', note: '부동산업(L68) 세분류', href: 'https://kssc.kostat.go.kr' },
    ],
  },
  'demand-supply-equilibrium-calculation': {
    kind: 'equilibrium-calc-steps', summary: '수요·공급 계산 문제는 결국 유형부터 분류하는 게 먼저다 — 수평합인지, 수입극대화인지, 초과수요 계산인지.',
    types: [
      { name: '시장수요함수(수평합)', method: '개별수요함수를 각각 Q에 대해 정리한 뒤 더한다(P 기준으로 더하면 오답)' },
      { name: '분양수입 극대화 가격', method: 'TR=P×Qd가 최대가 되는 지점(한계수입=0) — 수요의 가격탄력성이 1이 되는 지점과 동일' },
      { name: '초과수요량 계산', method: '규제가격을 수요함수·공급함수에 각각 대입 → 수요량-공급량 = 초과수요량' },
    ],
    caution: '개별수요함수를 수평합할 때 가격(P) 기준으로 그대로 더하는 실수를 하기 쉽지만, 반드시 수량(Q)에 대해 정리한 뒤 더해야 한다.',
    sources: [
      { label: '부동산학개론 수요공급이론', note: '시장수요함수 도출과 균형 계산', href: 'https://www.law.go.kr' },
    ],
  },
  'elasticity-theory': {
    kind: 'elasticity-revenue-scale', summary: '완전탄력적·완전비탄력적의 정의와, 비탄력적 구간에서 가격 인상 시 총수입이 늘어난다는 규칙만 정확히 알아두면 된다.',
    extremes: [
      { name: '완전탄력적 수요', desc: '가격이 조금만 변해도 수요량이 무한히 변함 — 수요곡선이 수평선' },
      { name: '완전비탄력적 수요', desc: '가격이 변해도 수요량이 전혀 변하지 않음 — 수요곡선이 수직선' },
    ],
    revenue: { elastic: '탄력성 > 1: 가격 인상 시 총수입 감소', inelastic: '탄력성 < 1: 가격 인상 시 총수입 증가' },
    caution: '완전탄력적과 완전비탄력적의 정의를 서로 바꿔 기억하기 쉽다 — 완전탄력적은 "수요량이 무한히 변함", 완전비탄력적은 "수요량이 고정됨"이다.',
    sources: [
      { label: '부동산학개론 탄력성이론', note: '가격탄력성과 총수입의 관계', href: 'https://www.law.go.kr' },
    ],
  },
  'financial-regulation-classification': {
    kind: 'regulation-type-sorter', summary: '금융규제인지 판별할 때는 "돈을 빌리고 갚는 조건"을 직접 건드리는가만 확인하면 된다.',
    financial: ['담보인정비율(LTV) 강화', '총부채원리금상환비율(DSR) 강화'],
    notFinancial: ['양도소득세 강화(조세정책)', '개발부담금 부담률 인상(조세정책)', '토지거래허가제(이용·거래 규제)', '개발제한구역·택지개발지구 지정(이용규제)', '분양가상한제 적용 지역 확대(가격규제)', '개발권양도제(TDR) 시행(이용규제)'],
    caution: '토지거래허가제나 분양가상한제처럼 시장에 강하게 개입하는 정책을 금융규제로 착각하기 쉽지만, 이들은 대출조건을 건드리지 않으므로 금융규제가 아니다.',
    sources: [
      { label: '부동산학개론 부동산정책론', note: '금융규제·조세규제·이용규제의 구분', href: 'https://www.law.go.kr' },
    ],
  },
  'informational-value-calculation': {
    kind: 'info-value-formula-panel', summary: '정보의 가치는 "불확실성을 없애주면 얼마나 이득인가"로 측정된다 — 확실한 현재가치에서 기댓값의 현재가치를 뺀 차액.',
    formula: '정보의 현재가치 = (확실할 때 가격의 현재가치) − (불확실성 반영 기댓값의 현재가치)',
    expectedValue: '기댓값 = 개발 시 가격×개발확률 + 미개발 시 가격×(1−개발확률)',
    meaning: '정보의 현재가치는 불확실성을 제거해주는 대가로 투자자가 지불할 용의가 있는 최대금액을 의미한다.',
    caution: '정보의 현재가치를 단순히 "개발 시 가격의 현재가치"로 착각하기 쉽지만, 실제로는 확실한 경우의 현재가치에서 불확실한 기댓값의 현재가치를 뺀 차액이다.',
    sources: [
      { label: '부동산학개론 투자론', note: '정보의 가치와 불확실성 하의 의사결정', href: 'https://www.law.go.kr' },
    ],
  },
  'asset-securitization-law-and-pf': {
    kind: 'securitization-structure-board', summary: '유동화 절차는 "자산을 누구에게, 어떻게 넘기는가"와 "그 유동화가 어느 법에 근거하는가"라는 두 축으로 정리된다.',
    structure: [
      { item: '유동화전문회사(SPC) 형태', rule: '유한회사(주식회사 아님)' },
      { item: '유동화자산 양도방식', rule: '매매 또는 교환 — 양도인(자산보유자)은 반환청구권을 갖지 않음' },
      { item: 'PF대출 유동화 근거', rule: '자산유동화법뿐 아니라 상법상 방법(ABCP 등)으로도 가능' },
      { item: 'ABCP 반복 유동화 등록기관', rule: '금융위원회(금융감독원 아님)' },
    ],
    caution: 'ABCP의 반복적 유동화 등록기관을 금융감독원으로 착각하기 쉽지만, 실제 등록기관은 금융위원회다.',
    sources: [
      { label: '자산유동화에 관한 법률 제3조·제17조', note: '유동화전문회사의 형태와 자산유동화계획 등록', href: 'https://www.law.go.kr/법령/자산유동화에관한법률' },
    ],
  },
  'association-business-report': {
    kind: 'association-report-obligation-flow', summary: '협회는 총회 의결내용을 지체 없이 보고하고, 등록관청은 등록증 교부 사실을 협회에 통보하는 상호 정보공유 구조를 갖춘다.',
    flows: [
      { from: '공인중개사협회', to: '국토교통부장관', action: '총회 의결내용을 지체 없이 보고' },
      { from: '등록관청', to: '협회', action: '중개사무소등록증을 교부한 때 통보' },
    ],
    extra: '협회는 회원인 개업공인중개사의 지도·관리 업무도 수행한다.',
    caution: '총회 의결내용 보고를 임의사항으로 착각하기 쉽다 — "지체 없이" 보고해야 하는 의무사항이다.',
    sources: [
      { label: '공인중개사법 제41조', note: '공인중개사협회의 설립과 업무', href: 'https://www.law.go.kr/법령/공인중개사법/제41조' },
    ],
  },
  'transaction-report-reward': {
    kind: 'reward-eligibility-filter', summary: '거래신고법상 신고포상금은 근거 법률·지급대상 행위가 공인중개사법상 포상금과 다르다.',
    eligible: ['실제 거래가격을 거짓으로 신고하는 행위', '토지거래허가를 받은 목적대로 이용하지 않는 행위'],
    excluded: ['거짓 신고를 하지 않도록 요구하거나 조장하는 행위 자체', '위반행위에 관여한 자 본인의 신고', '가명 신고로 신고인을 확인할 수 없는 경우'],
    procedure: '신고관청·허가관청으로부터 지급결정을 통보받은 신고인이 국토교통부령이 정한 지급신청서를 제출해야 지급받을 수 있다.',
    caution: '이 신고포상금 제도를 공인중개사법상 포상금(1건당 50만원)과 같은 제도로 착각하기 쉽지만, 근거 법률과 지급대상 행위가 서로 다르다.',
    sources: [
      { label: '부동산거래신고법 제25조의2', note: '신고포상금의 지급', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제25조의2' },
    ],
  },
  'information-network-revocation-and-center': {
    kind: 'network-revocation-grounds-board', summary: '거래정보사업자 지정취소 사유는 "약속을 어겼는가"로 정리하고, 신고센터의 위탁기관을 정확히 암기해야 한다.',
    grounds: ['정당한 사유 없이 지정일로부터 1년 이내(6개월 아님) 부동산거래정보망 미설치', '운영규정 승인 없이 운영하거나 운영규정 위반', '의뢰받지 않은 정보를 공개', '거래정보사업자(개인)의 사망'],
    center: '부동산거래질서교란행위 신고센터의 업무는 한국산업인력공단이 아니라 한국부동산원에 위탁한다.',
    caution: '신고센터 업무의 위탁기관을 한국산업인력공단으로 착각하기 쉽지만, 실제 위탁기관은 한국부동산원이다.',
    sources: [
      { label: '공인중개사법 제24조', note: '거래정보사업자의 지정취소', href: 'https://www.law.go.kr/법령/공인중개사법/제24조' },
      { label: '공인중개사법 제47조의2', note: '부동산거래질서교란행위 신고센터의 설치·운영', href: 'https://www.law.go.kr/법령/공인중개사법/제47조의2' },
    ],
  },
  'transaction-report-target': {
    kind: 'report-target-contract-filter', summary: '신고대상 여부는 "매매·공급으로 소유권이 유상으로 이전되는가"를 기준으로 판단한다.',
    included: ['부동산 매매계약', '건축물의 분양에 관한 법률·도시개발법·주택법·도시정비법 등에 따른 부동산 공급계약', '공급받는 자로 선정된 지위(분양권·입주권)의 매매계약'],
    excluded: ['임대차계약(택지개발촉진법에 따라 공급된 토지의 임대차 포함)', '증여계약'],
    caution: '택지개발촉진법에 따라 공급된 토지의 "임대차"계약을 매매계약과 혼동해 신고대상으로 착각하기 쉽지만, 임대차는 신고 대상이 아니다.',
    sources: [
      { label: '부동산거래신고법 제3조', note: '부동산 거래의 신고', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제3조' },
    ],
  },
  'transaction-report-additional-items': {
    kind: 'fund-plan-threshold-gate', summary: '자금조달·입주계획서는 투기과열지구는 금액과 무관하게, 그 밖의 지역은 일정 금액 이상만 요구된다는 기준선이 핵심이다.',
    gates: [
      { zone: '투기과열지구', rule: '거래가격과 무관하게 전부 제출 대상(증빙서류 첨부 포함)' },
      { zone: '조정대상지역', rule: '거래가격과 무관하게 전부 제출 대상' },
      { zone: '그 밖의 지역(비규제지역)', rule: '실제 거래가격 6억원 이상인 주택만 제출 대상' },
    ],
    who: '매수인이 단독으로 작성·제출 — 매도인·매수인 공동 작성이 아니다.',
    caution: '자금조달·입주계획서를 매도인·매수인이 공동으로 서명·날인해 제출한다고 착각하기 쉽지만, 실제로는 매수인이 단독으로 작성·제출한다.',
    sources: [
      { label: '부동산거래신고법 시행령 별표1', note: '자금조달·입주계획서 제출대상 기준', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률시행령' },
    ],
  },
  'land-use-violation-remedies-and-exceptions': {
    kind: 'use-violation-remedy-exception-board', summary: '이용의무 위반 대응은 "벌준다"와 "국가가 사간다"는 두 갈래로 나뉘고, 예외적 임대는 실제 이용자의 일부 임대에 한정된다.',
    remedies: ['토지거래계약허가 취소', '3개월 이내 기간을 정한 문서에 의한 이행명령', '국가·지자체·LH 등을 매수자로 지정한 협의매수', '이행강제금(이행명령 이행 시까지 반복 부과, 의무기간 경과 후엔 불가)'],
    notIncluded: '과태료 부과는 이용의무 위반 조치에 포함되지 않는다.',
    exception: { allowed: '제1종·제2종 근린생활시설, 공장, 다세대주택 등을 실제로 이용하는 자의 일부 임대', notAllowed: '다중주택의 일부 임대는 예외에 해당하지 않는다' },
    caution: '이용의무 위반에 대한 조치로 과태료 부과를 떠올리기 쉽지만, 실제 조치 수단은 이행명령·이행강제금·허가취소·협의매수이며 과태료는 포함되지 않는다.',
    sources: [
      { label: '부동산거래신고법 제18조·제17조', note: '이용의무 위반에 대한 조치와 이행강제금', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률/제18조' },
    ],
  },
  'mbs-market-effects-and-pricing': {
    kind: 'mbs-duration-price-scale', summary: 'MBS 가격도 일반 채권과 같은 원리를 따른다 — 수익률 상승=가격 하락, duration이 길수록 민감도 증가.',
    marketEffect: 'MBS 등 주택금융 확대 → 대출기관 유동성 증가 → 주택자금대출·주택건설 촉진 → 자가소유가구 비중 증가',
    priceRule: [
      { factor: '채권시장 수익률 상승', effect: 'MBS 가격 하락' },
      { factor: '동일 위험수준 다른 투자수단 수익률 상승', effect: 'MBS 상대적 매력 하락 → 가격 하락' },
      { factor: 'duration(가중평균상환기간)이 길수록', effect: '수익률 변동에 따른 가격변동폭이 더 큼' },
    ],
    caution: 'duration이 긴 채권일수록 가격변동폭이 작다고 착각하기 쉽지만, 실제로는 duration이 길수록 금리변동에 더 민감해 가격변동폭이 크다.',
    sources: [
      { label: '부동산학개론 부동산금융론', note: 'MBS 가격결정과 duration의 관계', href: 'https://www.law.go.kr' },
    ],
  },
  'project-financing': {
    kind: 'pf-nonrecourse-trust-board', summary: '프로젝트 금융의 핵심은 "이 사업 하나만 놓고 돈을 빌려주고, 실패해도 사업주의 다른 재산까지 손댈 수 없다"는 위험분리 구조다.',
    structure: { collateral: '미래 현금흐름 + 사업자산', recourse: '상환재원은 프로젝트 현금흐름에 한정(비소구·제한소구 금융) — 사업주의 전체 자산이 아님' },
    trustParties: ['위탁자(소유자)', '수탁자(신탁사)', '수익자'],
    caution: '프로젝트 금융의 상환재원이 사업주의 전체 자산이라고 착각하기 쉽다 — 정확히는 해당 프로젝트의 현금흐름에 한정된다.',
    sources: [
      { label: '부동산학개론 부동산금융론', note: '프로젝트 파이낸싱의 비소구성', href: 'https://www.law.go.kr' },
    ],
  },
  'financing-instrument-classification': {
    kind: 'financing-type-sorter', summary: '자금조달 방식은 "자기 것(지분)을 내주고 돈을 받는지, 빚(부채)을 지는지"라는 큰 축으로 나뉜다.',
    equity: ['REITs(주식·지분 발행)', '조인트벤처(지분 참여)'],
    debt: ['주택저당대출(담보부 대출)', '채권 발행'],
    caution: '조인트벤처를 부채금융으로 착각하기 쉽다 — 지분 참여 방식이므로 지분금융으로 분류된다.',
    sources: [
      { label: '부동산학개론 부동산금융론', note: '지분금융·부채금융·메자닌금융의 구분', href: 'https://www.law.go.kr' },
    ],
  },
  'development-risk-feasibility': {
    kind: 'wofford-risk-triad', summary: '개발사업의 위험은 "법이 허락하는가", "팔릴 것인가", "예산 안에서 지어지는가"라는 세 질문으로 구조화된다.',
    risks: [
      { name: '법률위험', example: '인허가 지연으로 착공이 늦어짐' },
      { name: '시장위험', example: '분양이 저조함' },
      { name: '비용위험', example: '자재비 급등으로 공사비 초과' },
    ],
    definition: '부동산개발업(부동산개발업법)은 "타인에게 공급할 목적"으로 개발을 수행하는 업으로 정의된다 — 자기 사용 목적의 개발과 구별.',
    extra: '공사기간이 늘어나면 금융비용·관리비 증가로 사업성에 부정적 영향을 미친다.',
    caution: '공사기간 연장을 사업성에 긍정적 요인으로 착각하기 쉽다 — 금융비용·관리비 증가로 부정적 요인이 된다.',
    sources: [
      { label: '부동산학개론 부동산개발론', note: '워포드의 개발위험 3분류', href: 'https://www.law.go.kr' },
    ],
  },
  'redevelopment-project-methods': {
    kind: 'redevelopment-type-matrix', summary: '정비사업 유형은 "정비기반시설의 상태"와 "대상지역"이라는 두 축으로 구분하면 경계가 명확해진다.',
    types: [
      { name: '주거환경개선사업', infra: '극히 열악', area: '저소득 밀집지역 또는 단독·다세대주택 밀집지역' },
      { name: '재개발사업', infra: '열악', area: '노후·불량건축물 밀집지역 또는 상업·공업지역(도시기능 회복·상권활성화)' },
      { name: '재건축사업', infra: '양호', area: '노후·불량 공동주택 밀집지역' },
    ],
    caution: '주거환경개선사업과 재개발사업을 혼동하기 쉽지만, 주거환경개선사업은 정비기반시설이 "극히" 열악한 저소득 밀집지역을, 재개발사업은 그보다 넓은 범위(상업·공업지역 포함)의 도시기능 회복을 대상으로 한다.',
    sources: [
      { label: '도시 및 주거환경정비법 제2조', note: '정비사업의 정의와 종류', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제2조' },
    ],
  },
  'land-acquisition-and-joint-development-methods': {
    kind: 'land-acquisition-method-scale', summary: '환지방식은 "땅을 그대로 두고 모양만 바꿔 돌려준다", 수용방식은 "아예 사들인 뒤 다시 판다"는 차이다.',
    methods: [
      { name: '환지방식', desc: '보류지(체비지·공공시설용지) 제외한 개발토지를 종전 소유자에게 재배분', trait: '사업비 부담·매각부담 작음, 개발이익이 종전 소유자에게 귀속, 동의 절차 많아 더 복잡함' },
      { name: '수용방식', desc: '사업시행자가 토지를 매수·수용', trait: '대토(代土) 수요로 구역 밖 지가 상승 가능성이 환지방식보다 큼' },
    ],
    jointVenture: ['사업위탁(수탁)방식 — 토지소유자가 소유권 유지, 개발업자에게 수수료 지급', '신탁개발방식 — 신탁회사가 소유권을 이전받아 사업주체가 됨'],
    caution: '환지방식이 수용방식보다 절차가 더 간단하다고 착각하기 쉽지만, 실제로는 토지소유자 동의 절차가 더 많아 절차가 더 복잡하다.',
    sources: [
      { label: '부동산학개론 부동산개발론', note: '토지취득방식(환지·수용)과 지주공동사업 방식', href: 'https://www.law.go.kr' },
    ],
  },
  '4p-marketing-mix-components': {
    kind: 'marketing-4p-sorter', summary: '4P는 "무엇을·얼마에·어디서·어떻게 팔지"라는 네 질문에 대응한다 — 그 밖의 P는 다른 전략에 속한다.',
    included: [
      { p: 'Product(제품)', example: '커뮤니티 시설(실개천·헬스장 등) 설치' },
      { p: 'Price(가격)', example: '분양가 책정' },
      { p: 'Place(유통경로)', example: '중개업소 활용' },
      { p: 'Promotion(판매촉진)', example: '경품추첨' },
    ],
    excluded: ['포지셔닝(Positioning) — STP전략', '동반자관계(Partnership) — 관계마케팅', '긍지(Pride)', '홍보(PR)'],
    caution: '포지셔닝을 4P의 구성요소로 착각하기 쉽지만, 포지셔닝은 STP전략의 한 단계이지 4P Mix의 구성요소가 아니다.',
    sources: [
      { label: '부동산학개론 부동산마케팅론', note: '4P 마케팅믹스의 구성요소', href: 'https://www.law.go.kr' },
    ],
  },
  'appraisal-procedure': {
    kind: 'appraisal-procedure-flow', summary: '감정평가 절차는 의뢰를 받은 이후 수행하는 업무 흐름이므로, 의뢰 자체는 절차에 포함되지 않는다.',
    steps: ['기본적 사항의 확정', '처리계획 수립', '대상물건 확인', '자료수집 및 정리', '자료검토 및 가치형성요인의 분석', '감정평가방법의 선정 및 적용', '감정평가액의 결정 및 표시'],
    excluded: '"감정평가 의뢰"는 의뢰인이 하는 행위이지, 감정평가사가 수행하는 절차(규칙 제8조)에 포함되지 않는다.',
    caution: '"감정평가 의뢰"를 절차의 첫 단계로 포함시키는 실수를 하기 쉽다 — 의뢰는 절차 이전에 의뢰인이 하는 별개의 행위다.',
    sources: [
      { label: '감정평가에 관한 규칙 제8조', note: '감정평가의 절차', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제8조' },
    ],
  },
  'regional-individual-analysis': {
    kind: 'regional-individual-principle-board', summary: '지역분석은 "숲(지역 전체 수준)"을, 개별분석은 "나무(개별 부동산의 적합성)"를 보는 단계다.',
    regional: '해당 지역의 표준적 이용과 가격 수준을 파악하는 절차',
    principles: [
      { name: '균형(기여)의 원칙', scope: '부동산 내부 구성요소 간 조화', example: '과도하게 고급스러운 욕실 설치로 오히려 선호도 저하' },
      { name: '적합의 원칙', scope: '부동산과 주변 환경 간 조화', example: '주변 환경·지역 특성에 맞는 이용 여부' },
    ],
    caution: '균형의 원칙과 적합의 원칙을 혼동하기 쉽다 — 균형은 "부동산 내부 구성요소 간" 조화, 적합은 "부동산과 주변 환경 간" 조화를 다룬다.',
    sources: [
      { label: '부동산학개론 감정평가론', note: '지역분석·개별분석과 가격제원칙', href: 'https://www.law.go.kr' },
    ],
  },
  'three-appraisal-approaches-reconciliation': {
    kind: 'three-approach-reconciliation-panel', summary: '시산가액 조정은 세 방식의 값을 그냥 평균 내는 게 아니라, 특성에 맞게 가중치를 달리 부여해 하나의 결론으로 수렴시키는 작업이다.',
    approaches: [
      { name: '원가방식', basis: '비용성' },
      { name: '비교방식', basis: '시장성' },
      { name: '수익방식', basis: '수익성' },
    ],
    reconciliation: '각 방식의 시산가액을 상호 관련시켜 재검토 → 산술평균 또는 가중치 부여 등 다양한 방법으로 격차를 합리적으로 조정 → 최종 감정평가액 결정',
    example: '비교방식 1.2억(가중치 50%) + 원가방식 1.1억(가중치 20%) + 수익방식 1.0억(가중치 30%) = 1.2×0.5+1.1×0.2+1.0×0.3 = 1.12억원',
    caution: '시산가액 조정은 단순 산술평균만 허용된다고 착각하기 쉽지만, 가중치를 부여하는 방법 등 다양한 조정 방법이 인정된다.',
    sources: [
      { label: '감정평가에 관한 규칙', note: '시산가액 조정', href: 'https://www.law.go.kr/법령/감정평가에관한규칙' },
    ],
  },
  'appraisal-approach-principles-and-rent-formulas': {
    kind: 'rent-formula-triad', summary: '임대료 평가의 세 공식은 "비용에서 출발하는가·사례에서 출발하는가·수익에서 출발하는가"라는 차이일 뿐이다.',
    formulas: [
      { name: '적산임료(원가방식·적산법)', formula: '기초가액 × 기대이율 + 필요제경비' },
      { name: '비준임료(비교방식·임대사례비교법)', formula: '임대사례 임대료 × 사정보정치 × 시점수정치 × 지역요인비교치 × 개별요인비교치' },
      { name: '수익임료(수익방식·수익분석법)', formula: '순수익 + 필요제경비' },
    ],
    extra: '공시지가기준법은 사정보정이 아니라 시점수정·지역요인 및 개별요인 비교·그 밖의 요인 보정 과정을 거친다.',
    caution: '적산법의 공식에서 "기대이율"을 "환원이율"로 착각하기 쉽지만, 적산임료 계산에는 기대이율을 곱한다(환원이율은 수익환원법에서 쓰인다).',
    sources: [
      { label: '감정평가에 관한 규칙 제2조·제11조', note: '감정평가 3방식과 임대료 산정', href: 'https://www.law.go.kr/법령/감정평가에관한규칙' },
    ],
  },
  'depreciation-methods-and-reproduction-cost': {
    kind: 'depreciation-reproduction-board', summary: '감가수정 방법은 "무엇을 기준으로 낡음을 계산하는가"로 나뉘고, 재조달원가는 "지금 다시 짓는 데 드는 모든 비용"을 빠짐없이 담는다.',
    depreciation: [
      { name: '내용연수법', subs: '정액법·정률법·상환기금법' },
      { name: '관찰감가법', subs: '' },
      { name: '분해법', subs: '' },
    ],
    note: '감가수정의 내용연수는 물리적 내용연수가 아니라 경제적 내용연수다. 정률법은 감가율은 일정해도 대상(잔존가액)이 매년 줄어 감가액 자체는 매년 감소한다.',
    reproductionCost: '대상물건을 기준시점에 재생산·재취득하는 데 필요한 적정원가 총액(제세공과금·수급인의 적정이윤 포함) — 총량조사법·구성단위법·비용지수법으로 산정, 직접법·간접법 병용 가능',
    caution: '정률법에서 매년 감가액이 일정하다고 착각하기 쉽지만, 감가율은 일정해도 그 대상(잔존가액)이 매년 줄어들어 감가액 자체는 매년 감소한다.',
    sources: [
      { label: '감정평가에 관한 규칙 제2조', note: '감가수정과 재조달원가의 정의', href: 'https://www.law.go.kr/법령/감정평가에관한규칙/제2조' },
    ],
  },
  'types-of-real-right-change': {
    kind: 'right-acquisition-type-tree', summary: '소유권이 통째로 넘어가는지(이전적) 아니면 그 위에 새 제한물권이 얹히는지(설정적)로 구분하면 저당권 설정과 소유권 양도를 헷갈리지 않는다.',
    tree: [
      { branch: '원시취득', desc: '무주물 선점, 점유취득시효 완성 등 — 앞사람 권리의 제한을 승계하지 않음' },
      { branch: '승계취득 — 이전적 승계', desc: '기존 권리가 그대로 옮겨감(예: 부동산 매매로 인한 특정승계)' },
      { branch: '승계취득 — 설정적 승계', desc: '기존 권리 위에 새로운 권리가 생김(예: 저당권 설정)' },
    ],
    caution: '저당권 설정을 "이전적 승계"로 잘못 분류하기 쉽다 — 소유권 자체는 그대로 있고 그 위에 제한물권만 새로 생기는 것이므로 "설정적 승계"다.',
    sources: [
      { label: '민법총칙 권리변동론', note: '원시취득·승계취득의 구분', href: 'https://www.law.go.kr' },
    ],
  },
  'metropolitan-planning-zone-facility': {
    kind: 'metro-zone-designator-board', summary: '광역계획권 지정권자는 "범위"에 따라 국토교통부장관과 도지사로 나뉘며, 광역시설의 설치·관리는 공동구 규정을 준용하지 않는다.',
    designators: [
      { scope: '둘 이상의 시·도에 걸치는 경우', who: '국토교통부장관(관계 도지사 공동지정 아님)' },
      { scope: '하나의 도 안에 속하는 경우', who: '도지사(국토교통부장관과 공동지정 아님)' },
    ],
    facilityRule: '봉안시설·도축장도 광역시설이 될 수 있으며, 그 설치·관리는 공동구 규정이 아니라 협약·협의회 구성 등 별도 규정에 따른다.',
    caution: '광역시설의 설치·관리가 공동구 규정을 그대로 준용한다고 착각하기 쉽지만, 실제로는 협약·협의회 구성 등 별도 규정에 따른다.',
    sources: [
      { label: '국토계획법 제28조·제29조', note: '광역계획권의 지정과 광역시설', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제28조' },
    ],
  },
  'metropolitan-plan-content-scope': {
    kind: 'metro-plan-content-filter', summary: '광역도시계획의 내용은 "공간·환경·경관·교통 등 물리적 계획 사항"에 초점이 있고, 사회·경제 정책 사항은 포함되지 않는다.',
    included: ['교통 및 물류유통체계', '문화·여가공간 및 방재', '경관계획', '녹지관리체계와 환경 보전'],
    excluded: ['교육시설 확충', '부동산가격 안정화'],
    caution: '부동산가격 안정화도 광역 차원의 중요한 정책이라는 이유로 광역도시계획 내용에 포함된다고 착각하기 쉽지만, 실제로는 명시된 내용에 해당하지 않는다.',
    sources: [
      { label: '국토계획법 제12조', note: '광역도시계획의 내용', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제12조' },
    ],
  },
  'urban-management-plan-process': {
    kind: 'urban-plan-project-scope-board', summary: '도시·군계획사업의 3대 축(시설사업·도시개발사업·정비사업)을 먼저 기억하고, 시행자의 수용권·동의요건·귀속 규정을 세부적으로 익히면 된다.',
    threeTypes: ['도시·군계획시설사업', '도시개발법에 따른 도시개발사업', '도시 및 주거환경정비법에 따른 정비사업'],
    lhRule: '한국토지주택공사는 토지면적 3분의 2 이상 소유·소유자 동의 등 별도 동의요건 없이 도시·군계획시설사업 시행자로 지정될 수 있다.',
    vestingRule: '행정청인 시행자가 새로 설치한 공공시설은 그 시설을 관리할 관리청에 무상으로 귀속된다.',
    caution: '한국토지주택공사도 다른 민간참여자처럼 토지면적 3분의 2 이상 소유·소유자 동의가 필요하다고 착각하기 쉽지만, 한국토지주택공사는 동의 요건 없이 시행자로 지정받을 수 있다.',
    sources: [
      { label: '국토계획법 제2조·제86조', note: '도시·군계획사업의 정의와 시행자', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제2조' },
    ],
  },
  'basic-survey-environmental-review-exemption': {
    kind: 'survey-exemption-dual-list', summary: '환경성 검토 생략과 기초조사 생략은 서로 다른 조문의 목록이며, 나대지면적 기준 숫자를 혼동하지 않아야 한다.',
    environmentalReview: { threshold: '나대지면적이 구역면적의 2% 미만', excludedCases: '개발제한구역 내 기반시설 설치, 도시개발사업은 생략 불가' },
    basicSurvey: ['도시·군계획시설 결정의 해제', '지구단위계획구역이 상업지역·연접지역(도심지)', '용도지구 폐지 후 지구단위계획으로 대체', '정비 목적 구역에서 너비 12m 이상 도로 설치계획 없음'],
    trap: '나대지면적이 구역면적의 3%인 경우는 기초조사 생략 사유에 해당하지 않는다.',
    caution: '환경성 검토와 기초조사의 나대지면적 생략 기준을 같은 숫자로 착각하기 쉽지만, 서로 다른 조문의 별개 기준이므로 혼동하지 않아야 한다.',
    sources: [
      { label: '국토계획법 시행령 제25조', note: '기초조사 및 환경성 검토 등의 생략', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제25조' },
    ],
  },
  'resident-opinion-hearing-obligation': {
    kind: 'opinion-hearing-checklist', summary: '개발밀도관리구역은 지방도시계획위원회 심의만 거치면 되고 주민의견 청취 절차가 없다는 점이 기반시설부담구역과 대비되는 핵심 함정이다.',
    required: ['광역도시계획 수립', '성장관리방안 수립', '시범도시사업계획 수립', '기반시설부담구역 지정'],
    notRequired: '개발밀도관리구역 지정 — 주민의견 청취 의무가 명시되어 있지 않음(지방도시계획위원회 심의만 필요)',
    caution: '개발밀도관리구역과 기반시설부담구역을 같은 절차로 착각하기 쉽지만, 기반시설부담구역 지정에는 주민의견 청취가 필요하고 개발밀도관리구역 지정에는 필요하지 않다.',
    sources: [
      { label: '국토계획법 제28조', note: '주민과 지방의회의 의견 청취', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제28조' },
    ],
  },
  'urban-planning-hearing-procedure': {
    kind: 'hearing-procedure-mixed-board', summary: '청문 대상은 "허가·인가의 취소"처럼 중대한 불이익 처분에 한정되며, 단순한 "제한" 조치는 청문 대상이 아니다.',
    hearing: { required: ['개발행위허가의 취소', '실시계획인가의 취소'], notRequired: '개발행위허가의 제한' },
    extra: ['관계 중앙행정기관의 장이 시범도시 지정을 요청하려면 주민 의견을 들은 후 지방자치단체장의 의견을 들어야 한다.', '행정청인 시행자의 처분에는 「행정심판법」에 따른 행정심판을 제기할 수 있다.', '도지사는 도시·군계획이 국가계획에 부합하지 않아도 국토교통부장관에게 변경을 요구할 권한이 명시되어 있지 않다.'],
    caution: '개발행위허가의 "제한"도 "취소"와 마찬가지로 청문 대상이라고 착각하기 쉽지만, 청문이 필요한 것은 취소 처분이며 제한 조치는 청문 대상이 아니다.',
    sources: [
      { label: '국토계획법 제139조', note: '청문', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제139조' },
    ],
  },
  'urban-planning-committee-structure': {
    kind: 'committee-structure-board', summary: '도시계획위원회 문제는 "위원회 종류별 설치 여부"와 "심의·자문 업무의 범위"를 중심으로 출제된다.',
    structure: ['시·군·구에도 지방도시계획위원회를 둔다', '중앙도시계획위원회가 분과위원회에 위임한 사항 중 일부만 분과위원회 심의를 중앙도시계획위원회 심의로 본다(전부가 아님)', '국토교통부장관이 도시·군계획시설결정 해제를 권고하려면 중앙도시계획위원회 심의를 거쳐야 한다'],
    localCommitteeDuty: ['시장·군수·구청장의 자문에 대한 조언', '시범도시사업계획 수립 자문에 대한 조언', '시장·군수가 결정하는 도시·군관리계획의 심의'],
    caution: '시·군·구에는 지방도시계획위원회를 두지 않는다고 착각하기 쉽지만, 시·군·구에도 지방도시계획위원회를 둔다.',
    sources: [
      { label: '국토계획법 제113조', note: '지방도시계획위원회의 설치', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제113조' },
    ],
  },
  'national-land-planning-terminology': {
    kind: 'terminology-swap-filter', summary: '이 카드는 여러 유사 용어를 서로 바꿔치기하는 오답 패턴을 확인하는 것이 핵심이다.',
    pairs: [
      { term: '지구단위계획구역의 지정', correct: '도시·군관리계획', wrong: '도시·군기본계획' },
      { term: '성장관리계획구역 계획적 개발 유도', correct: '성장관리계획', wrong: '공간재구조화계획' },
      { term: '기반시설부담구역 지정 목적', correct: '개발행위로 기반시설 수용능력 부족이 예상되는 지역', wrong: '기반시설 설치가 곤란한 지역' },
    ],
    facts: ['행정청이 설치하는 공동묘지는 "공공시설"에 해당한다.', '자전거전용도로는 "기반시설"(교통시설)에 해당한다.'],
    caution: '"성장관리계획"과 "공간재구조화계획"을 같은 제도로 혼동하기 쉽지만, 성장관리계획구역의 난개발 방지·계획적 개발 유도를 위한 계획은 "성장관리계획"이며 공간재구조화계획은 도시혁신구역 등에 관한 별개 개념이다.',
    sources: [
      { label: '국토계획법 제2조', note: '용어의 정의', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제2조' },
    ],
  },
  'residential-zone-permitted-buildings': {
    kind: 'residential-apartment-zone-map', summary: '주거지역 세분별로 "아파트 건축 가능 여부"만 정확히 매핑하면 되며, 제1종일반주거지역은 저층 위주라 아파트가 원칙적으로 금지된다.',
    allowed: ['제2종전용주거지역', '제2종일반주거지역', '제3종일반주거지역', '준주거지역'],
    notAllowed: ['제1종전용주거지역', '제1종일반주거지역', '계획관리지역', '일반공업지역', '유통상업지역'],
    extra: '제3종일반주거지역에서 조례로 건축을 허용할 수 있는 건축물에는 위험물저장 및 처리시설 중 액화가스 취급소·판매소가 포함되지만, 단란주점·격리병원·관람장, 바닥면적 4천㎡ 이상 업무시설은 포함되지 않는다.',
    caution: '제1종일반주거지역에서도 아파트를 지을 수 있다고 착각하기 쉽지만, 아파트가 허용되는 일반주거지역은 제2종·제3종이며 제1종은 저층주택 중심이라 아파트가 금지된다.',
    sources: [
      { label: '국토계획법 시행령 별표4~별표6', note: '주거지역 세분별 건축제한', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령' },
    ],
  },
  'natural-settlement-district': {
    kind: 'settlement-district-building-list', summary: '자연취락지구는 "건축 가능한 건축물 목록"과 "국가·지자체의 지원사업 목록"이라는 두 개의 별도 목록으로 출제된다.',
    allowed: ['4층 이하 단독주택', '마을회관', '한의원', '도축장', '방송통신시설'],
    notAllowed: ['동물 전용의 장례식장'],
    support: ['어린이놀이터·마을회관 설치', '쓰레기처리장·하수처리시설 개량', '재해방지시설 설치', '주택 개량 사업'],
    caution: '도축장을 혐오시설로 여겨 자연취락지구에서 건축이 금지된다고 착각하기 쉽지만, 실제로는 건축할 수 있는 건축물에 해당하고 동물 전용 장례식장이 금지 대상이다.',
    sources: [
      { label: '국토계획법 시행령 별표23', note: '자연취락지구 안에서 건축할 수 있는 건축물', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령' },
    ],
  },
  'use-district-building-restriction-general': {
    kind: 'use-district-rule-matrix', summary: '용도지구 안 건축제한은 지구별로 서로 다른 완화·강화 규칙을 갖고 있으므로, 지구 이름과 규칙을 정확히 짝지어야 한다.',
    rules: [
      { district: '개발진흥지구(계획 미수립)', rule: '지정목적 범위에서 해당 용도지역의 허용 건축물을 건축 가능' },
      { district: '고도지구', rule: '도시·군관리계획으로 정한 높이를 초과할 수 없음(강화)' },
      { district: '방재지구', rule: '1층 전부를 필로티 구조로 하면 그 부분을 층수 산정에서 제외(완화)' },
      { district: '자연취락지구', rule: '4층 이하 방송통신시설 건축 가능' },
      { district: '복합용도지구(일반주거지역)', rule: '장례시설은 건축할 수 없음' },
    ],
    caution: '고도지구는 높이를 강화하고 방재지구는 층수 산정을 완화한다는 반대 방향의 규칙을 서로 바꿔 기억하기 쉽다.',
    sources: [
      { label: '국토계획법 제76조·제37조', note: '용도지구 안에서의 건축제한', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제76조' },
    ],
  },
  'location-regulation-minimum-district': {
    kind: 'location-regulation-zone-list', amended: true, summary: '도시재생활성화지역의 두 유형 중 입지규제최소구역 지정 대상은 경제기반형에 한정된다 — 다만 이 제도 자체는 2024년 폐지되었다.',
    targets: ['도심·부도심 또는 생활권의 중심지역', '철도역사·터미널 등 지역 거점 기반시설 주변 정비 필요지역', '세 개 이상 노선이 교차하는 대중교통 결절지로부터 1km 이내 지역', '노후·불량건축물이 밀집한 정비 시급 주거·공업지역', '도시재생활성화지역 중 경제기반형(근린재생형 제외)'],
    caution: '2024.2.6. 개정(2024.8.7. 시행)으로 입지규제최소구역 제도 자체가 폐지되고 도시혁신구역·복합용도구역·도시·군계획시설입체복합구역으로 대체되었다 — 이 카드는 폐지 전 법령을 전제로 한 기출 해설이며 현재는 출제 범위에 존재하지 않는다.',
    sources: [
      { label: '국토계획법 부칙(2024.2.6. 개정)', note: '입지규제최소구역 폐지·공간재구조화계획 신설', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률' },
    ],
  },
  'growth-management-plan-area': {
    kind: 'growth-area-zone-filter', summary: '성장관리계획구역·성장관리방안은 도시지역이 아닌 지역에서 난개발을 막기 위한 제도이므로, 주거지역이 대상에서 빠진다는 점이 핵심 함정이다.',
    included: ['녹지지역', '관리지역(계획관리·생산관리)', '농림지역', '자연환경보전지역'],
    excluded: ['주거지역(주변지역과 연계한 체계적 관리가 필요한 경우도 제외)'],
    caution: '주거지역도 난개발 우려가 있으면 성장관리계획구역으로 지정될 수 있다고 착각하기 쉽지만, 성장관리계획구역·성장관리방안은 애초에 도시지역이 아닌 지역만을 대상으로 한다.',
    sources: [
      { label: '국토계획법 제75조의2', note: '성장관리계획구역의 지정 대상', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제75조의2' },
    ],
  },
  'use-district-terminology-definition': {
    kind: 'use-district-definition-card', summary: '용도지구는 용도지역의 제한을 보완(강화·완화)하는 보조적 지역이라는 관계를 정확히 표현하는 정의다.',
    definitionParts: ['토지의 이용 및 건축물의 용도·건폐율·용적률·높이 등에 대한 "용도지역"의 제한을 강화 또는 완화', '용도지역의 기능 증진, 경관·안전 등 도모', '도시·군관리계획으로 결정'],
    caution: '용도지구가 강화·완화하는 대상을 "용도구역"으로 착각하기 쉽지만, 정확히는 "용도지역"의 제한을 강화·완화하는 것이다.',
    sources: [
      { label: '국토계획법 제2조 제16호', note: '용도지구의 정의', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제2조' },
    ],
  },
  'urbanization-control-zone': {
    kind: 'control-zone-designation-board', summary: '시가화조정구역은 무분별한 시가화를 일정 기간 유보하는 제도이므로, 실행력 있는 도시·군관리계획으로 결정하고 허용 건축행위도 아주 작은 규모로 엄격히 제한한다.',
    designation: '시·도지사가 도시·군관리계획으로 결정하여 지정(도시·군기본계획 아님)',
    scale: { limit: '관리용건축물은 기존 면적 제외 33㎡ 이하인 경우에만 허가 대상', exempt: '지정 구역 면적이 1㎢ 미만인 경우 별도 승인 불요' },
    caution: '시가화조정구역을 도시·군기본계획으로 결정한다고 착각하기 쉽다 — 도시·군관리계획으로 결정한다.',
    sources: [
      { label: '국토계획법 제39조', note: '시가화조정구역의 지정', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제39조' },
    ],
  },
  'district-unit-plan-coverage-relaxation-calc': {
    kind: 'coverage-relaxation-calculator', summary: '공공시설 부지 제공에 따른 건폐율 완화는 제공 비율이 클수록 완화 폭도 커지는 구조다.',
    steps: [
      { label: '원래 건폐율', value: '60%' },
      { label: '대지면적', value: '400㎡' },
      { label: '공공시설 부지 제공면적(25%)', value: '100㎡' },
      { label: '완화 적용 건폐율 최대한도', value: '75%' },
    ],
    caution: '공공시설 부지 제공 비율(25%)을 그대로 건폐율 증가폭으로 단순 가산하기 쉽지만, 실제 완화 건폐율은 별도의 계산식에 따라 산정되므로 결과값(75%)을 정확히 기억해야 한다.',
    sources: [
      { label: '국토계획법 시행령 제46조', note: '지구단위계획구역에서의 건폐율 완화', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제46조' },
    ],
  },
  'growth-management-plan-designation': {
    kind: 'growth-plan-procedure-relaxation-board', amended: true, summary: '성장관리계획구역은 도시지역이 아닌 지역만을 대상으로 하므로 공업지역은 제외되며, 지정 절차와 열람기간(7일)·완화 숫자를 정확히 암기해야 한다.',
    procedure: ['공업지역은 성장관리계획구역 지정 대상이 아님', '지정은 도시·군관리계획의 결정이 아닌 주민의 의견청취 등 별도 절차', '성장관리계획구역안을 7일간 일반 열람'],
    relaxation: [
      { zone: '생산녹지·자연녹지·생산관리·농림지역', limit: '건폐율 30% 이하' },
      { zone: '계획관리지역', limit: '용적률 125% 이하' },
    ],
    caution: '건폐율 완화 대상 지역과 용적률 완화 대상 지역(계획관리지역)을 서로 바꿔 기억하기 쉽다. 2022년 기출(33회 43번)은 개정 전 다른 숫자(생산녹지 125%·보전관리 50%)로 출제되었으므로 현행 숫자(30%·125%)와 혼동하지 않아야 한다.',
    sources: [
      { label: '국토계획법 제75조의3', note: '성장관리계획구역의 지정 절차 및 완화 비율', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제75조의3' },
    ],
  },
  'urban-facility-project-implementation-authority': {
    kind: 'facility-project-authority-board', summary: '단계별 집행계획 수립기한(1년)과 제1단계 포함기준(3년 이내 시행)이라는 숫자를 정확히 암기하고, LH의 동의요건 면제·시설 분할시행 허용이라는 절차적 유연성을 함께 기억해야 한다.',
    direct: '국토교통부장관은 국가계획과 관련되거나 특히 필요하다고 인정되는 경우 관계 시·도지사·시장·군수의 의견을 들어 직접 도시·군계획시설사업을 시행할 수 있다.',
    schedule: ['도시·군관리계획 결정이 의제되는 경우 그 고시일부터 1년 이내 단계별 집행계획 수립', '3년 이내에 시행하는 사업은 제1단계 집행계획에 포함'],
    flexibility: ['한국토지주택공사는 토지소유자 동의 요건 없이 시행자로 지정받을 수 있음', '사업시행자는 대상시설을 둘 이상으로 분할하여 시행할 수 있음'],
    caution: '단계별 집행계획 수립기한을 3개월로, 제1단계 포함기준을 5년으로 착각하기 쉽지만, 실제로는 1년·3년이다.',
    sources: [
      { label: '국토계획법 제85조', note: '도시·군계획시설사업의 단계별 집행계획', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제85조' },
    ],
  },
  'development-density-district-detail': {
    kind: 'density-district-detail-board', summary: '개발밀도관리구역 카드의 핵심 원칙(용적률 강화, 중복지정 불가)을 재확인하면서, "건폐율"과 "용적률"을 바꿔치기하는 오답 패턴을 학습한다.',
    facts: ['변경고시는 해당 지방자치단체의 공보에 게재하는 방법으로 함', '농림지역은 지정 대상 지역에 포함되지 않음', '지정은 해당 지방자치단체의 지방도시계획위원회 심의대상', '기반시설부담구역으로 중복 지정될 수 없음'],
    core: '해당 용도지역에 적용되는 "용적률"의 최대한도의 50% 범위에서 용적률을 강화하여 적용한다(건폐율이 아님).',
    caution: '개발밀도관리구역에서 강화되는 대상을 "건폐율"로 착각하기 쉽지만, 실제로 강화되는 것은 "용적률"이다.',
    sources: [
      { label: '국토계획법 제66조·시행령 제62조', note: '개발밀도관리구역의 지정과 용적률 강화', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제66조' },
    ],
  },
  'growth-management-coverage-relaxation-scope': {
    kind: 'coverage-relaxation-zone-filter', summary: '보전녹지지역은 개발을 가장 엄격히 제한하는 지역이므로, 성장관리계획을 통한 건폐율 완화 특례의 적용 대상에서도 제외된다.',
    included: ['생산관리지역', '생산녹지지역', '자연녹지지역', '농림지역'],
    excluded: ['보전녹지지역'],
    caution: '녹지지역이면 종류를 불문하고 모두 이 완화 특례(30% 이하 건폐율)의 적용을 받는다고 착각하기 쉽지만, 보전녹지지역은 제외된다.',
    sources: [
      { label: '국토계획법 제75조의3', note: '성장관리계획구역 건폐율 완화 대상', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제75조의3' },
    ],
  },
  'land-transaction-permit-npl': {
    kind: 'permit-area-threshold-board', summary: '허가제도는 일정 규모 이상의 거래만 통제 대상으로 삼아 행정력을 효율적으로 쓰려는 취지이므로, 기준면적 이하의 소규모 거래는 애초에 허가 대상에서 빠진다.',
    threshold: { zone: '도시지역 외 지역의 허가구역', land: '임야', area: '250㎡ 이하는 허가 불요' },
    caveat: '기준면적 이하라 해도 여러 필지로 나누어 거래하는 등 허가를 회피할 목적의 거래는 규제될 수 있다.',
    caution: '기준면적 이하 거래는 무조건 안전하다고 생각하기 쉽지만, 허가를 회피할 목적의 분할거래 등은 별도로 규제될 수 있다.',
    sources: [
      { label: '부동산거래신고법 시행령 제9조', note: '토지거래계약 허가가 필요없는 필지 면적', href: 'https://www.law.go.kr/법령/부동산거래신고등에관한법률시행령/제9조' },
    ],
  },
  'infrastructure-facility-classification': {
    kind: 'facility-classification-tree', summary: '기반시설 분류 문제는 특정 시설을 엉뚱한 대분류에 배치해 오답을 만드는 방식으로 반복 출제되므로, 헷갈리는 시설의 소속 대분류만 정확히 암기하면 된다.',
    categories: ['교통시설', '공간시설', '유통·공급시설', '공공·문화체육시설', '방재시설', '보건위생시설', '환경기초시설'],
    tricky: [
      { facility: '자동차정류장', category: '화물터미널·공영차고지·복합환승센터·화물자동차 휴게소로 세분(교통광장은 별도의 "광장"에 속함)' },
      { facility: '자연장지', category: '보건위생시설(장사시설) — 공간시설 아님' },
      { facility: '폐기물처리 및 재활용시설', category: '환경기초시설 — 보건위생시설 아님' },
    ],
    caution: '자연장지를 "공간시설"로, 폐기물처리 및 재활용시설을 "보건위생시설"로 잘못 분류하기 쉽다 — 자연장지는 보건위생시설(장사시설), 폐기물처리 및 재활용시설은 환경기초시설에 속한다.',
    sources: [
      { label: '국토계획법 제2조 제6호', note: '기반시설의 정의와 종류', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제2조' },
    ],
  },
  'district-unit-plan-relaxation-outside-urban': {
    kind: 'outside-urban-relaxation-board', summary: '완화 비율은 건폐율(150%)과 용적률(200%)이 서로 다른 숫자라는 점, 계획관리지역 여부에 따라 공동주택 허용 여부가 갈린다는 점이 핵심이다.',
    relax: [{ item: '건폐율', ratio: '150% 이내' }, { item: '용적률', ratio: '200% 이내' }, { item: '높이제한', ratio: '별도 기준(120% 완화가 아님)' }],
    apartments: { allowedIn: '계획관리지역에 지정된 개발진흥지구 — 건축물 용도·종류·규모 제한 완화 가능', notAllowedIn: '계획관리지역 외 지역에 지정된 개발진흥지구 — 완화해도 아파트·연립주택 불허' },
    caution: '건축물 높이제한도 건폐율·용적률과 같은 방식(120% 완화)으로 규정된다고 착각하기 쉽지만, 실제로는 별도의 기준을 따른다.',
    sources: [
      { label: '국토계획법 시행령 제44조·제45조', note: '도시지역 외 지구단위계획구역의 완화 특례', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제44조' },
    ],
  },
  'district-unit-plan-terminology': {
    kind: 'district-unit-plan-definition-card', summary: '지구단위계획의 정의는 "도시·군계획 대상지역의 일부"라는 공간적 범위 한정과 목적을 결합한 문장이므로, 통째로 익혀두면 존재하지 않는 유사 용어와 헷갈리지 않는다.',
    definitionParts: ['도시·군계획 수립 대상지역의 "일부"에 대하여', '토지이용 합리화, 기능 증진, 미관 개선, 양호한 환경 확보', '체계적·계획적 관리를 위해 수립하는 도시·군관리계획'],
    notRealTerms: ['일부관리계획', '시가화조정구역계획', '입지규제최소구역계획'],
    caution: '이 정의를 도시·군기본계획으로 착각하기 쉽지만, 지구단위계획은 도시·군관리계획의 한 종류다.',
    sources: [
      { label: '국토계획법 제2조 제5호', note: '지구단위계획의 정의', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제2조' },
    ],
  },
  'location-regulation-district-features': {
    kind: 'location-regulation-special-rules-board', amended: true, summary: '입지규제최소구역의 지정 대상 목록은 개정으로 확대되어 왔으나, 제도 자체는 2024년 폐지되었다.',
    rules: ['도시·군기본계획상 도심·부도심·생활권 중심지역과 주변지역을 지정 가능', '「주차장법」 부설주차장 설치 규정을 적용하지 않을 수 있음', '다른 법률의 도시·군관리계획 결정 의제가 있어도 국토계획법 절차는 생략 불가'],
    notIncluded: '고밀복합형 재정비촉진지구는 지정 대상으로 명시되지 않음',
    caution: '2024.2.6. 개정(2024.8.7. 시행)으로 입지규제최소구역 제도 자체가 폐지되고 도시혁신구역·복합용도구역·도시·군계획시설입체복합구역으로 대체되었다 — 이 카드는 폐지 전 법령을 전제로 한 기출 해설이며 현재 출제 범위의 제도가 아니다.',
    sources: [
      { label: '국토계획법 부칙(2024.2.6. 개정)', note: '입지규제최소구역 폐지·공간재구조화계획 신설', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률' },
    ],
  },
  'growth-management-plan-content': {
    kind: 'growth-plan-content-board', amended: true, summary: '성장관리방안은 2021년 개정으로 "성장관리계획"으로 명칭이 바뀌었다 — 난개발 우려 지역만 대상으로 하며 경관계획 포함 시 건폐율 완화 인센티브를 준다.',
    required: '기반시설의 배치와 규모에 관한 사항은 반드시 포함되어야 함(임의사항 아님)',
    excluded: '국토계획법 제58조에 따른 시가화 용도지역은 수립 대상지역이 아님',
    incentive: '계획관리지역에서 경관계획을 포함하는 성장관리계획을 수립한 경우 50% 이하의 범위에서 조례로 건폐율을 정할 수 있음',
    caution: '기반시설의 배치·규모 사항이 생략 가능한 임의사항이라고 착각하기 쉽지만, 실제로는 반드시 포함되어야 하는 필수사항이다. 또한 2021년 개정 전 명칭인 "성장관리방안"과 현재 명칭 "성장관리계획"을 혼동하지 않아야 한다.',
    sources: [
      { label: '국토계획법 제75조의2·제75조의3', note: '성장관리계획의 내용과 건폐율 완화(구 성장관리방안)', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제75조의2' },
    ],
  },
  'district-unit-plan-zone-designation-detail': {
    kind: 'district-unit-zone-eligibility-board', summary: '지구단위계획구역 지정 가능 대상의 범위를 넓게 확인하고, "의무 지정(10년 경과)"과 "임의 지정(5년 경과)"을 구분하며 계획관리지역 비율 기준(50%)을 정확히 암기해야 한다.',
    eligible: ['산업입지법상 준산업단지', '도시지역 내 일반공업지역', '농림지역에 위치한 산업·유통개발진흥지구', '택지개발지구 사업 종료 후 5년 경과 지역(임의지정) · 10년 경과 지역(의무지정)'],
    ratio: '도시지역 외 지역을 지정하려면 구역 면적의 100분의 50 이상이 계획관리지역이어야 한다(3분의 2 아님)',
    caution: '도시지역 외 지구단위계획구역 지정 시 계획관리지역 비율 기준을 "3분의 2 이상"으로 착각하기 쉽지만, 실제로는 "100분의 50(50%) 이상"이다.',
    sources: [
      { label: '국토계획법 제51조·시행령 제44조', note: '지구단위계획구역의 지정 대상과 요건', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제51조' },
    ],
  },
  'district-unit-plan-decision-expiry': {
    kind: 'plan-decision-expiry-timeline', summary: '주민제안 지구단위계획의 실효 규정은 도시·군계획시설결정의 20년 실효 규정과는 별개로, 훨씬 짧은 5년 실효기간이 적용된다.',
    compare: [
      { type: '주민제안 지구단위계획결정', period: '고시일부터 5년 이내 미착수 시 실효' },
      { type: '도시·군계획시설결정(일반)', period: '20년 이내 미집행 시 실효' },
    ],
    caution: '지구단위계획의 실효기간을 도시·군계획시설결정의 실효기간(20년)과 혼동하기 쉽지만, 주민제안 지구단위계획의 실효기간은 5년으로 훨씬 짧다.',
    sources: [
      { label: '국토계획법 제52조의2', note: '주민제안 지구단위계획결정의 실효', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제52조의2' },
    ],
  },
  'special-building-zone-deemed-designation': {
    kind: 'special-zone-deemed-filter', amended: true, summary: '특별건축구역 의제는 새로운 융합형 공간계획 제도(도시혁신구역·복합용도구역)에만 부여되는 인센티브다.',
    deemed: ['도시혁신구역', '복합용도구역'],
    notDeemed: ['시가화조정구역', '도시자연공원구역'],
    caution: '도시자연공원구역도 특수한 공간계획 구역이므로 특별건축구역으로 의제된다고 착각하기 쉽지만, 의제 대상은 도시혁신구역과 복합용도구역에 한정된다.',
    sources: [
      { label: '국토계획법 제83조의3', note: '공간재구조화계획구역(도시혁신구역·복합용도구역)의 특례', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제83조의3' },
    ],
  },
  'joint-committee-review-required-changes': {
    kind: 'joint-committee-scope-board', summary: '공동위원회 심의는 "다른 법령에 따른 건폐율 완화처럼 법적 근거가 외부에 있는 변경사항을 반영하는 경우"에 한정되며, 일정 비율 이내의 통상적인 경미한 변경은 심의 없이 처리할 수 있다.',
    required: '「건축법」 등 다른 법령의 규정에 따른 건폐율 완화 내용을 반영하기 위한 지구단위계획의 변경',
    exempt: ['획지 면적의 25% 변경', '층수변경을 수반하는 건축물높이의 15% 변경', '건축물의 배치·형태의 변경', '용도지역 변경을 포함하는 구역면적의 4% 변경'],
    caution: '획지면적이나 높이의 변경 비율이 크면(25%, 15%) 공동위원회 심의가 필요하다고 착각하기 쉽지만, 공동위원회 심의 대상은 "다른 법령에 따른 건폐율 완화 반영"이라는 특정 유형의 변경에 한정된다.',
    sources: [
      { label: '국토계획법 시행령 제25조의2', note: '공동위원회 심의 대상과 경미한 변경', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제25조의2' },
    ],
  },
  'development-activity-permit-criteria': {
    kind: 'permit-criteria-filter', summary: '개발행위허가 기준은 "토지이용의 적합성·물리적 조건"에 관한 것이며, 자금조달계획처럼 사업 주체의 재정능력을 심사하는 사항은 다른 절차의 몫이다.',
    criteria: ['도시·군계획으로 수립된 경관계획에 적합할 것', '공유수면매립의 매립목적이 도시·군계획에 적합할 것', '토지분할·물건적치 행위에 입목 벌채가 수반되지 않을 것', '도시·군계획조례로 정하는 도로 너비 기준에 적합할 것'],
    notCriteria: '자금조달계획이 목적사업 실현에 적합하도록 수립되어 있을 것(도시·군계획사업 시행자 지정 등 다른 절차의 요건)',
    caution: '자금조달계획의 적정성을 개발행위허가의 일반 기준으로 착각하기 쉽다 — 이는 도시·군계획사업 시행자 지정 등 다른 절차의 요건이다.',
    sources: [
      { label: '국토계획법 시행령 제56조', note: '개발행위허가의 기준', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제56조' },
    ],
  },
  'development-activity-public-facility-vesting': {
    kind: 'facility-vesting-matrix', summary: '공공시설 귀속 규칙은 "행정청 vs 비행정청"과 "새 시설 vs 기존(대체되는) 시설"의 조합으로 구성되며, 비행정청의 경우 기존 시설 양도가 "설치비용 범위 내"로 제한된다.',
    matrix: [
      { who: '행정청', newFacility: '관리청에 무상 귀속', oldFacility: '해당 행정청에 무상 귀속(전부)' },
      { who: '비행정청', newFacility: '관리청에 무상 귀속', oldFacility: '설치비용 상당 범위 안에서만 무상 양도(전부 아님)' },
    ],
    extra: ['하천의 관리청이 불분명한 경우 국토교통부장관이 아니라 하천법 등 관계 법령에 따른 관리청으로 봄', '준공검사를 받음으로써 귀속·양도된 것으로 봄', '귀속된 공공시설의 처분 수익금은 도시·군계획사업 목적으로만 사용해야 함'],
    caution: '비행정청이 개발행위허가를 받은 경우에도 기존 공공시설이 전부 무상 귀속된다고 착각하기 쉽지만, 실제로는 새로 설치한 시설의 설치비용 범위 안에서만 양도된다.',
    sources: [
      { label: '국토계획법 제65조', note: '개발행위에 따른 공공시설 등의 귀속', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제65조' },
    ],
  },
  'development-activity-facility-charge-linkage': {
    kind: 'facility-charge-numbers-board', summary: '기반시설연동제(개발밀도관리구역·기반시설부담구역)의 숫자를 정확히 암기해야 한다.',
    numbers: [
      { item: '개발밀도관리구역 변경', rule: '지방도시계획위원회 심의 필요(생략 불가)' },
      { item: '기반시설부담구역 설치계획 미수립 시 해제', rule: '지정고시일부터 1년이 되는 날의 다음 날' },
      { item: '기반시설설치비용 납부시점', rule: '사용승인(준공검사) 신청 시까지' },
      { item: '기반시설부담구역 의무 지정 요건', rule: '전년도 개발행위허가 건수가 전전년도 대비 20% 이상 증가' },
      { item: '개발밀도관리구역 용적률 강화', rule: '최대한도의 50% 범위' },
    ],
    caution: '기반시설부담구역 해제 기한을 2년·3년으로, 비용 납부시점을 건축허가 후 일정기간으로 착각하기 쉽지만, 실제로는 1년·사용승인 신청 시까지다.',
    sources: [
      { label: '국토계획법 제67조·제68조', note: '기반시설부담구역의 지정과 기반시설설치비용', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률/제67조' },
    ],
  },
  'development-activity-scale-exemption': {
    kind: 'scale-exemption-list', summary: '규모 제한 예외 목록은 "공공성이 강하거나 이미 계획에 따라 통제되는 개발행위"에 초점이 있다.',
    exempt: ['지구단위계획으로 정한 가구·획지 범위 안에서 형질변경과 관련 기반시설 설치가 동시에 이루어지는 경우', '농어촌정비법상 농어촌정비사업', '건축물 건축·공작물 설치·지목변경을 수반하지 않는 토지복원사업', '국방·군사시설 사업에 관한 법률상 국방·군사시설사업'],
    notExempt: '환경친화적 자동차의 개발 및 보급 촉진에 관한 법률상 수소연료공급시설 설치를 수반하는 개발행위',
    caution: '친환경 인프라 관련 시설(수소연료공급시설)도 공익성이 크다는 이유로 규모 제한 예외라고 착각하기 쉽지만, 법정 예외 목록에는 포함되지 않는다.',
    sources: [
      { label: '국토계획법 시행령 제55조', note: '개발행위허가의 규모', href: 'https://www.law.go.kr/법령/국토의계획및이용에관한법률시행령/제55조' },
    ],
  },
  'urban-development-plan-revision-release': {
    kind: 'zone-release-timeline', summary: '지정 해제의 세 단계 숫자(2년·3년·5년)를 순서대로 암기하고, 사후 추가 가능 사항과 처음부터 있어야 하는 사항을 구분해야 한다.',
    timeline: [
      { step: '구역 지정·고시', next: '2년 이내 개발계획 수립·고시 필요' },
      { step: '개발계획 고시', next: '3년 이내 실시계획 인가 신청 필요' },
      { step: '대규모(330만㎡ 이상) 구역 특례', next: '위 2년·3년 기준이 각각 5년으로 연장' },
    ],
    addableLater: '임대주택건설계획 등 세입자 주거·생활안정대책은 구역 지정 후에도 개발계획에 추가로 포함 가능',
    mustFromStart: '환경보전계획, 보건의료시설·복지시설 설치계획, 원형지 공급 대상·개발방향, 사업시행지구 분할에 관한 사항은 구역 지정 시부터 정해져 있어야 함',
    caution: '지정 해제까지의 세 숫자(2년, 3년, 5년)를 순서 없이 뒤섞어 기억하기 쉬우므로, "개발계획 수립(2년) → 실시계획 인가신청(3년)"의 흐름과 대규모 구역의 5년 특례를 구분해 암기해야 한다.',
    sources: [
      { label: '도시개발법 제10조', note: '도시개발구역 지정의 해제', href: 'https://www.law.go.kr/법령/도시개발법/제10조' },
    ],
  },
  'urban-development-implementer-change': {
    kind: 'implementer-change-board', summary: '시행자 변경사유는 "사업을 실제로 진행하지 못하는 상태"로 한정되며, 단순히 절차 신청이 늦은 것은 포함되지 않는다.',
    reasons: ['실시계획 인가 후 2년 이내 미착수', '행정처분으로 시행자 지정 취소', '행정처분으로 실시계획 인가 취소', '시행자의 부도로 사업목적 달성 곤란'],
    notReason: '실시계획 인가 신청을 늦게 하는 것만으로는 변경사유가 되지 않음',
    agencies: { allowed: '국가·지방자치단체·한국부동산원·한국수자원공사·지방공사 등', notAllowed: '한국관광공사' },
    caution: '실시계획 인가 신청이 늦었다는 사실만으로 시행자를 변경할 수 있다고 오해하기 쉽지만, 이는 법정 변경사유에 해당하지 않는다.',
    sources: [
      { label: '도시개발법 제11조', note: '도시개발사업의 시행자', href: 'https://www.law.go.kr/법령/도시개발법/제11조' },
    ],
  },
  'urban-development-implementation-method': {
    kind: 'implementation-method-flow', summary: '시행방식 변경은 환지 방식 쪽으로만 이동 가능하고, 환지 방식에서 다시 벗어나는 방향(혼용)으로는 갈 수 없다.',
    flow: ['수용·사용 방식 → 전부 환지 방식(가능)', '수용·사용 방식 → 혼용방식(가능)', '혼용방식 → 전부 환지 방식(가능)', '전부 환지 방식 → 혼용방식(불가)'],
    extra: '시행자는 국토교통부장관의 허가가 아니라 지정권자의 인가를 받아 시행방식을 정한다.',
    caution: '시행방식 변경이 어느 방향으로든 자유롭다고 착각하기 쉽지만, 전부 환지 방식으로 일단 정해지면 다시 혼용방식으로 되돌리는 변경은 허용되지 않는다.',
    sources: [
      { label: '도시개발법 제3조의2', note: '도시개발사업의 시행방식', href: 'https://www.law.go.kr/법령/도시개발법/제3조의2' },
    ],
  },
  'urban-development-expropriation-method': {
    kind: 'expropriation-method-board', summary: '수용 또는 사용 방식의 핵심은 "누가 수용권을 갖는지(시행자만)"와 "수용요건(면적 2/3+동의자 1/2, 단 공공시행자는 면제)"이다.',
    who: '시행자만 수용 가능(지정권자는 수용권 없음)',
    requirement: '민간참여자가 아닌 시행자가 수용하려면 사업대상 토지면적의 3분의 2 이상 소유 + 토지 소유자 총수의 2분의 1 이상 동의 필요(순수 공공시행자는 면제될 수 있음)',
    extra: '수용대상 토지의 세부목록을 고시하면 사업인정 및 그 고시가 있었던 것으로 봄',
    caution: '지정권자도 수용권을 가진다고 착각하기 쉽지만, 수용권은 오직 시행자에게만 있으며 지정권자는 인가·감독 권한만 가진다.',
    sources: [
      { label: '도시개발법 제22조', note: '토지 등의 수용 또는 사용', href: 'https://www.law.go.kr/법령/도시개발법/제22조' },
    ],
  },
  'urban-development-original-land': {
    kind: 'original-land-supply-board', summary: '원형지 규정은 "공급 면적 상한(1/3)", "개발자 선정방식(경쟁입찰 원칙)", "매각 제한기간(5년)"을 서로 다른 숫자로 출제한다.',
    facts: [
      { item: '공급 면적 상한', value: '도시개발구역 전체 토지면적의 3분의 1까지(3분의 2 아님)' },
      { item: '개발자 선정', value: '경쟁입찰 원칙(2회 이상 유찰 시 수의계약 가능)' },
      { item: '공급가격 기준', value: '감정가격 + 기반시설 설치비용 합산액(시행자가 정함)' },
      { item: '지자체 매각 제한', value: '공사완료 공고일부터 5년의 범위' },
    ],
    caution: '원형지 공급 면적 상한을 3분의 2로 착각하기 쉽지만, 실제로는 3분의 1까지다.',
    sources: [
      { label: '도시개발법 제25조의2', note: '원형지의 공급과 개발', href: 'https://www.law.go.kr/법령/도시개발법/제25조의2' },
    ],
  },
  'urban-development-implementation-plan': {
    kind: 'implementation-plan-approval-board', summary: '실시계획은 "누가 작성·인가하는지"와 "변경인가가 필요한 경중 기준(면적 증감 비율)"을 조합해 출제된다.',
    procedure: ['국토교통부장관이 작성 시 시·도지사·대도시 시장 의견 청취(시장·군수·구청장 아님)', '지정권자가 시행자 아닌 경우 시행자는 지정권자의 인가를 받아야 함', '실시계획에는 지구단위계획이 포함되어야 함'],
    changeThreshold: '인가받은 실시계획 중 사업시행면적의 100분의 10 이상이 증감되는 경우 변경인가 필요',
    caution: '실시계획 변경인가 기준을 사업시행면적의 100분의 20으로 착각하기 쉽지만, 실제 기준은 100분의 10 이상 증감이다.',
    sources: [
      { label: '도시개발법 제17조·시행령 제33조', note: '실시계획의 작성·인가와 변경인가 기준', href: 'https://www.law.go.kr/법령/도시개발법/제17조' },
    ],
  },
  'urban-development-completion-inspection': {
    kind: 'completion-inspection-board', summary: '이 카드의 핵심은 "체비지는 준공 전에도 사용 가능하다"는 예외 규정과, "지정권자가 시행자인지 아닌지"에 따라 절차(검사 vs 공고)가 달라진다는 구조다.',
    reserveLand: '준공검사 전이라도 체비지는 사용할 수 있음',
    procedure: [
      { who: '지정권자가 아닌 시행자', rule: '공사완료 보고서 작성 → 지정권자의 준공검사' },
      { who: '지정권자가 시행자인 경우', rule: '준공검사 대신 공사완료 공고' },
    ],
    caution: '체비지도 준공검사를 마쳐야만 사용할 수 있다고 오해하기 쉽지만, 실제로는 준공검사 전에도 체비지를 사용할 수 있다.',
    sources: [
      { label: '도시개발법 제50조', note: '준공검사', href: 'https://www.law.go.kr/법령/도시개발법/제50조' },
    ],
  },
  'urban-development-plan-change-consent': {
    kind: 'plan-change-consent-filter', summary: '"경미한 변경(수치 기준 이내)"과 "중대한 변경(사업시행지구 분할·통합)"을 구분하는 문제이며, 수치 기준 이내의 변경은 동의가 필요 없다.',
    consentRequired: '사업시행지구를 분할하거나 분할된 사업시행지구를 통합하는 경우',
    minorChanges: ['너비 12m 미만 도로의 폐지', '기반시설(도로 제외) 면적의 100분의 5 미만 증감', '용적률의 100분의 5 미만 증감', '수용예정인구의 100분의 10 미만 증감'],
    caution: '기반시설 면적이나 용적률이 조금이라도 증가하면 항상 동의가 필요하다고 오해하기 쉽지만, 100분의 5 미만의 증감은 경미한 변경으로 동의가 필요 없다.',
    sources: [
      { label: '도시개발법 시행령 제6조', note: '개발계획의 경미한 변경', href: 'https://www.law.go.kr/법령/도시개발법시행령/제6조' },
    ],
  },
  'urban-development-agency-scope': {
    kind: 'agency-delegation-scope-board', summary: '대행 가능 범위는 "설계·조성·분양"이라는 실무적 시공·분양 업무에 한정되며, 자금조달 수단인 토지상환채권 발행은 대행할 수 없다.',
    allowed: ['실시설계', '기반시설공사', '부지조성공사', '조성된 토지의 분양'],
    notAllowed: '토지상환채권의 발행',
    caution: '조성된 토지의 분양 업무를 대행할 수 없다고 오해하기 쉽지만, 분양 업무는 대행 가능한 범위에 포함되며, 대행 불가 항목은 토지상환채권 발행이다.',
    sources: [
      { label: '도시개발법 제25조', note: '주택건설사업자 등에 의한 사업 대행', href: 'https://www.law.go.kr/법령/도시개발법/제25조' },
    ],
  },
  'urban-development-cost-sharing': {
    kind: 'cost-sharing-rules-board', summary: '비용부담 문제는 "누가 어떤 시설의 비용을 얼마나 부담하는지"를 실제 법정 비율과 다르게 서술해 오답을 만든다.',
    rules: [
      { item: '통신시설 설치 기한', rule: '준공검사 신청일까지(지정권자가 시행자 아닌 경우)' },
      { item: '전기 지중선로 설치비용(전부 환지방식)', rule: '설치를 요청한 사업시행자가 전액 부담(전기공급자와 반반 아님)' },
      { item: '이익을 얻는 시·도에 대한 비용 전가', rule: '지정권자인 시행자는 부담시킬 수 없음' },
    ],
    caution: '지중선로 설치비용을 사업시행자와 전기공급자가 2분의 1씩 부담한다고 착각하기 쉽지만, 전부 환지 방식에서는 설치를 요청한 사업시행자가 비용을 부담하는 것이 원칙이다.',
    sources: [
      { label: '도시개발법 제55조·제64조', note: '도시개발사업의 비용 부담', href: 'https://www.law.go.kr/법령/도시개발법/제55조' },
    ],
  },
  'urban-development-permission-required-acts': {
    kind: 'permission-acts-filter', summary: '허가대상 행위 목록은 "토지의 형질을 물리적으로 바꾸거나 구역 관리에 영향을 주는 행위"에 초점이 있으므로, 물리적 변화가 없는 행위는 제외된다.',
    required: ['건축물의 건축·용도변경', '공작물의 설치', '토지의 형질변경', '토석의 채취', '토지분할', '물건을 쌓아놓는 행위', '죽목의 벌채·식재', '공유수면 매립'],
    notRequired: '토지의 합병',
    caution: '토지의 분할과 합병을 같은 범주로 묶어 둘 다 허가 대상이라고 착각하기 쉽지만, 허가 대상은 분할이며 합병은 대상이 아니다.',
    sources: [
      { label: '도시개발법 제9조', note: '도시개발구역에서의 행위제한', href: 'https://www.law.go.kr/법령/도시개발법/제9조' },
    ],
  },
  'urban-development-land-substitution-bond': {
    kind: 'substitution-bond-board', summary: '토지상환채권 문제는 "지급보증이 필요한 발행자(민간) vs 필요 없는 발행자(공공)", "발행규모 상한(1/2)", "이전 가능 여부"를 조합한 오답 패턴이 반복된다.',
    facts: [
      { item: '지방공사 등 공공시행자', rule: '지급보증 없이 단독 발행 가능(민간시행자만 지급보증 필요)' },
      { item: '발행규모 상한', rule: '분양토지·분양건축물 면적의 2분의 1 초과 불가(3분의 2 아님)' },
      { item: '이전 가능 여부', rule: '이전 가능' },
      { item: '발행계획 포함사항', rule: '토지가격의 추산방법 포함 필수' },
    ],
    caution: '토지상환채권의 발행규모 상한을 "3분의 2"로 착각하기 쉽지만, 실제로는 분양토지·분양건축물 면적의 2분의 1을 초과할 수 없다.',
    sources: [
      { label: '도시개발법 제23조', note: '토지상환채권', href: 'https://www.law.go.kr/법령/도시개발법/제23조' },
    ],
  },
  'urban-development-association-officers-representative': {
    kind: 'association-officer-representative-board', summary: '대의원회는 "조합 존립·정체성에 관한 중대사항"은 대행할 수 없고 "통상적 집행사항"만 대행할 수 있으며, 조합 대표소송에서는 대의원회가 아닌 감사가 조합을 대표한다.',
    disqualify: '금고 이상의 형을 선고받고 그 집행유예 기간 중에 있는 자는 임원이 될 수 없음',
    representation: '조합장·이사의 자기 관련 계약·소송에서는 대의원회가 아니라 감사가 조합을 대표',
    assembly: { threshold: '조합원 50인 이상이면 대의원회를 둘 수 있음(의무 아님)', ratio: '대의원 수는 조합원 총수의 100분의 10 이상' },
    cannotDelegate: ['정관 변경', '개발계획 수립', '조합장 선임', '조합 합병'],
    caution: '조합장의 자기 관련 소송에서 대의원회가 조합을 대표한다고 착각하기 쉽지만, 실제로는 감사가 조합을 대표한다.',
    sources: [
      { label: '도시개발법 제16조', note: '도시개발사업조합의 임원과 대의원회', href: 'https://www.law.go.kr/법령/도시개발법/제16조' },
    ],
  },
  'urban-development-association-membership-voting': {
    kind: 'membership-voting-board', summary: '조합원 자격·의결권 문제는 "누가 조합원이 될 수 있는지"와 "의결권의 귀속·승계 방식"을 조합해 오답을 만드는 방식으로 출제된다.',
    facts: ['토지 소유자는 미성년자라도 조합원이 될 수 있음(제한 없음)', '공유 토지는 대표 공유자 1인에게 의결권 귀속(공유자별 개별 의결권 아님)', '토지 소유권 전부를 이전받은 조합원은 정관에 따라 본래 의결권과 별도로 승계 가능', '조합 설립인가 신청 전 동의 철회 시 동의자 수에서 제외'],
    caution: '공유 토지의 경우 공유자 각자에게 별도의 의결권이 있다고 착각하기 쉽지만, 대표 공유자 1인에게만 의결권이 귀속된다.',
    sources: [
      { label: '도시개발법 제21조의2', note: '조합원 및 의결권', href: 'https://www.law.go.kr/법령/도시개발법/제21조의2' },
    ],
  },
  'urban-development-delegated-execution-agent': {
    kind: 'delegated-agent-scope-filter', summary: '사업 대행을 시킬 수 있는 시행자는 "국가·지자체 계열 및 법정 공공기관"에 한정되며, 민간 투자기구나 이전법인은 이 목록에 포함되지 않는다.',
    allowed: ['지방자치단체', '한국관광공사법상 한국관광공사'],
    notAllowed: ['부동산투자회사법상 자기관리부동산투자회사', '수도권정비계획법상 과밀억제권역→수도권 외 이전 법인'],
    caution: '자기관리부동산투자회사도 공공성 있는 시행자로 착각하기 쉽지만, 사업 대행을 시킬 수 있는 시행자 목록에는 포함되지 않는다.',
    sources: [
      { label: '도시개발법 제25조', note: '주택건설사업자 등에 의한 도시개발사업 대행', href: 'https://www.law.go.kr/법령/도시개발법/제25조' },
    ],
  },
  'replot-method': {
    kind: 'replot-type-comparison', summary: '평면 환지는 "토지 → 토지", 입체 환지는 "토지·건축물 → 구분건축물(집합건물의 전유부분)"로 이전 대상이 바뀐다.',
    types: [
      { name: '평면 환지', desc: '환지 전 토지에 대한 권리를 조성되는 토지에 이전' },
      { name: '입체 환지', desc: '환지 전 토지·건축물(무허가 건축물 제외)에 대한 권리를 건설되는 구분건축물에 이전' },
    ],
    caution: '무허가 건축물도 입체 환지의 대상이 된다고 착각하기 쉽지만, 무허가 건축물은 입체 환지 대상에서 제외된다.',
    sources: [
      { label: '도시개발법 제32조', note: '환지의 방식(평면 환지·입체 환지)', href: 'https://www.law.go.kr/법령/도시개발법/제32조' },
    ],
  },
  'land-burden-rate-calculation': {
    kind: 'burden-rate-formula-calculator', summary: '토지부담률 계산은 "분모(순수 대상면적)"와 "분자(순수 보류지)"를 정확히 구성하는 것이 핵심이다.',
    formula: '평균 토지부담률 = (보류지 면적 − 무상귀속 공공시설 토지면적 − 시행자 소유 토지면적) ÷ (환지계획구역 면적 − 무상귀속 공공시설 토지면적 − 시행자 소유 토지면적) × 100',
    example: { region: '환지계획구역 200,000㎡', vested: '무상귀속 공공시설 20,000㎡', owner: '시행자 소유 10,000㎡', reserve: '보류지 106,500㎡', result: '(106,500−20,000−10,000)÷(200,000−20,000−10,000)×100 = 45%' },
    caution: '보류지 면적 전체를 그대로 분자로 사용하기 쉽지만, 무상귀속분과 시행자 소유분을 뺀 순수 보류지 면적을 분자로 써야 한다.',
    sources: [
      { label: '도시개발법 시행규칙 제27조', note: '토지부담률의 산정', href: 'https://www.law.go.kr/법령/도시개발법시행규칙/제27조' },
    ],
  },
  'joint-implementation-agreement-replot': {
    kind: 'joint-agreement-clause-filter', summary: '규약 기재사항은 "환지방식 고유의 절차"와 "시행방식과 무관한 일반사항"으로 구분하면 된다.',
    replotOnly: ['청산', '환지계획 및 환지예정지의 지정', '보류지 및 체비지의 관리·처분', '토지평가협의회의 구성·운영'],
    general: '주된 사무소의 소재지(시행방식과 무관하게 모든 공동시행 규약에 공통 포함)',
    caution: '주된 사무소의 소재지도 환지방식 전용 사항이라고 착각하기 쉽지만, 이는 시행방식과 무관하게 공통으로 포함되는 일반사항이다.',
    sources: [
      { label: '도시개발법 시행령 제27조', note: '공동시행 규약의 기재사항', href: 'https://www.law.go.kr/법령/도시개발법시행령/제27조' },
    ],
  },
  'replot-disposition-procedure': {
    kind: 'disposition-timeline-board', summary: '환지처분 관련 시점은 "다음 날부터 발생하는 효과"와 "공고일 그 자체가 끝나는 때 소멸하는 것(지역권)"을 구분하는 것이 핵심이며, 환지처분은 특정 일수가 아니라 "지체 없이" 해야 한다.',
    timeline: ['시행자가 공사 완료 시 지체 없이 관보·공보 공고', '지정권자가 아닌 시행자가 지정권자에 의한 준공검사를 받은 경우: 90일 이내가 아니라 지체 없이 환지처분'],
    effects: ['환지처분 공고일 다음 날부터 환지는 종전 토지로 봄', '입체환지처분을 받은 자는 공고일 다음 날 건축물 일부·공유지분 취득', '행사할 이익이 없어진 지역권은 공고일이 "끝나는 때"(다음 날 아님) 소멸'],
    caution: '환지처분을 준공검사 후 90일 이내에 해야 한다고 착각하기 쉽지만, 실제로는 특정 일수 없이 "지체 없이" 해야 한다. 지역권 소멸 시점도 다른 효과와 같이 "공고일 다음 날"로 착각하기 쉽지만, 지역권은 공고일이 끝나는 때에 소멸한다는 점이 다르다.',
    sources: [
      { label: '도시개발법 제42조', note: '환지처분의 효과', href: 'https://www.law.go.kr/법령/도시개발법/제42조' },
    ],
  },
  'replot-with-public-facility-project': {
    kind: 'concurrent-project-implementer-filter', summary: '이 특례는 지자체가 주도하는 공공시설사업과 발맞춰 환지사업을 진행하기 위한 것이므로, 시행자 후보군은 "지자체 계열 및 공공기관·신탁업자"로 한정되고 "국가"는 이 특례의 적용 대상에서 빠진다.',
    allowed: ['지방자치단체', '지방공사', '한국토지주택공사', '요건을 갖춘 신탁업자'],
    notAllowed: '국가',
    caution: '국가도 공공성이 강한 시행자이므로 이 특례의 시행자가 될 수 있다고 착각하기 쉽지만, 이 특례의 시행자 목록에는 국가가 포함되지 않는다.',
    sources: [
      { label: '도시개발법 제11조', note: '환지방식 사업과 공공시설사업의 병행시행 특례', href: 'https://www.law.go.kr/법령/도시개발법/제11조' },
    ],
  },
  'replot-development-plan-minor-change': {
    kind: 'minor-change-numbers-board', summary: '경미한 변경의 숫자 조합(5%·1%·5%)을 하나의 세트로 암기하면 되며, 각 숫자가 서로 다른 항목에 대응한다.',
    items: [
      { item: '시행지구 면적 증감', ratio: '100분의 5 이내' },
      { item: '분할·통합 시 종전 면적 변경', ratio: '100분의 1 이내' },
      { item: '그 밖의 특정 계획요소 변경', ratio: '100분의 5 이내' },
    ],
    caution: '경미한 변경의 숫자 기준을 모두 동일하게(예: 전부 5%나 전부 10%) 착각하기 쉽지만, 항목별로 5%·1%·5%처럼 서로 다른 기준이 적용된다.',
    sources: [
      { label: '도시개발법 시행령 제6조', note: '환지방식 개발계획의 경미한 변경', href: 'https://www.law.go.kr/법령/도시개발법시행령/제6조' },
    ],
  },
  'replot-proportion-rate-calculation': {
    kind: 'proportion-rate-calculator', summary: '비례율 계산식은 "사업으로 새로 생기는 순가치"를 "사업 전 가치"로 나눈 비율이라는 의미를 이해하면 공식을 쉽게 재구성할 수 있다.',
    formula: '비례율 = (조성되는 토지·건축물 평가액 합계 − 총 사업비) ÷ 환지 전 토지·건축물 평가액 합계 × 100',
    example: { cost: '총 사업비 250억원', before: '환지 전 평가액 합계 500억원', after: '조성 후 평가액 합계 1,000억원', result: '(1,000억−250억)÷500억×100 = 150%' },
    caution: '총사업비를 분자에서 빼지 않고 조성 후 평가액만으로 비례율을 계산하는 실수를 하기 쉽다 — 반드시 총사업비를 차감한 값을 분자로 써야 한다.',
    sources: [
      { label: '도시개발법 시행규칙 제28조', note: '평가식 환지의 비례율 산정', href: 'https://www.law.go.kr/법령/도시개발법시행규칙/제28조' },
    ],
  },
  'replot-liquidation-money': {
    kind: 'liquidation-money-rules-board', summary: '청산금 조문은 "환지처분 전 교부 가능", "신청 제외 토지도 청산금 결정 가능", "소멸시효 5년", "징수 위탁 수수료 4%"라는 네 개의 독립적 규칙으로 구성된다.',
    rules: [
      { item: '동의에 의해 환지 미지정 토지', rule: '환지처분 전이라도 청산금 교부 가능' },
      { item: '신청으로 환지 대상에서 제외된 토지', rule: '청산금을 교부하는 때 결정 가능(결정 불가 아님)' },
      { item: '청산금 소멸시효', rule: '5년간 미행사 시 시효 소멸' },
      { item: '군수 위탁 징수 수수료', rule: '징수액의 100분의 4를 해당 군에 지급' },
    ],
    caution: '환지 대상에서 신청으로 제외된 토지는 청산금을 결정할 수 없다고 착각하기 쉽지만, 실제로는 청산금을 교부하는 때에 결정할 수 있다.',
    sources: [
      { label: '도시개발법 제41조·제46조', note: '청산금', href: 'https://www.law.go.kr/법령/도시개발법/제41조' },
    ],
  },
  'replot-consent-counting-method': {
    kind: 'consent-counting-rules-board', summary: '동의자 수 산정은 "실질적으로 몇 명의 의사가 반영되는지"를 왜곡 없이 세는 것이 목적이다.',
    rules: ['도시개발구역 토지면적 산정 시 국공유지도 포함', '1인이 여러 필지를 단독 소유해도 소유자 1인으로 산정', '여러 필지를 소유한 공유자가 동일하면 대표 1인으로 산정', '1필지를 여럿이 공유하면 구분소유적 공유관계 여부에 따라 산정방식이 달라짐', '구역지정 제안 후 개발계획 수립 전 소유자가 변경되면 변경 전 소유자의 동의서 기준'],
    caution: '도시개발구역의 토지면적 산정 시 국공유지를 제외한다고 착각하기 쉽지만, 실제로는 국공유지도 포함하여 산정한다.',
    sources: [
      { label: '도시개발법 시행령 제8조', note: '동의자 수의 산정방법', href: 'https://www.law.go.kr/법령/도시개발법시행령/제8조' },
    ],
  },
  'replot-scheduled-land': {
    kind: 'scheduled-land-effects-board', summary: '환지 예정지 지정의 핵심 효과는 "종전 토지 사용·수익권이 환지 예정지로 그대로 옮겨간다"는 것이며, 체비지는 처분(매각)까지 가능하다.',
    effects: ['종전 토지 소유자는 효력발생일부터 환지처분 공고일까지 종전 토지를 사용·수익할 수 없음', '임차권자등의 권리는 소멸하지 않고 환지 예정지로 이전되어 그대로 행사됨', '임차권자등이 있으면 환지 예정지 지정 시 그 권리의 목적 토지·부분도 함께 지정해야 함', '체비지 용도 환지 예정지는 사업비 충당을 위해 사용뿐 아니라 처분(매각)도 가능'],
    caution: '환지 예정지가 지정되면 임차권자등의 권리가 소멸하거나 행사할 수 없게 된다고 착각하기 쉽지만, 실제로는 그 권리가 환지 예정지로 그대로 이전되어 행사된다.',
    sources: [
      { label: '도시개발법 제36조', note: '환지 예정지의 지정', href: 'https://www.law.go.kr/법령/도시개발법/제36조' },
    ],
  },
  'urban-development-bond': {
    kind: 'bond-redemption-board', summary: '도시개발채권은 지자체가 사업재원을 조달하기 위해 강제로 매입시키는 채권이므로, 매입 의무가 없는 사람이 실수로 매입했다면 중도상환의 길을 열어준다.',
    period: '상환기간은 5년부터 10년까지의 범위에서 지방자치단체의 조례로 정함(2년부터 아님)',
    earlyRedemption: '매입의무자가 아닌 자가 착오로 매입한 경우에는 중도상환 가능',
    costRule: '도시개발사업에 필요한 비용은 특별한 규정이 없는 한 시행자가 부담',
    caution: '도시개발채권의 상환기간 하한을 "2년"으로 잘못 암기하기 쉽다 — 정확히는 "5년"부터다.',
    sources: [
      { label: '도시개발법 제27조', note: '도시개발채권', href: 'https://www.law.go.kr/법령/도시개발법/제27조' },
    ],
  },
  'maintenance-infrastructure-facility': {
    kind: 'facility-exception-filter', summary: '정비기반시설·공동이용시설은 각각 "목록에서 하나만 빠진 것을 찾는" 방식으로 반복 출제되므로, 두 목록에서 빠지는 예외 항목을 확실히 기억해야 한다.',
    infra: { included: ['도로', '상하수도', '구거', '공원', '공용주차장', '공공공지', '녹지', '하천', '소방용수시설'], excluded: '공동작업장, 공동으로 사용하는 구판장' },
    communal: { included: ['경로당', '탁아소', '어린이집', '놀이터', '공동으로 사용하는 세탁장'], excluded: '유치원' },
    caution: '유치원을 어린이집·탁아소와 같은 공동이용시설로 묶어 기억하기 쉽지만, 유치원은 도시정비법상 공동이용시설 목록에서 제외된다.',
    sources: [
      { label: '도시정비법 제2조 제4호·제5호', note: '정비기반시설·공동이용시설의 정의', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제2조' },
    ],
  },
  'reconstruction-safety-diagnosis': {
    kind: 'safety-diagnosis-board', summary: '안전진단은 "실시 시기", "제외 대상", "심사 항목", "결과의 처리"로 나뉘어 출제된다.',
    timing: '단계별 정비사업추진계획에 따라 정비예정구역별 정비계획의 수립시기가 도래하면 실시',
    exempt: '진입도로 등 기반시설 설치를 위해 불가피하게 정비구역에 포함된 것으로 인정되는 주택단지 내 건축물은 제외 가능',
    criteria: ['구조안전성', '건축마감', '설비노후도', '주거환경 적합성'],
    reportRule: '시장·군수는 안전진단결과보고서를 국토교통부장관에게 제출할 의무는 없음',
    caution: '안전진단결과보고서를 국토교통부장관에게 반드시 제출해야 한다고 오해하기 쉽지만, 그런 의무는 규정되어 있지 않다.',
    sources: [
      { label: '도시정비법 제12조', note: '재건축사업의 안전진단', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제12조' },
    ],
  },
  'maintenance-project-completion': {
    kind: 'completion-procedure-timeline', summary: '공사완료 절차는 순서를 묻는 문제와, "정비구역 해제 시점(다음 날)·해제의 효과(조합 존속)"를 뒤집어 출제하는 문제로 나뉜다.',
    procedure: ['공사완료', '준공인가(시장·군수등, 지방공사도 필요)', '준공인가 고시 및 공사완료 고시', '대지확정측량·토지분할', '관리처분계획에 따른 소유권 이전고시'],
    timing: ['정비구역 지정은 이전고시가 있은 날의 "다음 날"에 해제(당일 아님)', '소유권은 이전고시가 있은 날의 다음 날에 취득'],
    note: '준공인가로 인한 정비구역 해제가 있더라도 조합이 해산된 것으로 보지는 않음',
    caution: '정비구역 해제와 조합 해산을 같은 시점의 같은 효과로 착각하기 쉽지만, 준공인가로 인한 정비구역 해제는 조합의 존속에 영향을 미치지 않는다.',
    sources: [
      { label: '도시정비법 제83조·제86조', note: '준공인가와 이전고시', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제83조' },
    ],
  },
  'maintenance-subscription-notice': {
    kind: 'subscription-notice-board', summary: '분양신청 관련 숫자(60일 협의, 90일 수용재결 신청)와 재건축·재개발의 토지등소유자 정의 차이를 구분하는 것이 핵심이다.',
    timeline: ['관리처분계획 인가·고시 다음 날부터 60일 이내 손실보상 협의', '협의 불성립 시 그 만료일 다음 날부터 90일 이내 수용재결 신청 또는 매도청구소송'],
    noticeCommon: '분양신청 통지·분양공고 공통 포함사항: 분양을 신청하지 아니한 자에 대한 조치',
    ownerScope: { redevelopment: '토지 또는 건축물의 소유자, 그 지상권자 포함', reconstruction: '건축물 및 그 부속토지의 소유자로 한정(지상권자 제외)' },
    caution: '재개발사업과 재건축사업의 토지등소유자 범위를 동일하게 착각하기 쉽지만, 재건축사업에서는 지상권자가 토지등소유자에서 제외된다.',
    sources: [
      { label: '도시정비법 제2조 제9호·제72조', note: '토지등소유자의 정의와 분양신청', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제72조' },
    ],
  },
  'maintenance-liquidation-cost': {
    kind: 'liquidation-cost-rules-board', summary: '청산금·비용부담 규정은 "소멸시효 기간(5년)", "공탁 가능 여부", "국공유재산 처분 제한", "체납처분 위탁 방식"을 각각 다르게 서술해 오답을 만든다.',
    rules: [
      { item: '청산금 소멸시효', rule: '이전고시일 다음 날부터 5년(3년 아님)' },
      { item: '수령 거부 시', rule: '사업시행자가 공탁 가능' },
      { item: '정비구역 국공유재산', rule: '정비사업 외 목적으로 매각·양도 불가' },
      { item: '체납 징수(시장·군수등 아닌 시행자)', rule: '직접 징수 불가 — 시장·군수등에게 위탁해야 함' },
    ],
    caution: '청산금 소멸시효를 3년으로 착각하기 쉽지만, 실제로는 이전고시일 다음 날부터 5년이다.',
    sources: [
      { label: '도시정비법 제90조·제98조', note: '청산금과 비용부담', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제90조' },
    ],
  },
  'maintenance-small-housing-supply': {
    kind: 'small-housing-supply-board', summary: '국민주택규모 주택 공급·인수는 "인수 우선순위(시장·군수·구청장 → 시·도지사 → LH)"와 "임대주택 건설비율의 숫자"가 핵심 출제 포인트다.',
    priority: ['시장·군수·구청장', '시·도지사', '한국토지주택공사(인수 불가 시)'],
    process: ['인수자에게 공급할 주택은 공개추첨으로 선정', '인수 주택의 부속 토지는 인수자에게 기부채납한 것으로 봄'],
    ratio: '정비계획 입안권자는 재건축사업 세대수의 90% 이하(그 중 소형주택 30% 이하) 등 국토교통부장관 고시 비율을 정비계획에 반영',
    caution: '국민주택규모 주택의 인수 우선순위를 "시·도지사 먼저"로 착각하기 쉽지만, 실제로는 시장·군수·구청장이 먼저 우선하여 인수할 수 있는 구조다.',
    sources: [
      { label: '도시정비법 제79조', note: '국민주택규모 주택의 공급·인수', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제79조' },
    ],
  },
  'maintenance-lh-sole-implementation-rule': {
    kind: 'lh-implementation-regulation-board', summary: '조합방식의 정관 기재사항과 공공시행자의 시행규정 기재사항을 혼동시키는 문제이며, 토지등소유자 전체회의는 조합이 아닌 시행방식에서 등장하는 별개의 기구다.',
    required: ['토지등소유자의 권리·의무', '토지·건축물에 관한 권리의 평가방법', '정비사업의 시행연도·시행방법', '공고·공람 및 통지의 방법'],
    notRequired: '토지등소유자 전체회의에 관한 사항(시행규정의 필수 기재사항으로 명시되지 않음)',
    caution: '토지등소유자 전체회의를 시행규정의 필수 기재사항으로 착각하기 쉽지만, 실제 명시된 필수 기재사항이 아니다.',
    sources: [
      { label: '도시정비법 제53조', note: '시행규정의 기재사항', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제53조' },
    ],
  },
  'maintenance-land-lease-housing': {
    kind: 'land-lease-housing-numbers-board', summary: '숫자(주택 규모 90㎡, 임대기간 40년)를 정확히 암기하는 것이 관건이며, 다른 비슷한 숫자(100㎡, 50년 등)와 혼동하지 않아야 한다.',
    numbers: [
      { item: '전환 대상 주택 규모', value: '국민주택규모(전용면적 90㎡ 이하)' },
      { item: '토지임대부 분양주택 임대차기간', value: '40년의 범위' },
    ],
    condition: '정비구역 내 세입자·소규모 토지등소유자의 요청이 있는 경우에 한해 적용',
    caution: '토지임대부 분양주택의 규모·기간 숫자를 일반 국민주택 기준(85㎡)과 혼동하지 않도록 정확한 수치(90㎡, 40년)를 구분해 암기해야 한다.',
    sources: [
      { label: '도시정비법 제80조', note: '토지임대부 분양주택 전환', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제80조' },
    ],
  },
  'maintenance-association-officers': {
    kind: 'officer-qualification-board', summary: '조합 임원 문제는 "이사 정원 기준", "대의원 겸직 금지", "전문조합관리인 제도로 인한 당연퇴임"을 조합해 오답을 만든다.',
    facts: ['토지등소유자 100인 초과 조합은 이사 5명 이상', '조합임원 임기는 3년 이하 범위에서 정관으로 정하되 연임 가능', '조합장이 아닌 조합임원은 대의원이 될 수 없음', '전문조합관리인 선정 시 업무 대행 대상 임원은 당연 퇴임(퇴임 전 행위 효력은 유지)', '대의원회는 임기 중 궐위된 조합장을 보궐선임할 수 없음(총회에서만 가능)'],
    caution: '조합임원이 결격사유로 당연 퇴임하면 퇴임 전 행위도 모두 무효가 된다고 오해하기 쉽지만, 퇴임 전에 관여한 행위의 효력은 그대로 유지된다.',
    sources: [
      { label: '도시정비법 제41조·제43조', note: '조합임원의 수·임기와 대의원회', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제41조' },
    ],
  },
  'maintenance-general-meeting-representative': {
    kind: 'representative-delegation-scope-board', summary: '대의원회 대행 가능 여부는 "조합의 존속 자체에 관한 사항(해산)"인지 "운영·관리에 관한 사항"인지로 구분하면 판단하기 쉽다.',
    convene: '조합임원 관련 정관 변경 총회는 조합원 10분의 1 이상의 요구로 조합장이 소집하며, 개최 7일 전까지 통지 필요',
    delegable: ['조합임원의 해임', '정비사업비의 변경', '정비사업전문관리업자의 선정·변경'],
    notDelegable: '사업완료로 인한 조합의 해산에 관한 사항',
    caution: '대의원회가 조합임원 해임처럼 민감한 사항까지 대행할 수 없다고 오해하기 쉽지만, 실제로는 해임·사업비변경·용역업체선정은 대행 가능하고 오직 "조합 해산"만 대행할 수 없다.',
    sources: [
      { label: '도시정비법 제46조', note: '대의원회의 총회 권한 대행 범위', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제46조' },
    ],
  },
  'maintenance-preparation-committee-notice': {
    kind: 'preparation-committee-notice-filter', summary: '추진위원회의 등기우편 통지의무는 "조합설립 동의를 받기 위해 반드시 알려야 할 핵심 정보(비용분담기준)"에 한정된다.',
    required: '조합설립 동의서에 포함되는 정비사업비의 분담기준',
    notRequired: ['안전진단의 결과', '개략적인 사업시행계획서', '정비사업전문관리업자의 선정에 관한 사항', '추진위원회 위원의 선정에 관한 사항'],
    caution: '안전진단 결과나 추진위원 선정사항도 통지의무 대상이라고 확대 해석하기 쉽지만, 실제 명시된 통지대상은 정비사업비 분담기준 등 조합설립 동의서 관련 사항으로 한정된다.',
    sources: [
      { label: '도시정비법 제34조', note: '추진위원회의 운영과 통지의무', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제34조' },
    ],
  },
  'maintenance-resident-representative-assembly': {
    kind: 'resident-assembly-composition-board', summary: '주민대표회의는 조합이 없는 공공시행 방식에서 조합을 대신하는 주민 의견수렴 기구이며, "구성요건"과 "조직 구성"이 반복 출제 포인트다.',
    formation: '토지등소유자 과반수 동의 + 시장·군수등의 승인',
    composition: '위원장 포함 5명 이상 25명 이하 — 위원장·부위원장 각 1명, 감사 1명 이상 3명 이하(2명 고정 아님)',
    role: '사업시행자가 정비사업비 부담·건축물 철거 등 시행규정을 정할 때 의견 제시 가능(상가세입자도 철거 관련 의견 제시 가능)',
    caution: '주민대표회의의 감사 정원을 "2명"으로 고정한다고 착각하기 쉽지만 실제로는 1명 이상 3명 이하이며, 상가세입자는 의견 제시에서 배제된다고 오해하기 쉽지만 건축물 철거 사항 등에는 의견을 제시할 수 있다.',
    sources: [
      { label: '도시정비법 제47조', note: '주민대표회의', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제47조' },
    ],
  },
  'maintenance-implementation-methods': {
    kind: 'implementation-method-validity-filter', summary: '정비사업 시행방법을 사업 종류별로 나열한 지문에서, 실제 법령에 없는 방법을 끼워 넣어 오답을 만드는 패턴을 확인하는 카드다.',
    improvement: { allowed: ['토지등소유자 스스로 개량', '환지로 공급', '관리처분계획에 따라 주택·부대복리시설 건설·공급'], notAllowed: '오피스텔 건설·공급' },
    redevelopment: '인가받은 관리처분계획에 따라 건축물 건설·공급 + 환지로 공급 모두 가능',
    caution: '주거환경개선사업에도 오피스텔 건설·공급 방법이 포함된다고 오해하기 쉽지만, 오피스텔 건설은 주거환경개선사업의 법정 시행방법에 포함되지 않는다.',
    sources: [
      { label: '도시정비법 제23조', note: '정비사업의 시행방법', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제23조' },
    ],
  },
  'maintenance-common-utility-cost': {
    kind: 'common-utility-cost-board', summary: '비용부담 문제는 "누가 부담하는지"와 "공동구 설치·관리비용의 구체적 절차(선납비율, 부과주기)"로 나뉜다.',
    burden: ['정비사업비는 원칙적으로 사업시행자가 부담', '지자체는 시행자 정비사업에 보조·융자 가능(융자 알선뿐 아니라)', '국공유재산은 사업시행자·점유자·사용자에게 우선 수의계약 매각 가능', '공원·공공공지·공동구·공용주차장 건설비용은 시장·군수등이 부담 가능'],
    commonUtility: { prepay: '공사 착수 전 부담금의 3분의 1 이상 납부', cycle: '관리비용은 매년 부과(반기별 아님), 필요시 분기별 분할 납부' },
    caution: '공동구 설치비용의 부담비율 기준을 "권리지분비율"로 착각하기 쉽지만 실제로는 점용예정면적비율이며, 관리비용의 부과주기를 반기별로 잘못 기억하기 쉬운데 실제로는 매년 부과한다.',
    sources: [
      { label: '도시정비법 제92조·제94조', note: '비용의 부담과 공동구 설치비용', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제92조' },
    ],
  },
  'maintenance-housing-supply-general': {
    kind: 'rental-housing-acquisition-board', summary: '"누가 임대주택을 인수해야 하는지(시·도지사 우선, 국토교통부장관은 임의적)"와 "남은 주택의 처리"를 중심으로 정리하면 된다.',
    priority: '재개발임대주택 인수는 원칙적으로 시·도지사가 우선(국토교통부장관은 의무 아님)',
    surplus: '공급대상자에게 공급 후 남은 주택은 공급대상자 외의 자에게도 공급 가능',
    twoUnit: '종전 주택 전용면적 60㎡ 이하라도 세대원 전원 무주택 등 법정 요건 충족 시 2주택 공급 가능',
    caution: '국토교통부장관을 임대주택 인수의 1순위 의무자로 오해하기 쉽지만, 실제로는 시·도지사가 우선 인수 대상이고 국토교통부장관의 인수·전환은 재량적 성격이 강하다.',
    sources: [
      { label: '도시정비법 제79조', note: '임대주택 및 소형주택 공급·인수', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제79조' },
    ],
  },
  'maintenance-subscription-announcement': {
    kind: 'announcement-content-filter', summary: '분양공고는 "불특정 다수에게 알리는 일반 정보"만 담고, 개인별로 다른 금액 정보는 개별 통지사항으로 분리된다.',
    included: ['분양신청자격', '분양신청방법', '분양신청기간 및 장소', '분양대상 대지·건축물의 내역'],
    excluded: '분양대상자별 분담금의 추산액(개별 통지사항)',
    caution: '분담금 추산액도 공고사항으로 착각하기 쉽지만, 개인별 금액 정보는 공고가 아니라 개별 통지로 전달된다.',
    sources: [
      { label: '도시정비법 제72조', note: '분양공고 및 분양신청', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제72조' },
    ],
  },
  'maintenance-loss-compensation-negotiation': {
    kind: 'compensation-target-filter', summary: '손실보상 협의 대상은 "애초에 분양을 신청하지 않았거나 분양대상에서 제외된 자"로 한정되며, 신청 후 스스로 철회한 자는 다른 절차로 다뤄진다.',
    included: ['분양신청기간 내 분양신청을 하지 않은 자', '관리처분계획에 따라 분양대상에서 제외된 자'],
    excluded: '분양신청기간 종료 후 분양신청을 철회한 자',
    caution: '분양신청을 철회한 자도 신청을 하지 않은 자와 동일하게 취급된다고 오해하기 쉽지만, 철회자는 이 협의 대상 목록에서 제외된다.',
    sources: [
      { label: '도시정비법 제73조', note: '분양신청을 하지 아니한 자 등에 대한 조치', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제73조' },
    ],
  },
  'maintenance-temporary-housing': {
    kind: 'temporary-housing-obligation-filter', summary: '임시거주시설 조치는 재건축사업이 아니라 "주거환경개선사업"과 "재개발사업"에만 적용되는 사업시행자의 의무다.',
    applies: ['주거환경개선사업', '재개발사업'],
    notApplies: '재건축사업',
    measures: '정비구역 안팎의 임대주택 등 시설에 임시 거주 또는 주택자금 융자 알선 등 임시거주 상응조치(정비구역 소재 지자체 외 지역에도 가능)',
    caution: '재건축사업에도 임시거주시설 설치의무가 적용된다고 착각하기 쉽지만, 이 의무는 주거환경개선사업과 재개발사업에만 적용된다.',
    sources: [
      { label: '도시정비법 제61조', note: '임시거주시설·임시상가의 설치', href: 'https://www.law.go.kr/법령/도시및주거환경정비법/제61조' },
    ],
  },
  'building-terms-scope': {
    kind: 'landscaping-exemption-filter', summary: '조경 면제 대상은 "공장·물류시설 등 산업·생산시설 중 소규모 또는 산업단지 내"라는 공통점이 있으므로, 이 틀을 벗어나는 사례는 면제 대상이 아니다.',
    exempt: ['면적 5,000㎡ 미만 대지의 공장', '연면적 합계 1,500㎡ 미만 공장', '산업단지 안의 공장', '2층 이하·연면적 1,500㎡ 미만 공장·물류시설'],
    notExempt: '상업지역에 건축하는 물류시설, 녹지지역이 아닌 지역의 일정 규모 기숙사',
    caution: '상업지역에 건축하는 물류시설도 산업시설이라는 이유로 조경 의무가 면제된다고 착각하기 쉽지만, 물류시설은 조경 면제 목록(공장 중심)에 포함되지 않는다.',
    sources: [
      { label: '건축법 제42조·시행령 제27조', note: '대지의 조경 의무와 면제 대상', href: 'https://www.law.go.kr/법령/건축법/제42조' },
    ],
  },
  'building-terminology-general': {
    kind: 'building-terminology-board', summary: '용어정의는 비슷한 개념(이전·재축·대수선, 고층·초고층)의 경계선을 서로 바꿔치기하는 방식으로 출제되므로, 숫자 기준과 행위의 정의를 정확히 짝지어야 한다.',
    terms: [
      { term: '이전', desc: '같은 대지 내에서 건축물의 위치만 옮기는 것("건축"에 해당)' },
      { term: '대수선', desc: '증축·개축·재축이 아니면서 내력벽·기둥·보·지붕틀 등을 일정 규모(수선 벽면적 30㎡ 이상 등) 수선·변경' },
      { term: '고층건축물', desc: '층수 30층 이상 또는 높이 120m 이상(하나만 충족해도 해당)' },
      { term: '초고층건축물', desc: '층수 50층 이상 또는 높이 200m 이상' },
    ],
    traps: '천재지변 멸실 후 종전보다 연면적을 늘려 축조하면 "재축"이 아니라 "증축", 내력벽을 증설해 건축면적을 늘리면 "대수선"이 아니라 "증축"',
    caution: '건축물이 천재지변으로 멸실된 뒤 종전보다 연면적을 늘려 다시 지으면 "재축"으로 착각하기 쉽지만, 이는 "증축"에 해당한다.',
    sources: [
      { label: '건축법 제2조', note: '건축·대수선·고층건축물 등의 정의', href: 'https://www.law.go.kr/법령/건축법/제2조' },
    ],
  },
  'building-act-application-exclusion': {
    kind: 'building-act-exclusion-filter', summary: '적용 제외 대상은 "철도 운영·문화유산 보존·고속도로 통행료 징수 등 특수 목적의 시설"이라는 공통점이 있다.',
    excluded: ['철도 선로 부지의 플랫폼·운전보안시설·급수급탄급유시설·선로 아래 횡단 보행시설', '고속도로 통행료 징수시설', '지정·가지정 문화유산', '하천구역 내 수문조작실', '이동이 쉬운 컨테이너 이용 임시숙소'],
    included: '대지에 정착된(이동이 쉽지 않은) 컨테이너 이용 주택',
    caution: '컨테이너를 이용한 시설은 모두 적용 제외 대상이라고 일반화하기 쉽지만, 이동이 쉽지 않아 대지에 정착된 컨테이너 주택은 건축법의 적용을 받는다.',
    sources: [
      { label: '건축법 제3조', note: '건축법 적용 제외 대상', href: 'https://www.law.go.kr/법령/건축법/제3조' },
    ],
  },
  'multi-use-building-definition': {
    kind: 'multi-use-building-criteria-board', summary: '다중이용 건축물 판정은 "용도 목록에 있는지"와 "규모기준"을 함께 충족해야 하며, 관광휴게시설은 목록에서 제외된다.',
    uses: ['문화 및 집회시설(전시장·동식물원 제외)', '종교시설', '판매시설', '운수시설 중 여객용 시설', '의료시설 중 종합병원', '숙박시설 중 관광숙박시설'],
    scale: '해당 용도 바닥면적 합계 5천㎡ 이상이거나 16층 이상',
    excluded: '관광 휴게시설(용도 목록에서 제외)',
    caution: '관광휴게시설도 사람이 많이 모이는 시설이라는 이유로 다중이용 건축물에 포함된다고 착각하기 쉽지만, 법정 용도 목록에는 포함되지 않는다.',
    sources: [
      { label: '건축법 시행령 제2조', note: '다중이용 건축물의 정의', href: 'https://www.law.go.kr/법령/건축법시행령/제2조' },
    ],
  },
  'special-structure-building-exception': {
    kind: 'special-structure-criteria-board', summary: '특수구조 건축물은 "기둥 간 거리·돌출 구조 등 구조적으로 특이한 건축물"을 규제 강화 대상으로 삼는 제도이며, 무관한 규정까지 확대 적용되지 않는다.',
    criteria: ['한쪽 끝 고정·다른 끝 미지지 차양 등이 외벽 중심선으로부터 3m 이상 돌출', '기둥과 기둥 사이 거리(중심선 기준) 20m 이상(15m는 기준 미달)'],
    notExpanded: '안전관리 예치금 강화나 대지 조경 규정 변경 적용은 되지 않으며, 지방건축위원회 심의 신청도 건축주의 의무가 아님',
    caution: '기둥 간 거리 기준을 15m로 착각하기 쉽지만, 실제 특수구조 건축물 기준은 20m 이상이다.',
    sources: [
      { label: '건축법 시행령 제2조 제18호', note: '특수구조 건축물의 정의', href: 'https://www.law.go.kr/법령/건축법시행령/제2조' },
    ],
  },
  'structural-safety-documentation-submission': {
    kind: 'structural-safety-submission-board', summary: '구조 안전 확인서류 제출대상은 "주택류(단독·다세대)는 항상 포함, 규모가 일정 기준을 넘는 건축물도 포함"이라는 원칙과 "소규모 목구조 건축물은 예외"라는 원칙을 함께 기억해야 한다.',
    required: ['단독주택', '다세대주택', '처마높이 9m 이상인 건축물', '기둥과 기둥 사이 거리 10m 이상인 건축물'],
    exemption: '연면적 200㎡ 미만이고 3층 미만인 목구조 건축물은 제출대상에서 제외될 수 있음',
    caution: '모든 목구조 건축물이 예외라고 확대 해석하기 쉽지만, 목구조 예외는 연면적 200㎡ 미만이고 3층 미만인 경우로 한정된다.',
    sources: [
      { label: '건축법 시행령 제32조', note: '구조 안전의 확인 및 서류 제출', href: 'https://www.law.go.kr/법령/건축법시행령/제32조' },
    ],
  },
  'primary-structural-elements': {
    kind: 'primary-structural-filter', summary: '주요구조부 목록은 "건물 전체의 구조적 안전을 좌우하는 핵심 부재"만 포함하므로, 보조적·비핵심적인 부분은 빠진다.',
    included: ['내력벽', '기둥', '바닥', '보', '지붕틀', '주계단'],
    excluded: ['사이 기둥', '최하층 바닥', '작은 보', '차양', '옥외 계단'],
    caution: '"기둥"이 주요구조부라는 이유로 "사이 기둥"까지 포함된다고 확대 해석하기 쉽지만, 사이 기둥은 명시적으로 주요구조부에서 제외된다.',
    sources: [
      { label: '건축법 제2조 제1항 제7호', note: '주요구조부의 정의', href: 'https://www.law.go.kr/법령/건축법/제2조' },
    ],
  },
  'high-rise-evacuation-safety-zone': {
    kind: 'evacuation-zone-numbers-board', summary: '"몇 층인 건물부터 초고층으로 분류되는지"와 "피난안전구역 설치 간격(30개 층마다 1개소)" 두 숫자를 정확히 암기하는 것이 핵심이다.',
    classification: '층수 63층·높이 190m → 초고층건축물(층수 50층 이상 또는 높이 200m 이상 중 층수 기준 충족)',
    spacing: '피난층 또는 지상 통하는 직통계단과 직접 연결되는 피난안전구역을 지상층으로부터 최대 30개 층마다 1개소 이상 설치',
    caution: '피난안전구역 설치 간격을 20개 층으로 착각하기 쉽지만, 실제 기준은 최대 30개 층마다 1개소다.',
    sources: [
      { label: '건축법 시행령 제34조', note: '초고층건축물 등의 피난안전구역', href: 'https://www.law.go.kr/법령/건축법시행령/제34조' },
    ],
  },
  'site-preparation-structure-report': {
    kind: 'structure-report-threshold-board', summary: '공작물 유형별 정확한 높이·면적 기준선을 짚는 문제이며, 장식탑의 기준(4m 초과)이 다른 공작물과 다르다는 점이 핵심이다.',
    thresholds: [
      { item: '굴뚝', rule: '높이 6m 초과 시 신고' },
      { item: '방송·통신용 철탑 등', rule: '높이 4m 초과 시 신고' },
      { item: '옹벽·담장', rule: '높이 2m 초과 시 신고' },
      { item: '지하대피호', rule: '바닥면적 30㎡ 초과 시 신고' },
      { item: '장식탑', rule: '높이 4m 초과 시 신고(높이 4m는 미달 — 신고 대상 아님)' },
    ],
    caution: '장식탑의 신고 기준을 다른 공작물과 같은 수치로 착각하기 쉽지만, 정확히 "높이 4m를 넘는" 경우에만 신고 대상이므로 높이 4m 자체는 신고 대상이 아니다.',
    sources: [
      { label: '건축법 시행령 제118조', note: '대지 안의 공작물의 축조신고', href: 'https://www.law.go.kr/법령/건축법시행령/제118조' },
    ],
  },
  'floating-structure-site-boundary-relaxation': {
    kind: 'floating-relaxation-filter', summary: '완화 적용 대상은 "대지"와 관련된 기준에 한정되며, 건축물 자체의 구조안전성(내진등급)은 대지 범위 설정과 무관하므로 제외된다.',
    relaxable: ['대지의 조경', '공개 공지 등의 확보', '건축물의 높이 제한', '대지의 안전'],
    notRelaxable: '건축물 내진등급의 설정 기준',
    caution: '대지 관련 기준을 완화받을 수 있으면 구조 관련 기준(내진등급)도 함께 완화된다고 오해하기 쉽지만, 내진등급 기준은 완화 적용 요청 대상에서 제외된다.',
    sources: [
      { label: '건축법 제5조', note: '적용의 완화(수면 위 건축물)', href: 'https://www.law.go.kr/법령/건축법/제5조' },
    ],
  },
  'building-register-maintenance': {
    kind: 'register-maintenance-triggers-board', summary: '건축물대장 정비의무는 "정식 사용승인을 받은 경우"뿐 아니라 "허가·신고 대상이 아닌 건축물의 사후 기재 요청"과 "집합건물 신규등록"까지 포함한다.',
    triggers: ['허가권자가 사용승인서를 내준 경우', '건축허가·신고 대상 외 건축물 공사 완료 후 기재 요청이 있는 경우', '집합건물법에 따른 건축물대장 신규등록 신청이 있는 경우'],
    excluded: '가설건축물은 정비의무 대상에서 제외',
    caution: '건축물대장 정비의무를 "사용승인을 받은 경우"로만 한정하기 쉽지만, 허가·신고 대상이 아닌 건축물의 기재 요청이나 집합건물 신규등록의 경우에도 정비 의무가 발생한다.',
    sources: [
      { label: '건축법 제38조', note: '건축물대장', href: 'https://www.law.go.kr/법령/건축법/제38조' },
    ],
  },
  'site-evacuation-passage-requirements': {
    kind: 'evacuation-passage-width-board', summary: '통로 유효너비는 일반 1.5m가 기본이지만, 바닥면적 500㎡ 이상인 문화·집회·종교·의료·위락·장례시설은 3m로 올라가고, 필로티 통로가 2m 이상이면 보호시설이 추가로 필요하다.',
    generalWidth: '유효너비 1.5m 이상 (일반 대지 안의 통로)',
    specialCase: { threshold: '바닥면적 합계 500㎡ 이상', uses: '문화·집회·종교·의료·위락·장례시설', width: '유효너비 3m 이상' },
    piloti: '필로티 내 통로 길이가 2m 이상이면 안전을 위한 보호시설을 설치해야 하고, 통로와 차량 통행로의 단차가 있으면 그 차이를 표시해야 한다.',
    caution: '모든 대지 안의 통로를 1.5m로 암기하기 쉽지만, 문화·집회·종교·의료·위락·장례시설로서 바닥면적 500㎡ 이상이면 3m 이상으로 올라간다는 예외를 놓치면 안 된다.',
    sources: [
      { label: '건축법 시행령 제41조', note: '대지 안의 통로', href: 'https://www.law.go.kr/법령/건축법시행령/제41조' },
    ],
  },
  'type-1-neighborhood-facility': {
    kind: 'neighborhood-facility-classification-board', summary: '산후조리원은 규모와 무관하게 항상 제1종 근린생활시설이지만, 파출소는 바닥면적 합계가 1,000㎡를 넘으면 업무시설로 바뀐다는 점에서 둘의 판정 방식이 다르다.',
    always: { name: '산후조리원', rule: '규모(바닥면적)와 무관하게 항상 제1종 근린생활시설 (의원·치과의원·한의원·조산원과 같은 그룹)' },
    conditional: { name: '파출소·지구대·소방서·우체국 등', rule: '바닥면적 합계 1,000㎡ 미만이면 제1종 근린생활시설, 1,000㎡ 이상이면 업무시설' },
    caution: '산후조리원도 규모에 따라 업무시설로 바뀐다고 착각하기 쉽지만, 산후조리원은 규모 요건이 없는 제1종 근린생활시설이며, 규모(1,000㎡)로 갈리는 것은 파출소 등 공공업무시설 쪽이다.',
    sources: [
      { label: '건축법 시행령 별표1', note: '제1종 근린생활시설의 범위', href: 'https://www.law.go.kr/법령/건축법시행령/별표1' },
    ],
  },
  'building-line-narrow-road': {
    kind: 'narrow-road-building-line-board', summary: '소요너비에 못 미치는 도로에서 건축선은 원칙적으로 도로 중심선에서 소요너비의 1/2만큼 후퇴한 선이지만, 반대쪽에 하천·철도·선로부지 등이 있으면 그 경계선에서 소요너비 전체만큼 후퇴한다.',
    generalRule: '도로 양쪽에 대지가 있는 경우: 도로 중심선에서 소요너비의 1/2을 후퇴한 선',
    specialRule: '도로 반대쪽에 경사지·하천·철도·선로부지 등이 있는 경우: 그 반대쪽 경계선에서 소요너비에 해당하는 수평거리만큼 후퇴한 선',
    caution: '모든 경우에 중심선에서 1/2만 후퇴한다고 암기하면, 반대쪽이 하천·철도인 특수한 경우 건축선을 잘못 계산하게 된다 — 이 경우는 반대쪽 경계선 기준 전체 후퇴다.',
    sources: [
      { label: '건축법 제2조·제46조', note: '도로의 정의 및 건축선의 지정', href: 'https://www.law.go.kr/법령/건축법/제46조' },
    ],
  },
  'major-renovation-definition': {
    kind: 'major-renovation-threshold-board', summary: '대수선은 구조부재별로 "3개 이상" 수선·변경하거나 내력벽 면적 30㎡ 이상을 수선하는 경우, 또는 피난계단·특별피난계단을 증설·해체·수선변경하는 경우로 판정한다.',
    thresholds: [
      { item: '내력벽', rule: '벽면적 30㎡ 이상 수선·변경' },
      { item: '기둥·보·지붕틀', rule: '각각 3개 이상 수선·변경' },
      { item: '방화벽·방화구획을 위한 바닥·벽', rule: '증설·해체하거나 수선·변경' },
      { item: '주계단·피난계단·특별피난계단', rule: '증설·해체하거나 수선·변경' },
    ],
    caution: '기둥·보·지붕틀은 "3개 이상"이라는 개수 기준이고 내력벽은 "30㎡ 이상"이라는 면적 기준이라는 점을 서로 바꿔 외우지 않도록 주의해야 한다.',
    sources: [
      { label: '건축법 제2조제1항제9호', note: '대수선의 정의', href: 'https://www.law.go.kr/법령/건축법/제2조' },
    ],
  },
  'interior-finishing-material-regulation': {
    kind: 'interior-finish-blank-fill-board', summary: '내부 마감재료 규정은 "마감재료(무엇을) — 방화(어떤 성능) — 실내공기질(추가 고려기준)"이라는 세 빈칸을 순서대로 채우는 문제로 반복 출제된다.',
    blanks: [
      { label: 'ㄱ (무엇을 규제하는가)', correct: '마감재료', wrong: '난연재료 · 완충재료' },
      { label: 'ㄴ (확보해야 할 성능)', correct: '방화', wrong: '내진 · 공기청정' },
      { label: 'ㄷ (추가로 고려할 기준)', correct: '실내공기질', wrong: '공기청정' },
    ],
    caution: '"공기청정"이라는 그럴듯한 오답이 실내공기질 자리와 방화 성능 자리 모두에 섞여 나오므로, ㄴ은 방화, ㄷ은 실내공기질로 정확히 짝지어 암기해야 한다.',
    sources: [
      { label: '건축법 제52조', note: '건축물의 마감재료', href: 'https://www.law.go.kr/법령/건축법/제52조' },
    ],
  },
  'combined-building': {
    kind: 'combined-building-scope-board', summary: '결합건축이 가능한 지역·구역에는 상업지역·역세권개발구역·건축협정구역·특별가로구역이 포함되지만 리모델링 활성화구역은 제외되며, 협정서에는 조정된 용적률 등을 적어야 하되 지방세 납세증명서는 기재사항이 아니다.',
    scope: { in: ['상업지역', '역세권개발구역', '건축협정구역', '특별가로구역'], out: '리모델링 활성화구역 (결합건축 대상 아님)' },
    agreementItems: { required: ['대상 대지의 용도지역', '협정체결자 인적사항(자연인: 성명·주소·생년월일 / 법인: 명칭·소재지·대표자 성명)', '대지별 건축계획서', '조례로 정한 용적률과 조정되어 적용되는 대지별 용적률'], notRequired: '법인의 지방세 납세증명서' },
    caution: '리모델링 활성화구역도 결합건축 대상에 포함된다고 착각하거나, 지방세 납세증명서를 협정서 기재사항으로 잘못 고르는 함정에 유의해야 한다.',
    sources: [
      { label: '건축법 제77조의15', note: '결합건축 대상지', href: 'https://www.law.go.kr/법령/건축법/제77조의15' },
    ],
  },
  'special-building-zone': {
    kind: 'special-zone-exemption-filter', summary: '특별건축구역에서 국가가 건축하는 건축물은 대지의 조경(제42조)과 대지의 분할 제한(제57조)은 적용하지 않을 수 있지만, 대지와 도로의 관계(제44조)·대지 안의 공지(제58조)는 그대로 적용된다.',
    exemptable: ['대지의 조경 (제42조)', '대지의 분할 제한 (제57조)'],
    notExemptable: ['대지와 도로의 관계 (제44조)', '대지 안의 공지 (제58조)'],
    caution: '특별건축구역 지정이 있으면 관련 규정이 전부 배제된다고 착각하기 쉽지만, 대지와 도로의 관계·대지 안의 공지는 특별건축구역에서도 그대로 적용된다.',
    sources: [
      { label: '건축법 제73조', note: '특별건축구역 내 건축기준의 적용 특례', href: 'https://www.law.go.kr/법령/건축법/제73조' },
    ],
  },
  'building-dispute-committee': {
    kind: 'dispute-committee-party-filter', summary: '건축분쟁전문위원회는 건축관계자 상호간 또는 이들과 인근주민 간의 분쟁을 다루지만, 당사자 중 하나가 건축허가권자(행정청)인 분쟁은 조정·재정 대상에서 제외된다.',
    inScope: ['건축관계자(건축주·공사시공자·관계전문기술자·공사감리자) 상호간의 분쟁', '건축관계자와 인근주민 간의 분쟁'],
    outScope: '건축허가권자가 당사자인 분쟁 (허가신청자·신고수리자·공사감리자·인근주민과의 분쟁 등)',
    extra: '건축민원전문위원회는 도지사·시장·군수·구청장이 설치하며, 심의 신청은 원칙적으로 문서로 하되 구술 신청도 예외적으로 가능하다.',
    caution: '허가권자와 인근주민·시공자 간의 분쟁도 건축분쟁전문위원회 대상이라고 착각하기 쉽지만, 허가권자가 당사자인 분쟁은 원칙적으로 대상에서 제외된다.',
    sources: [
      { label: '건축법 제88조·제92조', note: '건축분쟁전문위원회·건축민원전문위원회', href: 'https://www.law.go.kr/법령/건축법/제88조' },
    ],
  },
  'building-safety-evaluation': {
    kind: 'safety-evaluation-process-board', summary: '안전영향평가는 건축허가 "전"에 실시하며 평가기관은 의뢰받은 날부터 30일 이내(부득이하면 연장 가능)에 결과를 제출하고, 그 결과는 건축위원회 심의를 거쳐 확정·공개된다.',
    steps: [
      { item: '실시 시점', rule: '건축허가 전 (허가 이후 아님)' },
      { item: '결과 제출 기한', rule: '의뢰받은 날부터 30일 이내, 부득이한 경우 연장 가능' },
      { item: '확정 절차', rule: '건축위원회 심의 (도시계획위원회 아님)' },
      { item: '공개 방법', rule: '건축행정 시스템 등에 공개 (일간신문 게재 아님)' },
    ],
    excludedReview: '지방건축위원회가 결정하는 사항은 안전영향평가기관의 검토사항에 포함되지 않는다.',
    caution: '평가 결과가 도시계획위원회 심의로 확정되거나 일간신문 게재로 공개된다고 착각하기 쉽지만, 실제로는 건축위원회 심의와 건축행정 시스템 등을 통한 공개다.',
    sources: [
      { label: '건축법 제13조의2', note: '건축물 안전영향평가', href: 'https://www.law.go.kr/법령/건축법/제13조의2' },
    ],
  },
  'public-open-space': {
    kind: 'public-open-space-rules-board', summary: '공개공지등은 일반주거·준주거·상업·준공업지역 등에 설치하며 전용주거·전용공업·녹지지역은 원칙적으로 대상이 아니고, 필로티 구조 설치가 가능하며 연간 최장 60일 문화행사·판촉활동이 허용된다.',
    scope: { in: ['일반주거지역', '준주거지역', '상업지역', '준공업지역'], out: '전용주거지역·전용공업지역·녹지지역 (원칙적으로 대상 아님)' },
    rules: ['필로티 구조로 설치 가능', '연간 최장 60일 문화행사·판촉활동 허용', '울타리·담장 설치 등으로 출입 제한하는 행위는 원칙적으로 금지', '노후 산업단지 정비 필요 지정·공고 지역에도 설치 가능'],
    caution: '문화행사·판촉활동 허용일수를 90일로 착각하거나, 노후 산업단지 정비지역은 공개공지 설치가 배제된다고 오해하기 쉽다 — 정답은 60일이며 노후 산업단지 정비지역도 설치 가능하다.',
    sources: [
      { label: '건축법 제43조', note: '공개 공지 등의 확보', href: 'https://www.law.go.kr/법령/건축법/제43조' },
    ],
  },
  'evacuation-facility-obligations': {
    kind: 'exit-seismic-threshold-board', summary: '전시장은 바닥면적 합계 300㎡ 이상이면 출구 설치 의무 대상이 되고, 높이 13m·처마높이 9m·기둥사이 거리 10m 이상인 건축물 등은 내진능력 공개 대상이 된다.',
    thresholds: [
      { item: '출구 설치 의무 (전시장 등)', rule: '바닥면적 합계 300㎡ 이상' },
      { item: '내진능력 공개 (높이)', rule: '높이 13m 이상' },
      { item: '내진능력 공개 (처마높이)', rule: '처마높이 9m 이상' },
      { item: '내진능력 공개 (기둥 간 거리)', rule: '기둥과 기둥 사이의 거리 10m 이상' },
    ],
    caution: '공개공지 설치 대상 용도와 출구 설치 의무 대상 용도를 혼동하기 쉽다 — 각각 별도의 기준과 대상 목록을 가지며, 국가적 문화유산 보존가치 건축물은 내진능력 공개 대상 목록에 포함되지 않는다.',
    sources: [
      { label: '건축법 제49조·제48조의3', note: '출구 설치 의무 및 내진능력 공개', href: 'https://www.law.go.kr/법령/건축법/제49조' },
    ],
  },
  'street-height-limit': {
    kind: 'street-height-factors-board', summary: '허가권자는 가로구역을 단위로 건축물 높이를 지정·공고할 수 있으며, 도로 폭이나 토지이용상황 등 지역 특성과 건축물의 용도·형태까지 종합적으로 고려해 같은 가로구역 안에서도 높이를 다르게 정할 수 있다.',
    factors: ['도로의 폭', '해당 지역의 토지이용상황', '건축물의 용도·형태(같은 가로구역이라도 다르게 정할 수 있음)'],
    caution: '가로구역별 높이제한을 도로 폭 하나로만 정한다고 단순화하기 쉽지만, 토지이용계획 등 다른 요소도 함께 고려되고 동일 가로구역이라도 용도·형태별로 다르게 정해질 수 있다.',
    sources: [
      { label: '건축법 제60조', note: '건축물의 높이 제한', href: 'https://www.law.go.kr/법령/건축법/제60조' },
    ],
  },
  'housing-bond': {
    kind: 'housing-bond-issuer-board', summary: '주택상환사채는 한국토지주택공사와 법정 요건·보증을 갖춘 등록사업자만 국토교통부장관의 승인을 받아 발행할 수 있는 기명증권이며, 명의변경은 채권원부 기록으로 하고 등록말소 후에도 효력이 유지된다.',
    issuers: ['한국토지주택공사 (요건 없이 발행 가능)', '등록사업자 (자본금·시공능력 등 요건 + 금융기관 등의 보증 + 국토교통부장관 승인 필요)'],
    rules: ['기명증권으로 발행', '명의변경은 취득자의 성명·주소를 채권원부에 기록하는 방법으로 함', '등록사업자의 등록이 말소되어도 사채의 효력에는 영향 없음', '납입금은 해당 주택건설사업에 필요한 용도로만 사용'],
    caution: '등록사업자라면 누구나 자유롭게 발행할 수 있다고 오해하기 쉽지만, 법정 요건과 국토교통부장관의 승인, 금융기관 등의 보증이 모두 필요하다.',
    sources: [
      { label: '주택법 제80조', note: '주택상환사채', href: 'https://www.law.go.kr/법령/주택법/제80조' },
    ],
  },
  'registered-housing-business-operator': {
    kind: 'business-registration-exemption-filter', summary: '연간 대통령령으로 정하는 호수 이상의 주택건설사업을 시행하려면 국토교통부장관에게 등록해야 하지만, 국가·지방자치단체·한국토지주택공사·지방공사는 등록 없이 사업을 시행할 수 있다.',
    mustRegister: '연간 대통령령으로 정하는 호수 이상의 주택건설사업을 시행하려는 자',
    exempt: ['국가', '지방자치단체', '한국토지주택공사', '지방공사'],
    caution: '국가·지자체·LH·지방공사도 일정 규모 이상이면 등록해야 한다고 오해하기 쉽지만, 이들 공공 주체는 등록 의무의 예외 대상이다.',
    sources: [
      { label: '주택법 제4조', note: '주택건설사업자 등의 등록', href: 'https://www.law.go.kr/법령/주택법/제4조' },
    ],
  },
  'sale-price-cap-inspection': {
    kind: 'resale-restriction-consent-board', summary: '전매제한 예외 사유는 해외 체류·상속 이전·경매(공매) 등 여러 유형이 있지만, 국가·지자체·금융기관·주택도시보증공사에 대한 채무불이행으로 인한 경매·공매의 경우를 포함해 어느 경우든 사업주체(한국토지주택공사)의 동의를 받아야만 전매할 수 있다.',
    amended: true,
    exceptions: ['세대원 전원이 2년 이상 해외 체류 (동의 필요)', '상속으로 취득한 주택으로 세대원 전원 이전 (동의 필요)', '국가·지자체·금융기관·주택도시보증공사에 대한 채무불이행으로 인한 경매·공매 (동의 필요)'],
    caution: '국가에 대한 채무불이행으로 인한 공매는 사업주체 동의 없이도 전매할 수 있다고 착각하기 쉽지만, 실제로는 이 경우에도 사업주체(한국토지주택공사)의 동의를 받아야 한다.',
    sources: [
      { label: '주택법 시행령 제73조', note: '전매행위 제한기간 및 전매가 불가피한 경우', href: 'https://www.law.go.kr/법령/주택법시행령/제73조' },
    ],
  },
  'housing-supply-general-rules': {
    kind: 'housing-supply-rules-board', summary: 'LH가 50%를 초과 출자한 리츠는 입주자 모집 승인이 면제되고, 관광특구의 50층 이상(또는 150m 이상) 공동주택은 분양가상한제 적용에서 제외되며, 마감자재는 다르게 시공해도 같은 질 이상이어야 한다.',
    rules: [
      { item: '입주자 모집 승인 면제', rule: 'LH가 총지분 50% 초과 출자한 부동산투자회사가 사업주체인 경우' },
      { item: '분양가상한제 제외(관광특구)', rule: '층수 50층 이상 또는 높이 150m 이상 공동주택 — 어느 하나만 충족해도 제외' },
      { item: '분양가상한제 적용지역 지정권자', rule: '국토교통부장관 (시·도지사 아님, 주거정책심의위원회 심의)' },
      { item: '마감자재 변경 시공', rule: '당초 자재와 같은 질 이상으로 설치' },
      { item: '입주자 지위 양도', rule: '투기과열지구 내 지위는 매매 불가, 상속은 예외적으로 허용' },
    ],
    caution: '51층·140m처럼 두 기준 중 하나만 충족해도 분양가상한제 제외 대상이 될 수 있다는 점과, 마감자재는 "같은 질 이하"가 아니라 "같은 질 이상"이어야 한다는 점을 혼동하지 않아야 한다.',
    sources: [
      { label: '주택법 제54조·제57조', note: '주택의 공급 및 분양가상한제', href: 'https://www.law.go.kr/법령/주택법/제57조' },
    ],
  },
  'post-inspection-sale-claim': {
    kind: 'post-inspection-sale-claim-board', summary: '사용검사 후 대지 소유권을 회복한 자가 있으면, 그 토지 면적이 주택단지 전체 대지면적의 100분의 5 미만인 경우에 한해 그 사실을 안 날부터 2년 이내에 매도청구를 할 수 있다.',
    areaLimit: '해당 토지 면적이 주택단지 전체 대지면적의 100분의 5 미만',
    deadline: '소유권 회복 사실을 안 날부터 2년 이내',
    caution: '매도청구 기한을 1년이나 3년으로 착각하기 쉽지만, 정확한 기한은 사실을 안 날부터 2년이다.',
    sources: [
      { label: '주택법 제62조', note: '사용검사 후 매도청구 등', href: 'https://www.law.go.kr/법령/주택법/제62조' },
    ],
  },
  'housing-redemption-bond-detail': {
    kind: 'bond-issuance-limits-board', summary: '주택상환사채는 기명증권이며 등록말소 후에도 효력이 유지되고, 등록사업자가 발행할 수 있는 규모는 최근 3년간 연평균 주택건설 호수 이내, 상환기간은 3년을 초과할 수 없다.',
    limits: [
      { item: '증권 형태', rule: '기명증권 (무기명증권 아님)' },
      { item: '발행 규모 상한', rule: '최근 3년간의 연평균 주택건설 호수 이내 (5년간 아님)' },
      { item: '상환기간', rule: '3년 초과 불가 (5년 이내 아님)' },
      { item: '등록말소 시 효력', rule: '이미 발행한 사채의 효력에는 영향 없음' },
    ],
    caution: '발행규모·상환기간 기준(최근 3년, 상환기간 3년 이내)을 5년으로 잘못 기억하지 않도록 유의해야 한다.',
    sources: [
      { label: '주택법 제80조·시행령 제87조', note: '주택상환사채의 발행 규모 및 상환기간', href: 'https://www.law.go.kr/법령/주택법시행령/제87조' },
    ],
  },
  'remodeling-detail-rules': {
    kind: 'remodeling-approval-board', summary: '공동주택 리모델링은 동별로도 가능하고 시장·군수·구청장의 허가(시·도지사 아님)를 받아야 하며, 주택단지 전체 리모델링 조합 설립에는 구분소유자·의결권 각 3분의 2 이상 결의가, 12층 건물의 수직증축은 2개 층까지 필요·가능하다.',
    facts: [
      { item: '허가권자', rule: '시장·군수·구청장 (시·도지사 아님)' },
      { item: '단위', rule: '동별로도 리모델링 가능' },
      { item: '조합 설립 동의율(전체 리모델링)', rule: '구분소유자·의결권 각 3분의 2 이상 (과반수 아님)' },
      { item: '수직증축 상한(12층 건물)', rule: '2개 층까지 증축 가능' },
    ],
    caution: '조합 설립 동의요건을 과반수로 착각하기 쉽지만, 실제로는 구분소유자와 의결권의 각 3분의 2 이상이 필요하다.',
    sources: [
      { label: '주택법 제66조·제68조', note: '리모델링의 허가 및 권리변동계획', href: 'https://www.law.go.kr/법령/주택법/제66조' },
    ],
  },
  'housing-supervisor-duties': {
    kind: 'supervisor-duty-timeline-board', summary: '감리자는 위반 사항 발견 시 지체 없이 시정 통지 후 7일 이내에 사업계획승인권자에게 보고해야 하며, 위반을 알고도 묵인하면 1년의 범위에서 감리업무 지정이 제한될 수 있다.',
    timeline: [
      { item: '위반 사항 발견 시', rule: '지체 없이 시공자·사업주체에 시정 통지' },
      { item: '보고 기한', rule: '7일 이내 사업계획승인권자에게 보고' },
      { item: '묵인 시 제재', rule: '1년의 범위에서 감리업무 지정 제한 (2년 아님)' },
    ],
    caution: '감리업무 지정 제한기간을 2년으로 착각하기 쉽지만, 실제로는 1년의 범위에서 제한할 수 있다.',
    sources: [
      { label: '주택법 제44조', note: '감리자의 업무 등', href: 'https://www.law.go.kr/법령/주택법/제44조' },
    ],
  },
  'sale-price-cap-application-detail': {
    kind: 'purchase-price-formula-board', summary: '공공택지 외 택지의 분양가상한제 적용주택이 분양가격 80~100% 미만·보유 3~4년 미만이면 LH는 매입비용 25%+인근시세 75%로 매입하며, 도시형 생활주택은 적용 제외, 공시 항목에서 간접비는 제외된다.',
    formula: '매입비용의 25% + 인근지역주택매매가격의 75%',
    conditions: '분양가격이 인근지역주택매매가격의 80% 이상 100% 미만, 보유기간 3년 이상 4년 미만',
    notes: ['도시형 생활주택은 분양가상한제 적용주택 아님', '공공택지 분양가격 공시 항목에서 간접비는 제외'],
    caution: '매입비용·인근시세 비율(25%/75%)을 반대로 외우거나, 간접비가 공시 항목에 포함된다고 착각하지 않도록 유의해야 한다.',
    sources: [
      { label: '주택법 시행령 제63조·제61조', note: '분양가상한제 적용주택의 매입금액 및 분양가격 공시', href: 'https://www.law.go.kr/법령/주택법시행령/제63조' },
    ],
  },
  'housing-act-criminal-penalty': {
    kind: 'penalty-vs-fine-filter', summary: '관계 공무원의 사업장 출입·검사를 방해한 자는 징역·벌금 대상이지만, 품질점검단 점검 불응, 조합 임원 겸직, 거주의무 조사 기피, 보수·보강 조치명령 불이행은 모두 과태료 대상이다.',
    criminal: '관계 공무원의 사업장 출입·검사를 방해한 자',
    fineOnly: ['공동주택 품질점검단의 점검에 따르지 않은 사업주체', '다른 주택조합의 발기인을 겸직한 조합 임원', '거주의무자 실제 거주 여부 조사를 기피한 자', '품질점검단 조치명령을 이행하지 않은 사업주체'],
    caution: '품질점검단 관련 의무 위반이나 조사 기피도 형사처벌 대상이라고 확대 해석하기 쉽지만, 이들은 징역·벌금이 아니라 과태료 부과대상에 그친다.',
    sources: [
      { label: '주택법 제102조·제106조', note: '벌칙 및 과태료', href: 'https://www.law.go.kr/법령/주택법/제106조' },
    ],
  },
  'use-inspection-detail-procedure': {
    kind: 'use-inspection-applicant-board', summary: '사용검사권자는 원칙적으로 시장·군수·구청장이지만 국가·한국토지주택공사 등 공공사업주체는 국토교통부장관이며, 사업주체 파산 시에는 시공보증자·입주예정자만 사용검사를 받을 수 있고 시공자는 포함되지 않는다.',
    amended: true,
    inspector: { normal: '원칙: 시장·군수·구청장', exception: '국가·한국토지주택공사 등 공공사업주체·대통령령으로 정하는 경우: 국토교통부장관' },
    normal: '신청 원칙: 사업주체, 신청일부터 15일 이내 검사',
    exceptionOk: ['해당 주택의 시공을 보증한 자', '입주예정자 (대표회의 신청 시 하자보수보증금 예치 필요)'],
    exceptionExcluded: '해당 주택의 시공자 (파산 등의 경우에는 예외 신청권자에서 제외됨)',
    caution: '한국토지주택공사도 항상 시장·군수·구청장의 사용검사를 받는다고 착각하거나, 파산 시 예외 신청권자에 시공자까지 포함된다고 착각하기 쉽다 — LH 등 공공사업주체는 국토교통부장관, 파산 시에는 시공보증자·입주예정자만 가능하다.',
    sources: [
      { label: '주택법 제49조', note: '사용검사 등', href: 'https://www.law.go.kr/법령/주택법/제49조' },
    ],
  },
  'pre-move-in-inspection-visit': {
    kind: 'pre-move-in-timeline-board', summary: '사전방문은 입주지정기간 시작일 45일 전까지 2일 이상 실시하고 계획은 1개월 전까지 제출하며, 하자 여부 확인 요청 및 조치계획 제출은 각각 7일 이내에 해야 한다.',
    timeline: [
      { item: '사전방문계획 제출', rule: '사전방문기간 시작일 1개월 전까지' },
      { item: '사전방문 실시', rule: '입주지정기간 시작일 45일 전까지 2일 이상 (60일 전·1일 이상 아님)' },
      { item: '하자 여부 확인·통보', rule: '확인 요청받은 날부터 7일 이내' },
      { item: '조치계획 제출', rule: '사전방문기간 종료일부터 7일 이내' },
    ],
    caution: '사전방문 기한을 "60일 전, 1일 이상"으로 착각하기 쉽지만, 정확한 기준은 "45일 전까지 2일 이상"이다.',
    sources: [
      { label: '주택법 제48조의2', note: '사전방문 등', href: 'https://www.law.go.kr/법령/주택법/제48조의2' },
    ],
  },
  'subscription-savings-rules': {
    kind: 'subscription-savings-notice-board', summary: '입주자저축은 1인 1계좌만 가입할 수 있고, 국토교통부장관의 정보 제공 요청에는 금융실명법에도 불구하고 응해야 하며, 명의인이 통보를 요구하면 정보 제공사실을 반드시 통보해야 한다.',
    amended: true,
    facts: ['국민주택·민영주택 공급용 주택청약종합저축, 1인 1계좌만 가입 가능', '국토교통부장관의 정보 제공 요청 시 「금융실명법」에도 불구하고 제공해야 함', '명의인이 제공사실 통보를 요구하면 통보해야 함(거부 불가)'],
    caution: '명의인이 요구해도 통보하지 않을 수 있다고 착각하기 쉽지만, 실제로는 명의인이 요구하면 제공사실을 반드시 통보해야 한다.',
    sources: [
      { label: '주택법 제88조', note: '입주자저축', href: 'https://www.law.go.kr/법령/주택법/제88조' },
    ],
  },
  'housing-quality-inspection-panel': {
    kind: 'quality-panel-numbers-board', summary: '품질점검단은 시·도지사가 설치·운영하며, 점검 종료일부터 5일 이내 결과 제출, 사용검사권자는 그 결과를 2년 이상 보관해야 하고, 위원은 관련 경력 5년 이상이어야 한다.',
    amended: true,
    facts: [
      { item: '설치·운영 주체', rule: '시·도지사 (시장·군수·구청장 아님)' },
      { item: '결과 제출 기한', rule: '점검 종료일부터 5일 이내 (3일 아님)' },
      { item: '결과 보관 기간', rule: '사용검사가 있은 날부터 2년 이상 (3년·5년 아님)' },
      { item: '위원 경력 요건', rule: '공동주택 지도·감독 및 인·허가 업무 경력 5년 이상 (4년 미달)' },
    ],
    caution: '설치·운영 주체를 시장·군수·구청장으로 착각하거나, 결과 보관기간을 3년·5년으로 착각하기 쉽다 — 실제로는 시·도지사가 설치·운영하고 보관기간은 2년 이상이다.',
    sources: [
      { label: '주택법 제48조의3', note: '공동주택 품질점검단', href: 'https://www.law.go.kr/법령/주택법/제48조의3' },
    ],
  },
  'farmland-entrustment-standard': {
    kind: 'farmer-recognition-or-board', summary: '농지 여부는 지목이 아닌 실제 이용 상황으로 판단하며, 농업인 인정 기준은 면적(1천㎡)·일수(90일), 사육두수·종사일수(120일)가 각각 "또는" 관계이므로 둘 중 하나만 충족해도 인정된다.',
    amended: true,
    orPairs: [
      { pair: '농지 면적 1천㎡ 이상 경작 OR 1년 90일 이상 종사', example: '3,000㎡ 농지에서 80일만 종사해도 면적 기준 충족으로 농업인 인정' },
      { pair: '가축 사육두수(소가축 100두 등) OR 1년 120일 이상 축산업 종사', example: '소가축 80두(두수 미달)라도 150일 종사했다면 일수 기준 충족으로 농업인 인정' },
    ],
    caution: '면적·일수, 두수·일수 기준을 동시에 충족해야 한다고 착각하기 쉽지만, 실제로는 각각 "또는" 관계이므로 하나만 충족해도 농업인으로 인정된다.',
    sources: [
      { label: '농지법 시행령 제3조', note: '농업인의 범위', href: 'https://www.law.go.kr/법령/농지법시행령/제3조' },
    ],
  },
  'farmland-lease-rules': {
    kind: 'farmland-lease-term-board', summary: '농지 임대차는 등기 없이도 확인+인도 다음 날부터 제3자 효력이 생기며, 국유재산 농지는 3년 미만도 가능하지만 일반 농지는 3년 이상(시설 설치 시 10년 이상), 위반 시 종료명령권자는 시장·군수·구청장이다.',
    facts: ['대항력: 등기 불요, 확인+인도의 다음 날부터 발생', '국유재산 농지: 임대차기간 3년 미만도 가능', '일반 농지: 3년 이상 (비닐하우스 등 시설 설치 시 10년 이상)', '임대차 종료 명령권자: 시장·군수·구청장 (읍·면장 아님)'],
    caution: '임대차 종료 명령권자를 읍·면장으로 착각하거나, 시설농지 임대차기간을 3년으로 착각하기 쉽다 — 명령권자는 시장·군수·구청장, 시설농지는 10년 이상이다.',
    sources: [
      { label: '농지법 제24조·제25조', note: '농지 임대차의 대항력 및 임대차기간', href: 'https://www.law.go.kr/법령/농지법/제24조' },
    ],
  },
  'farmland-acquisition-certificate-exemption': {
    kind: 'acquisition-certificate-exemption-filter', summary: '시효 완성·공유 농지 분할·농업법인 합병·국가/지자체 소유·상속으로 취득하면 농지취득자격증명이 면제되지만, 주말·체험영농 목적 취득은 진흥지역 안팎을 불문하고 증명이 필요하다.',
    exempt: ['시효의 완성으로 취득', '공유 농지의 분할로 취득', '농업법인의 합병으로 취득', '국가·지방자치단체의 농지 소유', '상속(유증 포함)으로 취득'],
    notExempt: '주말·체험영농 목적의 농업진흥지역 외 농지 취득 (증명 필요)',
    caution: '주말·체험영농 목적의 취득도 예외적으로 증명이 면제된다고 착각하기 쉽지만, 이는 자발적 취득이므로 진흥지역 안팎을 불문하고 증명 발급이 필요하다.',
    sources: [
      { label: '농지법 제8조', note: '농지취득자격증명', href: 'https://www.law.go.kr/법령/농지법/제8조' },
    ],
  },
  'farmland-ownership-exception': {
    kind: 'non-cultivation-ownership-filter', summary: '8년 이상 농업경영 후 이농 시 1만㎡까지, 공익사업·매립농지 취득, 학교의 연구지·실습지, 진흥지역 "외" 주말·체험영농 목적이면 자경하지 않아도 소유할 수 있지만, 진흥지역 "내"는 이 예외로 소유할 수 없다.',
    exempt: ['8년 이상 농업경영 후 이농 — 이농 당시 소유 농지 중 1만㎡까지', '공익사업으로 농지 취득', '공유수면 매립농지 취득', '학교의 연구지·실습지 취득', '주말·체험영농 목적 — 농업진흥지역 "외"의 농지'],
    notExempt: '주말·체험영농 목적의 농업진흥지역 "내" 농지 소유 (예외 대상 아님)',
    caution: '주말·체험영농 예외가 진흥지역 안팎을 가리지 않는다고 착각하기 쉽지만, 반드시 진흥지역 "외"의 농지에만 적용된다.',
    sources: [
      { label: '농지법 제6조', note: '농지 소유 제한 및 예외', href: 'https://www.law.go.kr/법령/농지법/제6조' },
    ],
  },
  'agricultural-promotion-area-designation': {
    kind: 'promotion-area-exclusion-filter', summary: '농업진흥지역은 특별시의 녹지지역에는 지정할 수 없지만, 특별시의 관리지역·광역시의 관리지역·농림지역·군의 자연환경보전지역에는 소속 행정구역과 무관하게 지정할 수 있다.',
    excluded: '특별시의 녹지지역 (지정 불가)',
    included: ['특별시의 관리지역', '광역시의 관리지역', '광역시의 농림지역', '군의 자연환경보전지역'],
    caution: '특별시 전체에서 농업진흥지역 지정이 불가능하다고 확대 해석하기 쉽지만, 지정할 수 없는 것은 특별시의 녹지지역뿐이다.',
    sources: [
      { label: '농지법 제28조', note: '농업진흥지역의 지정', href: 'https://www.law.go.kr/법령/농지법/제28조' },
    ],
  },
  'idle-farmland-proxy-cultivator': {
    kind: 'proxy-cultivator-rules-board', summary: '대리경작자는 신청뿐 아니라 시장·군수·구청장의 직권으로도 지정할 수 있고, 지력증진 목적 휴경 농지는 지정 대상에서 제외되며, 기간은 원칙 3년이나 변경 가능하고 소유권자·임차권자 모두 대상이 된다.',
    rules: ['지력 증진·토양 개량 목적 휴경 농지는 대리경작자 지정 대상에서 제외', '신청뿐 아니라 시장·군수·구청장의 직권 지정도 가능', '경작을 게을리하면 기간 만료 전이라도 해지 가능', '대리경작 기간은 원칙 3년이나 다르게 정할 수 있음', '농지 소유권자·임차권자 모두를 대신할 대리경작자 지정 가능'],
    caution: '대리경작자 지정이 신청에 의해서만 가능하다고 착각하기 쉽지만, 시장·군수·구청장의 직권 지정도 가능하다.',
    sources: [
      { label: '농지법 제20조', note: '유휴농지에 대한 대리경작자의 지정', href: 'https://www.law.go.kr/법령/농지법/제20조' },
    ],
  },
  'farmland-register-management': {
    kind: 'farmland-register-numbers-board', summary: '농지대장은 전용허가 등으로 농지가 아니게 되어도 폐기하지 않고 따로 편철해 계속 보존해야 하고, 임대차계약 체결 시 60일 이내에 변경 신청해야 하며, 열람은 관계공무원 참여 하에 관서 사무소 안에서만 가능하다.',
    amended: true,
    numbers: [
      { item: '농지 아니게 된 경우 보존기간', rule: '따로 편철하여 계속 보존 (10년간 등 기간 한정 아님)' },
      { item: '임대차계약 체결 후 변경신청 기한', rule: '체결일부터 60일 이내' },
      { item: '열람 장소', rule: '관계공무원 참여 하에 관서 사무소 안에서만' },
    ],
    caution: '농지가 아니게 된 경우의 농지대장을 5년·10년 등 특정 기간만 보존하고 폐기한다고 착각하기 쉽지만, 실제로는 기간 제한 없이 계속 보존해야 한다.',
    sources: [
      { label: '농지법 시행규칙 제56조', note: '농지대장의 관리', href: 'https://www.law.go.kr/법령/농지법시행규칙/제56조' },
    ],
  },
  'farmland-conversion-rules': {
    kind: 'conversion-exemption-filter', summary: '방풍림 부지 사용·불법개간지 산림복구는 농지전용에 해당하지 않고 간이저온저장고·간이액비저장조도 전용이 아니지만, 농막·동일필지 내 전용허가 위치변경(허가 필요)은 전용/허가 대상이다.',
    notConversion: ['재해방지용 방풍림 부지로 사용', '불법개간 농지의 산림 복구', '연면적 33㎡ 이하 간이저온저장고', '저장용량 200톤 이하 간이액비저장조'],
    isConversion: '농막 설치 (전용에 해당) / 동일 필지 내 전용허가 위치 변경(신고 아닌 허가 변경 절차 필요)',
    caution: '간이저온저장고·간이액비저장조처럼 농막도 전용으로 보지 않는다고 착각하기 쉽지만, 농막은 전용에 해당하는 것으로 구분된다.',
    sources: [
      { label: '농지법 제34조', note: '농지의 전용허가·신고', href: 'https://www.law.go.kr/법령/농지법/제34조' },
    ],
  },
  'farmland-temporary-use-report': {
    kind: 'temp-use-report-filter', summary: '6개월 이내 썰매장·지역축제장 사용, 주목적사업 물건 매설·현장사무소 설치는 타용도 일시사용신고 대상이지만, 태양에너지 발전설비 설치는 신고 대상이 아니라 전용허가·신고 대상이다.',
    reportable: ['썰매장으로 사용', '지역축제장으로 사용', '주목적사업을 위한 물건 매설', '주목적사업을 위한 현장 사무소 설치'],
    notReportable: '태양에너지 발전설비 설치 (전용허가·신고 대상, 일시사용신고 아님)',
    caution: '태양광 발전설비 설치도 일시적 이용이라는 이유로 일시사용신고 대상이라고 착각하기 쉽지만, 반영구적 설비이므로 전용허가·신고 대상이다.',
    sources: [
      { label: '농지법 제36조', note: '농지의 타용도 일시사용신고', href: 'https://www.law.go.kr/법령/농지법/제36조' },
    ],
  },
  'farmland-improvement-report-exemption': {
    kind: 'fill-report-exemption-board', summary: '성토 신고 면제는 해당 필지 총면적 1천㎡ 이하이고 최근 1년간 성토 높이 합이 50cm 이내인 경우로, 면적·높이 두 기준을 모두 충족해야 한다.',
    conditions: '필지 총면적 1천㎡ 이하 그리고 최근 1년간 성토 높이 합계 50cm 이내 (둘 다 충족 필요)',
    caution: '면적·높이 기준 중 하나만 충족해도 신고가 면제된다고 착각하기 쉽지만, 두 기준을 모두 충족해야 신고가 면제된다.',
    sources: [
      { label: '농지법 시행령 제38조', note: '농지개량행위의 신고', href: 'https://www.law.go.kr/법령/농지법시행령/제38조' },
    ],
  },
}

const conceptPitfallCards = {
  'resident-opinion-hearing-obligation': [
    {
      wrong: '개발밀도관리구역과 기반시설부담구역을 지정할 때에는 모두 주민의견을 들어야 한다.',
      correct: '기반시설부담구역 지정에는 주민의견 청취가 필요하지만, 개발밀도관리구역 지정에는 주민의견 청취 의무가 명시되어 있지 않습니다.',
    },
    {
      wrong: '개발밀도관리구역은 주민의견 청취를 거치고, 지방도시계획위원회 심의는 거치지 않아도 된다.',
      correct: '절차가 반대입니다. 개발밀도관리구역은 주민의견 청취 대상이 아니지만 지방도시계획위원회 심의는 거쳐야 합니다.',
    },
  ],
}

function uniqueYears(questionRefs = []) {
  return [...new Set(questionRefs.map((ref) => ref.year).filter(Boolean))].sort((a, b) => a - b)
}

function shortRule(point, index) {
  const cleaned = String(point || '').replace(/\s+/g, ' ').trim()
  const firstClause = cleaned.split(/[—–:;]|(?:이며|이고|하지만|다만),?/)[0]?.trim()
  if (firstClause && firstClause.length <= 32) return firstClause.replace(/[.。]$/, '')
  return `핵심 규칙 ${index + 1}`
}

function buildDefaultEnhancement(concept) {
  const points = (concept.keyPoints || []).filter(Boolean).slice(0, 4)
  const years = uniqueYears(concept.questionRefs)
  return {
    kind: 'study-map',
    breadcrumb: [concept.chapterKo, concept.sectionKo].filter(Boolean),
    summary: concept.intuition || concept.definition,
    rules: points.map((point, index) => ({
      label: shortRule(point, index),
      body: point,
      number: index + 1,
    })),
    example: concept.example || null,
    memory: concept.pitfalls || points[0] || concept.definition,
    years,
    questionCount: concept.questionRefs?.length || 0,
  }
}

export function getConceptEnhancement(concept) {
  if (!concept?.slug) return null
  return conceptEnhancements[concept.slug] ?? buildDefaultEnhancement(concept)
}

export function getConceptPitfallOverrides(slug) {
  return conceptPitfallCards[slug] ?? null
}
