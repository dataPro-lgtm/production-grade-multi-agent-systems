from __future__ import annotations

import json
import re
import struct
import sys
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
CHAPTERS = DOCS / "chapters"
IMAGES = DOCS / "assets" / "images"
CONTENT_DIRS = (DOCS, ROOT / "examples", ROOT / "sources")

MARKDOWN_LINK = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
MARKDOWN_IMAGE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")
HTML_LINK = re.compile(r'(?:href|src)="([^"]+)"')
LOCALIZED_MARKDOWN = re.compile(r"\.(en|ja)\.md$")
LOCALES = ("en", "ja")

EXPECTED_CHAPTERS = {
    "01-what-is-an-ai-agent.md": "Agent 的本质与架构边界",
    "02-tool-calling-state-machine-and-mcp.md": "工具调用：状态机、控制面与 MCP",
    "03-multi-agent-patterns-collaboration-and-incident-response.md": "多 Agent 协作：架构模式、协议与事件响应",
    "04-context-engineering-agentic-rag-and-graphrag.md": "上下文工程：Agentic RAG、GraphRAG 与证据链",
    "05-production-infrastructure-observability-and-recovery.md": "生产底座：部署、可观测性与故障恢复",
    "06-agent-security-tool-guard-privacy-and-red-teaming.md": "Agent 安全：纵深防御、Tool Guard 与红队验证",
    "07-layered-multi-agent-supervisor-a2a-mcp-context-graph.md": "系统合龙：Supervisor、A2A、MCP 与 Context Graph",
    "08-multi-agent-evaluation-golden-dataset-and-continuous-regression.md": "质量工程：Golden Dataset、分层评测与持续回归",
    "09-agentops-incident-diagnosis-resilience-and-continuous-optimization.md": "AgentOps：事件诊断、系统韧性与成本治理",
    "10-capstone-system-acceptance-and-open-source-delivery.md": "系统交付：验收证据、Release Gate 与开源治理",
}

EXPECTED_LOCALIZED_CHAPTERS = {
    "en": [
        "The Nature of Agents and Architectural Boundaries",
        "Tool Calling: State Machines, Control Planes, and MCP",
        "Multi-Agent Collaboration: Architecture Patterns, Protocols, and Incident Response",
        "Context Engineering: Agentic RAG, GraphRAG, and Evidence Chains",
        "Production Foundations: Deployment, Observability, and Failure Recovery",
        "Agent Security: Defense in Depth, Tool Guard, and Red-Team Validation",
        "System Integration: Supervisor, A2A, MCP, and the Context Graph",
        "Quality Engineering: Golden Datasets, Layered Evaluation, and Continuous Regression",
        "AgentOps: Incident Diagnosis, System Resilience, and Cost Governance",
        "System Delivery: Acceptance Evidence, Release Gates, and Open-Source Governance",
    ],
    "ja": [
        "Agentの本質とアーキテクチャ境界",
        "ツール呼び出し：ステートマシン、コントロールプレーン、MCP",
        "マルチエージェント協調：アーキテクチャパターン、プロトコル、インシデント対応",
        "コンテキストエンジニアリング：Agentic RAG、GraphRAG、エビデンスチェーン",
        "本番基盤：デプロイ、オブザーバビリティ、障害復旧",
        "Agentセキュリティ：多層防御、Tool Guard、レッドチーム検証",
        "システム統合：Supervisor、A2A、MCP、Context Graph",
        "品質エンジニアリング：Golden Dataset、レイヤー別評価、継続的回帰テスト",
        "AgentOps：インシデント診断、システムレジリエンス、コストガバナンス",
        "システムデリバリー：受け入れ検証エビデンス、リリースゲート、オープンソースガバナンス",
    ],
}


def localized_path(path: Path, locale: str) -> Path:
    return path.with_name(f"{path.stem}.{locale}{path.suffix}")


def base_markdown_files() -> list[Path]:
    return sorted(
        path
        for path in DOCS.rglob("*.md")
        if not LOCALIZED_MARKDOWN.search(path.name)
    )


def markdown_signature(text: str) -> dict[str, object]:
    headings = re.findall(r"^(#{1,6})\s+.+$", text, flags=re.MULTILINE)
    fenced_blocks = re.findall(r"^(```+|~~~+)", text, flags=re.MULTILINE)
    image_targets = [target for _alt, target in MARKDOWN_IMAGE.findall(text)]
    link_targets = [
        match.group(1)
        for match in MARKDOWN_LINK.finditer(text)
        if not match.group(0).startswith("!")
    ]
    html_targets = HTML_LINK.findall(text)
    footnotes = re.findall(r"^\[\^([^\]]+)\]:", text, flags=re.MULTILINE)
    table_separators = re.findall(
        r"^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$", text, flags=re.MULTILINE
    )
    return {
        "headings": headings,
        "fenced_blocks": fenced_blocks,
        "image_targets": image_targets,
        "link_targets": link_targets,
        "html_targets": html_targets,
        "footnotes": footnotes,
        "table_count": len(table_separators),
    }


