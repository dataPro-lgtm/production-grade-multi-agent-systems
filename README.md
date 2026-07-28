# 《生产级多智能体系统：从架构判断到工程落地》

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md)

[![Open Book](https://img.shields.io/badge/在线阅读-Open%20Book-173a63)](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/)
[![Book Build](https://github.com/dataPro-lgtm/production-grade-multi-agent-systems/actions/workflows/pages.yml/badge.svg)](https://github.com/dataPro-lgtm/production-grade-multi-agent-systems/actions/workflows/pages.yml)
[![CaseOps](https://img.shields.io/badge/CaseOps-v1.0.0-2f7d67)](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-d97706)](LICENSE)

一本面向 AI 工程师、架构师、平台与安全团队、技术负责人的开源书，提供简体中文、英文和日文三个完整版本。

本书从一个基础判断出发：系统中的哪一部分，真的需要根据环境反馈自主决定下一步？围绕这个问题，十章依次讨论受控工具调用、多 Agent 协作、上下文工程、生产基础设施、安全、系统合龙、评测、AgentOps 和可验证交付。

[简体中文](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/) ·
[English](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/en/) ·
[日本語](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/ja/) ·
[全书目录](docs/guide/book-roadmap.md) ·
[阅读建议](docs/guide/reading-path.md) ·
[CaseOps 运行指南](docs/guide/caseops-project.md)

## 全书结构

| 部分 | 章节 | 解决的问题 |
|---|---|---|
| 架构判断与执行控制 | 01—03 | 是否需要 Agent，怎样让模型安全行动，多个 Agent 如何可靠协作 |
| 可信上下文与生产保障 | 04—06 | 模型依据什么行动，系统如何运行、恢复并限制安全影响 |
| 系统合龙与持续交付 | 07—10 | 组件如何合成系统，质量如何证明，上线后如何运营并公开交付 |

完整章节：

1. Agent 的本质与架构边界
2. 工具调用：状态机、控制面与 MCP
3. 多 Agent 协作：架构模式、协议与事件响应
4. 上下文工程：Agentic RAG、GraphRAG 与证据链
5. 生产底座：部署、可观测性与故障恢复
6. Agent 安全：纵深防御、Tool Guard 与红队验证
7. 系统合龙：Supervisor、A2A、MCP 与 Context Graph
8. 质量工程：Golden Dataset、分层评测与持续回归
9. AgentOps：事件诊断、系统韧性与成本治理
10. 系统交付：验收证据、Release Gate 与开源治理

## 贯穿项目

[CaseOps](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops) 是本书的独立参考实现。它围绕理赔案件调查构建一条完整业务链，把书中的 Tool Contract、MCP、A2A、Context Graph、Tool Guard、Golden Dataset、AgentOps 和发布证据落实到同一套可运行系统中。

正式版本 [`v1.0.0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0) 提供：

- 锁定依赖与基础镜像 Digest；
- 非 root 容器与干净环境重建；
- 单元、集成、协议、安全、评测和 GameDay 门禁；
- SPDX SBOM、Release Evidence Manifest 与 SHA-256 校验；
- GHCR 镜像及可验证的构建来源证明。

书稿负责讲清概念、原理、权衡和判断方法；CaseOps 负责实现合同、注入失败并提供运行证据。二者分仓维护，通过固定版本互相引用。

## 随书工程材料

本仓库提供 68 张原创架构图和 10 份可复制的工程模板，包括：

- Agent 定义卡、架构决策记录和多 Agent 模式决策记录；
- Context Engineering 画布、生产就绪与安全评审契约；
- 系统合龙、持续评测、AgentOps 和开源交付契约。

架构图同时保留可编辑 SVG 与网页 PNG，采用统一的架构师白板视觉系统。

## 本地阅读

需要 Python 3.10 或更高版本：

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
mkdocs serve
```

浏览器打开 `http://127.0.0.1:8000`，使用页面顶部的语言选择器切换简体中文、English 和日本語。

提交前执行严格检查：

```bash
./scripts/validate.sh
```

## 仓库结构

```text
.
├── docs/
│   ├── chapters/            # 十章正式正文
│   ├── guide/               # 目录、阅读建议与 CaseOps 指南
│   ├── toolkit/             # 可复制的工程契约和检查表
│   ├── appendices/          # 术语、许可与引用
│   └── assets/              # 三语 SVG、PNG 与站点样式
├── i18n/                    # 术语规范、图稿翻译与版本同步清单
├── sources/                 # 原始资料与版本溯源
├── scripts/                 # 内容、图稿和构建校验
├── .github/                 # 贡献流程与自动发布
└── mkdocs.yml               # 站点配置
```

## 参与贡献

欢迎提交勘误、案例、图解和工程改进。请先阅读 [贡献指南](CONTRIBUTING.md)。涉及代码时，请给出真实文件路径、运行方式、失败路径和验证证据。

翻译贡献请遵循 [Translation Guide](i18n/TRANSLATION_GUIDE.md)。中文是内容源，英文文件使用 `.en.md` 后缀，日文文件使用 `.ja.md` 后缀；三种语言必须通过结构、链接、图稿和版本同步校验。

## 许可与作者

本书正文、图表与配套材料采用 [CC BY 4.0](LICENSE) 许可。复制、分享或改编时，请保留合理署名；第三方材料遵循各自许可。

作者：DataDan
