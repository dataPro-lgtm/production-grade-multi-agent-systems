---
title: AgentOps 生产运营与就绪契约
description: 用于定义多 Agent 系统的目标级 SLO、诊断、控制、恢复、成本、GameDay 与 ORR
---

# AgentOps 生产运营与就绪契约

这份模板用于把多 Agent 系统从“已经部署”推进到“可以持续运营”。它不是通用监控字段大全，而是一份跨业务、Agent 工程、平台、SRE、安全、数据与成本团队的责任合同。

建议先选择一条高价值或高风险 Goal 链路填写，并在发布前通过真实控制面做一次桌面演练和一次受控 GameDay。

## 1. 服务与运营边界

```yaml
agentops_charter:
  system_id: ""
  service_name: ""
  release_version: ""
  mission: ""
  supported_goals: []
  supported_intents: []
  supported_risks: [low, medium]
  supported_tenants: []
  out_of_scope: []
  environments: []
  owners:
    business: ""
    agent_engineering: ""
    sre: ""
    security: ""
    data: ""
    finops: ""
  repositories: []
  dashboards: []
  oncall: ""
  status_page: ""
```

检查：

- [ ] 支持的是用户 Goal，而不只是 API 列表。
- [ ] 明确不支持的意图、风险和副作用。
- [ ] 每类运营决策都有 Owner。
- [ ] 发布版本能关联 Prompt、Model、Policy、Tool 与 Knowledge 版本。

## 2. 关联主干与执行身份

```yaml
correlation_contract:
  required_ids:
    request_id: ""
    session_id: ""
    goal_id: ""
    task_id: ""
    step_id: ""
    trace_id: ""
    span_id: ""
    tool_call_id: ""
  optional_ids:
    approval_id: ""
    artifact_ref: ""
    evidence_ref: ""
    checkpoint_ref: ""
  propagation:
    gateway_to_supervisor: ""
    supervisor_to_team: ""
    agent_to_mcp: ""
    async_event: ""
  retention:
    traces_days: 0
    artifacts_days: 0
    incident_bundles_days: 0
```

### 2.1 版本库存

| Version Dimension | Current | Previous | Source of Truth | Rollback Ref | Owner |
|---|---|---|---|---|---|
| Application Release |  |  |  |  |  |
| Prompt |  |  |  |  |  |
| Model / Provider |  |  |  |  |  |
| Agent Contract |  |  |  |  |  |
| Tool Contract |  |  |  |  |  |
| Policy |  |  |  |  |  |
| Knowledge Snapshot |  |  |  |  |  |
| Capability Snapshot |  |  |  |  |  |
| Checkpoint Schema |  |  |  |  |  |

## 3. Goal Outcome Event

```yaml
goal_outcome_event:
  event_version: 1
  occurred_at: ""
  goal_id: ""
  tenant_id_hash: ""
  intent: ""
  risk_level: ""
  release_version: ""
  prompt_version: ""
  provider: ""
  model_family: ""
  outcome: complete | partial | blocked | failed | cancelled
  goal_success: false
  safe_path: false
  evidence_coverage: 0
  human_escalated: false
  latency_ms: 0
  total_cost: 0
  error_category: ""
  trace_ref: ""
  context_graph_ref: ""
```

约束：

- [ ] `outcome=complete` 有可执行的业务定义。
- [ ] `goal_success` 同时考虑结果、证据和安全路径。
- [ ] 取消、用户放弃和依赖故障有明确分母政策。
- [ ] 原始用户 ID、Prompt 与 PII 不进入 Metric Label。

## 4. Tier 1 指标与 SLO

| Metric ID | User Promise | Population | Calculation | Window | Target | Slices | Owner |
|---|---|---|---|---|---|---|---|
| goal_success_rate |  |  |  |  |  |  |  |
| safe_path_rate |  |  |  |  |  |  |  |
| claim_evidence_coverage |  |  |  |  |  |  |  |
| p95_goal_latency |  |  |  |  |  |  |  |
| human_escalation_rate |  |  |  |  |  |  |  |
| cost_per_successful_goal |  |  |  |  |  |  |  |

