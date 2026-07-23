---
title: 多 Agent 系统合龙与验收契约
description: 用于分层多 Agent 系统的层级、能力、计划、A2A、MCP、状态、Context Graph、故障与验收设计
---

# 多 Agent 系统合龙与验收契约

这份模板用于把“多个 Agent 可以调用”推进到“一个系统可以发布”。建议由业务 Owner、Agent 平台、领域团队、安全、SRE 和评测负责人共同填写。

不要一次性填满所有栏目。先选择一条真实的垂直业务链路，建立合同和验收证据，再扩展团队与能力。

## 1. 文档元数据

```yaml
document:
  system_id: ""
  version: "0.1.0"
  status: draft
  owner: ""
  reviewers:
    business: ""
    architecture: ""
    security: ""
    sre: ""
  created_at: ""
  updated_at: ""
  related_adrs: []
  repositories: []
```

## 2. System Mission

```yaml
mission:
  user_problem: ""
  target_users: []
  business_outcome: ""
  in_scope:
    - ""
  out_of_scope:
    - ""
  forbidden_outcomes:
    - unauthorized_side_effect
    - cross_tenant_data_access
  success_definition:
    - ""
```

必须回答：

- 为什么不是确定性工作流？
- 为什么不是单 Agent？
- 多 Agent 带来的收益能否被评测？
- 如果降级为单 Agent 或只读模式，哪些业务价值仍保留？

## 3. 分层决策

| 判断轴 | 证据 | 是否需要独立边界 | Owner |
|---|---|---|---|
| 领域实体与规则 |  |  |  |
| 数据与租户 |  |  |  |
| 工具与副作用 |  |  |  |
| 权限与审批 |  |  |  |
| 扩缩容与部署 |  |  |  |
| 发布生命周期 |  |  |  |
| 故障半径 |  |  |  |
| 时延预算 |  |  |  |

```yaml
architecture_decision:
  selected_shape: single_agent | deterministic_workflow | hierarchical_multi_agent
  reasons: []
  rejected_options: []
  expected_benefits: []
  added_costs: []
  rollback_shape: ""
```

## 4. Layer and Team Registry

| 层 / 团队 | 只负责什么 | 明确不负责什么 | 输入合同 | 输出合同 | 部署 Owner |
|---|---|---|---|---|---|
| Access API |  |  |  |  |  |
| Central Supervisor |  |  |  |  |  |
| Team Supervisor A |  |  |  |  |  |
| Worker A1 |  |  |  |  |  |
| MCP Server A |  |  |  |  |  |

边界测试：

- [ ] Central Supervisor 不直接访问业务数据库。
- [ ] Team Supervisor 不扩大用户或父任务 Scope。
- [ ] Worker 只执行命名能力。
- [ ] Tool 不解释开放式业务目标。
- [ ] 规划、授权、执行和验收没有集中在一个 Prompt。

## 5. Capability Contract

### 5.1 A2A AgentCard 来源

```yaml
agent_card_source:
  agent_name: ""
  discovery_url_ref: ""
  protocol_versions: ["1.0"]
  interfaces: []
  signature:
    required: true
    verified: false
    key_ref: ""
  access:
    public_card: false
    extended_card_requires_auth: true
  owner: ""
  last_reviewed_at: ""
```

### 5.2 内部能力快照

```yaml
capability_snapshot:
  snapshot_id: ""
  derived_from_agent_card_digest: ""
  generated_at: ""
  expires_at: ""
  filters:
    tenant: ""
    environment: ""
    purpose: ""
    risk_ceiling: ""
  skills:
    - skill_id: ""
      input_schema: ""
      artifact_schema: ""
      risk: read_only | reversible | high_impact
      latency_slo_ms: 0
      required_scopes: []
      approval_policy: ""
  rejected_skills: []
```

验证：

- [ ] 能力快照不是 AgentCard 原样复制。
- [ ] 进入 Planner 的字段经过最小化。
- [ ] Card 中不含静态 Secret。
- [ ] Endpoint、版本、签名和健康在 Dispatch 时重新检查。

## 6. Goal Contract

```yaml
goal:
  goal_id: ""
  owner_subject: ""
  tenant_id: ""
  purpose: ""
  natural_language_request_ref: ""
  structured_outputs: []
  constraints: []
  forbidden_actions: []
  evidence_requirements: []
  completion_criteria: []
  max_risk: ""
  deadline: ""
```

