---
title: 生产就绪与恢复契约
description: 可复制的状态所有权、服务运行、部署验证和恢复演练模板
---

# 生产就绪与恢复契约

本模板用于把“服务可以启动”转成可以验证的生产保证。建议每个服务先填写 Service Runtime Contract，每种持久状态填写 State Ownership Catalog，再由平台负责人维护 Deployment Verification 和 Restore Drill Record。

!!! tip "使用原则"
    不要把整份模板交给模型自动填满后直接归档。每一个 Owner、SLO、RPO、RTO、降级策略和恢复不变量都需要对应团队确认，并在目标环境留下验证证据。

## 1. State Ownership Catalog

```yaml
state_id: task-checkpoint
description: Agent Task Graph、步骤状态、审批与恢复游标

ownership:
  business_owner: agent-platform
  runtime_writer: orchestration-service
  oncall: platform-oncall
  source_of_truth: postgres.agent_tasks
  other_writers_allowed: false

contract:
  schema_version: 42
  consistency: transactional
  ordering_scope: task_id
  durability: durable
  immutable_fields:
    - task_id
    - created_at
  pii_classification: internal
  residency: cn-east

dependencies:
  upstream:
    - gateway
  downstream:
    - worker
    - audit-export
  derived_views:
    - task_search_index

recovery:
  rebuildable: false
  backup_method: base-backup-plus-wal
  backup_interval: continuous
  retention: 35d
  rpo: 5m
  rto: 30m
  restore_order: 2
  runbook: runbooks/restore-task-store.md
  invariants:
    - completed tasks do not re-execute side effects
    - pending tasks resume from the latest valid checkpoint
    - approval decisions remain bound to the original policy version

deletion:
  retention: 365d
  tombstone_propagation:
    - task_search_index
    - audit_export
```

### Catalog 评审问题

- 冲突时谁有最终裁决权？
- 是否存在两个服务都认为自己可以写入？
- 派生索引能否从 SoT 完整重建？
- 删除、权限和更正怎样传播？
- 备份是否包含 Schema、密钥版本和依赖对象？
- RPO / RTO 是否有最近一次演练证据？

## 2. Service Runtime Contract

```yaml
service:
  name: evidence-worker
  owner: knowledge-platform
  repository: org/agent-platform
  image: registry.example/evidence-worker@sha256:...
  build_revision: git:a6d42f1
  runtime: python-3.13
  run_as_non_root: true
  read_only_root_filesystem: true

interfaces:
  inbound:
    - protocol: queue
      contract: evidence-index-requested.v3
  outbound:
    - target: object-store
      operation: read-source
    - target: vector-store
      operation: upsert-index

identity:
  workload_identity: evidence-worker
  secrets:
    - name: vector-store-credential
      delivery: secret-manager
      rotation_slo: 24h
  permissions:
    - object:read:knowledge-source
    - vector:write:knowledge-index

startup:
  config_schema: worker-config.v5
  compatible_db_schema: ">=42,<44"
  migrations_run_by_service: false
  max_startup_seconds: 90
  failure_classes:
    - CONFIG_INVALID
    - SECRET_UNAVAILABLE
    - SCHEMA_INCOMPATIBLE

health:
  startup:
    path: /health/startup
    success: config-valid-and-client-initialized
  liveness:
    path: /health/live
    success: event-loop-progressing
  readiness:
    path: /health/ready
    hard_dependencies:
      - queue
      - object-store
    degradable_dependencies:
      - telemetry-collector

shutdown:
  stop_receiving_new_work: true
  checkpoint_inflight_work: true
  release_lease: true
  grace_period_seconds: 120

budgets:
  max_task_seconds: 600
  max_attempts: 5
  max_concurrency: 20
  max_queue_age_seconds: 300
  max_embedding_tokens_per_task: 100000

reliability:
  idempotency_key: source_id-plus-content_hash-plus-index_version
  retry_owner: worker
  retryable_errors:
    - RATE_LIMITED
    - TEMPORARY_UNAVAILABLE
  non_retryable_errors:
    - INVALID_SCHEMA
    - PERMISSION_DENIED
  backoff: exponential-with-full-jitter
  dlq: evidence-index-dlq

telemetry:
  trace_spans:
    - worker.consume
    - source.read
    - embedding.batch
    - vector.upsert
  metrics:
    - worker_tasks_total
    - worker_task_duration_seconds
    - worker_retry_total
    - worker_queue_age_seconds
  forbidden_attributes:
    - source_content
    - access_token
    - user_id

slo:
  indicator: valid index jobs completed within 5 minutes
  objective: 99.5%
  window: 28d
  runbook: runbooks/evidence-worker-slo.md
```

## 3. Deployment Verification

### 3.1 构建与供应链

- [ ] 镜像使用 Digest 或不可变版本；
- [ ] 基础镜像和语言依赖已锁定；
- [ ] SBOM 已生成并归档；
- [ ] 漏洞扫描达到发布政策；
- [ ] Secret 不存在于 Git、镜像层和构建日志；
- [ ] Build Revision 可以从运行实例查询；
- [ ] 运行用户、文件系统和 Linux Capability 符合最小权限。

### 3.2 配置与迁移

