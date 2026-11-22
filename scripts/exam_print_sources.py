"""Match official paper files, published keys and the site's explanation sessions."""
from collections import defaultdict
from dataclasses import dataclass
from functools import lru_cache
from hashlib import sha256
from pathlib import Path
import json
import re
import sys
import unicodedata

import fitz

RECOVERED_ORIGINALS = Path(__file__).with_name("exam-print-originals")


@dataclass
class Edition:
    filename: str
    label: str
    exam_name: str
    edition_name: str
    paper: Path
    questions: list
    routes: list


def compact(value):
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', value))


def question_answers(question):
    values = question.get('correctChoices') or question.get('correctChoice') or []
    if not isinstance(values, list):
        values = [values]
    return tuple(sorted({number for value in values for number in key_value(value)}))


def matches(directory, *patterns):
    recovered = RECOVERED_ORIGINALS / directory.parent.name / directory.name
    for folder in (directory, recovered):
        for pattern in patterns:
            files = sorted(path for path in folder.glob(pattern) if path.suffix == ".pdf")
            if len(files) == 1:
                return files[0]
    return None


@lru_cache(maxsize=None)
def read_json(path):
    return json.loads(path.read_text())


@lru_cache(maxsize=None)
def page_text(path):
    with fitz.open(path) as pdf:
        return "\n".join(page.get_text() for page in pdf)


def subject_keys(path, label, count, has_form=True):
    text = re.sub(r'모두\s*정답|정답\s*없음', lambda m: compact(m[0]), page_text(path))
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    result = []
    for i, line in enumerate(lines):
        if compact(line.split('(')[0]) != compact(label):
            continue
        cursor = i + 1
        qualifier = lines[cursor:cursor + 4]
        if qualifier and any('(' in piece for piece in qualifier[:2]):
            closing = next((index for index, piece in enumerate(qualifier) if ')' in piece), None)
            if closing is not None:
                cursor += closing + 1
        while cursor < len(lines):
            form = compact(lines[cursor]).removesuffix('형') if has_form else ''
            if has_form and not re.fullmatch(r'[A-Z가-힣]', form):
                break
            start = cursor + has_form
            keys = []
            for token in lines[start:start + count]:
                token = compact(re.sub(r'(?<=[①-⑤])(?=[①-⑤])', ',', token))
                if token in ('모두정답', '전항정답'):
                    keys.append((1, 2, 3, 4))
                elif token == '정답없음':
                    keys.append(())
                elif re.fullmatch(r'[1-5](?:[,·/][1-5])*', token):
                    keys.append(tuple(sorted(int(n) for n in re.findall(r'[1-5]', token))))
                else:
                    break
            if len(keys) != count:
                break
            result.append((form, keys))
            if not has_form:
                break
            cursor = start + count
    return result


def subject_sessions(data, track):
    grouped = defaultdict(dict)
    folder = data / ('exam-questions' if track == 'real-estate' else track)
    for path in sorted(folder.glob('*.json')):
        if path.stem == 'syntax':
            continue
        doc = read_json(path)
        questions = doc if isinstance(doc, list) else doc.get('exams')
        if not questions or not isinstance(questions[0], dict) or 'questionNo' not in questions[0]:
            continue
        for q in questions:
            year = q['year']
            source = q.get('sourceCode') or f"제{q['round']}회"
            grouped[year, source].setdefault(path.stem, []).append(q)
    return grouped


def subject_label(data, track, subject):
    return read_json(data / track / f'{subject}.json')['subject']['label']


def key_value(value):
    if isinstance(value, list):
        return tuple(sorted(map(int, value)))
    value = compact(str(value))
    if value in ('모두정답', '전항정답'):
        return (1, 2, 3, 4, 5)
    if value in ('정답없음', 'None'):
        return ()
    if not re.fullmatch(r'[1-5](?:[,·/][1-5])*', value):
        raise ValueError(f'Unrecognized answer {value!r}')
    return tuple(sorted(int(n) for n in re.findall(r'[1-5]', value)))


def rejected(key, reason):
    print(f'SKIP {key} | {reason}', file=sys.stderr)


