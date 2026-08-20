/**
 * 구문 설명 — 단원 하나, 초점 하나마다 한 장.
 *
 * 문장 목록만 있으면 「이 문장이 왜 그런가」는 알아도 「이 자리가 무엇인가」는
 * 끝내 안 잡힌다. 그 자리를 세워 주는 글이다. 구문책의 한 꼭지라고 보면 된다.
 *
 * ## 층이 둘인 까닭
 * 초점(칩)에만 글을 달면 **기출에 안 나온 자리를 가르칠 수 없다.** 실제로 4형식이
 * 그렇다 — SVO·SVOO 단원의 열 문장이 전부 3형식이라 수여동사 칩이 서지 않는다.
 * 그렇다고 구문책이 4형식을 건너뛸 수는 없다. 그래서 글을 두 층으로 둔다.
 *
 *   unit  — 단원 개괄. 기출에 없어도 그 자리가 무엇인지 세운다.
 *   focus — 칩 하나에 붙는 설명. 그 칩을 눌렀을 때 목록 위에 펼쳐진다.
 *
 * ## 예문은 자기 설명 밑에 둔다
 * 예문을 한데 모아 두면 「이건 무엇의 예였더라」를 되짚어야 한다. 그래서 예문과
 * 틀림/고침은 **자기가 딸린 설명 바로 아래**에 붙인다. for 를 쓰는 동사 이야기
 * 밑에 bought a book for her 가 있어야, 읽자마자 그 자리가 붙는다.
 *
 * ## 글결
 * 기존 grammar 설명과 같은 결로 쓴다 — *"reach 는 타동사 — 전치사를 붙이지 않는다"*
 * 처럼 짧고 단정하게. 「~인 것 같다」처럼 흐린 말은 쓰지 않는다.
 *
 * **쉬운 말로 쓴다.** 짧고 단정한 것과 어려운 것은 다르다. 읽는 사람은 문법을
 * 배우러 온 수험생이지 국어를 겨루러 온 사람이 아니다. 지키는 것 셋 —
 *   · 일상에서 안 쓰는 말은 쓰지 않는다 (「흠이다」·「~의 소산이다」 같은 것)
 *   · 한 문장에 하나만 말한다. 「A는 B와, C를 D하는 E다」처럼 얽지 않는다
 *   · 두 가지를 말할 때는 「두 가지가 나온다」라고 먼저 알리고 나눠 적는다
 *
 * ## 예문의 출처를 밝힌다
 * 기출에 없는 자리는 예문을 새로 지어야 한다. 지은 예문을 기출인 척 두면 안 되므로
 * `source: 'written'` 으로 갈라 두고, 화면에서도 갈라 보인다.
 *
 * @typedef {{ wrong: string, right: string, why: string }} Contrast
 * @typedef {{ en: string, ko: string, source?: 'written' | 'exam' }} Example
 *
 * 갈리는 자리 한 묶음. 낱말만 늘어놓지 않고, 그 자리의 예문을 함께 안는다.
 * @typedef {Object} Group
 * @property {string} name
 * @property {string[]} [items]
 * @property {string} [note]
 * @property {Contrast[]} [contrasts]
 * @property {Example[]} [examples]
 *
 * @typedef {Object} SyntaxNote
 * @property {'unit' | 'focus'} level
 * @property {string} unitId              taxonomy 의 unit id
 * @property {string} [focus]             level 이 focus 일 때만 — 문장의 focus 와 글자까지 같아야 한다
 * @property {string} title
 * @property {string} summary             한 줄 정의
 * @property {string} [detail]            풀어 쓴 설명. 빈 줄로 나누면 문단이 갈린다
 * @property {Group[]} [groups]
 * @property {{ text: string, contrasts?: Contrast[], examples?: Example[] }} [pitfall]
 *           가장 자주 걸리는 함정. 그 함정을 보여 주는 예문을 함께 안는다
 */

