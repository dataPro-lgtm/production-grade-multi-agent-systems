from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
MANIFEST = ROOT / "i18n" / "manifest.json"
LOCALES = ("en", "ja")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def is_localized(path: Path) -> bool:
    return any(path.name.endswith(f".{locale}.md") for locale in LOCALES)


def localized_path(path: Path, locale: str) -> Path:
    return path.with_name(f"{path.stem}.{locale}{path.suffix}")


def build_manifest() -> dict[str, object]:
    pages = []
    source_pages = sorted(
        path for path in DOCS.rglob("*.md") if not is_localized(path)
    )
    for source in source_pages:
        entry: dict[str, object] = {
            "source": source.relative_to(ROOT).as_posix(),
            "source_sha256": digest(source),
            "translations": {},
        }
        translations = entry["translations"]
        assert isinstance(translations, dict)
        for locale in LOCALES:
            target = localized_path(source, locale)
            if not target.exists():
                raise FileNotFoundError(
                    f"Missing {locale} translation for {source.relative_to(ROOT)}"
                )
            translations[locale] = {
                "path": target.relative_to(ROOT).as_posix(),
                "sha256": digest(target),
            }
        pages.append(entry)
    return {
        "version": 1,
        "source_locale": "zh",
        "locales": list(LOCALES),
        "page_count": len(pages),
        "pages": pages,
    }


def serialized_manifest() -> str:
    return f"{json.dumps(build_manifest(), ensure_ascii=False, indent=2)}\n"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Create or verify the deterministic translation manifest."
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Fail when i18n/manifest.json does not match the current editions.",
    )
    args = parser.parse_args()
    expected = serialized_manifest()
    if args.check:
        if not MANIFEST.exists() or MANIFEST.read_text(encoding="utf-8") != expected:
            print(
                "Translation manifest is stale. "
                "Run python scripts/update_translation_manifest.py.",
                file=sys.stderr,
            )
            return 1
        print("Translation manifest is current.")
        return 0

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(expected, encoding="utf-8")
    print(f"Wrote {MANIFEST.relative_to(ROOT)}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
