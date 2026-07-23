# 《生产级多智能体系统：从架构判断到工程落地》

一本面向 AI 工程师、架构师、平台团队与技术负责人的中文开源书。

本书不从“怎样快速拼出一群 Agent”开始，而是沿着一条完整的工程主线，回答多智能体系统从架构判断到生产交付的关键问题：

- 什么任务真的需要 Agent，自治应该停在哪里？
- 多个 Agent 应该按哪些真实边界拆分和协作？
- 怎样治理工具、状态、上下文、权限与失败恢复？
- 如何用评测、可观测性和证据证明系统可以上线？
- 怎样完成生产运营、系统验收与开源交付？

## 在线阅读

[在线阅读《生产级多智能体系统》](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/)

仓库使用 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 构建，并通过 GitHub Actions 自动发布。

## 全书结构

| 部分 | 章节 | 核心内容 |
|---|---|---|
| 架构与执行边界 | 01—03 | Agent 判定、工具状态机、多 Agent 协作 |
| 上下文与生产底座 | 04—06 | Context Engineering、生产基础设施、纵深防御 |
| 合龙、验证与交付 | 07—10 | 系统合龙、持续评测、AgentOps、开源交付 |

完整章节与每章工程产物见 [全书目录](docs/guide/book-roadmap.md)，按问题和角色进入可参考 [阅读建议](docs/guide/reading-path.md)。

## 随书工程产物

本书配套独立代码仓库 [CaseOps](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops)。它不是按章复制的零散示例，而是一套逐章演进、始终可运行的生产导向参考系统。第 1 章对应版本为 [`chapter-01-slice-0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/tree/chapter-01-slice-0)。

书稿仓库同时提供可直接带回项目使用的架构图、决策方法和工程契约，包括 Agent 定义卡、ADR、Context Engineering 画布、生产就绪与安全评审、Golden Dataset、AgentOps 运营就绪以及 Capstone 验收与开源交付模板。

## 本地预览

需要 Python 3.10 或更高版本：

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
mkdocs serve
```

浏览器打开 `http://127.0.0.1:8000`。

发布前执行严格检查：

```bash
./scripts/validate.sh
```

## 仓库结构

```text
.
├── docs/                    # 网站与书稿正文
│   ├── chapters/            # 正式章节
│   ├── guide/               # 阅读建议与全书目录
│   ├── appendices/          # 术语表等附录
│   ├── toolkit/             # 可复制的工程模板
│   └── assets/              # 图片与样式
├── examples/                # 各章代码版本索引
├── sources/                 # 原始讲义与转换来源
├── scripts/                 # 本地质量检查
├── .github/                 # Issue、PR 与自动发布配置
└── mkdocs.yml               # 开源书站点配置
```

## 如何参与

欢迎提交勘误、案例、实验、图解和章节改进。请先阅读 [贡献指南](CONTRIBUTING.md)。涉及代码讲解时，请按真实文件级执行路径展开，并说明验证方式和失败路径。

## 许可

本书正文、图表与教学材料采用 [CC BY 4.0](LICENSE) 许可。你可以复制、分享和改编，但必须保留合理署名。第三方材料仍遵循其各自许可，详见章节中的引用说明。

作者 / 讲师：DataDan
