#!/usr/bin/env bash
set -euo pipefail

if [[ -x ".venv/bin/python" ]]; then
  BOOK_PYTHON=".venv/bin/python"
else
  BOOK_PYTHON="python3"
fi

"${BOOK_PYTHON}" scripts/validate_content.py
"${BOOK_PYTHON}" -m mkdocs build --strict

echo "Validation passed: content checks and strict MkDocs build."