/** @type {SyntaxNote[]} */
export const SYNTAX_NOTES = [
  {
    level: 'unit',
    unitId: 'sk-sv',
    title: 'SV · SVC — 목적어가 없는 자리',
    summary: '목적어를 받지 않는 자리다. 보어가 오면 그 보어는 **형용사**이지 부사가 아니다.',
    detail:
      '1형식은 「주어 + 동사」로 끝난다. 뒤에 말이 더 있어도 그것은 목적어가 아니라 부사구다.\n\n' +
      '2형식은 보어가 주어를 설명한다. 「주어 = 보어」로 읽히면 2형식이다. 그 자리에는 ' +
      '형용사 · 명사 · 명사절이 오고, **부사는 오지 못한다.**',
    groups: [
      {
        name: '1형식 — 뒤에 오는 것은 부사구다',
        note: '목적어처럼 보여도 전치사가 앞에 붙어 있으면 부사구다.',
        examples: [
          {
            en: 'The smile soon faded from her face.',
            ko: '그녀의 얼굴에서 미소가 곧 사라졌다. (fade 는 스스로 흐려지는 자동사 — from 이 떠나온 자리를 밝힌다)',
          },
        ],
      },
      {
        name: '2형식 — 보어가 주어를 설명한다',
        items: ['형용사', '명사', '명사절'],
        note: '보어 자리에는 이 셋이 온다. 부사는 주어를 설명하지 못하므로 올 수 없다.',
        examples: [
          {
            en: 'An important law of physics, however, called the law of conservation of energy, is that energy can never be created nor destroyed.',
            ko: '그런데 에너지 보존 법칙이라 불리는 물리학의 한 중요한 법칙은, 에너지는 결코 만들어지지도 없어지지도 않는다는 것이다. (보어가 that 절)',
          },
        ],
      },
      {
        name: '감각동사 뒤는 형용사',
        items: ['look', 'sound', 'taste', 'smell', 'feel'],
        note: '「~하게 보이다 · 들리다」로 옮겨져 부사가 어울릴 것 같지만 형용사가 온다.',
        contrasts: [
          {
            wrong: 'The soup tastes deliciously.',
            right: 'The soup tastes delicious.',
            why: '맛있는 것은 맛보는 행위가 아니라 수프다. 주어를 설명하니 형용사다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '-ly 로 끝난다고 다 부사가 아니다. friendly · lovely · costly · likely · lively · timely 는 ' +
        '**형용사**다. 보어 자리나 명사 앞에만 온다.',
      contrasts: [
        {
          wrong: 'She smiled friendly at me.',
          right: 'She gave me a friendly smile.',
          why: 'friendly 는 형용사라 동사를 꾸미지 못한다. 부사로 쓰려면 in a friendly way 라 한다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'sk-svo',
    title: 'SVO · SVOO — 목적어를 하나 또는 둘',
    summary:
      '목적어를 하나 받으면 3형식, 「누구에게 무엇을」 둘을 받으면 4형식이다.',
    detail:
      '3형식에서는 **전치사를 붙일지 말지**가 갈린다. 우리말로 「~에 도달하다 · ~에 대해 ' +
      '논하다」라고 하니 전치사를 붙이고 싶어지지만, reach·discuss·contact 는 목적어를 ' +
      '바로 받는다.\n\n4형식에서는 두 가지가 나온다. **3형식으로 바꿀 때 어떤 전치사를 ' +
      '쓰는지**, 그리고 **4형식으로 못 쓰는 동사를 4형식으로 써 놓지 않았는지**다.',
    groups: [
      {
        name: '전치사를 붙이지 않는 타동사',
        items: ['reach', 'discuss', 'contact', 'enter', 'marry', 'resemble', 'answer', 'approach'],
        note: '우리말 뜻에 「~에 · ~와」가 들어 있어 전치사를 붙이기 쉽다.',
        contrasts: [
          {
            wrong: 'She reached to the summit.',
            right: 'She reached the summit.',
            why: 'reach 는 목적어를 바로 받는다.',
          },
          {
            wrong: 'We discussed about the plan.',
            right: 'We discussed the plan.',
            why: 'discuss 도 같다. 「~에 대해」에 이끌려 about 을 붙이면 틀린다.',
          },
        ],
      },
      {
        name: '4형식 → 3형식, to 를 쓰는 동사',
        items: ['give', 'send', 'lend', 'teach', 'show', 'tell', 'offer', 'pass'],
        note: '건네받는 상대 — 물건이나 말이 그 사람 쪽으로 간다.',
        examples: [
          {
            en: 'The company offered him a full-time position.',
            ko: '회사는 그에게 정규직 자리를 제안했다. (4형식)',
            source: 'written',
          },
          {
            en: 'The company offered a full-time position to him.',
            ko: '회사는 정규직 자리를 그에게 제안했다. (3형식)',
            source: 'written',
          },
        ],
      },
      {
        name: '4형식 → 3형식, for 를 쓰는 동사',
        items: ['buy', 'make', 'cook', 'find', 'get', 'build', 'choose'],
        note: '대신 해 주는 상대 — 그 사람을 위해 한다.',
        contrasts: [
          {
            wrong: 'I bought a book to her.',
            right: 'I bought a book for her.',
            why: '사 준 것이지 건넨 것이 아니다. buy 는 for 를 쓴다.',
          },
        ],
      },
      {
        name: '4형식 → 3형식, of 를 쓰는 동사',
        items: ['ask', 'inquire', 'require', 'beg'],
        note: '물어보거나 청하는 상대.',
        examples: [
          {
            en: 'She asked a favor of me.',
            ko: '그녀는 나에게 부탁을 했다.',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '뜻은 「주다」에 가까워도 **4형식으로 쓰지 못하는 동사**가 있다. 사람 앞에 to 를 ' +
        '붙여 3형식으로만 쓴다 — explain · suggest · announce · introduce · describe · propose.',
      contrasts: [
        {
          wrong: 'He explained me the rule.',
          right: 'He explained the rule to me.',
          why: 'explain 은 사람을 바로 받지 못한다.',
        },
        {
          wrong: 'She suggested me a new plan.',
          right: 'She suggested a new plan to me.',
          why: 'suggest 도 같다. 「제안하다」라 4형식일 것 같지만 아니다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'sk-svoc',
    title: 'SVOC — 목적어 뒤에 보어가 하나 더',
    summary:
      '「목적어를 …하게 · …라고」 하는 자리다. 그 보어의 꼴은 **앞의 동사가 정한다.**',
    detail:
      '목적어와 보어 사이에는 **주어–술어 관계**가 있다. call it anomie 는 「그것이 아노미다」, ' +
      'make him happy 는 「그가 행복하다」로 읽힌다.\n\n' +
      '이 관계를 잡아야 분사의 방향이 정해진다. 목적어가 하는 쪽이면 원형이나 현재분사, ' +
      '당하는 쪽이면 과거분사다.',
    groups: [
      {
        name: '보어 자리에 오는 것',
        items: ['명사', '형용사', 'to부정사', '원형부정사', '분사', 'as + 명사'],
        note: '무엇이 오는지는 앞의 동사가 정한다. 뜻으로는 갈리지 않으니 동사별로 외운다.',
        examples: [
          {
            en: 'The French sociologist Emile Durkheim called this sense of disorientation and meaninglessness anomie.',
            ko: '프랑스 사회학자 에밀 뒤르켐은 이 방향 상실과 무의미함의 느낌을 아노미라고 불렀다. (보어가 명사 — call A B)',
          },
          {
            en: 'The whole process is called the fight-or-flight response, because it prepares the body to either battle or run for its life.',
            ko: '이 모든 과정은 투쟁-도피 반응이라 불리는데, 그것이 몸을 싸우거나 목숨을 걸고 달아나도록 준비시키기 때문이다. (보어가 to부정사 — prepare A to do)',
          },
        ],
      },
      {
        name: '분사는 방향으로 고른다',
        note: '목적어가 하는 쪽이면 -ing, 당하는 쪽이면 p.p. 다.',
        examples: [
          {
            en: 'A few words caught in passing set me thinking.',
            ko: '지나가다 귀에 걸린 몇 마디 말이 나를 생각에 잠기게 했다. (내가 생각하는 쪽이라 -ing)',
          },
          {
            en: 'One might expect to find the animal portioned out according to the amount of work done by each hunter to obtain it.',
            ko: '그 짐승이 사냥꾼 저마다가 그것을 잡으려고 한 일의 양에 따라 나뉘어 있으리라고 기대할 법하다. (짐승은 나뉘는 쪽이라 p.p.)',
          },
        ],
      },
      {
        name: 'A as B 를 쓰는 동사',
        items: ['regard', 'see', 'view', 'think of', 'look upon', 'refer to'],
        note: 'as 를 빠뜨리면 틀린다. 「A를 B로 여기다」 무리다.',
        examples: [
          {
            en: 'Many psychologists see the home as the most natural learning environment.',
            ko: '많은 심리학자는 가정을 가장 자연스러운 배움터로 본다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '지각동사 뒤에서 방향을 뒤집으면 뜻이 어긋난다. 2023년 지방직이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'As I went out for work, I saw a family moved in upstairs.',
          right: 'As I went out for work, I saw a family move in upstairs.',
          why: '가족이 스스로 이사 오는 쪽이라 원형이나 moving 이라야 한다. moved 는 당하는 쪽이라 어긋난다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'sk-vt',
    title: '자동사 · 타동사 — 전치사를 붙일지 말지',
    summary:
      '목적어를 바로 받으면 타동사, 전치사를 거쳐야 하면 자동사다. **우리말 뜻으로는 갈리지 않는다.**',
    detail:
      '「~에 도달하다 · ~와 결혼하다」처럼 우리말에 조사가 붙으니 영어에도 전치사를 붙이고 ' +
      '싶어진다. 하지만 reach · marry 는 목적어를 바로 받는다.\n\n' +
      '반대쪽도 있다. 「~에 도착하다」의 arrive 는 전치사 없이 못 쓴다. **동사마다 정해져 ' +
      '있으니 외우는 수밖에 없다.**',
    groups: [
      {
        name: '전치사를 붙이지 않는 타동사',
        items: [
          'reach', 'discuss', 'contact', 'enter', 'marry', 'resemble',
          'answer', 'approach', 'inhabit', 'attend', 'mention', 'obey', 'survive',
        ],
        note: '우리말 뜻에 「~에 · ~와 · ~에 대해」가 들어 있어 전치사를 붙이기 쉽다.',
        contrasts: [
          {
            wrong: 'Please contact to me if you have any questions.',
            right: 'Please contact me if you have any questions.',
            why: 'contact 는 목적어를 바로 받는다. 「~에게 연락하다」라는 뜻이 이미 안에 있다.',
          },
        ],
      },
      {
        name: '전치사가 꼭 있어야 하는 자동사',
        items: [
          'arrive at · in', 'apologize to', 'listen to', 'wait for',
          'graduate from', 'object to', 'reply to', 'account for', 'participate in',
        ],
        note: '목적어를 바로 받지 못한다. 짝이 되는 전치사가 동사마다 정해져 있다.',
      },
      {
        name: '꼴이 닮은 짝 — 하나는 자동사, 하나는 타동사',
        items: ['rise · raise', 'arise · arouse', 'lie · lay', 'sit · seat', 'fall · fell'],
        note: '앞이 자동사, 뒤가 타동사다. 목적어가 있는지 보고 고른다.',
        contrasts: [
          {
            wrong: 'He said he would rise my salary because I worked hard.',
            right: 'He said he would raise my salary because I worked hard.',
            why: 'my salary 라는 목적어가 있으니 타동사 raise 다. rise 는 목적어를 두지 못한다.',
          },
          {
            wrong: 'Several problems have raised due to the new members.',
            right: 'Several problems have arisen due to the new members.',
            why: '문제가 스스로 생겨나는 자리라 자동사 arise 다. 목적어가 없다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'each other 와 one another 는 **부사가 아니라 대명사**다. 앞에 전치사가 있어야 하는 ' +
        '자리라면 반드시 적는다.',
      contrasts: [
        {
          wrong: "They exchanged New Year's greetings each other on screen.",
          right: "They exchanged New Year's greetings with each other on screen.",
          why: 'exchange 의 목적어는 greetings 다. each other 는 따로 with 를 앞에 두어야 한다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'sk-agree',
    title: '주어–동사 수일치 — 핵 하나만 본다',
    summary:
      '동사는 주어의 **핵 하나**에 맞춘다. 사이에 낀 말은 아무리 길어도 수를 정하지 못한다.',
    detail:
      '시험은 주어와 동사를 멀리 떼어 놓는다. 그 사이에 of 구 · 관계절 · 콤마로 묶은 삽입을 ' +
      '끼워 넣고, 동사 바로 앞에 반대 수의 명사를 놓는다.\n\n' +
      '읽는 법은 하나뿐이다. **동사를 먼저 찾고, 그 앞을 거슬러 올라가며 수식어를 지운다.** ' +
      '마지막에 남는 명사가 핵이다.',
    groups: [
      {
        name: '수식어는 수를 정하지 못한다',
        items: ['of ~', 'with ~', 'along with ~', 'including ~', 'as well as ~', '관계절'],
        note: '이것들이 이끄는 덩이는 전부 걷어 낸다. 그 안의 명사가 복수여도 상관없다.',
        contrasts: [
          {
            wrong: 'The increased popularity of online marketing and social media sharing have boosted the need for standardization.',
            right: 'The increased popularity of online marketing and social media sharing has boosted the need for standardization.',
            why: 'of 뒤가 and 로 묶여 복수처럼 보이지만 핵은 단수 popularity 다.',
          },
        ],
      },
      {
        name: 'the number of 는 단수, a number of 는 복수',
        note: '「~의 수」는 수 하나라 단수, 「많은 ~」은 뒤의 복수명사를 따라 복수다. 관사 하나로 갈린다.',
        examples: [
          {
            en: 'We are glad that the number of applicants is increasing.',
            ko: '지원자 수가 늘고 있어 기쁘다. (「수」가 주어라 is)',
          },
          {
            en: 'A growing number of students have skipped school to stay online.',
            ko: '점점 더 많은 학생이 온라인에 머무르려고 학교를 빠졌다. (「많은 학생」이 주어라 have)',
          },
        ],
      },
      {
        name: '구와 절이 주어면 단수',
        note: '동명사구 · to부정사 · 명사절이 통째로 주어면 아무리 길어도 단수다.',
        examples: [
          {
            en: 'Getting on with our day-to-day lives requires a series of civilized masks.',
            ko: '하루하루의 삶을 꾸려 가는 일은 문명화된 가면 몇 겹을 요구한다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'and 로 묶였다고 무조건 복수가 아니다. 앞에 **the 가 하나만** 붙어 있으면 둘을 한 덩이로 ' +
        '본다는 표시라 단수로 받는다.',
      examples: [
        {
          en: 'The principles of kinship obligation and the morality of sharing food have been emphasized.',
          ko: '친족의 의무라는 원칙과 음식을 나누는 도덕이 힘주어 다져져 왔다. (the 가 각각 붙어 별개 — 복수)',
        },
        {
          en: 'The incessant public curiosity and consumer demand due to the health benefits with lesser cost has increased the interest in functional foods.',
          ko: '더 적은 비용으로 얻는 건강상 이로움 때문에 끊이지 않는 대중의 호기심과 소비자 수요가 기능성 식품에 대한 관심을 높여 왔다. (The 하나뿐 — 단수)',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'vb-to',
    title: 'to부정사 — 세 용법은 자리로 갈린다',
    summary:
      '명사 · 형용사 · 부사 세 노릇을 한다. 어느 것인지는 뜻이 아니라 **놓인 자리**가 정한다.',
    detail:
      '명사 자리(주어 · 목적어 · 보어)에 있으면 명사적, 명사 바로 뒤에 붙어 그 명사를 꾸미면 ' +
      '형용사적, 나머지는 부사적이다.\n\n' +
      '나머지 두 가지도 자주 나온다. **하는 쪽이 문장의 주어와 다르면** 앞에 for 를 두고, ' +
      '**부정은 to 앞에** not 을 둔다.',
    groups: [
      {
        name: '세 용법',
        items: ['명사적 — 주어 · 목적어 · 보어', '형용사적 — 앞의 명사를 꾸민다', '부사적 — 동사 · 형용사를 꾸민다'],
        note: '한 문장에 둘이 함께 나오기도 한다. 그때는 저마다 어디에 걸리는지 짚는다.',
        examples: [
          {
            en: 'Yet to speak up without listening is like banging pots and pans together.',
            ko: '그런데 듣지 않고 말만 하는 것은 냄비와 팬을 맞부딪는 것과 같다. (명사적 — 주어)',
          },
          {
            en: 'With his ability to fuse serious content with humorous style, Hughes attacked racial prejudice in a way that was natural and witty.',
            ko: '진지한 내용을 익살스러운 문체와 녹여 내는 능력으로, 휴스는 자연스럽고 재치 있게 인종 편견을 공격했다. (형용사적 — ability 를 꾸민다)',
          },
          {
            en: 'Rice yields must increase by 30 percent over the next 20 years to ensure a billion people can receive their staple diet.',
            ko: '10억 명이 주식을 받을 수 있게 하려면 쌀 수확량은 앞으로 20년에 걸쳐 30퍼센트 늘어야 한다. (부사적 — 목적)',
          },
        ],
      },
      {
        name: '의미상 주어는 for + 목적격',
        note: '사람의 성질을 나타내는 형용사(kind · foolish · careless · wise · rude) 뒤에서는 of 를 쓴다.',
        examples: [
          {
            en: 'I should buy a book for my son to read.',
            ko: '나는 아들이 읽을 책을 사 주어야 한다. (읽는 것은 내가 아니라 아들)',
          },
          {
            en: 'It was kind of you to help me.',
            ko: '나를 도와주다니 당신은 친절하다. (사람의 성질을 말하니 of)',
            source: 'written',
          },
        ],
      },
      {
        name: '부정은 to 앞에 not',
        note: 'not to do 로 쓴다. to not do 로 쓰지 않는다. 동명사도 not -ing 로 앞에서 부정한다.',
        examples: [
          {
            en: 'We must be careful not to reduce the population below the ideal point where it can replace all of the fish we take out each year.',
            ko: '우리가 해마다 잡아내는 만큼을 개체군이 되채울 수 있는 이상적인 지점 아래로 그 개체군을 떨어뜨리지 않도록 조심해야 한다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'enough 는 **형용사 · 부사를 꾸밀 때 뒤에**, 명사를 꾸밀 때 앞에 온다. 시험이 흠으로 ' +
        '고른 자리다.',
      contrasts: [
        {
          wrong: 'He felt enough comfortable to tell me about something he wanted to do.',
          right: 'He felt comfortable enough to tell me about something he wanted to do.',
          why: 'comfortable 이라는 형용사를 꾸미니 뒤에 온다. enough money 처럼 명사를 꾸밀 때만 앞이다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'vb-ing',
    title: '동명사 — 전치사 뒤에는 언제나 -ing',
    summary:
      '동사를 명사처럼 쓰는 꼴이다. **전치사 뒤**와 **정해진 동사의 목적어 자리**에 온다.',
    detail:
      '시험이 가장 즐겨 쓰는 자리는 하나다. **to 가 전치사인 표현** 뒤에 원형을 놓아 두는 것이다. ' +
      'look forward to 의 to 는 부정사의 to 가 아니라 전치사라, 뒤에 -ing 가 온다.\n\n' +
      '가리는 법은 간단하다. 그 자리에 명사를 넣어 보면 된다. 명사가 들어가면 전치사다.',
    groups: [
      {
        name: 'to 가 전치사인 표현',
        items: [
          'look forward to', 'be used to', 'object to', 'be committed to',
          'contribute to', 'when it comes to', 'devote oneself to', 'lead to',
        ],
        note: '뒤에 원형을 놓으면 틀린다. 명사를 넣어 말이 되면 전치사라는 표시다.',
        contrasts: [
          {
            wrong: 'I look forward to receive your reply as soon as possible.',
            right: 'I look forward to receiving your reply as soon as possible.',
            why: 'look forward to 의 to 는 전치사다. 뒤에 동명사가 온다.',
          },
        ],
      },
      {
        name: '동명사만 받는 동사',
        items: [
          'enjoy', 'avoid', 'mind', 'finish', 'give up', 'postpone',
          'admit', 'deny', 'suggest', 'consider', 'quit', 'practice',
        ],
        note: 'to부정사를 받지 못한다. 이미 하고 있거나 지나간 일에 가까운 뜻이 많다.',
        examples: [
          {
            en: 'Your partner has just run off with your best friend, yet you cannot avoid going in to teach a class of inquisitive students.',
            ko: '짝이 방금 가장 친한 친구와 달아났는데도, 당신은 호기심 많은 학생들을 가르치러 들어가는 일을 피할 수 없다.',
          },
        ],
      },
      {
        name: '동명사가 든 굳은 표현',
        items: [
          'be busy -ing', 'It is no use -ing', 'have difficulty (in) -ing',
          'spend time -ing', 'feel like -ing', 'cannot help -ing', 'be worth -ing', 'on -ing',
        ],
        note: '통째로 눈에 익혀 둔다. 사이에 원형이 끼어들 자리가 없다.',
        examples: [
          {
            en: 'The homeless usually have great difficulty getting a job, so they are losing their hope.',
            ko: '노숙인은 대개 일자리를 얻는 데 큰 어려움을 겪어서 희망을 잃어 가고 있다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '동명사도 **방향**이 있다. 주어가 당하는 쪽이면 being p.p. 로 적는다. worth 뒤는 ' +
        '반대로, -ing 인 채로 수동의 뜻을 담는다.',
      contrasts: [
        {
          wrong: 'The company prohibited him from promoting to vice-president.',
          right: 'The company prohibited him from being promoted to vice-president.',
          why: '그가 승진되는 쪽이다. promote 는 「승진시키다」라는 타동사다.',
        },
        {
          wrong: 'His plan for the smart city was worth considered.',
          right: 'His plan for the smart city was worth considering.',
          why: 'worth 뒤에는 -ing 가 온다. 꼴은 능동이지만 「검토될 만하다」는 뜻이다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'vb-participle',
    title: '분사 — 하는 쪽이면 -ing, 당하는 쪽이면 p.p.',
    summary:
      '동사를 형용사처럼 쓰는 꼴이다. 꾸밈을 받는 말이 **하는 쪽인지 당하는 쪽인지**로 갈린다.',
    detail:
      '판별은 넣어 읽어 보면 된다. falling leaves 는 「떨어지는 잎」, fallen leaves 는 ' +
      '「떨어진 잎」이다. 잎이 스스로 떨어지느냐, 이미 떨어져 있느냐의 차이다.\n\n' +
      '자리도 정해져 있다. 분사 하나면 명사 **앞**, 딸린 말이 있으면 명사 **뒤**에 붙는다.',
    groups: [
      {
        name: '딸린 말이 있으면 뒤에서 꾸민다',
        note: '「관계사 + be동사」가 지워진 꼴로 보면 읽기 쉽다.',
        examples: [
          {
            en: 'A recent World Bank study entitled "Growth Is Good for the Poor" reveals a one-for-one relationship between income of the bottom fifth and per capita GDP.',
            ko: '「성장은 가난한 이에게 좋다」라는 제목이 붙은 최근 세계은행 연구는 하위 5분의 1의 소득과 1인당 GDP 사이의 일대일 관계를 드러낸다. (which was entitled 가 줄었다)',
          },
          {
            en: 'Because its main attraction is its seaside Old Town surrounded by 80-foot medieval walls, this Dalmatian Coast town does not absorb visitors very well.',
            ko: '주된 볼거리가 80피트 높이의 중세 성벽에 둘러싸인 바닷가 구시가지이기 때문에, 이 달마티아 해안 마을은 방문객을 잘 품어 내지 못한다.',
          },
        ],
      },
      {
        name: '감정 동사 — 주는 쪽과 느끼는 쪽',
        items: ['exciting · excited', 'interesting · interested', 'boring · bored', 'surprising · surprised'],
        note: '-ing 는 감정을 **주는** 쪽, -ed 는 감정을 **느끼는** 쪽이다. 사람이라고 무조건 -ed 인 것은 아니다.',
        contrasts: [
          {
            wrong: 'The Christmas party was really excited and I totally lost track of time.',
            right: 'The Christmas party was really exciting and I totally lost track of time.',
            why: '파티는 신나게 만드는 쪽이다. 신이 난 것은 사람이다.',
          },
          {
            wrong: 'Is there anything interested in it?',
            right: 'Is there anything interesting in it?',
            why: '흥미를 주는 쪽이라 -ing 다. anything 뒤에서 뒤로 붙어 꾸민다.',
          },
        ],
      },
      {
        name: '분사를 꾸미려면 부사',
        note: '분사는 동사에서 온 말이라 형용사가 아니라 부사가 꾸민다.',
        contrasts: [
          {
            wrong: 'Even young children like to be complimented for a job done good.',
            right: 'Even young children like to be complimented for a job done well.',
            why: 'done 이라는 분사를 꾸미는 자리다. good 은 형용사라 못 꾸민다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '짝이 되는 표현에서는 방향이 굳어 있다. pay attention to 의 attention 은 **쏠리는 쪽**이라 ' +
        '언제나 paid 다.',
      contrasts: [
        {
          wrong: "There's a lot of attention paying to this question of whether it's better to have an optimistic lens.",
          right: "There's a lot of attention paid to this question of whether it's better to have an optimistic lens.",
          why: '관심이 쏠리는 쪽이라 과거분사다. pay attention to 라는 짝에서 왔다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'vb-partcl',
    title: '분사구문 — 지워진 주어는 주절의 주어다',
    summary:
      '「접속사 + 주어 + 동사」를 분사 하나로 줄인 꼴이다. **주어가 주절과 같을 때만** 지운다.',
    detail:
      '읽을 때 할 일은 하나다. 지워진 주어를 되살린다. 그 주어는 주절의 주어이고, 그것으로 ' +
      '분사의 방향도 함께 정해진다.\n\n' +
      '주절의 주어가 하는 쪽이면 -ing, 당하는 쪽이면 p.p. 다. 주절보다 앞선 일이면 Having p.p. 로 ' +
      '한 걸음 물린다.',
    groups: [
      {
        name: '주절보다 앞선 일이면 Having p.p.',
        note: '두 일 사이에 시간차가 있을 때 쓴다. 시간차가 없으면 그냥 -ing 다.',
        examples: [
          {
            en: 'Having been abroad for ten years, he can speak English very fluently.',
            ko: '십 년 동안 외국에 있었기에 그는 영어를 아주 유창하게 한다. (있었던 것이 앞선다)',
          },
        ],
      },
      {
        name: '주어가 다르면 지우지 않고 남긴다',
        note: '이것을 독립분사구문이라 한다. 남긴 주어가 분사의 임자다.',
        examples: [
          {
            en: 'All things considered, she is the best-qualified person for the position.',
            ko: '모든 것을 고려하면 그녀가 그 자리에 가장 알맞은 사람이다. (things 가 남았다 — 굳은 표현)',
          },
        ],
      },
      {
        name: 'with + 목적어 + 분사',
        note: '「~한 채로」라는 곁들임을 나타낸다. 목적어가 하는 쪽이면 -ing, 당하는 쪽이면 p.p. 다.',
        examples: [
          {
            en: 'Designed as a serpent to coil around the wrist, with its head and tail covered with diamonds and having two hypnotic emerald eyes, a discreet mechanism opens its fierce jaws to reveal a tiny quartz watch.',
            ko: '손목을 감는 뱀 모양으로 만들어졌고 머리와 꼬리는 다이아몬드로 덮이고 최면을 거는 듯한 에메랄드 눈 두 개를 지녔는데, 눈에 띄지 않는 장치가 그 사나운 턱을 벌려 작은 쿼츠 시계를 드러낸다. (covered 는 당하는 쪽, having 은 하는 쪽)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '주어를 지우려면 **주절의 주어와 같아야 한다.** 다른데도 지우면 문장이 어긋난다. ' +
        '방향이 뒤집히는 것도 같은 자리에서 나온다.',
      contrasts: [
        {
          wrong: 'Being cold outside, I boiled some water to have tea.',
          right: 'It being cold outside, I boiled some water to have tea.',
          why: '추운 것은 날씨이고 물을 끓인 것은 나다. 주어가 다르니 It 을 남긴다.',
        },
        {
          wrong: 'Utilizing with other techniques, animals can raise human living standards very considerably.',
          right: 'Utilized with other techniques, animals can raise human living standards very considerably.',
          why: '주절의 주어 animals 는 쓰이는 쪽이다. 당하는 쪽이라 과거분사다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'v-tense',
    title: '시제 — 못 박는 말이 있으면 과거다',
    summary:
      '지난 한 시점의 일은 과거, 그 시점부터 **지금까지** 이어지는 일은 현재완료다.',
    detail:
      '가르는 잣대는 함께 오는 부사다. yesterday · last year · ~ ago 처럼 **때를 못 박는 말**이 ' +
      '있으면 과거다. 완료는 지금과 이어져 있어야 쓸 수 있다.\n\n' +
      '나머지 두 자리도 자주 나온다. 과거보다 한 걸음 더 앞선 일에는 과거완료를 쓰고, ' +
      '주절이 과거면 딸린 절도 한 걸음 물러선다.',
    groups: [
      {
        name: '때를 못 박는 말이 있으면 과거',
        items: ['yesterday', 'last ~', '~ ago', 'in 2019', 'when 절'],
        note: '이런 말이 보이면 완료를 쓸 수 없다. 지금과 끊어진 한 시점을 가리키기 때문이다.',
        contrasts: [
          {
            wrong: "I've received the last e-mail from him two years ago.",
            right: 'I received the last e-mail from him two years ago.',
            why: 'two years ago 가 시점을 못 박는다. 완료는 지금과 이어진 일에 쓴다.',
          },
        ],
      },
      {
        name: '과거완료 — 과거보다 한 걸음 앞',
        note: '두 일이 다 지났는데 그중 하나가 더 앞설 때 쓴다. 앞선 쪽이 had p.p. 다.',
        examples: [
          {
            en: 'The boss hit the roof when he saw that we had already spent the entire budget in such a short period of time.',
            ko: '우리가 그렇게 짧은 사이에 예산을 다 써 버린 것을 보고 상사가 몹시 화를 냈다. (본 것보다 쓴 것이 앞선다)',
          },
        ],
      },
      {
        name: '시간·조건 부사절은 현재가 미래를 대신한다',
        items: ['when', 'as soon as', 'before', 'after', 'until', 'if', 'unless'],
        note: '앞날의 일이라도 will 을 쓰지 않고 현재로 적는다. 명사절의 when·if 와는 다르다.',
        examples: [
          {
            en: 'Please come to the headquarters as soon as you receive this letter.',
            ko: '이 편지를 받는 대로 본부로 와 주십시오. (will receive 가 아니다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '주절이 과거면 딸린 절도 **한 걸음 물러선다.** 이미 지난 일에 will 을 쓸 수 없다.',
      contrasts: [
        {
          wrong: 'They had to fight against winds that will blow over 40 miles an hour.',
          right: 'They had to fight against winds that blew over 40 miles an hour.',
          why: '주절이 had to 라는 과거다. 관계절도 blew 로 맞춘다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'v-passive',
    title: '수동태 — 뒤에 목적어가 남지 않는다',
    summary:
      '목적어를 주어 자리로 데려간 꼴이다. 그래서 **be + p.p. 뒤에 목적어가 남지 않는다.**',
    detail:
      '가리는 법은 거의 이것 하나로 끝난다. be + p.p. 뒤에 목적어가 그대로 있으면, 수동이 ' +
      '아니라 능동으로 써야 할 자리다.\n\n' +
      '다음은 방향이다. 주어가 하는 쪽인지 당하는 쪽인지 본다. 우리말로 「~되다」라고 ' +
      '옮겨진다고 다 수동은 아니다.',
    groups: [
      {
        name: '뒤에 목적어가 남으면 수동이 아니다',
        note: '목적어를 이미 앞으로 데려갔으니 뒤에 또 있을 수 없다.',
        contrasts: [
          {
            wrong: 'The Aswan High Dam has been protected Egypt from the famines of its neighboring countries.',
            right: 'The Aswan High Dam has protected Egypt from the famines of its neighboring countries.',
            why: '뒤에 Egypt 라는 목적어가 있다. 댐이 지키는 쪽이므로 능동이다.',
          },
        ],
      },
      {
        name: '자동사는 수동이 되지 않는다',
        items: ['result in', 'happen', 'occur', 'appear', 'disappear', 'consist of', 'belong to', 'take place'],
        note: '목적어를 받지 못하니 앞으로 데려갈 것도 없다.',
        contrasts: [
          {
            wrong: 'By some estimates, deforestation has been resulted in the loss of eighty percent of the natural forests.',
            right: 'By some estimates, deforestation has resulted in the loss of eighty percent of the natural forests.',
            why: 'result in 은 「~을 낳다」라는 뜻의 자동사구다. 목적어를 받지 못한다.',
          },
        ],
      },
      {
        name: 'by 말고 다른 전치사를 쓰는 것',
        items: [
          'be interested in', 'be satisfied with', 'be surprised at',
          'be known as · for · to', 'be covered with', 'be attached to',
        ],
        note: '표현마다 짝이 굳어 있다. by 로 바꾸면 어색해진다.',
        examples: [
          {
            en: 'Electronic sensors are attached to various parts of the body to measure such variables as heart rate, blood pressure, and skin temperature.',
            ko: '심박수와 혈압, 피부 온도 같은 변수를 재려고 전자 감지기를 몸의 여러 곳에 붙인다.',
          },
        ],
      },
    ],
    pitfall: {
      text: '「~되다」로 옮겨진다고 수동이 아니다. **누가 하는 쪽인지**를 보고 정한다.',
      contrasts: [
        {
          wrong: 'She has known primarily as a political cartoonist throughout her career.',
          right: 'She has been known primarily as a political cartoonist throughout her career.',
          why: 'know 는 타동사인데 뒤에 목적어가 없다. 그녀는 알려지는 쪽이라 수동이다.',
        },
        {
          wrong: 'The seeds of most plants are survived by harsh weather.',
          right: 'The seeds of most plants survive harsh weather.',
          why: 'survive 는 「~을 견디고 살아남다」다. 살아남는 쪽은 씨앗이라 방향이 뒤집혔다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'v-modal',
    title: '조동사 + have p.p. — 지난 일을 두고 말한다',
    summary:
      '조동사 뒤에 have p.p. 가 오면 **이미 지나간 일**을 두고 짐작하거나 아쉬워하는 것이다.',
    detail:
      '조동사 뒤는 원래 동사원형이다. 그 자리에 have p.p. 를 넣으면 말하는 때는 지금인데 ' +
      '가리키는 일은 과거가 된다.\n\n' +
      '뜻은 앞의 조동사가 정한다. should 면 아쉬움, must 면 확신, cannot 이면 부정이다.',
    groups: [
      {
        name: '조동사마다 뜻이 다르다',
        items: [
          'should have p.p. — 했어야 했는데',
          'must have p.p. — 했음에 틀림없다',
          'cannot have p.p. — 했을 리 없다',
          'may have p.p. — 했을지도 모른다',
          'need not have p.p. — 안 해도 됐는데 했다',
        ],
        note: 'ought to have p.p. 는 should have p.p. 와 같다.',
        examples: [
          {
            en: 'I ought to have formed a habit of reading in my boyhood.',
            ko: '나는 어린 시절에 책 읽는 버릇을 들였어야 했다. (들이지 못했다는 아쉬움)',
          },
        ],
      },
      {
        name: 'used to · would — 지난날의 버릇',
        note: 'used to 는 조동사처럼 원형을 데려온다. 지금은 그렇지 않다는 결이 담긴다.',
        contrasts: [
          {
            wrong: 'They used to loving books much more when they were younger.',
            right: 'They used to love books much more when they were younger.',
            why: 'used to 뒤에는 동사원형이 온다. -ing 가 아니다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '꼴이 닮은 셋을 가른다. **used to + 원형**은 「~하곤 했다」, **be used to + -ing** 는 ' +
        '「~에 익숙하다」, **be used to + 원형**은 「~하는 데 쓰이다」다.',
      examples: [
        {
          en: 'He used to smoke a lot.',
          ko: '그는 예전에 담배를 많이 피웠다. (지금은 아니다)',
          source: 'written',
        },
        {
          en: 'He is used to smoking after meals.',
          ko: '그는 식후에 담배 피우는 데 익숙하다. (to 가 전치사라 -ing)',
          source: 'written',
        },
        {
          en: 'This knife is used to cut bread.',
          ko: '이 칼은 빵을 자르는 데 쓰인다. (use 의 수동)',
          source: 'written',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'v-subjunctive',
    title: '주장·명령·제안·요구 that절 — 동사원형만 남는다',
    summary:
      '「~해야 한다」고 요구하는 뜻이면 that절이 **(should) + 동사원형**이 된다. should 는 흔히 지운다.',
    detail:
      'should 를 지우고 원형만 남기니 겉으로는 수일치가 어긋나 보인다. 주어가 she 여도 buys 가 ' +
      '아니라 buy 이고, 주절이 과거여도 시제를 맞추지 않는다.\n\n' +
      '수동이면 be p.p. 그대로다. should be constructed 에서 should 만 빠진 꼴이다.',
    groups: [
      {
        name: '이 무리의 동사 뒤에서는 원형',
        items: [
          'insist', 'demand', 'suggest', 'recommend',
          'order', 'command', 'require', 'request', 'propose',
        ],
        note: '주장 · 명령 · 제안 · 요구를 뜻하는 동사다.',
        examples: [
          {
            en: 'The broker recommended that she buy the stocks immediately.',
            ko: '중개인은 그녀가 즉시 그 주식을 사라고 권했다. (she 인데 buys 가 아니다)',
          },
          {
            en: 'The committee commanded that construction of the building cease.',
            ko: '위원회는 그 건물의 공사를 중단하라고 명령했다. (단수 construction 인데 ceases 가 아니다)',
          },
        ],
      },
      {
        name: '주절이 과거여도 시제를 맞추지 않는다',
        note: '아직 일어나지 않은 일을 요구하는 자리라 시제 일치의 밖에 있다.',
        examples: [
          {
            en: 'The minister insisted that a bridge be constructed over the river to solve the traffic problem.',
            ko: '장관은 교통 문제를 풀려면 강 위에 다리를 놓아야 한다고 주장했다. (수동이라 be p.p. 그대로)',
          },
        ],
      },
      {
        name: '요구하는 뜻의 형용사 뒤도 같다',
        items: ['necessary', 'essential', 'important', 'imperative', 'desirable'],
        note: 'It is ~ that 꼴에서도 that절이 (should) + 원형이 된다.',
        examples: [
          {
            en: 'It is necessary that he be present at the meeting.',
            ko: '그가 회의에 참석해야 한다. (he 인데 is 가 아니라 be)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '같은 동사라도 **사실을 말할 때는 원형을 쓰지 않는다.** insist 가 「우기다」, suggest 가 ' +
        '「시사하다」로 쓰이면 시제를 그대로 맞춘다.',
      examples: [
        {
          en: 'He insisted that he was innocent.',
          ko: '그는 자기가 결백하다고 우겼다. (사실 주장 — 시제 그대로)',
          source: 'written',
        },
        {
          en: 'He insisted that she be present at the meeting.',
          ko: '그는 그녀가 회의에 참석해야 한다고 주장했다. (요구 — 원형)',
          source: 'written',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-ing',
    focus: '관용 표현',
    title: '동명사가 든 관용 표현 — 통째로 외운다',
    summary:
      '사이에 다른 말이 끼어들 자리가 없는 굳은 꼴이다. **-ing 를 원형으로 바꾸면 틀린다.**',
    detail:
      '시험은 이 표현들의 **-ing 자리에 원형을 넣어** 놓고 고르라고 한다. 그래서 꼴 전체를 ' +
      '눈에 익혀 두는 것이 가장 빠르다.\n\n' +
      'be worth -ing 는 결이 하나 더 있다. 꼴은 능동인데 **뜻은 수동**이다. worth ' +
      'considering 이 「검토될 만하다」다.',
    groups: [
      {
        name: '자주 나오는 꼴',
        items: [
          'have difficulty (in) -ing — ~하는 데 어려움을 겪다',
          'be good at -ing — ~을 잘하다',
          'be worth -ing — ~할 값어치가 있다',
          'be busy -ing — ~하느라 바쁘다',
          'It is no use -ing — ~해야 소용없다',
          'cannot help -ing — ~하지 않을 수 없다',
        ],
        note: 'in 이나 at 이 지워지기도 하지만 뒤는 언제나 -ing 다.',
        examples: [
          {
            en: 'The homeless usually have great difficulty getting a job, so they are losing their hope.',
            ko: '노숙인은 대개 일자리를 얻는 데 큰 어려움을 겪어서 희망을 잃어 가고 있다. (in 이 지워졌다)',
          },
          {
            en: 'The speaker was not good at getting his ideas across to the audience.',
            ko: '그 연사는 자기 생각을 청중에게 건네는 데 서툴렀다.',
          },
        ],
      },
      {
        name: 'be worth -ing — 꼴은 능동, 뜻은 수동',
        note: '「~될 만하다」로 옮겨지지만 being p.p. 로 쓰지 않는다.',
        examples: [
          {
            en: 'One aspect of leadership is particularly worth noting in this regard: Leadership is a social influence process shared among all members of a group.',
            ko: '이 점에서 리더십의 한 면은 특히 눈여겨볼 값어치가 있다. 리더십은 한 무리의 모든 구성원이 함께 나누는 사회적 영향의 과정이다.',
          },
        ],
      },
    ],
    pitfall: {
      text: 'worth 뒤에 과거분사를 두면 틀린다. **-ing 인 채로 수동의 뜻을 담는다.**',
      contrasts: [
        {
          wrong: 'His plan for the smart city was worth considered.',
          right: 'His plan for the smart city was worth considering.',
          why: 'worth 뒤에는 -ing 가 온다. 꼴은 능동이지만 「검토될 만하다」는 뜻이다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-ing',
    focus: '전치사 + 동명사',
    title: '전치사 + 동명사 — to 가 전치사인 표현',
    summary:
      '전치사 뒤에는 **동명사**가 온다. 시험이 노리는 곳은 **to 가 전치사인 표현**이다.',
    detail:
      'look forward to 의 to 는 부정사의 to 가 아니라 전치사다. 그래서 뒤에 원형이 아니라 ' +
      '-ing 가 온다.\n\n' +
      '가리는 법은 하나다. **그 자리에 명사를 넣어 본다.** 명사가 들어가면 전치사다. ' +
      'look forward to the party 가 되니 to 는 전치사다.',
    groups: [
      {
        name: 'to 가 전치사인 표현',
        items: [
          'look forward to', 'be used to', 'be committed to', 'commit to',
          'devote A to', 'object to', 'in addition to', 'when it comes to', 'be accustomed to',
        ],
        note: '뒤에 원형을 놓으면 틀린다. 명사를 넣어 말이 되면 전치사라는 표시다.',
        examples: [
          {
            en: 'The NHC Foundation is committed to helping the NHC by partnering with diverse actors, including businesses, philanthropists, and the general public.',
            ko: 'NHC 재단은 기업과 자선가, 일반 대중을 아우르는 여러 주체와 손잡음으로써 NHC 를 돕는 일에 힘을 쏟고 있다.',
          },
          {
            en: 'Few native-speaker adults are willing to devote time to interacting with someone who does not speak the language.',
            ko: '원어민 어른은 그 언어를 못 하는 누군가와 주고받는 일에 기꺼이 시간을 들이려 하지 않는다.',
          },
        ],
      },
      {
        name: 'used to 와 be used to 는 다르다',
        note: 'used to + 원형은 「예전에는 ~했다」, be used to + -ing 는 「~에 익숙하다」다.',
        examples: [
          {
            en: "A: I'm traveling abroad, but I'm not used to staying in another country. B: Don't worry. You'll get accustomed to it in no time.",
            ko: 'A: 해외여행을 가는데 다른 나라에 머무는 것이 익숙하지 않아. B: 걱정 마. 금세 익숙해질 거야.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'look forward to 뒤에 원형을 두는 것이 가장 잦은 흠이다. 시험이 두 번이나 고른 자리다.',
      contrasts: [
        {
          wrong: 'I have never been to Buffalo, so I am looking forward to go there.',
          right: 'I have never been to Buffalo, so I am looking forward to going there.',
          why: 'look forward to 의 to 는 전치사다. 뒤에 동명사가 온다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-ing',
    focus: '동명사만 받는 동사',
    title: '동명사만 받는 동사 — to부정사를 못 받는다',
    summary:
      '목적어로 **동명사만** 받는 동사가 있다. to부정사를 두면 틀린다.',
    detail:
      '뜻에 결이 있다. 이 무리는 **이미 하고 있거나 지나간 일**에 기운다. 반대로 to부정사만 ' +
      '받는 동사(want · hope · plan)는 앞으로 할 일에 기운다.\n\n' +
      '다만 이 결은 외우기의 실마리일 뿐이다. 결국 **동사별로 외워 두는** 수밖에 없다.',
    groups: [
      {
        name: '동명사만 받는 동사',
        items: [
          'enjoy', 'avoid', 'mind', 'finish', 'give up', 'postpone', 'put off',
          'admit', 'deny', 'suggest', 'consider', 'quit', 'practice', 'involve',
        ],
        note: '「이미 하고 있는 일 · 지나간 일」에 기우는 뜻이 많다.',
        examples: [
          {
            en: 'Your partner has just run off with your best friend, yet you cannot avoid going in to teach a class of inquisitive students.',
            ko: '짝이 방금 가장 친한 친구와 달아났는데도, 당신은 캐묻기 좋아하는 학생들을 가르치러 들어가는 일을 피할 수 없다.',
          },
          {
            en: 'This involves ignoring your own needs and focusing on the person speaking―a task made more difficult by the way the human brain works.',
            ko: '이것은 자기 욕구를 접어 두고 말하는 사람에게 집중하는 일을 수반한다 — 인간의 뇌가 작동하는 방식 때문에 더 어려워진 일이다.',
          },
        ],
      },
      {
        name: '둘 다 받되 뜻이 갈리는 동사',
        items: ['remember', 'forget', 'stop', 'try', 'regret'],
        note: '**-ing 는 이미 한 일**, **to부정사는 앞으로 할 일**이다. stop -ing 는 그만두는 것, stop to do 는 하려고 멈추는 것이다.',
      },
    ],
    pitfall: {
      text:
        'suggest 는 **동명사를 받고**, 사람을 목적어로 두지 못한다. 「제안하다」라 4형식일 것 ' +
        '같지만 아니다.',
      contrasts: [
        {
          wrong: 'She suggested me a new plan.',
          right: 'She suggested a new plan to me.',
          why: 'suggest 는 사람을 바로 받지 못한다. 사람은 to 로 데려온다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-participle',
    focus: '과거분사구가 뒤에서 꾸민다',
    title: '과거분사구가 뒤에서 꾸민다 — 「관계사 + be」가 지워졌다',
    summary:
      '명사 뒤에 붙은 과거분사구는 **「관계대명사 + be동사」가 지워진** 꼴이다.',
    detail:
      '분사 하나면 명사 앞에 서지만, 딸린 말이 있어 길어지면 **뒤로** 간다. a study entitled ~ ' +
      '는 a study which was entitled ~ 와 같다.\n\n' +
      '이 꼴은 주어와 동사를 아주 멀리 떼어 놓는다. 그 사이에 통째로 끼어들기 때문이다.',
    groups: [
      {
        name: '「관계사 + be」를 되살려 읽는다',
        note: '되살리면 문장의 뼈대가 드러난다.',
        examples: [
          {
            en: 'A recent World Bank study entitled "Growth Is Good for the Poor" reveals a one-for-one relationship between income of the bottom fifth of the population and per capita GDP.',
            ko: '「성장은 가난한 이에게 이롭다」라는 제목의 최근 세계은행 연구는 인구 하위 5분의 1의 소득과 1인당 GDP 사이의 일대일 관계를 보여 준다. (which was entitled 가 지워졌다)',
          },
          {
            en: 'I believe that she meets all the requirements mentioned in your job description and indeed exceeds them in many ways.',
            ko: '저는 그녀가 귀사의 채용 공고에 적힌 모든 요건을 충족하고, 실은 여러 면에서 그것을 넘어선다고 믿습니다.',
          },
        ],
      },
      {
        name: '주어와 동사를 멀리 떼어 놓는다',
        note: '분사구를 걷어 내면 뼈대가 드러난다. 그 안의 명사는 동사의 수를 정하지 못한다.',
        examples: [
          {
            en: 'The larger national awards given in most countries are the most influential and have helped considerably to raise public awareness about the fine books being published for young readers.',
            ko: '대부분의 나라에서 주어지는 더 큰 전국 단위 상들은 가장 영향력이 크며, 어린 독자를 위해 출간되고 있는 좋은 책들에 대한 대중의 인식을 높이는 데 크게 이바지해 왔다. (핵은 awards — 복수라 are)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**방향을 뒤집으면 틀린다.** 꾸밈을 받는 명사가 하는 쪽이면 -ing, 당하는 쪽이면 p.p. 다. ' +
        '시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: "There's a lot of attention paying to this question of whether it's better to have an optimistic lens.",
          right: "There's a lot of attention paid to this question of whether it's better to have an optimistic lens.",
          why: '관심이 쏠리는 쪽이라 과거분사다. pay attention to 라는 짝에서 왔다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-participle',
    focus: '진행 수동 being p.p.',
    title: '진행 수동 being p.p. — 지금 되고 있는 중',
    summary:
      '「지금 ~되고 있는」이다. **which is being p.p.** 에서 which is 가 지워진 꼴이다.',
    detail:
      '두 뜻이 겹쳐 있다. **being 이 「진행 중」**을, **p.p. 가 「당하는 쪽」**을 나타낸다.\n\n' +
      '그냥 과거분사만 붙이면 「이미 그렇게 된」이 된다. published 는 「출간된」, ' +
      'being published 는 「출간되고 있는」이다.',
    groups: [
      {
        name: '지금 벌어지고 있는 일',
        note: '이미 끝난 일이면 being 없이 과거분사만 쓴다.',
        examples: [
          {
            en: 'The larger national awards given in most countries are the most influential and have helped considerably to raise public awareness about the fine books being published for young readers.',
            ko: '대부분의 나라에서 주어지는 더 큰 전국 단위 상들은 가장 영향력이 크며, 어린 독자를 위해 출간되고 있는 좋은 책들에 대한 대중의 인식을 높이는 데 크게 이바지해 왔다.',
          },
          {
            en: 'At work, this difference can be an advantage for men, as they can put other matters aside and concentrate fully on the topic being discussed.',
            ko: '직장에서 이 차이는 남성에게 이점일 수 있다. 다른 일을 치워 두고 논의되고 있는 주제에 온전히 집중할 수 있기 때문이다.',
          },
        ],
      },
      {
        name: '한 문장에 둘이 함께 오기도 한다',
        note: 'given(주어지는) 과 being published(출간되고 있는) 가 결이 다르다.',
      },
    ],
    pitfall: {
      text:
        '**being 을 빼면 뜻이 달라진다.** the topic discussed 는 「논의된 주제」이고, ' +
        'the topic being discussed 는 「지금 논의되고 있는 주제」다.',
    },
  },

  {
    level: 'focus',
    unitId: 'vb-participle',
    focus: '복합형용사(하이픈)',
    title: '복합형용사 — 하이픈으로 묶으면 안쪽은 단수',
    summary:
      '하이픈으로 묶인 것은 **하나의 형용사**다. 그 안의 명사는 복수로 쓰지 않는다.',
    detail:
      '80-foot walls 는 「80피트 높이의 벽」이다. foot 를 feet 로 쓰지 않는다. 하이픈이 두 ' +
      '낱말을 하나의 형용사로 묶어 버렸기 때문이다.\n\n' +
      '보어 자리로 가면 다시 풀린다. **The walls are 80 feet high** 에서는 복수다.',
    groups: [
      {
        name: '명사 앞에서는 단수',
        note: '하이픈으로 묶이면 안쪽 명사는 복수형을 쓰지 않는다.',
        examples: [
          {
            en: 'Because its main attraction is its seaside Old Town surrounded by 80-foot medieval walls, this Dalmatian Coast town does not absorb visitors very well.',
            ko: '주된 볼거리가 80피트 높이의 중세 성벽에 둘러싸인 바닷가 구시가지이기 때문에, 이 달마티아 해안 마을은 방문객을 잘 품어 내지 못한다.',
          },
          {
            en: "The price tag of the quarter-pound bags of cultivated meat at Huber's is a testament to how incredibly expensive it is to produce it.",
            ko: '후버스에서 파는 4분의 1파운드짜리 배양육 봉지의 가격표는 그것을 만드는 일이 얼마나 비싼지를 보여 주는 증거다.',
          },
        ],
      },
      {
        name: '분사도 하이픈으로 묶인다',
        note: '「명사 + 분사」를 묶어 하나의 형용사로 만든다.',
        examples: [
          {
            en: 'But getting that same blue light from the sun, which contains a health-boosting full spectrum of light, does the opposite.',
            ko: '그러나 건강을 북돋우는 전 파장의 빛을 품은 태양에서 같은 청색광을 얻는 것은 그 반대의 일을 한다. (health-boosting — 하나의 형용사)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**보어 자리로 가면 복수로 돌아간다.** 80-foot walls 이지만 The walls are 80 feet high 다. ' +
        '하이픈이 있는지 없는지로 갈린다.',
    },
  },

  {
    level: 'focus',
    unitId: 'v-tense',
    focus: '과거완료(대과거)',
    title: '과거완료 — 과거보다 한 걸음 더 앞',
    summary:
      '지난 두 일 가운데 **더 앞선 쪽**을 had p.p. 로 적는다. 뒤에 일어난 쪽이 단순과거다.',
    detail:
      '한 문장 안에 지난 일이 둘 있을 때 쓴다. 어느 쪽이 먼저인지를 시제로 갈라 준다.\n\n' +
      '**already · before · when** 같은 말이 그 순서를 다시 못 박아 주기도 한다.',
    groups: [
      {
        name: '앞선 쪽이 had p.p.',
        note: '뒤에 일어난 일은 단순과거다. 두 시제가 짝을 이룬다.',
        examples: [
          {
            en: 'The movie had already started when we arrived.',
            ko: '우리가 도착했을 때 영화는 이미 시작해 있었다. (도착이 과거, 시작이 그보다 앞)',
          },
          {
            en: 'Since the warranty had expired, the repairs were not free of charge.',
            ko: '보증이 만료되어서 수리는 무료가 아니었다.',
          },
        ],
      },
      {
        name: '수동이면 had been p.p.',
        note: '앞선 때와 당하는 쪽이 겹친 꼴이다.',
        examples: [
          {
            en: 'After almost fifty years of labor, this tiny hunting lodge had been transformed into an enormous palace, a quarter of a mile long.',
            ko: '거의 오십 년의 노동 끝에 이 작은 사냥 오두막은 길이가 4분의 1마일에 이르는 거대한 궁전으로 바뀌어 있었다.',
          },
        ],
      },
      {
        name: '절 안에 들어가기도 한다',
        note: '주절의 동사보다 앞선 일이면 딸린 절에서도 과거완료를 쓴다.',
        examples: [
          {
            en: 'The boss hit the roof when he saw that we had already spent the entire budget in such a short period of time.',
            ko: '우리가 그렇게 짧은 사이에 예산을 다 써 버린 것을 보고 상사가 몹시 화를 냈다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**순서가 뻔하면 굳이 쓰지 않는다.** before · after 처럼 순서를 알려 주는 접속사가 ' +
        '있으면 단순과거로도 충분하다.',
    },
  },

  {
    level: 'focus',
    unitId: 'v-tense',
    focus: 'since · ago · until 과의 짝',
    title: 'since · ago · until — 시제의 짝이 정해져 있다',
    summary:
      '**since 는 완료**, **ago 는 과거**, **until 은 이어지는 일**과 짝이다. 섞으면 틀린다.',
    detail:
      'since 는 시작점을 못 박고 지금까지 이어짐을 뜻하므로 주절이 완료다. ago 는 지금과 끊어진 ' +
      '한 시점이라 과거다.\n\n' +
      'until 은 by 와 갈린다. **until 은 그때까지 이어지는 일**, **by 는 그때까지 끝내는 일**이다.',
    groups: [
      {
        name: 'since — 주절은 완료, since 절은 과거',
        note: '시작점은 지나갔고 그 뒤가 지금까지 이어진다. 두 시제가 짝을 이룬다.',
        examples: [
          {
            en: 'I have been doing this work ever since I retired.',
            ko: '나는 은퇴한 뒤부터 내내 이 일을 해 오고 있다. (retired 는 과거, have been doing 은 완료)',
          },
          {
            en: 'I was born in Taiwan, but I have lived in Korea since I started work.',
            ko: '나는 타이완에서 태어났지만, 일을 시작한 뒤로는 한국에서 살아 왔다.',
          },
        ],
      },
      {
        name: 'until 과 by 를 가른다',
        note: 'until 은 그때까지 **이어지는** 일, by 는 그때까지 **끝내는** 일이다.',
        contrasts: [
          {
            wrong: 'We have to finish the work until the end of this month.',
            right: 'We have to finish the work by the end of this month.',
            why: '끝내는 시점의 마감을 말하니 by 다. until 은 계속되는 일에 쓴다.',
          },
        ],
      },
    ],
    pitfall: {
      text: '**ago 는 완료와 함께 쓰지 못한다.** 시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: "I've received the last e-mail from him two years ago.",
          right: 'I received the last e-mail from him two years ago.',
          why: 'two years ago 가 시점을 못 박는다. 완료는 지금과 이어진 일에 쓴다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'v-tense',
    focus: '시간·조건 부사절 — 현재가 미래를 대신',
    title: '시간 · 조건 부사절 — 현재가 미래를 대신한다',
    summary:
      '때와 조건을 나타내는 **부사절**에서는 앞날의 일이라도 **현재로** 적는다. will 을 쓰지 않는다.',
    detail:
      '주절에는 will 을 그대로 쓴다. 부사절만 현재로 적는다. 두 절의 시제가 달라 보이는 것이 ' +
      '오히려 옳은 꼴이다.\n\n' +
      '조건이 하나 있다. **부사절일 때만** 그렇다. 같은 when · if 라도 명사절이면 will 을 쓴다.',
    groups: [
      {
        name: '이 접속사들이 이끄는 부사절',
        items: ['when', 'as soon as', 'before', 'after', 'until', 'by the time', 'if', 'unless'],
        note: '앞날의 일이라도 현재로 적는다. 완료가 필요하면 현재완료를 쓴다.',
        examples: [
          {
            en: 'Please come to the headquarters as soon as you receive this letter.',
            ko: '이 편지를 받는 대로 본부로 와 주십시오. (will receive 가 아니다)',
          },
        ],
      },
      {
        name: '명사절이면 will 을 쓴다',
        note: '같은 when · if 라도 주어 · 목적어 자리에 들어가면 부사절이 아니다.',
        examples: [
          {
            en: 'I don’t know when he will come.',
            ko: '나는 그가 언제 올지 모른다. (know 의 목적어라 명사절 — will 을 쓴다)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text: '부사절에 will 을 쓰면 틀린다. 시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: "I'll think of you when I'll be lying on the beach next week.",
          right: "I'll think of you when I'm lying on the beach next week.",
          why: 'when 이 이끄는 때의 부사절이다. 주절에만 will 을 쓴다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-parallel',
    focus: '동사 형태 맞추기',
    title: '동사 형태 맞추기 — 주어 하나에 동사 여럿',
    summary:
      '주어 하나에 동사 여럿이 걸릴 때, 그 동사들은 **같은 꼴**이어야 한다.',
    detail:
      '뒤쪽에서 주어를 되풀지 않으므로 겉으로는 동사만 나란히 놓인다. 그래서 어느 주어에 ' +
      '걸리는지 놓치기 쉽다.\n\n' +
      '수도 시제도 앞의 동사를 따른다. 앞이 3인칭 단수 현재면 뒤도 -s 가 붙는다.',
    groups: [
      {
        name: '주어를 되풀지 않는다',
        note: '동사만 and · but 으로 이어진다. 주어는 맨 앞에 한 번이다.',
        examples: [
          {
            en: 'But they will be based on regional and ethical trading practices and will differ from the bulk of commodity trade.',
            ko: '그러나 그것들은 지역에 맞고 윤리적인 거래 관행에 바탕을 둘 것이며, 대부분의 상품 거래와는 다를 것이다.',
          },
          {
            en: 'When the charge is transferred, the computer interprets the loss in power as a command and carries out the function the user desires.',
            ko: '전하가 옮겨지면 컴퓨터는 전력의 손실을 명령으로 해석하고 사용자가 바라는 기능을 수행한다. (둘 다 -s)',
          },
        ],
      },
      {
        name: 'but 으로 이어도 같다',
        note: '앞뒤가 반대여도 꼴은 맞춘다.',
        examples: [
          {
            en: "A lot of people have great ideas but don't act on them.",
            ko: '많은 사람이 훌륭한 생각을 가지고 있지만 그것에 따라 움직이지는 않는다.',
          },
          {
            en: 'He studied medicine at university but ended up working for an accounting firm.',
            ko: '그는 대학에서 의학을 공부했으나 결국 회계 회사에서 일하게 되었다.',
          },
        ],
      },
      {
        name: '시제가 달라도 된다',
        note: '꼴을 맞춘다는 것은 **품사와 격**을 맞춘다는 뜻이지 시제까지 같아야 한다는 것은 아니다.',
        examples: [
          {
            en: 'I am currently working on a research project on developing local communities and believe the resources available at your library would greatly benefit my work.',
            ko: '저는 지금 지역 사회를 키우는 연구 과제를 진행하고 있으며, 귀 도서관의 자료가 제 일에 크게 도움이 되리라 믿습니다. (진행형과 단순현재)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**마지막 동사에서 -s 를 빠뜨리는** 것이 가장 잦은 흠이다. 앞의 둘이 정한 꼴을 끝까지 ' +
        '지킨다.',
      contrasts: [
        {
          wrong: 'It features virtual activities, monitors health metrics, and include a companion service.',
          right: 'It features virtual activities, monitors health metrics, and includes a companion service.',
          why: '앞의 features · monitors 와 나란하다. 주어가 It 하나이니 -s 를 붙인다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-parallel',
    focus: '상관접속사 병치',
    title: '상관접속사 병치 — A와 B의 자리를 맞춘다',
    summary:
      '짝을 이루는 접속사다. **A와 B에 오는 것의 품사와 꼴이 같아야** 한다.',
    detail:
      '앞말이 나오면 뒷말이 반드시 따라온다. not only 가 나오면 but also 가, either 가 나오면 ' +
      'or 가 온다.\n\n' +
      '수일치도 갈린다. **both A and B 는 복수**, 나머지는 대개 **B에 맞춘다.**',
    groups: [
      {
        name: '짝이 정해져 있다',
        items: [
          'not only A but also B', 'both A and B', 'either A or B',
          'neither A nor B', 'not A but B', 'B as well as A',
        ],
        note: '앞말이 나오면 뒷말을 반드시 짝지어 쓴다.',
        examples: [
          {
            en: 'Such a calculation not only involves a translation process, but scientists have been handicapped by lack of knowledge of what to count.',
            ko: '그런 계산은 번역 과정을 수반할 뿐 아니라, 과학자들은 무엇을 세어야 할지 몰라 발이 묶여 왔다.',
          },
          {
            en: 'At the top, as we have seen, was the scalco, or steward, who was in charge of not only the kitchen, but also the dining room.',
            ko: '우리가 보았듯 맨 위에는 스칼코, 곧 집사가 있었고, 그는 주방뿐 아니라 식당도 맡고 있었다. (명사와 명사)',
          },
        ],
      },
      {
        name: '수일치는 뒤쪽에 맞춘다',
        note: 'both A and B 만 언제나 복수다. 나머지는 B의 수를 따른다.',
        examples: [
          {
            en: 'Neither he nor his friends were at the party.',
            ko: '그도 그의 친구들도 파티에 없었다. (뒤쪽 friends 가 복수라 were)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**A와 B의 품사가 다르면 틀린다.** 명사면 둘 다 명사, 전치사구면 둘 다 전치사구여야 한다.',
      contrasts: [
        {
          wrong: 'She is not only intelligent but also works hard.',
          right: 'She is not only intelligent but also hardworking.',
          why: 'not only 뒤가 형용사이니 but also 뒤도 형용사여야 한다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-parallel',
    focus: '짝 전치사 유지',
    title: '짝 전치사 유지 — 되풀거나 아예 지운다',
    summary:
      '나열할 때 전치사는 **모두 되풀거나 아예 한 번만** 쓴다. 섞으면 짝이 흐트러진다.',
    detail:
      '되풀어 적으면 항목마다 따로임이 또렷해지고, 한 번만 쓰면 하나로 묶인다. 어느 쪽도 되지만 ' +
      '**섞지는 않는다.**\n\n' +
      '동사마다 짝이 되는 전치사가 정해져 있다는 것도 함께 새긴다. adjust to · differ from · ' +
      'be based on 처럼 굳어 있다.',
    groups: [
      {
        name: '되풀어 적으면 따로임이 또렷해진다',
        note: '한 번만 쓰면 하나로 묶여 읽힌다. 결을 골라 쓰는 자리다.',
        examples: [
          {
            en: 'Hearing what other people have to say, especially about concepts we regard as foundational, is like opening a window in our minds and in our hearts.',
            ko: '다른 사람이 하는 말을 듣는 것은 우리 머리와 마음에 창을 여는 것과 같다. (in 을 되풀어 둘이 따로임을 살렸다)',
          },
          {
            en: 'They can turn up or flatten to adjust to the flow of water around the shark and to reduce drag.',
            ko: '그것들은 상어 둘레의 물 흐름에 맞추고 항력을 줄이려고 세워지거나 납작해질 수 있다. (to 를 되풀었다)',
          },
        ],
      },
      {
        name: '동사마다 짝이 정해져 있다',
        items: ['adjust to', 'differ from', 'be based on', 'compete with', 'consist of', 'result in'],
        note: '나열할 때 앞 동사의 전치사를 뒤 동사에 그대로 쓰면 틀린다.',
        examples: [
          {
            en: 'But they will be based on regional and ethical trading practices and will differ from the bulk of commodity trade.',
            ko: '그러나 그것들은 지역에 맞고 윤리적인 거래 관행에 바탕을 둘 것이며, 대부분의 상품 거래와는 다를 것이다. (on 과 from 이 각각)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '동사 둘이 **서로 다른 전치사**를 받는데 하나만 적으면 틀린다. 저마다의 짝을 적어야 한다.',
      contrasts: [
        {
          wrong: 'He is interested and good at music.',
          right: 'He is interested in and good at music.',
          why: 'interested 의 짝은 in, good 의 짝은 at 이다. 하나로 뭉뚱그릴 수 없다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-ing',
    focus: '동명사구 주어 — 단수 취급',
    title: '동명사구 주어 — 아무리 길어도 단수',
    summary:
      '-ing 로 시작한 덩이가 주어면 동사는 단수다. 덩이 안에 복수 명사가 몇 개 들어 있어도 마찬가지다.',
    detail:
      '주어가 길어지면 눈이 동사 바로 앞의 명사로 간다. 그 명사가 복수면 동사도 복수로 쓰고 ' +
      '싶어진다. 하지만 동사가 받는 것은 **덩이 전체**지 그 안의 명사가 아니다.\n\n' +
      '읽을 때 덩이를 「~하는 일」 하나로 바꿔 보면 바로 보인다. Getting on with our ' +
      'day-to-day lives 는 「삶을 꾸려 가는 일」이고, 그 일은 하나다.',
    groups: [
      {
        name: '동사 바로 앞의 복수에 끌린다',
        note: '시험이 노리는 자리다. 주어 덩이의 끝에 복수 명사를 놓아 두면 눈이 거기에 걸린다.',
        contrasts: [
          {
            wrong: 'Getting on with our day-to-day lives require a series of civilized masks.',
            right: 'Getting on with our day-to-day lives requires a series of civilized masks.',
            why: '요구하는 것은 lives 가 아니라 「삶을 꾸려 가는 일」이다.',
          },
          {
            wrong: 'Rewarding people strictly on their merits also have the virtue of fairness.',
            right: 'Rewarding people strictly on their merits also has the virtue of fairness.',
            why: 'merits 가 바로 앞에 있어도 주어는 Rewarding 부터 merits 까지 통째다.',
          },
        ],
      },
      {
        name: '관계절이 끼어 동사가 멀어진다',
        note:
          '주어 안에 관계절이 들어가면 동사가 한참 뒤로 밀린다. 아래 문장은 is 바로 앞이 ' +
          '전치사 to 라 더 헷갈린다.',
        examples: [
          {
            en: 'Making eye contact with the person you are speaking to is important in western countries.',
            ko: '당신이 말하고 있는 사람과 시선을 마주치는 것은 서양 국가에서 중요하다.',
          },
        ],
      },
      {
        name: '절이 주어여도 마찬가지다',
        note:
          '동명사구만 그런 것이 아니다. what 절이 통째로 주어여도 단수로 받는다. 뒤의 보어가 ' +
          '둘이어도 동사는 주어에 맞춘다.',
        examples: [
          {
            en: 'What children in remote parts of India lack is access to good teachers and exposure to good-quality content.',
            ko: '인도 외딴 지역의 아이들에게 없는 것은 좋은 선생님과 좋은 내용을 접할 기회다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '첫머리 -ing 가 늘 주어인 것은 아니다. 덩이 뒤에 **새 주어**가 나오면 그건 분사구문이고, ' +
        '문장의 주어는 그 새 주어다. 콤마로는 가릴 수 없다 — 아래 둘 다 콤마가 있지만 위는 ' +
        '분사구문, 아래는 주어다.',
      examples: [
        {
          en: 'Being a kind person, she is loved by everyone.',
          ko: '친절한 사람이라서 그녀는 모두에게 사랑받는다. (주어는 she — 분사구문)',
        },
        {
          en: 'Hearing what other people have to say, especially about concepts we regard as foundational, is like opening a window in our minds and in our hearts.',
          ko: '다른 사람이 하는 말을 듣는 것은 우리 머리와 마음에 창을 여는 것과 같다. (주어는 Hearing 덩이 — 동사는 is)',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'cp-comp',
    title: '비교급 · 최상급 — 짝과 대상을 맞춘다',
    summary:
      '견줄 때는 두 가지를 맞춘다. 하나는 **꼴과 짝**(원급-as, 비교급-than), 다른 하나는 **견주는 대상**이다.',
    detail:
      '첫째, 짝이 정해져 있다. as ~ as 사이에는 원급이 오고, 비교급 뒤에는 than 이 온다. ' +
      '섞으면 틀린다.\n\n' +
      '둘째, 견주는 두 대상의 **격이 같아야** 한다. 서울의 교통은 다른 도시의 교통과 견줘야지 ' +
      '도시 자체와 견줄 수 없다. that · those 가 그 자리를 메운다.',
    groups: [
      {
        name: '짝이 정해져 있다',
        items: ['as + 원급 + as', '비교급 + than', 'the + 최상급', 'too ~ to', 'so ~ that'],
        note: '섞어 쓰면 틀린다. 특히 too 와 so 를 바꿔 쓰는 자리가 자주 나온다.',
        contrasts: [
          {
            wrong: 'Nothing is more precious as time in our life.',
            right: 'Nothing is more precious than time in our life.',
            why: '비교급 more precious 의 짝은 than 이다. as ~ as 는 원급끼리 견줄 때 쓴다.',
          },
          {
            wrong: 'The rings of Saturn are so distant to be seen from Earth without a telescope.',
            right: 'The rings of Saturn are too distant to be seen from Earth without a telescope.',
            why: 'to부정사와 짝을 이루는 것은 too 다. so 는 뒤에 that 절을 데려온다.',
          },
        ],
      },
      {
        name: '견주는 대상의 격을 맞춘다',
        note: '되풀이를 피하려고 that(단수) · those(복수) 로 앞 명사를 받는다. 수를 맞춰야 한다.',
        examples: [
          {
            en: 'The traffic jams in Seoul are more serious than those in any other city in the world.',
            ko: '서울의 교통 정체는 세계의 다른 어느 도시의 것보다도 심각하다. (those = the traffic jams)',
          },
        ],
        contrasts: [
          {
            wrong: 'The traffic of a big city is busier than those of a small city.',
            right: 'The traffic of a big city is busier than that of a small city.',
            why: 'traffic 은 셀 수 없는 단수 명사다. those 가 아니라 that 으로 받는다.',
          },
        ],
      },
      {
        name: '최상급을 비교급으로 나타내는 꼴',
        items: ['비교급 + than any other + 단수', 'No other ~ is 비교급 than', 'Nothing is 비교급 than'],
        note: '뜻은 최상급인데 꼴은 비교급이다. than 뒤의 명사가 단수라는 것이 표시다.',
      },
    ],
    pitfall: {
      text:
        'prefer 는 견주는 대상을 **to** 로 데려온다. than 이 아니고, 앞쪽에도 to 를 두지 않는다.',
      contrasts: [
        {
          wrong: 'I prefer to staying home than to going out on a snowy day.',
          right: 'I prefer staying home to going out on a snowy day.',
          why: 'prefer A to B 꼴이다. A 앞에는 to 를 두지 않고, B 앞에만 to 를 둔다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'cp-thethe',
    title: 'the 비교급, the 비교급 — 두 절이 함께 움직인다',
    summary:
      '「~할수록 더 …하다」다. 두 절 **모두** the + 비교급으로 시작하고, 콤마로 잇는다.',
    detail:
      '꼴이 통째로 굳어 있다. 「The + 비교급 + 주어 + 동사, the + 비교급 + 주어 + 동사」다. ' +
      '앞 절이 조건, 뒤 절이 결과다.\n\n' +
      '비교급이 문장 맨 앞으로 끌려 나오므로 원래 있던 자리는 비어 보인다. 되돌려 읽으면 ' +
      '뼈대가 드러난다.',
    groups: [
      {
        name: '두 절 모두 the + 비교급으로 연다',
        note: '앞 절이 「~할수록」, 뒤 절이 「더 …하다」다. 뒤 절에 the 를 빠뜨리면 틀린다.',
        examples: [
          {
            en: 'The present is all we have, and the more we are surrounded by it, the more we are aware of our own presence and participation.',
            ko: '현재가 우리가 가진 전부이며, 현재에 둘러싸일수록 우리는 우리 자신의 있음과 참여를 더 잘 알아차린다.',
          },
        ],
      },
      {
        name: '주어와 be동사를 지우기도 한다',
        note: '되풀이가 뻔한 자리에서는 줄인다. The sooner, the better. 처럼 짧게 굳은 것도 있다.',
        examples: [
          {
            en: 'The sooner, the better.',
            ko: '빠를수록 좋다. (the sooner it is, the better it is 에서 줄었다)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text: '이 짜임에는 **최상급이 오지 못한다.** the 가 붙어 있어 최상급으로 착각하기 쉽다.',
      contrasts: [
        {
          wrong: 'The more they attempted to explain their mistakes, the worst their story sounded.',
          right: 'The more they attempted to explain their mistakes, the worse their story sounded.',
          why: '「the 비교급, the 비교급」이라 worse 다. worst 는 최상급이라 이 자리에 못 온다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'cp-parallel',
    title: '병치 — 이어진 것끼리 꼴을 맞춘다',
    summary:
      'and · or · but 과 상관접속사로 이은 것들은 **품사와 꼴이 같아야** 한다.',
    detail:
      '시험은 두 가지를 묻는다. 하나는 **꼴이 맞는가**, 다른 하나는 **무엇과 무엇이 짝인가**다.\n\n' +
      '짝을 찾는 법은 하나뿐이다. 접속사를 보면 그 앞에서 같은 꼴을 찾는다. 바로 앞이 아니라 ' +
      '한참 앞일 때가 많다.',
    groups: [
      {
        name: '품사까지 맞춘다',
        note: '명사끼리, 형용사끼리 잇는다. 하나만 품사가 달라지면 틀린다.',
        contrasts: [
          {
            wrong: 'My home offers me a feeling of security, warm, and love.',
            right: 'My home offers me a feeling of security, warmth, and love.',
            why: 'security 와 love 는 명사인데 warm 은 형용사다. warmth 라야 짝이 맞는다.',
          },
        ],
      },
      {
        name: '동사 셋 이상을 이을 때도 같다',
        note: '앞의 둘이 정한 꼴을 마지막까지 지킨다.',
        contrasts: [
          {
            wrong: 'It features virtual activities, monitors health metrics, and include a companion service.',
            right: 'It features virtual activities, monitors health metrics, and includes a companion service.',
            why: '앞의 features · monitors 와 나란하다. 주어가 It 하나이니 -s 를 붙인다.',
          },
        ],
      },
      {
        name: '상관접속사는 짝의 자리를 맞춘다',
        items: ['not only A but also B', 'both A and B', 'either A or B', 'neither A nor B', 'not A but B'],
        note: 'A와 B 자리에 오는 것의 품사와 꼴이 같아야 한다.',
        examples: [
          {
            en: 'Such a calculation not only involves a translation process, but scientists have been handicapped by lack of knowledge of what to count.',
            ko: '그런 계산은 번역 과정을 수반할 뿐 아니라, 과학자들은 무엇을 세어야 할지 몰라 발이 묶여 왔다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '접속사 앞의 명사에 끌리면 짝을 잘못 잡는다. **한참 앞의 동사**가 짝일 때가 많다.',
      contrasts: [
        {
          wrong: 'It offers everything from school lessons to exam prep for aspiring engineers and have training for job-seekers.',
          right: 'It offers everything from school lessons to exam prep for aspiring engineers and has training for job-seekers.',
          why: 'has 의 짝은 바로 앞의 engineers 가 아니라 맨 앞의 offers 다. 주어는 It 하나다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'cp-invert',
    title: '도치 — 앞으로 나오면 주어와 동사가 뒤집힌다',
    summary:
      '부정어나 only 구가 문장 앞으로 나오면 **의문문처럼 조동사가 주어 앞에** 선다.',
    detail:
      '무엇이 앞으로 나오느냐에 따라 뒤집는 방식이 다르다. **부정어 · only 구**가 나오면 ' +
      '조동사를 주어 앞으로 보내고, **장소 · 방향 부사구**가 나오면 동사와 주어를 통째로 바꾼다.\n\n' +
      '뒤집힌 문장에서는 진짜 주어가 뒤에 있다. 수일치를 물을 때 시험이 노리는 자리가 바로 여기다.',
    groups: [
      {
        name: '부정어 · only 구가 앞에 나오면 조동사가 앞으로',
        items: ['never', 'hardly · scarcely', 'seldom · rarely', 'little', 'no sooner', 'not until', 'only + 부사구'],
        note: '없던 조동사는 do · does · did 로 만들어 넣는다.',
        examples: [
          {
            en: 'Hardly had I closed my eyes when I began to think of her.',
            ko: '눈을 감자마자 그녀 생각이 나기 시작했다. (had 가 I 앞으로)',
          },
          {
            en: 'Only after the meeting did he recognize the seriousness of the financial crisis.',
            ko: '회의가 끝난 뒤에야 그는 금융 위기의 심각함을 깨달았다. (did 를 만들어 넣었다)',
          },
        ],
      },
      {
        name: '장소 · 방향 부사구가 앞에 나오면 동사와 주어를 바꾼다',
        note: '조동사를 만들지 않고 동사 자체가 주어 앞에 선다. 진짜 주어는 뒤에 있다.',
        examples: [
          {
            en: 'All along the route were thousands of homespun attempts to pay tribute to the team.',
            ko: '길을 따라 내내 그 팀을 기리려는 소박한 시도가 수천 가지 있었다. (주어는 뒤의 thousands)',
          },
        ],
      },
      {
        name: 'so · neither 로 맞장구치는 꼴',
        note: '앞이 긍정이면 so, 부정이면 neither 다. 뒤에 「동사 + 주어」가 온다.',
        examples: [
          {
            en: "They didn't believe his story, and neither did I.",
            ko: '그들은 그의 이야기를 믿지 않았고, 나도 믿지 않았다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '도치된 문장에서 동사는 **뒤에 놓인 진짜 주어**에 맞춘다. 앞에 나온 부사구에 맞추면 틀린다.',
      contrasts: [
        {
          wrong: 'Among her most prized possessions sold during the evening sale were a 1961 bejeweled timepiece by Bulgari.',
          right: 'Among her most prized possessions sold during the evening sale was a 1961 bejeweled timepiece by Bulgari.',
          why: '진짜 주어는 뒤의 a timepiece 로 단수다. 앞의 possessions 는 부사구 안에 있다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-invert',
    focus: 'so · neither 도치',
    title: 'so · neither 도치 — 「나도 그렇다」',
    summary:
      '앞이 긍정이면 so, 부정이면 neither 다. 뒤는 **「(조)동사 + 주어」**로 뒤집는다.',
    detail:
      '뒤집힌 자리에 오는 동사는 **앞 절의 동사를 그대로 빌려 온다.** be동사면 be동사, ' +
      '조동사가 있으면 그 조동사, 일반동사면 do · does · did 다.\n\n' +
      '시제도 앞 절을 따른다. 앞이 과거면 뒤도 과거다.',
    groups: [
      {
        name: '긍정 뒤에는 so',
        note: '앞 절의 동사 종류를 그대로 빌려 온다.',
        examples: [
          {
            en: 'Wooden spoons are excellent toys for children, and so are plastic bottles.',
            ko: '나무 숟가락은 아이들에게 아주 좋은 장난감이고, 플라스틱 병도 그렇다. (앞이 be동사라 are)',
          },
          {
            en: 'Cindy loved playing the piano, and so did her son.',
            ko: '신디는 피아노 치기를 아주 좋아했고, 그녀의 아들도 그랬다. (앞이 일반동사 과거라 did)',
          },
        ],
      },
      {
        name: '부정 뒤에는 neither · nor',
        note: 'neither 안에 이미 부정이 들어 있으므로 not 을 또 쓰지 않는다.',
        examples: [
          {
            en: "They didn't believe his story, and neither did I.",
            ko: '그들은 그의 이야기를 믿지 않았고, 나도 믿지 않았다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**뒤집지 않으면 뜻이 달라진다.** So he did 는 「정말 그랬다」라는 맞장구이고, ' +
        'So did he 라야 「그도 그랬다」다.',
      contrasts: [
        {
          wrong: "They didn't believe his story, and neither I did.",
          right: "They didn't believe his story, and neither did I.",
          why: 'neither 뒤는 「조동사 + 주어」다. 차례를 지키지 않으면 도치가 아니다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-invert',
    focus: 'Only + 부사구 도치',
    title: 'Only + 부사구 도치 — 「~해서야 비로소」',
    summary:
      'Only 가 **부사구를 이끌고 앞에 나오면** 조동사가 주어 앞으로 간다.',
    detail:
      'Only 는 부정어가 아니지만 「~해서야 비로소」라는 제한의 뜻을 담아 도치를 부른다.\n\n' +
      '조건이 하나 있다. **Only 가 꾸미는 것이 부사구일 때만** 뒤집는다. 주어를 꾸미면 ' +
      '뒤집지 않는다.',
    groups: [
      {
        name: '조동사를 주어 앞으로',
        note: '없던 조동사는 do · does · did 로 만들어 넣는다.',
        examples: [
          {
            en: 'Only after the meeting did he recognize the seriousness of the financial crisis.',
            ko: '회의가 끝난 뒤에야 그는 금융 위기의 심각함을 깨달았다. (did 를 만들어 넣었다)',
          },
          {
            en: 'Only during the past few decades have children vacated these natural playgrounds for their growing love affair with video games, texting, and social networking.',
            ko: '지난 몇십 년 사이에야 아이들은 비디오 게임과 문자, 소셜 네트워킹에 대한 커져 가는 애착 때문에 이 자연의 놀이터를 떠났다. (have 가 앞으로)',
          },
        ],
      },
      {
        name: '주어를 꾸미면 뒤집지 않는다',
        note: 'Only 뒤에 바로 주어가 오면 평서문 어순 그대로다.',
        examples: [
          {
            en: 'Only the meeting made him recognize the crisis.',
            ko: '오직 그 회의만이 그에게 위기를 깨닫게 했다. (Only 가 주어를 꾸미니 도치하지 않는다)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'Only 가 무엇을 꾸미는지 먼저 본다. **부사구를 이끌면 뒤집고, 주어를 꾸미면 뒤집지 ' +
        '않는다.**',
    },
  },

  {
    level: 'focus',
    unitId: 'cp-invert',
    focus: '부정어가 앞에 오면 도치',
    title: '부정어가 앞에 오면 도치',
    summary:
      '부정의 뜻을 담은 말이 문장 앞에 나오면 뒤가 **의문문 어순**이 된다.',
    detail:
      '앞으로 나오는 것은 부정어 자체가 아니라 부정어가 든 덩이다. Not only · Not until 처럼 ' +
      '뒤에 말이 딸려 나오기도 한다.\n\n' +
      '뒤집는 방식은 의문문과 같다. 조동사를 주어 앞으로 보내고, 조동사가 없으면 do · does · ' +
      'did 를 만들어 넣는다.',
    groups: [
      {
        name: '앞으로 나오면 뒤집히는 말',
        items: ['never', 'hardly · scarcely', 'seldom · rarely', 'little', 'no sooner', 'not until', 'not only'],
        note: '「거의 ~않다」처럼 부정의 뜻만 있으면 not 이 없어도 도치를 부른다.',
        examples: [
          {
            en: 'Never had she seen such fireworks.',
            ko: '그녀는 그런 불꽃놀이를 한 번도 본 적이 없었다. (had 가 she 앞으로)',
          },
          {
            en: 'Hardly had I closed my eyes when I began to think of her.',
            ko: '눈을 감자마자 그녀 생각이 나기 시작했다.',
          },
        ],
      },
      {
        name: 'Not only 는 뒤 절까지 짝을 이룬다',
        note: '앞 절만 뒤집고 but 뒤의 절은 그대로 둔다.',
        examples: [
          {
            en: 'Not only are the two groups culturally different, but they’re in vastly different phases of their financial life.',
            ko: '그 두 집단은 문화적으로 다를 뿐 아니라, 재정적 삶의 단계도 아주 다르다. (앞 절만 뒤집혔다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'Hardly · No sooner 는 **짝이 되는 접속사**가 정해져 있다. hardly ~ when, ' +
        'no sooner ~ than 이다. 그리고 앞선 일이라 과거완료를 쓴다.',
      contrasts: [
        {
          wrong: 'No sooner I have finishing the meal than I started feeling hungry again.',
          right: 'No sooner had I finished the meal than I started feeling hungry again.',
          why: '부정어가 앞에 서면 도치되고, 앞선 일이라 과거완료 had p.p. 다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-invert',
    focus: '장소·방향 부사구 도치',
    title: '장소 · 방향 부사구 도치 — 주어가 뒤로 간다',
    summary:
      '장소나 방향을 나타내는 부사구가 앞에 나오면 **동사와 주어가 통째로 바뀐다.**',
    detail:
      '부정어 도치와 다르다. 조동사를 만들어 넣지 않고 **동사 자체가 주어 앞에** 선다.\n\n' +
      '무거운 주어를 뒤로 미루려는 자리다. 그래서 뒤에 오는 주어가 길고, 새로 꺼내는 정보일 ' +
      '때가 많다.',
    groups: [
      {
        name: '「부사구 + 동사 + 주어」',
        note: 'do 를 빌려 오지 않는다. 본동사가 그대로 앞에 선다.',
        examples: [
          {
            en: 'All along the route were thousands of homespun attempts to pay tribute to the team, including messages etched in cardboard, snow and construction paper.',
            ko: '길을 따라 온통, 판지와 눈과 색도화지에 새긴 메시지를 비롯해 그 팀을 기리려는 손수 만든 시도가 수천 가지 있었다.',
          },
          {
            en: 'They left their camp at sunrise and a few hours later they came upon a beautiful plain and on the plain were more buffalo than they had ever seen before in one place.',
            ko: '그들은 해 뜰 무렵 야영지를 떠났고, 몇 시간 뒤 아름다운 들판을 마주쳤으며, 그 들판에는 한곳에서 본 적 있는 것보다 더 많은 들소가 있었다.',
          },
        ],
      },
      {
        name: '새 인물 · 새 사물을 꺼낼 때 쓴다',
        note: '뒤에 놓아 눈길이 그리로 가게 한다.',
        examples: [
          {
            en: 'At the top, as we have seen, was the scalco, or steward, who was in charge of not only the kitchen, but also the dining room.',
            ko: '우리가 보았듯 맨 위에는 스칼코, 곧 집사가 있었고, 그는 주방뿐 아니라 식당도 맡고 있었다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '동사는 **뒤에 놓인 진짜 주어**에 맞춘다. 앞에 나온 부사구 안의 명사에 맞추면 틀린다. ' +
        '시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'Among her most prized possessions sold during the evening sale were a 1961 bejeweled timepiece by Bulgari.',
          right: 'Among her most prized possessions sold during the evening sale was a 1961 bejeweled timepiece by Bulgari.',
          why: '진짜 주어는 뒤의 a timepiece 로 단수다. possessions 는 부사구 안에 있다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-comp',
    focus: '최상급 · 최상급 대용',
    title: '최상급 — 비교급으로도 최상급을 말한다',
    summary:
      '「가장 ~하다」는 최상급 말고도 여러 꼴로 말한다. **부정어 + 비교급**이 가장 자주 나온다.',
    detail:
      '최상급을 쓰지 않고 최상급의 뜻을 내는 꼴이 시험에 즐겨 나온다. Nothing is more ' +
      'precious than time 은 「시간이 가장 소중하다」와 같다.\n\n' +
      '이때 than 뒤의 명사가 **단수**라는 것이 표시다. any other 뒤에는 반드시 단수가 온다.',
    groups: [
      {
        name: '비교급으로 최상급을 말하는 꼴',
        items: [
          '비교급 + than any other + 단수',
          'No other ~ is 비교급 than',
          'Nothing is 비교급 than',
        ],
        note: '뜻은 최상급인데 꼴은 비교급이다. than 뒤가 단수인 것이 표시다.',
        examples: [
          {
            en: 'The traffic jams in Seoul are more serious than those in any other city in the world.',
            ko: '서울의 교통 정체는 세계의 다른 어느 도시의 것보다도 심각하다. (any other city — 단수)',
          },
          {
            en: 'If terrorism is a form of theater where you want a lot of people watching, no event in human history was likely ever seen by a larger global audience than the 9/11 attacks.',
            ko: '테러가 많은 사람이 지켜보기를 바라는 연극의 한 형태라면, 인류 역사의 어떤 사건도 9·11 공격보다 더 큰 세계적 관객에게 보이지는 않았을 것이다.',
          },
        ],
      },
      {
        name: 'one of the + 최상급 + 복수',
        note: '「가장 ~한 것 가운데 하나」다. of 뒤는 반드시 복수다.',
        examples: [
          {
            en: 'Fear and its companion pain are two of the most useful things that men and animals possess, if they are properly used.',
            ko: '두려움과 그 짝인 아픔은, 제대로 쓰인다면 사람과 동물이 지닌 가장 쓸모 있는 것 가운데 둘이다.',
          },
        ],
      },
      {
        name: 'the 를 붙이지 않는 최상급',
        note: '**같은 것의 상태끼리** 견줄 때는 the 를 붙이지 않기도 한다.',
        examples: [
          {
            en: 'Children are most creative when they are free to brainstorm with lots of praise and encouragement in a peaceful environment.',
            ko: '아이들은 평화로운 환경에서 넉넉한 칭찬과 격려 속에 마음껏 생각을 쏟아 낼 수 있을 때 가장 창의적이다. (「가장 창의적인 아이」가 아니라 「가장 창의적인 때」)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'any other 뒤에는 **단수**가 온다. 복수를 두면 틀린다. 최상급 둘을 and 로 이을 때는 ' +
        'the 를 한 번만 쓴다.',
      examples: [
        {
          en: "Domesticated animals are the earliest and most effective 'machines' available to humans.",
          ko: '가축화된 동물은 인간이 쓸 수 있는 가장 이르고 가장 효과적인 「기계」다. (the 가 둘에 걸린다)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-comp',
    focus: '비교급 + than',
    title: '비교급 + than — 짝을 지킨다',
    summary:
      '비교급의 짝은 **than** 이다. as 를 쓰면 틀린다. 둘 사이가 멀어지기도 한다.',
    detail:
      '-er 이나 more 가 보이면 뒤에 than 을 찾는다. 그 둘이 한 짝이다.\n\n' +
      '다만 **사이가 벌어질 수 있다.** than 이 앞으로 당겨져 비교급 바로 뒤에 오기도 하는데, ' +
      '뜻은 달라지지 않는다.',
    groups: [
      {
        name: '짝이 벌어지기도 한다',
        note: 'than 구가 앞으로 당겨져 원래 자리에서 멀어진다. 되돌려 읽으면 뼈대가 보인다.',
        examples: [
          {
            en: 'People with high levels of stress hormones or shifts in the levels of cytokines are more likely than others to have chronic insomnia.',
            ko: '스트레스 호르몬 수치가 높거나 사이토카인 수치에 변동이 있는 사람들은 다른 이들보다 만성 불면증에 걸리기 더 쉽다. (원래는 more likely to have ~ than others)',
          },
        ],
      },
      {
        name: '비교급을 세게 하는 말',
        items: ['much', 'far', 'even', 'still', 'a lot'],
        note: 'very 는 비교급을 꾸미지 못한다. 원급에만 붙는다.',
      },
    ],
    pitfall: {
      text:
        '**비교급의 짝은 than, 원급의 짝은 as** 다. 섞으면 틀린다. 시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'Nothing is more precious as time in our life.',
          right: 'Nothing is more precious than time in our life.',
          why: 'more precious 라는 비교급의 짝은 than 이다.',
        },
        {
          wrong: 'It turns out that he was not so stingier as he was thought to be.',
          right: 'It turns out that he was not so stingy as he was thought to be.',
          why: 'so ~ as 는 원급끼리 견주는 꼴이라 비교급이 오지 못한다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-comp',
    focus: 'the + 형용사',
    title: 'the + 형용사 — 「~한 사람들」',
    summary:
      '형용사 앞에 the 를 붙이면 **그런 사람들 전체**를 가리키는 복수 명사가 된다.',
    detail:
      'the poor 는 「가난함」이 아니라 「가난한 사람들」이다. 사람 여럿을 가리키므로 동사도 ' +
      '**복수**로 받는다.\n\n' +
      '과거분사가 형용사로 굳은 말도 이 꼴이 된다. the deceased 는 「죽은 이들」이다.',
    groups: [
      {
        name: '복수로 받는다',
        items: ['the poor', 'the rich', 'the young', 'the old', 'the homeless', 'the deceased'],
        note: '-s 가 붙지 않아도 복수다. 동사에 -s 를 붙이지 않는다.',
        examples: [
          {
            en: 'Yet among the Hopi Indians of Arizona, the deceased are forgotten as quickly as possible and life goes on as usual.',
            ko: '그런데 애리조나의 호피족 사이에서는 죽은 이가 되도록 빨리 잊히고 삶은 여느 때처럼 이어진다. (are — 복수)',
          },
          {
            en: 'The study notes that openness to foreign trade benefits the poor to the same extent that it benefits the whole economy.',
            ko: '그 연구는 대외 무역 개방이 경제 전체를 이롭게 하는 것과 꼭 같은 정도로 가난한 이들도 이롭게 한다고 지적한다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**추상명사가 되는 것도 있다.** the true · the beautiful 처럼 성질을 가리킬 때는 단수로 ' +
        '받는다. 사람을 가리키는지 성질을 가리키는지로 갈린다.',
    },
  },

  {
    level: 'focus',
    unitId: 'cp-comp',
    focus: '비교 대상 맞추기',
    title: '비교 대상 맞추기 — 같은 것끼리 견준다',
    summary:
      '견주는 두 대상은 **같은 층**이어야 한다. 교통은 교통과, 문장은 문장과 견준다.',
    detail:
      '서울의 교통을 다른 도시와 견줄 수는 없다. 다른 도시의 **교통**과 견줘야 한다.\n\n' +
      '되풀이를 피하려고 **that(단수) · those(복수) · one(단수) · ones(복수)** 로 받는다. ' +
      '받는 말의 수를 앞말에 맞춰야 한다.',
    groups: [
      {
        name: 'that · those 로 앞말을 받는다',
        note: '앞말이 단수면 that, 복수면 those 다. 셀 수 없는 명사는 that 으로 받는다.',
        examples: [
          {
            en: 'The traffic jams in Seoul are more serious than those in any other city in the world.',
            ko: '서울의 교통 정체는 세계의 다른 어느 도시의 것보다도 심각하다. (those = the traffic jams)',
          },
        ],
        contrasts: [
          {
            wrong: 'The traffic of a big city is busier than those of a small city.',
            right: 'The traffic of a big city is busier than that of a small city.',
            why: 'traffic 은 셀 수 없는 단수 명사다. those 가 아니라 that 으로 받는다.',
          },
        ],
      },
      {
        name: 'one · ones 로 받기도 한다',
        note: '셀 수 있는 명사를 되받을 때 쓴다. 복수면 ones 다.',
        examples: [
          {
            en: 'The very first sentence from the Japanese participants was likely to be one referring to the environment, whereas the first sentence from Americans was three times as likely to be one referring to the focal fish.',
            ko: '일본인 참가자들의 맨 첫 문장은 환경을 가리키는 문장일 때가 많았던 반면, 미국인들의 첫 문장은 초점이 되는 물고기를 가리키는 문장일 가능성이 세 배나 높았다. (one = a sentence)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '받는 말을 아예 빠뜨리면 **엉뚱한 것끼리 견주는** 문장이 된다. than 뒤에 무엇이 있는지 ' +
        '반드시 확인한다.',
      contrasts: [
        {
          wrong: 'The population of Seoul is larger than Busan.',
          right: 'The population of Seoul is larger than that of Busan.',
          why: '견주는 것은 인구끼리다. that 이 없으면 인구와 도시를 견주는 꼴이 된다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-if',
    focus: '가정법 과거',
    title: '가정법 과거 — 지금 사실이 아닌 일',
    summary:
      '**If + 과거, 주어 + would · could · might + 원형**이다. 지금 그렇지 않은 일을 그려 본다.',
    detail:
      '동사가 과거라고 지난 일이 아니다. **시제가 물러선 것 자체가 「사실이 아니다」라는 ' +
      '표시**다.\n\n' +
      'be동사는 주어가 무엇이든 were 를 쓴다. If I were you 가 그 대표다.',
    groups: [
      {
        name: '두 절의 꼴이 짝을 이룬다',
        note: '조건절은 과거, 주절은 「조동사 과거 + 원형」이다. 한쪽만 어긋나면 틀린다.',
        examples: [
          {
            en: 'If you wanted to read the government papers, or letters written by Korean War soldiers, you’d go to an archive.',
            ko: '정부 문서나 한국전쟁 병사들이 쓴 편지를 읽고 싶다면 기록보관소에 갈 것이다.',
          },
          {
            en: 'Similarly, if pain existed but fear did not, a child would burn himself again and again.',
            ko: '마찬가지로 아픔은 있는데 두려움이 없다면, 아이는 거듭거듭 제 몸을 데일 것이다. (실제로는 두려움이 있다)',
          },
        ],
      },
      {
        name: 'be동사는 were 로 통일한다',
        note: '주어가 I 나 he 여도 was 가 아니라 were 다. 사실이 아님을 나타내는 표시다.',
        examples: [
          {
            en: 'B: If I were you, I’d wait until he talks about his troubles.',
            ko: '나라면 그가 자기 고민을 이야기할 때까지 기다리겠어.',
          },
          {
            en: 'Were it not for water, all living creatures on earth would be extinct.',
            ko: '물이 없다면 지구의 모든 생물은 멸종할 것이다. (If it were not for 에서 If 가 지워졌다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**단순 조건문과 가른다.** 있을 법한 일을 말할 때는 시제를 물리지 않는다. ' +
        'If it rains tomorrow, I will stay home 은 가정법이 아니다.',
    },
  },

  {
    level: 'focus',
    unitId: 'sp-if',
    focus: '가정법 과거완료',
    title: '가정법 과거완료 — 지난날 사실이 아니었던 일',
    summary:
      '**If + had p.p., 주어 + would · should + have p.p.** 다. 이미 지나간 일을 뒤집어 말한다.',
    detail:
      '가정법 과거보다 한 걸음 더 물러선 꼴이다. 지금이 아니라 **지난날** 그렇지 않았던 일을 ' +
      '그려 본다.\n\n' +
      '두 절의 꼴이 짝을 이룬다. 조건절이 had p.p. 면 주절은 have p.p. 다. 한쪽만 어긋나면 ' +
      '틀린다.',
    groups: [
      {
        name: '두 절이 짝을 이룬다',
        note: '조건절 had p.p. ↔ 주절 「조동사 과거 + have p.p.」다.',
        examples: [
          {
            en: 'Had I realized what you were intending to do, I would have stopped you.',
            ko: '당신이 무엇을 하려는지 알아차렸더라면 나는 당신을 막았을 것이다. (실제로는 알아차리지 못했다)',
          },
        ],
      },
      {
        name: '혼합 가정법도 있다',
        note: '조건은 지난날, 결과는 지금일 때다. 조건절만 had p.p. 이고 주절은 would + 원형이다.',
        examples: [
          {
            en: 'If I had taken the medicine then, I would be fine now.',
            ko: '그때 약을 먹었더라면 지금은 괜찮을 텐데. (조건은 과거, 결과는 지금)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**뜻의 앞뒤가 맞는지** 본다. 조건이 부정이면 결과도 그에 맞아야 한다. 시험이 부정 하나를 ' +
        '빼 두는 자리다.',
      contrasts: [
        {
          wrong: 'Had I given up the project at that time, I should have achieved such a splendid result.',
          right: 'Had I given up the project at that time, I should not have achieved such a splendid result.',
          why: '그만두었다면 성과가 없었을 것이다. 부정이 빠지면 뜻이 거꾸로 된다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-if',
    focus: 'as if · as though',
    title: 'as if · as though — 「마치 ~인 것처럼」',
    summary:
      '실제와 다른 일을 빗대어 말한다. 뒤에서도 **시제를 한 걸음 물린다.**',
    detail:
      '주절과 **같은 때**의 일이면 과거, 주절보다 **앞선** 일이면 과거완료다. 가정법의 ' +
      '시제 물리기가 그대로 적용된다.\n\n' +
      'be동사는 여기서도 were 를 쓴다. 사실이 아님을 나타내는 표시이기 때문이다.',
    groups: [
      {
        name: '같은 때면 과거',
        note: '「지금 그런 것처럼」이다. 실제로는 그렇지 않다는 뜻이 깔린다.',
        examples: [
          {
            en: 'It was just as if all the stars up in heaven were falling down on her.',
            ko: '그것은 꼭 하늘 위의 모든 별이 그녀 위로 쏟아져 내리는 것 같았다. (별이 실제로 떨어진 것은 아니다)',
          },
        ],
      },
      {
        name: '앞선 일이면 과거완료',
        note: '「이미 그랬던 것처럼」이다. 주절보다 한 걸음 더 물린다.',
        examples: [
          {
            en: 'Two to eight months of not exercising at all will reduce your fitness level to as if you never exercised before.',
            ko: '두 달에서 여덟 달 동안 전혀 운동하지 않으면 체력이 마치 한 번도 운동한 적 없는 수준으로 떨어진다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**사실을 말할 때는 물리지 않는다.** 말하는 이가 실제로 그렇다고 볼 때는 현재시제를 ' +
        '그대로 쓰기도 한다. 뜻으로 갈린다.',
    },
  },

  {
    level: 'focus',
    unitId: 'sp-if',
    focus: 'if 생략 도치',
    title: 'if 생략 도치 — if 를 지우고 뒤집는다',
    summary:
      'if 를 지우고 **(조)동사를 주어 앞으로** 보낸다. Were · Had · Should 로 문장이 열린다.',
    detail:
      '격식 있는 글에서 즐겨 쓴다. 뜻은 if 를 쓴 것과 같다.\n\n' +
      '알아보는 법은 하나다. **Were · Had · Should 로 문장이 시작하는데 의문문이 아니면** ' +
      'if 가 지워진 것이다.',
    groups: [
      {
        name: '세 꼴',
        items: ['Were + 주어 ~ (가정법 과거)', 'Had + 주어 + p.p. (가정법 과거완료)', 'Should + 주어 + 원형 (혹시라도)'],
        note: '지워진 if 를 되살려 읽으면 뜻이 또렷해진다.',
        examples: [
          {
            en: 'Were it not for water, all living creatures on earth would be extinct.',
            ko: '물이 없다면 지구의 모든 생물은 멸종할 것이다. (= If it were not for water)',
          },
          {
            en: 'Had I realized what you were intending to do, I would have stopped you.',
            ko: '당신이 무엇을 하려는지 알아차렸더라면 나는 당신을 막았을 것이다. (= If I had realized)',
          },
        ],
      },
      {
        name: '「~이 없다면」의 굳은 꼴',
        items: ['If it were not for ~', 'Were it not for ~', 'But for ~', 'Without ~'],
        note: '지난날이면 If it had not been for ~ / Had it not been for ~ 가 된다.',
      },
    ],
    pitfall: {
      text:
        '**의문문과 겉꼴이 같다.** 물음표가 없고 뒤에 주절이 이어지면 if 가 지워진 조건절이다.',
    },
  },

  {
    level: 'unit',
    unitId: 'cp-emph',
    title: '강조구문 It is ~ that — 빼도 문장이 남는다',
    summary:
      '강조하고 싶은 말을 It is 와 that 사이에 끼운다. **그 부분을 빼도 문장이 성립한다.**',
    detail:
      '가주어 it 과 꼴이 같아 헷갈린다. 가르는 법은 하나다 — **It is 와 that 을 지우고 ' +
      '나머지를 이어 읽어 본다.** 온전한 문장이 되면 강조구문이다.\n\n' +
      '강조하는 것이 사람이면 that 대신 who, 사물이면 which, 때면 when, 곳이면 where 를 ' +
      '쓸 수도 있다.',
    groups: [
      {
        name: '어느 자리든 끼울 수 있다',
        items: ['주어', '목적어', '부사구'],
        note: '동사만은 이 자리에 끼우지 못한다. 동사를 강조할 때는 do · does · did 를 앞에 둔다.',
        examples: [
          {
            en: 'It was not her refusal but her rudeness that perplexed him.',
            ko: '그를 당황하게 한 것은 그녀의 거절이 아니라 무례함이었다. (주어를 강조 — 빼면 Not her refusal but her rudeness perplexed him)',
          },
        ],
      },
      {
        name: '가주어 it 과 가른다',
        note: 'It is 와 that 을 지웠을 때 문장이 무너지면 가주어다. 강조구문은 멀쩡히 남는다.',
        examples: [
          {
            en: 'It is true that he passed the exam.',
            ko: '그가 시험에 붙은 것은 사실이다. (지우면 true he passed — 무너진다. 가주어다)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '강조하는 말이 사람이면 who, 사물이면 which 를 쓸 수 있다. 그렇다고 **관계대명사가 되는 ' +
        '것은 아니다** — 앞의 It 은 아무것도 가리키지 않는 자리 채움이다.',
    },
  },

  {
    level: 'unit',
    unitId: 'cp-ellipsis',
    title: '생략 — 무엇이 지워졌는지 되살려 읽는다',
    summary:
      '되풀이되는 말은 지운다. 읽을 때 할 일은 **지워진 것을 되살리는 것** 하나다.',
    detail:
      '지우는 자리는 정해져 있다. 앞에서 이미 나온 말이라 되살릴 수 있을 때만 지운다. ' +
      '되살릴 수 없으면 지우지 않는다.\n\n' +
      '가장 잦은 것 둘은 **되풀이되는 동사구**와 **부사절의 주어 + be동사**다.',
    groups: [
      {
        name: '되풀이되는 말을 지운다',
        note: '앞과 같은 부분을 지우고 다른 부분만 남긴다. 남은 조각으로 짝을 알아본다.',
        examples: [
          {
            en: 'For instance, the scales on the sides of the body are tapered ―wide at one end and narrow at the other end.',
            ko: '이를테면 몸 옆면의 비늘은 끝이 가늘어지는데, 한쪽 끝은 넓고 다른 쪽 끝은 좁다. (are 가 지워졌다)',
          },
        ],
      },
      {
        name: '부사절의 주어 + be동사를 지운다',
        note: '주절의 주어와 같을 때만 지운다. 접속사는 남겨 뜻을 또렷이 한다.',
        examples: [
          {
            en: 'Citizens will be able to recycle the same materials across the state whether at home, work or school.',
            ko: '주민은 집에서든 직장에서든 학교에서든 주 전역에서 같은 물질을 재활용할 수 있게 된다. (they are 가 지워졌다)',
          },
        ],
      },
      {
        name: '대동사로 받는다',
        items: ['do · does · did', 'so', 'not'],
        note: '앞의 동사구 전체를 한 낱말로 받는다. 되풀이를 피하는 장치다.',
        examples: [
          {
            en: 'Those who specialize in philosophy of social science may consider or analyze examples from anthropological research, but do this mostly to illustrate conceptual points.',
            ko: '사회과학 철학을 전공하는 사람들은 인류학 연구의 사례를 살피거나 분석하기도 하지만, 대개 개념적 논점을 보이려고 그렇게 한다. (do this 가 앞의 동사구를 받는다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '지워진 자리를 못 보면 병치와 수일치를 놓친다. **접속사가 보이면 그 앞뒤에서 같은 꼴을 ' +
        '찾고, 없으면 지워졌다고 본다.**',
    },
  },

  {
    level: 'focus',
    unitId: 'cp-parallel',
    focus: 'and · or 로 묶인 병치',
    title: 'and · or 로 묶인 병치 — 꼴을 맞춘다',
    summary: 'and 나 or 로 이으면 양쪽이 **같은 꼴**이어야 한다. 동사는 동사끼리, to부정사는 to부정사끼리다.',
    detail:
      '시험은 두 가지를 묻는다. 하나는 **꼴이 맞는가**, 다른 하나는 **무엇과 무엇이 짝인가**다.\n\n' +
      '짝을 찾는 법은 하나뿐이다. and 를 보면 그 앞에서 같은 꼴을 찾는다. 바로 앞이 아니라 ' +
      '한참 앞일 때가 많다.',
    groups: [
      {
        name: '꼴을 맞춘다',
        note: '한쪽만 -ing 나 to부정사로 바뀌면 틀린다. 시험이 가장 즐겨 쓰는 자리다.',
        contrasts: [
          {
            wrong: 'It involves creating work and being a reaction to food insecurity.',
            right: 'It involves creating work and is a reaction to food insecurity.',
            why: 'is 의 짝은 바로 앞의 creating 이 아니라 involves 다. creating 에 끌려 being 으로 쓰면 주어 없는 조각이 된다.',
          },
          {
            wrong: 'They can turn up or flattening to adjust to the flow of water.',
            right: 'They can turn up or flatten to adjust to the flow of water.',
            why: 'can 이 둘 모두에 걸린다. 뒤쪽도 원형이라야 한다.',
          },
        ],
      },
      {
        name: '앞에 한 번 적은 말이 뒤에도 걸린다',
        note: '조동사 · to · help 는 앞에만 적고 뒤에서는 지운다. 지워졌다고 없는 것이 아니다.',
        examples: [
          {
            en: 'They can turn up or flatten to adjust to the flow of water around the shark.',
            ko: '그것들은 상어 둘레의 물 흐름에 맞추려고 세워지거나 납작해질 수 있다. (can 이 flatten 에도 걸린다)',
          },
          {
            en: 'A reporter would learn in the morning and teach at night.',
            ko: '기자는 아침에 배워 밤에 가르친다. (would 가 teach 에도 걸린다)',
          },
        ],
      },
      {
        name: '짝이 멀리 떨어져 있다',
        note: '사이에 긴 목적어가 끼면 짝이 안 보인다. 그러면 and 바로 앞의 명사에 끌려 동사를 복수로 쓰기 쉽다.',
        contrasts: [
          {
            wrong: 'It offers everything from school lessons to exam prep for aspiring engineers and have training for job-seekers.',
            right: 'It offers everything from school lessons to exam prep for aspiring engineers and has training for job-seekers.',
            why: 'has 의 짝은 바로 앞의 engineers 가 아니라 맨 앞의 offers 다. 주어는 It 하나다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'and 로 이은 절의 주어가 서로 다르면 뒤 절의 주어를 **반드시 적는다.** 주어가 같을 때만 지운다.',
      examples: [
        {
          en: 'But they will be based on regional and ethical trading practices and will differ from the bulk of commodity trade.',
          ko: '그러나 그것들은 지역에 맞고 윤리적인 거래 관행에 바탕을 둘 것이며, 대부분의 상품 거래와는 다를 것이다. (주어가 같아 they 를 지웠다)',
        },
        {
          en: 'Some native tribes enslaved members of other tribes, and slavery was also an institution in many African nations.',
          ko: '몇몇 원주민 부족이 다른 부족 사람들을 노예로 삼았고, 노예제는 많은 아프리카 나라에서 하나의 제도이기도 했다. (주어가 달라 slavery 를 적었다)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sk-agree',
    focus: 'the number of / a number of',
    title: 'the number of / a number of — 관사 하나로 갈린다',
    summary:
      '**the number of 는 「~의 수」라 단수**, **a number of 는 「많은 ~」이라 복수**다.',
    detail:
      'the 가 붙으면 「수」 자체가 주어다. 수는 하나이므로 단수로 받는다.\n\n' +
      'a 가 붙으면 뜻이 「많은」으로 바뀌어 뒤의 명사를 꾸미는 말이 된다. 그러면 주어는 뒤의 ' +
      '복수명사라 복수로 받는다.',
    groups: [
      {
        name: 'the number of — 단수',
        note: '「~의 수」다. of 뒤의 명사가 복수여도 동사는 단수다.',
        examples: [
          {
            en: 'We are glad that the number of applicants is increasing.',
            ko: '지원자 수가 늘고 있어 기쁘다. (is)',
          },
          {
            en: 'The number of car accidents is on the rise.',
            ko: '자동차 사고 수가 늘고 있다. (is)',
          },
        ],
      },
      {
        name: 'a number of — 복수',
        note: '「많은 ~」이다. 사이에 형용사가 끼어도 마찬가지다.',
        examples: [
          {
            en: 'A growing number of students have skipped school to stay online, shockingly self-destructive behavior in this intensely competitive society.',
            ko: '점점 더 많은 학생이 온라인에 머무르려고 학교를 빠졌는데, 이 치열한 경쟁 사회에서 충격적일 만큼 자기 파괴적인 행동이다. (have)',
          },
          {
            en: 'Schools that grant free tuition to all students are rare, but a greater number of institutions provide scholarships to enrollees with high grades.',
            ko: '모든 학생에게 등록금을 면제하는 학교는 드물지만, 더 많은 기관이 성적이 좋은 등록생에게 장학금을 준다. (provide)',
          },
        ],
      },
      {
        name: '조동사면 수가 드러나지 않는다',
        note: '그래도 단수 · 복수 취급은 그대로다. 뜻을 새겨 둔다.',
        examples: [
          {
            en: 'With no fishing pressure on a fish population, the number of fish will reach a predictable level of abundance and stay there.',
            ko: '어류 개체군에 어획 압력이 없으면, 물고기의 수는 예측할 수 있는 풍부함의 수준에 이르러 거기 머무를 것이다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '가르는 것은 **관사 하나**다. of 뒤의 명사에 이끌리지 않는다. the 면 단수, a 면 복수다.',
      contrasts: [
        {
          wrong: 'The number of applicants are increasing.',
          right: 'The number of applicants is increasing.',
          why: '주어의 핵은 number 다. applicants 는 of 뒤에 있어 수를 정하지 못한다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sk-agree',
    focus: '병치 주어는 복수',
    title: '병치 주어 — and 로 묶였다고 늘 복수는 아니다',
    summary:
      '**둘이 별개면 복수**, **한 덩이로 보면 단수**다. 앞에 붙은 관사가 그 표시다.',
    detail:
      '앞에 the 나 소유격이 **각각** 붙어 있으면 별개라는 표시라 복수로 받는다.\n\n' +
      '반대로 **the 가 하나만** 붙어 있으면 둘을 한 덩이로 본다는 표시다. 그때는 단수로 받는다.',
    groups: [
      {
        name: '관사가 각각이면 복수',
        note: '둘을 따로 세는 것이다.',
        examples: [
          {
            en: 'The net result in the long run is substantially the same to each person, but through this system the principles of kinship obligation and the morality of sharing food have been emphasized.',
            ko: '길게 보아 결과는 사람마다 사실상 같지만, 이 체계를 통해 친족의 의무라는 원칙과 음식을 나누는 도덕이 힘주어 다져져 왔다. (the 가 각각 — have)',
          },
          {
            en: 'The Myers and Briggs personality system and the Enneagram of Personality are two leading personality typing systems that are used around the world.',
            ko: '마이어스-브릭스 성격 체계와 에니어그램은 세계에서 쓰이는 앞서가는 두 성격 유형 체계다. (are)',
          },
        ],
      },
      {
        name: '관사가 하나면 단수',
        note: '둘을 떼어 놓을 수 없는 한 덩이로 본다는 표시다.',
        examples: [
          {
            en: 'Because the planning and construction of future hydropower schemes is not a short-term process, it is not a popular investment, in spite of low electricity generation costs.',
            ko: '앞으로의 수력발전 계획을 세우고 짓는 일은 단기간의 과정이 아니므로, 낮은 발전 비용에도 불구하고 인기 있는 투자가 아니다. (the 하나 — is)',
          },
          {
            en: 'The incessant public curiosity and consumer demand due to the health benefits with lesser cost has increased the interest in functional foods.',
            ko: '더 적은 비용으로 얻는 건강상 이로움 때문에 끊이지 않는 대중의 호기심과 소비자 수요가 기능성 식품에 대한 관심을 높여 왔다. (The 하나 — has)',
          },
        ],
      },
      {
        name: '항목이 셋 넘으면 대개 복수',
        note: '서로 다른 것들을 나열한 것이므로 한 덩이로 보기 어렵다.',
        examples: [
          {
            en: 'Newspaper columns, specialized magazines, television programs, and Web sites record the personal lives of celebrated Hollywood actors, sometimes accurately.',
            ko: '신문 칼럼과 전문 잡지, 텔레비전 프로그램, 웹사이트가 이름난 할리우드 배우들의 사생활을 때로는 정확하게 기록한다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**or 는 and 와 다르다.** 둘을 더하지 않고 뒤쪽 항목의 수를 따른다.',
      examples: [
        {
          en: 'Their structure, the relationships of their parts, or the essential purposes they serve are similar.',
          ko: '그것들의 구조나 부분들의 관계, 또는 그것들이 하는 본질적인 쓰임은 비슷하다. (마지막 purposes 가 복수라 are)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-what',
    focus: 'what 절이 주어 — 단수 취급',
    title: 'what 절이 주어 — 아무리 길어도 단수',
    summary:
      'what 절이 주어면 통째로 **하나의 덩이**다. 동사는 단수로 받는다.',
    detail:
      '「~인 것」이라는 하나를 가리키므로 단수다. 절 안에 복수 명사가 몇 개 들어 있어도 ' +
      '상관없다.\n\n' +
      '보어가 복수여도 마찬가지다. 동사는 주어를 보지 보어를 보지 않는다.',
    groups: [
      {
        name: '절 안의 복수에 끌리지 않는다',
        note: 'what 절이 어디서 끝나는지 그어 보면 뼈대가 드러난다.',
        examples: [
          {
            en: 'What children in remote parts of India lack is access to good teachers and exposure to good-quality content.',
            ko: '인도 외딴 지역의 아이들에게 없는 것은 좋은 선생님과 좋은 내용을 접할 기회다. (children · parts 가 복수여도 is)',
          },
          {
            en: 'What appeared to be a shark was lurking behind the coral reef.',
            ko: '상어로 보이던 것이 산호초 뒤에 숨어 있었다.',
          },
        ],
      },
      {
        name: '보어가 무엇이든 동사는 단수',
        note: '보어가 that 절이든 동명사든 주어의 수만 본다.',
        examples: [
          {
            en: 'What matters to the gazelle is being faster than other gazelles, not being faster than cheetahs.',
            ko: '가젤에게 중요한 것은 다른 가젤들보다 빠른 것이지 치타보다 빠른 것이 아니다.',
          },
          {
            en: 'What happened to my lovely grandson last summer was amazing.',
            ko: '지난여름 나의 사랑스러운 손자에게 일어난 일은 놀라웠다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'what 절 **안쪽의 수일치**는 따로 본다. there 구문이 들어가면 진짜 주어는 there 뒤의 ' +
        '명사다. 시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'What we forget is that there were an established process behind the creation of outlaws.',
          right: 'What we forget is that there was an established process behind the creation of outlaws.',
          why: 'there 뒤의 진짜 주어가 단수 an established process 다. 겉의 What 절과는 다른 층이다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-what',
    focus: 'what 절이 목적어·보어',
    title: 'what 절이 목적어 · 보어 — 뒤 절에 빈자리가 있다',
    summary:
      'what 절은 **명사 자리 어디에나** 들어간다. 어느 자리든 뒤 절에 빠진 자리가 있다.',
    detail:
      'what 은 선행사를 제 안에 품으면서 뒤 절의 한 자리도 메운다. 그래서 그 자리가 비어 ' +
      '있다.\n\n' +
      '주어 자리를 메우기도 하고 목적어 자리를 메우기도 한다. **어느 자리가 비었는지** 짚으면 ' +
      '해석이 흔들리지 않는다.',
    groups: [
      {
        name: '목적어 자리',
        note: 'what 이 뒤 절의 목적어 자리를 메운다. 그래서 그 동사 뒤가 비어 있다.',
        examples: [
          {
            en: 'She easily believes what others say.',
            ko: '그녀는 남들이 하는 말을 쉽게 믿는다. (say 뒤가 비었다)',
          },
        ],
      },
      {
        name: '보어 자리',
        note: 'be동사 뒤에 온다. 「~하는 것이다」로 옮긴다.',
        examples: [
          {
            en: "That's what piques the curiosity of advisers and sponsors.",
            ko: '그것이 자문가와 후원자의 호기심을 자극하는 것이다. (what 이 piques 의 주어 자리를 메운다)',
          },
          {
            en: 'Women are experts at gossiping, and they always talk about trivial things, or at least that’s what men have always thought.',
            ko: '여자들은 남 이야기에 능하고 늘 사소한 것만 이야기한다 — 적어도 남자들은 늘 그렇게 생각해 왔다.',
          },
        ],
      },
      {
        name: '강조하려고 앞으로 빼기도 한다',
        note: '본디 목적어인 what 절을 문장 앞으로 옮기고 콤마로 끊는다.',
        examples: [
          {
            en: 'That’s because what old folk consume materially, they give back behaviorally―providing a leveling, reasoning center to the tumult that often swirls around them.',
            ko: '그것은 노인들이 물질로 쓰는 것을 행동으로 되돌려주기 때문이다 — 그들 둘레에서 자주 소용돌이치는 소란에 고르게 하고 사리를 따지는 중심을 대어 주면서.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '앞에 **선행사가 있으면 what 을 쓰지 못한다.** 그때는 which · that 이다. 전치사 뒤라도 ' +
        '마찬가지다.',
      contrasts: [
        {
          wrong: 'Contrary to which many believe, UA is found in every city.',
          right: 'Contrary to what many believe, UA is found in every city.',
          why: '앞에 받을 명사가 없다. believe 의 목적어 자리도 비어 있으니 what 이다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-relwhere',
    focus: '전치사 + 관계대명사',
    title: '전치사 + 관계대명사 — 뒤가 완전하다',
    summary:
      '전치사가 관계사 앞으로 올라온 꼴이다. 전치사가 이미 자리를 메워 **뒤 절이 완전하다.**',
    detail:
      '되돌려 보면 알기 쉽다. in which many students have pursued ~ 는 many students have ' +
      'pursued ~ **in the university** 다.\n\n' +
      '어느 전치사를 쓸지는 **원래 문장이 정한다.** suffer from 이면 from which, ' +
      'be required for 면 for which 다.',
    groups: [
      {
        name: '되돌려 읽으면 원래 문장이 나온다',
        note: '관계사를 선행사로 바꾸고 전치사를 제자리에 되돌린다.',
        examples: [
          {
            en: 'An analogy is a figure of speech in which two things are asserted to be alike in many respects that are quite fundamental.',
            ko: '유추란 두 가지가 꽤 근본적인 여러 면에서 닮았다고 주장되는 수사법이다. (= in the figure of speech)',
          },
          {
            en: 'To find a good starting point, one must return to the year 1800 during which the first modern electric battery was developed.',
            ko: '좋은 출발점을 찾으려면 최초의 현대식 전지가 만들어진 1800년으로 돌아가야 한다. (= during the year)',
          },
        ],
      },
      {
        name: '전치사는 원래 문장이 정한다',
        note: '동사와 짝을 이루던 전치사가 그대로 앞으로 올라온다.',
        examples: [
          {
            en: 'He died at his Milanese home of pancreatic cancer, from which he had been suffering for two years, on the night of February 19, 2016.',
            ko: '그는 두 해 동안 앓아 온 췌장암으로 2016년 2월 19일 밤 밀라노 자택에서 숨졌다. (suffer from 의 from)',
          },
          {
            en: 'Schooling is compulsory for all children in the United States, but the age range for which school attendance is required varies from state to state.',
            ko: '미국에서 학교 교육은 모든 아이에게 의무이지만, 학교 출석이 요구되는 연령 범위는 주마다 다르다. (be required for 의 for)',
          },
        ],
      },
      {
        name: '한 문장에 둘이 오기도 한다',
        note: '저마다 다른 선행사를 받는다. 무엇을 받는지 따로따로 짚는다.',
        examples: [
          {
            en: 'It has been suggested that Stone Age cave dwellers may have treated behavior disorders with a surgical method called trephining, in which part of the skull was chipped away to provide an opening through which the evil spirit could escape.',
            ko: '석기 시대 동굴 거주자들이 천두술이라는 외과적 방법으로 행동 장애를 다루었을 수 있다는 견해가 있다. 그 방법에서는 악령이 빠져나갈 구멍을 내려고 두개골 일부를 깎아 냈다. (in which 는 method, through which 는 opening)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**that 은 전치사 뒤에 오지 못한다.** which 로 바꾸거나 전치사를 절 끝으로 보낸다. ' +
        '시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'The sport in that I am most interested is soccer.',
          right: 'The sport in which I am most interested is soccer.',
          why: '전치사 뒤에는 that 을 두지 못한다. which 로 바꾸거나 in 을 절 끝으로 보낸다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-relwhere',
    focus: '관계대명사 뒤는 불완전 · 관계부사 뒤는 완전',
    title: '뒤가 완전한가 불완전한가 — 이 하나로 갈린다',
    summary:
      '**빠진 자리가 있으면 관계대명사**, **없으면 관계부사나 「전치사 + 관계대명사」**다.',
    detail:
      '선행사가 무엇인지는 그다음 문제다. 먼저 뒤 절을 보고 **주어 · 목적어가 다 있는지** ' +
      '센다.\n\n' +
      '전치사가 관계사 앞에 붙어 있으면 그 전치사가 이미 자리를 메운 것이라, 뒤 절은 완전하다. ' +
      '관계부사도 마찬가지다.',
    groups: [
      {
        name: '뒤가 완전하면 관계부사 · 전치사 + 관계대명사',
        note: '주어도 목적어도 다 있다. where = in which 로 바꿔 쓸 수 있다.',
        examples: [
          {
            en: 'Langston Hughes was born in Joplin, Missouri, and graduated from Lincoln University, in which many African-American students have pursued their academic disciplines.',
            ko: '랭스턴 휴스는 미주리주 조플린에서 태어나 링컨 대학교를 졸업했는데, 그곳에서 많은 아프리카계 미국인 학생이 학문을 이어 왔다. (뒤 절이 완전 — where 와 같다)',
          },
          {
            en: 'The National Health Center Foundation (NHC Foundation) is here to support the National Health Center (NHC) to achieve its vision of a nation in which all people attain the highest level of health.',
            ko: '국립보건센터재단은 모든 사람이 가장 높은 수준의 건강에 이르는 나라라는 뜻을 국립보건센터가 이루도록 돕고자 있다.',
          },
        ],
      },
      {
        name: '뒤가 불완전하면 관계대명사',
        note: '주어나 목적어 자리가 비어 있다. 그 자리를 선행사가 메운다.',
        examples: [
          {
            en: 'The new teacher I told you about is originally from Peru.',
            ko: '제가 말씀드렸던 새 선생님은 원래 페루 출신입니다. (about 뒤가 비었다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '선행사가 장소라고 무조건 where 가 아니다. **뒤 동사가 목적어를 받는 동사인지**부터 본다.',
      contrasts: [
        {
          wrong: 'This is the village where I visited last summer.',
          right: 'This is the village which I visited last summer.',
          why: 'visit 는 목적어를 바로 받는다. visited 뒤가 비었으니 관계대명사다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-appos',
    focus: '동격의 that',
    title: '동격의 that — 추상명사의 내용을 밝힌다',
    summary:
      '앞의 **추상명사가 어떤 내용인지**를 that 절이 통째로 풀어 준다. 뒤 절은 완전하다.',
    detail:
      '관계대명사 that 과 꼴이 같아 헷갈린다. 가르는 잣대는 하나다 — **뒤 절이 완전하면 ' +
      '동격**, 빠진 자리가 있으면 관계대명사다.\n\n' +
      '앞에 오는 명사도 정해져 있다시피 하다. fact · idea · news · belief · sense · assumption 처럼 ' +
      '「내용」을 담을 수 있는 말이다.',
    groups: [
      {
        name: '이런 명사 뒤에 온다',
        items: ['fact', 'idea', 'news', 'belief', 'sense', 'assumption', 'report', 'phrase', 'possibility'],
        note: '「~라는 …」으로 옮긴다. 그 명사의 내용을 that 절이 채운다.',
        examples: [
          {
            en: 'The idea that society should allocate economic rewards and positions of responsibility according to merit is appealing for several reasons.',
            ko: '사회가 공로에 따라 경제적 보상과 책임 있는 자리를 나눠야 한다는 생각은 여러 까닭으로 마음을 끈다.',
          },
          {
            en: 'To make matters worse, there is a report that another typhoon will arrive soon.',
            ko: '설상가상으로, 또 다른 태풍이 곧 올 것이라는 보도가 있다.',
          },
        ],
      },
      {
        name: '주어와 동사를 멀리 떼어 놓는다',
        note: '동격절이 통째로 끼어들어 주어의 핵과 동사가 아주 멀어진다.',
        examples: [
          {
            en: 'If the linguistic turn is defined by the epistemological assumption that reality is constructed through language, the digital turn is based on the assumption that social reality is increasingly defined by digitalization.',
            ko: '언어적 전환이 실재는 언어를 통해 구성된다는 인식론적 전제로 규정된다면, 디지털 전환은 사회적 실재가 점점 더 디지털화로 규정된다는 전제에 바탕을 둔다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '한 문장에 that 이 둘이면 **하나는 관계대명사, 하나는 동격**일 수 있다. 뒤 절이 완전한지 ' +
        '따로따로 본다.',
      examples: [
        {
          en: 'Psychodrama as a form of group therapy started with premises that were quite alien to the Freudian worldview that mental illness essentially occurs within the psyche or mind.',
          ko: '집단 치료의 한 형태인 심리극은, 정신 질환이 본질적으로 마음 안에서 일어난다는 프로이트식 세계관과는 꽤 낯선 전제에서 출발했다. (앞 that 은 관계대명사, 뒤 that 은 동격)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-appos',
    focus: '콤마 동격',
    title: '콤마 동격 — 걷어 내도 문장이 남는다',
    summary:
      '콤마로 끼워 넣어 앞의 말을 **다른 이름으로 되풀어** 준다. 둘은 같은 것을 가리킨다.',
    detail:
      '걷어 내도 문장이 성립한다. 그것이 동격이라는 표시이자, 삽입과 같은 성질이다.\n\n' +
      '콤마 대신 **줄표**를 쓰기도 한다. 줄표는 더 세게 끊어 넣는다.',
    groups: [
      {
        name: '콤마로 끼워 넣는다',
        note: '앞말과 뒷말이 같은 것을 가리킨다. 걷어 내도 문장이 온전하다.',
        examples: [
          {
            en: 'A resident, John Smith, of 123 Elm Street, has reported problems with the road conditions on Elm Street.',
            ko: '엘름가 123번지의 주민 존 스미스가 엘름가의 도로 상태 문제를 알려 왔다. (주민 = 존 스미스)',
          },
          {
            en: 'At the top, as we have seen, was the scalco, or steward, who was in charge of not only the kitchen, but also the dining room.',
            ko: '우리가 보았듯 맨 위에는 스칼코, 곧 집사가 있었고, 그는 주방뿐 아니라 식당도 맡고 있었다. (or 가 「곧」이라는 바꿔 말하기)',
          },
        ],
      },
      {
        name: '줄표로 더 세게 끊는다',
        note: '여럿을 통째로 되받을 때 즐겨 쓴다.',
        examples: [
          {
            en: 'How on earth will it help the poor if governments try to strangle globalization by stemming the flow of trade, information, and capital ― the three components of the global economy?',
            ko: '세계 경제의 세 요소인 무역·정보·자본의 흐름을 막아 세계화를 옥죄려 든다면, 그것이 대체 어떻게 가난한 이를 돕겠는가?',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**계속적 용법의 관계절과 겉꼴이 닮았다.** 콤마 뒤에 명사구만 오면 동격, 주어나 동사가 ' +
        '따라오면 관계절이다.',
    },
  },

  {
    level: 'focus',
    unitId: 'v-subjunctive',
    focus: 'that절에 should 생략',
    title: 'that절에 should 생략 — 원형만 남는다',
    summary:
      'should 를 지우고 **동사원형만** 남긴다. 그래서 수일치도 시제 일치도 하지 않는다.',
    detail:
      '겉으로는 문법이 어긋나 보인다. 주어가 she 인데 buys 가 아니라 buy 이고, 주절이 과거인데 ' +
      '딸린 절은 현재형처럼 보인다.\n\n' +
      '그것이 should 가 지워진 자리라는 표시다. 되살려 넣어 읽으면 어긋남이 사라진다.',
    groups: [
      {
        name: '수일치를 하지 않는다',
        note: '주어가 3인칭 단수여도 -s 를 붙이지 않는다.',
        examples: [
          {
            en: 'The broker recommended that she buy the stocks immediately.',
            ko: '중개인은 그녀가 즉시 그 주식을 사라고 권했다. (she 인데 buys 가 아니다)',
          },
          {
            en: 'The committee commanded that construction of the building cease.',
            ko: '위원회는 그 건물의 공사를 중단하라고 명령했다. (단수 construction 인데 ceases 가 아니다)',
          },
        ],
      },
      {
        name: '시제 일치도 하지 않는다',
        note: '주절이 과거여도 원형 그대로다. 수동이면 be p.p. 다.',
        examples: [
          {
            en: 'The minister insisted that a bridge be constructed over the river to solve the traffic problem.',
            ko: '장관은 교통 문제를 풀려면 강 위에 다리를 놓아야 한다고 주장했다. (be constructed)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '같은 동사라도 **사실을 말할 때는 원형을 쓰지 않는다.** insist 가 「우기다」, suggest 가 ' +
        '「시사하다」로 쓰이면 시제를 그대로 맞춘다.',
      examples: [
        {
          en: 'He insisted that he was innocent.',
          ko: '그는 자기가 결백하다고 우겼다. (사실 주장 — 시제 그대로)',
          source: 'written',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-thethe',
    focus: 'the 비교급, the 비교급',
    title: 'the 비교급, the 비교급 — 「~할수록 더 …하다」',
    summary:
      '두 절 **모두** the + 비교급으로 시작한다. 앞이 조건, 뒤가 결과다.',
    detail:
      '꼴이 통째로 굳어 있다. 「The + 비교급 + 주어 + 동사, the + 비교급 + 주어 + 동사」다.\n\n' +
      '비교급이 문장 맨 앞으로 끌려 나오므로 원래 자리는 비어 보인다. 되돌려 읽으면 뼈대가 ' +
      '드러난다.',
    groups: [
      {
        name: '두 절 모두 the + 비교급',
        note: '뒤 절에 the 를 빠뜨리면 틀린다.',
        examples: [
          {
            en: 'The present is all we have, and the more we are surrounded by it, the more we are aware of our own presence and participation.',
            ko: '현재가 우리가 가진 전부이며, 현재에 둘러싸일수록 우리는 우리 자신의 있음과 참여를 더 잘 알아차린다.',
          },
        ],
      },
      {
        name: '되풀이되는 말을 지우기도 한다',
        note: '주어와 be동사가 뻔하면 지운다. The sooner, the better. 처럼 짧게 굳은 것도 있다.',
        examples: [
          {
            en: 'The sooner, the better.',
            ko: '빠를수록 좋다. (the sooner it is, the better it is 에서 줄었다)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text: '이 짜임에는 **최상급이 오지 못한다.** the 가 붙어 있어 최상급으로 착각하기 쉽다.',
      contrasts: [
        {
          wrong: 'The more they attempted to explain their mistakes, the worst their story sounded.',
          right: 'The more they attempted to explain their mistakes, the worse their story sounded.',
          why: '「the 비교급, the 비교급」이라 worse 다. worst 는 최상급이라 이 자리에 못 온다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-neg',
    focus: 'cannot ~ too — 아무리 ~해도 지나치지 않다',
    title: 'cannot ~ too — 부정어가 있는데 강한 긍정',
    summary:
      '「아무리 ~해도 지나치지 않다」다. **부정어가 있는데 뜻은 강한 긍정**이다.',
    detail:
      '낱말을 하나씩 옮기면 「너무 ~할 수 없다」가 되어 뜻이 거꾸로 된다. 꼴 전체를 통째로 ' +
      '눈에 익혀 두어야 한다.\n\n' +
      'too 자리에 over- 가 붙은 동사가 오기도 한다. cannot overemphasize 도 같은 뜻이다.',
    groups: [
      {
        name: '통째로 하나의 뜻',
        items: ['cannot ~ too', 'cannot be too 형용사', 'cannot overemphasize', 'It is impossible to ~ too much'],
        note: '「아무리 ~해도 지나치지 않다」, 곧 「많이 ~할수록 좋다」다.',
        examples: [
          {
            en: 'Children cannot be too careful when crossing the street.',
            ko: '아이들은 길을 건널 때 아무리 조심해도 지나치지 않다.',
          },
        ],
      },
      {
        name: '비슷한 무리',
        items: ['never ~ too', 'It is never too late to ~'],
        note: 'never 를 써도 뜻이 같다. 「늦은 때란 없다」로 옮긴다.',
      },
    ],
    pitfall: {
      text:
        '**뜻을 거꾸로 새기지 않도록** 조심한다. cannot be too careful 은 「조심할 수 없다」가 ' +
        '아니라 「조심할수록 좋다」다.',
    },
  },

  {
    level: 'focus',
    unitId: 'cp-emph',
    focus: 'It is ~ that 강조구문',
    title: 'It is ~ that 강조구문 — 빼도 문장이 남는다',
    summary:
      '강조할 말을 It is 와 that 사이에 끼운다. **그 부분을 빼도 문장이 성립한다.**',
    detail:
      '가주어 it 과 겉꼴이 같다. 가르는 법은 하나다 — **It is 와 that 을 지우고 나머지를 이어 ' +
      '읽어 본다.** 온전한 문장이 되면 강조구문이다.\n\n' +
      '강조하는 것이 사람이면 that 대신 who, 사물이면 which, 때면 when, 곳이면 where 를 ' +
      '쓸 수도 있다.',
    groups: [
      {
        name: '주어 · 목적어 · 부사구를 끼운다',
        note: '동사만은 이 자리에 못 온다. 동사를 강조할 때는 do · does · did 를 앞에 둔다.',
        examples: [
          {
            en: 'It was not her refusal but her rudeness that perplexed him.',
            ko: '그를 당황하게 한 것은 그녀의 거절이 아니라 무례함이었다. (빼면 Not her refusal but her rudeness perplexed him)',
          },
        ],
      },
      {
        name: '가주어 it 과 가른다',
        note: 'It is 와 that 을 지웠을 때 문장이 무너지면 가주어다.',
        examples: [
          {
            en: 'It is true that he passed the exam.',
            ko: '그가 시험에 붙은 것은 사실이다. (지우면 true he passed — 무너진다. 가주어다)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '강조하는 말이 사람이면 who 를 쓸 수 있지만, **관계대명사가 되는 것은 아니다.** 앞의 ' +
        'It 은 아무것도 가리키지 않는 자리 채움이다.',
    },
  },

  {
    level: 'focus',
    unitId: 'sk-agree',
    focus: '주어의 핵 찾기',
    title: '주어의 핵 찾기 — 수식어를 걷어 낸다',
    summary:
      '주어가 길면 **명사 하나**가 핵이다. 뒤에 붙은 of · with · in 구와 관계절은 모두 수식어다.',
    detail:
      '동사의 수는 핵 하나만 본다. 핵 뒤에 명사가 몇 개 붙든 상관없다.\n\n' +
      '읽는 법은 하나뿐이다. 동사를 찾고, 그 앞을 거슬러 올라가며 of · with · in · that 이 ' +
      '이끄는 덩이를 지운다. 마지막에 남는 명사가 핵이다.',
    groups: [
      {
        name: 'of 가 이끄는 덩이는 수식어다',
        note: 'of 뒤가 복수여도 동사는 그 앞의 핵을 따른다. of 가 두 번 이어지면 주어가 열 낱말을 넘기도 한다.',
        contrasts: [
          {
            wrong: 'The increased popularity of online marketing and social media sharing have boosted the need for standardization.',
            right: 'The increased popularity of online marketing and social media sharing has boosted the need for standardization.',
            why: 'of 뒤가 and 로 묶여 복수처럼 보이지만 핵은 단수 popularity 다.',
          },
        ],
        examples: [
          {
            en: "The price tag of the quarter-pound bags of cultivated meat at Huber's is a testament to how incredibly expensive it is to produce it.",
            ko: '후버스에서 파는 배양육 봉지의 가격표는 그것을 만드는 일이 얼마나 비싼지를 보여 주는 증거다. (of 가 두 번 — 핵은 The price tag)',
          },
        ],
      },
      {
        name: 'with · along with · in 도 수식어다',
        note: '주어에 무엇을 덧붙여 말할 뿐, 문법상 주어를 늘리지는 않는다.',
        examples: [
          {
            en: 'The country with the most computers per person changes from time to time.',
            ko: '1인당 컴퓨터를 가장 많이 가진 나라는 이따금 바뀐다. (핵은 The country)',
          },
          {
            en: 'Extensive lists of microwave oven models and styles along with candid customer reviews and price ranges are available at appliance comparison websites.',
            ko: '전자레인지 모델과 종류의 방대한 목록을 솔직한 고객 후기와 가격대와 더불어 가전 비교 사이트에서 볼 수 있다. (핵은 lists — 복수라 are)',
          },
        ],
      },
      {
        name: '관계절도 걷어 낸다',
        note: '핵과 동사 사이에 관계절이 끼면 둘 사이가 아주 멀어진다.',
        examples: [
          {
            en: 'About the only aspect of immigration policy that commands broad political support is the resolve to secure the U.S. border.',
            ko: '이민 정책에서 폭넓은 정치적 지지를 받는 거의 유일한 측면은 미국 국경을 지키겠다는 결의다. (of 구와 that 절을 걷어 내면 핵은 aspect)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'a combination of A, B, and C 는 **조합 하나**라 단수다. of 뒤에 셋이 나열돼 있어도 ' +
        '마찬가지다. 2022년 국가직 8번이 흠으로 고른 자리가 바로 이것이다.',
      contrasts: [
        {
          wrong: 'A combination of silver, copper, and zinc were ideal for producing an electrical current.',
          right: 'A combination of silver, copper, and zinc was ideal for producing an electrical current.',
          why: '핵은 a combination 하나다. 은·구리·아연은 of 뒤에 있어 수를 정하지 못한다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-relwhere',
    focus: '관계부사',
    title: '관계부사 — 뒤 문장이 완전하면 관계부사',
    summary:
      '뒤 절에 **빠진 자리가 없으면** 관계부사, 빠진 자리가 있으면 관계대명사다. 이 하나로 갈린다.',
    detail:
      '선행사가 장소라고 해서 무조건 where 인 것이 아니다. 뒤 절을 보고 정한다. 주어나 ' +
      '목적어가 비어 있으면 관계대명사를 써야 한다.\n\n' +
      '관계부사는 **「전치사 + 관계대명사」로 바꿔 쓸 수 있다.** where 는 in which 나 at which 다. ' +
      '바꿔 보면 그 자리가 부사 자리였음이 드러난다.',
    groups: [
      {
        name: '선행사에 따라 넷',
        items: ['where — 장소', 'when — 시간', 'why — 까닭', 'how — 방법'],
        note: '선행사가 무엇이냐에 따라 고른다. 아래는 선행사가 대공황이라는 시기라 when 이다.',
        examples: [
          {
            en: 'Programs in the United States date from the Great Depression, when the need to use surplus agricultural commodities was joined to concern for feeding the children of poor families.',
            ko: '미국의 프로그램은 대공황까지 거슬러 올라가는데, 그때 남아도는 농산물을 쓸 필요가 가난한 집 아이들을 먹이려는 관심과 맞물렸다.',
          },
        ],
      },
      {
        name: 'where 는 장소만 받지 않는다',
        note: 'point · case · situation 처럼 눈에 안 보이는 자리도 받는다. 「그 안에서」로 옮겨지면 where 다.',
        examples: [
          {
            en: "These animals eventually will reach a point where they can't get enough oxygen to sustain normal growth.",
            ko: '이 동물들은 결국 정상적인 성장을 이어 갈 만큼 산소를 얻지 못하는 지점에 이르게 된다. (선행사는 a point)',
          },
          {
            en: 'An unusually rainy period can produce “super blooms,” where even the Atacama becomes blanketed in wildflowers.',
            ko: '유난히 비가 많은 시기가 「슈퍼 블룸」을 만들어 낼 수 있는데, 그때는 아타카마마저 들꽃으로 뒤덮인다. (선행사는 눈에 안 보이는 현상)',
          },
        ],
      },
      {
        name: 'the reason 뒤의 why 는 흔히 지운다',
        note: 'the reason why 에서 why 를 지우고 the reason 만 남긴다. 뒤에 주어와 동사가 바로 온다.',
        examples: [
          {
            en: "The reason artificial blue light in devices can be so harmful in the evening is that it mimics the sun's natural blue light.",
            ko: '기기의 인공 청색광이 저녁에 그토록 해로울 수 있는 까닭은, 그것이 태양의 자연 청색광을 흉내 내기 때문이다. (reason 뒤에서 why 가 지워졌다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '선행사가 장소라고 무조건 where 가 아니다. 뒤 절에 **빠진 자리가 있으면** 관계대명사를 ' +
        '쓴다. 뒤 동사가 목적어를 받는 동사인지부터 본다.',
      contrasts: [
        {
          wrong: 'This is the village where I visited last summer.',
          right: 'This is the village which I visited last summer.',
          why: 'visit 는 목적어를 바로 받는다. visited 뒤가 비었으니 관계대명사다.',
        },
      ],
      examples: [
        {
          en: 'This is the village where I stayed last summer.',
          ko: '여기가 지난여름 내가 머문 마을이다. (stay 는 목적어를 안 받는다 — 뒤 절이 완전하니 where)',
          source: 'written',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'ln-rel',
    title: '관계대명사 — 뒤 절에서 무엇이 비었는지 본다',
    summary:
      '격은 **뒤 절에서 맡는 몫**으로 정한다. 주어가 비면 주격, 목적어가 비면 목적격이다.',
    detail:
      '관계대명사는 두 몫을 겸한다. 앞의 명사를 받으면서, 뒤 절에서 주어나 목적어 자리를 ' +
      '메운다. 그래서 뒤 절은 언제나 **한 자리가 비어 있다.**\n\n' +
      '사람이면 who · whom · whose, 사물이면 which, 둘 다 되는 것이 that 이다. 다만 that 은 ' +
      '못 쓰는 자리가 둘 있다 — 콤마 뒤와 전치사 뒤다.',
    groups: [
      {
        name: '격은 빈자리가 정한다',
        items: ['주격 — 뒤에 주어가 없다', '목적격 — 뒤에 목적어가 없다', '소유격 whose — 뒤에 명사가 바로 붙는다'],
        note: '선행사가 사람이냐 사물이냐는 그다음 문제다. 먼저 빈자리를 찾는다.',
        contrasts: [
          {
            wrong: "I'm sad that the people who daughter I look after are moving away.",
            right: "I'm sad that the people whose daughter I look after are moving away.",
            why: '뒤에 daughter 라는 명사가 바로 붙었다. 소유의 뜻을 담은 whose 자리다.',
          },
        ],
      },
      {
        name: '목적격은 지울 수 있다',
        note: '지운 자리에는 「명사 + 주어 + 동사」가 잇달아 남는다. 그것이 지워졌다는 표시다.',
        examples: [
          {
            en: 'Sadly, only seven of the 123 tragedies he wrote have survived, but of these perhaps the finest is Oedipus the King.',
            ko: '안타깝게도 그가 쓴 123편의 비극 가운데 일곱 편만 살아남았는데, 그중 아마 가장 뛰어난 것이 『오이디푸스 왕』이다. (tragedies 뒤에서 that 이 지워졌다)',
          },
        ],
      },
      {
        name: '전치사를 앞에 두면 which · whom 만',
        note: '전치사를 절 끝에 남겨 두면 that 도 되고 지울 수도 있다. 앞으로 옮기면 안 된다.',
        examples: [
          {
            en: 'We drove on to the hotel, from whose balcony we could look down at the town.',
            ko: '우리는 호텔까지 차를 몰았는데, 그 발코니에서 마을을 내려다볼 수 있었다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**that 은 전치사 뒤에 오지 못한다.** 그리고 뒤 절의 동사가 자동사면 애초에 전치사가 ' +
        '있어야 한다.',
      contrasts: [
        {
          wrong: 'The sport in that I am most interested is soccer.',
          right: 'The sport in which I am most interested is soccer.',
          why: '전치사 뒤에는 that 을 두지 못한다. which 로 바꾸거나 전치사를 절 끝으로 보낸다.',
        },
        {
          wrong: 'The bed which he slept last night was quite comfortable.',
          right: 'The bed which he slept in last night was quite comfortable.',
          why: 'sleep 은 자동사라 목적어를 받지 못한다. in 이 있어야 빈자리가 생긴다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'ln-what',
    title: '관계대명사 what — 선행사를 제 안에 품는다',
    summary:
      'what 은 **선행사를 품은** 관계대명사다. 앞에 꾸밀 명사가 있으면 what 을 쓸 수 없다.',
    detail:
      'the thing which 를 한 낱말로 줄인 것이 what 이다. 「~하는 것」으로 옮겨지며, 절 통째가 ' +
      '명사 노릇을 해 주어 · 목적어 · 보어 자리에 들어간다.\n\n' +
      '가리는 법은 둘이다. 앞에 선행사가 **있으면** which · that, **없으면** what 이다. 그리고 ' +
      'what 뒤에는 반드시 빠진 자리가 있다.',
    groups: [
      {
        name: '절 통째가 명사 자리에 들어간다',
        items: ['주어', '목적어', '보어', '전치사의 목적어'],
        note: 'what 절이 주어면 아무리 길어도 단수로 받는다.',
        examples: [
          {
            en: 'What appeared to be a shark was lurking behind the coral reef.',
            ko: '상어로 보이던 것이 산호초 뒤에 숨어 있었다. (주어 — was)',
          },
          {
            en: 'She easily believes what others say.',
            ko: '그녀는 남들이 하는 말을 쉽게 믿는다. (목적어 — say 뒤가 비었다)',
          },
        ],
      },
      {
        name: '앞에 선행사가 없어야 한다',
        note: '전치사 뒤라도 마찬가지다. 꾸밀 명사가 없으면 which 를 쓰지 못한다.',
        contrasts: [
          {
            wrong: 'Contrary to which many believe, UA is found in every city.',
            right: 'Contrary to what many believe, UA is found in every city.',
            why: '앞에 받을 명사가 없다. believe 의 목적어 자리도 비어 있으니 what 이다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'what 뒤에는 **빠진 자리가 있어야 한다.** 뒤 절이 완전하면 what 이 아니라 that 이다. ' +
        '보어 자리에서 특히 헷갈린다.',
      contrasts: [
        {
          wrong: 'One reason for upsets in sports is what the superior team may not have perceived their opponents as threatening.',
          right: 'One reason for upsets in sports is that the superior team may not have perceived their opponents as threatening.',
          why: '뒤 절에 빠진 자리가 없다. 완전한 절을 이끄는 것은 접속사 that 이다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'ln-relwhere',
    title: '관계부사 · 전치사+관계대명사 — 완전한가 불완전한가',
    summary:
      '뒤 절이 **완전하면** 관계부사, **빠진 자리가 있으면** 관계대명사다. 이 하나로 갈린다.',
    detail:
      '관계부사는 「전치사 + 관계대명사」를 한 낱말로 줄인 것이다. where = in which, ' +
      'when = at which, why = for which 다.\n\n' +
      '전치사를 이미 안고 있으니 뒤 절에 빈자리가 남지 않는다. 그래서 **완전한 절**이 온다. ' +
      '반대로 전치사 없이 which 만 있으면 그 자리가 비어 있어야 한다.',
    groups: [
      {
        name: '넷 — 선행사에 따라 고른다',
        items: ['where — 장소 · 상황', 'when — 시간', 'why — 까닭', 'how — 방법'],
        note: 'the reason 뒤의 why 와 the way 뒤의 how 는 흔히 지운다. the way how 로 겹쳐 쓰지는 않는다.',
        examples: [
          {
            en: 'The coffeehouses provided England’s first egalitarian meeting place, where a man chatted with his tablemates whether he knew them or not.',
            ko: '커피하우스는 영국 최초의 평등한 모임 장소를 마련해 주었는데, 그곳에서 사람들은 같은 탁자에 앉은 이들을 알든 모르든 이야기를 나눴다.',
          },
        ],
      },
      {
        name: '「전치사 + 관계대명사」로 풀어 쓴다',
        note: '뜻은 같고 격식이 조금 다르다. 풀어 보면 그 자리가 부사 자리였음이 드러난다.',
        examples: [
          {
            en: 'Langston Hughes was born in Joplin, Missouri, and graduated from Lincoln University, in which many African-American students have pursued their academic disciplines.',
            ko: '랭스턴 휴스는 미주리주 조플린에서 태어나 링컨 대학교를 졸업했는데, 그곳에서 많은 아프리카계 미국인 학생이 학문을 이어 왔다. (in which = where)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '선행사가 장소라고 무조건 where 가 아니다. **뒤 동사가 목적어를 받는 동사인지**부터 본다.',
      contrasts: [
        {
          wrong: 'This is the village where I visited last summer.',
          right: 'This is the village which I visited last summer.',
          why: 'visit 는 목적어를 바로 받는다. visited 뒤가 비었으니 관계대명사다.',
        },
      ],
      examples: [
        {
          en: 'This is the village where I stayed last summer.',
          ko: '여기가 지난여름 내가 머문 마을이다. (stay 는 목적어를 안 받는다 — 뒤 절이 완전하니 where)',
          source: 'written',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'ln-noun',
    title: '명사절 — 절 하나가 명사 자리에 들어간다',
    summary:
      'that · whether · 의문사가 이끄는 절이 통째로 **주어 · 목적어 · 보어** 자리를 메운다.',
    detail:
      '무엇으로 이끄느냐는 뜻이 정한다. 사실을 담으면 that, 「~인지 아닌지」면 whether, ' +
      '「누가 · 언제 · 어디서」면 의문사다.\n\n' +
      '가장 자주 나오는 흠은 **어순**이다. 의문사절이 명사 자리에 들어가면 의문문이 아니므로 ' +
      '주어와 동사를 뒤집지 않는다.',
    groups: [
      {
        name: '무엇으로 이끄나',
        items: ['that — 사실', 'whether · if — ~인지 아닌지', '의문사 — 누가 · 무엇을 · 언제'],
        note: 'that 뒤는 완전한 절이다. 빠진 자리가 있으면 that 이 아니라 what 이다.',
        examples: [
          {
            en: 'Jamie learned from the book that World War I had broken out in 1914.',
            ko: '제이미는 그 책에서 1차 세계대전이 1914년에 터졌다는 것을 알았다. (목적어 자리)',
          },
        ],
      },
      {
        name: '목적어 자리의 that 은 흔히 지운다',
        note: '주어 자리나 보어 자리의 that 은 지우지 않는다. 목적어 자리에서만 지운다.',
        examples: [
          {
            en: 'But scientists warn we cannot take our forest for granted.',
            ko: '그러나 과학자들은 우리가 숲을 당연한 것으로 여겨서는 안 된다고 경고한다. (warn 뒤에서 that 이 지워졌다)',
          },
        ],
      },
      {
        name: 'whether 와 if 는 자리가 다르다',
        note: 'if 는 목적어 자리에만 온다. 주어 · 보어 · 전치사 뒤 · or not 앞에는 whether 만 쓴다.',
        contrasts: [
          {
            wrong: 'He has to write an essay on if or not the death penalty should be abolished.',
            right: 'He has to write an essay on whether or not the death penalty should be abolished.',
            why: '전치사 on 뒤이고 or not 이 바로 붙었다. 둘 다 if 가 못 오는 자리다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '의문사절이 명사 자리에 들어가면 **의문문이 아니다.** 「의문사 + 주어 + 동사」 차례를 ' +
        '그대로 지킨다.',
      contrasts: [
        {
          wrong: 'This guide book tells you where should you visit in Hong Kong.',
          right: 'This guide book tells you where you should visit in Hong Kong.',
          why: 'tells 의 목적어라 평서문 어순이다. 주어와 조동사를 뒤집지 않는다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'ln-conj',
    title: '접속사와 전치사 — 뒤에 절인가 명사인가',
    summary:
      '뜻이 같아도 뒤에 오는 것이 다르다. **접속사 뒤에는 절**, **전치사 뒤에는 명사 · 동명사**다.',
    detail:
      'despite 와 although 는 둘 다 「~에도 불구하고」지만 despite 는 전치사, although 는 ' +
      '접속사다. 뒤에 무엇이 오는지로 가른다.\n\n' +
      '짝을 지어 외워 두면 흔들리지 않는다. because 와 because of, while 과 during, ' +
      'although 와 despite · in spite of 다.',
    groups: [
      {
        name: '뜻은 같고 뒤가 다른 짝',
        items: [
          'although · though ↔ despite · in spite of',
          'because ↔ because of · due to',
          'while ↔ during',
        ],
        note: '앞이 접속사, 뒤가 전치사다. 전치사 뒤에 주어와 동사를 두면 틀린다.',
        examples: [
          {
            en: "Despite his theoretical difference from the mainstream viewpoint, Moreno's influence in shaping psychological consciousness in the twentieth century was considerable.",
            ko: '주류 관점과 이론이 달랐음에도, 20세기 심리학적 의식을 빚는 데 미친 모레노의 영향은 상당했다. (Despite 뒤에 명사구)',
          },
          {
            en: 'Although the actress experienced much turmoil in her career, she never disclosed to anyone that she was unhappy.',
            ko: '그 여배우는 일하며 큰 혼란을 겪었지만 누구에게도 자기가 불행하다고 털어놓지 않았다. (뒤에 완전한 절)',
          },
        ],
      },
      {
        name: '대조 · 결과를 잇는 접속사',
        items: ['while · whereas — 대조', 'so that — 목적', 'so ~ that — 결과'],
        note: '모두 뒤에 완전한 절이 온다.',
        examples: [
          {
            en: 'Some remain intensely proud of their original accent and dialect words, phrases and gestures, while others accommodate rapidly to a new environment.',
            ko: '어떤 이는 본래의 억양과 사투리 낱말·표현·몸짓을 몹시 자랑스러워하는 반면, 어떤 이는 새 환경에 빠르게 맞춰 간다.',
          },
        ],
      },
      {
        name: 'by 와 until 은 결이 다르다',
        note: 'by 는 그때까지 **끝내는** 마감, until 은 그때까지 **이어지는** 일이다.',
        contrasts: [
          {
            wrong: 'We have to finish the work until the end of this month.',
            right: 'We have to finish the work by the end of this month.',
            why: '끝내는 시점의 마감을 말하니 by 다. until 은 계속되는 일에 쓴다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '때와 조건을 나타내는 부사절에서는 **앞으로의 일이라도 현재로 적는다.** will 을 쓰면 ' +
        '틀린다.',
      contrasts: [
        {
          wrong: "I'll think of you when I'll be lying on the beach next week.",
          right: "I'll think of you when I'm lying on the beach next week.",
          why: 'when 이 이끄는 때의 부사절이다. 주절에만 will 을 쓴다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-to',
    focus: '형용사적 용법',
    title: '형용사적 용법 — 앞의 명사를 뒤에서 꾸민다',
    summary:
      '명사 바로 뒤에 붙어 그 명사를 꾸민다. **「~할 · ~하는」**으로 옮겨진다.',
    detail:
      '형용사는 대개 명사 앞에 서지만, to부정사는 딸린 말이 있어 길어지므로 **뒤에서** 꾸민다.\n\n' +
      '어떤 명사가 이 꼴을 즐겨 데려오는지는 정해져 있다. ability · plan · way · chance · ' +
      'effort · need · time 같은 말이다.',
    groups: [
      {
        name: 'to부정사를 즐겨 데려오는 명사',
        items: ['ability', 'plan', 'way', 'chance', 'effort', 'need', 'time', 'right', 'decision'],
        note: '「~할 능력 · ~할 계획」처럼 그 명사가 담을 내용을 to부정사가 밝힌다.',
        examples: [
          {
            en: 'With his ability to fuse serious content with humorous style, Hughes attacked racial prejudice in a way that was natural and witty.',
            ko: '진지한 내용을 익살스러운 문체와 녹여 내는 능력으로, 휴스는 자연스럽고 재치 있게 인종 편견을 공격했다.',
          },
          {
            en: 'Because of the pandemic, the company had to hold off the plan to provide the workers with various training programs.',
            ko: '유행병 때문에 그 회사는 직원들에게 여러 연수 과정을 마련해 주려던 계획을 미뤄야 했다.',
          },
        ],
      },
      {
        name: '앞의 명사가 to부정사의 목적어일 때도 있다',
        note: '「길을 찾다 → 높일 길」처럼 앞 명사가 뒤 동사의 목적어 자리를 메운다.',
        examples: [
          {
            en: 'In the face of significant education policy challenges, schools are seeking ways to enhance school effectiveness.',
            ko: '중대한 교육 정책 과제 앞에서 학교들은 학교 효과성을 높일 길을 찾고 있다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**부사적 용법과 갈리는 자리**가 있다. 앞의 명사를 꾸미면 「~할 …」, 동사에 걸리면 ' +
        '「~하려고」다. 둘 다로 읽히는 문장도 있다.',
      examples: [
        {
          en: 'In an effort to curb my distracting explanation, the proctor led me to an empty seat and put a test booklet in front of me.',
          ko: '어수선한 내 설명을 끊으려는 노력으로, 감독관은 나를 빈자리로 데려가 시험지를 내 앞에 놓았다. (effort 를 꾸민다)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-to',
    focus: '관용 표현',
    title: 'to부정사가 든 관용 표현 — 통째로 외운다',
    summary:
      '낱말을 하나씩 옮기면 뜻이 나오지 않는 자리다. **꼴 전체**를 하나로 눈에 익힌다.',
    detail:
      '이 표현들은 사이에 다른 말이 끼어들 자리가 없다. 그래서 통째로 외워 두면 문장 안에서 ' +
      '바로 알아본다.\n\n' +
      '시험은 대개 **한 낱말을 바꿔** 놓고 고르라고 한다. but 자리에 than 을, to 자리에 for 를 ' +
      '넣는 식이다.',
    groups: [
      {
        name: '자주 나오는 꼴',
        items: [
          'have no choice but to — ~할 수밖에 없다',
          'come to + 원형 — ~하게 되다',
          'try to + 원형 — ~하려 애쓰다',
          'be about to — 막 ~하려 하다',
          'be on one’s way to -ing — ~해 가는 길에 있다',
        ],
        note: 'come to 뒤에는 원형이 오지만 be on one’s way to 뒤에는 동명사가 온다. to 의 몫이 다르다.',
        examples: [
          {
            en: 'She had no choice but to give up her goal because of the accident.',
            ko: '그녀는 그 사고 때문에 목표를 포기할 수밖에 없었다.',
          },
          {
            en: 'They came to be known as penny universities, because for that price one could purchase a cup of coffee and sit for hours listening to extraordinary conversations.',
            ko: '그곳들은 페니 대학이라 불리게 되었는데, 그 값이면 커피 한 잔을 사서 비범한 대화를 들으며 몇 시간이고 앉아 있을 수 있었기 때문이다.',
          },
        ],
      },
      {
        name: 'be to 용법 — 다섯 가지 뜻',
        items: ['예정', '의무', '가능', '운명', '의도'],
        note: 'if 절 안에 오면 대개 **의도**다. 「~하려면」으로 옮긴다.',
        examples: [
          {
            en: 'With the help of the scientist, the commercial fishing industry has found out that its fishing must be done scientifically if it is to be continued.',
            ko: '과학자의 도움으로 상업 어업계는, 어획이 이어지려면 과학적으로 이루어져야 한다는 것을 알게 되었다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'have no choice but to 의 but 은 **「~말고는」**이라는 뜻이다. than 으로 바꾸면 틀린다. ' +
        'but 뒤에는 to부정사가 온다.',
    },
  },

  {
    level: 'focus',
    unitId: 'vb-to',
    focus: '의문사 + to부정사',
    title: '의문사 + to부정사 — 명사구가 된다',
    summary:
      '「의문사 + to부정사」는 **「~할지」**라는 명사구다. 주어 · 목적어 · 보어 자리에 들어간다.',
    detail:
      '「의문사 + 주어 + should + 원형」을 줄인 꼴이다. what to wear 는 what I should wear 와 ' +
      '같다.\n\n' +
      'why 만은 이 꼴로 쓰지 않는다. how · what · when · where · which 는 모두 된다.',
    groups: [
      {
        name: '명사 자리에 통째로 들어간다',
        note: '여럿을 나란히 놓아 병치하기도 한다. 그때는 꼴을 맞춘다.',
        examples: [
          {
            en: 'You talk through the issues with yourself beforehand and decide how to present a confident, cheerful face, what to wear, what to do with your hands, and so on.',
            ko: '혼자 미리 그 문제들을 짚어 보고 자신 있고 밝은 얼굴을 어떻게 지을지, 무엇을 입을지, 손은 어떻게 할지 따위를 정한다. (셋 모두 decide 의 목적어)',
          },
          {
            en: 'Students can also pick and choose what to study and when to study, thus enabling them to learn at their own pace.',
            ko: '학생들은 또한 무엇을 공부할지와 언제 공부할지를 골라잡을 수 있고, 그리하여 자기 속도로 배울 수 있게 된다.',
          },
        ],
      },
      {
        name: '「의문사 + 주어 + should」로 풀린다',
        note: '풀어 보면 명사절과 같은 뜻임이 드러난다. 주어를 밝힐 필요가 없을 때 줄인다.',
        examples: [
          {
            en: 'I did not know what to do.',
            ko: '나는 무엇을 해야 할지 몰랐다. (= what I should do)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**why to 는 쓰지 않는다.** 까닭을 말할 때는 why 절을 그대로 쓴다. 나머지 의문사는 ' +
        '모두 이 꼴이 된다.',
    },
  },

  {
    level: 'focus',
    unitId: 'vb-to',
    focus: '명사적 용법',
    title: '명사적 용법 — 주어 · 목적어 · 보어가 된다',
    summary:
      '「~하는 것」이라는 뜻으로 **명사 자리**를 메운다. 주어로 쓰면 언제나 단수다.',
    detail:
      '동명사와 자리가 겹친다. 다만 to부정사는 **앞으로의 일 · 아직 하지 않은 일**에 기울고, ' +
      '동명사는 이미 하고 있거나 지나간 일에 기운다.\n\n' +
      '주어 자리에 쓰면 문장 앞머리가 무거워지므로, 실제 글에서는 **가주어 it 으로 미루는** ' +
      '쪽이 훨씬 흔하다.',
    groups: [
      {
        name: '주어 자리 — 단수로 받는다',
        note: '아무리 길어도 하나의 덩이라 동사는 단수다.',
        examples: [
          {
            en: 'Yet to speak up without listening is like banging pots and pans together: even if it gets you attention, it’s not going to get you respect.',
            ko: '그러나 듣지 않고 목소리만 내는 것은 냄비와 팬을 맞부딪는 것과 같아서, 주목은 끌지 몰라도 존중을 얻게 해 주지는 못한다.',
          },
        ],
      },
      {
        name: 'to부정사만 목적어로 받는 동사',
        items: ['want', 'hope', 'wish', 'plan', 'decide', 'expect', 'promise', 'refuse', 'agree'],
        note: '앞으로 할 일을 가리키는 뜻이 많다. 동명사를 받지 못한다.',
        examples: [
          {
            en: 'Foreign journalists hope to cover as much news as possible during their short stay in the capital.',
            ko: '외국 기자들은 수도에 짧게 머무는 동안 될 수 있는 한 많은 소식을 다루기를 바란다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '주어 자리의 to부정사는 실제로는 **가주어 it 으로 미루는** 쪽이 훨씬 흔하다. ' +
        'To learn English is not easy 보다 It is not easy to learn English 가 자연스럽다.',
    },
  },

  {
    level: 'focus',
    unitId: 'vb-to',
    focus: '의미상 주어',
    title: '의미상 주어 — 하는 쪽이 다르면 for 를 둔다',
    summary:
      'to부정사를 하는 쪽이 문장의 주어와 다르면 **for + 목적격**을 앞에 두어 밝힌다.',
    detail:
      'want him to go 처럼 동사가 목적어로 받는 자리면 따로 표시할 것이 없다. 그 목적어가 곧 ' +
      '하는 쪽이기 때문이다.\n\n' +
      '문제는 그런 자리가 아닐 때다. 그때 for 를 두어 「누가 하는지」를 밝힌다. **사람의 성질**을 ' +
      '나타내는 형용사 뒤에서만 of 를 쓴다.',
    groups: [
      {
        name: '기본은 for + 목적격',
        note: 'to부정사 바로 앞에 놓는다. 부정할 때는 for + 목적격 + not to 다.',
        examples: [
          {
            en: 'I should buy a book for my son to read.',
            ko: '나는 아들이 읽을 책을 사 주어야 한다. (읽는 것은 내가 아니라 아들)',
          },
          {
            en: 'It is by no means easy for us to learn English in a short time.',
            ko: '우리가 짧은 시간에 영어를 익히기란 결코 쉽지 않다.',
          },
        ],
      },
      {
        name: '사람의 성질을 말할 때만 of',
        items: ['kind', 'nice', 'foolish', 'careless', 'wise', 'rude', 'clever'],
        note: '「~하다니 …하다」로 옮겨지는 자리다. 그 사람됨을 두고 말하기 때문에 of 를 쓴다.',
        examples: [
          {
            en: 'It was kind of you to help me.',
            ko: '나를 도와주다니 당신은 친절하다.',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'easy · difficult · important 는 사람의 성질이 아니라 **일의 성질**이다. 그래서 of 가 ' +
        '아니라 for 를 쓴다.',
      contrasts: [
        {
          wrong: 'It is difficult of him to solve the problem.',
          right: 'It is difficult for him to solve the problem.',
          why: '어려운 것은 그 사람됨이 아니라 문제를 푸는 일이다. 그래서 for 다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-conj',
    focus: '양보 — though · although · despite',
    title: '양보 — 인정하고 나서 뒤집는다',
    summary:
      '앞의 사실을 인정하고 뒤에서 다른 결과를 말한다. **뒤에 절이면 although, 명사면 despite** 다.',
    detail:
      '뜻은 같지만 뒤에 오는 것이 다르다. although · though · even though 는 접속사라 절을 ' +
      '데려오고, despite · in spite of 는 전치사라 명사구만 데려온다.\n\n' +
      '우리말에서 「~지만 그러나」라고 하듯 뒤에 but 을 또 쓰기 쉽다. **영어는 하나만 쓴다.**',
    groups: [
      {
        name: '뒤에 절 — although · though · even though',
        note: '「비록 ~이지만」으로 옮긴다. 문장 앞에도 뒤에도 놓을 수 있다.',
        examples: [
          {
            en: 'Although most astronauts do not spend more than a few months in space, many experience physiological and psychological problems when they return to the Earth.',
            ko: '대부분의 우주비행사가 우주에서 몇 달 넘게 보내지는 않지만, 많은 이가 지구로 돌아올 때 생리적·심리적 문제를 겪는다.',
          },
        ],
      },
      {
        name: '뒤에 명사 — despite · in spite of',
        note: '뒤에 주어와 동사를 두면 틀린다. 동명사는 명사 쪽이라 올 수 있다.',
        examples: [
          {
            en: "Despite his theoretical difference from the mainstream viewpoint, Moreno's influence in shaping psychological consciousness in the twentieth century was considerable.",
            ko: '주류 관점과 이론이 달랐음에도, 20세기 심리학적 의식을 빚는 데 미친 모레노의 영향은 상당했다.',
          },
        ],
      },
      {
        name: 'even though 와 even if 는 결이 다르다',
        note: 'even though 는 **사실을 전제**하고, even if 는 사실 여부와 상관없이 **가정**한다.',
        examples: [
          {
            en: 'For example, even though you may feel that you weren’t born with a talent for math, you can significantly increase your mathematical abilities through mindful, deliberate practice.',
            ko: '예를 들어 자기가 수학 재능을 타고나지 못했다고 느낄지라도, 의식적이고 의도적인 연습으로 수학 능력을 크게 키울 수 있다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'although 를 쓰고 뒤 절에 but 을 또 쓰면 안 된다. **영어는 접속사를 하나만 쓴다.**',
      contrasts: [
        {
          wrong: 'Although she was tired, but she kept working.',
          right: 'Although she was tired, she kept working.',
          why: 'Although 하나로 이미 두 절이 이어졌다. but 을 더 쓰면 겹친다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-conj',
    focus: '접속사 뒤에는 완전한 절',
    title: '접속사 뒤에는 완전한 절',
    summary:
      '접속사가 데려오는 절에는 **빠진 자리가 없다.** 주어도 동사도 다 있다.',
    detail:
      '관계사와 갈리는 자리다. 관계사는 앞의 명사를 받으면서 뒤 절의 한 자리를 메우므로 ' +
      '그 자리가 비지만, 접속사는 두 절을 잇기만 하므로 뒤 절이 온전하다.\n\n' +
      '꼴이 같은 낱말도 있다. after · before · since · as 는 뒤에 절이 오면 접속사, 명사가 ' +
      '오면 전치사다.',
    groups: [
      {
        name: '뒤 절에 빈자리가 없다',
        note: '주어와 동사가 갖춰져 있다. 그것이 접속사라는 표시다.',
        examples: [
          {
            en: 'Although the actress experienced much turmoil in her career, she never disclosed to anyone that she was unhappy.',
            ko: '그 여배우는 일하며 큰 혼란을 겪었지만 누구에게도 자기가 불행하다고 털어놓지 않았다.',
          },
          {
            en: 'After Francesca made a case for staying at home during the summer holidays, an uncomfortable silence fell on the dinner table.',
            ko: '여름휴가 동안 집에 있자고 프란체스카가 주장하자 저녁 식탁에 불편한 침묵이 내려앉았다.',
          },
        ],
      },
      {
        name: '접속사도 되고 전치사도 되는 낱말',
        items: ['after', 'before', 'since', 'as', 'until'],
        note: '뒤에 무엇이 오는지로 갈린다. 절이면 접속사, 명사면 전치사다.',
      },
    ],
    pitfall: {
      text:
        '전치사 뒤에 절을 두면 틀린다. **despite · because of · due to · during** 뒤에는 명사만 ' +
        '온다.',
      contrasts: [
        {
          wrong: 'Despite it was raining, they went out.',
          right: 'Although it was raining, they went out.',
          why: 'Despite 는 전치사라 절을 못 받는다. 절을 데려오려면 Although 를 쓴다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-conj',
    focus: '대조 — while · whereas',
    title: '대조 — while · whereas 로 맞세운다',
    summary:
      '두 가지를 나란히 놓고 **맞세울** 때 쓴다. 뒤에는 완전한 절이 온다.',
    detail:
      'while 은 「~하는 동안」이라는 시간의 뜻도 있어 헷갈린다. 가르는 법은 하나다 — ' +
      '**앞뒤가 맞세워져 있으면 대조**, 같은 때를 가리키면 시간이다.\n\n' +
      'whereas 는 대조의 뜻만 있어 흔들림이 없다. 격식 있는 글에서 즐겨 쓴다.',
    groups: [
      {
        name: 'Some ~ while others ~ 가 대표 꼴',
        note: '앞뒤에 짝이 되는 말이 놓이면 대조다.',
        examples: [
          {
            en: 'Some remain intensely proud of their original accent and dialect words, phrases and gestures, while others accommodate rapidly to a new environment by changing their speech habits.',
            ko: '어떤 이는 본래의 억양과 사투리 낱말·표현·몸짓을 몹시 자랑스러워하는 반면, 어떤 이는 말버릇을 바꿔 새 환경에 빠르게 맞춰 간다.',
          },
        ],
      },
      {
        name: 'whereas 는 대조만 뜻한다',
        note: 'while 과 달리 시간의 뜻이 없다. 앞뒤가 반대임을 또렷이 한다.',
        examples: [
          {
            en: 'This probably reflects the corals’ ability to modify their environment and partially adjust to ocean acidification, whereas the dissolution of sands is a geochemical process that cannot adapt.',
            ko: '이것은 아마 산호가 제 환경을 바꾸고 바다 산성화에 어느 정도 맞춰 가는 능력을 보여 준다. 반면에 모래가 녹는 일은 맞춰 갈 수 없는 지구화학적 과정이다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'while 이 **시간인지 대조인지**는 뜻으로 가른다. 앞뒤에 짝이 되는 말(Some ~ others)이 ' +
        '있으면 대조, 같은 때를 가리키면 시간이다.',
    },
  },

  {
    level: 'focus',
    unitId: 'ln-conj',
    focus: '결과·목적 — so that · such that',
    title: '결과 · 목적 — so that 이 잇는다',
    summary:
      '「그래서 ~하다」와 「~하도록」 둘 다 so that 이 잇는다. **콤마의 있고 없음**으로 갈린다.',
    detail:
      '콤마가 앞에 있으면 대개 **결과**, 없으면 **목적**으로 읽는다. 뒤 절에 can · may · will ' +
      '같은 조동사가 있으면 목적 쪽이다.\n\n' +
      'so ~ that 과는 다르다. 그것은 so 와 that 사이에 형용사나 부사가 끼어 「너무 ~해서 …하다」가 ' +
      '되는 꼴이다.',
    groups: [
      {
        name: '콤마가 있으면 결과',
        note: '앞 일이 낳은 결과를 덧붙인다. 「그래서 ~하다」로 옮긴다.',
        examples: [
          {
            en: 'Others accommodate rapidly to a new environment by changing their speech habits, so that they no longer "stand out in the crowd."',
            ko: '어떤 이는 말버릇을 바꿔 새 환경에 빠르게 맞춰 가고, 그래서 더는 「무리 속에서 튀지」 않는다.',
          },
        ],
      },
      {
        name: '조동사가 있으면 목적',
        note: '「~할 수 있도록」으로 옮긴다. 아직 일어나지 않은 일이라 조동사가 붙는다.',
        examples: [
          {
            en: 'If you lose or break a possession, try to model a good attitude so that your child can begin to develop an attitude of nonattachment.',
            ko: '가진 물건을 잃거나 망가뜨렸다면 좋은 태도를 보여 주려 해 보라. 그래야 아이가 집착하지 않는 태도를 기르기 시작할 수 있다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**so that 과 so ~ that 을 가른다.** so 와 that 이 붙어 있으면 목적 · 결과를 잇는 것이고, ' +
        '사이에 형용사 · 부사가 끼면 「너무 ~해서 …하다」다.',
      examples: [
        {
          en: 'Worry creates so much clutter in your mind that you cannot think clearly about anything.',
          ko: '걱정은 머릿속을 너무 어지럽혀서 무엇도 또렷이 생각하지 못하게 만든다. (so 와 that 사이에 much clutter 가 끼었다)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-conj',
    focus: '전치사 뒤에는 명사·동명사',
    title: '전치사 뒤에는 명사 · 동명사',
    summary:
      '전치사 뒤에는 **명사나 동명사**만 온다. 동사원형도 절도 오지 못한다.',
    detail:
      '동사를 전치사 뒤에 넣어야 할 때는 -ing 로 바꾼다. 그것이 동명사다.\n\n' +
      '헷갈리는 것은 **to** 다. 부정사의 to 뒤에는 원형이 오지만, 전치사의 to 뒤에는 -ing 가 ' +
      '온다. 그 자리에 명사를 넣어 말이 되면 전치사다.',
    groups: [
      {
        name: '뒤에 명사구가 온다',
        note: '주어와 동사를 갖춘 절은 못 온다. 절을 데려오려면 접속사를 써야 한다.',
        examples: [
          {
            en: "Despite his theoretical difference from the mainstream viewpoint, Moreno's influence in shaping psychological consciousness in the twentieth century was considerable.",
            ko: '주류 관점과 이론이 달랐음에도, 20세기 심리학적 의식을 빚는 데 미친 모레노의 영향은 상당했다. (Despite 뒤는 명사구, in 뒤는 동명사)',
          },
        ],
      },
      {
        name: 'to 가 전치사인 표현',
        items: ['look forward to', 'be used to', 'object to', 'contribute to', 'when it comes to'],
        note: '이 to 뒤에는 원형이 아니라 -ing 가 온다. 명사를 넣어 보면 알 수 있다.',
        contrasts: [
          {
            wrong: 'I look forward to receive your reply as soon as possible.',
            right: 'I look forward to receiving your reply as soon as possible.',
            why: 'look forward to 의 to 는 전치사다. 뒤에 동명사가 온다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '전치사 뒤에 원형을 두면 틀린다. 시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'The paper charged her with use the company’s money for her own purposes.',
          right: 'The paper charged her with using the company’s money for her own purposes.',
          why: 'with 는 전치사다. 뒤에 동사원형이 오지 못한다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'ln-compound',
    title: '복합관계사 — 격은 절 안에서 정한다',
    summary:
      '「-ever」가 붙어 선행사를 제 안에 품는다. 격은 **뒤 절에서 맡는 몫**으로 정한다.',
    detail:
      'whoever 는 anyone who, whatever 는 anything that 로 풀린다. 절 통째가 명사 노릇을 ' +
      '하거나 「~하더라도」라는 양보 부사절이 된다.\n\n' +
      '흔한 흠은 **앞의 전치사에 끌려 목적격으로 적는 것**이다. 격을 정하는 것은 앞의 전치사가 ' +
      '아니라 뒤 절이다.',
    groups: [
      {
        name: '명사절도 되고 양보 부사절도 된다',
        items: ['whoever', 'whomever', 'whatever', 'whichever', 'whenever', 'wherever', 'however'],
        note: 'whenever · wherever · however 는 부사절만 이룬다. 명사 자리에는 들어가지 않는다.',
        examples: [
          {
            en: 'The way to learn to stop worrying is by first understanding that you energize whatever you focus your attention on.',
            ko: '걱정을 멈추는 법을 배우는 길은, 당신이 주의를 쏟는 것은 무엇이든 힘을 얻는다는 것을 먼저 이해하는 데 있다. (on 뒤가 비어 목적격)',
          },
        ],
      },
      {
        name: 'however 는 형용사 · 부사를 함께 끌고 나온다',
        note: 'however + 형용사 · 부사 + 주어 + 동사 차례다. 「아무리 ~해도」로 옮긴다.',
        examples: [
          {
            en: 'However hard he tried, he could not open the door.',
            ko: '아무리 애써도 그는 문을 열지 못했다.',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '앞에 전치사가 있어도 **격은 뒤 절이 정한다.** 뒤 절에서 주어 노릇을 하면 whoever 다.',
      contrasts: [
        {
          wrong: 'A gift card will be given to whomever completes the questionnaire.',
          right: 'A gift card will be given to whoever completes the questionnaire.',
          why: 'completes 의 주어 자리다. 앞의 to 에 끌려 목적격으로 적으면 틀린다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'ln-appos',
    title: '동격 — 앞 명사를 다른 말로 되풀어 준다',
    summary:
      '앞의 명사가 무엇인지 뒤에서 다시 말해 주는 자리다. **둘은 같은 것을 가리킨다.**',
    detail:
      '동격의 that 은 관계대명사 that 과 꼴이 같아 헷갈린다. 가르는 잣대는 하나다 — ' +
      '**뒤 절이 완전하면 동격, 빠진 자리가 있으면 관계대명사**다.\n\n' +
      '동격은 that 말고도 여러 꼴로 온다. 콤마로 끼워 넣거나, 줄표로 잇거나, of 로 잇는다.',
    groups: [
      {
        name: '동격의 that — 뒤 절이 완전하다',
        items: ['fact', 'idea', 'news', 'belief', 'sense', 'evidence', 'possibility', 'rumor'],
        note: '이런 명사가 앞에 있으면 뒤의 that 절은 대개 동격이다. 그 명사의 「내용」을 담는다.',
        examples: [
          {
            en: 'Gradually, we will lose the sense that others have an accent and we will begin to fit in.',
            ko: '차츰 우리는 남들에게 억양이 있다는 느낌을 잃고 어울려 들기 시작할 것이다. (others have an accent 가 완전한 절)',
          },
        ],
      },
      {
        name: '콤마와 줄표로도 잇는다',
        note: '걷어 내도 문장이 성립한다. 그것이 동격이라는 표시다.',
        examples: [
          {
            en: 'A resident, John Smith, of 123 Elm Street, has reported problems with the road conditions on Elm Street.',
            ko: '엘름가 123번지의 주민 존 스미스가 엘름가의 도로 상태 문제를 알려 왔다. (주민 = 존 스미스)',
          },
          {
            en: 'How on earth will it help the poor if governments try to strangle globalization by stemming the flow of trade, information, and capital ― the three components of the global economy?',
            ko: '세계 경제의 세 요소인 무역·정보·자본의 흐름을 막아 세계화를 옥죄려 든다면, 그것이 대체 어떻게 가난한 이를 돕겠는가? (줄표 뒤가 앞의 셋과 동격)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '같은 문장에 that 이 둘 있으면 **하나는 관계대명사, 하나는 동격**일 수 있다. 뒤 절이 ' +
        '완전한지 따로따로 본다.',
      examples: [
        {
          en: 'Psychodrama as a form of group therapy started with premises that were quite alien to the Freudian worldview that mental illness essentially occurs within the psyche or mind.',
          ko: '집단 치료의 한 형태인 심리극은, 정신 질환이 본질적으로 마음 안에서 일어난다는 프로이트식 세계관과는 꽤 낯선 전제에서 출발했다. (앞 that 은 관계대명사 — were 의 주어가 비었다 / 뒤 that 은 동격 — 절이 완전하다)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-rel',
    focus: '계속적 용법(콤마)',
    title: '계속적 용법 — 콤마 뒤는 덧붙이는 설명',
    summary:
      '콤마가 붙으면 선행사를 **좁히지 않는다.** 「그런데 그것은」 하고 설명을 보탤 뿐이다.',
    detail:
      '콤마가 있고 없고에 따라 뜻이 달라진다. 콤마가 없으면 여럿 가운데 하나를 골라내고, ' +
      '콤마가 있으면 이미 정해진 것에 설명을 보탠다.\n\n' +
      '읽는 법도 다르다. 콤마 뒤는 되짚어 올라가지 말고 **앞에서부터 그대로 밀고 나간다.** ' +
      '「~인데, 그것은 ~」이다.',
    groups: [
      {
        name: '콤마 하나로 뜻이 갈린다',
        note: '콤마가 없으면 아들이 더 있을 수 있고, 콤마가 있으면 아들은 둘뿐이다.',
        examples: [
          {
            en: 'He has two sons who live in Seoul.',
            ko: '그는 서울에 사는 아들이 둘 있다. (다른 곳에 사는 아들이 더 있을 수 있다)',
            source: 'written',
          },
          {
            en: 'He has two sons, who live in Seoul.',
            ko: '그는 아들이 둘 있는데, 그 둘은 서울에 산다. (아들은 둘뿐이다)',
            source: 'written',
          },
        ],
      },
      {
        name: '앞에서부터 이어 읽는다',
        note: '「~한 …」으로 되짚지 않는다. 「~인데, 그들은」으로 그냥 나아간다. 콤마 대신 줄표를 쓰기도 한다.',
        examples: [
          {
            en: 'This is dreadful news for people in these vulnerable regions, who are victims of urbanization and have a shortage of crops.',
            ko: '이것은 이 취약한 지역 사람들에게 끔찍한 소식인데, 그들은 도시화의 피해자이며 작물도 모자란다.',
          },
          {
            en: 'Many state and local archives store public records―which are an amazing, diverse resource.',
            ko: '많은 주와 지방의 기록보관소가 공공 기록을 보관하는데, 그것은 놀랍고 다채로운 자원이다. (줄표를 쓴 꼴)',
          },
        ],
      },
      {
        name: '선행사는 뜻으로 정한다',
        note: '콤마 바로 앞의 명사가 늘 선행사인 것은 아니다. 넣어 읽어 보고 말이 되는 쪽을 고른다.',
        examples: [
          {
            en: 'Evans found a trove of artifacts from the Minoan age, which reached its height from 1900 to 1450 B.C.',
            ko: '에번스는 미노아 시대의 유물 더미를 찾아냈는데, 그 시대는 기원전 1900년부터 1450년까지 절정에 이르렀다. (절정에 이른 것은 유물이 아니라 시대다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '계속적 용법에는 **that 을 쓰지 못한다.** 관계대명사를 지울 수도 없다. 제한적 용법에서 ' +
        '되던 두 가지가 여기서는 막힌다.',
      contrasts: [
        {
          wrong: 'He has two sons, that live in Seoul.',
          right: 'He has two sons, who live in Seoul.',
          why: '콤마 뒤에는 that 을 쓰지 못한다. 사람이면 who, 사물이면 which 다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-rel',
    focus: '주격 관계대명사 — 수일치',
    title: '주격 관계대명사 — 동사는 선행사를 따른다',
    summary:
      '관계절의 동사는 **선행사**의 수를 따른다. 관계사 바로 앞의 명사가 늘 선행사인 것은 아니다.',
    detail:
      '주격 관계대명사는 뒤 절의 주어 자리를 메운다. 그러니 뒤 절의 동사는 선행사에 맞춘다.\n\n' +
      '어려운 것은 수일치가 아니라 **선행사 찾기**다. 「A of B」 뒤에 관계사가 오면 A인지 B인지 ' +
      '가려야 한다. 넣어 읽어 보고 말이 되는 쪽이 선행사다.',
    groups: [
      {
        name: '동사는 선행사에 맞춘다',
        note: '선행사가 복수면 관계절의 동사도 복수다. 주절의 주어와는 상관없다.',
        examples: [
          {
            en: 'This network includes areas of your brain that are involved in executive function.',
            ko: '이 연결망은 실행 기능에 관여하는 뇌의 영역들을 아우른다. (관여하는 것은 areas 라 are)',
          },
          {
            en: 'Lang feels that shark scales can inspire designs for machines that experience drag, such as airplanes.',
            ko: '랭은 상어 비늘이 비행기처럼 항력을 겪는 기계의 설계에 실마리를 줄 수 있다고 여긴다. (겪는 것은 machines 라 -s 가 없다)',
          },
        ],
      },
      {
        name: '「A of B」 뒤에서는 대개 A가 선행사다',
        note: '주어의 핵을 찾을 때와 같다. of 뒤의 명사가 아니라 그 앞의 핵을 본다.',
        examples: [
          {
            en: 'An ice tongue is a strip of ice that floats on the water without breaking off from the ice on land.',
            ko: '아이스텅은 뭍의 얼음에서 떨어져 나가지 않은 채 물 위에 떠 있는 가늘고 긴 얼음 띠다. (뜨는 것은 「띠」라 floats)',
          },
        ],
      },
      {
        name: '꼴로 안 되면 뜻으로 가린다',
        note: '둘 다 복수라 꼴로는 갈리지 않는 자리가 있다. 그때는 넣어 읽어 본다.',
        examples: [
          {
            en: 'Taste buds got their name from the nineteenth-century German scientists Georg Meissner and Rudolf Wagner, who discovered mounds made up of taste cells that overlap like petals.',
            ko: '미뢰는 19세기 독일 과학자 마이스너와 바그너에게서 이름을 얻었는데, 그들은 꽃잎처럼 겹쳐 있는 미각 세포로 이루어진 둔덕을 발견했다. (겹쳐 있는 것은 둔덕이 아니라 세포다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'one of the + 복수명사 뒤의 관계사는 그 **복수명사**를 받는다. 문장의 주어가 단수라고 ' +
        '관계절까지 단수로 쓰면 틀린다.',
      contrasts: [
        {
          wrong: 'He is one of the students who is diligent.',
          right: 'He is one of the students who are diligent.',
          why: '부지런한 것은 그 한 사람이 아니라 students 다. 그 여럿 가운데 하나가 he 다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'v-passive',
    focus: '4형식·5형식의 수동',
    title: '4형식·5형식의 수동 — 뒤에 남는 것이 있다',
    summary:
      '목적어를 둘 받거나 보어를 받던 동사는 수동이 되어도 **뒤에 하나가 남는다.** 남았다고 능동이 아니다.',
    detail:
      '3형식의 수동은 뒤가 깨끗이 빈다. 그런데 4형식·5형식은 받던 것이 둘이라, 하나가 주어로 ' +
      '올라가도 나머지가 그 자리에 남는다.\n\n' +
      '그래서 be + p.p. 뒤에 명사나 to부정사가 보인다. 그것을 목적어로 보고 능동이라 여기면 ' +
      '읽기가 어그러진다.',
    groups: [
      {
        name: '4형식의 수동 — 목적어가 하나 남는다',
        note: '「누구에게」가 주어로 올라가면 「무엇을」이 그대로 남는다.',
        examples: [
          {
            en: 'Ziv was awarded a certificate for good citizenship.',
            ko: '지브는 모범 시민 표창장을 받았다. (능동은 they awarded Ziv a certificate)',
          },
        ],
      },
      {
        name: '5형식의 수동 — 보어가 그대로 남는다',
        note: '목적격보어로 온 to부정사는 수동에서도 자리를 지킨다.',
        examples: [
          {
            en: 'They were then asked to take a test about the video.',
            ko: '그다음 그들은 그 영상에 대한 시험을 치르라는 요청을 받았다. (ask A to do 의 수동)',
          },
          {
            en: 'All assignments are expected to be turned in on time.',
            ko: '모든 과제는 제때에 제출될 것으로 기대된다. (수동이 두 겹 — are expected 와 to be turned in)',
          },
        ],
      },
      {
        name: 'as · to 도 그대로 남는다',
        items: ['regard A as B', 'dismiss A as B', 'attribute A to B'],
        note: '이런 동사를 수동으로 쓰면 뒤의 전치사가 남는다. 전치사만 보고 다른 구문으로 읽지 않는다.',
        examples: [
          {
            en: 'Oedipus the King is regarded as the best example of classical Athenian tragedy.',
            ko: '『오이디푸스 왕』은 고전 아테네 비극의 가장 좋은 본보기로 여겨진다.',
          },
          {
            en: "Abnormal behaviors, from simple headaches to convulsive attacks, were attributed to evil spirits that inhabited or controlled the afflicted person's body.",
            ko: '단순한 두통부터 경련 발작까지 이상 행동은, 고통받는 사람의 몸에 깃들거나 그 몸을 지배하는 악령의 탓으로 돌려졌다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '사역동사 make 는 능동에서 **원형**을 받지만, 수동이 되면 지워졌던 **to 가 되살아난다.** ' +
        '원형 그대로 두면 틀린다.',
      contrasts: [
        {
          wrong: 'He was made work overtime.',
          right: 'He was made to work overtime.',
          why: '능동은 They made him work 다. 수동에서는 to 를 되살린다.',
        },
      ],
      examples: [
        {
          en: 'She was seen to enter the building.',
          ko: '그녀가 건물에 들어가는 것이 목격되었다. (지각동사도 같다 — was seen entering 으로도 쓴다)',
          source: 'written',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-to',
    focus: '부사적 용법',
    title: 'to부정사 부사적 용법 — 대개는 목적이다',
    summary: '동사를 꾸미는 to부정사다. 기출에서는 거의 다 **「~하려고」라는 목적**이다.',
    detail:
      '가리는 법은 하나뿐이다. **in order to 로 늘려 써서 말이 되면 목적**이다. 안 되면 다른 ' +
      '쓰임이다.\n\n' +
      '문장 첫머리에 놓이면 문장 전체의 까닭이 된다. 이때는 콤마로 끊고 주절이 이어진다.',
    groups: [
      {
        name: '목적 — in order to 로 늘려 써진다',
        note: '왜 그렇게 하는지를 밝힌다. so as to 로도 늘려 쓸 수 있다.',
        examples: [
          {
            en: 'We work with a broad range of national organizations and forums to ensure secure, affordable and sustainable energy systems.',
            ko: '우리는 안전하고 감당할 만하며 지속 가능한 에너지 체계를 보장하기 위해 폭넓은 국가 기관과 협의체와 함께 일한다.',
          },
          {
            en: "Some people, such as astronauts and fighter jet pilots, undergo special training exercises to increase their bodies' resistance to g-force.",
            ko: '우주비행사와 전투기 조종사처럼 어떤 사람들은 몸의 중력가속도 저항력을 높이려고 특별한 훈련을 거친다.',
          },
        ],
      },
      {
        name: '문두에 오면 문장 전체의 까닭',
        note: '「~하려면」으로 옮긴다. 콤마로 끊고 주절이 이어진다.',
        examples: [
          {
            en: 'To rule an area that large, the Romans, based in what is now central Italy, needed an effective system of government administration.',
            ko: '그만큼 넓은 지역을 다스리려면, 지금의 이탈리아 중부에 터를 잡은 로마인들에게는 효과적인 정부 운영 체계가 필요했다.',
          },
          {
            en: "To learn more about the Korean War, you'd go to a library for a history book.",
            ko: '한국전쟁에 대해 더 알아보려면 당신은 역사책을 구하러 도서관에 갈 것이다.',
          },
        ],
      },
      {
        name: '목적이 아닌 자리',
        note: '아래 셋은 in order to 로 늘려 쓰면 말이 안 된다. 그것이 목적이 아니라는 표시다.',
        examples: [
          {
            en: 'I am glad to see you again.',
            ko: '다시 만나 반갑다. (감정의 까닭 — 무엇 때문에 반가운지)',
            source: 'written',
          },
          {
            en: 'He grew up to be a famous scientist.',
            ko: '그는 자라서 이름난 과학자가 되었다. (결과 — 그렇게 되었다)',
            source: 'written',
          },
          {
            en: 'This book is difficult to read.',
            ko: '이 책은 읽기 어렵다. (형용사를 꾸민다 — 무엇이 어려운지)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '바로 앞에 명사가 있으면 그 명사를 꾸미는 형용사적 용법일 수도 있다. 가리는 법은 하나다 — ' +
        '**명사를 꾸미면 「~할 …」**, 동사를 꾸미면 「~하려고」다. 아래는 둘 다로 읽히는 자리다.',
      examples: [
        {
          en: 'Macaulay students also receive a laptop and $7,500 in "opportunities funds" to pursue research, service experiences, study abroad programs and internships.',
          ko: '매콜리 학생들은 연구와 봉사 경험, 해외 연수, 인턴 활동을 좇으라고 노트북 한 대와 「기회 기금」 7,500달러도 받는다. (「좇으라고 준다」로도, 「좇을 기금」으로도 통한다)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-noun',
    focus: '명사절의 자리(주어·목적어·보어)',
    title: '명사절의 자리 — 절 하나가 명사 노릇을 한다',
    summary: '절 통째가 **주어 · 목적어 · 보어 · 전치사의 목적어** 자리를 메운다.',
    detail:
      '명사가 들어갈 수 있는 자리면 명사절도 들어간다. 길어질 뿐 몫은 명사와 같다.\n\n' +
      '읽을 때는 그 절이 어디서 시작해 어디서 끝나는지부터 긋는다. 그러면 문장의 뼈대가 ' +
      '드러난다.',
    groups: [
      {
        name: '주어 자리 — 아무리 길어도 단수',
        note: '절 통째가 하나의 덩이라 동사는 단수로 받는다.',
        examples: [
          {
            en: 'Whether they do this consciously or not is open to debate and may differ from individual to individual.',
            ko: '그들이 이것을 의식하고 하는지 아닌지는 논쟁의 여지가 있고 사람마다 다를 수 있다. (is — 단수)',
          },
          {
            en: 'How well your organization does its job is partly a function of how many of those resources you have.',
            ko: '당신의 조직이 제 일을 얼마나 잘 해내는가는 얼마쯤은 그 자원을 얼마나 많이 가졌는가에 달렸다.',
          },
        ],
      },
      {
        name: '목적어 자리 — 동사에서 떨어져 있기도 하다',
        note: '동사와 명사절 사이에 수식어가 끼어도 목적어라는 사실은 달라지지 않는다.',
        examples: [
          {
            en: 'Jamie learned from the book that World War I had broken out in 1914.',
            ko: '제이미는 제1차 세계대전이 1914년에 일어났다는 것을 그 책에서 알게 되었다. (learned 와 that 사이에 from the book 이 끼었다)',
          },
        ],
      },
      {
        name: '보어 자리와 전치사 뒤',
        note: 'be동사 뒤나 전치사 뒤에도 절이 통째로 들어간다.',
        examples: [
          {
            en: "Some people think that the central dichotomy in life is whether you're positive or negative about the issues that interest or concern you.",
            ko: '어떤 이들은 삶의 핵심적 이분법이란 관심을 끌거나 걱정을 주는 문제에 대해 긍정적이냐 부정적이냐 하는 것이라고 생각한다. (whether 절이 보어)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '명사절과 관계절은 겉꼴이 닮았다. 가르는 법은 하나다 — **명사절은 그 자리를 통째로 ' +
        '메우고**, 관계절은 앞의 명사를 꾸민다.',
    },
  },

  {
    level: 'focus',
    unitId: 'ln-noun',
    focus: '접속사 that 생략',
    title: '접속사 that 생략 — 목적어 자리에서만 지운다',
    summary:
      '목적절을 이끄는 that 은 흔히 지운다. **주어 자리와 보어 자리의 that 은 지우지 않는다.**',
    detail:
      'say · think · know · believe · warn 뒤에서 특히 자주 지운다. 지워지면 「동사 + 주어 + ' +
      '동사」가 잇달아 나와 문장이 두 겹으로 겹쳐 보인다.\n\n' +
      '읽는 법은 하나다. 동사 뒤에 갑자기 새 주어가 나오면 **that 이 지워졌다**고 본다.',
    groups: [
      {
        name: '지우는 자리',
        items: ['say', 'think', 'know', 'believe', 'warn', 'hope', 'argue', 'show'],
        note: '이런 동사의 목적절에서 지운다. 지워도 뜻이 흐려지지 않기 때문이다.',
        examples: [
          {
            en: 'But scientists warn we cannot take our forest for granted.',
            ko: '그러나 과학자들은 우리가 숲을 당연한 것으로 여겨서는 안 된다고 경고한다.',
          },
          {
            en: 'Detractors argue trading water is unethical or even a breach of human rights.',
            ko: '헐뜯는 이들은 물을 사고파는 일이 비윤리적이거나 심지어 인권 침해라고 주장한다.',
          },
        ],
      },
      {
        name: '앞의 that 은 남기고 뒤엣것만 지우기도 한다',
        note: '절이 길어져 경계가 흐려질 때는 살려 둔다. 둘을 다르게 다루는 것이 자연스럽다.',
        examples: [
          {
            en: 'One is that we have a blind spot in our imagination and the other is we fail to ask questions about new information.',
            ko: '하나는 우리 상상력에 사각지대가 있다는 것이고, 다른 하나는 우리가 새 정보에 대해 묻지 못한다는 것이다. (앞은 남기고 뒤는 지웠다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**주어 자리의 that 은 지우지 못한다.** 문장이 어디서 시작하는지 알 수 없어지기 ' +
        '때문이다. 보어 자리도 대개 남긴다.',
      contrasts: [
        {
          wrong: 'He is honest is certain.',
          right: 'That he is honest is certain.',
          why: '주어 자리라 that 을 지우지 못한다. 지우면 주어와 동사가 겹쳐 보인다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-noun',
    focus: 'whether · if 절',
    title: 'whether · if — 「~인지 아닌지」',
    summary:
      '뜻은 같지만 **설 수 있는 자리가 다르다.** if 는 목적어 자리에만 온다.',
    detail:
      'whether 는 주어 · 목적어 · 보어 · 전치사 뒤 어디에나 온다. if 는 목적어 자리 하나뿐이다.\n\n' +
      'or not 을 붙이는 자리도 갈린다. whether or not 은 붙여 쓸 수 있지만 **if or not 은 ' +
      '쓰지 못한다.**',
    groups: [
      {
        name: 'whether 만 되는 자리',
        items: ['주어', '보어', '전치사 뒤', 'or not 바로 앞', 'to부정사 앞'],
        note: '이 다섯 자리에는 if 를 쓰지 못한다.',
        examples: [
          {
            en: 'Whether they do this consciously or not is open to debate and may differ from individual to individual.',
            ko: '그들이 이것을 의식하고 하는지 아닌지는 논쟁의 여지가 있고 사람마다 다를 수 있다. (주어 자리)',
          },
          {
            en: 'I think the better question to ask is whether you are going to do something about it or just let life pass you by.',
            ko: '물어야 할 더 나은 물음은, 그것에 대해 무언가를 할 것인지 아니면 그저 삶이 스쳐 가게 둘 것인지다. (보어 자리)',
          },
        ],
      },
      {
        name: '목적어 자리에서는 둘 다 된다',
        note: '이 자리에서만 if 로 바꿔 쓸 수 있다.',
        examples: [
          {
            en: 'He said he could feel whether or not the author liked people.',
            ko: '그는 그 작가가 사람을 좋아하는지 아닌지 느낄 수 있다고 말했다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '전치사 뒤와 or not 앞은 **if 가 못 오는 자리**다. 둘이 겹치면 더욱 그렇다. 시험이 ' +
        '흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'He has to write an essay on if or not the death penalty should be abolished.',
          right: 'He has to write an essay on whether or not the death penalty should be abolished.',
          why: '전치사 on 뒤이고 or not 이 바로 붙었다. 둘 다 if 가 못 오는 자리다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-noun',
    focus: '의문사가 이끄는 절',
    title: '의문사가 이끄는 절 — 어순을 뒤집지 않는다',
    summary:
      '의문사절이 명사 자리에 들어가면 **의문문이 아니다.** 「의문사 + 주어 + 동사」 차례를 지킨다.',
    detail:
      '의문문은 조동사를 주어 앞으로 보내지만, 그 물음이 문장 안에 들어가면 평서문 어순으로 ' +
      '되돌아간다. 이것을 간접의문문이라 한다.\n\n' +
      '물음표도 없어진다. 문장 전체가 물음이 아니라 진술이기 때문이다.',
    groups: [
      {
        name: '평서문 어순 그대로',
        note: '조동사를 만들어 넣지도 않고 앞으로 보내지도 않는다.',
        examples: [
          {
            en: 'He asked me why I kept coming back day after day.',
            ko: '그는 나에게 왜 날마다 되돌아오는지를 물었다. (why did I 가 아니다)',
          },
          {
            en: 'Biologists can’t decide why giraffes evolved patches.',
            ko: '생물학자들은 기린이 왜 반점을 갖게 되었는지 결론짓지 못한다.',
          },
        ],
      },
      {
        name: '의문사가 형용사 · 부사를 끌고 나온다',
        items: ['how well', 'how much', 'how many', 'how long', 'how badly'],
        note: 'how 는 뒤의 형용사 · 부사를 함께 앞으로 데려간다. 그 뒤에 주어와 동사가 온다.',
        examples: [
          {
            en: "Of course, how much and how quickly you'll decondition depends on a slew of factors like how fit you are, your age, and how long sweating has been a habit.",
            ko: '물론 얼마나 많이 그리고 얼마나 빨리 몸이 풀릴지는 얼마나 몸이 좋은지, 나이, 땀 흘리는 일이 얼마나 오래 버릇이었는지 같은 여러 요인에 달려 있다.',
          },
        ],
      },
    ],
    pitfall: {
      text: '어순을 뒤집으면 틀린다. 시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'This guide book tells you where should you visit in Hong Kong.',
          right: 'This guide book tells you where you should visit in Hong Kong.',
          why: 'tells 의 목적어라 평서문 어순이다. 주어와 조동사를 뒤집지 않는다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-noun',
    focus: 'that 뒤는 완전한 절',
    title: 'that 뒤는 완전한 절 — 빠진 자리가 없다',
    summary:
      '접속사 that 뒤에는 **빠진 자리가 없다.** 빠진 자리가 있으면 접속사가 아니라 관계대명사다.',
    detail:
      '같은 that 인데 몫이 둘이다. 접속사 that 은 절 통째를 명사로 만들고, 관계대명사 that 은 ' +
      '앞의 명사를 꾸미면서 뒤 절의 한 자리를 메운다.\n\n' +
      '그래서 잣대가 뚜렷하다. **뒤 절이 온전하면 접속사, 한 자리가 비면 관계대명사**다.',
    groups: [
      {
        name: '온전한 절이면 접속사',
        note: '주어도 목적어도 다 있다. 절 통째가 명사 노릇을 한다.',
        examples: [
          {
            en: 'Jamie learned from the book that World War I had broken out in 1914.',
            ko: '제이미는 제1차 세계대전이 1914년에 일어났다는 것을 그 책에서 알게 되었다. (뒤 절에 빈자리가 없다)',
          },
          {
            en: "Lang and her team discovered that the mako shark's scales differ in size and in flexibility in different parts of its body.",
            ko: '랭과 그의 연구진은 청상아리의 비늘이 몸의 부위마다 크기와 유연성에서 다르다는 것을 알아냈다.',
          },
        ],
      },
      {
        name: '한 자리가 비면 관계대명사',
        note: '앞에 꾸밀 명사가 있고, 뒤 절에서 그 명사가 메울 자리가 비어 있다.',
        examples: [
          {
            en: 'Lang feels that shark scales can inspire designs for machines that experience drag, such as airplanes.',
            ko: '랭은 상어 비늘이 비행기처럼 항력을 겪는 기계의 설계에 실마리를 줄 수 있다고 여긴다. (앞 that 은 접속사, 뒤 that 은 관계대명사)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**what 과도 갈린다.** 뒤 절이 완전하면 that, 빠진 자리가 있고 앞에 선행사도 없으면 ' +
        'what 이다. 보어 자리에서 특히 헷갈린다.',
      contrasts: [
        {
          wrong: 'One reason for upsets in sports is what the superior team may not have perceived their opponents as threatening.',
          right: 'One reason for upsets in sports is that the superior team may not have perceived their opponents as threatening.',
          why: '뒤 절에 빠진 자리가 없다. 완전한 절을 이끄는 것은 that 이다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-partcl',
    focus: '생략된 주어는 주절의 주어',
    title: '생략된 주어는 주절의 주어',
    summary:
      '분사 앞에 주어가 없으면 그 주어는 **주절의 주어**다. 같을 때만 지울 수 있다.',
    detail:
      '분사구문을 읽을 때 할 일은 하나다. 주절의 주어를 분사 앞에 넣어 본다. 말이 되면 ' +
      '제대로 된 문장이다.\n\n' +
      '그 주어가 분사의 **방향**도 정한다. 주어가 하는 쪽이면 -ing, 당하는 쪽이면 p.p. 다.',
    groups: [
      {
        name: '넣어 읽어 확인한다',
        note: '분사 바로 앞의 명사가 아니라 주절의 주어를 넣는다.',
        examples: [
          {
            en: 'Having drunk three cups of coffee, she can’t fall asleep.',
            ko: '커피를 세 잔 마셨기 때문에 그녀는 잠을 이루지 못한다. (마신 것도 그녀)',
          },
          {
            en: 'Currently, deforestation is a global problem, affecting wilderness regions such as the temperate rainforests of the Pacific.',
            ko: '현재 삼림 파괴는 태평양의 온대 우림 같은 야생 지역에 영향을 미치는 전 지구적 문제다. (영향을 미치는 것은 바로 앞의 problem 이 아니라 deforestation)',
          },
        ],
      },
      {
        name: '주어가 방향도 정한다',
        note: '주절의 주어가 당하는 쪽이면 과거분사로 시작한다.',
        examples: [
          {
            en: 'Impressed with the colored scarves that they wore around their necks, the king decided to honor the Croats by creating a military regiment called the Royal Cravattes.',
            ko: '그들이 목에 두르던 색색의 스카프에 감탄해, 왕은 루아얄 크라바트라 불리는 군 연대를 만들어 크로아티아인들을 기리기로 했다. (왕이 감탄을 받는 쪽이라 Impressed)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '주어가 **다른데도 지우면** 문장이 어긋난다. 그때는 지우지 말고 분사 앞에 남겨 적는다.',
      contrasts: [
        {
          wrong: 'Being cold outside, I boiled some water to have tea.',
          right: 'It being cold outside, I boiled some water to have tea.',
          why: '추운 것은 날씨이고 물을 끓인 것은 나다. 주어가 다르니 It 을 남긴다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'vb-partcl',
    focus: '완료분사구문 Having p.p.',
    title: '완료분사구문 Having p.p. — 주절보다 앞선 일',
    summary:
      '분사구문의 일이 **주절보다 먼저** 일어났으면 Having p.p. 로 한 걸음 물린다.',
    detail:
      '같은 때에 벌어지는 일이면 그냥 -ing 다. 시간차가 있을 때만 Having p.p. 를 쓴다.\n\n' +
      '수동이면 Having been p.p. 가 된다. 겹쳐 보이지만 having(앞선 때) + been p.p.(당하는 쪽) ' +
      '두 뜻이 합쳐진 것이다.',
    groups: [
      {
        name: '시간차가 있을 때만',
        note: '지난 일이 지금의 상태를 낳았다는 결이 담긴다.',
        examples: [
          {
            en: 'Having drunk three cups of coffee, she can’t fall asleep.',
            ko: '커피를 세 잔 마셨기 때문에 그녀는 잠을 이루지 못한다. (마신 것이 앞, 못 자는 것이 지금)',
          },
          {
            en: 'Having grown up amid the Great Recession and the pandemic, they are cynical and it is coloring their view of work.',
            ko: '대침체와 팬데믹 한복판에서 자랐기 때문에 그들은 냉소적이고, 그것이 일에 대한 시각을 물들이고 있다.',
          },
        ],
      },
      {
        name: '수동이면 Having been p.p.',
        note: '앞선 때와 당하는 쪽이 겹친 꼴이다. 통째로 눈에 익혀 둔다.',
        examples: [
          {
            en: 'Having been abroad for ten years, he can speak English very fluently.',
            ko: '십 년 동안 외국에 있었기에 그는 영어를 아주 유창하게 한다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '시간차가 없는데 Having p.p. 를 쓰면 어색하다. **두 일이 같은 때면 그냥 -ing** 다.',
    },
  },

  {
    level: 'focus',
    unitId: 'vb-partcl',
    focus: '독립분사구문',
    title: '독립분사구문 — 주어가 달라 남겨 적는다',
    summary:
      '분사의 주어가 주절과 **다르면 지우지 못한다.** 분사 앞에 그 주어를 남긴다.',
    detail:
      '주어를 지울 수 있는 조건은 하나뿐이다 — 주절의 주어와 같을 때다. 다르면 남긴다.\n\n' +
      '남긴 주어는 분사 바로 앞에 온다. 「명사 + 분사」가 문장 앞이나 콤마 뒤에 잇달아 나오면 ' +
      '독립분사구문이라고 보면 된다.',
    groups: [
      {
        name: '남긴 주어가 분사의 임자',
        note: '주절의 주어와 다른 것을 눈으로 확인하고 읽는다.',
        examples: [
          {
            en: 'All things considered, she is the best-qualified person for the position.',
            ko: '모든 점을 고려하면 그녀가 그 자리에 가장 알맞은 사람이다. (고려되는 것은 things, 적임인 것은 she)',
          },
          {
            en: 'Men tend to have a more limited range of subjects, the most popular being work, sports, jokes, cars, and women.',
            ko: '남성은 주제의 폭이 더 좁은 편인데, 가장 흔한 것은 일·스포츠·농담·자동차·여성이다. (분사의 주어는 the most popular)',
          },
        ],
      },
      {
        name: '굳은 표현으로 자주 나온다',
        items: ['All things considered', 'That being the case', 'Weather permitting', 'Other things being equal'],
        note: '통째로 눈에 익혀 두면 문장 앞머리에서 바로 알아본다.',
        examples: [
          {
            en: 'That being the case, it’s a good idea to consider what short-term goals we can accomplish that will eventually lead to accomplishing long-term goals.',
            ko: '사정이 그러하므로, 결국 장기 목표를 이루는 데로 이어질 단기 목표가 무엇인지 헤아려 보는 것이 좋다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**주어를 밝히는 말과 굳은 부사구는 다르다.** Generally speaking · Frankly speaking 처럼 ' +
        '말하는 이를 가리키는 것은 주어를 따지지 않는 굳은 표현이다.',
    },
  },

  {
    level: 'focus',
    unitId: 'vb-partcl',
    focus: '동시 상황 · 연속 동작',
    title: '동시 상황 · 연속 동작 — 같은 때이거나 잇달아',
    summary:
      '주절과 **같은 때**에 벌어지는 일이거나, 주절에 **잇달아** 일어나는 일을 덧붙인다.',
    detail:
      '문장 끝에 콤마와 함께 붙는 -ing 는 대개 이 자리다. 「~하면서」로 옮기면 동시 상황, ' +
      '「그리고 ~했다」로 옮기면 연속 동작이다.\n\n' +
      '어느 쪽이든 시간차가 없으므로 Having p.p. 로 물리지 않는다.',
    groups: [
      {
        name: '문장 끝에 붙어 곁들인다',
        note: '앞 절을 하면서 함께 벌어지는 일이거나, 그 결과로 이어지는 일이다.',
        examples: [
          {
            en: 'You get up in the morning with a bad headache or an attack of depression, yet you face the day and cope with other people, pretending that nothing is wrong.',
            ko: '아침에 심한 두통이나 우울감에 시달리며 일어나지만, 그런데도 그날을 마주하고 아무 일 없는 척하며 다른 사람들을 견뎌 낸다. (~하면서)',
          },
          {
            en: 'Currently, deforestation is a global problem, affecting wilderness regions such as the temperate rainforests of the Pacific.',
            ko: '현재 삼림 파괴는 태평양의 온대 우림 같은 야생 지역에 영향을 미치는 전 지구적 문제다. (그리하여 ~한다)',
          },
        ],
      },
      {
        name: '접속사를 남기기도 한다',
        note: '뜻을 또렷이 하려고 while · when 을 남긴다. 주어와 be동사만 지운 꼴이다.',
        examples: [
          {
            en: 'They watched the sunset while drinking hot tea.',
            ko: '그들은 뜨거운 차를 마시며 일몰을 보았다. (while they were drinking 에서 they were 가 지워졌다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '문장 끝의 -ing 를 **바로 앞 명사를 꾸미는 분사**로 잘못 읽기 쉽다. 콤마가 있으면 ' +
        '분사구문이고, 그 주어는 주절의 주어다.',
    },
  },

  {
    level: 'focus',
    unitId: 'vb-partcl',
    focus: 'with + 목적어 + 분사',
    title: 'with + 목적어 + 분사 — 「~한 채로」',
    summary:
      '「with + 목적어 + 분사」는 곁들이는 상황을 나타낸다. 분사의 꼴은 **목적어의 방향**이 정한다.',
    detail:
      '이 꼴에서는 with 뒤의 목적어가 분사의 주어다. 주절의 주어가 아니다. 그래서 방향도 ' +
      '그 목적어를 보고 정한다.\n\n' +
      '목적어가 하는 쪽이면 -ing, 당하는 쪽이면 p.p. 다. 분사 자리에 형용사나 전치사구가 ' +
      '오기도 한다.',
    groups: [
      {
        name: '목적어가 분사의 주어다',
        note: '한 문장 안에서 방향이 갈리기도 한다. 목적어마다 따로 본다.',
        examples: [
          {
            en: 'Designed as a serpent to coil around the wrist, with its head and tail covered with diamonds and having two hypnotic emerald eyes, a discreet mechanism opens its fierce jaws to reveal a tiny quartz watch.',
            ko: '손목을 감는 뱀 모양으로 만들어졌고 머리와 꼬리는 다이아몬드로 덮이고 최면을 거는 듯한 에메랄드 눈 두 개를 지녔는데, 눈에 띄지 않는 장치가 그 사나운 턱을 벌려 작은 쿼츠 시계를 드러낸다. (covered 는 당하는 쪽, having 은 하는 쪽)',
          },
        ],
      },
      {
        name: '분사 자리에 다른 것이 오기도 한다',
        items: ['형용사', '부사', '전치사구'],
        note: '「~한 채로」라는 뜻만 지켜지면 된다.',
        examples: [
          {
            en: 'He was standing with his arms folded.',
            ko: '그는 팔짱을 낀 채 서 있었다. (팔은 접히는 쪽이라 folded)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '방향을 정하는 것은 **주절의 주어가 아니라 with 뒤의 목적어**다. 여기서 헷갈리면 ' +
        '분사 꼴이 뒤집힌다.',
    },
  },

  {
    level: 'unit',
    unitId: 'sp-if',
    title: '가정법 — 시제를 한 걸음 물린다',
    summary:
      '사실이 아닌 일을 그려 볼 때 쓴다. **실제보다 시제를 한 걸음 물려** 그것이 사실이 아님을 알린다.',
    detail:
      '지금 사실이 아닌 일은 **과거**로, 지난날 사실이 아니었던 일은 **과거완료**로 적는다. ' +
      '시제가 물러선 것 자체가 「이건 사실이 아니다」라는 표시다.\n\n' +
      'if 를 지우고 주어와 (조)동사를 뒤집기도 한다. Had I known ~ 처럼 문장이 시작하면 ' +
      'if 가 지워졌다고 보면 된다.',
    groups: [
      {
        name: '두 꼴',
        items: [
          '가정법 과거 — If + 과거, 주어 + would 원형',
          '가정법 과거완료 — If + had p.p., 주어 + would have p.p.',
        ],
        note: '앞은 지금 사실이 아닌 일, 뒤는 지난날 사실이 아니었던 일이다.',
        examples: [
          {
            en: "If you wanted to read the government papers, or letters written by Korean War soldiers, you'd go to an archive.",
            ko: '정부 문서나 한국전쟁 군인들이 쓴 편지를 읽고 싶다면 기록보관소에 갈 것이다. (지금을 그려 보는 자리)',
          },
        ],
      },
      {
        name: 'if 를 지우면 뒤집는다',
        note: 'if 를 지우고 (조)동사를 주어 앞으로 보낸다. Were · Had · Should 로 문장이 열린다.',
        examples: [
          {
            en: 'Had I given up the project at that time, I should not have achieved such a splendid result.',
            ko: '그때 그 일을 그만두었다면 그렇게 훌륭한 성과를 얻지 못했을 것이다. (If I had given up 에서 if 가 지워졌다)',
            source: 'written',
          },
        ],
      },
      {
        name: 'as if · as though — 「마치 ~인 것처럼」',
        note: '이 뒤에서도 시제를 한 걸음 물린다. 지금 일이면 과거, 앞선 일이면 과거완료다.',
        examples: [
          {
            en: 'Two to eight months of not exercising at all will reduce your fitness level to as if you never exercised before.',
            ko: '두 달에서 여덟 달 동안 전혀 운동하지 않으면 체력이 마치 한 번도 운동한 적 없는 수준으로 떨어진다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '가정법에서는 **뜻의 앞뒤가 맞는지**부터 본다. 조건이 부정이면 결과도 그에 맞아야 한다. ' +
        '시험이 부정 하나를 빼 두는 자리다.',
      contrasts: [
        {
          wrong: 'Had I given up the project at that time, I should have achieved such a splendid result.',
          right: 'Had I given up the project at that time, I should not have achieved such a splendid result.',
          why: '그만두었다면 성과가 없었을 것이다. 부정이 빠지면 뜻이 거꾸로 된다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sk-svoc',
    focus: '목적격보어가 형용사·명사',
    title: '목적격보어가 형용사 · 명사 — 「~을 …하게 · …라고」',
    summary:
      '목적어의 **상태**를 말하면 형용사, 목적어를 **다른 이름으로 부르면** 명사가 온다.',
    detail:
      'make it easier 는 「그것을 더 쉽게 만든다」, call it anomie 는 「그것을 아노미라고 ' +
      '부른다」다. 둘 다 목적어와 보어 사이에 「목적어 = 보어」 관계가 있다.\n\n' +
      '흔한 흠은 **부사를 넣는 것**이다. 보어는 목적어를 설명하는 자리라 형용사가 온다.',
    groups: [
      {
        name: '형용사가 오는 동사',
        items: ['make', 'find', 'keep', 'leave', 'consider', 'think'],
        note: '「~을 …한 상태로」라는 뜻이 공통이다.',
        examples: [
          {
            en: 'We will make recycling easier',
            ko: '우리는 재활용을 더 쉽게 만들 것이다.',
          },
          {
            en: 'The student who finds the state-of-the-art approach intimidating learns less than he or she might have learned by the old methods.',
            ko: '최신 방식을 주눅 들게 한다고 느끼는 학생은, 옛 방법으로 배웠을 것보다 더 적게 배운다. (find A B — B가 형용사)',
          },
        ],
      },
      {
        name: '명사가 오는 동사',
        items: ['call', 'name', 'elect', 'appoint', 'consider'],
        note: '목적어를 다른 이름으로 부르는 자리다. 전치사를 붙이지 않는다.',
        examples: [
          {
            en: 'The French sociologist Emile Durkheim called this sense of disorientation and meaninglessness anomie.',
            ko: '프랑스 사회학자 에밀 뒤르켐은 이 방향 상실과 무의미함의 느낌을 아노미라고 불렀다.',
          },
        ],
      },
      {
        name: '보어가 뒤로 밀려나기도 한다',
        note: '목적어가 길어지면 보어가 한참 뒤에 온다. 되돌려 붙여 읽는다.',
        examples: [
          {
            en: 'You as the organization’s leader can always make the use of those resources more efficient and effective.',
            ko: '조직의 지도자로서 당신은 그 자원의 쓰임을 언제나 더 효율적이고 효과적으로 만들 수 있다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'difficult · easy · hard 같은 **난이형용사는 사람을 목적어로 두지 못한다.** 가목적어 it 을 ' +
        '앞에 세우고 사람은 for 로 데려온다.',
      contrasts: [
        {
          wrong: 'Two factors have made scientists difficult to determine the number of species on Earth.',
          right: 'Two factors have made it difficult for scientists to determine the number of species on Earth.',
          why: '어려운 것은 과학자가 아니라 종 수를 알아내는 일이다. it 을 세우고 for 로 사람을 데려온다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sk-svoc',
    focus: '목적격보어가 분사',
    title: '목적격보어가 분사 — 방향으로 고른다',
    summary:
      '목적어가 **하는 쪽이면 -ing**, **당하는 쪽이면 p.p.** 다. 뜻이 아니라 방향이 정한다.',
    detail:
      '넣어 읽어 보면 바로 갈린다. see anyone trying 은 「누군가가 애쓰고 있다」, ' +
      'find the animal portioned out 은 「짐승이 나뉘어 있다」다.\n\n' +
      '현재분사는 **그 순간 이어지는 모습**을, 과거분사는 **이미 그렇게 된 상태**를 그린다.',
    groups: [
      {
        name: '하는 쪽이면 현재분사',
        note: '그 순간 벌어지고 있는 모습을 그린다.',
        examples: [
          {
            en: 'If they see anyone trying to cross the border, they send a report to the sheriff’s office, which follows up, sometimes with the help of the U.S. Border Patrol.',
            ko: '누군가 국경을 넘으려 하는 것을 보면 그들은 보안관 사무소로 신고를 보내고, 그러면 그곳이 때로는 미국 국경순찰대의 도움을 받아 뒤를 밟는다.',
          },
        ],
      },
      {
        name: '당하는 쪽이면 과거분사',
        note: '이미 그렇게 된 상태를 그린다.',
        examples: [
          {
            en: 'One might expect to find the animal portioned out according to the amount of work done by each hunter to obtain it.',
            ko: '그 짐승이 사냥꾼 저마다가 그것을 잡으려고 한 일의 양에 따라 나뉘어 있으리라고 기대할 법하다.',
          },
          {
            en: 'On 2 February the platform stated it had more than 1.5 million AI agents signed up to the service.',
            ko: '2월 2일에 그 플랫폼은 150만이 넘는 AI 에이전트가 서비스에 가입되어 있다고 밝혔다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**형용사로 굳은 과거분사**도 이 자리에 온다. made him suited 처럼 「~에 맞는 상태로 ' +
        '만들다」가 된다.',
      examples: [
        {
          en: 'His past experience made him suited for the project.',
          ko: '과거 경력 덕분에 그는 그 일에 알맞은 사람이 되었다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sk-svoc',
    focus: 'A as B 꼴',
    title: 'A as B 꼴 — as 를 빠뜨리면 틀린다',
    summary:
      '「A를 B로 여기다 · 보다」 무리다. 목적격보어 앞에 **as 를 반드시 넣는다.**',
    detail:
      '같은 뜻이라도 동사마다 as 를 쓰는지 아닌지가 갈린다. call 은 as 없이 바로 명사를 받지만, ' +
      'regard 는 반드시 as 를 넣는다.\n\n' +
      '수동으로 바꿔도 as 는 그대로 남는다. is regarded as ~ 처럼 뒤에 붙어 있다.',
    groups: [
      {
        name: 'as 를 쓰는 동사',
        items: ['regard', 'see', 'view', 'think of', 'look upon', 'describe', 'cast', 'imagine', 'perceive'],
        note: '「A를 B로」라는 뜻이 공통이다. as 를 빠뜨리면 틀린다.',
        examples: [
          {
            en: 'Many psychologists see the home as the most natural learning environment.',
            ko: '많은 심리학자는 가정을 가장 자연스러운 배움터로 본다.',
          },
          {
            en: 'We tend to imagine Robin Hood and outlaws in general as fugitives because they defied the king’s officials and operated outside the law in the great forests of the kingdom.',
            ko: '우리는 로빈 후드와 무법자 전반을 도망자로 떠올리는 편인데, 그들이 왕의 관리를 거스르고 왕국의 큰 숲에서 법 밖에서 움직였기 때문이다.',
          },
        ],
      },
      {
        name: '수동에서도 as 가 남는다',
        note: '목적어가 주어로 올라가도 as 구는 자리를 지킨다.',
        examples: [
          {
            en: 'Oedipus the King is regarded as the best example of classical Athenian tragedy.',
            ko: '『오이디푸스 왕』은 고전 아테네 비극의 가장 좋은 본보기로 여겨진다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'as 를 쓰는 동사와 안 쓰는 동사를 갈라 둔다. **call · name · elect** 는 as 없이 바로 ' +
        '명사를 받고, **regard · view · think of** 는 반드시 as 를 넣는다.',
      contrasts: [
        {
          wrong: 'They regard him a genius.',
          right: 'They regard him as a genius.',
          why: 'regard 는 as 와 짝이다. as 없이 명사를 바로 받지 못한다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sk-svoc',
    focus: '목적격보어가 원형부정사',
    title: '목적격보어가 원형부정사 — to 를 붙이지 않는다',
    summary:
      '**사역동사와 지각동사** 뒤에서는 to 없는 동사원형이 온다. help 는 둘 다 된다.',
    detail:
      '무리가 정해져 있다. make · have · let 과 see · hear · feel · watch · notice 다. ' +
      '이 밖의 동사는 to부정사를 받는다.\n\n' +
      '같은 뜻이라도 갈린다. **get 은 사역의 뜻인데도 to부정사**를 데려온다.',
    groups: [
      {
        name: '원형을 받는 동사',
        items: ['make', 'have', 'let', 'see', 'hear', 'feel', 'watch', 'notice'],
        note: 'get 은 이 무리에 들지 않는다. get him to do 처럼 to 를 붙인다.',
        examples: [
          {
            en: 'Nonverbal cues ― rather than spoken words ― make us feel that the person we are with is interested in, understands, and values us.',
            ko: '말이 아닌 신호가 — 입 밖에 낸 말보다 — 함께 있는 사람이 우리에게 관심을 갖고 이해하고 소중히 여긴다고 느끼게 한다.',
          },
        ],
      },
      {
        name: 'help 만은 둘 다 된다',
        note: 'to 를 붙여도 되고 빼도 된다. 요즘 글에서는 빼는 쪽이 더 흔하다.',
        examples: [
          {
            en: 'Help us live within our water means, ensuring that all residents have access to abundant, safe, clean water, no matter how much the city grows.',
            ko: '도시가 아무리 커지더라도 모든 주민이 넉넉하고 안전한 깨끗한 물을 쓸 수 있도록, 우리가 물 형편에 맞게 살도록 도와주십시오.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '지각동사 뒤에서 **원형 · 현재분사 · 과거분사**가 갈린다. 목적어가 하는 쪽이면 앞의 둘, ' +
        '당하는 쪽이면 과거분사다.',
      contrasts: [
        {
          wrong: 'As I went out for work, I saw a family moved in upstairs.',
          right: 'As I went out for work, I saw a family move in upstairs.',
          why: '가족이 스스로 이사 오는 쪽이라 원형이나 moving 이다. moved 는 당하는 쪽이라 어긋난다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-causative',
    focus: '사역동사 + 원형',
    title: '사역동사 + 원형 — make · have · let',
    summary:
      '「~에게 …하게 하다」다. 이 셋 뒤에는 **to 없는 동사원형**이 온다.',
    detail:
      '셋의 결이 조금씩 다르다. make 는 시키는 힘이 세고, have 는 그렇게 하도록 맡기는 쪽이며, ' +
      'let 은 하도록 놓아두는 쪽이다.\n\n' +
      '**get 은 뜻이 같은데도 to부정사**를 데려온다. 이 하나만 따로 외워 둔다.',
    groups: [
      {
        name: '셋 다 원형을 받는다',
        items: ['make — 시킨다', 'have — 그렇게 하도록 맡긴다', 'let — 하도록 놓아둔다'],
        note: '목적어가 스스로 하는 쪽일 때다. 당하는 쪽이면 과거분사로 바꾼다.',
        examples: [
          {
            en: 'He had the students phone strangers and ask them to donate money.',
            ko: '그는 학생들에게 모르는 사람에게 전화를 걸어 성금을 부탁하도록 시켰다. (phone — 원형)',
          },
          {
            en: 'Please let me know the result as soon as possible.',
            ko: '가능한 한 빨리 결과를 알려 주세요.',
          },
        ],
      },
      {
        name: 'get 만 to부정사',
        note: '뜻은 같은 무리인데 꼴이 다르다. get him to do 라고 쓴다.',
        examples: [
          {
            en: 'I got him to fix my car.',
            ko: '나는 그에게 내 차를 고치게 했다. (get 은 to 를 붙인다)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**수동이 되면 to 가 되살아난다.** make 를 수동으로 쓰면 be made to do 다. let 은 ' +
        '수동으로 잘 쓰지 않고 be allowed to 로 바꿔 쓴다.',
      contrasts: [
        {
          wrong: 'He was made work overtime.',
          right: 'He was made to work overtime.',
          why: '능동은 They made him work 다. 수동에서는 지워졌던 to 를 되살린다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-causative',
    focus: 'help + (to) 원형',
    title: 'help + (to) 원형 — 둘 다 된다',
    summary:
      'help 는 목적격보어로 **원형과 to부정사를 모두** 받는다. 어느 쪽도 틀리지 않는다.',
    detail:
      '요즘 글에서는 to 를 빼는 쪽이 더 흔하다. 기출에서도 대부분 원형이다.\n\n' +
      '목적어를 두지 않고 바로 이어 쓰기도 한다. help promote ~ 처럼 「~하는 데 도움이 되다」라는 ' +
      '뜻이 된다.',
    groups: [
      {
        name: '목적어 뒤에 원형',
        note: 'to 를 넣어도 되지만 기출에서는 대개 빼고 쓴다.',
        examples: [
          {
            en: 'These daily updates were designed to help readers keep abreast of the markets as the government attempted to keep them under control.',
            ko: '이 날마다의 소식은 정부가 시장을 통제하려 애쓰는 가운데 독자들이 시장 흐름을 따라가도록 돕기 위해 만들어졌다.',
          },
          {
            en: 'If you want to make a complaint about a consular service you have received, we want to help you resolve it as quickly as possible.',
            ko: '받으신 영사 업무에 불만을 제기하고자 하신다면, 저희는 될 수 있는 한 빨리 그것을 푸시도록 돕고자 합니다.',
          },
        ],
      },
      {
        name: '목적어 없이 바로 원형',
        note: '「~하는 데 도움이 되다」라는 뜻이 된다. 누가 하는지는 굳이 밝히지 않는다.',
        examples: [
          {
            en: 'The researchers noted that listening to music while driving helps relieve the stress that affects heart health.',
            ko: '연구자들은 운전하면서 음악을 듣는 것이 심장 건강에 영향을 주는 스트레스를 더는 데 도움이 된다고 밝혔다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'help 뒤에 **-ing 는 오지 못한다.** 원형이나 to부정사 둘 중 하나다.',
      contrasts: [
        {
          wrong: 'She helped me carrying the box.',
          right: 'She helped me carry the box.',
          why: 'help 는 원형이나 to부정사를 받는다. -ing 는 이 자리에 오지 못한다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-causative',
    focus: '사역동사 + 과거분사',
    title: '사역동사 + 과거분사 — 목적어가 당하는 쪽',
    summary:
      '목적어가 **당하는 쪽**이면 원형이 아니라 과거분사를 쓴다. 「~을 …되게 하다」다.',
    detail:
      'have my hair cut 은 「머리를 자르게 하다」다. 자르는 것은 내가 아니라 미용사이고, 머리는 ' +
      '잘리는 쪽이다.\n\n' +
      '두 가지 뜻으로 쓰인다. 하나는 **남에게 시켜서** 그렇게 하는 것, 다른 하나는 **뜻하지 않게** ' +
      '그런 일을 당하는 것이다.',
    groups: [
      {
        name: '남에게 시켜서 그렇게 한다',
        note: '가장 흔한 뜻이다. 하는 사람은 굳이 밝히지 않는다.',
        examples: [
          {
            en: 'The police authorities had the woman arrested for attacking her neighbor.',
            ko: '경찰 당국은 이웃을 공격한 일로 그 여성을 체포하도록 했다. (여성은 체포되는 쪽)',
          },
          {
            en: 'If you see active signs and you wish to have the property treated, we will ask you to sign a Release of Liability form for us to service your property.',
            ko: '활동 흔적을 보았고 그 부지를 처리받기를 바란다면, 저희는 부지를 처리할 수 있도록 책임 면제 동의서에 서명해 달라고 요청드립니다.',
          },
        ],
      },
      {
        name: 'get 도 같은 꼴이 된다',
        note: 'get 은 원형을 못 받지만 과거분사는 받는다. have 와 뜻이 거의 같다.',
        examples: [
          {
            en: 'I got my car repaired yesterday.',
            ko: '나는 어제 차를 고쳤다. (내가 고친 것이 아니라 고치게 했다)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**원형으로 두면 방향이 뒤집힌다.** 목적어가 스스로 하는 쪽인지 당하는 쪽인지 먼저 본다. ' +
        '시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'A woman with the tip of a pencil stuck in her head has finally had it remove.',
          right: 'A woman with the tip of a pencil stuck in her head has finally had it removed.',
          why: '연필 끝은 제거되는 쪽이다. 당하는 쪽이라 과거분사다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-causative',
    focus: '지각동사 + 원형·분사',
    title: '지각동사 + 원형 · 분사 — 무엇을 보았나',
    summary:
      '**원형이면 처음부터 끝까지**, **현재분사면 그 순간의 장면**이다. 당하는 쪽이면 과거분사다.',
    detail:
      'see him cross the street 는 다 건너는 것을 본 것이고, see him crossing 은 건너는 중인 ' +
      '모습을 본 것이다. 둘 다 옳지만 그림이 다르다.\n\n' +
      '목적어가 당하는 쪽이면 과거분사다. see the window broken 은 「창이 깨져 있는 것을 보다」다.',
    groups: [
      {
        name: '세 가지 꼴',
        items: ['원형 — 처음부터 끝까지', '현재분사 — 그 순간의 장면', '과거분사 — 당하는 쪽'],
        note: '앞의 둘은 목적어가 하는 쪽, 마지막은 당하는 쪽이다.',
        examples: [
          {
            en: "The spoiled boy made it believe he didn't hear his father calling.",
            ko: '버릇없는 그 소년은 아버지가 부르는 것을 못 들은 체했다. (calling — 부르고 있는 장면)',
          },
        ],
      },
      {
        name: '수동이 되면 to 가 되살아난다',
        note: '사역동사와 같다. 원형 그대로 두면 틀린다.',
        examples: [
          {
            en: 'She was seen to enter the building.',
            ko: '그녀가 건물에 들어가는 것이 목격되었다. (was seen entering 으로도 쓴다)',
            source: 'written',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '「~인 체하다」는 **make believe** 이지 make it believe 가 아니다. 시험이 흠으로 고른 ' +
        '자리다.',
      contrasts: [
        {
          wrong: "The spoiled boy made it believe he didn't hear his father calling.",
          right: "The spoiled boy made believe he didn't hear his father calling.",
          why: 'make believe 가 통째로 「~인 체하다」다. 사이에 it 이 들어가지 않는다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-rel',
    focus: '목적격 관계대명사',
    title: '목적격 관계대명사 — 뒤에 목적어가 없다',
    summary:
      '뒤 절에서 **목적어 자리가 비어 있으면** 목적격이다. 지울 수 있는 것도 이 격뿐이다.',
    detail:
      '찾는 법은 하나다. 관계사 뒤의 동사를 보고 「무엇을?」이라고 물어본다. 답할 말이 절 안에 ' +
      '없으면 그 자리가 비어 있는 것이다.\n\n' +
      '**전치사의 목적어**일 때도 있다. 그때는 전치사가 절 끝에 덩그러니 남는다.',
    groups: [
      {
        name: '동사의 목적어가 비어 있다',
        note: '「동사 + 목적어 없음」이 보이면 목적격이다.',
        examples: [
          {
            en: "So next week they're unveiling a gigantic, twisting, dragon-shaped slide that shoppers can use to drop from fifth-floor luxury boutiques to first-floor luxury boutiques in death-defying seconds.",
            ko: '그래서 다음 주에 그들은, 쇼핑객이 아찔한 몇 초 만에 5층 명품 매장에서 1층 매장으로 내려가는 데 쓸 수 있는 거대하게 뒤틀린 용 모양 미끄럼틀을 선보인다. (use 의 목적어가 비었다)',
          },
          {
            en: 'Through the same kind of dedicated practice, people who are not born with such advantages can develop talents that nature put a little farther from their reach.',
            ko: '그와 같은 헌신적인 연습으로, 그런 이점을 타고나지 못한 사람도 자연이 손 닿는 곳에서 조금 더 멀리 놓아둔 재능을 길러 낼 수 있다. (put 의 목적어가 비었다)',
          },
        ],
      },
      {
        name: '전치사의 목적어가 비어 있다',
        note: '전치사가 절 끝에 남는다. 그것이 빈자리의 표시다.',
        examples: [
          {
            en: "B: Let's go to a place that neither of us has been to.",
            ko: '우리 둘 다 가 본 적 없는 곳으로 가자. (has been to 의 to 뒤가 비었다)',
          },
        ],
      },
      {
        name: '최상급 · the only 뒤에는 that 을 즐겨 쓴다',
        note: 'which 보다 that 이 자연스럽다. 목적격이라 지울 수도 있다.',
        examples: [
          {
            en: 'Many of them graduated from college into one of the worst labor markets the United States has ever seen, with a staggering load of student debt to boot.',
            ko: '그들 가운데 많은 수가 미국이 이제껏 본 가장 나쁜 노동시장 가운데 하나로 졸업해 나왔고, 게다가 어마어마한 학자금 빚까지 지고 있었다. (that 이 지워졌다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '뒤 동사가 **자동사면 애초에 목적어 자리가 없다.** 그때는 전치사가 있어야 빈자리가 ' +
        '생긴다.',
      contrasts: [
        {
          wrong: 'The bed which he slept last night was quite comfortable.',
          right: 'The bed which he slept in last night was quite comfortable.',
          why: 'sleep 은 자동사라 목적어를 받지 못한다. in 이 있어야 빈자리가 생긴다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-rel',
    focus: '관계대명사 생략',
    title: '관계대명사 생략 — 「명사 + 주어 + 동사」가 표시',
    summary:
      '**목적격일 때만** 지운다. 지운 자리에는 「명사 + 주어 + 동사」가 잇달아 남는다.',
    detail:
      '명사 뒤에 갑자기 새 주어와 동사가 나오면 관계대명사가 지워진 것이다. 이것이 읽기의 ' +
      '가장 큰 걸림돌인데, 표시를 알아 두면 걸리지 않는다.\n\n' +
      '「주격 관계대명사 + be동사」도 함께 지운다. 그러면 분사구나 형용사구만 남아 뒤에서 ' +
      '명사를 꾸민다.',
    groups: [
      {
        name: '「명사 + 주어 + 동사」를 찾는다',
        note: '명사 뒤에 새 주어가 나오면 그 사이에 관계사가 지워졌다.',
        examples: [
          {
            en: 'Sadly, only seven of the 123 tragedies he wrote have survived, but of these perhaps the finest is Oedipus the King.',
            ko: '안타깝게도 그가 쓴 123편의 비극 가운데 일곱 편만 살아남았는데, 그중 아마 가장 뛰어난 것이 『오이디푸스 왕』이다.',
          },
          {
            en: 'The new teacher I told you about is originally from Peru.',
            ko: '제가 말씀드렸던 새 선생님은 원래 페루 출신입니다. (about 이 절 끝에 남았다)',
          },
        ],
      },
      {
        name: '주어와 동사가 멀어진다',
        note: '지워진 관계절이 주어와 동사 사이에 끼면 그 둘이 아주 멀어진다.',
        examples: [
          {
            en: 'Regardless of the loaded aesthetic, philological, moral, confessional, and philosophical origins of the term Middle Ages, the period it defines is important because it witnessed the emergence of a distinctive European civilization',
            ko: '「중세」라는 말이 지닌 온갖 유래가 어떠하든, 그 말이 가리키는 시대는 독특한 유럽 문명의 출현을 목격했기에 중요하다. (the period 와 is 사이에 it defines 가 끼었다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**주격은 지우지 못한다.** 지우면 동사가 둘 잇달아 나와 문장이 무너진다. 다만 ' +
        '「주격 + be동사」는 함께 지울 수 있다.',
      examples: [
        {
          en: 'A recent World Bank study entitled "Growth Is Good for the Poor" reveals a one-for-one relationship between income of the bottom fifth and per capita GDP.',
          ko: '「성장은 가난한 이에게 좋다」라는 제목이 붙은 최근 세계은행 연구는 하위 5분의 1의 소득과 1인당 GDP 사이의 일대일 관계를 드러낸다. (which was 가 함께 지워졌다)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'ln-rel',
    focus: '소유격 whose',
    title: '소유격 whose — 뒤에 명사가 바로 붙는다',
    summary:
      '**whose 뒤에는 명사가 관사 없이 바로 붙는다.** 「그 사람의 · 그것의」라는 뜻이다.',
    detail:
      '다른 격과 가르는 표시가 뚜렷하다. 주격 · 목적격 뒤에는 주어나 동사가 오지만, 소유격 뒤에는 ' +
      '**명사**가 온다.\n\n' +
      '사람에게도 사물에게도 쓴다. 사물에는 of which 로 바꿔 쓸 수 있지만 whose 쪽이 훨씬 간결하다.',
    groups: [
      {
        name: '「whose + 명사」가 한 덩이',
        note: '그 명사가 뒤 절에서 주어나 목적어 노릇을 한다. 관사를 붙이지 않는다.',
        examples: [
          {
            en: 'We drove on to the hotel, from whose balcony we could look down at the town.',
            ko: '우리는 호텔까지 차를 몰았는데, 그 발코니에서 마을을 내려다볼 수 있었다. (whose balcony 가 한 덩이)',
          },
        ],
      },
      {
        name: '전치사를 앞에 둘 수 있다',
        note: '「전치사 + whose + 명사」로 통째로 앞에 나온다.',
      },
    ],
    pitfall: {
      text:
        '뒤에 명사가 바로 붙으면 **who 가 아니라 whose** 다. 시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: "I'm sad that the people who daughter I look after are moving away.",
          right: "I'm sad that the people whose daughter I look after are moving away.",
          why: '뒤에 daughter 라는 명사가 바로 붙었다. 소유의 뜻을 담은 whose 자리다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'sp-it',
    title: '가주어 · 가목적어 it — 무거운 것을 뒤로 보낸다',
    summary:
      '주어나 목적어가 길면 그 자리에 it 을 세우고 **진짜는 뒤로 보낸다.** it 자체는 아무 뜻이 없다.',
    detail:
      '영어는 무거운 것을 뒤에 두려 한다. to부정사나 that절이 주어 자리에 오면 문장 앞머리가 ' +
      '무거워지므로, it 을 대신 세우고 본체를 뒤로 옮긴다.\n\n' +
      '목적어 자리에서도 같다. 특히 「동사 + 목적어 + 보어」 꼴에서는 목적어가 길면 **반드시** ' +
      'it 을 먼저 놓고 뒤로 보낸다.',
    groups: [
      {
        name: '가주어 — 진짜 주어는 뒤에 있다',
        items: ['It ~ to부정사', 'It ~ that절'],
        note: 'to부정사를 하는 쪽이 문장의 주어와 다르면 for + 목적격을 앞에 둔다.',
        examples: [
          {
            en: 'It is by no means easy for us to learn English in a short time.',
            ko: '우리가 짧은 시간에 영어를 익히기란 결코 쉽지 않다. (진주어는 to learn ~)',
          },
          {
            en: 'Still, it is important to note that Lamarck proposed that evolution occurs when organisms adapt to their environments.',
            ko: '그래도 라마르크가 생물이 환경에 적응할 때 진화가 일어난다고 주장했음을 짚어 두는 것이 중요하다.',
          },
        ],
      },
      {
        name: '가목적어 — make · find · think 뒤',
        note: '목적어가 길고 뒤에 보어가 오면 it 을 먼저 놓는다. 이 자리에서는 지울 수 없다.',
        examples: [
          {
            en: 'Connected consumers can now zip easily across borders via the internet and social media, making it difficult for advertisers to roll out adapted campaigns in a controlled, orderly fashion.',
            ko: '연결된 소비자들이 이제 인터넷과 소셜 미디어로 국경을 손쉽게 넘나들어, 광고주가 각 나라에 맞춘 광고를 통제된 차례대로 펼치기가 어려워졌다. (진짜 목적어는 to roll out ~)',
          },
        ],
      },
      {
        name: '강조구문 It is ~ that 과 가른다',
        note: 'It is 와 that 을 지워 보라. 문장이 남으면 강조구문, 무너지면 가주어다.',
      },
    ],
    pitfall: {
      text:
        '가주어 it 이 앞에 있어도 **부가의문문은 주절의 동사와 주어를 그대로 받는다.** 뒤에 붙은 ' +
        'that절에 끌리면 안 된다.',
      contrasts: [
        {
          wrong: "It's not surprising that book stores don't carry newspapers any more, doesn't it?",
          right: "It's not surprising that book stores don't carry newspapers any more, is it?",
          why: '주절의 동사가 is 이고 주어가 It 이다. 앞이 부정이니 뒤는 긍정으로 받는다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-idiom',
    focus: 'so ~ that · such ~ that',
    title: 'so ~ that · such ~ that — 「너무 …해서 ~하다」',
    summary:
      '**so 뒤에는 형용사 · 부사**, **such 뒤에는 명사**가 온다. 뒤는 둘 다 that 절이다.',
    detail:
      '정도가 지나쳐 어떤 결과에 이르렀음을 말한다. 앞이 원인, that 뒤가 결과다.\n\n' +
      'so 뒤에 명사가 올 때가 하나 있다. **much · many 가 붙을 때**다. so much clutter 처럼 ' +
      '양을 나타내는 말이 앞에 서면 명사도 올 수 있다.',
    groups: [
      {
        name: 'so + 형용사 · 부사 + that',
        note: '정도를 나타내는 말이 so 뒤에 온다.',
        examples: [
          {
            en: 'I tried to tell my story, but my sentences and descriptive gestures got so confused that I communicated nothing more than a very convincing version of a human tornado.',
            ko: '내 이야기를 하려 애썼지만, 문장과 몸짓이 너무 뒤엉켜 아주 그럴듯한 인간 회오리바람 흉내밖에 전하지 못했다.',
          },
          {
            en: 'Worry is a complete waste of time and creates so much clutter in your mind that you cannot think clearly about anything.',
            ko: '걱정은 시간 낭비일 뿐이며 머릿속을 너무 어지럽혀 무엇도 또렷이 생각하지 못하게 만든다. (so much + 명사)',
          },
        ],
      },
      {
        name: 'such + (a) + 명사 + that',
        note: '명사가 오면 such 다. 관사는 such 뒤, 형용사 앞에 놓는다.',
        examples: [
          {
            en: 'The olive tree was such a driving force in the economies of the Ancient Greek city-states that it was believed to have been a gift of gods',
            ko: '올리브 나무는 고대 그리스 도시국가 경제에서 그토록 큰 원동력이어서, 신들의 선물이었다고 여겨졌다.',
          },
          {
            en: 'Wall Street banks had grown to such staggering sizes, and had become so central to the health of the financial system, that no rational government could ever let them fail.',
            ko: '월스트리트 은행들은 어마어마한 규모로 커졌고 금융 체계에 너무나 핵심적이 되어서, 이성적인 정부라면 어디도 그들을 무너지게 둘 수 없었다. (such 와 so 가 that 하나를 나눠 쓴다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '뒤에 that 절이 온다고 다 이 구문은 아니다. **that 절이 앞의 명사를 꾸미면** 관계절이지 ' +
        'so ~ that 이 아니다.',
      examples: [
        {
          en: 'A: I’m so nervous about this speech that I must give today. B: The most important thing is to stay cool.',
          ko: 'A: 오늘 해야 하는 이 연설 때문에 너무 떨려. B: 가장 중요한 건 침착함을 지키는 거야. (that 절은 speech 를 꾸미는 관계절)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-idiom',
    focus: 'too ~ to · enough to',
    title: 'too ~ to · enough to — 한계를 말한다',
    summary:
      '**too 는 넘쳐서 못 하는 쪽**, **enough 는 모자라지 않아 할 수 있는 쪽**이다.',
    detail:
      'too 는 부정어가 없는데도 **부정의 뜻**이 된다. too big to fail 은 「너무 커서 무너뜨릴 수 ' +
      '없다」다.\n\n' +
      'enough 의 자리도 함께 새긴다. **형용사 · 부사 뒤**, **명사 앞**이다.',
    groups: [
      {
        name: 'too ~ to — 부정어 없이 부정',
        note: 'so ~ that 주어 cannot 으로 바꿔 쓸 수 있다.',
        examples: [
          {
            en: 'In 2007, our biggest concern was "too big to fail."',
            ko: '2007년에 우리의 가장 큰 걱정은 「너무 커서 무너뜨릴 수 없다」는 것이었다.',
          },
        ],
      },
      {
        name: 'enough to — 할 만큼은 된다',
        note: '형용사 뒤에 온다. 앞에 두면 틀린다.',
        examples: [
          {
            en: 'For high performers with potential for growth, feedback should be frequent enough to prod them into taking corrective action, but not so frequent that it is experienced as controlling and saps their initiative.',
            ko: '자랄 여지가 있는 우수한 사람에게 피드백은 바로잡을 행동을 하도록 떠밀 만큼 잦아야 하지만, 통제로 느껴져 주도성을 갉아먹을 만큼 잦아서는 안 된다. (enough to 가 하한, not so ~ that 이 상한)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**too 의 짝은 to부정사, so 의 짝은 that 절**이다. 바꿔 놓는 것이 가장 흔한 흠이다.',
      contrasts: [
        {
          wrong: 'The rings of Saturn are so distant to be seen from Earth without a telescope.',
          right: 'The rings of Saturn are too distant to be seen from Earth without a telescope.',
          why: 'to부정사와 짝을 이루는 것은 too 다. so 는 that 절을 데려온다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-idiom',
    focus: '부정 표현 대체',
    title: '부정 표현 대체 — not 없이 부정한다',
    summary:
      'not 이 없는데 부정의 뜻이 되는 자리가 있다. **꼴 자체가 부정을 품고** 있기 때문이다.',
    detail:
      '읽을 때 놓치면 뜻이 거꾸로 된다. too ~ to 는 「못 한다」, have yet to 는 「아직 안 했다」, ' +
      'far from 은 「결코 아니다」다.\n\n' +
      '반대로 **부정어가 있는데 뜻이 강한 긍정**이 되는 것도 있다. cannot ~ too 가 그렇다.',
    groups: [
      {
        name: '부정어 없이 부정하는 꼴',
        items: [
          'too ~ to — 너무 …해서 ~못 한다',
          'have yet to — 아직 ~하지 못했다',
          'far from — 결코 ~이 아니다',
          'the last ~ to — 가장 ~할 것 같지 않은',
          'fail to — ~하지 못하다',
        ],
        note: '겉에 not 이 없으니 그냥 지나치기 쉽다. 뜻을 뒤집어 읽는다.',
        examples: [
          {
            en: 'Recognizing the biological status of this multitude requires a clear understanding of what constitutes a species, which is no easy task given that evolutionary biologists have yet to agree on a universally acceptable definition.',
            ko: '이 수많은 것들의 생물학적 지위를 가려내는 일은 무엇이 하나의 종을 이루는지에 대한 또렷한 이해를 요구하는데, 진화생물학자들이 누구나 받아들일 정의에 아직 합의하지 못했음을 생각하면 쉬운 일이 아니다.',
          },
        ],
      },
      {
        name: 'no 를 명사 쪽에 붙인다',
        note: 'not ~ any 와 뜻이 같지만 no 쪽이 더 세다.',
        examples: [
          {
            en: 'Urban agriculture (UA) has long been dismissed as a fringe activity that has no place in cities; however, its potential is beginning to be realized.',
            ko: '도시 농업은 오랫동안 도시에 설 자리가 없는 주변적인 활동으로 치부되어 왔다. 그러나 그 가능성이 이제 인정받기 시작하고 있다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**부정어가 둘이면 서로 지운다.** not ~ nothing 처럼 겹쳐 쓰면 긍정이 되거나 어색해진다. ' +
        '부정어 하나에 any 를 짝지어 쓴다.',
    },
  },

  {
    level: 'focus',
    unitId: 'sp-it',
    focus: '가주어 it — 진주어 to부정사',
    title: '가주어 it — 진주어는 뒤의 to부정사',
    summary:
      '주어가 길면 그 자리에 it 을 세우고 **to부정사구를 뒤로** 보낸다. it 자체는 아무 뜻이 없다.',
    detail:
      '「It is + 형용사 + to부정사」가 가장 흔한 꼴이다. 하는 쪽을 밝혀야 하면 **for + 목적격**을 ' +
      'to 앞에 둔다.\n\n' +
      '읽는 법은 하나다. **it 을 지우고 뒤의 to부정사구를 앞으로 옮겨** 읽으면 원래 문장이 된다.',
    groups: [
      {
        name: 'It is + 형용사 + to부정사',
        note: '가장 흔한 꼴이다. 형용사가 그 일의 성질을 말한다.',
        examples: [
          {
            en: 'It is by no means easy for us to learn English in a short time.',
            ko: '우리가 짧은 시간에 영어를 익히기란 결코 쉽지 않다. (for us 가 하는 쪽)',
          },
          {
            en: 'You can imagine how having a child might change your interests and priorities, so for marketing purposes, it’s useful to split this generation into Gen Y.1 and Gen Y.2.',
            ko: '아이를 갖는 일이 관심사와 우선순위를 어떻게 바꿀 수 있는지 떠올려 볼 수 있다. 그래서 마케팅에서는 이 세대를 Y.1과 Y.2로 가르는 것이 쓸모 있다.',
          },
        ],
      },
      {
        name: '진주어가 둘일 때도 있다',
        note: 'and · or 로 이은 to부정사 둘 모두를 it 이 대신한다. 뒤쪽 to 는 흔히 지운다.',
        examples: [
          {
            en: 'For example, it is very difficult to own land or get a loan if you do not have a house―which, if you are young and only just starting your career, is often not yet possible.',
            ko: '예를 들어 집이 없으면 땅을 갖거나 대출을 받기가 매우 어렵다 — 그런데 집을 갖는 것은 젊고 이제 막 경력을 시작하는 참이라면 흔히 아직 가능하지 않다.',
          },
        ],
      },
      {
        name: '절 안에 다시 들어가기도 한다',
        note: 'that 절 안에서 또 한 번 가주어 구문이 쓰인다.',
        examples: [
          {
            en: 'I assume that the cream is good for your skin, but I don’t think that it is possible to get rid of wrinkles or magically look younger by using a cream.',
            ko: '그 크림이 피부에 좋다고는 여기지만, 크림으로 주름을 없애거나 마법처럼 더 젊어 보이는 것이 가능하다고는 생각하지 않는다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**강조구문과 가른다.** It is 와 that 을 지웠을 때 문장이 남으면 강조구문, 무너지면 ' +
        '가주어다.',
    },
  },

  {
    level: 'focus',
    unitId: 'sp-it',
    focus: '가목적어 it',
    title: '가목적어 it — 목적어를 뒤로 보낸다',
    summary:
      '「동사 + 목적어 + 보어」에서 목적어가 길면 **it 을 먼저 놓고** 진짜 목적어를 뒤로 보낸다.',
    detail:
      '이 자리에서는 it 을 **지울 수 없다.** 지우면 보어가 어디에 걸리는지 알 수 없어진다.\n\n' +
      'make · find · think · consider 뒤에서 흔하다. 통째로 「~하는 것을 …하다고 여기다」로 ' +
      '읽는다.',
    groups: [
      {
        name: 'make · find · think · consider 뒤',
        note: '보어가 사이에 끼고 진짜 목적어가 그 뒤에 온다.',
        examples: [
          {
            en: 'He found it exciting to work here.',
            ko: '그는 이곳에서 일하는 것이 흥미롭다는 것을 알았다. (진짜 목적어는 to work here)',
          },
          {
            en: 'On the other hand, it also means that they sometimes find it hard to concentrate when several things have to be discussed at the same time in a meeting.',
            ko: '반면에 그것은, 회의에서 여러 가지를 한꺼번에 논의해야 할 때 그들이 때로 집중하기 어려워한다는 뜻이기도 하다.',
          },
        ],
      },
      {
        name: '보어가 명사일 때도 있다',
        note: 'make it a rule to do 처럼 굳은 표현으로도 쓴다.',
        examples: [
          {
            en: 'I made it a rule to call him two or three times a month.',
            ko: '나는 한 달에 두세 번 그에게 전화하기로 정해 두었다.',
          },
        ],
      },
      {
        name: '하는 쪽은 for 로 데려온다',
        note: '진짜 목적어를 하는 쪽이 다르면 to 앞에 for + 목적격을 둔다.',
        examples: [
          {
            en: 'Connected consumers can now zip easily across borders via the internet and social media, making it difficult for advertisers to roll out adapted campaigns in a controlled, orderly fashion.',
            ko: '연결된 소비자들이 이제 인터넷과 소셜 미디어로 국경을 손쉽게 넘나들어, 광고주가 각 나라에 맞춘 광고를 통제된 차례대로 펼치기가 어려워졌다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '난이형용사 뒤에서는 **it 을 반드시 세운다.** 사람을 목적어로 바로 두면 틀린다. 시험이 ' +
        '흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'Two factors have made scientists difficult to determine the number of species on Earth.',
          right: 'Two factors have made it difficult for scientists to determine the number of species on Earth.',
          why: '어려운 것은 과학자가 아니라 종 수를 알아내는 일이다. it 을 세우고 사람은 for 로 데려온다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sp-it',
    focus: '가주어 it — 진주어 that절',
    title: '가주어 it — 진주어는 뒤의 that절',
    summary:
      '주어가 that 절이면 그 자리에 it 을 세우고 **절을 뒤로** 보낸다.',
    detail:
      'to부정사일 때와 몫이 같다. 다만 뒤에 오는 것이 절이라 더 길어진다.\n\n' +
      '「It is + 형용사 · 명사 + that절」이 기본 꼴이다. seem · appear 처럼 보어를 받는 동사 뒤에도 ' +
      '온다.',
    groups: [
      {
        name: 'It is + 형용사 + that절',
        note: '진짜 주어는 that 절 통째다. 그 절은 완전하다.',
        examples: [
          {
            en: 'It seems incredible that one man could be responsible for opening our eyes to an entire culture, but until British archaeologist Arthur Evans successfully excavated the ruins of the palace of Knossos on the island of Crete, the great Minoan culture of the Mediterranean was more legend than fact.',
            ko: '한 사람이 한 문화 전체에 우리 눈을 뜨게 한 공을 세울 수 있었다는 것은 믿기 어려워 보인다. 그러나 영국 고고학자 아서 에번스가 크노소스 궁전 터를 발굴하기까지, 지중해의 위대한 미노아 문명은 사실이라기보다 전설이었다.',
          },
        ],
      },
      {
        name: 'that 절 안에 다시 to부정사가 오기도 한다',
        note: '가주어 구문이 겹쳐 두 겹으로 쌓인다.',
        examples: [
          {
            en: 'Still, it is important to note that Lamarck proposed that evolution occurs when organisms adapt to their environments.',
            ko: '그래도 라마르크가 생물이 환경에 적응할 때 진화가 일어난다고 주장했음을 짚어 두는 것이 중요하다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**강조구문과 겉꼴이 같다.** It is 와 that 을 지워 보라. 남는 것이 온전한 문장이면 ' +
        '강조구문, 조각만 남으면 가주어다.',
    },
  },

  {
    level: 'focus',
    unitId: 'v-modal',
    focus: 'ought to · used to',
    title: 'ought to · used to — 뒤에는 동사원형',
    summary:
      '둘 다 조동사처럼 쓰여 **동사원형**을 데려온다. to 가 붙어 있어도 부정사의 to 가 아니다.',
    detail:
      'ought to 는 should 와 뜻이 같다. 「~해야 한다」이고, ought to have p.p. 로 지난 일을 ' +
      '두고 아쉬워하기도 한다.\n\n' +
      'used to 는 「예전에는 ~했다」다. 지금은 그렇지 않다는 결이 담긴다. **be used to -ing** ' +
      '(익숙하다)와 꼴이 닮았으니 갈라 둔다.',
    groups: [
      {
        name: 'ought to — should 와 같다',
        note: '부정은 ought not to 다. 지난 일이면 ought to have p.p. 로 쓴다.',
        examples: [
          {
            en: 'I ought to have formed a habit of reading in my boyhood.',
            ko: '나는 어린 시절에 책 읽는 버릇을 들였어야 했다. (들이지 못했다는 아쉬움)',
          },
        ],
      },
      {
        name: 'used to — 지난날의 버릇',
        note: '지금은 그렇지 않다는 뜻이 담긴다. would 로 바꿔 쓰기도 하지만 상태에는 used to 만 쓴다.',
        contrasts: [
          {
            wrong: 'They used to loving books much more when they were younger.',
            right: 'They used to love books much more when they were younger.',
            why: 'used to 뒤에는 동사원형이 온다. -ing 가 아니다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '꼴이 닮은 셋을 가른다. **used to + 원형**은 「~하곤 했다」, **be used to + -ing** 는 ' +
        '「~에 익숙하다」, **be used to + 원형**은 「~하는 데 쓰이다」다.',
      examples: [
        {
          en: "A: I'm traveling abroad, but I'm not used to staying in another country. B: Don't worry. You'll get accustomed to it in no time.",
          ko: 'A: 해외여행을 가는데 다른 나라에 머무는 것이 익숙하지 않아. B: 걱정 마. 금세 익숙해질 거야. (be used to -ing)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'v-modal',
    focus: 'should have p.p.',
    title: 'should have p.p. — 했어야 했는데 안 했다',
    summary:
      '지난 일을 두고 **뉘우치거나 나무란다.** 실제로는 하지 않았다는 뜻이 꼴 안에 들어 있다.',
    detail:
      '조동사 뒤에 have p.p. 가 오면 가리키는 일이 과거로 물러난다. 말하는 때는 지금이다.\n\n' +
      'ought to have p.p. 와 뜻이 같다. 부정은 should not have p.p. 로 「하지 말았어야 했는데 ' +
      '했다」가 된다.',
    groups: [
      {
        name: '하지 않은 일을 두고 말한다',
        note: '「했어야 했는데」에는 「하지 않았다」가 딸려 온다.',
        examples: [
          {
            en: 'I should have gone this morning, but I was feeling a bit ill.',
            ko: '나는 오늘 아침에 갔어야 했는데, 몸이 조금 좋지 않았다. (가지 않았다)',
          },
          {
            en: 'I ought to have formed a habit of reading in my boyhood.',
            ko: '나는 어린 시절에 책 읽는 버릇을 들였어야 했다. (ought to have p.p. 도 같은 뜻)',
          },
        ],
      },
      {
        name: '같은 무리의 다른 꼴',
        items: [
          'must have p.p. — 했음에 틀림없다',
          'cannot have p.p. — 했을 리 없다',
          'may have p.p. — 했을지도 모른다',
          'need not have p.p. — 안 해도 됐는데 했다',
        ],
        note: '뜻은 앞의 조동사가 정한다. 뒤의 have p.p. 는 「지난 일」이라는 표시일 뿐이다.',
      },
    ],
    pitfall: {
      text:
        '**should have p.p. 와 must have p.p. 를 가른다.** should 는 아쉬움, must 는 확신이다. ' +
        '뜻이 아주 다르다.',
    },
  },

  {
    level: 'focus',
    unitId: 'v-passive',
    focus: 'by 이외의 전치사',
    title: 'by 이외의 전치사 — 표현마다 짝이 굳어 있다',
    summary:
      '수동태의 행위자를 by 로 데려오는 것이 기본이지만, **표현마다 다른 전치사**가 굳어 있다.',
    detail:
      '이 무리는 수동태라기보다 **형용사처럼 굳은 표현**에 가깝다. be interested in 은 「관심이 ' +
      '있다」라는 상태를 말한다.\n\n' +
      '그래서 전치사도 행위자를 데려오는 by 가 아니라, 그 표현마다 어울리는 것으로 정해져 있다.',
    groups: [
      {
        name: '자주 나오는 짝',
        items: [
          'be interested in', 'be satisfied with', 'be surprised at',
          'be known as · for · to', 'be covered with', 'be attached to',
          'be filled with', 'be worried about',
        ],
        note: 'by 로 바꾸면 어색해진다. 통째로 눈에 익혀 둔다.',
        examples: [
          {
            en: 'Electronic sensors are attached to various parts of the body to measure such variables as heart rate, blood pressure, and skin temperature.',
            ko: '심박수와 혈압, 피부 온도 같은 변수를 재려고 전자 감지기를 몸의 여러 곳에 붙인다.',
          },
          {
            en: 'This version of the touchscreen is known as a resistive screen because the screen reacts to pressure from the finger.',
            ko: '터치스크린의 이 방식은 화면이 손가락의 누름에 반응하기 때문에 저항막 화면으로 알려져 있다.',
          },
        ],
      },
      {
        name: 'be known 은 뒤 전치사로 뜻이 갈린다',
        items: ['be known as — ~으로 알려지다', 'be known for — ~으로 유명하다', 'be known to — ~에게 알려지다'],
        note: '세 가지가 뜻이 다르다. 무엇이 뒤에 오는지 보고 가른다.',
      },
      {
        name: 'as 가 남는 것도 같은 무리',
        note: 'regard A as B · dismiss A as B 를 수동으로 쓰면 as 가 그대로 남는다.',
        examples: [
          {
            en: 'The tragedies of the Greek dramatist Sophocles have come to be regarded as the high point of classical Greek drama.',
            ko: '그리스 극작가 소포클레스의 비극들은 고전 그리스 연극의 정점으로 여겨지게 되었다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**be동사를 빠뜨리면 방향이 뒤집힌다.** know 는 타동사인데 뒤에 목적어가 없으면 수동이다. ' +
        '시험이 흠으로 고른 자리다.',
      contrasts: [
        {
          wrong: 'She has known primarily as a political cartoonist throughout her career.',
          right: 'She has been known primarily as a political cartoonist throughout her career.',
          why: '그녀는 알려지는 쪽이다. 뒤에 목적어가 없으니 수동이어야 한다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'v-passive',
    focus: '구동사의 수동',
    title: '구동사의 수동 — 전치사를 떼어 놓지 않는다',
    summary:
      '「동사 + 전치사」가 한 덩이로 타동사 노릇을 한다. 수동이 되어도 **전치사가 붙어 다닌다.**',
    detail:
      'look at 은 둘이 합쳐 「~을 보다」다. 그래서 수동으로 바꿔도 was looked at 까지가 통째로 ' +
      '동사다.\n\n' +
      '읽을 때 전치사 뒤가 비어 있는 것을 보고 「목적어가 빠졌다」고 여기면 안 된다. 그 목적어는 ' +
      '이미 주어 자리로 올라갔다.',
    groups: [
      {
        name: '전치사가 뒤에 남는다',
        note: '전치사 뒤가 비어 보이지만 목적어는 주어 자리로 올라간 것이다.',
        examples: [
          {
            en: 'The picture was looked at carefully by the art critic.',
            ko: '그 그림은 미술 평론가에게 주의 깊게 살펴봐졌다. (was looked at 까지가 동사)',
          },
          {
            en: 'Electrons can be bumped up to higher energy levels by the injection of energy for example, by a flash of light.',
            ko: '전자는 에너지를 넣어 줌으로써, 이를테면 빛의 번쩍임으로 더 높은 에너지 준위로 밀어 올려질 수 있다.',
          },
        ],
      },
      {
        name: '분리할 수 있는 구동사도 있다',
        note: 'turn in 처럼 목적어가 사이에 들어갈 수 있는 것은, 수동이 되면 부사만 뒤에 남는다.',
        examples: [
          {
            en: 'All assignments are expected to be turned in on time.',
            ko: '모든 과제는 제때에 제출될 것으로 기대된다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**전치사를 빠뜨리면 틀린다.** 구동사는 통째로 하나의 타동사이므로, 수동에서도 그 꼴이 ' +
        '깨지지 않는다.',
      contrasts: [
        {
          wrong: 'The picture was looked carefully by the art critic.',
          right: 'The picture was looked at carefully by the art critic.',
          why: 'look 만으로는 목적어를 받지 못한다. at 이 있어야 한 덩이가 된다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-ellipsis',
    focus: '반복되는 말 생략',
    title: '반복되는 말 생략 — 다른 부분만 남긴다',
    summary:
      '앞과 같은 부분은 지우고 **달라지는 부분만** 남긴다. 지운 것을 되살려 읽는다.',
    detail:
      '지우는 조건은 하나다. **앞에서 이미 나와 되살릴 수 있을 때**다. 되살릴 수 없으면 지우지 ' +
      '않는다.\n\n' +
      '읽는 법도 하나다. 접속사 앞뒤에서 짝이 되는 자리를 찾고, 한쪽에만 있는 것을 다른 쪽에 ' +
      '옮겨 넣는다.',
    groups: [
      {
        name: '되풀이되는 동사구를 지운다',
        note: '남은 조각의 꼴을 보고 무엇이 지워졌는지 알아본다.',
        examples: [
          {
            en: 'For instance, the scales on the sides of the body are tapered ―wide at one end and narrow at the other end.',
            ko: '이를테면 몸 옆면의 비늘은 끝이 가늘어지는데, 한쪽 끝은 넓고 다른 쪽 끝은 좁다. (are 가 지워졌다)',
          },
          {
            en: 'An emerging norm is three days a week in the office and two at home, cutting days on site by 30 % or more.',
            ko: '새로 자리 잡는 기준은 주 사흘은 사무실에서, 이틀은 집에서 일하는 것이며, 그리하여 출근 일수를 30퍼센트 넘게 줄인다. (two 뒤에 days 가 지워졌다)',
          },
        ],
      },
      {
        name: '앞뒤가 반대일 때도 지운다',
        note: 'but · not 뒤에서 되풀이되는 부분을 지운다.',
        examples: [
          {
            en: 'A: I can hit the ball straight during the practice but not during the game.',
            ko: '나는 연습 때는 공을 똑바로 칠 수 있는데, 경기 때는 그러지 못한다. (I can hit the ball straight 가 지워졌다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '지워진 자리를 못 보면 **병치와 수일치를 놓친다.** 접속사가 보이면 그 앞뒤에서 같은 꼴을 ' +
        '찾고, 없으면 지워졌다고 본다.',
    },
  },

  {
    level: 'focus',
    unitId: 'cp-ellipsis',
    focus: '주어와 be동사 생략',
    title: '주어와 be동사 생략 — 접속사만 남는다',
    summary:
      '부사절의 **주어와 be동사**를 지운다. 주절의 주어와 같을 때만 지울 수 있다.',
    detail:
      '분사구문과 결이 같다. 다만 뜻을 또렷이 하려고 **접속사는 남긴다.**\n\n' +
      '지우고 나면 「접속사 + 분사」나 「접속사 + 형용사 · 전치사구」만 남는다. 되살려 읽으면 ' +
      '온전한 절이 된다.',
    groups: [
      {
        name: '접속사 뒤에 조각만 남는다',
        note: '주절의 주어와 be동사를 되살려 넣어 읽는다.',
        examples: [
          {
            en: 'Citizens will be able to recycle the same materials across the state whether at home, work or school.',
            ko: '주민은 집에서든 직장에서든 학교에서든 주 전역에서 같은 물질을 재활용할 수 있게 된다. (they are 가 지워졌다)',
          },
          {
            en: 'When out of school, they are commonly found in neighborhoods digging in sand, building forts, playing traditional games, climbing, or playing ball games.',
            ko: '학교 밖에 있을 때 그들은 흔히 동네에서 모래를 파고 요새를 짓고 전통 놀이를 하고 오르고 공놀이를 하는 모습으로 보인다. (they are 가 지워졌다)',
          },
        ],
      },
      {
        name: '접속사 + 분사로 남기도 한다',
        note: '뜻을 또렷이 하려고 while · when 을 남긴다.',
        examples: [
          {
            en: 'The researchers noted that listening to music while driving helps relieve the stress that affects heart health.',
            ko: '연구자들은 운전하면서 음악을 듣는 것이 심장 건강에 영향을 주는 스트레스를 더는 데 도움이 된다고 밝혔다. (you are 가 지워졌다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '**주어가 다르면 지우지 못한다.** 분사구문과 같은 조건이다. 되살려 넣었을 때 말이 되는지 ' +
        '확인한다.',
    },
  },

  {
    level: 'unit',
    unitId: 'sp-neg',
    title: '부정구문 — 부정어 없이 부정하는 자리',
    summary:
      'not 이 없는데 부정의 뜻이 되거나, not 이 있는데 **일부만** 부정하는 자리다.',
    detail:
      '「아무리 ~해도 지나치지 않다」의 cannot ~ too 처럼 꼴이 통째로 굳은 것이 많다. ' +
      '낱말을 하나씩 옮기면 뜻이 거꾸로 되니 통째로 눈에 익혀 둔다.\n\n' +
      '부분부정도 자주 나온다. **all · every · always 에 not 이 붙으면** 「전부는 아니다」이지 ' +
      '「전혀 아니다」가 아니다.',
    groups: [
      {
        name: '꼴이 굳은 부정 표현',
        items: [
          'cannot ~ too — 아무리 ~해도 지나치지 않다',
          'by no means — 결코 ~ 아니다',
          'no sooner ~ than — ~하자마자',
          'far from — 결코 ~이 아니다',
          'have yet to — 아직 ~하지 못했다',
        ],
        note: '부정어가 없어 보여도 부정의 뜻인 것이 섞여 있다.',
        examples: [
          {
            en: 'Children cannot be too careful when crossing the street.',
            ko: '아이들은 길을 건널 때 아무리 조심해도 지나치지 않다.',
          },
        ],
      },
      {
        name: '부분부정 — 전부는 아니다',
        items: ['not all', 'not every', 'not always', 'not necessarily', 'not both'],
        note: '「전혀 아니다」로 옮기면 뜻이 어긋난다. 전체를 부정하려면 no · none · never 를 쓴다.',
        examples: [
          {
            en: 'Not all the students passed the exam.',
            ko: '학생 모두가 시험에 붙은 것은 아니다. (붙은 학생도 있다)',
            source: 'written',
          },
        ],
      },
      {
        name: 'no 를 명사 쪽에 붙인다',
        note: 'not ~ any 와 뜻이 같지만 no 쪽이 더 세다.',
        examples: [
          {
            en: 'Urban agriculture has long been dismissed as a fringe activity that has no place in cities.',
            ko: '도시 농업은 오랫동안 도시에 설 자리가 없는 주변적인 활동으로 치부되어 왔다. (doesn’t have any place 와 같다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'still more 와 still less 는 **앞 문장이 긍정이냐 부정이냐**로 갈린다. 긍정 뒤에는 ' +
        'still more, 부정 뒤에는 still less · much less 다.',
      contrasts: [
        {
          wrong: 'They are not interested in reading poetry, still more in writing.',
          right: 'They are not interested in reading poetry, still less in writing.',
          why: '앞이 부정이라 「하물며 ~은 더욱 아니다」가 된다. still less 나 much less 를 쓴다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'sp-insert',
    title: '삽입 · 동격 콤마 — 걷어 내도 문장이 남는다',
    summary:
      '콤마나 줄표로 끼워 넣은 말이다. **걷어 내도 문장이 성립하는지**가 삽입인지 아닌지의 잣대다.',
    detail:
      '삽입은 주어와 동사 사이에 즐겨 들어간다. 그 바람에 둘이 멀어지고, 동사 바로 앞에 엉뚱한 ' +
      '명사가 놓인다. 수일치를 물을 때 시험이 쓰는 수법이다.\n\n' +
      '읽는 법은 하나다. **콤마 짝을 찾아 그 안을 통째로 지우고** 앞뒤를 이어 읽는다.',
    groups: [
      {
        name: '주어와 동사 사이에 끼어든다',
        note: '걷어 내면 뼈대가 드러난다. 안쪽 명사는 동사의 수를 정하지 못한다.',
        examples: [
          {
            en: 'For many compulsive buyers, the act of purchasing, rather than what they buy, is what leads to gratification.',
            ko: '강박적으로 사들이는 많은 이들에게는, 무엇을 사느냐가 아니라 사는 행위 자체가 만족으로 이끄는 것이다. (rather than ~ 을 걷어 내면 the act is what ~)',
          },
          {
            en: 'Chinese shoppers, once seemingly in endless supply, are no longer turning up at brick-and-mortar outlets.',
            ko: '한때 끝없이 밀려드는 듯하던 중국인 쇼핑객이 더는 오프라인 매장에 나타나지 않는다.',
          },
        ],
      },
      {
        name: '줄표는 더 크게 끊는다',
        note: '콤마보다 세게 끊어 넣는다. 안에 절이 통째로 들어가기도 한다.',
        examples: [
          {
            en: 'In the broadest sense, myths are stories ―usually whole groups of stories ― that can be true or partly true as well as false.',
            ko: '가장 넓은 뜻에서 신화는 이야기 — 대개 이야기 무리 통째 — 이며, 거짓일 수도 있고 참이거나 얼마쯤 참일 수도 있다.',
          },
        ],
      },
      {
        name: '보기를 드는 삽입',
        items: ['such as ~', 'including ~', 'for instance', 'for example'],
        note: '앞말이 무엇인지 예를 든다. 주어를 늘리지 않으므로 수일치의 잣대가 아니다.',
        examples: [
          {
            en: 'He relied heavily on theatrical techniques, including role-playing and improvisation, as a means to promote creativity.',
            ko: '그는 창의성을 북돋우는 수단으로 역할극과 즉흥극을 비롯한 연극 기법에 크게 기댔다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '삽입을 걷어 내지 않으면 **동사 바로 앞의 명사**를 주어로 잡게 된다. 콤마 짝을 먼저 찾는 ' +
        '버릇을 들인다.',
    },
  },

  {
    level: 'unit',
    unitId: 'sp-causative',
    title: '사역 · 지각동사 — 뒤에 원형이 온다',
    summary:
      'make · have · let 과 see · hear · feel · watch 는 목적격보어로 **원형**을 받는다. to 를 붙이지 않는다.',
    detail:
      '다만 원형은 목적어가 **하는 쪽**일 때다. 당하는 쪽이면 과거분사로 바꾼다. ' +
      'have my hair cut 은 머리가 잘리는 쪽이라 cut 이다.\n\n' +
      'let 만 예외가 하나 있다. 당하는 쪽일 때 과거분사만 두지 않고 **be p.p.** 로 적는다.',
    groups: [
      {
        name: '사역동사 — make · have · let',
        note: '「~에게 …하게 하다」다. get 만은 to부정사를 받아 get him to do 라고 쓴다.',
        examples: [
          {
            en: 'Nonverbal cues ― rather than spoken words ― make us feel that the person we are with is interested in, understands, and values us.',
            ko: '말이 아닌 신호가 — 입 밖에 낸 말보다 — 함께 있는 사람이 우리에게 관심을 갖고 이해하고 소중히 여긴다고 느끼게 한다. (feel 이 원형)',
          },
        ],
      },
      {
        name: '지각동사 — see · hear · feel · watch',
        note: '원형이면 처음부터 끝까지 본 것, 현재분사면 그 순간의 장면이다. 뜻이 조금 다르다.',
        contrasts: [
          {
            wrong: 'As I went out for work, I saw a family moved in upstairs.',
            right: 'As I went out for work, I saw a family move in upstairs.',
            why: '가족이 스스로 이사 오는 쪽이라 원형이나 moving 이다. moved 는 당하는 쪽이라 어긋난다.',
          },
        ],
      },
      {
        name: 'help 는 둘 다 된다',
        note: 'to 를 붙여도 되고 빼도 된다. 요즘 글에서는 빼는 쪽이 더 흔하다.',
        examples: [
          {
            en: 'Help us live within our water means, ensuring that all residents have access to abundant, safe, clean water.',
            ko: '모든 주민이 넉넉하고 안전한 깨끗한 물을 쓸 수 있도록, 우리가 물 형편에 맞게 살도록 도와주십시오.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '목적어가 **당하는 쪽**이면 원형이 아니라 과거분사다. let 만은 be p.p. 로 적는다.',
      contrasts: [
        {
          wrong: 'A woman with the tip of a pencil stuck in her head has finally had it remove.',
          right: 'A woman with the tip of a pencil stuck in her head has finally had it removed.',
          why: '연필 끝은 제거되는 쪽이다. 당하는 쪽이라 과거분사다.',
        },
        {
          wrong: "Don't let me distracted by the noise you make.",
          right: "Don't let me be distracted by the noise you make.",
          why: 'let 은 당하는 쪽일 때 be p.p. 를 데려온다. 과거분사만 두면 모자란다.',
        },
      ],
    },
  },

  {
    level: 'unit',
    unitId: 'sp-idiom',
    title: '관용 구문 — 통째로 눈에 익힌다',
    summary:
      '낱말을 하나씩 옮기면 뜻이 나오지 않는 자리다. **꼴 전체**를 하나로 외운다.',
    detail:
      '시험이 노리는 것은 짝이다. so 는 that 절과, too 는 to부정사와 짝을 이룬다. ' +
      '짝을 바꿔 놓고 고르라고 한다.\n\n' +
      'such 와 so 도 갈린다. **뒤에 명사가 있으면 such**, 형용사나 부사만 있으면 **so** 다.',
    groups: [
      {
        name: '정도와 결과를 잇는 짝',
        items: ['so + 형용사 · 부사 + that', 'such + (a) + 명사 + that', 'too ~ to', '형용사 + enough to'],
        note: 'so 뒤에는 명사가 오지 못하고, too 뒤에는 that 절이 오지 못한다.',
        examples: [
          {
            en: 'Worry is a complete waste of time and creates so much clutter in your mind that you cannot think clearly about anything.',
            ko: '걱정은 시간 낭비일 뿐이며 머릿속을 어지럽혀 무엇도 또렷이 생각하지 못하게 만든다. (so ~ that)',
          },
          {
            en: 'For high performers with potential for growth, feedback should be frequent enough to prod them into taking corrective action.',
            ko: '자랄 여지가 있는 우수한 사람에게는, 바로잡을 행동을 하도록 떠밀 만큼 자주 피드백을 주어야 한다. (형용사 뒤의 enough to)',
          },
        ],
      },
      {
        name: '자주 나오는 굳은 꼴',
        items: [
          'have no choice but to — ~할 수밖에 없다',
          'cannot help -ing — ~하지 않을 수 없다',
          'It is no use -ing — ~해야 소용없다',
          'A is to B what C is to D — A와 B의 관계는 C와 D의 관계와 같다',
          'be on the verge of -ing — 막 ~하려 하다',
        ],
        note: '사이에 다른 말이 끼어들 자리가 없다. 통째로 눈에 익혀 둔다.',
      },
    ],
    pitfall: {
      text:
        'so 와 too 를 바꿔 놓는 것이 가장 흔한 흠이다. **too 의 짝은 to부정사**, **so 의 짝은 ' +
        'that 절**이다.',
      contrasts: [
        {
          wrong: 'He was so distracted by a text message to know that he was going over the speed limit.',
          right: 'He was too distracted by a text message to know that he was going over the speed limit.',
          why: 'to부정사와 짝을 이루는 것은 too 다. so 는 that 절을 데려온다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sk-svoc',
    focus: '목적격보어가 to부정사',
    title: '목적격보어가 to부정사 — 「목적어가 ~하도록」',
    summary:
      '「~에게 …하도록 하다」 무리다. 목적어와 to부정사 사이에 **주어-술어 관계**가 있다.',
    detail:
      'want him to go 에서 가는 사람은 내가 아니라 him 이다. 목적어가 곧 to부정사의 주어다. ' +
      '이 관계를 잡으면 아무리 길어져도 해석이 흔들리지 않는다.\n\n' +
      '어느 동사가 to 를 붙이고 어느 동사가 원형을 받는지는 외워야 한다. 뜻으로는 갈리지 않는다.',
    groups: [
      {
        name: 'to부정사를 받는 동사',
        items: [
          'want', 'ask', 'tell', 'advise', 'teach', 'invite',
          'encourage', 'inspire', 'enable', 'allow', 'force', 'expect', 'prepare',
        ],
        note: '「~에게 …하도록」이라는 뜻이 공통이다.',
        examples: [
          {
            en: 'When they buy, they expect extensive references, and they want a good number to come from companies in their own industry segment.',
            ko: '그들은 살 때 폭넓은 추천 사례를 기대하고, 그 가운데 꽤 많은 수가 같은 업종의 회사에서 나오기를 바란다. (바라는 쪽과 나오는 쪽이 다르다)',
          },
        ],
      },
      {
        name: '목적어가 곧 to부정사의 주어다',
        note: '누가 그 일을 하는지 짚어야 해석이 산다.',
        examples: [
          {
            en: 'The lure of making extra money has inspired many homeowners in Old Town to turn over their places to Airbnb.',
            ko: '부수입을 올린다는 유혹이 구시가지의 많은 집주인으로 하여금 자기 집을 에어비앤비에 넘기도록 부추겼다. (넘기는 것은 유혹이 아니라 집주인이다)',
          },
        ],
      },
      {
        name: 'to부정사가 두 번 나오면 몫을 가른다',
        note: '하나는 목적격보어, 하나는 목적을 나타내는 부사적 용법일 수 있다.',
        examples: [
          {
            en: "We invite families and caregivers to attend a weekly exhibition reception of campers' artwork to celebrate the artistic achievements of each participant.",
            ko: '우리는 참가자 한 사람 한 사람의 예술적 성취를 기리기 위해, 캠프 참가자들의 작품을 여는 주간 전시 행사에 가족과 돌보는 분들을 모십니다. (앞 to attend 는 보어, 뒤 to celebrate 는 목적)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        '사역동사와 지각동사는 **원형**을 받는다. to 를 붙이면 틀린다 — make · have · let 과 ' +
        'see · hear · feel · watch 가 그 무리다.',
      contrasts: [
        {
          wrong: 'He made me to go there.',
          right: 'He made me go there.',
          why: 'make 는 원형을 받는다. 수동이 될 때만 to 가 되살아난다.',
        },
      ],
      examples: [
        {
          en: 'She helped me (to) carry the box.',
          ko: '그녀가 상자 나르는 것을 도와주었다. (help 만은 둘 다 된다)',
          source: 'written',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'cp-comp',
    focus: '원급 as ~ as',
    title: '원급 as ~ as — 배수사는 앞에 선다',
    summary:
      '두 as 사이에는 **원급**이 온다. 「몇 배」를 나타내는 말은 첫 as 앞에 놓는다.',
    detail:
      '원급 비교는 두 대상이 같은 정도임을 말한다. 사이에 들어가는 것은 형용사·부사의 원래 ' +
      '꼴이지 비교급이 아니다.\n\n' +
      '시험이 노리는 곳은 두 군데다. 하나는 **배수사의 자리**, 다른 하나는 **much 인가 many 인가**다.',
    groups: [
      {
        name: '사이에는 원급이 온다',
        note: 'as ~ as possible 은 「되도록 ~하게」다. as ~ as one can 으로 바꿔 쓸 수 있다.',
        examples: [
          {
            en: 'Among the Hopi Indians of Arizona, the deceased are forgotten as quickly as possible and life goes on as usual.',
            ko: '애리조나의 호피족 사이에서는 죽은 이가 되도록 빨리 잊히고 삶은 여느 때처럼 이어진다.',
          },
        ],
      },
      {
        name: '배수사는 첫 as 앞에 선다',
        items: ['half', 'twice', 'three times', 'eighteen times'],
        note: '「몇 배」를 나타내는 말은 as ~ as 통째의 앞에 놓는다. 사이에 끼우지 않는다.',
        examples: [
          {
            en: 'My cat is three times as old as his.',
            ko: '내 고양이 나이는 그의 고양이 나이의 세 배다.',
          },
          {
            en: 'The optic nerve contains roughly eighteen times as many neurons as the cochlear nerve.',
            ko: '시신경은 달팽이관 신경의 약 열여덟 배나 되는 뉴런을 지니고 있다. (명사 neurons 는 many 바로 뒤에 들어간다)',
          },
        ],
      },
      {
        name: '짝이 멀어지거나 뒤가 지워진다',
        note: '두 as 사이에 긴 말이 끼기도 하고, 비교 대상이 앞에 이미 나왔으면 뒤의 as 절을 지우기도 한다.',
        examples: [
          {
            en: 'The home-educated children appear to do just as well in terms of social and emotional development as other students.',
            ko: '집에서 배운 아이들은 사회성과 정서 발달 면에서 다른 학생들만큼 잘 해낸다. (as well 과 as 사이가 여섯 낱말 벌어졌다)',
          },
          {
            en: 'The very first sentence from the Japanese participants was likely to be one referring to the environment, whereas the first sentence from Americans was three times as likely to be one referring to the focal fish.',
            ko: '일본인 참가자들의 맨 첫 문장은 환경을 가리키는 문장일 때가 많았던 반면, 미국인들의 첫 문장은 초점이 되는 물고기를 가리키는 문장일 가능성이 세 배나 높았다. (비교 대상이 앞 절에 있어 뒤의 as 절을 지웠다)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'as much 인지 as many 인지는 **뒤의 명사가 셀 수 있는가**로 갈린다. -s 로 끝난다고 셀 수 ' +
        '있는 것이 아니다.',
      contrasts: [
        {
          wrong: 'Foreign journalists hope to cover as many news as possible.',
          right: 'Foreign journalists hope to cover as much news as possible.',
          why: 'news 는 -s 로 끝나지만 셀 수 없는 명사다. 세려면 a piece of news 라 한다.',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'sk-agree',
    focus: '수식어구에 끌린 수일치',
    title: '수식어구에 끌린 수일치 — 끼어든 말은 걷어 낸다',
    summary:
      '주어와 동사 사이에 끼어든 말은 **주어를 늘리지 않는다.** and 로 묶인 주어만 수를 바꾼다.',
    detail:
      '두 가지를 갈라야 한다. 하나는 **and 로 묶인 진짜 복수 주어**, 다른 하나는 **끼어들었을 ' +
      '뿐인 수식어**다.\n\n' +
      'and 로 이었으면 주어가 늘고, along with · including · as well as 로 이었으면 늘지 않는다. ' +
      '콤마 두 개로 묶여 있으면 대개 끼어든 말이다.',
    groups: [
      {
        name: 'and 로 묶이면 대개 복수',
        note: '앞에 the 나 소유격이 각각 붙어 있으면 별개라는 표시다.',
        examples: [
          {
            en: 'Newspaper columns, specialized magazines, television programs, and Web sites record the personal lives of celebrated Hollywood actors.',
            ko: '신문 칼럼과 전문 잡지, 텔레비전 프로그램, 웹사이트가 이름난 할리우드 배우들의 사생활을 기록한다. (매체 넷이라 record 에 -s 가 없다)',
          },
          {
            en: 'The principles of kinship obligation and the morality of sharing food have been emphasized.',
            ko: '친족의 의무라는 원칙과 음식을 나누는 도덕이 힘주어 다져져 왔다. (the 가 각각 붙어 별개다)',
          },
        ],
      },
      {
        name: 'the 가 하나면 한 덩이 — 단수로 받는다',
        note: '앞에 the 하나만 붙어 있으면 둘을 한 덩이로 본다는 표시다.',
        examples: [
          {
            en: 'The incessant public curiosity and consumer demand due to the health benefits with lesser cost has increased the interest in functional foods.',
            ko: '더 적은 비용으로 얻는 건강상 이로움 때문에 끊이지 않는 대중의 호기심과 소비자 수요가 기능성 식품에 대한 관심을 높여 왔다. (The 하나뿐이라 한 덩이)',
          },
          {
            en: 'The feeling of being loved and the biological response it stimulates is triggered by nonverbal cues.',
            ko: '사랑받는다는 느낌과 그것이 불러일으키는 생물학적 반응은 말이 아닌 신호로 촉발된다. (떼어 놓을 수 없는 한 덩이로 보았다)',
          },
        ],
      },
      {
        name: 'or 로 묶이면 뒤쪽에 맞춘다',
        note: 'and 와 달리 둘을 더하지 않는다. 마지막 항목의 수를 따른다.',
        examples: [
          {
            en: 'Their structure, the relationships of their parts, or the essential purposes they serve are similar.',
            ko: '그것들의 구조나 부분들의 관계, 또는 그것들이 하는 본질적인 쓰임은 비슷하다. (마지막 purposes 가 복수라 are)',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'along with · including · as well as · together with 는 **주어를 늘리지 않는다.** ' +
        '전치사구라 걷어 내고 앞의 핵만 본다.',
      contrasts: [
        {
          wrong: 'The manager, along with his staff, are attending the meeting.',
          right: 'The manager, along with his staff, is attending the meeting.',
          why: '주어는 The manager 하나다. along with 뒤의 staff 는 수를 정하지 못한다.',
        },
      ],
      examples: [
        {
          en: "Eleven operating divisions, including eight agencies in the Public Health Service and three human services agencies, administer HHS's programs.",
          ko: '공중보건국의 여덟 기관과 세 개의 복지 기관을 아우르는 열한 개의 운영 부서가 HHS 의 사업을 운영한다. (주어는 Eleven divisions — 복수라 -s 가 없다)',
        },
      ],
    },
  },

  {
    level: 'focus',
    unitId: 'v-tense',
    focus: '현재완료 · 현재완료진행',
    title: '현재완료 — 한 점이 아니라 지금까지',
    summary:
      '한 시점의 일은 과거, **그 시점부터 지금까지** 이어지는 일은 현재완료다.',
    detail:
      '가장 또렷한 표시는 짝을 이루는 부사다. since 는 시작점을, for 는 길이를 데려온다. ' +
      '둘 다 완료와 짝이다.\n\n' +
      '한 문장 안에 과거와 완료가 나란히 오기도 한다. 그때는 저마다 다른 몫을 맡는다 — ' +
      '시작한 때는 과거, 그 뒤로 이어진 것은 완료다.',
    groups: [
      {
        name: 'since 는 시작점, for 는 길이',
        items: ['since + 시점 · 절', 'for + 기간'],
        note: 'since 는 언제부터인지를, for 는 얼마 동안인지를 데려온다.',
        examples: [
          {
            en: "I've been a reporter for more than 25 years, so I have lived through a half dozen technological life cycles.",
            ko: '나는 25년 넘게 기자로 일해 왔고, 그래서 기술의 생애 주기를 여섯 번쯤 겪어 왔다.',
          },
          {
            en: "Our government hasn't reviewed the data or set policies around choline since the late '90s.",
            ko: '90년대 후반 이래로 우리 정부는 그 자료를 살펴보지도, 콜린에 관한 정책을 세우지도 않았다.',
          },
        ],
      },
      {
        name: '한 문장에 과거와 완료가 나란히',
        note: 'since 절은 과거, 주절은 완료다. 시작한 때는 지나갔고 그 뒤가 지금까지 이어진다.',
        examples: [
          {
            en: 'I was born in Taiwan, but I have lived in Korea since I started work.',
            ko: '나는 타이완에서 태어났지만, 일을 시작한 뒤로는 한국에서 살아 왔다.',
          },
          {
            en: "My dog disappeared last month and hasn't been seen since.",
            ko: '내 개가 지난달에 사라졌고 그 뒤로 보이지 않았다. (since 가 홀로 부사로 쓰였다)',
          },
        ],
      },
      {
        name: '현재완료진행 — 지금도 하고 있다',
        note: 'have been -ing 는 완료에 진행을 더한 꼴이다. 아직 끝나지 않았다는 결이 세다.',
        examples: [
          {
            en: 'I have been doing this work ever since I retired.',
            ko: '나는 은퇴한 뒤부터 내내 이 일을 해 오고 있다.',
          },
        ],
      },
    ],
    pitfall: {
      text:
        'yesterday · last year · ago · in 2019 처럼 **한 시점을 못 박는 말**과는 현재완료를 쓰지 ' +
        '못한다. 그런 말이 보이면 과거다.',
      contrasts: [
        {
          wrong: "I have read today's newspaper yesterday.",
          right: "I read today's newspaper yesterday.",
          why: 'yesterday 가 시점을 못 박는다. 못 박힌 과거에는 완료를 쓰지 않는다.',
        },
      ],
      examples: [
        {
          en: "I have not read today's newspaper yet.",
          ko: '나는 아직 오늘 신문을 읽지 못했다. (yet 은 완료와 짝이다)',
        },
      ],
    },
  },
]

const UNIT_KEY = (unitId) => `unit::${unitId}`
const FOCUS_KEY = (unitId, focus) => `focus::${unitId}::${focus}`

const BY_KEY = new Map(
  SYNTAX_NOTES.map((n) => [
    n.level === 'unit' ? UNIT_KEY(n.unitId) : FOCUS_KEY(n.unitId, n.focus),
    n,
  ]),
)

/** 단원 개괄 한 장 */
export function getUnitNote(unitId) {
  return BY_KEY.get(UNIT_KEY(unitId)) ?? null
}

/** 초점 설명 한 장 */
export function getFocusNote(unitId, focus) {
  return BY_KEY.get(FOCUS_KEY(unitId, focus)) ?? null
}
