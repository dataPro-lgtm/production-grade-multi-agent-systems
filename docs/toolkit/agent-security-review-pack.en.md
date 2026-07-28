---
title: Agent security review and red-team contract
description: Reusable templates for threat records, Tool Security Manifests, approvals, auditing, red-teaming, and security acceptance
---

# Agent security review and red-team contract

This template turns agent security from prompt-level guidance into an executable contract. Application, platform, security, data, and business owners should review it together and bind every conclusion to an implementation path or verification evidence.

!!! warning "Completing the template does not mean the system is secure"
    The template can only help teams identify omissions. Final conclusions must come from policy tests, integration tests with real identities, attack tests, control-plane fault injection, and runtime evidence.

## 1. System security context

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

## 2. Threat record

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

### Threat review questions

- Can an attacker alter the objective or tool sequence?
- Can a low-privilege principal borrow the authority of a high-privilege agent?
- Can two legitimate tools be combined to exfiltrate data?
- Could memory / RAG persist malicious content?
- Does the system Fail Open or Fail Closed when a control backend fails?
- How will isolation, revocation, and recovery work after an incident?
- Does every high-risk threat have a repeatable test?

## 3. Security control matrix

| Threat | Asset | Boundary | Prevent | Detect | Respond | Recover | Policy Owner | Implementation Owner | Tests | Metrics | Residual Risk |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

## 4. Tool security manifest

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

### Tool veto criteria

- The model can read production secrets directly;
- The Tool ID or Publisher is not unique;
- The version or schema is not pinned;
- High-risk side effects do not require approval;
- Write operations lack idempotency and resource-version checks;
- External network access is unrestricted;
- Results are not governed by field-level ACLs and data classification;
- The tool cannot be disabled independently.

## 5. Effective authority decision

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

## 6. Bound approval

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

### Approval acceptance

- [ ] The approver sees the exact parameters and the diff;
- [ ] The token is bound to the action, resource, version, scope, and expiry;
- [ ] The user and resource are revalidated before execution;
- [ ] A resource change triggers reapproval;
- [ ] The token cannot be used for another tool or resource;
- [ ] R3 operations satisfy separation of duties;
- [ ] Denials and expirations both produce reliable audit records.

## 7. Delegation security contract

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

Invariants:

```text
child_scope ⊆ parent_effective_scope
child_deadline ≤ parent_deadline
child_risk ≤ parent_risk
```

## 8. Privacy and memory record

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

## 9. Audit event contract

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

### Audit integrity checks

- [ ] Subject, Action, Resource, Policy, Decision, and Outcome can be reconstructed;
- [ ] Prompts, secrets, PII, and complete business results are not copied unnecessarily;
- [ ] Missing or delayed events, signature failures, and breaks in the hash chain can trigger alerts;
- [ ] High-risk actions Fail Closed when audit is unavailable;
- [ ] Keys, time sources, and immutable storage have independent custody;
- [ ] Exports of and access to audit records are themselves audited.

## 10. Control failure matrix

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

## 11. Red-team case

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

## 12. Red-team result

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

## 13. Security acceptance report

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

Only when the versions, denominators, evidence, and residual risks in the report are all traceable can “security acceptance has passed” be treated as an auditable conclusion.