def local_target(source: Path, raw_target: str) -> Path | None:
    target = raw_target.strip().split(maxsplit=1)[0].strip("<>")
    if not target or target.startswith(("#", "/", "http://", "https://", "mailto:")):
        return None

    target = unquote(target.split("#", 1)[0].split("?", 1)[0])
    resolved = (source.parent / target).resolve()
    candidates = [resolved]

    if target.endswith("/"):
        candidates.append(Path(f"{str(resolved).rstrip('/')}.md"))
    elif not resolved.suffix:
        candidates.append(resolved.with_suffix(".md"))

    return next((candidate for candidate in candidates if candidate.exists()), resolved)


def png_dimensions(path: Path) -> tuple[int, int] | None:
    data = path.read_bytes()[:24]
    if len(data) != 24 or data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    return struct.unpack(">II", data[16:24])


def main() -> int:
    errors: list[str] = []
    referenced_chapter_pngs: set[Path] = set()
    source_docs = base_markdown_files()
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
            errors.append(
                f"{path.relative_to(ROOT)}: expected exactly one H1, found {len(headings)}"
            )

        for alt, raw_target in MARKDOWN_IMAGE.findall(prose):
            if not alt.strip():
                errors.append(f"{path.relative_to(ROOT)}: image has empty alt text")
            target = local_target(path, raw_target)
            if (
                target is not None
                and target.suffix.lower() == ".png"
                and target.parent.name.startswith("chapter-")
            ):
                referenced_chapter_pngs.add(target)

        raw_targets = [match.group(1) for match in MARKDOWN_LINK.finditer(prose)]
        raw_targets.extend(HTML_LINK.findall(prose))
        for raw_target in raw_targets:
            target = local_target(path, raw_target)
            if target is not None and not target.exists():
                errors.append(
                    f"{path.relative_to(ROOT)}: missing local target {raw_target}"
                )

    if len(source_docs) != 26:
        errors.append(
            f"localized editions: expected 26 default-language pages, found {len(source_docs)}"
        )

    for source in source_docs:
        source_text = source.read_text(encoding="utf-8")
        source_signature = markdown_signature(source_text)
        for locale in LOCALES:
            target = localized_path(source, locale)
            if not target.exists():
                errors.append(
                    f"{target.relative_to(ROOT)}: missing {locale} translation"
                )
                continue
            target_text = target.read_text(encoding="utf-8")
            target_signature = markdown_signature(target_text)
            for key, source_value in source_signature.items():
                if target_signature[key] != source_value:
                    errors.append(
                        f"{target.relative_to(ROOT)}: structural drift in {key}"
                    )
            if target_text == source_text:
                errors.append(
                    f"{target.relative_to(ROOT)}: translation is identical to source"
                )

    chapter_files = sorted(
        path
        for path in CHAPTERS.glob("*.md")
        if not LOCALIZED_MARKDOWN.search(path.name)
    )
    if {path.name for path in chapter_files} != set(EXPECTED_CHAPTERS):
        errors.append("docs/chapters: chapter file set does not match the ten-book contract")

    for index, (filename, short_title) in enumerate(EXPECTED_CHAPTERS.items(), start=1):
        path = CHAPTERS / filename
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        expected_frontmatter = f"第 {index:02d} 章 {short_title}"
        expected_h1 = f"第 {index:02d} 章　{short_title}"
        frontmatter_title = re.search(r"^title:\s*(.+)$", text, flags=re.MULTILINE)
        if not frontmatter_title or frontmatter_title.group(1).strip() != expected_frontmatter:
            errors.append(f"{path.relative_to(ROOT)}: front matter title drift")
        if f"# {expected_h1}\n" not in text:
            errors.append(f"{path.relative_to(ROOT)}: H1 title drift")

        for locale in LOCALES:
            localized = localized_path(path, locale)
            if not localized.exists():
                continue
            localized_text = localized.read_text(encoding="utf-8")
            localized_title = EXPECTED_LOCALIZED_CHAPTERS[locale][index - 1]
            if locale == "en":
                expected_frontmatter = f'"Chapter {index:02d}: {localized_title}"'
                expected_h1 = f"Chapter {index:02d}: {localized_title}"
            else:
                expected_frontmatter = f"第{index:02d}章 {localized_title}"
                expected_h1 = f"第{index:02d}章　{localized_title}"
            frontmatter_title = re.search(
                r"^title:\s*(.+)$", localized_text, flags=re.MULTILINE
            )
            if (
                not frontmatter_title
                or frontmatter_title.group(1).strip() != expected_frontmatter
            ):
                errors.append(
                    f"{localized.relative_to(ROOT)}: localized front matter title drift"
                )
            if f"# {expected_h1}\n" not in localized_text:
                errors.append(
                    f"{localized.relative_to(ROOT)}: localized H1 title drift"
                )

    svg_files = sorted(
        path
        for path in IMAGES.glob("chapter-*/*.svg")
        if not re.search(r"\.(?:en|ja)\.svg$", path.name)
    )
    png_files = sorted(
        path
        for path in IMAGES.glob("chapter-*/*.png")
        if not re.search(r"\.(?:en|ja)\.png$", path.name)
    )
    if len(svg_files) != 68 or len(png_files) != 68:
        errors.append(
            f"chapter diagrams: expected 68 SVG and 68 PNG, found "
            f"{len(svg_files)} SVG and {len(png_files)} PNG"
        )

    svg_stems = {path.with_suffix("") for path in svg_files}
    png_stems = {path.with_suffix("") for path in png_files}
    if svg_stems != png_stems:
        errors.append("chapter diagrams: SVG and PNG source pairs do not match")

    expected_pngs = {path.resolve() for path in png_files}
    if referenced_chapter_pngs != expected_pngs:
        missing = sorted(expected_pngs - referenced_chapter_pngs)
        extra = sorted(referenced_chapter_pngs - expected_pngs)
        errors.append(
            "chapter diagrams: chapter references do not match the asset set"
            f" (unreferenced={len(missing)}, unexpected={len(extra)})"
        )

    for path in svg_files:
        text = path.read_text(encoding="utf-8")
        requirements = {
            'data-whiteboard-version="3"': "visual system version",
            'role="img"': "image role",
            '<title id="whiteboard-title">': "accessible title",
            '<desc id="whiteboard-desc">': "accessible description",
            'id="whiteboard-footer"': "book footer",
        }
        for needle, label in requirements.items():
            if needle not in text:
                errors.append(f"{path.relative_to(ROOT)}: missing {label}")
        if text.count('id="whiteboard-footer"') != 1:
            errors.append(f"{path.relative_to(ROOT)}: expected exactly one book footer")

    for path in png_files:
        if png_dimensions(path) != (1600, 900):
            errors.append(f"{path.relative_to(ROOT)}: expected a 1600x900 PNG")

    for locale in LOCALES:
        localized_svgs = sorted(IMAGES.glob(f"chapter-*/*.{locale}.svg"))
        localized_pngs = sorted(IMAGES.glob(f"chapter-*/*.{locale}.png"))
        if len(localized_svgs) != 68 or len(localized_pngs) != 68:
            errors.append(
                f"{locale} chapter diagrams: expected 68 SVG and 68 PNG, found "
                f"{len(localized_svgs)} SVG and {len(localized_pngs)} PNG"
            )
        expected_svg_stems = {
            path.with_suffix("").with_name(f"{path.stem}.{locale}")
            for path in svg_files
        }
        expected_png_stems = {
            path.with_suffix("").with_name(f"{path.stem}.{locale}")
            for path in png_files
        }
        if {path.with_suffix("") for path in localized_svgs} != expected_svg_stems:
            errors.append(f"{locale} chapter diagrams: localized SVG set drift")
        if {path.with_suffix("") for path in localized_pngs} != expected_png_stems:
            errors.append(f"{locale} chapter diagrams: localized PNG set drift")
        for path in localized_svgs:
            text = path.read_text(encoding="utf-8")
            if f'lang="{locale}"' not in text:
                errors.append(f"{path.relative_to(ROOT)}: missing locale metadata")
            if 'data-whiteboard-version="3"' not in text:
                errors.append(
                    f"{path.relative_to(ROOT)}: missing visual system version"
                )
        for path in localized_pngs:
            if png_dimensions(path) != (1600, 900):
                errors.append(
                    f"{path.relative_to(ROOT)}: expected a 1600x900 localized PNG"
                )

        map_root = ROOT / "i18n" / "visuals" / locale
        map_files = sorted(map_root.glob("chapter-*.json"))
        if len(map_files) != 10:
            errors.append(
                f"{locale} visual maps: expected 10 chapter maps, found {len(map_files)}"
            )
        for path in map_files:
            try:
                payload = json.loads(path.read_text(encoding="utf-8"))
            except json.JSONDecodeError as exc:
                errors.append(f"{path.relative_to(ROOT)}: invalid JSON: {exc}")
                continue
            translations = payload.get("translations", {})
            blanks = [
                key
                for key, value in translations.items()
                if not isinstance(value, str) or not value.strip()
            ]
            if blanks:
                errors.append(
                    f"{path.relative_to(ROOT)}: {len(blanks)} untranslated visual strings"
                )

    manifests = sorted(IMAGES.glob("chapter-*/visual-manifest.yml"))
    if len(manifests) != 10:
        errors.append(f"visual manifests: expected 10, found {len(manifests)}")
    for path in manifests:
        text = path.read_text(encoding="utf-8")
        if "../visual-system.yml" not in text:
            errors.append(f"{path.relative_to(ROOT)}: missing central visual specification")

    if any("version-2-editorial-plan" in path.read_text(encoding="utf-8") for path in markdown_files):
        errors.append("reader-facing content still links to the retired editorial plan")

    if errors:
        print("\n".join(errors))
        return 1

    print(
        f"Content validation passed: {len(markdown_files)} Markdown files, "
        "10 chapters, 68 paired whiteboard diagrams."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
