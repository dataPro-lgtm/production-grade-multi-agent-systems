# 全书目录

全书共十章，分为三个部分。章节之间不是知识点的堆叠，而是一条连续的工程主线：**判断边界 → 建立控制 → 形成系统 → 证明质量 → 完成交付**。

## 第一部分：架构与执行边界 { #part-one }

先回答“该不该 Agent 化”，再解决“怎样行动”和“怎样协作”。

| 章 | 主题 | 读者带走的核心产物 |
|---|---|---|
| [01](../chapters/01-what-is-an-ai-agent.md) | **到底什么才算 AI Agent？**<br>从目标闭环、自治等级和真实工程边界开始判断。 | Agent 判定表、自治等级、架构阶梯 |
| [02](../chapters/02-tool-calling-state-machine-and-mcp.md) | **让 Agent 安全地行动**<br>把工具调用放入可持久化、可恢复的状态机。 | 工具合同、状态机、幂等与 MCP 边界 |
| [03](../chapters/03-multi-agent-patterns-collaboration-and-incident-response.md) | **让多个 Agent 可靠协作**<br>按领域、状态、权限和故障边界选择协作模式。 | 模式决策记录、协作合同、事件响应机制 |

## 第二部分：上下文与生产底座 { #part-two }

让系统获得正确证据，并在真实基础设施与安全约束中运行。

| 章 | 主题 | 读者带走的核心产物 |
|---|---|---|
| [04](../chapters/04-context-engineering-agentic-rag-and-graphrag.md) | **让模型只看到正确的上下文**<br>治理检索、授权、版本、证据和上下文预算。 | Context Pack、Agentic RAG、GraphRAG 设计画布 |
| [05](../chapters/05-production-infrastructure-observability-and-recovery.md) | **从“能启动”到“可恢复”**<br>建立部署、可观测性、可靠性与恢复闭环。 | 运行契约、SLO、状态所有权、恢复演练 |
| [06](../chapters/06-agent-security-tool-guard-privacy-and-red-teaming.md) | **不要指望模型保护自己**<br>用确定性边界限制被操纵模型的影响范围。 | Tool Guard、隐私审计、红队与安全验收 |

## 第三部分：合龙、验证与交付 { #part-three }

把组件合成系统，用证据证明质量，并建立上线后的运营与交付闭环。

| 章 | 主题 | 读者带走的核心产物 |
|---|---|---|
| [07](../chapters/07-layered-multi-agent-supervisor-a2a-mcp-context-graph.md) | **从组件拼装到系统合龙**<br>贯通 Supervisor、A2A、MCP、状态与证据。 | 分层架构、Context Graph、端到端验收契约 |
| [08](../chapters/08-multi-agent-evaluation-golden-dataset-and-continuous-regression.md) | **从“看起来不错”到“可以证明”**<br>评估随机执行链，而不只看最终文本。 | Golden Dataset、分层指标、N-run、回归门禁 |
| [09](../chapters/09-agentops-incident-diagnosis-resilience-and-continuous-optimization.md) | **上线只是运营的第一天**<br>围绕用户目标诊断、控制、恢复和持续优化。 | 目标级 SLO、因果诊断、运行控制、ORR |
| [10](../chapters/10-capstone-system-acceptance-and-open-source-delivery.md) | **交付的不是 Demo，而是一套证据**<br>让独立评审者能够追溯、复现并继续维护。 | Evidence Package、Release Gates、开源交付契约 |

## 贯穿全书的系统

十章共享一条逐步演进的业务线索：系统从受约束的数据分析任务出发，进入支付事故调查与 C-102 理赔调查，并在第 03—10 章逐渐补齐协作、证据、平台、安全、评测、运营和交付能力。读者看到的不是十个彼此孤立的 Demo，而是一个生产系统如何一步步获得可信边界。

[开始阅读第 01 章](../chapters/01-what-is-an-ai-agent.md){ .md-button .md-button--primary }
[查看工程模板](../toolkit/agent-definition-card.md){ .md-button }
