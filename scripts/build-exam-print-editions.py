"""Build printable exam editions from local official PDFs and web explanations.

Requires PyMuPDF and ReportLab. Use --archive-home for all supported exam archives,
or --source-dir for the police archive alone.
"""
import argparse
from dataclasses import dataclass
from html import escape
from io import BytesIO
from pathlib import Path
import json
import re

import fitz
from exam_print_sources import discover, question_answers
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.bomgichul.com"
SUBJECTS = {"constitution": ("헌법", 20), "criminal-law": ("형사법", 40), "police-science": ("경찰학", 40)}
ANSWER = ("정답 없음", "①", "②", "③", "④", "⑤")
# These symbols are absent from the website's Noto Sans KR files.
FALLBACK_FONTS = {
    **dict.fromkeys("․ȳᵢ₀₁₂₃₄₅₆₈ₜ₋⁰⁵⁶⁷⁸⁹⁺⁻ⁿ̅✗", "AppSans"),
    **dict.fromkeys("∙∼≒✕", "AppSymbols"),
    "∗": "PrintMath",
    "̂": "PrintMath",
}

# Inclusive source page indices in subject order. Index zero is the shared cover.
ROUNDS = {
    (2022, 1): ((1, 4), (5, 11), (12, 16)),
    (2022, 2): ((1, 4), (5, 12), (12, 17)),
    (2023, 1): ((1, 4), (5, 11), (12, 16)),
    (2023, 2): ((1, 4), (5, 12), (12, 17)),
    (2024, 1): ((1, 4), (5, 11), (12, 16)),
    (2024, 2): ((1, 5), (6, 12), (13, 17)),
    (2025, 1): ((1, 4), (5, 11), (12, 17)),
    (2025, 2): ((1, 4), (5, 11), (12, 16)),
    (2026, 1): ((1, 4), (5, 11), (12, 16)),
}

# Retained rectangles (source PDF coordinates) for pages shared with another
# subject. Keep the original page number and source positions.
FOOTER = (343, 988.79, 385, 1032)
SOURCE_REGIONS = {
    (2022, 2, "criminal-law", 12): ((0, 0, 729, 178.65), FOOTER),
    (2022, 2, "police-science", 12): ((0, 178.65, 729, 1032),),
    (2023, 2, "criminal-law", 12): ((0, 0, 365, 946.16), FOOTER),
    (2023, 2, "police-science", 12): ((365, 0, 729, 946.16), (0, 946.16, 729, 1032)),
    (2023, 2, "police-science", 17): ((0, 0, 365, 988.79), FOOTER),
    (2026, 1, "criminal-law", 11): ((0, 0, 729, 930), (0, 930, 365, 988.79), FOOTER),
}

for font, filename in [("Noto", "NotoSansKR-Regular.ttf"), ("NotoBold", "NotoSansKR-Bold.ttf")]:
    pdfmetrics.registerFont(TTFont(font, str(ROOT / "public/fonts" / filename)))

INK = HexColor("#111C2D")
NAVY = HexColor("#17375E")
MUTED = HexColor("#4B5C71")
LINE = HexColor("#CFD8E4")
PALE = HexColor("#EDF3FA")
BADGE_BG = HexColor("#E8F3FF")
BADGE_INK = HexColor("#0066D6")
RIGHT = HexColor("#20574A")
WRONG = HexColor("#A12840")
MARGIN = 23.25
BASELINE = 52
GUTTER = 11.5
BODY_GAP = 8
BADGE_OFFSET = 23
SOLUTION_INDENT = 45
ROW_GAP = 9
ANSWER_ROW_HEIGHT = 49

