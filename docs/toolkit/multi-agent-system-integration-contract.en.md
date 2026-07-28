---
title: Multi-Agent System Integration and Acceptance Contract
description: A template for designing the layers, capabilities, plans, A2A, MCP, state, Context Graph, failures, and acceptance criteria of a hierarchical multi-agent system
---

# Multi-Agent System Integration and Acceptance Contract

This template is designed to move a system from “multiple agents can be called” to “one system can be released.” It should be completed jointly by the business owner, agent platform team, domain teams, security team, SRE team, and evaluation lead.

Do not fill in every section at once. Start with one real vertical business flow, establish the contracts and acceptance evidence, and then expand the teams and capabilities.

## 1. Document metadata

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

## 2. System mission

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

Required questions:

- Why is a deterministic workflow insufficient?
- Why is a single agent insufficient?
- Can the benefits of a multi-agent system be evaluated?
- If the system is degraded to a single agent or read-only mode, which business value remains?

## 3. Layering decision

| Decision axis | Evidence | Independent boundary required? | Owner |
|---|---|---|---|
| Domain entities and rules |  |  |  |
| Data and tenants |  |  |  |
| Tools and side effects |  |  |  |
| Permissions and approvals |  |  |  |
| Scaling and deployment |  |  |  |
| Release lifecycle |  |  |  |
| Blast radius |  |  |  |
| Latency budget |  |  |  |

```yaml
architecture_decision:
  selected_shape: single_agent | deterministic_workflow | hierarchical_multi_agent
  reasons: []
  rejected_options: []
  expected_benefits: []
  added_costs: []
  rollback_shape: ""
```

## 4. Layer and team registry

| Layer / team | Sole responsibility | Explicitly not responsible for | Input contract | Output contract | Deployment owner |
|---|---|---|---|---|---|
| Access API |  |  |  |  |  |
| Central Supervisor |  |  |  |  |  |
| Team Supervisor A |  |  |  |  |  |
| Worker A1 |  |  |  |  |  |
| MCP Server A |  |  |  |  |  |

Boundary tests:

- [ ] The Central Supervisor does not access business databases directly.
- [ ] The Team Supervisor does not expand the user or parent task Scope.
- [ ] A Worker executes only named capabilities.
- [ ] A Tool does not interpret open-ended business goals.
- [ ] Planning, authorization, execution, and acceptance are not concentrated in a single Prompt.

## 5. Capability contract

### 5.1 A2A AgentCard source

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

### 5.2 Internal capability snapshot

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

Validation:

- [ ] The capability snapshot is not a verbatim copy of the AgentCard.
- [ ] Fields passed to the Planner have been minimized.
- [ ] The Card contains no static Secret.
- [ ] The Endpoint, version, signature, and health are rechecked at Dispatch time.

## 6. Goal contract

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

Invariants:

- [ ] Once created, a Goal must not be silently rewritten downstream.
- [ ] Forbidden actions are represented in structured fields, not only in the Prompt.
- [ ] Every Goal revision produces a version and an event.

## 7. Execution plan contract

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

### 7.1 Plan validator

- [ ] The Schema is valid.
- [ ] Step IDs are unique.
- [ ] The Team / Skill exists.
- [ ] Protocol and contract versions are compatible.
- [ ] Dependencies exist and contain no cycles.
- [ ] Required inputs can be mapped.
- [ ] The budget, concurrency, and Deadline are valid.
- [ ] Effective permissions are valid for every Step.
- [ ] Every high-risk Step declares an approval.
- [ ] The Join can distinguish every result status.
- [ ] The Evidence Requirement can be satisfied.
- [ ] The Replan count is bounded.

## 8. A2A dispatch contract

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

Recipient validation:

- [ ] The protocol version is supported.
- [ ] The caller identity is valid.
- [ ] The Audience identifies the current Agent System.
- [ ] The Expiry is still valid.
- [ ] The Nonce has not been replayed.
- [ ] The Subject / Tenant is not represented only in natural language.
- [ ] The Skill exists and is currently available.
- [ ] The recipient performs resource-level authorization again.
- [ ] Downstream Scope can only be narrowed.
- [ ] Task / Context visibility complies with the ACL.

## 9. MCP tool contract

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

Validation:

- [ ] A Tool Description does not grant permissions.
- [ ] Parameters use a structured Schema.
- [ ] The Resource is bound to the Tenant.
- [ ] The Tool Result is validated before it enters State.
- [ ] Side effects use Idempotency and Expected Version.
- [ ] Capability Negotiation is completed before MCP Tasks are used.
- [ ] HTTP authorization complies with the current MCP authorization framework.

## 10. Result and artifact contract

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

Artifact:

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

Rules:

- [ ] A2A task output uses an Artifact and does not depend on an ephemeral Message.
- [ ] `completed` includes a contract-complete Result.
- [ ] `no_data` is distinct from `failed`.
- [ ] `partial` / `degraded` lists missing items and their impact.
- [ ] The Result includes the Plan Version and Hash.
- [ ] The Artifact has an immutable reference, classification, and retention policy.

## 11. Evidence contract

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

Validation:

- [ ] The Anchor supports repeatable lookup.
- [ ] The Source Version / Hash can be verified.
- [ ] Evidence permissions do not disappear when the Evidence enters Context.
- [ ] Every high-risk Claim has Evidence.
- [ ] Inferences are separated from facts.

## 12. State ownership catalog

| Field / object | Source of Truth | Sole writer | Reducer / merge | Retention | Recovery strategy |
|---|---|---|---|---|---|
| Goal |  |  |  |  |  |
| Plan |  |  |  |  |  |
| StepResult |  |  |  |  |  |
| Evidence |  |  |  |  |  |
| Error |  |  | Append-only |  |  |
| Budget |  |  |  |  |  |
| Approval |  |  |  |  |  |
| FinalAnswer |  |  |  |  |  |

System invariants:

- [ ] Every Completed Step has a Result or No Data.
- [ ] Downstream work does not start while a hard dependency is incomplete.
- [ ] Every Final Claim can be traced back to Evidence.
- [ ] Every side effect can be traced back to authorization, approval, and an idempotency key.
- [ ] Results from an old Plan do not contaminate a new Plan.
- [ ] Duplicate Results with different Hashes are blocked.

## 13. Join contract

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

Tests:

- [ ] Required Success + Optional Timeout.
- [ ] Required No Data.
- [ ] Required Failure.
- [ ] Duplicate Same Hash.
- [ ] Duplicate Different Hash.
- [ ] Late Result from Old Plan.
- [ ] Evidence Conflict.
- [ ] Cancel during Join.

## 14. Context Graph schema

### 14.1 Nodes

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

### 14.2 Edges

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

### 14.3 Reference, do not copy

- [ ] Store only an Artifact Ref for large objects.
- [ ] Store only a Trace / Span Ref for traces.
- [ ] Use a Versioned Ref for a Knowledge Entity.
- [ ] Enforce the ACL and Tenant in graph queries.
- [ ] Deletion requests can propagate to indexes and derived projections.

## 15. Storage responsibility map

| Mechanism | Authoritative content | Write timing | Consistency | Failure strategy |
|---|---|---|---|---|
| Checkpoint |  |  |  |  |
| Event Log |  |  |  |  |
| State Store |  |  |  |  |
| Context Graph |  |  |  |  |
| Artifact Store |  |  |  |  |
| Trace Backend |  |  |  |  |
| Audit Store |  |  |  |  |

## 16. Error contract

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

Default strategies:

| Category | Automatic retry | Default action |
|---|---|---|
| Validation | No | Correct the input or perform a bounded Replan |
| Authorization | No | Reject or request approval |
| Transient | Conditional | Bounded backoff |
| Dependency | No | Block downstream work with hard dependencies |
| Model | Conditional | Structural repair or a limited Replan |
| Business | No | Return as a business result |
| Side Effect Unknown | No | Reconcile |
| Systemic | Conditional | Circuit Breaker / Failover |

## 17. Recovery contract

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

Recovery drills:

- [ ] Crash before the Tool call.
- [ ] Crash after the Tool call but before State is written.
- [ ] Crash after State is written but before the Context Graph is updated.
- [ ] Client restart while an A2A Task is running.
- [ ] Connection interruption while an MCP Task is running.
- [ ] Old Token / Approval expires.
- [ ] Resource version changes.
- [ ] The Parent Task has been cancelled.

## 18. Cancellation contract

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

- [ ] Cancel Accepted and Execution Stopped are recorded separately.
- [ ] A Terminal Task is not erroneously cancelled again.
- [ ] A Running Side Effect has Reconcile / Compensation.
- [ ] The Context Graph records the cancellation reason and Actor.

## 19. Context compression contract

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

Quality gates:

- [ ] Fact retention rate.
- [ ] Constraint retention rate.
- [ ] Negation retention rate.
- [ ] Evidence Anchor retention rate.
- [ ] Downstream task success rate.
- [ ] Sensitive information minimization.

## 20. Observability contract

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

| Plane | Metrics | Alerts | Dashboard | Owner |
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

## 21. Deployment and readiness

### 21.1 Deployment dependencies

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

- [ ] Configuration, certificates, and keys are valid.
- [ ] Migration versions match.
- [ ] State / Event / Artifact are readable and writable.
- [ ] The Context Graph is available, or controlled buffering is in place.
- [ ] Audit and Trace are writable.
- [ ] Dependent AgentCard, A2A, MCP, and business contracts are compatible.
- [ ] The model Provider and Fallback are available.
- [ ] Policy / Approval / Kill Switch are available.
- [ ] The Synthetic Golden Path passes.

## 22. Golden scenario manifest

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

## 23. Failure drill matrix

| ID | Injection point | Failure | Expected status | Retry / degradation | Invariant | Evidence location | Owner |
|---|---|---|---|---|---|---|---|
| F1 | Planner | Cyclic dependency |  |  | No Tool Call |  |  |
| F2 | A2A Team | Timeout |  |  |  |  |  |
| F3 | MCP Tool | Malformed Schema |  |  | Result does not enter State |  |  |
| F4 | Worker | Crash after Tool call |  |  | No duplicate side effect |  |  |
| F5 | Auth | Token expired |  |  | Do not reuse old Token |  |  |
| F6 | Context Graph | Unavailable |  |  |  |  |  |
| F7 | Scheduler | Cancel Race |  |  | Do not start downstream work |  |  |
| F8 | Model Provider | 5xx |  |  | Version remains traceable |  |  |

## 24. System acceptance report

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

## 25. Release gates

| Gate | Go | No-Go | Current decision | Evidence |
|---|---|---|---|---|
| Contract | Compatible, with Migration rehearsed | Unversioned / breaking compatibility |  |  |
| Business | Golden Scenario meets the target | Goal / Evidence misses the target |  |  |
| Recovery | Drills pass with no duplicate actions | Unknown state has no handling procedure |  |  |
| Security | Least privilege, approval, and audit checks pass | Privilege escalation / replay / cross-tenant access is possible |  |  |
| Operations | SLO, Alert, and Runbook are ready | Depends on manual observation |  |  |
| Cost | Within budget and attributable | Cost per successful goal is uncontrolled |  |  |
| Rollback | Versions and data can be rolled back | Irreversible with no compensation |  |  |

## 26. Final sign-off

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

The system has completed architectural review only when every unknown in the template has been converted into an explicit risk, Owner, deadline, and release decision. A blank is not “to be filled in later”; it is a gate that has not yet passed.