```yaml
slo:
  slo_id: ""
  sli_id: ""
  description: ""
  population:
    include: []
    exclude: []
  calculation:
    numerator: ""
    denominator: ""
    aggregation: rate | p50 | p95 | p99 | max
  objective: ""
  window: ""
  minimum_samples: 0
  slices: []
  source_event: ""
  owner: ""
  reviewed_at: ""
```

### 4.1 错误预算政策

| Budget State | Entry Condition | Change Policy | Containment | Exit Condition | Approver |
|---|---|---|---|---|---|
| Healthy |  |  |  |  |  |
| Caution |  |  |  |  |  |
| Fast Burn |  |  |  |  |  |
| Exhausted |  |  |  |  |  |

检查：

- [ ] 阈值来自业务损失、基线与风险，而不是行业传说。
- [ ] Fast Burn 和 Slow Burn 均有政策。
- [ ] 安全事件不被可靠性预算抵扣。
- [ ] 预算耗尽时停止哪些变更、允许哪些修复已经写明。

## 5. Tier 2 诊断指标目录

| Layer | Metric | Definition | Labels | High-card Refs | Threshold / Baseline | Owner |
|---|---|---|---|---|---|---|
| Planner | plan_valid_rate |  |  |  |  |  |
| Planner | replan_rate |  |  |  |  |  |
| Router | unknown_capability_rate |  |  |  |  |  |
| Router | fallback_rate |  |  |  |  |  |
| Worker | task_success_rate |  |  |  |  |  |
| Worker | no_data_rate |  |  |  |  |  |
| Tool | tool_latency |  |  |  |  |  |
| Tool | unknown_side_effect_rate |  |  |  |  |  |
| Model | ttft |  |  |  |  |  |
| Model | structured_output_failure |  |  |  |  |  |
| State | checkpoint_lag |  |  |  |  |  |
| State | stale_result_rate |  |  |  |  |  |
| Security | policy_deny_rate |  |  |  |  |  |
| Security | injection_detection_rate |  |  |  |  |  |

## 6. Telemetry Schema 与数据治理

```yaml
telemetry_field:
  name: ""
  type: string
  location: metric_label | span_attribute | log | artifact
  required: false
  cardinality: low | bounded | high
  sensitive: false
  classification: public | internal | confidential | restricted
  minimization: ""
  redaction: ""
  access_roles: []
  retention_days: 0
  deletion_process: ""
  semantic_convention_version: ""
  owner: ""
```

### 6.1 基数审查

适合 Metric Label 的候选：

- `team`
- `agent_type`
- `tool_id`
- `status`
- `model_family`
- `prompt_version`
- `error_category`
- `risk_level`
- `environment`
- `region`

默认不得作为 Metric Label：

- `request_id`
- `user_id`
- 任意 URL 或 Query
- 原始 Prompt
- Tool Output
- Evidence 正文
- PII

### 6.2 采样政策

```yaml
sampling:
  default_trace_rate: 0
  tail_rules:
    - condition: ""
      retain_rate: 0
  always_consider:
    - high_risk_action
    - safety_denial
    - canary_release
    - unknown_side_effect
  artifact_policy:
    raw_prompt: deny | restricted | sampled
    tool_result: deny | restricted | sampled
  monthly_cost_budget: ""
```

## 7. 五视图 Dashboard

### 7.1 Business View

- [ ] Goal Success / Partial / Blocked
- [ ] Evidence Coverage
- [ ] Human Escalation
- [ ] 按 Intent、Risk、Tenant Tier 和 Release 切片

### 7.2 Execution View

- [ ] Plan / Replan
- [ ] Route / Fallback
- [ ] Critical Path
- [ ] Step / Join / Deadline
- [ ] Retry Amplification

