# 变更记录

本项目遵循“内容可追溯、结构变更可解释”的原则记录版本。

## [Unreleased]

### Added

- 建立 Material for MkDocs 开源书骨架；
- 增加 GitHub Pages 自动构建与发布工作流；
- 将第 01 课 Word 讲义转换为 Markdown，并按图书叙事重构第 01 章；
- 增加 5 幅可编辑、可追溯的白板手绘风原创架构图；
- 将第 02 周 Word 讲义重构为“工具调用、状态机、持久化与 MCP”正式章节；
- 增加 6 幅第 02 章可编辑白板手绘风原创架构图；
- 将第 03 周 Word 讲义重构为“多 Agent 架构模式、协作合同与事件响应”正式章节；
- 增加 6 幅第 03 章可编辑白板手绘风原创架构图及确定性生成脚本；
- 增加可直接复用的多 Agent 模式决策记录（PDR）模板；
- 将第 04 周 Word 讲义重构为“Context Engineering、Agentic RAG 与 GraphRAG”正式章节；
- 增加 6 幅第 04 章可编辑白板手绘风原创架构图及确定性生成脚本；
- 增加 Context Inventory、Source Manifest、Evidence、Retrieval Plan、Context Pack 与分段评测设计画布；
- 将第 05 周 Word 讲义重构为“生产基础设施、可观测性与故障恢复”正式章节；
- 增加 6 幅第 05 章可编辑白板手绘风原创架构图及确定性生成脚本；
- 增加 State Ownership Catalog、Service Runtime Contract、Deployment Verification、Fault Injection 与 Restore Drill 生产就绪契约；
- 将第 06 周 Word 讲义重构为“多 Agent 纵深防御、Tool Guard、隐私审计与红队验证”正式章节；
- 增加 6 幅第 06 章可编辑白板手绘风原创安全架构图及确定性生成脚本；
- 增加 Threat Record、Tool Security Manifest、Bound Approval、Delegation、Audit、Red-Team Case 与 Security Acceptance 安全评审契约；
- 将第 07 周 Word 讲义重构为“分层多 Agent、Supervisor、A2A、MCP 与 Context Graph 系统合龙”正式章节；
- 增加 6 幅第 07 章可编辑白板手绘风原创系统合龙架构图及确定性生成脚本；
- 增加 Layer Registry、Capability Snapshot、Plan、A2A Dispatch、MCP Tool、State Ownership、Join、Context Graph、Failure Drill 与 System Acceptance 合龙契约；
- 将第 08 周 Word 讲义重构为“多 Agent 评测、Golden Dataset、分层指标、Judge、N-run 与持续回归”正式章节；
- 增加 6 幅第 08 章可编辑白板手绘风原创评测架构图及确定性生成脚本；
- 增加 Quality Contract、Golden Entry、Fixture、Evaluator、Judge Calibration、N-run、Regression Gate、Eval Report 与 Quality Incident 持续回归契约；
- 将第 09 周 Word 讲义重构为“AgentOps、事件诊断、运行控制、韧性、成本与持续优化”正式章节；
- 增加 6 幅第 09 章可编辑白板手绘风原创运营架构图及确定性生成脚本；
- 增加 Goal Outcome、Tier 1 / Tier 2 指标、Incident Bundle、Control Action、恢复、成本、GameDay 与 ORR 生产运营契约；
- 将第 10 周 Word 讲义重构为“Capstone 系统验收、Evidence Package、发布门禁与 GitHub 开源交付”正式章节；
- 增加 6 幅第 10 章可编辑白板手绘风原创验收架构图及确定性生成脚本；
- 增加 Charter、Requirement、Traceability、Vertical Slice、Clean-room Reproduction、SBOM / Provenance、Release Gates 与开源治理契约；
- 增加阅读路径、全书路线、术语表和工程模板；
- 增加贡献指南、Issue 模板和质量检查脚本。

### Changed

- 去除第 01 章中的课堂流程、讲师提示、多媒体脚本和练习答案等教案元素；
- 重构第 01 章的案例主线、概念递进、架构判断方法与表格视觉样式。
- 去除第 02 章中的课时安排、讲师演示、多媒体分镜、练习答案和评分 Rubric；
- 去除第 03 章中的学习成果、单元安排、课堂演练、多媒体脚本、作业答案和评分 Rubric；
- 将第 03 章从模式罗列重构为支付事故主线，并补充委托、结果、证据、Join、状态所有权和权限收缩机制；
- 去除第 04 章中的学习成果、单元安排、课时、课堂演练、多媒体脚本、作业和评分 Rubric；
- 将第 04 章接续支付事故主线，并区分“RAG 2.0”概括性称呼、通用 GraphRAG 模式与 Microsoft GraphRAG 具体实现；
- 去除第 05 章中的学习成果、单元安排、课堂推演、多媒体脚本、作业和评分 Rubric；
- 将第 05 章从部署产品与命令罗列重构为平台边界、状态所有权、运行契约、遥测、可靠性与恢复证据链；
- 去除第 06 章中的学习成果、单元安排、课堂攻防、多媒体脚本、作业和评分 Rubric；
- 将第 06 章从控制项罗列重构为间接注入攻击主线，并按 OWASP Agentic Top 10 2026、MCP 2025-11-25 与 A2A 1.0 校准；
- 去除第 07 章中的学习成果、课次安排、演示脚本、作业、评分 Rubric、自测答案和预告；
- 将第 07 章从组件与检查项罗列重构为 C-102 调查主线，并按 A2A 1.0、MCP 2025-11-25 与 OpenTelemetry 当前规范校准；
- 去除第 08 章中的学习成果、课次安排、演示脚本、作业、评分 Rubric、自测答案和预告；
- 将第 08 章从指标与平台罗列重构为“如何证明多 Agent 系统真的变好”的完整质量控制链，并按当前主流离线评测、LLM Judge 与线上监控实践校准；
- 去除第 09 章中的学习成果、课次安排、演示脚本、作业、评分 Rubric、自测答案和课程阶段总结；
- 将第 09 章从 AgentOps 控制项罗列重构为 C-102 上线事故主线，并按当前 OpenTelemetry GenAI、SRE、FinOps、Kubernetes 与韧性演练实践校准；
- 去除第 10 章中的学习成果、课次、课程包、答辩评分、冲刺安排、演示脚本、自测答案和课程总结；
- 将第 10 章从毕业设计任务清单重构为“如何让独立评审者验证并接管系统”的交付证据链，并按当前 GitHub、NIST SSDF、SLSA、OSI 与 Semantic Versioning 实践校准；
- 统一全书目录、阅读指南与贡献标准中的图书化叙事要求。