def make_edition(track, year, source, slug, exam_name, edition_name, paper, sections, option_count, subjective_key=None):
    routes = [f'{track}/{subject}/{year}/{source}' for subject, *_ in sections]
    key_name = ', '.join(routes)
    if not paper:
        return rejected(key_name, '원본 시험지 없음')
    if any(keys is None for _, _, _, keys, _ in sections):
        return rejected(key_name, '공식 정답 대조 자료 없음')
    questions = []
    for _, questions_in_section, section_name, official, offset in sections:
        for question in sorted(questions_in_section, key=lambda q: q['questionNo']):
            number = question['questionNo'] + offset
            items = question['items']
            if question.get('kind') == 'subjective':
                if not question.get('explanation') or not question.get('blanks') or not subjective_key:
                    return rejected(key_name, f'{number}번 단답형 정답 또는 해설 없음')
                official_answer = subjective_key.get(str(number))
                if not official_answer:
                    return rejected(key_name, f'{number}번 공식 단답형 정답 없음')
                web_values = [compact(str(blank['answer'])) for blank in question['blanks']]
                official_values = set(re.findall(r'[0-9]+|[가-힣]+', unicodedata.normalize('NFKC', official_answer)))
                if any((value not in official_values if value.isdigit() else value not in compact(official_answer))
                       for value in web_values):
                    return rejected(key_name, f'{number}번 공식 단답형 정답과 해설이 다름')
            else:
                if number not in official:
                    return rejected(key_name, f'{number}번 공식 정답 없음')
                expected = official[number]
                actual = question_answers(question)
                if actual != expected:
                    all_choices = tuple(range(1, option_count + 1))
                    if not expected and actual == all_choices:
                        question = {**question, 'correctChoice': '정답없음', 'correctChoices': [],
                                    'printAnswerNote': '공식 최종정답은 정답 없음으로 처리했습니다.'}
                    elif expected == all_choices and set(actual) < set(expected):
                        question = {**question, 'correctChoices': list(expected),
                                    'printAnswerNote': '공식 최종정답은 모든 선택지를 정답으로 인정했습니다.'}
                    else:
                        return rejected(key_name, f'{number}번 공식 {expected} / 해설 {actual}')
                if (not items or any(not item.get('explanation') for item in items)) and not question.get('explanationSummary'):
                    return rejected(key_name, f'{number}번 해설 누락')
            category = question.get('category')
            if len(sections) > 1:
                category = ' · '.join(dict.fromkeys(part for part in (section_name, category) if part))
            questions.append({**question, 'questionNo': number, 'category': category, 'optionCount': option_count})
    questions.sort(key=lambda q: q['questionNo'])
    if [q['questionNo'] for q in questions] != list(range(1, len(questions) + 1)):
        return rejected(key_name, '원문 문항 번호 연속성 불일치')
    return Edition(f'{track}-{slug}.pdf', f'{exam_name} · {edition_name}', exam_name, edition_name, paper, questions, routes)


def education_board_keys(folder, year):
    # KICE's 2017 provisional key was adopted unchanged on 27 June 2017.
    # https://www.lec.co.kr/news/articleView.html?idxno=44798
    label = '가답안' if year == 2017 else '정답표'
    key = matches(folder, f'{year}-gyoyukhak-지방직-{label}-*.pdf')
    if not key:
        return None
    text = page_text(key)
    if '교육학개론 정답표' not in text or not re.search(r'^A형\s*$', text, re.M):
        return None
    pairs = re.findall(r'^(\d{1,2})\s*\n([①-④])\s*$', text, re.M)
    answers = {int(number): ('①②③④'.index(answer) + 1,) for number, answer in pairs}
    return answers if len(pairs) == 20 and answers.keys() == set(range(1, 21)) else None