### 7.3 Model View

- [ ] Provider / Model / Prompt Version
- [ ] TTFT / Latency / Token
- [ ] Structured Output Failure
- [ ] Fallback 与能力退化

### 7.4 Tool View

- [ ] Tool Intent / Policy Decision
- [ ] Latency / Error / Rate Limit
- [ ] Idempotency / Unknown Side Effect
- [ ] Evidence Freshness

### 7.5 Control View

- [ ] Circuit / Degradation State
- [ ] Approval Queue / Expiry
- [ ] Budget / Rate Limit
- [ ] Active Override / Break-glass
- [ ] Rollback / Recovery Verification

| Role | Business | Execution | Model | Tool | Control |
|---|---:|---:|---:|---:|---:|
| Business Ops |  |  |  |  |  |
| On-call |  |  |  |  |  |
| Security |  |  |  |  |  |
| Platform Admin |  |  |  |  |  |

## 8. Alert Registry

| Alert ID | SLI / Risk | Condition | Impact | Required Context | Runbook | Owner | Test Date |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

```yaml
alert:
  alert_id: ""
  version: 1
  condition: ""
  impact: ""
  window: ""
  severity: ""
  affected_slices: []
  recent_changes_query: ""
  example_goal_query: ""
  trace_query: ""
  context_graph_query: ""
  runbook_ref: ""
  owner: ""
  containment_candidates: []
  silence_policy: ""
  tested_at: ""
```

检查：

- [ ] 告警面向用户影响或明确风险。
- [ ] 值班人员无需重新寻找版本和代表样本。
- [ ] 告警指向可执行 Runbook。
- [ ] Silence 有审批、范围和过期时间。

## 9. Incident Bundle

```yaml
incident_bundle:
  incident_id: ""
  severity: ""
  status: declared | mitigating | recovering | verifying | closed
  declared_at: ""
  window:
    start: ""
    end: ""
  roles:
    incident_commander: ""
    operations_lead: ""
    communications_lead: ""
  impact:
    affected_goals: 0
    affected_tenants: []
    intents: []
    risks: []
    violated_slos: []
    data_or_security_impact: ""
  versions:
    release: ""
    prompt: ""
    model: ""
    agent_contract: ""
    tool_contract: ""
    policy: ""
    knowledge: ""
    capability_snapshot: ""
  evidence:
    dashboards: []
    trace_queries: []
    context_graph_queries: []
    sanitized_artifacts: []
  controls_applied: []
  rollback_ref: ""
  communication_ref: ""
  timeline_ref: ""
  postmortem_ref: ""
```

### 9.1 Timeline

| Time | Type | Fact / Hypothesis / Action | Evidence | Result | Actor |
|---|---|---|---|---|---|
|  | fact |  |  |  |  |
|  | hypothesis |  |  |  |  |
|  | excluded |  |  |  |  |
|  | action |  |  |  |  |

## 10. 事故因果重建

| Node | Expected Contract | Observed | Evidence | First Wrong Node? | Owner |
|---|---|---|---|---|---|
| Goal / Constraint |  |  |  |  |  |
| Plan / Dependency |  |  |  |  |  |
| Route / Capability |  |  |  |  |  |
| Team / Worker |  |  |  |  |  |
| Tool / Data |  |  |  |  |  |
| Context / Memory |  |  |  |  |  |
| Evidence / Claim |  |  |  |  |  |
| Decision / Answer |  |  |  |  |  |

根因记录：

```yaml
causal_finding:
  visible_symptom: ""
  first_wrong_node: ""
  violated_contract: ""
  propagation_path: []
  contributing_conditions: []
  why_safeguards_missed_it: ""
  affected_population_query: ""
  remediation:
    immediate: []
    preventive: []
    detection: []
  new_golden_cases: []
```

## 11. Failure Taxonomy