不变量：

- [ ] Goal 创建后不得被下游静默改写。
- [ ] 禁止动作进入结构化字段，不只存在 Prompt。
- [ ] 任何 Goal 修订产生版本和事件。

## 7. Execution Plan Contract

```yaml
plan:
  plan_id: ""
  version: 1
  goal_id: ""
  generated_by: ""
  validated_by: ""
  steps:
    - id: ""
      team: ""
      skill: ""
      depends_on: []
      input_map: {}
      required: true
      side_effect: none
      risk: read_only
      estimated_cost: 0
      minimum_runtime_ms: 0
      contract_version: ""
  join:
    strategy: ""
    required_steps: []
    optional_steps: []
  budget:
    max_steps: 0
    max_model_tokens: 0
    max_tool_calls: 0
    max_concurrency: 0
    deadline_ms: 0
```

### 7.1 Plan Validator

- [ ] Schema 合法。
- [ ] Step ID 唯一。
- [ ] Team / Skill 存在。
- [ ] 协议与合同版本兼容。
- [ ] 依赖存在且无环。
- [ ] 必需输入可映射。
- [ ] 预算、并发和 Deadline 合法。
- [ ] 每个 Step 的有效权限成立。
- [ ] 高风险 Step 声明审批。
- [ ] Join 能区分所有结果状态。
- [ ] Evidence Requirement 可以被满足。
- [ ] Replan 次数有上限。

## 8. A2A Dispatch Contract

```yaml
a2a_dispatch:
  dispatch_id: ""
  request_id: ""
  goal_id: ""
  plan_id: ""
  plan_version: 1
  step_id: ""
  a2a_context_id: ""
  a2a_task_id: ""
  target_agent: ""
  skill_id: ""
  protocol_version: "1.0"
  interface_binding: ""
  message_schema: ""
  artifact_schema: ""
  subject:
    user_id: ""
    tenant_id: ""
  delegation:
    audience: ""
    scopes: []
    purpose: ""
    issued_at: ""
    expires_at: ""
    nonce: ""
  deadline: ""
  trace_id: ""
```

接收方验证：

- [ ] 协议版本受支持。
- [ ] 调用方身份有效。
- [ ] Audience 指向当前 Agent System。
- [ ] Expiry 未过期。
- [ ] Nonce 未重放。
- [ ] Subject / Tenant 不只存在自然语言中。
- [ ] Skill 存在且当前可用。
- [ ] 接收方重新执行资源级授权。
- [ ] 下游 Scope 只能收缩。
- [ ] Task / Context 可见性符合 ACL。

## 9. MCP Tool Contract

```yaml
mcp_tool:
  tool_name: ""
  server_id: ""
  protocol_version: "2025-11-25"
  input_schema: ""
  output_schema: ""
  description_digest: ""
  side_effect: none | reversible | irreversible
  required_scopes: []
  resource_binding: []
  purpose_allowlist: []
  timeout_ms: 0
  idempotency:
    required: false
    key_fields: []
    retention: ""
  expected_version:
    required: false
    field: ""
  evidence:
    source_field: ""
    anchor_field: ""
    observed_at_field: ""
  task_support: forbidden | optional | required
  approval_policy: ""
  audit_event: ""
```

验证：

- [ ] Tool Description 不授予权限。
- [ ] 参数使用结构化 Schema。
- [ ] Resource 与 Tenant 绑定。
- [ ] Tool Result 在进入 State 前校验。
- [ ] 副作用有 Idempotency 与 Expected Version。
- [ ] MCP Tasks 使用前完成 Capability Negotiation。
- [ ] HTTP 授权符合当前 MCP 授权框架。

## 10. Result and Artifact Contract

```yaml
result:
  step_id: ""
  plan_version: 1
  status: completed | no_data | partial | degraded | blocked | failed | cancelled
  data_schema: ""
  artifact_refs: []
  evidence_refs: []
  warnings: []
  missing_items: []
  side_effects: []
  trace_ref: ""
  content_hash: ""
  produced_at: ""
```

Artifact：

```yaml
artifact:
  artifact_id: ""
  name: ""
  media_type: ""
  schema: ""
  storage_ref: ""
  content_hash: ""
  classification: ""
  tenant_id: ""
  created_by_step: ""
  retention: ""
```