def single_subject_editions(data, home, track, app, archive, exam_name):
    archive = home / app / 'public/exam-pdfs' / archive
    for (year, source), subjects in sorted(subject_sessions(data, track).items()):
        folder = archive / str(year)
        for subject, questions in subjects.items():
            count = len(questions)
            label = subject_label(data, track, subject)
            session = {'국가직': 'national', '지방직': 'local'}[source]
            if track == 'firefighter':
                paper = matches(folder, f'{year}-{subject}-문제지-*.pdf')
                key = matches(folder, f'{year}-최종정답-*.pdf')
                has_form = year < 2022
            elif track in ('english', 'gugeo'):
                paper = matches(folder, f'{year}-{source}-영어-문제.pdf', f'{year}-{source}-문제지-*.pdf')
                key = matches(folder, f'{year}-{source}-정답.pdf', f'{year}-{source}-최종정답-*.pdf')
                label = {'english': '영어', 'gugeo': '국어'}[track]
                has_form = True
            else:
                paper = matches(folder, f'{year}-{subject}-{source}-문제지-*.pdf')
                key = matches(folder, f'{year}-{subject}-{source}-최종정답-*.pdf')
                has_form = True
            expected = None
            if key and paper:
                candidates = subject_keys(key, label, count, has_form)
                if track == 'firefighter' and year == 2018:
                    data_path = Path(__file__).with_name('exam-print-image-keys.json')
                    record = read_json(data_path)['firefighter']['2018']['official'][subject]
                    if key.name == record['source'] and file_sha256(key) == record['sha256']:
                        candidates = [('A', [key_value(value) for value in record['answers']])]
                if track == 'firefighter' and year >= 2025:
                    with fitz.open(key) as key_doc:
                        for p in key_doc:
                            lines = [line.strip() for line in p.get_text().splitlines() if line.strip()]
                            if label in lines and '정답' in lines:
                                start = max(i for i, line in enumerate(lines) if line == '정답') + 1
                                cells = lines[start:]
                                official_2026 = {int(a): key_value(b) for a, b in zip(cells[::2], cells[1::2])}
                                if set(official_2026) == set(range(1, count + 1)):
                                    candidates = [('', [official_2026[i] for i in range(1, count + 1)])]
                                break
                match_form = re.search(r'(?:-|_)([A-Z가-힣])형(?:-|_|\.)', paper.name)
                if match_form:
                    candidates = [(form, values) for form, values in candidates if form == match_form[1]]
                if len(candidates) > 1:
                    answers = [question_answers(q) for q in sorted(questions, key=lambda q: q['questionNo'])]
                    matching = [(form, values) for form, values in candidates if values == answers]
                    if matching:
                        candidates = [matching[0]]
                if len(candidates) == 1:
                    expected = dict(enumerate(candidates[0][1], 1))
            if track == 'public-service' and subject == 'gyoyukhak' and source == '지방직' and year in (2017, 2018):
                expected = education_board_keys(folder, year)
            detail = '공채' if track == 'firefighter' else source
            title = f'{year}년 {detail} {label}'
            edition = make_edition(track, year, source, f'{subject}-{year}-{session}', exam_name, title,
                                   paper, [(subject, questions, label, expected, 0)], 4)
            if edition:
                yield edition


def history_editions(data, home):
    archive = home / 'historybomgichul/public/exam-pdfs/history'
    for (year, source), subjects in sorted(subject_sessions(data, 'history').items()):
        number = int(re.search(r'\d+', source)[0])
        paper = matches(archive, f'{number}회_심화_문제지.pdf')
        key = matches(archive, f'{number}회_심화_정답표.pdf')
        official = None
        if key:
            text = page_text(key)
            pairs = re.findall(r'(?:^|\s)([1-9]\d?)\s*([①②③④⑤])\s*[1-3](?=\s|$)', text)
            if len(pairs) == 50:
                official = {int(n): ('①②③④⑤'.index(a) + 1,) for n, a in pairs}
            else:
                cells = re.findall(r'^([1-9]\d?)$', text, re.M)
                for i in range(len(cells) - 149):
                    grid = cells[i:i + 150]
                    if list(map(int, grid[::3])) == [n for row in range(1, 11) for n in range(row, 51, 10)]:
                        official = {int(n): (int(v),) for n, v in zip(grid[::3], grid[1::3])}
                        break
        edition = make_edition('history', year, source, f'simhwa-{number}', '한국사능력검정시험', f'{source} 심화',
                               paper, [('simhwa', subjects['simhwa'], '심화', official, 0)], 5)
        if edition:
            yield edition


# 2025 second-stage second period in the official answer sheet is image-only.
BROKER_2025_PERIOD_2 = '11141 24533 54144 25331 21255 55541 33445 22132'
BROKER_LABELS = dict(realestate='부동산학개론', civillaw='민법 및 민사특별법')
BROKER_LABELS.update({'broker-law': '공인중개사법', 'realestate-public-law': '부동산공법',
                      'registry-law': '부동산공시법', 'realestate-tax': '부동산세법'})


