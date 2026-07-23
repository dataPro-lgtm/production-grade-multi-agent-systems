---
title: Agent 安全评审与红队契约
description: 可复制的威胁记录、Tool Security Manifest、审批、审计、红队和安全验收模板
---

# Agent 安全评审与红队契约

本模板用于把 Agent 安全从 Prompt 建议转成可执行合同。建议由应用、平台、安全、数据和业务 Owner 共同评审，并为每一项结论绑定实现路径或验证证据。

!!! warning "不要把模板完成等同于系统安全"
    模板只能帮助团队发现遗漏。最终结论必须来自 Policy Test、真实身份集成测试、攻击测试、控制面故障注入和运行证据。

## 1. System Security Context

```yaml
system:
  name:
  release:
  environment:
  business_owner:
  application_owner:
  platform_owner:
  security_owner:

purpose:
  intended_users:
  allowed_tasks:
  prohibited_tasks:
  risk_ceiling:
  human_oversight:

assets:
  - id:
    description:
    classification:
    source_of_truth:
    owner:
    worst_case_impact:

identities:
  users:
  workloads:
  peer_agents:
  administrators:
  service_accounts:

trust_boundaries:
  - id:
    from:
    to:
    data:
    authentication:
    authorization:
    encryption:
    validation:
    audit:
```

## 2. Threat Record

```yaml
threat_id:
title:
status: open | mitigated | accepted | transferred

asset:
boundary:
actors:
preconditions:
entry_points:
attack_path:

impact:
  confidentiality:
  integrity:
  availability:
  privacy:
  financial:
  safety:

framework_mapping:
  owasp_agentic:
  owasp_llm:
  stride:

controls:
  preventive:
  detective:
  responsive:
  recovery:

evidence:
  implementation:
  tests:
  dashboards:
  drills:

residual_risk:
  description:
  owner:
  decision:
  expires_at:
  compensating_controls:

review:
  reviewers:
  last_reviewed_at:
  next_review_at:
```

### Threat 评审问题

- 攻击者是否可以改变目标或工具序列？
- 一个低权限主体能否借用高权限 Agent？
- 两个合法 Tool 组合后能否外传数据？
- Memory / RAG 是否可能持久化恶意内容？
- 控制后端故障时系统是 Fail Open 还是 Fail Closed？
- 事件发生后怎样隔离、撤销和恢复？
- 每个高风险威胁是否有可重复测试？

## 3. Security Control Matrix

| Threat | Asset | Boundary | Prevent | Detect | Respond | Recover | Policy Owner | Implementation Owner | Tests | Metrics | Residual Risk |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

## 4. Tool Security Manifest

```yaml
identity:
  tool_id:
  display_name:
  publisher:
  version:
  code_digest:
  description_digest:
  manifest_digest:
  review_status:

contract:
  action:
  resource_type:
  input_schema:
  output_schema:
  side_effect:
  reversibility:
  risk: R0 | R1 | R2 | R3

authorization:
  required_permissions:
  allowed_callers:
  task_scopes:
  resource_acl:
  tenant_constraints:
  environment_constraints:
  purpose_constraints:

execution:
  executor:
  workload_identity:
  credential_mode: just-in-time
  token_audience:
  secret_access:
  network_egress:
  filesystem:
  sandbox:
  timeout:
  rate_limit:
  max_result_rows:
  max_result_bytes:

safety:
  idempotency:
  expected_version:
  dry_run:
  approval:
  compensation:
  kill_switch:

data:
  input_classification:
  output_classification:
  allowed_channels:
  retention:
  dlp_policy:

audit:
  level:
  required_fields:
  artifact_policy:

tests:
  contract:
  policy:
  integration:
  adversarial:
  failure_modes:
```

### Tool 一票否决项

- 模型可以直接读取生产 Secret；
- Tool ID 或 Publisher 不唯一；
- 未锁定版本或 Schema；
- 高风险副作用不需要审批；
- 写操作没有幂等和资源版本检查；
- 外部网络访问无限制；
- 结果未经字段 ACL 和数据分类；
- 无法单独停用该 Tool。

