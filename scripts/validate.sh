#!/usr/bin/env bash
set -euo pipefail

if [[ -x ".venv/bin/python" ]]; then
  BOOK_PYTHON=".venv/bin/python"
else
  BOOK_PYTHON="python3"
fi

"${BOOK_PYTHON}" scripts/validate_content.py
"${BOOK_PYTHON}" scripts/update_translation_manifest.py --check
"${BOOK_PYTHON}" -m mkdocs build --strict
"${BOOK_PYTHON}" scripts/postprocess_site.py

echo "Validation passed: content checks and strict MkDocs build."
