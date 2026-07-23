# 《生产级多智能体系统：从架构判断到工程落地》

一本面向 AI 工程师、数据工程师、架构师与技术负责人的中文开源书。

这本书不从“怎样快速拼出一群 Agent”开始，而从更难也更重要的问题开始：

- 什么任务真的需要 Agent？
- 什么时候确定性工作流比 Agent 更可靠？
- 多 Agent 应该按哪些真实工程边界拆分？
- 怎样把工具、状态、权限、评测、可观测性和故障恢复做成生产系统？

> 当前状态：项目骨架已建立，第 01 章已由原始 Word 讲义转换为可协作的 Markdown。其余章节将按路线图持续填充。

## 在线阅读

在线版：<https://datapro-lgtm.github.io/production-grade-multi-agent-systems/>

仓库使用 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 构建，并通过 GitHub Actions 自动发布。

## 已完成内容

- [第 01 章：到底什么才算 AI Agent？](docs/chapters/01-what-is-an-ai-agent.md)
- [全书目录与写作状态](docs/guide/book-roadmap.md)
- [读者阅读路径](docs/guide/reading-path.md)
- [术语表](docs/appendices/glossary.md)
- [Agent 定义卡](docs/toolkit/agent-definition-card.md)
- [架构决策记录模板](docs/toolkit/architecture-decision-record.md)

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
│   ├── guide/               # 阅读路径与全书路线
│   ├── appendices/          # 术语表等附录
│   ├── toolkit/             # 可复制的工程模板
│   └── assets/              # 图片与样式
├── examples/                # 随书实验和示例代码
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