## 5. Effective Authority Decision

```yaml
request:
  request_id:
  occurred_at:
  user:
  workload:
  task:
  delegation_chain:
  environment:

intent:
  tool_id:
  tool_version:
  action:
  resource:
  arguments_hash:
  requested_scopes:

authority_inputs:
  user_permissions:
  workload_permissions:
  delegation_scopes:
  task_scopes:
  tool_required_permissions:
  resource_permissions:
  runtime_constraints:
  approval_scopes:

decision:
  effect: allow | deny | require_approval
  granted_scopes:
  reason_codes:
  policy_id:
  policy_version:
  valid_until:
  obligations:

evidence:
  audit_event:
  trace_id:
```

## 6. Bound Approval

```yaml
approval:
  approval_id:
  policy:
  risk:
  approvers:
  separation_of_duties:

action:
  action_hash:
  tool_id:
  tool_version:
  resource_id:
  expected_version:
  parameter_diff:
  impact_summary:
  reversibility:
  data_classification:

grant:
  scopes:
  issued_at:
  expires_at:
  nonce:
  audience:
  signature:

execution:
  idempotency_key:
  compare_and_set:
  result:
  audit_event:
```

### Approval 验收

- [ ] 批准者看到确定性参数与差异；
- [ ] Token 绑定 Action、Resource、Version、Scope 和 Expiry；
- [ ] 执行前重新验证用户与资源；
- [ ] 资源变化会触发重新审批；
- [ ] Token 不能用于其他 Tool 或资源；
- [ ] R3 操作满足职责分离；
- [ ] 拒绝和过期均有稳定审计。

## 7. Delegation Security Contract

```yaml
delegation:
  delegation_id:
  parent_task_id:
  child_task_id:
  sender:
  recipient:
  user_delegation_ref:

scope:
  goals:
  allowed_tools:
  allowed_resources:
  scopes:
  data_classification_ceiling:
  risk_ceiling:
  deadline:
  max_cost:

integrity:
  issued_at:
  expires_at:
  nonce:
  audience:
  contract_version:
  payload_hash:
  signature:

receiver_checks:
  sender_authenticated:
  delegation_is_subset:
  resource_authorized:
  nonce_unused:
  not_expired:
  schema_valid:
  policy_decision:
```

不变量：

```text
child_scope ⊆ parent_effective_scope
child_deadline ≤ parent_deadline
child_risk ≤ parent_risk
```

## 8. Privacy and Memory Record

```yaml
data_element:
  name:
  source:
  classification:
  data_subject:
  owner:

purpose:
  allowed_purposes:
  prohibited_purposes:
  model_requires_raw_value:
  lawful_or_policy_basis:
  consent_ref:

transformation:
  method: redact | mask | tokenize | hash | encrypt | synthetic
  detector:
  detector_version:
  false_positive_review:
  reidentification_authority:

storage:
  context:
  conversation:
  memory:
  vector_index:
  artifact:
  audit:
  evaluation_dataset:

access:
  roles:
  tenants:
  channels:
  regions:

retention:
  ttl:
  policy:
  deletion_triggers:
  backup_expiry:

deletion_propagation:
  targets:
  completion_slo:
  evidence:
```

## 9. Audit Event Contract

```yaml
event:
  event_id:
  occurred_at:
  received_at:

actor:
  actor_type:
  actor_id_hash:
  user_id_hash:
  tenant_id:
  delegation_ref:

operation:
  task_id:
  action:
  resource_type:
  resource_id_hash:
  tool_id:
  tool_version:

decision:
  policy_id:
  policy_version:
  effect:
  reason_codes:
  obligations:

execution:
  outcome:
  error_class:
  idempotency_key_hash:
  approval_id:
  trace_id:

integrity:
  previous_event_hash:
  event_hash:
  signer:
  timestamp_ref:
  immutable_storage_ref:

privacy:
  included_fields:
  excluded_fields:
  artifact_refs:
  retention:
```