- [ ] 配置通过类型和范围校验；
- [ ] 当前应用与 Schema 版本兼容；
- [ ] Expand—Migrate—Contract 阶段已声明；
- [ ] 数据回填进度和校验可观测；
- [ ] Prompt、Policy、Model Route、Embedding 和 Index 版本已记录；
- [ ] 回滚时不会读取不兼容数据。

### 3.3 健康与流量

- [ ] Startup Probe 在慢启动上限内通过；
- [ ] Liveness 只检测可通过重启恢复的内部故障；
- [ ] Readiness 能阻止不兼容实例接收流量；
- [ ] 可降级依赖与硬依赖分开；
- [ ] 优雅终止期间不接收新任务；
- [ ] Synthetic Check 验证真实业务路径。

### 3.4 状态与消息

- [ ] 所有持久状态都有唯一 Owner；
- [ ] SoT 与 Derived Index 明确；
- [ ] Consumer 对至少一次投递保持幂等；
- [ ] 队列可观测深度、年龄、Attempt 与 DLQ；
- [ ] 重放需要授权并验证幂等；
- [ ] Checkpoint 能在实例替换后恢复。

### 3.5 可观测与告警

- [ ] Trace 穿过 Gateway、Agent、Tool、Queue 和 DB；
- [ ] Metric Label 不包含高基数或敏感数据；
- [ ] Log 使用稳定错误类别并携带 Trace ID；
- [ ] Dashboard 显示发布和配置变更；
- [ ] 告警连接 Owner、Runbook 与验证动作；
- [ ] SLO 与错误预算政策已获批准。

### 3.6 安全

- [ ] 服务使用独立 Workload Identity；
- [ ] 权限收缩到目标资源与允许动作；
- [ ] 网络默认拒绝并限制出站；
- [ ] Secret 轮换演练通过，旧版本已吊销；
- [ ] Baggage、Trace 和 Log 不含 Secret / PII；
- [ ] 高风险 Tool 需要策略与审批。

## 4. Fault Injection Record

```yaml
experiment_id: fi-model-rate-limit-001
date: 2026-07-23
owner: agent-platform
environment: staging

hypothesis:
  when: primary model route returns 429 for 10 minutes
  system_should:
    - honor retry-after
    - apply bounded jittered retry
    - switch compatible route after retry budget
    - preserve request deadline
    - avoid duplicate tool side effects

injection:
  target: model-gateway
  method: response-fault
  duration: 10m
  blast_radius: test-tenant-only
  abort_condition: production-traffic-detected

observed:
  request_success_rate: 99.2%
  p95_seconds: 74
  retry_amplification: 1.6
  duplicate_side_effects: 0
  alert_fired_seconds: 125
  trace_complete: true

result: passed
evidence:
  dashboard: https://...
  trace_query: https://...
  artifact: s3://...
follow_ups: []
```

## 5. Restore Drill Record

```yaml
drill:
  id: dr-primary-region-loss-001
  scenario: primary-region-loss
  owner: platform-oncall
  started_at: 2026-07-23T01:50:00Z
  completed_at: 2026-07-23T02:07:24Z
  environment: recovery-test

objectives:
  rpo: 5m
  rto: 30m

restore:
  point: 2026-07-23T01:48:28Z
  data_loss_seconds: 92
  service_restore_seconds: 1044
  order:
    - workload-identity
    - postgres
    - object-store
    - queue
    - graph
    - vector-index
    - agent-runtime
    - gateway

versions:
  application: 2.4.1
  db_schema: 42
  tool_contract: v7
  prompt: incident-investigator-v12
  embedding: text-embed-v7
  vector_index: knowledge-2026-07-22
  encryption_key_versions:
    - key-v11
    - key-v12

invariants:
  - name: completed-task-no-replay
    result: passed
    evidence: artifact://...
  - name: pending-task-safe-resume
    result: passed
    evidence: trace://...
  - name: artifact-hash-match
    result: passed
    evidence: report://...
  - name: graph-critical-paths
    result: passed
    evidence: query://...
  - name: vector-source-version-alignment
    result: passed
    evidence: report://...
  - name: synthetic-incident-investigation
    result: passed
    evidence: trace://...

exceptions: []
result: passed
approved_by:
  - platform-owner
  - application-owner
next_drill_due: 2026-10-23
```

## 6. Production Evolution Map

| 本地实现 | 目标平台实现 | 需要补齐的保证 | Owner | 验证证据 |
|---|---|---|---|---|
| Compose Service |  | 多副本、调度、滚动发布 |  |  |
| Named Volume |  | 持久性、复制、备份、恢复 |  |  |
| Local Secret |  | 身份、轮换、审计 |  |  |
| Internal Network |  | 默认拒绝、出站限制 |  |  |
| Local Collector |  | 高可用、缓冲、保留 |  |  |
| Manual Snapshot |  | RPO / RTO 与 Restore Drill |  |  |

## 7. 最终签署

```yaml
release_candidate: 2.4.1
decision: approved | approved-with-conditions | rejected
conditions: []

evidence:
  build: artifact://...
  contract_tests: artifact://...
  migration_test: artifact://...
  synthetic_test: trace://...
  fault_injection: artifact://...
  restore_drill: artifact://...
  slo_dashboard: https://...

signoff:
  application_owner:
  platform_owner:
  security_owner:
  data_owner:
  approved_at:
```

只有当这些字段能回到实际证据时，“生产就绪”才是一项工程结论，而不是会议中的主观判断。
