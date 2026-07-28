# Production-Grade Multi-Agent Systems: From Architectural Judgment to Engineering Delivery

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md)

[![Open Book](https://img.shields.io/badge/在线阅读-Open%20Book-173a63)](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/)
[![Book Build](https://github.com/dataPro-lgtm/production-grade-multi-agent-systems/actions/workflows/pages.yml/badge.svg)](https://github.com/dataPro-lgtm/production-grade-multi-agent-systems/actions/workflows/pages.yml)
[![CaseOps](https://img.shields.io/badge/CaseOps-v1.0.0-2f7d67)](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-d97706)](LICENSE)

An open-source book for AI engineers, architects, platform and security teams, and technical leaders, available in complete Simplified Chinese, English, and Japanese editions.

The book begins with a fundamental question: which parts of a system truly need to decide their next action autonomously in response to environmental feedback? Across ten chapters, it examines controlled tool calling, multi-agent collaboration, context engineering, production infrastructure, security, system integration, evaluation, AgentOps, and verifiable delivery.

[简体中文](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/) ·
[English](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/en/) ·
[日本語](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/ja/) ·
[Book roadmap](docs/guide/book-roadmap.md) ·
[Reading guide](docs/guide/reading-path.md) ·
[CaseOps guide](docs/guide/caseops-project.md)

## Book structure

| Part | Chapters | Questions addressed |
|---|---|---|
| Architectural judgment and execution control | 01—03 | Do we need an agent? How can models act safely? How can multiple agents collaborate reliably? |
| Trustworthy context and production safeguards | 04—06 | What should guide a model's actions? How can the system operate, recover, and limit the impact of security incidents? |
| System integration and continuous delivery | 07—10 | How do components become a coherent system? How do we demonstrate quality, operate the system in production, and deliver it openly? |

Chapters:

1. The Nature of Agents and Architectural Boundaries
2. Tool Calling: State Machines, Control Planes, and MCP
3. Multi-Agent Collaboration: Architecture Patterns, Protocols, and Incident Response
4. Context Engineering: Agentic RAG, GraphRAG, and Evidence Chains
5. Production Foundations: Deployment, Observability, and Failure Recovery
6. Agent Security: Defense in Depth, Tool Guard, and Red-Team Validation
7. System Integration: Supervisor, A2A, MCP, and the Context Graph
8. Quality Engineering: Golden Datasets, Layered Evaluation, and Continuous Regression
9. AgentOps: Incident Diagnosis, System Resilience, and Cost Governance
10. System Delivery: Acceptance Evidence, Release Gates, and Open-Source Governance

## Companion project

[CaseOps](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops) is the book's standalone reference implementation. Built around claims investigations, it implements a complete business workflow that brings Tool Contract, MCP, A2A, Context Graph, Tool Guard, Golden Dataset, AgentOps, and release evidence together in one runnable system.

The official [`v1.0.0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0) release provides:

- Pinned dependencies and base-image digests;
- Non-root containers and reproducible builds in clean environments;
- Unit, integration, protocol, security, evaluation, and GameDay gates;
- An SPDX SBOM, Release Evidence Manifest, and SHA-256 checksums;
- GHCR images with verifiable build-provenance attestations.

The book explains the concepts, principles, trade-offs, and decision methods. CaseOps implements the contracts, injects failures, and provides runtime evidence. They are maintained in separate repositories and cross-reference each other through pinned releases.

## Companion engineering resources

This repository provides 68 original architecture diagrams and 10 reusable engineering templates, including:

- Agent definition cards, architecture decision records, and multi-agent pattern decision records;
- A Context Engineering canvas, plus production-readiness and security-review contracts;
- Contracts for system integration, continuous evaluation, AgentOps, and open-source delivery.

The architecture diagrams are available as editable SVG files and web-ready PNG files, all using a consistent architect-style whiteboard visual system.

## Read locally

Python 3.10 or later is required:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
mkdocs serve
```

Open `http://127.0.0.1:8000` in a browser, then use the language selector at the top of the page to switch among 简体中文, English, and 日本語.

Run the strict validation suite before committing:

```bash
./scripts/validate.sh
```

## Repository structure

```text
.
├── docs/
│   ├── chapters/            # Final text of all ten chapters
│   ├── guide/               # Roadmap, reading guide, and CaseOps guide
│   ├── toolkit/             # Reusable engineering contracts and checklists
│   ├── appendices/          # Glossary, licenses, and references
│   └── assets/              # Trilingual SVGs, PNGs, and site styles
├── i18n/                    # Terminology, artwork localization, and version-sync checklists
├── sources/                 # Source materials and version provenance
├── scripts/                 # Content, artwork, and build validation
├── .github/                 # Contribution workflows and automated publishing
└── mkdocs.yml               # Site configuration
```

## Contributing

Corrections, case studies, diagrams, and engineering improvements are welcome. Please read the [contribution guide](CONTRIBUTING.md) first. For code contributions, include the actual file paths, run instructions, failure paths, and validation evidence.

Translation contributions must follow the [Translation Guide](i18n/TRANSLATION_GUIDE.md). Chinese is the source of truth; English files use the `.en.md` suffix, and Japanese files use the `.ja.md` suffix. All three editions must pass structure, link, artwork, and version-synchronization checks.

## License and author

The book's text, diagrams, and companion materials are licensed under [CC BY 4.0](LICENSE). When copying, sharing, or adapting the work, provide appropriate attribution. Third-party materials remain subject to their respective licenses.

Author: DataDan