| Class | Definition | Examples | Deterministic Signals | Triage Owner |
|---|---|---|---|---|
| Input / Context |  |  |  |  |
| Planner |  |  |  |  |
| Router |  |  |  |  |
| Worker |  |  |  |  |
| Tool / Data |  |  |  |  |
| Consolidator |  |  |  |  |
| Runtime |  |  |  |  |
| Security |  |  |  |  |

聚类键：

```text
team × failure_class × release_version × prompt_version × intent × risk
```

## 12. Control Action Contract

```yaml
control_action:
  action_id: ""
  action_type: ""
  target: ""
  scope:
    environments: []
    tenants: []
    intents: []
    risks: []
    releases: []
    prompt_versions: []
    providers: []
    tools: []
  reason: ""
  incident_ref: ""
  requested_by: ""
  approved_by: []
  expected_version: ""
  proposed_diff: ""
  starts_at: ""
  expires_at: ""
  reversible: true
  rollback_action: ""
  recovery_conditions: []
  audit_ref: ""
```

检查：

- [ ] 高影响动作采用双人复核。
- [ ] Break-glass 有 TTL、原因和审计。
- [ ] 使用 Expected Version 防止覆盖并发变更。
- [ ] 自动动作只覆盖已演练、可回滚的范围。
- [ ] AI 建议与确定性执行权限分离。

## 13. Circuit、降级与恢复政策

| State | Entry Condition | Allowed Actions | Result Semantics | Probe | Exit Condition |
|---|---|---|---|---|---|
| Healthy |  |  | complete |  |  |
| Degraded |  |  | partial / degraded |  |  |
| Open |  |  | blocked / human |  |  |
| Recovering |  |  | provisional |  |  |
| Verifying |  |  | held |  |  |

```yaml
degradation_policy:
  policy_id: ""
  target: ""
  ordered_actions:
    - disable_optional_team
    - reduce_search
    - return_partial_with_missing_evidence
    - read_only
    - human_queue
    - block
  forbidden_shortcuts:
    - bypass_tool_guard
    - bypass_tenant_filter
    - omit_required_evidence
  owner: ""
  last_drill: ""
```

## 14. Checkpoint、恢复与 Reconcile

```yaml
recovery_contract:
  checkpoint_schema_version: ""
  safe_points: []
  reauthorization:
    subject: true
    tenant: true
    purpose: true
    permission: true
    approval_expiry: true
  deadline_and_cancel:
    check_goal_deadline: true
    check_cancel_tombstone: true
  compatibility:
    plan_version: ""
    tool_contract: ""
    policy_version: ""
  unknown_side_effect:
    reconciliation_query: ""
    committed_action: accept
    not_found_action: retry_if_policy_allows
    in_progress_action: wait_or_cancel
    ambiguous_action: human
  late_result_policy: ""
  max_resume_attempts: 0
  exit_conditions: []
```

### 14.1 Replan Contract

```yaml
replan:
  allowed_reasons:
    - capability_unavailable
    - optional_step_failed
    - data_precondition_changed
  preserve:
    - user_goal
    - user_constraints
    - accepted_results
    - evidence
  forbid:
    - expand_permission
    - repeat_committed_side_effect
  max_attempts: 0
  emit_event: plan_event_v1
  on_exhausted: partial | human | blocked
```

## 15. Deadline 与 Retry Policy

```yaml
deadline_budget:
  goal_deadline_ms: 0
  allocations:
    planning_ms: 0
    team_ms: 0
    worker_ms: 0
    tool_ms: 0
    consolidation_ms: 0
  reserve_ms: 0
  propagation_header: ""
```

```yaml
retry_policy:
  logical_operation: ""
  safe_to_retry: false
  retryable_errors: []
  non_retryable_errors: []
  max_attempts: 0
  backoff: exponential
  jitter: full
  max_backoff_ms: 0
  honor_retry_after: true
  idempotency_key: ""
  unknown_result_action: reconcile
  amplification_alert: ""
```