规则：

- [ ] A2A 任务输出使用 Artifact，不依赖瞬时 Message。
- [ ] `completed` 有合同完整的 Result。
- [ ] `no_data` 与 `failed` 分开。
- [ ] `partial` / `degraded` 列出缺失项和影响。
- [ ] Result 带 Plan Version 与 Hash。
- [ ] Artifact 有不可变引用、分类与保留策略。

## 11. Evidence Contract

```yaml
evidence:
  evidence_id: ""
  source_type: database_record | document_chunk | api_response | human_decision
  source: ""
  anchor: ""
  source_version: ""
  content_hash: ""
  observed_at: ""
  valid_time:
    from: ""
    to: ""
  tenant_id: ""
  classification: ""
  allowed_claims: []
  access_policy_ref: ""
  artifact_ref: ""
```

验证：

- [ ] Anchor 可重复定位。
- [ ] Source Version / Hash 可验证。
- [ ] Evidence 的权限不因进入 Context 而消失。
- [ ] 每个高风险 Claim 都有 Evidence。
- [ ] 推断与事实分开。

## 12. State Ownership Catalog

| 字段 / 对象 | Source of Truth | 唯一写入者 | Reducer / 合并 | 保留 | 恢复策略 |
|---|---|---|---|---|---|
| Goal |  |  |  |  |  |
| Plan |  |  |  |  |  |
| StepResult |  |  |  |  |  |
| Evidence |  |  |  |  |  |
| Error |  |  | Append-only |  |  |
| Budget |  |  |  |  |  |
| Approval |  |  |  |  |  |
| FinalAnswer |  |  |  |  |  |

系统不变量：

- [ ] Completed Step 必有 Result 或 No Data。
- [ ] 强依赖未完成时下游不启动。
- [ ] Final Claim 可回到 Evidence。
- [ ] 副作用可回到授权、审批与幂等键。
- [ ] 旧 Plan Result 不污染新 Plan。
- [ ] 重复 Result Hash 不同会阻断。

## 13. Join Contract

```yaml
join:
  join_id: ""
  required_steps: []
  optional_steps: []
  completion_rule: all_required_terminal
  success_rule: all_required_completed
  deadline: ""
  on_required_no_data: ""
  on_required_failure: ""
  on_optional_failure: ""
  on_timeout: ""
  late_result_policy: record_but_do_not_merge
  conflict_policy: block_and_escalate
```

测试：

- [ ] Required Success + Optional Timeout。
- [ ] Required No Data。
- [ ] Required Failure。
- [ ] Duplicate Same Hash。
- [ ] Duplicate Different Hash。
- [ ] Late Result from Old Plan。
- [ ] Evidence Conflict。
- [ ] Cancel during Join。

## 14. Context Graph Schema

### 14.1 节点

| Node Type | Required Fields | Source of Truth | Retention |
|---|---|---|---|
| Goal |  |  |  |
| Plan |  |  |  |
| Step |  |  |  |
| Agent |  |  |  |
| Tool |  |  |  |
| Result |  |  |  |
| Artifact |  |  |  |
| Evidence |  |  |  |
| Claim |  |  |  |
| Decision |  |  |  |
| Approval |  |  |  |
| Error |  |  |  |

### 14.2 边

| Edge Type | From | To | Cardinality | Required Evidence |
|---|---|---|---|---|
| DECOMPOSED_INTO | Goal | Step |  |  |
| DEPENDS_ON | Step | Step |  |  |
| ROUTED_TO | Step | Agent |  |  |
| EXECUTED_BY | Step | Worker |  |  |
| CALLED | Worker | Tool |  |  |
| PRODUCED | Step | Artifact |  |  |
| SUPPORTS | Evidence | Claim |  |  |
| DERIVED_FROM | Claim | Evidence |  |  |
| AUTHORIZED_BY | Action | Approval |  |  |
| BLOCKED_BY | Step | Error |  |  |
| CANCELLED_BY | Task | Actor |  |  |

### 14.3 引用而非复制

- [ ] 大对象只保存 Artifact Ref。
- [ ] Trace 只保存 Trace / Span Ref。
- [ ] Knowledge Entity 使用 Versioned Ref。
- [ ] ACL 与 Tenant 在图查询中强制执行。
- [ ] 删除请求可传播到索引和派生投影。

## 15. Storage Responsibility Map