def qnet_editions(data, home, track, app, archive_name, exam_name, periods, key_loader, option_count=5):
    archive = home / app / 'public/exam-pdfs' / archive_name
    for (year, source), subjects in sorted(subject_sessions(data, track).items()):
        for slug, detail, patterns, group in periods(year):
            paper = matches(archive / str(year), *patterns)
            if not all(subject in subjects for subject, _ in group):
                rejected(f'{track}/{year}/{slug}', '일부 과목 웹 해설 없음')
                continue
            sections, subjective_key = key_loader(data, home / app, year, subjects, group, slug, archive)
            edition = make_edition(track, year, source, f'{year}-{slug}', exam_name, f'{year}년 {detail}',
                                   paper, sections, option_count, subjective_key)
            if edition:
                yield edition


def broker_periods(year):
    yield '1', '1차', (f'{year}-1차-문제지-*',), [('realestate', 0), ('civillaw', 0)]
    group = [('broker-law', 0), ('realestate-public-law', 0)]
    if year == 2016:
        yield '2', '2차', (f'{year}-2차-문제지-*',), [*group, ('registry-law', 80), ('realestate-tax', 80)]
    else:
        yield '2-1', '2차 1교시', (f'{year}-2차-1교시-문제지-*',), group
        yield '2-2', '2차 2교시', (f'{year}-2차-2교시-문제지-*',), [('registry-law', 0), ('realestate-tax', 0)]


def broker_keys(data, app, year, subjects, group, slug, archive):
    keys = read_json(app / 'data/pipeline/answer_keys/by_subject' / f'{year}.json')['keys']
    second = dict(enumerate(''.join(BROKER_2025_PERIOD_2.split()), 1))
    sections = []
    for subject, offset in group:
        table = keys.get(subject)
        if year == 2025 and slug == '2-2':
            table = second
        official = {int(n) + offset: key_value(v) for n, v in table.items()} if table else None
        sections.append((subject, subjects[subject], BROKER_LABELS[subject], official, offset))
    return sections, None


SOCIAL_PERIODS = [
    [('human-behavior', 0), ('research', 25)],
    [('practice', 0), ('practice-skills', 25), ('community', 50)],
    [('policy', 0), ('administration', 25), ('law', 50)],
]


def social_periods(year):
    for period, group in enumerate(SOCIAL_PERIODS, 1):
        yield str(period), f'{period}교시', (f'{year}-{period}교시-문제지-A형-*', f'{year}-{period}교시-문제지-*'), group


def social_keys(data, app, year, subjects, group, slug, archive):
    keys = read_json(app / 'scripts/socialworker/answers' / f'{year}.json')['sessions'][slug]
    official = {int(n): key_value(v) for n, v in keys.items()}
    return [(s, subjects[s], subject_label(data, 'social-worker', s), official, offset) for s, offset in group], None


def housing_periods(year):
    yield '1-1', '1차 1교시', (f'{year}-1차-1교시-문제지-A형-*', f'{year}-1차-1교시-문제지-*'), [('accounting', 0), ('facilities', 0)]
    yield '1-2', '1차 2교시', (f'{year}-1차-2교시-문제지-A형-*', f'{year}-1차-2교시-문제지-*'), [('civil-law', 0)]
    yield '2', '2차', (f'{year}-2차-문제지-고화질-*', f'{year}-2차-문제지-A형-*'), [('housing-law', 0), ('housing-admin', 0)]


def housing_keys(data, app, year, subjects, group, slug, archive):
    names = {'accounting': '회계원리', 'facilities': '공동주택시설개론', 'civil-law': '민법',
             'housing-law': '주택관리관계법규', 'housing-admin': '공동주택관리실무'}
    key_dir = 'answers2' if slug == '2' else 'answers'
    keys = read_json(app / 'scripts/housing' / key_dir / f'{year}.json')
    short = None
    if slug == '2':
        source = matches(archive / str(year), f'{year}-2차-최종정답-주관식-*.pdf')
        if source:
            keys_by_form = re.split(r'^\s*□', page_text(source), flags=re.M)[1:]
            short = {}
            for block in keys_by_form:
                if '(B형)' in block.partition('\n')[0].replace(' ', ''):
                    continue
                numbered_blanks = r'^[ \t]*(49|[5-7][0-9]|80)[ \t]*$\n(?=[ \t]*ㄱ[ \t]*:)'
                fields = re.split(numbered_blanks, block, flags=re.M) if year == 2023 else [block]
                if len(fields) == 1:
                    fields = re.split(r'^\s*(49|[5-7][0-9]|80)\s*$', block, flags=re.M)
                for number, text in zip(fields[1::2], fields[2::2]):
                    short.setdefault(number, text)
    sections = [(s, subjects[s], names[s], {int(n): key_value(v) for n, v in keys[names[s]].items()}, offset)
                for s, offset in group]
    return sections, short


