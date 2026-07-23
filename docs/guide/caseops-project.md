# 贯穿项目：CaseOps

CaseOps 是本书独立维护的生产导向参考系统：

[打开 CaseOps 代码仓库](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops){ .md-button .md-button--primary }

书稿与代码采用双仓库结构。书稿仓库负责解释问题、推导判断和组织阅读；代码仓库负责运行时、测试、容器、CI、安全与版本发布。正文只引用已经验证的 tag 或 commit，不复制一份容易失真的源码快照。

## 当前代码版本

| 项目 | 值 |
|---|---|
| 当前章节里程碑 | `chapter-03-slice-2` |
| 发布版本 | `v0.3.0` |
| 固定提交 | `e55153d` |
| 运行方式 | Docker Compose |
| 服务 | FastAPI、A2A HTTP+JSON、MCP Streamable HTTP、PostgreSQL 17 |
| 许可 | MIT |

[查看第 3 章固定代码版本](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/tree/chapter-03-slice-2)

## 已交付的三个切片

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

## 运行当前切片

```bash
git clone https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops.git
cd production-grade-multi-agent-caseops
git checkout chapter-03-slice-2

docker compose up --build -d
docker compose ps
make acceptance-chapter-03
```

验收脚本会检查 Agent Card、A2A 鉴权、完整 API → A2A → MCP → PostgreSQL 链路、确定性 Join 和幂等重放。预期：

```text
A2A Agent Card accepted
unauthorized A2A request rejected: HTTP 401
collaboration run accepted: <run_id>
idempotency replay accepted: no specialist redispatch
delegated tasks: 3, outbox events: 5
```

详细命令见 [第 3 章运行手册](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/blob/chapter-03-slice-2/docs/chapter-03-runbook.md)。

## 为什么不把它叫 Demo

当前仓库包含：

- API、PostgreSQL 与 Alembic 迁移；
- 租户查询边界、请求幂等、审计与 Outbox；
- 显式 Agent 状态机、检查点与工具执行账本；
- MCP Streamable HTTP、Bearer 校验和 DNS Rebinding 防护；
- 官方 A2A Python SDK、Agent Card、Task Store 与 Bearer 任务令牌；
- Supervisor、三个专业 Agent、类型化委托与确定性 Evidence Join；
- CloudEvents 1.0 信封和事务性 Outbox；
- Conformance Planner 与 OpenAI Responses API 适配器；
- Prometheus 指标、健康检查和结构化日志；
- 非 root、只读根文件系统、capabilities 全移除的容器；
- Ruff、Mypy strict、pytest、分支覆盖率、Bandit 和 pip-audit；
- API → A2A → MCP → PostgreSQL 端到端验收。

这仍不等于“替任何企业完成生产认证”。真实身份提供方、完整 OAuth 2.1、跨进程 Supervisor 恢复、异步长任务入口、Broker 消费端、容量目标、备份恢复和在线模型评测仍是后续交付。未完成的能力会写成限制，不写成承诺。

## 十章如何共用一个仓库

`main` 始终保持可运行；每章发布一个不可变里程碑 tag。读者既可以按 tag 逐章观察系统演进，也可以在 `main` 查看当前完整实现。

| 章节 | 主要代码增量 |
|---|---|
| 1 | 确定性领域内核、API、事务、审计、Outbox |
| 2 | 工具状态机、MCP、超时、熔断与只读恢复 |
| 3 | Supervisor、委托、并行与 Join Contract |
| 4 | Context Pipeline、RAG 2.0、GraphRAG 与证据 |
| 5 | 平台化部署、遥测、SLO 与恢复 |
| 6 | 企业鉴权、Tool Guard、隐私和红队 |
| 7 | 分层多 Agent 系统合龙 |
| 8 | Golden Dataset、N-run 与持续回归 |
| 9 | AgentOps、事件诊断和成本治理 |
| 10 | Clean-room 验收、SBOM 和发布来源证明 |
