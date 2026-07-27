from __future__ import annotations

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

    chapter_files = sorted(CHAPTERS.glob("*.md"))
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

    svg_files = sorted(IMAGES.glob("chapter-*/*.svg"))
    png_files = sorted(IMAGES.glob("chapter-*/*.png"))
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