## 16. Provider Contract 与 Failover

| Provider / Model | Capabilities | Supported Intents | Excluded Risks | Eval Run | TTFT / P95 | Data Policy | Owner |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

```yaml
provider_failover:
  from: ""
  to: ""
  trigger: ""
  required_capabilities: []
  compatible_contracts: []
  evaluation_run: ""
  canary_policy: ""
  preserve_safety_policy: true
  degradation_disclosure: ""
  rollback_condition: ""
  audit_fields:
    - original_provider
    - selected_provider
    - reason
    - capability_delta
    - result
```

统一错误：

```text
rate_limited | timeout | unavailable | invalid_output
safety_block | context_exceeded | authentication | billing
```

## 17. Cost Event 与预算

```yaml
cost_event:
  event_version: 1
  occurred_at: ""
  goal_id: ""
  task_id: ""
  step_id: ""
  team: ""
  agent_type: ""
  provider: ""
  model: ""
  prompt_version: ""
  input_tokens: 0
  output_tokens: 0
  cached_tokens: 0
  model_cost: 0
  tool_cost: 0
  retry_attempt: 0
  cache_status: hit | miss | bypass
  outcome: success | partial | failed | blocked
  contributed_to_final_answer: false
```

| Metric | Calculation | Window | Slices | Budget | Action | Owner |
|---|---|---|---|---|---|---|
| cost_per_successful_goal |  |  |  |  |  |  |
| wasted_cost |  |  |  |  |  |  |
| retry_cost |  |  |  |  |  |  |
| critical_path_cost |  |  |  |  |  |  |
| evidence_cost |  |  |  |  |  |  |

```yaml
goal_budget:
  max_cost: ""
  max_model_tokens: 0
  max_tool_calls: 0
  max_replans: 0
  max_parallelism: 0
  degradation_order: []
  on_exhausted: partial | human | blocked
  disclosure_template: ""
```

## 18. Knowledge 与 Context Operations

```yaml
knowledge_release:
  snapshot_id: ""
  valid_time: ""
  parser_version: ""
  index_version: ""
  ontology_version: ""
  tool_contract_versions: []
  compatibility_tests: []
  freshness_slo: ""
  canary: ""
  rollback_to: ""
  owner: ""
```

| Signal | Definition | Threshold | Diagnostic Query | Owner |
|---|---|---|---|---|
| entity_resolution_error |  |  |  |  |
| cross_scope_edge_count |  |  |  |  |
| knowledge_freshness_lag |  |  |  |  |
| retrieval_no_data_rate |  |  |  |  |
| traversal_expansion |  |  |  |  |
| claim_evidence_mismatch |  |  |  |  |

### 18.1 Context Compression

```yaml
context_compression:
  policy_id: ""
  order:
    - tenant_filter
    - subject_acl
    - pii_minimize
    - active_purpose
    - compress
    - validate_contract
  required_fields_to_preserve:
    - tenant_id
    - subject_id
    - user_constraints
    - evidence_refs
    - valid_time
  metrics:
    - compression_ratio
    - constraint_retention
    - entity_resolution_accuracy
    - evidence_retention
    - stale_memory_usage
    - cross_session_leakage
```

## 19. Semantic Cache Contract

```yaml
semantic_cache:
  cache_id: ""
  level: tool | worker | team | central_plan | full_response
  key_fields:
    - tenant_id
    - user_scope_hash
    - intent
    - sorted_entity_ids
    - normalized_arguments
    - tool_and_data_version
    - policy_version
    - locale
    - valid_time
  ttl: ""
  invalidation_events: []
  bypass_conditions: []
  evidence_revalidation: ""
  prohibited_data: []
  metrics:
    - hit_rate
    - latency_saved
    - cost_saved
    - stale_hit_rate
    - wrong_entity_hit_rate
  owner: ""
```

## 20. Feedback 与 Experience Governance