| 机制 | 权威内容 | 写入时机 | 一致性 | 失败策略 |
|---|---|---|---|---|
| Checkpoint |  |  |  |  |
| Event Log |  |  |  |  |
| State Store |  |  |  |  |
| Context Graph |  |  |  |  |
| Artifact Store |  |  |  |  |
| Trace Backend |  |  |  |  |
| Audit Store |  |  |  |  |

## 16. Error Contract

```yaml
error:
  error_code: ""
  category: validation | authorization | transient | dependency | model | business | side_effect_unknown | systemic
  retryable: false
  safe_to_retry: false
  side_effect_state: not_started | unknown | completed | partially_completed
  step_id: ""
  plan_version: 1
  agent_id: ""
  tool_name: ""
  details_ref: ""
  user_message: ""
  occurred_at: ""
```

默认策略：

| 类别 | 自动重试 | 默认动作 |
|---|---|---|
| Validation | 否 | 修正输入或有界 Replan |
| Authorization | 否 | 拒绝或申请审批 |
| Transient | 条件式 | 有界退避 |
| Dependency | 否 | 阻断强依赖下游 |
| Model | 条件式 | 结构修复或有限 Replan |
| Business | 否 | 作为业务结果返回 |
| Side Effect Unknown | 否 | Reconcile |
| Systemic | 条件式 | Circuit Breaker / Failover |

## 17. Recovery Contract

```yaml
recovery:
  checkpoint_boundary: ""
  event_replay_from: ""
  reconcile_queries: []
  credentials:
    reauthenticate: true
    reauthorize: true
    reuse_old_token: false
  revalidate:
    plan_version: true
    resource_version: true
    deadline: true
    budget: true
    approval: true
  max_retries: 0
  max_replans: 0
  manual_escalation: ""
```

恢复演练：

- [ ] Tool 前崩溃。
- [ ] Tool 后、State 前崩溃。
- [ ] State 后、Context Graph 前崩溃。
- [ ] A2A Task 运行中 Client 重启。
- [ ] MCP Task 运行中连接中断。
- [ ] 旧 Token / Approval 过期。
- [ ] 资源版本变化。
- [ ] Parent Task 已取消。

## 18. Cancellation Contract

```yaml
cancellation:
  initiators: [user, parent_goal, operator, policy, deadline]
  stop_new_steps: true
  propagate_to_a2a: true
  propagate_to_mcp_tasks: true
  worker_poll_interval_ms: 0
  side_effect_reconcile: true
  late_result_policy: record_only
  unresolved_action_owner: ""
```

- [ ] Cancel Accepted 与 Execution Stopped 分开记录。
- [ ] Terminal Task 不被错误重新取消。
- [ ] Running Side Effect 有 Reconcile / Compensation。
- [ ] Context Graph 记录取消原因和 Actor。

## 19. Context Compression Contract

```yaml
compression:
  boundary: session_to_central | central_to_team | tool_to_result
  preserved_fields:
    - goals
    - constraints
    - negations
    - entities
    - amounts
    - dates
    - evidence_anchors
    - unresolved_errors
  removable_fields: []
  compressor_version: ""
  source_hash: ""
  output_hash: ""
  max_tokens: 0
  quality_tests: []
```

质量门禁：

- [ ] 事实保持率。
- [ ] 约束保持率。
- [ ] 否定保持率。
- [ ] Evidence Anchor 保持率。
- [ ] 下游任务成功率。
- [ ] 敏感信息最小化。

## 20. Observability Contract

```yaml
correlation:
  required:
    - goal.id
    - request.id
    - plan.id
    - plan.version
    - task.id
    - step.id
    - agent.id
    - trace.id
  optional:
    - artifact.id
    - evidence.id
```

| 平面 | Metrics | Alerts | Dashboard | Owner |
|---|---|---|---|---|
| Business |  |  |  |  |
| Agent |  |  |  |  |
| Model |  |  |  |  |
| Tool / Infra |  |  |  |  |
| Security |  |  |  |  |
| Cost |  |  |  |  |

```yaml
slo:
  goal_success_rate: ""
  evidence_coverage: ""
  p95_critical_path_latency_ms: 0
  recovery_success_rate: ""
  degraded_response_rate: ""
  cost_per_successful_goal: ""
security_invariants:
  unauthorized_side_effects: 0
  cross_tenant_leaks: 0
  duplicate_high_risk_actions: 0
```

