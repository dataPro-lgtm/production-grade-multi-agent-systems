---
title: AgentOps Production Operations and Readiness Contract
description: Defines goal-level SLOs, diagnostics, controls, recovery, cost, GameDay, and ORR for multi-agent systems
---

# AgentOps Production Operations and Readiness Contract

This template is designed to move a multi-agent system from “deployed” to “continuously operable.” It is not an exhaustive catalog of generic monitoring fields. It is a responsibility contract spanning business, agent engineering, platform, SRE, security, data, and cost teams.

Start by completing it for one high-value or high-risk Goal path. Before release, conduct one tabletop exercise and one controlled GameDay through the actual control plane.

## 1. Service and operational boundaries

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

Checklist:

- [ ] Supported user Goals are defined, not merely a list of APIs.
- [ ] Unsupported intents, risks, and side effects are explicit.
- [ ] Every category of operational decision has an Owner.
- [ ] The release version can be correlated with Prompt, Model, Policy, Tool, and Knowledge versions.

## 2. Correlation spine and execution identities

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

### 2.1 Version inventory

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

## 3. Goal outcome event

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

Constraints:

- [ ] `outcome=complete` has an executable business definition.
- [ ] `goal_success` accounts for the result, evidence, and safe path together.
- [ ] Cancellations, user abandonment, and dependency failures have explicit denominator policies.
- [ ] Raw user IDs, Prompts, and PII are excluded from Metric Labels.

## 4. Tier 1 metrics and SLOs

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

### 4.1 Error budget policy

| Budget State | Entry Condition | Change Policy | Containment | Exit Condition | Approver |
|---|---|---|---|---|---|
| Healthy |  |  |  |  |  |
| Caution |  |  |  |  |  |
| Fast Burn |  |  |  |  |  |
| Exhausted |  |  |  |  |  |

Checklist:

- [ ] Thresholds are derived from business loss, baselines, and risk—not industry folklore.
- [ ] Policies cover both Fast Burn and Slow Burn.
- [ ] Security incidents are not offset against the reliability budget.
- [ ] When the budget is exhausted, the changes to stop and the fixes to permit are documented.

## 5. Tier 2 diagnostic metrics catalog

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

## 6. Telemetry schema and data governance

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

### 6.1 Cardinality review

Candidates suitable for Metric Labels:

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

The following must not be used as Metric Labels by default:

- `request_id`
- `user_id`
- Any URL or Query
- Raw Prompt
- Tool Output
- Evidence body
- PII

### 6.2 Sampling policy

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

## 7. Five-view dashboard

### 7.1 Business view

- [ ] Goal Success / Partial / Blocked
- [ ] Evidence Coverage
- [ ] Human Escalation
- [ ] Slices by Intent, Risk, Tenant Tier, and Release

### 7.2 Execution view

- [ ] Plan / Replan
- [ ] Route / Fallback
- [ ] Critical Path
- [ ] Step / Join / Deadline
- [ ] Retry Amplification

### 7.3 Model view

- [ ] Provider / Model / Prompt Version
- [ ] TTFT / Latency / Token
- [ ] Structured Output Failure
- [ ] Fallback and capability degradation

### 7.4 Tool view

- [ ] Tool Intent / Policy Decision
- [ ] Latency / Error / Rate Limit
- [ ] Idempotency / Unknown Side Effect
- [ ] Evidence Freshness

### 7.5 Control view

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

## 8. Alert registry

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

Checklist:

- [ ] Alerts target user impact or explicit risk.
- [ ] On-call personnel do not need to search again for versions and representative samples.
- [ ] Alerts point to executable Runbooks.
- [ ] Silence actions have approval, scope, and expiry.

## 9. Incident bundle

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

## 10. Incident causal reconstruction

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

Root-cause record:

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

## 11. Failure taxonomy

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

Clustering key:

```text
team × failure_class × release_version × prompt_version × intent × risk
```

## 12. Control action contract

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

Checklist:

- [ ] High-impact actions require two-person review.
- [ ] Break-glass access has a TTL, reason, and audit trail.
- [ ] Expected Version prevents concurrent changes from being overwritten.
- [ ] Automated actions cover only rehearsed, reversible scopes.
- [ ] AI recommendations are separated from deterministic execution privileges.

## 13. Circuit breaking, degradation, and recovery policy

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

## 14. Checkpoint, recovery, and Reconcile

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

### 14.1 Replan contract

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

## 15. Deadline and retry policy

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

## 16. Provider contract and failover

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

Standardized errors:

```text
rate_limited | timeout | unavailable | invalid_output
safety_block | context_exceeded | authentication | billing
```

## 17. Cost event and budgets

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

## 18. Knowledge and context operations

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

### 18.1 Context compression

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

## 19. Semantic cache contract

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

## 20. Feedback and experience governance

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

Checklist:

- [ ] Production feedback is not written automatically into Prompts or long-term memory.
- [ ] Provenance, Reviewer, Scope, Validity, and Compatibility are complete.
- [ ] PII, injection, and feedback poisoning have been checked.
- [ ] The experience passes Holdout / A-B or canary validation before release.

## 21. Prompt release manifest

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

Lifecycle:

```text
Draft → Review → Offline Eval → Canary → Promote
      → Operate → Rollback → Retire
```

## 22. Capacity and high availability

| Boundary | Bottleneck Signal | Scale Action | Max | Drain | Checkpoint | Side-effect Protection |
|---|---|---|---|---|---|---|
| Gateway |  |  |  |  |  |  |
| Supervisor |  |  |  |  |  |  |
| Team / Worker |  |  |  |  |  |  |
| MCP / Tool |  |  |  |  |  |  |
| Context Graph |  |  |  |  |  |  |
| Evaluation |  |  |  |  |  |  |

Failover checklist:

- [ ] Drain Goals that are in progress.
- [ ] Checkpoint at defined Safe Points.
- [ ] Idempotency / Reconcile prevents duplicate side effects.
- [ ] Authorization / Approval is revalidated after migration.
- [ ] Late Results cannot overwrite a new Plan.

## 23. Trust boundaries and operational security

| Boundary | Identity | Encryption | Schema | Least Privilege | Output Sanitization | Audit |
|---|---|---|---|---|---|---|
| Intent → Gateway |  |  |  |  |  |  |
| Gateway → Agent Zone |  |  |  |  |  |  |
| Agent → MCP / Tool |  |  |  |  |  |  |
| Agent → Knowledge |  |  |  |  |  |  |
| Agent → Context Graph |  |  |  |  |  |  |

Operational security signals:

- Tool Output Injection;
- Cross-tenant Retrieval;
- PII / DLP detection;
- Unauthorized Action;
- Approval Expiry / Replay;
- Delegation Scope Mismatch.

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

Automation boundary:

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

Suggested scenarios:

- [ ] Provider 5xx / rate limiting.
- [ ] A slow Tool with an unknown side effect.
- [ ] A stale Knowledge Snapshot.
- [ ] A crash after Checkpoint.
- [ ] Capability Card drift.
- [ ] Context Compression confuses subjects.
- [ ] Feedback Poisoning.
- [ ] A cross-subject Semantic Cache hit.

## 26. Operational readiness review

### 26.1 Service and SLOs

- [ ] Goals, intents, risks, and exclusions are defined.
- [ ] Tier 1 / Tier 2 metrics can be calculated from production data.
- [ ] The SLO and error budget policy have been approved.
- [ ] Zero-tolerance security conditions are not folded into an offsettable aggregate score.

### 26.2 Quality and evidence

- [ ] Golden Dataset, Fixture, N-run, and canary evidence are traceable.
- [ ] The Claim → Evidence path is queryable.
- [ ] Critical execution Artifacts have access, retention, and deletion policies.
- [ ] Prompt / Model / Tool / Knowledge versions can be correlated.

### 26.3 Diagnosis and response

- [ ] The five-view Dashboard is available.
- [ ] Alerts include impact, slices, samples, changes, and a Runbook.
- [ ] The Incident Bundle can automatically collect baseline facts.
- [ ] The Failure Taxonomy and Triage Owner are defined.

### 26.4 Control and recovery

- [ ] Circuit breaking, degradation, cancellation, and rollback can be executed through the control plane.
- [ ] Control Actions have Scope, Approval, TTL, and Audit.
- [ ] Checkpoint Resume reauthorizes and checks the Deadline.
- [ ] Unknown side effects are handled through Reconcile.
- [ ] Recovery exit conditions cover Goal, Evidence, security, and cost together.

### 26.5 Resilience and capacity

- [ ] Deadline and Retry Budgets propagate end to end.
- [ ] Provider Failover has passed compatibility evaluation.
- [ ] Scaling follows real bottlenecks rather than guesses based on the number of agents.
- [ ] Drain, Checkpoint, and Side-effect Protection have been verified.

### 26.6 Cost, knowledge, and learning

- [ ] Cost Events can be attributed to successful Goals.
- [ ] Budget exhaustion has explicit business semantics.
- [ ] Knowledge / Ontology releases have compatibility tests and rollback.
- [ ] Context Compression preserves the subject, constraints, and Evidence.
- [ ] Feedback / Experience has human governance and an expiration date.

### 26.7 People and process

- [ ] On-call, escalation, and incident roles are explicit.
- [ ] The Runbook has been executed by someone other than its author.
- [ ] At least one high-risk scenario has completed a GameDay.
- [ ] Drill action items have an Owner and due date.

## 27. ORR decision record

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

Final principle:

> A version that can be released is not necessarily operable. A multi-agent system is truly production-ready only when its Goals are measurable, causal chains can be reconstructed, actions are auditable, state is recoverable, costs are attributable, and failures can be rehearsed.