```yaml
experience:
  experience_id: ""
  trigger: ""
  conditions: []
  lesson: ""
  preferred_plan: []
  avoid: []
  provenance: []
  reviewer: ""
  scope:
    tenants: []
    intents: []
    risks: []
  valid_from: ""
  expires_at: ""
  compatible_prompt_versions: []
  pii_status: none | deidentified | restricted
  holdout_eval: ""
  enabled: false
```

检查：

- [ ] 生产反馈不会自动写入 Prompt 或长期记忆。
- [ ] Provenance、Reviewer、Scope、Validity 和 Compatibility 完整。
- [ ] PII、注入和反馈投毒经过检查。
- [ ] 上线前通过 Holdout / A-B 或灰度。

## 21. Prompt Release Manifest

```yaml
prompt_release:
  prompt_id: ""
  version: ""
  git_sha: ""
  variables: []
  compatible_agent_contracts: []
  compatible_tool_contracts: []
  compatible_context_contracts: []
  evaluation_run: ""
  canary_slices: []
  excluded_risks: []
  rollback_to: ""
  owner: ""
  approved_by: []
  released_at: ""
  retired_at: ""
```

生命周期：

```text
Draft → Review → Offline Eval → Canary → Promote
      → Operate → Rollback → Retire
```

## 22. Capacity 与 High Availability

| Boundary | Bottleneck Signal | Scale Action | Max | Drain | Checkpoint | Side-effect Protection |
|---|---|---|---|---|---|---|
| Gateway |  |  |  |  |  |  |
| Supervisor |  |  |  |  |  |  |
| Team / Worker |  |  |  |  |  |  |
| MCP / Tool |  |  |  |  |  |  |
| Context Graph |  |  |  |  |  |  |
| Evaluation |  |  |  |  |  |  |

故障转移检查：

- [ ] Drain 正在执行的 Goal。
- [ ] Checkpoint 在定义的 Safe Point。
- [ ] Idempotency / Reconcile 防止重复副作用。
- [ ] Authorization / Approval 在迁移后重新验证。
- [ ] Late Result 不会覆盖新 Plan。

## 23. Trust Boundary 与运营安全

| Boundary | Identity | Encryption | Schema | Least Privilege | Output Sanitization | Audit |
|---|---|---|---|---|---|---|
| Intent → Gateway |  |  |  |  |  |  |
| Gateway → Agent Zone |  |  |  |  |  |  |
| Agent → MCP / Tool |  |  |  |  |  |  |
| Agent → Knowledge |  |  |  |  |  |  |
| Agent → Context Graph |  |  |  |  |  |  |

运营安全信号：

- Tool Output Injection；
- Cross-tenant Retrieval；
- PII / DLP 命中；
- Unauthorized Action；
- Approval Expiry / Replay；
- Delegation Scope Mismatch。

## 24. Runbook

```yaml
runbook:
  runbook_id: ""
  version: ""
  alert_id: ""
  scope: ""
  prerequisites: []
  first_checks:
    - ""
  containment:
    - action: ""
      control_contract_ref: ""
      expected_result: ""
  diagnosis:
    - query: ""
      interpretation: ""
  recovery:
    - action: ""
      prerequisite: ""
      verification: ""
  exit_conditions: []
  rollback: []
  owner: ""
  escalation: []
  last_dry_run: ""
  last_gameday: ""
```

自动化边界：

| Step | Automatic? | Required Approval | Max Scope | Rollback | Evidence |
|---|---:|---|---|---|---|
| Gather context |  |  |  |  |  |
| Apply containment |  |  |  |  |  |
| Reconcile |  |  |  |  |  |
| Recover |  |  |  |  |  |
| Confirm exit |  |  |  |  |  |

## 25. GameDay