@dataclass(frozen=True)
class CommentaryLayout:
    page_size: tuple[float, float] = A4

    @property
    def scale(self):
        # Preserve the typographic proportions on larger sheets and use the
        # full available width on landscape originals.
        return min(self.page_size) / A4[0]

    @property
    def width(self):
        return self.page_size[0] / self.scale

    @property
    def height(self):
        return self.page_size[1] / self.scale

    @property
    def body(self):
        return self.width - 2 * MARGIN

    @property
    def column(self):
        return (self.body - GUTTER) / 2

    @property
    def column_top(self):
        return self.height - 51

    @property
    def answer_columns(self):
        return 15 if self.width > self.height else 10

    @property
    def answers_per_page(self):
        # Keep the answer-sheet source line above the running footer.
        groups = int((self.height - 191 - BASELINE) // ANSWER_ROW_HEIGHT)
        return self.answer_columns * min(8, max(1, groups))


styles = {
    "topic": ParagraphStyle("topic", fontName="Noto", fontSize=8.4, leading=12.25, textColor=MUTED, wordWrap="CJK"),
    "explanation": ParagraphStyle("explanation", fontName="Noto", fontSize=10.25, leading=15.15, textColor=INK, wordWrap="CJK"),
}
for style in styles.values():
    style.alignment = TA_LEFT

def fallback_markup(match):
    text = match[0]
    if text.endswith("̂"):
        # The zero-width accent in PrintMath sits on the capital height.
        # Raise it above the taller Greek letters in these explanations.
        text = text[:-1] + '<super rise="2.5" size="100%">̂</super>'
    return f'<font name="{FALLBACK_FONTS[match[0][-1]]}">{text}</font>'


def paragraph(text, kind, width):
    markup = re.sub(
        r"[αβ]̂|[" + re.escape("".join(FALLBACK_FONTS)) + "]",
        fallback_markup,
        escape(text),
    )
    flowed = Paragraph(markup.replace("\n", "<br />"), styles[kind])
    _, height = flowed.wrap(width, A4[1])
    return flowed, height

def text_at(c, x, y, content, font="Noto", size=9, ink=INK, align="left"):
    c.setFont(font, size)
    c.setFillColor(ink)
    {"left": c.drawString, "right": c.drawRightString, "center": c.drawCentredString}[align](x, y, content)

def render_paragraph(c, flow, x, top):
    p, h = flow
    p.drawOn(c, x, top - h)
    return top - h

def rule(c, x1, x2, y, ink=LINE, width=0.55):
    c.setStrokeColor(ink)
    c.setLineWidth(width)
    c.line(x1, y, x2, y)

def running_header(c, page_number, label, layout):
    c.scale(layout.scale, layout.scale)
    text_at(c, MARGIN, layout.height - 29, "봄기출", "NotoBold", 9, NAVY)
    text_at(c, layout.width - MARGIN, layout.height - 29, label, size=8.2, ink=MUTED, align="right")
    rule(c, MARGIN, layout.width - MARGIN, layout.height - 38)
    rule(c, MARGIN, layout.width - MARGIN, 42)
    text_at(c, MARGIN, 24, "www.bomgichul.com", size=8.1, ink=MUTED)
    c.linkURL(SITE, (MARGIN, 22, MARGIN + 95, 35), relative=1, thickness=0)
    text_at(c, layout.width - MARGIN, 24, f"해설 {page_number:02d}", "NotoBold", 8.4, NAVY, "right")

def answer_page(c, questions, label, exam_name, layout, page_index=0, source_credit=None):
    text_at(c, MARGIN, layout.height - 85, exam_name, "NotoBold", 10, NAVY)
    text_at(c, MARGIN, layout.height - 121, label, "NotoBold", 26, INK)
    text_at(c, MARGIN, layout.height - 149, "정답표" if not page_index else "정답표 계속", "NotoBold", 11, NAVY)
    columns = layout.answer_columns
    unit = layout.body / columns
    groups = (len(questions) + columns - 1) // columns
    for group in range(groups):
        top = layout.height - 161 - ANSWER_ROW_HEIGHT * group
        for j, q in enumerate(questions[group * columns:(group + 1) * columns]):
            x = MARGIN + j * unit
            c.setFillColor(PALE)
            c.rect(x, top - 17, unit, 17, fill=1, stroke=0)
            text_at(c, x + unit / 2, top - 12, str(q["questionNo"]), size=8.7, ink=MUTED, align="center")
            text_at(c, x + unit / 2, top - 34, answer_label(q), "NotoBold",
                    13.2 if len(answer_label(q)) == 1 else 8.0, NAVY, "center")
            if j:
                c.setStrokeColor(LINE)
                c.setLineWidth(.45)
                c.line(x, top - 41, x, top)
        rule(c, MARGIN, layout.width - MARGIN, top - 41)
    note_top = layout.height - 270 - ANSWER_ROW_HEIGHT * (groups - 2)
    text_at(c, MARGIN, note_top, source_credit or "공식 공개 시험지 · 봄기출 문항별 해설", size=8.2, ink=MUTED)
    return note_top - 19

def answer_label(question):
    if question.get("kind") == "subjective":
        return "단답형"
    accepted = question_answers(question)
    if len(accepted) == question.get("optionCount", 5):
        return "전항 정답"
    return " · ".join(ANSWER[number] for number in accepted) if accepted else ANSWER[0]

def prepare(question, layout):
    labels = [question.get("category"), question.get("subcategory")]
    topic = " · ".join(dict.fromkeys(label for label in labels if label))
    answer = answer_label(question)
    accepted = question_answers(question)
    if question.get("comboChoices") and len(accepted) == 1:
        combo = next((choice for choice in question["comboChoices"] if isinstance(choice, dict) and str(choice.get("no")) == str(accepted[0])), None)
        if combo:
            answer += " " + combo["text"]
    if accepted and answer != "전항 정답":
        answer = "정답 " + answer
    answer_width = pdfmetrics.stringWidth(answer, "NotoBold", 9.4)
    topic_width = layout.column - 24 - answer_width - 10
    initial_heading = paragraph(topic, "topic", topic_width)
    continued_heading = paragraph("해설 계속", "topic", topic_width)
    width = layout.column - SOLUTION_INDENT - 4
    rows = []
    if question.get("printAnswerNote"):
        rows.append((None, None, paragraph(question["printAnswerNote"], "explanation", width)))
    summary = question.get("explanationSummary")
    if question.get("kind") == "subjective":
        blanks = question.get("blanks") or []
        solution = "\n".join([*(f"{blank['label']} {blank['answer']}" for blank in blanks), question["explanation"]])
        rows.append((None, None, paragraph(solution, "explanation", width)))
    else:
        if (not accepted or not all(choice.get("explanation") for choice in question["items"])) and summary:
            rows.append((None, None, paragraph(summary, "explanation", width)))
        for choice in question["items"]:
            if choice.get("explanation"):
                solution = paragraph(choice["explanation"], "explanation", width)
                choice_label = choice.get("label") or choice["key"]
                rows.append((choice_label, choice.get("answer"), solution))
        if not rows:
            for choice in question.get("comboChoices") or []:
                if isinstance(choice, dict) and choice.get("explanation"):
                    choice_label = choice.get("label") or ANSWER[int(choice["no"])]
                    mark = "O" if int(choice["no"]) in accepted else "X"
                    rows.append((choice_label, mark, paragraph(choice["explanation"], "explanation", width)))
            if not rows and summary:
                rows.append((None, None, paragraph(summary, "explanation", width)))
    assert rows, question["questionNo"]
    return rows, answer, initial_heading, continued_heading

def heading_height(heading):
    return max(19, heading[1] + 6) + 3

def draw_question(c, number, heading, rows, answer, x, top, layout):
    text_at(c, x, top - 13.2, str(number), "NotoBold", 12.5, NAVY)
    render_paragraph(c, heading, x + 24, top - 3)
    text_at(c, x + layout.column, top - 12.7, answer, "NotoBold", 9.4, NAVY, "right")
    top -= heading_height(heading)
    for choice_label, choice_answer, solution in rows:
        rule(c, x, x + layout.column, top + 2, width=0.36)
        if choice_label:
            text_at(c, x, top - 12.3, choice_label, "NotoBold", 9.6, NAVY)
            if choice_answer:
                text_at(c, x + 12, top - 12.3, choice_answer, "NotoBold", 8.1,
                        RIGHT if choice_answer == "O" else WRONG)
        badge_x = x + BADGE_OFFSET
        c.setFillColor(BADGE_BG)
        c.roundRect(badge_x, top - 16.2, 19, 10.6, 1.5, fill=1, stroke=0)
        text_at(c, badge_x + 9.5, top - 13.5, "해설", "NotoBold", 6.8, BADGE_INK, "center")
        top = render_paragraph(c, solution, x + SOLUTION_INDENT, top - 2) - (ROW_GAP - 2)
    return top

def column_divider(c, body_top, layout):
    c.setStrokeColor(LINE)
    c.setLineWidth(.55)
    c.line(layout.width / 2, BASELINE, layout.width / 2, body_top)

def build_commentary(label, questions, exam_name, answer_title, source_credit=None, page_size=A4):
    layout = CommentaryLayout(page_size)
    assert pdfmetrics.stringWidth(answer_title, "NotoBold", 26) < layout.body, answer_title
    stream = BytesIO()
    expl = canvas.Canvas(stream, pagesize=page_size, pageCompression=1, invariant=1)
    expl.setTitle(f"{label} 기출문제와 해설")
    expl.setAuthor("봄기출")
    page_number = 1
    column_number = 0
    running_header(expl, page_number, label, layout)
    per_page = layout.answers_per_page
    for offset in range(0, len(questions), per_page):
        if offset:
            expl.showPage()
            page_number += 1
            running_header(expl, page_number, label, layout)
        column_top = top = answer_page(expl, questions[offset:offset + per_page], answer_title, exam_name, layout, offset, source_credit)
    column_divider(expl, column_top, layout)
    question_pages = {}

    def next_column():
        nonlocal page_number, column_number, column_top, top
        if column_number == 0:
            column_number = 1
        else:
            expl.showPage()
            page_number += 1
            column_number = 0
            running_header(expl, page_number, label, layout)
            column_top = layout.column_top
            column_divider(expl, column_top, layout)
        top = column_top

    # Read down the left column first and keep each explanation intact.
    for question in questions:
        rows, answer, heading, continued = prepare(question, layout)
        number = question["questionNo"]
        while rows:
            remaining = top - BASELINE - heading_height(heading)
            take = 0
            for _, _, solution in rows:
                remaining -= solution[1] + ROW_GAP
                if remaining < 0:
                    break
                take += 1

            if not take:
                assert top != column_top or column_top < layout.column_top, (label, number)
                next_column()
                continue

            question_pages.setdefault(number, page_number)
            x = MARGIN + column_number * (layout.column + GUTTER)
            top = draw_question(expl, number, heading, rows[:take], answer, x, top, layout) - BODY_GAP
            rows = rows[take:]
            if rows:
                next_column()
                heading = continued
    expl.save()
    return stream.getvalue(), question_pages


def add_source_page(booklet, paper, page_index, regions):
    original = paper[page_index]
    width, height = A4
    page = booklet.new_page(width=width, height=height)
    if regions is None:
        page.show_pdf_page(page.rect, paper, page_index, keep_proportion=True)
        assert original.get_text().strip() == page.get_text().strip(), page_index
        return

    scale = min(width / original.rect.width, height / original.rect.height)
    left = (width - original.rect.width * scale) / 2
    top = (height - original.rect.height * scale) / 2
    for x0, y0, x1, y1 in regions:
        clip = fitz.Rect(x0, y0, x1, y1)
        target = fitz.Rect(left + x0 * scale, top + y0 * scale, left + x1 * scale, top + y1 * scale)
        page.show_pdf_page(target, paper, page_index, clip=clip)


def build_edition(paper, output, year, round_no, subject_id, subject, first, last, questions):
    label = f"{year}년 경찰공무원 {round_no}차 {subject}"
    data, question_pages = build_commentary(label, questions, "경찰공무원 순경 공개채용",
                                           f"{year}년 {round_no}차 {subject} 정답과 해설")
    original_count = last - first + 1
    answer_start = original_count + 1
    title = f"{year}년 경찰공무원 {round_no}차 {subject} 기출문제와 해설"
    with fitz.open(stream=data, filetype="pdf") as commentary, fitz.open() as booklet:
        for page_index in range(first, last + 1):
            regions = SOURCE_REGIONS.get((year, round_no, subject_id, page_index))
            add_source_page(booklet, paper, page_index, regions)
        booklet.insert_pdf(commentary, links=True)
        toc = [
            [1, f"공식 시험지 | {subject} 1~{len(questions)}번", 1],
            [1, "정답표", answer_start],
            [1, "문항별 해설", answer_start],
        ]
        toc += [[2, f"{number}번 해설", original_count + where] for number, where in question_pages.items()]
        booklet.set_toc(toc)
        booklet.set_metadata({
            "title": title, "author": "봄기출",
            "subject": f"공식 시험지 원본 {original_count}쪽 및 {len(questions)}문항 정답·선지별 해설",
        })
        booklet.save(output, garbage=4, deflate=True, no_new_id=True)


def source_file(directory, pattern):
    matches = list(directory.glob(pattern))
    if len(matches) != 1:
        raise ValueError(f"Expected one official source matching {directory / pattern}, found {len(matches)}")
    return matches[0]


def read_answer_rows(path):
    with fitz.open(path) as key:
        lines = [line.strip() for page in key for line in page.get_text().splitlines() if line.strip()]
    start = lines.index("문항")
    row_starts = []
    for number in range(1, 41):
        start = lines.index(str(number), start + 1)
        row_starts.append(start)
    row_starts.append(len(lines))
    return [lines[start + 1:end] for start, end in zip(row_starts, row_starts[1:])]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--source-dir", type=Path, help="Police official exam archive")
    source.add_argument("--archive-home", type=Path, help="Directory containing the exam app repositories")
    parser.add_argument("--output-dir", type=Path, default=ROOT / "public/exam-print")
    parser.add_argument("--manifest", type=Path, default=ROOT / "src/data/exam-print-editions.json")
    parser.add_argument("--app-font-dir", type=Path, help="Override the app's public/fonts/pdf directory")
    parser.add_argument("--math-font", type=Path, default=Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf"),
                        help="TrueType font for the asterisk operator and Greek accents")
    args = parser.parse_args()
    police_root = args.source_dir or args.archive_home / "policebomgichul/public/exam-pdfs/police"
    app_fonts = args.app_font_dir or police_root.parent.parent / "fonts/pdf"
    for font, filename in [("AppSans", "BomPdfSans-Regular.ttf"), ("AppSymbols", "BomPdfSym-Regular.ttf")]:
        pdfmetrics.registerFont(TTFont(font, str(app_fonts / filename)))
    args.output_dir.mkdir(parents=True, exist_ok=True)
    if args.archive_home:
        pdfmetrics.registerFont(TTFont("PrintMath", str(args.math_font)))
        for char, font in FALLBACK_FONTS.items():
            if ord(char) not in pdfmetrics.getFont(font).face.charToGlyph:
                raise ValueError(f"Missing print glyph U+{ord(char):04X} in {font}")
        manifest = build_all(args.archive_home, args.output_dir, police_root)
    else:
        manifest = build_police(police_root, args.output_dir)
    args.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")

def build_police(police_root, output_dir):
    sources = {
        subject: json.loads((ROOT / f"src/data/police/{subject}.json").read_text())["exams"]
        for subject in SUBJECTS
    }
    manifest = {}
    for (year, round_no), bounds in ROUNDS.items():
        source = f"{round_no}차"
        folder = police_root / str(year)
        paper_path = source_file(folder, f"{year}-{source}-문제지-*.pdf")
        # The corrected 2026 first-round key in the archive matches the
        # published answer sheet, including all 100 general recruitment answers.
        key_type = "가답안" if (year, round_no) == (2026, 1) else "최종정답"
        rows = read_answer_rows(source_file(folder, f"{year}-{source}-{key_type}-*.pdf"))
        with fitz.open(paper_path) as paper:
            for index, ((subject_id, (subject, count)), (first, last)) in enumerate(zip(SUBJECTS.items(), bounds)):
                context = (year, source, subject_id)
                questions = sorted(
                    (q for q in sources[subject_id] if q["year"] == year and q["sourceCode"] == source),
                    key=lambda q: q["questionNo"],
                )
                assert [q["questionNo"] for q in questions] == list(range(1, count + 1)), context
                for question, row in zip(questions, rows):
                    number = question["questionNo"]
                    assert question["items"] and all(choice.get("explanation") for choice in question["items"]), (context, number)
                    official = row[index if number <= 20 else index - 1]
                    assert answer_label(question) == official, (context, number, official)
                filename = f"police-{subject_id}-{year}-{round_no}.pdf"
                build_edition(paper, output_dir / filename, year, round_no, subject_id, subject, first, last, questions)
                manifest[f"police/{subject_id}/{year}/{source}"] = filename
                print(f"{filename} | {count} questions")
    return manifest


def build_all(archive_home, output_dir, police_root):
    manifest = build_police(police_root, output_dir)
    for edition in discover(ROOT / "src/data", archive_home):
        filename = edition.filename
        questions = edition.questions
        build_other_edition(edition, output_dir / filename)
        for url_key in edition.routes:
            manifest.setdefault(url_key, filename)
        print(f"{filename} | {len(questions)} questions", flush=True)
    return manifest



def match_paper_size(pdf):
    sizes = {(page.rect.width, page.rect.height) for page in pdf}
    widths, heights = zip(*sizes)
    if len(sizes) == 1:
        return next(iter(sizes))
    # Some originals contain slightly different measurements for the same
    # sheet. Enlarge those page boxes by less than a point without scaling ink.
    if (max(widths) - min(widths) < 1 and max(heights) - min(heights) < 1
            and all(not page.rotation and page.mediabox == page.cropbox == page.rect for page in pdf)):
        size = max(widths), max(heights)
        for page in pdf:
            if (page.rect.width, page.rect.height) != size:
                page.set_mediabox(fitz.Rect(0, 0, *size))
        return size
    return pdf[-1].rect.width, pdf[-1].rect.height


def build_other_edition(edition, output):
    questions = edition.questions
    label = edition.label
    answer_title = f"{edition.edition_name} 정답과 해설"
    qnet_tracks = {'gyeongbi', 'gamjeong', 'mullyu', 'youth', 'nomusa'}
    track = edition.routes[0].split('/', 1)[0]
    credit = '시험지·최종정답 출처 한국산업인력공단 큐넷 · 해설 봄기출' if track in qnet_tracks else None
    if edition.filename in ('public-service-gyoyukhak-2017-local.pdf', 'public-service-gyoyukhak-2018-local.pdf'):
        credit = '시험지·공개 정답표 출처 한국교육과정평가원 · 해설 봄기출'
    with fitz.open(edition.paper) as paper, fitz.open() as pdf:
        pdf.insert_pdf(paper, links=True)
        paper_pages = len(pdf)
        page_size = match_paper_size(pdf)
        data, question_pages = build_commentary(label, questions, edition.exam_name, answer_title, credit, page_size)
        with fitz.open(stream=data, filetype="pdf") as commentary:
            pdf.insert_pdf(commentary, links=True)
        first_explanation = min(question_pages.values())
        toc = [[1, "공식 시험지", 1], [1, "정답표", paper_pages + 1],
               [1, "문항별 해설", paper_pages + first_explanation]]
        toc += [[2, f"{number}번 해설", paper_pages + where] for number, where in question_pages.items()]
        pdf.set_toc(toc)
        pdf.set_metadata({"title": f"{label} 기출문제와 해설", "author": "봄기출"})
        pdf.save(output, garbage=4, deflate=True, no_new_id=True)

if __name__ == "__main__":
    main()