def discover(data, home):
    yield from single_subject_editions(data, home, 'public-service', 'ox-admin-quiz-app', 'admin', '9급 공무원')
    yield from single_subject_editions(data, home, 'english', 'englishbomgichul', 'english', '9급 공무원 영어')
    yield from single_subject_editions(data, home, 'gugeo', 'gugeobomgichul', 'gugeo', '9급 공무원 국어')
    yield from single_subject_editions(data, home, 'firefighter', 'firebomgichul', 'fire', '소방공무원 공개채용')
    yield from history_editions(data, home)
    yield from qnet_editions(data, home, 'real-estate', 'bomgichul-release/rel4/civil', 'broker', '공인중개사',
                            broker_periods, broker_keys)
    yield from qnet_editions(data, home, 'social-worker', 'socialworkerbomgichul', 'social', '사회복지사 1급',
                            social_periods, social_keys)
    yield from qnet_editions(data, home, 'housing', 'housingbomgichul', 'housing', '주택관리사보',
                            housing_periods, housing_keys)
    for track, title, subjects, aliases in (
        ('haengjeongsa', '행정사', ['minbeop', 'haengjeongbeop', 'haengjeonghak'], {}),
        ('sanan', '산업안전지도사', ['sanbeop', 'sanil', 'gieop'], {}),
        ('sonhae', '손해평가사', ['sangbeop', 'nongeoeop', 'nonghak'], {'sangbeop': '상법'}),
    ):
        yield from qnet_editions(data, home, track, f'{track}bomgichul', track, title,
                                standard_periods(subjects), transcribed_keys(track, aliases))
    for track, title, periods, aliases in (
        ('semusa', '세무사', elective_periods(['jaejeonghak', 'sebeopgaeron'], ['hoegyegaeron'],
          [('minbeop', '민법'), ('sangbeop', '상법'), ('haengjeongsosong', '행정소송법')]), {}),
        ('nomusa', '공인노무사', labor_periods,
          {'nodong1': '노동법1', 'nodong2': '노동법2'}),
    ):
        yield from qnet_editions(data, home, track, f'{track}bomgichul', track, title,
                                periods, transcribed_keys(track, aliases))
    for track, title, periods, options in (
        ('gyeongbi', '경비지도사', security_periods, 4),
        ('gamjeong', '감정평가사', appraisal_periods, 5),
        ('mullyu', '물류관리사', logistics_periods, 5),
        ('youth', '청소년상담사', youth_periods, 5),
    ):
        yield from qnet_editions(data, home, track, f'{track}bomgichul', track, title,
                                periods, image_key_loader(track), options)



def standard_periods(subjects):
    def periods(year):
        yield '1', '1차', (f'{year}-1차-문제지-A형-*', f'{year}-1차-문제지-*'), [(s, 0) for s in subjects]
    return periods


def elective_periods(first, second_common, choices):
    def periods(year):
        yield '1-1', '1차 1교시', (f'{year}-1차-1교시-문제지-A형-*', f'{year}-1차-1교시-문제지-*'), [(s, 0) for s in first]
        for subject, name in choices:
            group = [*second_common, subject]
            patterns = (f'{year}-1차-2교시-{name}-문제지-A형-*',
                        f'{year}-1차-2교시-{name}-문제지-*',
                        f'{year}-1차-2교시-문제지-{name}-*')
            yield f'1-2-{subject}', f'1차 2교시 {name}', patterns, [(s, 0) for s in group]
    return periods


def transcribed_keys(track, aliases):
    def load(data, app, year, subjects, group, slug, archive):
        sections = []
        tables = [doc for f in (app / 'data/answers').glob('*.json')
                  if isinstance(doc := read_json(f), dict) and doc.get('year') == year]
        keys = tables[0].get('forms', {}).get('A', tables[0].get('answers', {})) if len(tables) == 1 else {}
        for subject, offset in group:
            questions = subjects[subject]
            label = subject_label(data, track, subject)
            table = keys.get(aliases.get(subject, label))
            if isinstance(table, list):
                table = dict(enumerate(table, min(q['questionNo'] for q in questions)))
            official = {int(n): key_value(value) for n, value in table.items()} if table else None
            sections.append((subject, questions, label, official, offset))
        return sections, None
    return load


