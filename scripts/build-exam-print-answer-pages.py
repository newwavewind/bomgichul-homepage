"""Extract each print edition’s answer pages with commentary removed."""
from pathlib import Path
import json
import fitz

root = Path(__file__).resolve().parents[1]
source = root / "public/exam-print"
output = root / "public/exam-print-answer-pages"
editions = json.loads((root / "src/data/exam-print-editions.json").read_text())
output.mkdir(exist_ok=True)
manifest = {}

for name in sorted(set(editions.values())):
    with fitz.open(source / name) as original:
        first = next(page for level, label, page in original.get_toc() if level == 1 and label == "정답표") - 1
        last = first
        while last + 1 < len(original) and "정답표 계속" in original[last + 1].get_text():
            last += 1
        original_page = original[last]
        credits = [
            line for line in original_page.get_text("blocks")
            if any(source in line[4] for source in (
                "공식 공개 시험지 · 봄기출 문항별 해설",
                "최종정답 출처 한국산업인력공단",
                "공개 정답표 출처 한국교육과정평가원",
            ))
        ]
        # The layout starts the first explanation 19pt below the credit baseline.
        # Use the credit's glyph boundary, before any explanation ink.
        if len(credits) != 1:
            raise ValueError(f"{name}: missing or ambiguous answer credit")
        cutoff = credits[0][3] + 4 * min(
            original_page.rect.width, original_page.rect.height
        ) / 595.2756
        with fitz.open() as answers:
            answers.insert_pdf(original, from_page=first, to_page=last, links=False)
            for index, page in enumerate(answers):
                if index == len(answers) - 1:
                    page.add_redact_annot(fitz.Rect(0, cutoff, page.rect.width, page.rect.height), fill=False)
                for suffix in page.search_for("과 해설"):
                    page.add_redact_annot(suffix, fill=False)
                for suffix in page.search_for("문항별 해설"):
                    page.add_redact_annot(suffix, fill=False)
                for *bounding_box, line, _number, _kind in page.get_text("blocks"):
                    if line.strip().startswith("해설 ") and bounding_box[1] > page.rect.height * 0.93:
                        page.add_redact_annot(fitz.Rect(bounding_box), fill=False)
                page.apply_redactions(images=2, graphics=2, text=0)
                text = page.get_text()
                if "정답표" not in text or any(line.strip() == "해설" for line in text.splitlines()):
                    raise ValueError(f"{name}: answer-only text validation failed")
            answers.save(output / name, garbage=4, deflate=True, no_new_id=True)
        manifest[name] = first

(root / "src/data/exam-print-answer-pages.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
print(f"Prepared {len(manifest)} editions")
