# 贯穿项目：CaseOps

CaseOps 是本书独立维护的生产导向参考系统：

[打开 CaseOps 代码仓库](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops){ .md-button .md-button--primary }

书稿与代码采用双仓库结构。书稿仓库负责解释问题、推导判断和组织阅读；代码仓库负责运行时、测试、容器、CI、安全与版本发布。正文只引用已经验证的 tag 或 commit，不复制一份容易失真的源码快照。

## 当前代码版本

| 项目 | 值 |
|---|---|
| 章节里程碑 | `chapter-01-slice-0` |
| 发布版本 | `v0.1.0` |
| 固定提交 | `d808a5e` |
| 运行方式 | Docker Compose |
| 主数据库 | PostgreSQL 17 |
| 许可 | MIT |

[查看第 1 章固定代码版本](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/tree/chapter-01-slice-0)

## Slice 0 能做什么

第 1 章的 C-102 调查由确定性领域内核完成：

1. 从鉴权结果获得租户身份；
2. 在租户边界内读取案件；
3. 锁定案件提交时适用的规则版本；
4. 判断缺失材料并生成补件通知草稿；
5. 在同一事务中保存调查结果、审计事件和 Outbox 事件。

系统没有发送通知的端口。`side_effect: none` 不是 Prompt 提醒，而是当前动作空间的代码事实。

## 运行

```bash
git clone https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops.git
cd production-grade-multi-agent-caseops
git checkout chapter-01-slice-0
docker compose up --build -d
```

发起调查：

```bash
curl --fail-with-body \
  --request POST \
  http://localhost:8080/v1/cases/C-102/investigations \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: caseops-local-dev-key' \
  --header 'Idempotency-Key: book-ch01-c102-0001' \
  --data '{"notification_action":"draft"}'
```

预期判断是 `MISSING_REQUIRED_DOCUMENTS`，缺失材料为 `ACCIDENT_CERTIFICATE`。使用相同幂等键再次请求，应返回同一 `investigation_id`，并将 `replayed` 标记为 `true`。

## 为什么不把它叫 Demo

Slice 0 已包含 API、PostgreSQL、Alembic 迁移、租户查询边界、幂等、审计、Outbox、结构化日志、Prometheus 指标、健康检查、非 root 容器、只读根文件系统、严格类型检查、自动化测试和 CI。

这仍不等于“替任何企业完成生产认证”。真实部署还需要接入组织身份、合规要求、容量目标、备份恢复和安全评审。本书会在后续章节逐项加入代码与证据；未完成的能力会写成限制，不写成承诺。

## 十章如何共用一个仓库

`main` 始终保持可运行；每章发布一个不可变里程碑 tag。读者既可以按 tag 逐章观察系统演进，也可以在 `main` 查看当前完整实现。

| 章节 | 主要代码增量 |
|---|---|
| 1 | 确定性领域内核、API、事务、审计、Outbox |
| 2 | 工具状态机、MCP、超时、幂等与恢复 |
| 3 | Supervisor、委托、并行与 Join Contract |
| 4 | Context Pipeline、RAG 2.0、GraphRAG 与证据 |
| 5 | 平台化部署、遥测、SLO 与恢复 |
| 6 | 企业鉴权、Tool Guard、隐私和红队 |
| 7 | 分层多 Agent 系统合龙 |
| 8 | Golden Dataset、N-run 与持续回归 |
| 9 | AgentOps、事件诊断和成本治理 |
| 10 | Clean-room 验收、SBOM 和发布来源证明 |

