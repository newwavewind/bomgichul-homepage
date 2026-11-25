export const PC_STUDY_FEATURES = [
  { id: 'cells', title: '기출 셀 학습', description: '주제별 표에서 셀을 열어 핵심 해설과 연결된 기출·근거를 봅니다.' },
  { id: 'choices', title: '선지 분석', description: '기출 선지를 하나씩 판단하고 답과 해설을 확인합니다.' },
  { id: 'traps', title: '함정 문장', description: '기출의 틀린 표현과 바른 표현을 대조합니다.' },
  { id: 'law', title: '빈출 조문·판례 훈련', description: '기출에 자주 나온 조문과 판례의 핵심어를 가리고 복습합니다.' },
  { id: 'ox', title: '포켓 OX', description: '짧은 지문을 OX로 풀고 다음 카드로 넘어갑니다.' },
  { id: 'audio', title: '포켓 오디오', description: '포켓 지문과 정답, 해설을 이어서 듣습니다.' },
] as const;
export type PcStudyFeature = typeof PC_STUDY_FEATURES[number]['id'];
