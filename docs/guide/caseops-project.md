# 贯穿项目：CaseOps

CaseOps 是本书独立维护的生产导向参考系统：

[打开 CaseOps 代码仓库](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops){ .md-button .md-button--primary }

书稿与代码采用双仓库结构。书稿仓库负责解释问题、推导判断和组织阅读；代码仓库负责运行时、测试、容器、CI、安全与版本发布。正文只引用已经验证的 tag 或 commit，不复制一份容易失真的源码快照。

## 当前代码版本

| 项目 | 值 |
|---|---|
| 当前章节里程碑 | `chapter-10-slice-9` |
| 发布版本 | `v1.0.0` |
| 固定提交 | `d52f0e0` |
| 运行方式 | Docker Compose |
| 服务 | FastAPI、A2A HTTP+JSON、MCP Streamable HTTP、PostgreSQL 17、OTel Collector、Tempo、Prometheus、Grafana |
| 许可 | MIT |

[查看 CaseOps v1.0.0 正式版本](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/tree/v1.0.0)

## 已交付的十个切片

### Slice 0：确定性基线

第 1 章的 C-102 调查由确定性领域内核完成：

1. 从鉴权结果获得租户身份；
2. 在租户边界内读取案件；
3. 锁定案件提交时适用的规则版本；
4. 判断缺失材料并生成补件通知草稿；
5. 在同一事务中保存调查结果、审计事件和 Outbox 事件。

