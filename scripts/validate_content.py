from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
CONTENT_DIRS = (DOCS, ROOT / "examples", ROOT / "sources")
MARKDOWN_LINK = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")


def target_path(source: Path, raw_target: str) -> Path | None:
    target = raw_target.strip().split(maxsplit=1)[0].strip("<>")
    if not target or target.startswith(("#", "http://", "https://", "mailto:")):
        return None
    target = unquote(target.split("#", 1)[0])
    return (source.parent / target).resolve()


def main() -> int:
    errors: list[str] = []
    markdown_files = sorted(
        set(ROOT.glob("*.md")).union(
            *(content_dir.rglob("*.md") for content_dir in CONTENT_DIRS)
        )
    )

    for path in markdown_files:
        text = path.read_text(encoding="utf-8")
        prose = re.sub(r"```.*?```", "", text, flags=re.DOTALL)
        headings = re.findall(r"^# (.+)$", prose, flags=re.MULTILINE)
        if len(headings) != 1:
            errors.append(f"{path.relative_to(ROOT)}: expected exactly one H1, found {len(headings)}")

        for match in MARKDOWN_LINK.finditer(prose):
            target = target_path(path, match.group(1))
            if target is not None and not target.exists():
                errors.append(
                    f"{path.relative_to(ROOT)}: missing local target {match.group(1)}"
                )

    if errors:
        print("\n".join(errors))
        return 1

    print(f"Content validation passed for {len(markdown_files)} Markdown files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