### Audit 完整性检查

- [ ] 能重建 Subject、Action、Resource、Policy、Decision 和 Outcome；
- [ ] Prompt、Secret、PII 和完整业务结果未被无必要复制；
- [ ] 丢失、延迟、签名失败和 Hash 断链可告警；
- [ ] 高风险动作在 Audit 不可用时 Fail Closed；
- [ ] 密钥、时间与不可变存储拥有独立 Custody；
- [ ] 导出和访问审计记录本身也被审计。

## 10. Control Failure Matrix

| Control | Failure | R0 | R1 | R2 | R3 | Alert | Recovery Owner |
|---|---|---|---|---|---|---|---|
| Identity | unavailable |  |  |  |  |  |  |
| Policy | unavailable / stale |  |  |  |  |  |  |
| Approval | unavailable |  |  |  |  |  |  |
| DLP | unavailable |  |  |  |  |  |  |
| Audit | unavailable |  |  |  |  |  |  |
| Nonce Store | unavailable |  |  |  |  |  |  |
| Security Monitor | unavailable |  |  |  |  |  |  |
| Tool Registry | digest mismatch |  |  |  |  |  |  |

## 11. Red-Team Case

```yaml
case:
  case_id:
  category:
  threat_id:
  title:
  version:

entry:
  entry_point:
  payload_ref:
  encoding:
  preconditions:

identities:
  user:
  workload:
  peer_agent:
  tenant:

task:
  objective:
  allowed_tools:
  allowed_resources:
  risk_ceiling:

forbidden:
  tools:
  resources:
  outputs:
  side_effects:

expected:
  task_status:
  task_can_complete:
  security_events:
  policy_decisions:
  side_effect_count: 0

execution:
  environment:
  model:
  prompt_version:
  policy_version:
  tool_registry_hash:
  repetitions:

cleanup:
  actions:
  verification:

evidence:
  traces:
  audit_events:
  artifacts:
  screenshots:
```

## 12. Red-Team Result

```yaml
result:
  case_id:
  release:
  executed_at:
  repetitions:
  attack_successes:
  valid_task_completions:
  false_blocks:
  unauthorized_tool_executions:
  sensitive_item_leaks:
  security_events_observed:
  alert_latency_seconds:
  control_latency_ms:
  outcome: passed | failed | inconclusive

scope_statement:
  This result applies only to the recorded release, policies,
  tool registry, models, dataset cases, and repetitions.

findings:
  - id:
    severity:
    description:
    evidence:
    owner:
    due_at:

reviewers:
```

## 13. Security Acceptance Report

```yaml
release:
evaluated_at:

baseline:
  threat_model_version:
  policy_version:
  tool_registry_hash:
  identity_configuration:
  red_team_dataset:
  model_routes:
  prompt_versions:

metrics:
  attack_success_rate:
    numerator:
    denominator:
    value:
  safe_task_completion:
    numerator:
    denominator:
    value:
  false_block_rate:
    numerator:
    denominator:
    value:
  pii_leakage_rate:
    numerator:
    denominator:
    value:
  unauthorized_tool_rate:
    numerator:
    denominator:
    value:
  audit_coverage:
    numerator:
    denominator:
    value:

drills:
  kill_switch:
  secret_revocation:
  policy_backend_failure:
  dlp_backend_failure:
  audit_backend_failure:
  nonce_store_failure:

findings:
  open_critical:
  open_high:
  accepted_residual_risks:

decision:
  effect: approved | approved_with_conditions | rejected
  conditions:

approvers:
  application_owner:
  platform_owner:
  security_owner:
  data_owner:

evidence_refs:
```

只有当报告中的版本、分母、证据和残余风险都可回查时，“安全验收通过”才是一项可审计结论。
