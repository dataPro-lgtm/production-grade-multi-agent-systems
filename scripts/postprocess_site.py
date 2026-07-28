#!/usr/bin/env python3
"""Apply deterministic compatibility fixes to the generated multilingual site."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


DEFAULT_LOCALES = ("en", "ja")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--site-dir",
        type=Path,
        default=Path("site"),
        help="MkDocs output directory (default: site)",
    )
    parser.add_argument(
        "--locales",
        nargs="+",
        default=DEFAULT_LOCALES,
        help="Non-default locale directories (default: en ja)",
    )
    args = parser.parse_args()

    sitemap = args.site_dir / "sitemap.xml"
    sitemap_gzip = args.site_dir / "sitemap.xml.gz"
    if not sitemap.is_file():
        parser.error(f"generated sitemap not found: {sitemap}")

    copied: list[str] = []
    for locale in args.locales:
        locale_dir = args.site_dir / locale
        if not locale_dir.is_dir():
            parser.error(f"generated locale directory not found: {locale_dir}")

        shutil.copyfile(sitemap, locale_dir / sitemap.name)
        copied.append(str(locale_dir / sitemap.name))
        if sitemap_gzip.is_file():
            shutil.copyfile(sitemap_gzip, locale_dir / sitemap_gzip.name)
            copied.append(str(locale_dir / sitemap_gzip.name))

    print(f"Site post-processing complete: {', '.join(copied)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