def labor_periods(year):
    choices = [('gyeongyeong', '경영학개론'), ('gyeongje', '경제학원론')]
    if year >= 2024:
        yield from elective_periods(['nodong1', 'nodong2'], ['minbeop', 'sahoeboheom'], choices)(year)
        return
    common = [('nodong1', 0), ('nodong2', 0), ('minbeop', 0), ('sahoeboheom', 0)]
    for subject, label in choices:
        yield f'1-{subject}', f'1차 {label}', (
            f'{year}-1차-{label}-문제지-A형-*',
            f'{year}-1차-{label}-문제지-*',
        ), [*common, (subject, 0)]


def security_periods(year):
    yield '1', '1차', (f'{year}-1차-문제지-A형-*', f'{year}-1차-문제지-*'), [('beophak', 0), ('mingan', 0)]
    for subject, name in (
        ('sobang', '소방학'),
        ('beomjoe', '범죄학'),
        ('gyeongho', '경호학'),
        ('gigye', '기계경비개론'),
        ('gigyeseolgye', '기계경비기획및설계'),
    ):
        yield f'2-{subject}', f'2차 {name}', (
            f'{year}-2차-{name}-문제지-A형-*',
            f'{year}-2차-{name}-문제지-*',
        ), [('gyeongbibeop', 0), (subject, 0)]


def appraisal_periods(year):
    groups = [['minbeop', 'gyeongje', 'budongsan'], ['beopgyu', 'hoegye']]
    for period, subjects in enumerate(groups, 1):
        yield f'1-{period}', f'1차 {period}교시', (
            f'{year}-1차-{period}교시-문제지-A형-*',
            f'{year}-1차-{period}교시-문제지-*',
        ), [(subject, 0) for subject in subjects]


def logistics_periods(year):
    groups = [['gwalli', 'unsong', 'gukje'], ['bogwan', 'beopgyu']]
    for period, subjects in enumerate(groups, 1):
        yield str(period), f'{period}교시', (
            f'{year}-1차-{period}교시-문제지-A형-*',
            f'{year}-1차-{period}교시-문제지-*',
        ), [(subject, 0) for subject in subjects]


def youth_periods(year):
    groups = [
        (1, 1, ['g1_sagye', 'g1_beop', 'g1_yeongu']),
        (1, 2, ['g1_bihaeng', 'g1_seong', 'g1_yakmul', 'g1_wigi']),
        (2, 1, ['g2_iron', 'g2_yeongu', 'g2_cheukjeong', 'g2_isang']),
        (2, 2, ['g2_jinro', 'g2_jipdan', 'g2_gajok', 'g2_hakeop']),
        (3, 1, ['g3_baldal', 'g3_jipdan', 'g3_cheukjeong', 'g3_sangdam']),
        (3, 2, ['g3_hakseup', 'g3_ihae', 'g3_suryeon']),
    ]
    for level, period, subjects in groups:
        prefix = f'{year}-1차-{level}급-{period}교시'
        yield f'{level}g-{period}', f'{level}급 {period}교시', (
            f'{prefix}-문제지-A형-*', f'{prefix}-문제지-*',
        ), [(subject, 0) for subject in subjects]


@lru_cache(maxsize=None)
def file_sha256(path):
    return sha256(path.read_bytes()).hexdigest()


def image_key_loader(track):
    # Answer tables read from the official PDFs, keyed by archive filename and
    # its digest so a changed source file can never silently reuse a reading.
    tables = read_json(Path(__file__).with_name('exam-print-image-keys.json'))[track]

    def load(data, app, year, subjects, group, slug, archive):
        verified = tables.get(str(year), {})
        key_type = 'official'
        if track == 'gyeongbi' and slug.startswith('2-'):
            key_type = 'mechanical' if group[1][0] in ('gigye', 'gigyeseolgye') else 'general'
        sections = []
        for subject, offset in group:
            record = verified.get(key_type, {}).get(subject)
            official = None
            if record:
                path = archive / str(year) / record['source']
                if path.is_file() and file_sha256(path) == record['sha256']:
                    first = record['firstQuestion']
                    official = {n + offset: key_value(key) for n, key in enumerate(record['answers'], first)}
            sections.append((subject, subjects[subject], subject_label(data, track, subject), official, offset))
        return sections, None
    return load
