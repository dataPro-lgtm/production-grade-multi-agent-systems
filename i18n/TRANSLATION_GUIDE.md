# Translation Guide

This file is the editorial contract for the English and Japanese editions of
the book. Chinese is the source of truth. A translation may improve sentence
order and idiom, but it must not add claims, remove constraints, or change
technical meaning.

## Edition titles

- English: *Production-Grade Multi-Agent Systems: From Architectural Judgment to Engineering Delivery*
- Japanese: 『プロダクショングレード・マルチエージェントシステム：アーキテクチャ判断からエンジニアリング実装まで』

## Editorial voice

- Preserve the author's first-person point of view.
- Write for engineers, architects, platform and security teams, and technical
  leaders. Keep the explanation approachable without flattening the technical
  distinctions.
- Prefer natural technical prose over literal sentence-by-sentence translation.
- Preserve the progression from concept, to principle, to decision method, to
  CaseOps implementation, to acceptance evidence.
- Do not add generic AI marketing language, invented case studies, or claims
  not present in the source.
- In English, use direct sentences and sentence-case headings.
- In Japanese, use natural technical Japanese in the です・ます style for
  reader-facing explanation. Avoid repeatedly writing 私は when the subject is
  clear.

## Structure and code

- Preserve Markdown structure, heading levels, front matter, tables,
  admonitions, footnotes, links, image paths, and HTML attributes.
- Preserve URLs, repository paths, version numbers, commit hashes, commands,
  identifiers, API fields, JSON/YAML keys, metrics, equations, and protocol
  names exactly.
- Keep fenced code executable. Do not translate identifiers or string values
  whose change would alter behavior. Translate only explanatory code comments
  when doing so is clearly safe.
- Translate image alt text and reader-facing table content.
- Keep the product name `CaseOps` and standards such as `MCP`, `A2A`, `RAG`,
  `GraphRAG`, `OpenTelemetry`, `SBOM`, and `SLSA` unchanged.

## Canonical terminology

| Chinese source | English | Japanese |
|---|---|---|
| 生产级 | production-grade | 本番運用級 |
| 多 Agent / 多智能体 | multi-agent | マルチエージェント |
| Agent | agent / Agent when used as a named architectural role | Agent |
| 架构判断 | architectural judgment | アーキテクチャ判断 |
| 工程落地 | engineering delivery | エンジニアリング実装 |
| 架构边界 | architectural boundary | アーキテクチャ境界 |
| 控制面 | control plane | コントロールプレーン |
| 数据面 | data plane | データプレーン |
| 工具调用 | tool calling | ツール呼び出し |
| 受控执行 | controlled execution | 制御された実行 |
| 状态机 | state machine | ステートマシン |
| 幂等 / 幂等性 | idempotent / idempotency | 冪等 / 冪等性 |
| 副作用 | side effect | 副作用 |
| 上下文工程 | context engineering | コンテキストエンジニアリング |
| 上下文包 | context pack | コンテキストパック |
| 证据链 | evidence chain | エビデンスチェーン |
| 可信上下文 | trustworthy context | 信頼できるコンテキスト |
| 系统合龙 | system integration | システム統合 |
| 纵深防御 | defense in depth | 多層防御 |
| 红队验证 | red-team validation | レッドチーム検証 |
| 可观测性 | observability | オブザーバビリティ |
| 故障恢复 | failure recovery | 障害復旧 |
| 质量工程 | quality engineering | 品質エンジニアリング |
| 分层评测 | layered evaluation | レイヤー別評価 |
| 持续回归 | continuous regression testing | 継続的回帰テスト |
| 发布门禁 | release gate | リリースゲート |
| 验收证据 | acceptance evidence | 受け入れ検証エビデンス |
| 事件诊断 | incident diagnosis | インシデント診断 |
| 系统韧性 | system resilience | システムレジリエンス |
| 成本治理 | cost governance | コストガバナンス |
| 开源治理 | open-source governance | オープンソースガバナンス |
| 转人工 | hand off to a human | 人間へ引き継ぐ |
| 人工复核 | human review | 人手レビュー |

## Canonical chapter titles

Use `Chapter NN: Title` for English H1 headings and quote the same value in
YAML front matter because it contains an ASCII colon. Use `第NN章　タイトル`
for Japanese H1 headings and `第NN章 タイトル` in front matter.

| Chapter | English | Japanese |
|---|---|---|
| 01 | The Nature of Agents and Architectural Boundaries | Agentの本質とアーキテクチャ境界 |
| 02 | Tool Calling: State Machines, Control Planes, and MCP | ツール呼び出し：ステートマシン、コントロールプレーン、MCP |
| 03 | Multi-Agent Collaboration: Architecture Patterns, Protocols, and Incident Response | マルチエージェント協調：アーキテクチャパターン、プロトコル、インシデント対応 |
| 04 | Context Engineering: Agentic RAG, GraphRAG, and Evidence Chains | コンテキストエンジニアリング：Agentic RAG、GraphRAG、エビデンスチェーン |
| 05 | Production Foundations: Deployment, Observability, and Failure Recovery | 本番基盤：デプロイ、オブザーバビリティ、障害復旧 |
| 06 | Agent Security: Defense in Depth, Tool Guard, and Red-Team Validation | Agentセキュリティ：多層防御、Tool Guard、レッドチーム検証 |
| 07 | System Integration: Supervisor, A2A, MCP, and the Context Graph | システム統合：Supervisor、A2A、MCP、Context Graph |
| 08 | Quality Engineering: Golden Datasets, Layered Evaluation, and Continuous Regression | 品質エンジニアリング：Golden Dataset、レイヤー別評価、継続的回帰テスト |
| 09 | AgentOps: Incident Diagnosis, System Resilience, and Cost Governance | AgentOps：インシデント診断、システムレジリエンス、コストガバナンス |
| 10 | System Delivery: Acceptance Evidence, Release Gates, and Open-Source Governance | システムデリバリー：受け入れ検証エビデンス、リリースゲート、オープンソースガバナンス |

## Quality bar

Every localized page must:

1. contain exactly one H1 and preserve all source headings in the same order;
2. preserve every code fence, image reference, link target, footnote definition,
   table, and mathematical expression;
3. contain no unexplained Chinese prose, except proper names or literal test
   data that must remain unchanged;
4. use the canonical terms above consistently;
5. read as an authored technical book, not as raw machine translation.

## Build compatibility

Run `./scripts/validate.sh` for the release build. After the strict MkDocs
build, `scripts/postprocess_site.py` mirrors the canonical multilingual sitemap
into the non-default locale directories. This prevents MkDocs Material from
requesting missing locale-level sitemap URLs while preserving the single
canonical sitemap and its `hreflang` alternates.