```yaml
gameday:
  exercise_id: ""
  title: ""
  hypothesis: ""
  environment: ""
  scenario: ""
  injected_faults: []
  protected_population: []
  abort_conditions: []
  expected_detection: []
  expected_alerts: []
  expected_controls: []
  expected_recovery: []
  participants:
    incident_commander: ""
    operations: []
    communications: []
    observers: []
  measurements:
    mttd: ""
    mtta: ""
    mttr: ""
    affected_goals: 0
    blast_radius: ""
    safety_violations: 0
  findings: []
  actions: []
  new_golden_cases: []
  runbook_updates: []
  owner: ""
  performed_at: ""
```

建议场景：

- [ ] Provider 5xx / 限流。
- [ ] Tool 慢并产生未知副作用。
- [ ] Knowledge Snapshot 陈旧。
- [ ] Checkpoint 后崩溃。
- [ ] Capability Card 漂移。
- [ ] Context Compression 混淆主体。
- [ ] Feedback Poisoning。
- [ ] Semantic Cache 跨主体命中。

## 26. Operational Readiness Review

### 26.1 服务与 SLO

- [ ] Goal、意图、风险和排除范围已定义。
- [ ] Tier 1 / Tier 2 指标能从生产数据计算。
- [ ] SLO 与错误预算政策已批准。
- [ ] 零容忍安全条件未并入可抵扣总分。

### 26.2 质量与证据

- [ ] Golden Dataset、Fixture、N-run 与灰度证据可追溯。
- [ ] Claim → Evidence 路径可查询。
- [ ] 关键执行 Artifact 有访问、保留和删除政策。
- [ ] Prompt / Model / Tool / Knowledge 版本可关联。

### 26.3 诊断与响应

- [ ] 五视图 Dashboard 可用。
- [ ] 告警包含影响、切片、样本、变更和 Runbook。
- [ ] Incident Bundle 能自动收集基础事实。
- [ ] Failure Taxonomy 与 Triage Owner 已定义。

### 26.4 控制与恢复

- [ ] 熔断、降级、取消、回滚可通过控制面执行。
- [ ] Control Action 有 Scope、Approval、TTL 和 Audit。
- [ ] Checkpoint Resume 会重新授权并检查 Deadline。
- [ ] 未知副作用通过 Reconcile 处理。
- [ ] 恢复退出条件同时覆盖 Goal、Evidence、安全与成本。

### 26.5 韧性与容量

- [ ] Deadline 和 Retry Budget 端到端传播。
- [ ] Provider Failover 通过兼容性评测。
- [ ] 按真实瓶颈扩缩，而不是按 Agent 数量猜测。
- [ ] Drain、Checkpoint 与 Side-effect Protection 已验证。

### 26.6 成本、知识和学习

- [ ] Cost Event 能归因到成功 Goal。
- [ ] 预算耗尽有显式业务语义。
- [ ] Knowledge / Ontology 发布有兼容测试和回退。
- [ ] Context Compression 保留主体、约束和 Evidence。
- [ ] Feedback / Experience 有人工治理和有效期。

### 26.7 人与流程

- [ ] On-call、升级和事故角色明确。
- [ ] Runbook 已由非作者执行。
- [ ] 至少一个高风险场景完成 GameDay。
- [ ] 演练行动项有 Owner 和到期时间。

## 27. ORR 决策记录

```yaml
orr_decision:
  review_id: ""
  system_id: ""
  release_version: ""
  reviewed_at: ""
  decision: go | conditional_go | no_go
  evidence_refs: []
  known_risks:
    - risk: ""
      impact: ""
      mitigation: ""
      owner: ""
      due_at: ""
      accepted_by: ""
  conditions:
    - condition: ""
      owner: ""
      due_at: ""
      verifier: ""
  rollback_to: ""
  approved_by: []
  next_review: ""
```

最终原则：

> 能发布的版本不一定能运营；只有当目标可衡量、因果可重建、动作可审计、状态可恢复、成本可归因、故障可演练时，多 Agent 系统才真正具备生产就绪性。