## 21. Deployment and Readiness

### 21.1 部署依赖

```yaml
deployment_order:
  - secrets_identity_config
  - state_event_artifact
  - observability_audit
  - mcp_servers
  - a2a_team_services
  - central_supervisor
  - access_api
  - canary_and_rollback_gate
```

### 21.2 Readiness

- [ ] 配置、证书与密钥有效。
- [ ] Migration 版本匹配。
- [ ] State / Event / Artifact 可读写。
- [ ] Context Graph 可用或受控缓冲成立。
- [ ] Audit 与 Trace 可写。
- [ ] 依赖 AgentCard、A2A、MCP 和业务合同兼容。
- [ ] 模型 Provider 与 Fallback 可用。
- [ ] Policy / Approval / Kill Switch 可用。
- [ ] Synthetic Golden Path 通过。

## 22. Golden Scenario Manifest

```yaml
scenario:
  scenario_id: ""
  description: ""
  goal: ""
  fixtures: []
  expected_plan_shape: []
  required_steps: []
  optional_steps: []
  expected_claims: []
  expected_evidence: []
  forbidden_actions: []
  expected_status: completed
  max_latency_ms: 0
  max_cost: 0
  audit_complete: true
```

## 23. Failure Drill Matrix

| ID | 注入点 | 故障 | 期望状态 | 重试 / 降级 | 不变量 | 证据位置 | Owner |
|---|---|---|---|---|---|---|---|
| F1 | Planner | 环依赖 |  |  | 无 Tool Call |  |  |
| F2 | A2A Team | Timeout |  |  |  |  |  |
| F3 | MCP Tool | 脏 Schema |  |  | Result 不入 State |  |  |
| F4 | Worker | Tool 后崩溃 |  |  | 无重复副作用 |  |  |
| F5 | Auth | Token 过期 |  |  | 不复用旧 Token |  |  |
| F6 | Context Graph | 不可用 |  |  |  |  |  |
| F7 | Scheduler | Cancel Race |  |  | 不启动下游 |  |  |
| F8 | Model Provider | 5xx |  |  | 版本可追溯 |  |  |

## 24. System Acceptance Report

```yaml
acceptance:
  release: ""
  commit: ""
  environment: ""
  evaluated_at: ""
  dataset_version: ""
  scenario_count: 0
  scope:
    teams: []
    skills: []
    tools: []
  quality:
    goal_success_rate: ""
    plan_valid_rate: ""
    routing_precision: ""
    evidence_coverage: ""
    p95_latency_ms: 0
  reliability:
    recovery_success_rate: ""
    failure_drills_passed: ""
    duplicate_side_effects: 0
  security:
    unauthorized_side_effects: 0
    cross_tenant_leaks: 0
    replay_block_rate: ""
  cost:
    cost_per_successful_goal: 0
  decision: go | go_with_guardrails | no_go
  guardrails: []
  known_limits: []
  rollback_trigger: ""
  owners:
    business: ""
    engineering: ""
    security: ""
    sre: ""
  approvals: []
```

## 25. 发布门禁

| Gate | Go | No-Go | 当前结论 | 证据 |
|---|---|---|---|---|
| 合同 | 兼容并演练 Migration | 未版本化 / 破坏兼容 |  |  |
| 业务 | Golden Scenario 达标 | Goal / Evidence 不达标 |  |  |
| 恢复 | 演练通过，无重复动作 | Unknown 无处置 |  |  |
| 安全 | 最小权限、审批、审计通过 | 可越权 / 重放 / 跨租户 |  |  |
| 运营 | SLO、Alert、Runbook 就绪 | 依赖人工观察 |  |  |
| 成本 | 在预算内且可归因 | 成功目标成本失控 |  |  |
| 回滚 | 版本和数据可回退 | 不可逆且无补偿 |  |  |

## 26. 最终签署

```yaml
signoff:
  business:
    name: ""
    decision: ""
    date: ""
  engineering:
    name: ""
    decision: ""
    date: ""
  security:
    name: ""
    decision: ""
    date: ""
  sre:
    name: ""
    decision: ""
    date: ""
```

只有当模板中的未知项已经变成明确的风险、Owner、截止时间和发布决策，系统才算完成架构评审。空白不是“以后再补”，而是尚未通过的门禁。