固定版本为 [`chapter-01-slice-0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/tree/chapter-01-slice-0)。它判断缺少 `ACCIDENT_CERTIFICATE`，为后续 Agent 化提供正确性、成本和复杂度基线。

### Slice 1：受控 Agent 与 MCP 工具面

第 2 章加入第一个受约束 Investigation Agent：

1. Planner 每轮只提出一个工具或终态；
2. 运行时校验 Schema、allowlist、scope、风险和案件边界；
3. 独立 MCP Server 暴露四个只读工具；
4. 短期任务令牌绑定租户、任务、主体、scope 和 audience；
5. 每次状态迁移与工具调用持久化；
6. timeout、有限 retry、step budget 和动作指纹阻止失控；
7. 只读工具支持从崩溃窗口安全恢复；
8. 未结构化的“道路交通事故认定书”归一为 `ACCIDENT_CERTIFICATE`。

最终结论为 `DOCUMENTS_COMPLETE_AFTER_NORMALIZATION`。这不是用模型替换规则，而是让 Planner 决定下一步查什么，规则和证据仍由确定性工具提供。

### Slice 2：受治理的多 Agent 协作

第 3 章没有把 Slice 1 机械复制三份，而是先明确必须分离的控制边界：

1. Supervisor 拥有全局目标、截止时间、委托账本和最终结果；
2. coverage、document、risk 三个专业 Agent 只回答各自受限问题；
3. A2A 1.0 承载 `DelegationTask` 与 `SpecialistResult`，服务端持久化协议 Task；
4. 每个 Agent 使用绑定任务与最小 scope 的短期令牌，通过 MCP 读取事实；
5. Evidence Join 用 quorum、必需专家、证据前缀和冲突规则确定性收敛；
6. 运行开始、三个委托完成和全局完成产生五个 CloudEvents 1.0 Outbox 事件；
7. C-102 的高金额、短保单期限触发人工复核，但系统不执行拒赔、冻结或通知。

这条链路明确区分三类状态：A2A Task 管协议生命周期，Delegated Task 管业务委托，CloudEvent 管跨服务事实。最终结果是 `COMPLETE_WITH_REVIEW_REQUIRED`，执行事实是 `side_effect = none`。

### Slice 3：受治理的 Context Pack

第 4 章把检索系统纳入 Agent 控制面：

1. Source Registry 登记 Owner、分类、刷新 SLA 和 Parser Version；
2. Knowledge Object 保留来源版本、有效时间、ACL、用途、Locator 与内容哈希；
3. Planner 只允许结构化查询、PostgreSQL 全文检索和显式 Graph Path Template；
4. 多通道候选使用 RRF 融合，避免混加不可比较的原始分数；
5. Context Builder 执行 Scope、用途、时态、完整性、信任、去重与预算门禁；
6. Evidence Sufficiency 按必要证据类型计算缺口，并把补检索限制为两轮；
7. 三条关键 Claim 均绑定 Context Pack 内的 Evidence ID；
8. 历史规则和包含提示注入的外部邮件被确定性拒绝，并保留 Context Trace。

当前 Hybrid 是结构化、全文和图路径的真实组合。Vector Channel 已进入类型合同，但在真实领域语料、固定 Embedding 版本、ACL 策略和可复现评测就绪前不默认启用。

### Slice 4：可执行的生产运行保证

第 5 章没有用更多 YAML 冒充生产化，而是把四类保证做成可失败的验收：

1. API、A2A、MCP 统一解析并传播 W3C Trace Context；
2. 相对 timeout 在入口变成绝对 deadline，下游只使用剩余预算；
3. startup、liveness、readiness 分离，数据库失败与可选依赖降级语义不同；
4. OpenTelemetry Collector 汇聚 Span，Tempo 重建跨服务因果链；
5. Prometheus 使用低基数 SLI、记录规则和可执行告警，Grafana 预置运行看板；
6. 验收真实停止 A2A，确认 API 存活且 readiness 降级，再恢复服务；
7. PostgreSQL custom-format 备份附带 revision、大小与 SHA-256 清单；
8. 隔离恢复比较源库与恢复库内容签名，并验证租户 `tenant-demo` 的 `C-102` 业务不变量。

这份本地平台切片证明运行合同能够执行，不把单机恢复时间或本地阈值表述成企业生产 RTO / SLO。

### Slice 5：模型之外的安全控制面

第 6 章不把安全责任交给另一个模型，而是让执行路径保持确定性边界：

1. 五个只读工具分别绑定版本、定义摘要、scope、purpose、资源类型、分类、风险和副作用；
2. MCP 工具执行前统一经过默认拒绝的 ToolGuard；
3. 有效权限取用户、工作负载与本次委托 scope 的交集；
4. 短期令牌绑定 tenant、task、audience、workload、purpose 和 case resource；
5. 工具定义、scope 或风险声明漂移会拒绝执行；
6. 每次允许和拒绝都写入摘要化安全审计，不复制 Prompt、参数和工具载荷；
7. OutputGuard 最小化邮箱与手机号，阻断合成 canary secret 和未获准的 Restricted 数据；
8. 11 个版本化红队样例与一条真实恶意协作目标共同验证零越权副作用。

这一切只证明当前实现边界。仓库没有把开发用 HS256 任务令牌写成企业 IdP，也没有把正则检测写成完整 DLP。

### Slice 6：分层系统合龙与 Runtime Context Graph

第 7 章没有再增加一个“万能 Agent”，而是把既有 Context Team 与 Collaboration Team 合成一个可验收系统：

1. Central Supervisor 创建并验证三步无环 DAG；
2. Context Team 交付 Context Pack 与证据绑定主张；
3. Collaboration Team 通过真实 A2A → MCP 链调度 Coverage、Document、Risk；
4. 系统 Reducer 核对规则版本、材料状态、风险门禁、证据与副作用；
5. `system_runs`、`system_steps` 持久化父子运行、依赖、尝试与结果摘要；
6. Runtime Context Graph 连接 Goal、Plan、Step、Task、Claim、Evidence、Acceptance 与 Result；
7. 图只保留引用、分类与 SHA-256 摘要，不复制原始 Prompt 和业务载荷；
8. 相同幂等键重放不会重复创建系统运行、子运行和来源图。

C-102 通过 7 项系统检查，最终为 `SYSTEM_ACCEPTED_WITH_HUMAN_REVIEW`。这表示系统证明人工复核是必要门禁，不表示系统执行了任何外部动作。

### Slice 7：Golden Dataset 与系统级发布门禁

第 8 章没有为评测另造一条简化路径，而是直接对 Slice 6 的真实 API、A2A → MCP 协作链、PostgreSQL 和 Runtime Context Graph 做回归：

1. Golden Dataset、Quality Contract 与 v0.7.0 Baseline 分别版本化；
2. 5 类场景执行 13 次独立 HTTP 运行；
3. 契约、结果、路径、证据、安全与效率六层分别评分；
4. 每条成功运行都验证三步 DAG、七项验收与 Claim → Evidence 图不变量；
5. 另一租户访问每个成功运行的 Context Graph 必须得到 404；
6. N-run 对排除运行身份和时间戳后的语义指纹做一致性检查；
7. Candidate 与 Baseline 按 Case、按 Layer 成对比较，硬门禁不可互相抵扣；
8. CI 以 JSON Artifact 留存每个 Trial 的诊断与发布结论。

当前 conformance 执行器是确定性的。这 13 次运行验证控制面和系统路径稳定，不冒充真实随机模型的总体分布评测。

### Slice 8：事故证据、资源归因与恢复验证

第 9 章没有增加一个自由阅读日志的“事故分析 Agent”，而是把运行诊断做成显式、幂等、租户隔离的持久化产品：

1. 只有终态系统运行能够生成 `caseops.operational-assessment.v1`；
2. 报告固定影响、事实时间线、首个失败点、证据清单、资源归因、控制建议与版本快照；
3. 诊断从 `system_runs`、`system_steps` 下钻到 `collaboration_runs`、`delegated_tasks`；
4. Incident Bundle 只保存引用、摘要和数量，不复制 Prompt、工具参数或业务载荷；
5. 步骤尝试、Context Run、委托尝试和安全决策分别记账，不混加不同单位；
6. 没有 token 用量和版本化价格表时，货币成本明确为 `null`；
7. GameDay 真实停止 A2A，验证三个委托任务受控失败、首故障位于协作层、外部副作用为 0；
8. 恢复 A2A 后执行新系统运行，必须重新得到健康评估；
9. CI 留存基线、事故和恢复三份评估组成的版本化 JSON 证据。

一次实测留下 3 份运行评估、12 条资源成本事件和 3 条审计记录；工程测试 62 项全部通过，含分支统计的覆盖率为 85.99%。

### Slice 9：干净环境复现与可验证发布

第 10 章没有继续增加业务 Agent，而是关闭从源码到消费者的交付证据链：

1. Python 基础镜像固定到不可变 digest，运行时与开发依赖分别由带哈希的锁文件约束；
2. 终审只从已提交的 `git archive HEAD` 构建，不读取 `.env`、本地数据库、缓存和历史报告；
3. 干净镜像验证 UID 10001、包版本、OCI version、源码 revision 和迁移头；
4. Syft 扫描实际运行镜像并生成 SPDX 2.3 JSON SBOM；
5. Release Evidence Manifest 绑定 Commit、镜像 Digest、OpenAPI、评测、GameDay、SBOM 与文件摘要；
6. GitHub Release Workflow 重跑完整门禁，再推送 GHCR 镜像和下载包；
7. 镜像获得构建来源与 SBOM Attestation，下载包获得独立来源 Attestation；
8. `gh attestation verify` 与 `SHA256SUMS` 让消费者不依赖作者口头说明即可验证来源和完整性。

这个切片明确保留边界：SBOM 不是漏洞报告，Attestation 也不是安全认证。它们让“包含什么”和“从哪里构建”可验证，是否接受剩余风险仍由消费者和业务 Owner 决定。

## 运行当前切片

```bash
git clone https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops.git
cd production-grade-multi-agent-caseops
git checkout v1.0.0

docker compose up --build --wait --wait-timeout 120 -d
make acceptance-chapter-08
make acceptance-chapter-09
make acceptance-chapter-10
```

三道最终门禁依次证明系统质量、事故恢复和干净环境交付。第十章成功终态为：

```text
clean-room runtime import accepted
chapter 10 accepted: clean archive -> pinned image -> non-root runtime
-> SPDX SBOM -> checksummed release evidence
```

详细命令、证据清单和消费者验证见 [第 10 章运行手册](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/blob/v1.0.0/docs/chapter-10-runbook.md)。事故诊断与恢复仍可单独执行 `make acceptance-chapter-09`。

## 为什么不把它叫 Demo

当前仓库包含：

- API、PostgreSQL 与 Alembic 迁移；
- 租户查询边界、请求幂等、审计与 Outbox；
- 显式 Agent 状态机、检查点与工具执行账本；
- MCP Streamable HTTP、Bearer 校验和 DNS Rebinding 防护；
- 官方 A2A Python SDK、Agent Card、Task Store 与 Bearer 任务令牌；
- Supervisor、三个专业 Agent、类型化委托与确定性 Evidence Join；
- CloudEvents 1.0 信封和事务性 Outbox；
- Source Registry、PostgreSQL FTS、受限图路径、RRF 与 Context Gates；
- 版本化 Context Pack、逐 Claim 证据绑定和逐候选 Context Trace；
- Conformance Planner 与 OpenAI Responses API 适配器；
- Prometheus 指标、健康检查和结构化日志；
- 非 root、只读根文件系统、capabilities 全移除的容器；
- Ruff、Mypy strict、pytest、分支覆盖率、Bandit 和 pip-audit；
- API → A2A → MCP → PostgreSQL 端到端验收；
- Context Pipeline → PostgreSQL FTS / Graph → Context Pack 端到端验收；
- W3C Trace Context、绝对 deadline 和跨服务 Trace 验收；
- Collector、Tempo、Prometheus、Grafana 可观测性栈；
- 依赖降级、备份清单、隔离恢复和业务不变量验证。
- Tool Security Manifest、三层权限交集、purpose/resource 绑定与默认拒绝的 ToolGuard；
- 摘要化安全决策、OutputGuard、11 项红队与间接提示注入隔离验收。
- 类型化系统 DAG、父子运行、跨团队确定性验收与 Runtime Context Graph；
- 系统级幂等重放、Claim-Evidence 图不变量与第 7 章容器验收。
- 版本化 Golden Dataset、Quality Contract、成对 Baseline 和六层确定性 Grader；
- 13 次 Live HTTP N-run、跨租户图探测、语义指纹与 CI 评测 Artifact。
- 持久化运行评估、跨层首故障重建、最小 Incident Bundle 与版本快照；
- 可核验资源数量归因、A2A 故障注入、恢复后 Goal 复验与 CI GameDay Artifact。
- 带哈希依赖锁、固定基础镜像、干净 Git 归档和非 root 运行时终审；
- SPDX SBOM、Release Evidence Manifest、SHA-256 校验、GHCR 与 Artifact Attestation。

这仍不等于“替任何企业完成生产认证”。真实身份提供方、完整 OAuth 2.1、经过领域评测的向量检索、跨进程 Supervisor 恢复、异步长任务入口、Broker 消费端、真实流量容量目标、PITR、跨区域灾备和在线模型评测仍是后续交付。未完成的能力会写成限制，不写成承诺。

## 十章如何共用一个仓库

`main` 始终保持可运行；每章发布一个不可变里程碑 tag。读者既可以按 tag 逐章观察系统演进，也可以在 `main` 查看当前完整实现。

| 章节 | 主要代码增量 |
|---|---|
| 1 | 确定性领域内核、API、事务、审计、Outbox |
| 2 | 工具状态机、MCP、超时、熔断与只读恢复 |
| 3 | Supervisor、委托、并行与 Join Contract |
| 4 | Context Pipeline、RAG 2.0、GraphRAG 与证据 |
| 5 | 平台化部署、遥测、SLO 与恢复 |
| 6 | Tool Guard、权限交集、隐私释放、安全审计和红队 |
| 7 | 分层 DAG、团队合龙、系统验收与 Runtime Context Graph |
| 8 | Golden Dataset、N-run 与持续回归 |
| 9 | AgentOps、事件诊断和成本治理 |
| 10 | Clean-room 验收、SBOM 和发布来源证明 |
