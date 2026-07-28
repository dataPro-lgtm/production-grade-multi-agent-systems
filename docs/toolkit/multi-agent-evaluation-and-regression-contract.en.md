---
title: Multi-Agent Evaluation and Continuous Regression Contract
description: Defines quality contracts, Golden Datasets, Fixtures, evaluators, Judges, N-run protocols, regression gates, and online evaluation
---

# Multi-Agent Evaluation and Continuous Regression Contract

This template turns “the answer looks good” into reproducible, comparable, and auditable release evidence. It should be maintained jointly by the business Owner, domain experts, agent engineering, data, security, SRE, and quality leads.

Start by completing it for one high-value or high-risk vertical path. Do not try to cover the entire product at the outset.

## 1. Eval Charter

```yaml
eval_charter:
  system_id: ""
  version: "0.1.0"
  status: draft
  mission: ""
  target_users: []
  target_outcomes: []
  in_scope: []
  out_of_scope: []
  risk_owners:
    business: ""
    quality: ""
    security: ""
    sre: ""
  repositories: []
  dashboards: []
```

Questions to answer:

- What Goal is the user actually trying to accomplish?
- Which outcomes must be zero and cannot be included in a statistical error budget?
- Which attributes can be evaluated by rules, and which require domain or semantic judgment?
- Does an evaluation failure block a PR or release, or does it only trigger monitoring?

## 2. Quality Contract

Every metric must define its calculation, population, slices, evaluator, threshold, and Owner.

| Metric ID | Outcome / Risk | Population | Calculation | Evaluator | Threshold | Gate | Owner |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | hard / non-regression / budget |  |

```yaml
metric:
  id: ""
  version: 1
  description: ""
  unit: ratio | count | ms | usd | score
  population:
    include: []
    exclude: []
  calculation:
    numerator: ""
    denominator: ""
    aggregation: mean | p50 | p95 | p99 | max | rate
    window: ""
  evaluator_id: ""
  slices: []
  policy:
    type: hard | target | non_regression | budget
    operator: eq | gte | lte | max_drop | max_increase
    threshold: 0
  minimum_samples: 0
  owner: ""
  reviewed_at: ""
```

Checklist:

- [ ] Security invariants are not folded into a weighted aggregate score.
- [ ] Ratio metrics declare both numerator and denominator.
- [ ] Latency and cost metrics declare their statistical window and exclusions.
- [ ] Thresholds come from business loss, a baseline, or an SLO, not an arbitrary integer.
- [ ] Every metric failure has a defined action and Owner.

## 3. Dataset Manifest

```yaml
dataset:
  dataset_id: ""
  version: ""
  purpose: development | regression | holdout | judge_calibration | adversarial
  owner: ""
  created_at: ""
  valid_from: ""
  review_by: ""
  sources: []
  case_count: 0
  languages: []
  risk_levels: []
  allowed_uses: []
  prohibited_uses:
    - model_training
    - application_few_shot
  access_policy: ""
  pii_status: none | deidentified | restricted
  content_digest: ""
```

## 4. Golden Entry

```yaml
case:
  case_id: ""
  version: 1
  title: ""
  intent: ""
  risk: low | medium | high | critical
  tags: []

  input:
    user_message: ""
    conversation_history: []
    subject: {}
    locale: zh-CN
    environment: eval

  initial_state:
    goal_status: pending
    checkpoint_ref: ""
    memory_ref: ""

  expect:
    required_facts:
      - fact_id: ""
        predicate: ""
        operator: equals | contains | in | absent
        value: ""
        evidence_refs: []
    required_path:
      teams: []
      skills: []
      invariants: []
    acceptable_actions: []
    forbidden_actions: []
    acceptable_outcomes: []
    required_uncertainty: []

  tolerances:
    numeric: {}
    time: {}
    semantic: ""

  run_policy:
    repetitions: 1
    success_definition: ""
    safe_path_rate_min: 1.0

  fixtures:
    entity: ""
    knowledge: ""
    tools: ""
    execution: ""

  governance:
    source: ""
    source_event_ref: ""
    author: ""
    reviewers: []
    valid_from: ""
    review_by: ""
    change_reason: ""
```

Checklist:

- [ ] The reference answer has been decomposed into facts, evidence, path, and presentation attributes.
- [ ] `no_data` does not mean that a business fact is false.
- [ ] Allowed and forbidden actions are both represented as structured fields.
- [ ] Open-ended tasks declare multiple acceptable outcomes or semantic tolerances.
- [ ] Every Case has a source, Owner, validity period, and Fixture.

## 5. Fixture Manifest

```yaml
fixture:
  fixture_id: ""
  version: ""
  content_digest: ""
  environment: eval

  entities:
    snapshot_ref: ""
    tenant_ids: []
    reset_strategy: ""

  knowledge:
    documents_ref: ""
    parser_version: ""
    index_version: ""
    valid_time: ""

  tools:
    mode: record_replay | fake | sandbox
    contracts: []
    responses: []
    faults: []
    side_effect_sink: ""

  execution:
    capability_snapshot_ref: ""
    policy_version: ""
    checkpoint_seed_ref: ""
    cache_policy: disabled | cold | warm

  privacy:
    pii_status: none | deidentified | restricted
    retention_days: 0
```

Fixture validation:

- [ ] Tool Fakes validate the input Schema, permissions, and idempotency.
- [ ] The Fixture can generate timeouts, rate limits, unknown outcomes, conflicts, and late responses.
- [ ] Every run can reset business state, Checkpoints, Memory, and caches.
- [ ] Data snapshots and Golden facts share the same valid time.

## 6. Coverage Matrix

| Slice | Cases | Repetitions | Primary Risk | Required Evaluators | Minimum Coverage | Owner |
|---|---:|---:|---|---|---:|---|
| single-team read |  |  |  |  |  |  |
| multi-team parallel |  |  |  |  |  |  |
| multi-team sequential |  |  |  |  |  |  |
| multi-turn |  |  |  |  |  |  |
| high-risk decision |  |  |  |  |  |  |
| recovery / replay |  |  |  |  |  |  |
| adversarial |  |  |  |  |  |  |
| no-data / conflict |  |  |  |  |  |  |

Additional dimensions:

- Language and region;
- new users and returning users;
- short context and long context;
- common intents and long-tail intents;
- model, Provider, Prompt, Team, and Tool Version;
- permissions, tenant, data classification, and risk level.

## 7. Evaluator Registry

```yaml
evaluator:
  evaluator_id: ""
  version: ""
  type: code | domain_rule | llm_judge | human
  owner: ""
  measures: []
  inputs: []
  output_schema: ""
  deterministic: true
  implementation_ref: ""
  test_cases: []
  known_limitations: []
  valid_from: ""
  review_by: ""
```

| Attribute | Evaluator | Why It Fits | Failure Action |
|---|---|---|---|
| Schema / Type |  |  |  |
| Plan / Dependency |  |  |  |
| Route / Tool / Args |  |  |  |
| Policy / Side Effect |  |  |  |
| Evidence / Faithfulness |  |  |  |
| Completeness / Utility |  |  |  |
| Cost / Latency |  |  |  |

## 8. Judge Contract

```yaml
judge:
  judge_id: ""
  version: ""
  model: ""
  provider: ""
  mode: single | reference_guided | pairwise
  rubric_version: ""
  prompt_digest: ""
  input_schema: ""
  output_schema: ""
  evidence_pack_required: true
  allowed_labels: [pass, fail, abstain]
  score_range: [0, 3]
  abstain_conditions: []
  position_control:
    randomize: true
    swap_and_repeat: false
  injection_controls: []
  calibration_report_ref: ""
  owner: ""
```

### 8.1 Rubric

| Criterion | Definition | Pass Anchor | Fail Anchor | Required Evidence | Weight |
|---|---|---|---|---|---:|
|  |  |  |  |  |  |

Rubric checklist:

- [ ] Each Criterion describes exactly one attribute.
- [ ] Anchors use observable behavior, not “good overall.”
- [ ] The Judge does not adjudicate amounts, dates, IDs, or permissions that code can determine.
- [ ] User content, tool results, and the answer under evaluation are all isolated as untrusted data.
- [ ] The output supports `abstain` and EvidenceRef.

## 9. Judge Calibration Report

```yaml
judge_calibration:
  judge_id: ""
  calibration_dataset: ""
  human_labelers:
    count: 0
    qualification: ""
  sample_size: 0
  metrics:
    exact_agreement: 0
    weighted_kappa: 0
    precision_by_label: {}
    recall_by_label: {}
    rank_correlation: 0
    abstain_rate: 0
    order_flip_rate: 0
  slices:
    - slice: ""
      sample_size: 0
      error_rate: 0
  known_failure_modes: []
  decision: approved | limited | rejected
  approved_uses: []
  prohibited_uses: []
  next_review_at: ""
```

- [ ] The report compares the Judge with independent human labels, not with labels generated by the Judge itself.
- [ ] High-risk, language, length, and domain slices are checked separately.
- [ ] Position-swap, verbosity, and self-preference tests are recorded.
- [ ] Recalibrate whenever the Judge model or Rubric changes.

## 10. Layer Scorecard

### 10.1 Planner

| Metric | Definition | Evaluator | Gate |
|---|---|---|---|
| plan_valid_rate |  |  |  |
| team_recall |  |  |  |
| team_precision |  |  |  |
| dependency_accuracy |  |  |  |
| constraint_coverage |  |  |  |
| plan_minimality |  |  |  |

### 10.2 Router / Team

| Metric | Definition | Evaluator | Gate |
|---|---|---|---|
| route_precision |  |  |  |
| unnecessary_dispatch_rate |  |  |  |
| effective_scope_validity |  |  |  |
| fallback_correctness |  |  |  |
| team_result_contract_rate |  |  |  |

### 10.3 Worker / Tool

| Metric | Definition | Evaluator | Gate |
|---|---|---|---|
| tool_selection_accuracy |  |  |  |
| tool_argument_validity |  |  |  |
| worker_faithfulness |  |  |  |
| error_semantics_accuracy |  |  |  |
| unauthorized_side_effects |  |  | hard |

### 10.4 Consolidator / Decision

| Metric | Definition | Evaluator | Gate |
|---|---|---|---|
| claim_evidence_coverage |  |  |  |
| contradiction_rate |  |  |  |
| required_fact_recall |  |  |  |
| uncertainty_calibration |  |  |  |
| recommendation_accuracy |  |  |  |
| approval_requirement_accuracy |  |  | hard |

## 11. Context Graph Assertions

```yaml
graph_assertions:
  - id: completed_step_has_result
    query_ref: ""
    expected: zero_violations
  - id: required_result_has_evidence
    query_ref: ""
    expected: zero_violations
  - id: final_claim_has_evidence
    query_ref: ""
    expected: zero_violations
  - id: dependency_completed_before_start
    query_ref: ""
    expected: zero_violations
  - id: no_new_step_after_cancel
    query_ref: ""
    expected: zero_violations
  - id: late_result_not_joined
    query_ref: ""
    expected: zero_violations
```

Traceability:

- [ ] Every Graph Node can be associated with a `trace_id` / `span_id`.
- [ ] Every Artifact has a content Hash and immutable reference.
- [ ] Every Policy Decision includes identity, Scope, resource, and rule version.
- [ ] Every Claim can be traced back to valid Evidence.

## 12. N-run Protocol

```yaml
n_run:
  protocol_id: ""
  repetitions: 10
  success_definition: ""
  metrics:
    - pass_at_k
    - pass_all_k
    - safe_path_rate
    - mean
    - variance
    - worst_slice
  model:
    name: ""
    version: ""
    parameters: {}
    seed_support: ""
  reset:
    checkpoint: true
    memory: true
    tool_state: true
    cache: cold
  execution:
    concurrency: 1
    timeout_ms: 0
    retry_policy: ""
  artifacts:
    save_each_run: true
    retention_days: 0
```

- [ ] `pass@k` is not conflated with “all k runs pass.”
- [ ] Safety gates use `safe_path_rate` or an explicit all-pass condition.
- [ ] Every run preserves its Plan, Route, Tool, Evidence, Graph, Trace, and Output.
- [ ] The report does not misrepresent repeated runs as independent and identically distributed samples.

## 13. Multi-turn Scenario

```yaml
scenario:
  scenario_id: ""
  initial_state_ref: ""
  turns:
    - turn: 1
      user: ""
      expected:
        resolved_entities: []
        facts: []
        state_changes: []
        preserved_constraints: []
        forbidden_actions: []
  final_expectation:
    goal_status: ""
    required_evidence: []
    no_new_steps_after_cancel: false
```

Required coverage:

- Reference resolution and entity continuity;
- preservation of constraints across turns;
- renewed authorization for high-risk actions;
- cancellation and timeouts;
- fidelity of facts and permissions after context compression;
- conversation and tenant isolation.

## 14. Adversarial Case

```yaml
adversarial_case:
  case_id: ""
  attack_class: direct_injection | indirect_injection | tool_poisoning | pii_exfiltration | replay | excessive_agency | resource_abuse
  payload_ref: ""
  target_asset: ""
  forbidden_outcomes: []
  expected_safe_outcomes:
    - blocked_safely
    - answered_safely
  observations:
    policy_decision: ""
    tool_calls: []
    side_effects: []
    audit_events: []
  result: blocked_safely | blocked_incorrectly | answered_safely | compromised
```

## 15. Feedback Experiment

```yaml
feedback_experiment:
  experiment_id: ""
  feedback_source: ""
  curation_version: ""
  privacy_review_ref: ""
  baseline:
    experience_store: disabled
  candidate:
    experience_store: ""
  holdout_dataset: ""
  paired_metrics: []
  hard_gates:
    - security
    - privacy
    - forbidden_actions
  poisoning_tests: []
  decision: ""
```

## 16. Regression Gate Policy

```yaml
release_gate:
  version: ""
  hard:
    unauthorized_side_effects:
      equals: 0
    cross_tenant_leakage:
      equals: 0
    contract_pass_rate:
      equals: 1.0
    safe_path_rate_high_risk:
      equals: 1.0

  non_regression:
    goal_success_rate:
      max_drop: 0
    claim_evidence_coverage:
      max_drop: 0

  budgets:
    p95_goal_latency_ms:
      max: 0
    cost_per_successful_goal:
      max: 0

  minimum_samples:
    overall: 0
    high_risk: 0

  insufficient_evidence_action: block | conditional_go | human_review
  waiver_policy_ref: ""
```

Ten checks:

- [ ] Contract
- [ ] Plan Valid
- [ ] Route Precision
- [ ] Tool Correctness
- [ ] Faithfulness
- [ ] Goal Success
- [ ] Safety
- [ ] Stability
- [ ] Performance
- [ ] Cost

## 17. Eval Run Manifest

```yaml
eval_run:
  run_id: ""
  started_at: ""
  candidate:
    git_sha: ""
    model: ""
    prompts: {}
    agents: {}
    tools: {}
    policy: ""
  dataset:
    id: ""
    version: ""
    digest: ""
  fixtures:
    id: ""
    version: ""
    digest: ""
  evaluators: []
  judge:
    id: ""
    rubric: ""
  baseline_run_id: ""
  execution:
    repetitions: 1
    concurrency: 1
    cache_policy: ""
  artifact_root: ""
```

## 18. Baseline Comparison

```yaml
comparison:
  baseline_run_id: ""
  candidate_run_id: ""
  paired_on: [case_id, fixture_version, run_index]
  metrics:
    - metric_id: ""
      baseline: 0
      candidate: 0
      paired_delta: 0
      interval: [0, 0]
      sample_size: 0
      method: ""
      decision: improve | neutral | regress | insufficient_evidence
  slices: []
  hard_gate_results: []
```

Statistical checklist:

- [ ] Pair comparisons on the same Case and Fixture.
- [ ] Report the point estimate, difference, interval, and sample size.
- [ ] Missing runs and Judge abstentions are not silently dropped.
- [ ] Exploratory conclusions across multiple metrics and slices are not presented as definitive conclusions.
- [ ] Statistical significance and business importance are explained separately.

## 19. Pipeline Matrix

| Stage | Dataset | Repetitions | Evaluators | Gate | Artifact Retention |
|---|---|---:|---|---|---|
| PR |  |  |  |  |  |
| Nightly |  |  |  |  |  |
| Pre-release |  |  |  |  |  |
| Canary / Shadow |  |  |  |  |  |
| Production |  |  |  |  |  |

## 20. Online Evaluation and Drift

```yaml
online_eval:
  deterministic_rules:
    coverage: all
    rules: []
  judge_sampling:
    base_rate: 0
    oversampled_slices: []
    privacy_controls: []
  user_feedback: []
  business_outcomes: []
  human_review:
    queue: ""
    sla: ""

  drift:
    input: []
    path: []
    quality: []
    system: []
    data: []
```

- [ ] Online reports disclose the sampling rate and oversampling strategy.
- [ ] Raw production content complies with privacy, retention, and access policies.
- [ ] Low-frequency, high-risk Cases are not obscured by overall averages.
- [ ] Drift alerts can be associated with model, Prompt, Tool, Policy, data, and deployment versions.

## 21. Quality Incident

```yaml
quality_incident:
  incident_id: ""
  detected_at: ""
  source: eval | canary | production | user_report
  case_id: ""
  run_id: ""
  layer: dataset | evaluator | prompt_model | agent_contract | tool_data | runtime | security_policy
  symptom: ""
  impact: ""
  evidence_refs: []
  trace_ref: ""
  context_graph_ref: ""
  versions: {}
  root_cause: ""
  containment: ""
  fix: ""
  regression_case_id: ""
  owner: ""
  due_at: ""
```

## 22. Eval Report and Release Decision

```yaml
eval_report:
  report_id: ""
  candidate: ""
  baseline: ""
  dataset: ""
  sample_size: 0
  run_policy: ""
  headline_metrics: {}
  slice_regressions: []
  hard_gates: pass | fail
  evidence_quality: sufficient | limited | insufficient
  decision: go | no_go | conditional_go
  conditions: []
  rollback_triggers: []
  expires_at: ""
  approvals:
    quality: ""
    security: ""
    business: ""
```

A Conditional-Go requires all of the following:

- [ ] Explicit risks and affected slices;
- [ ] Canary or Shadow scope;
- [ ] additional sampling and human review;
- [ ] rollback triggers that can be evaluated automatically;
- [ ] a fix Owner and deadline;
- [ ] a decision expiration time.

## 23. Definition of Done

### Data

- [ ] Golden, Holdout, Judge Calibration, and Adversarial Sets are isolated.
- [ ] Cases, Fixtures, and Evidence have versions, Hashes, sources, Owners, and validity periods.
- [ ] The coverage matrix includes high-risk, failure, multi-turn, recovery, and adversarial paths.

### Measurement

- [ ] Deterministic attributes are not left for the Judge to guess.
- [ ] The Judge is calibrated, can abstain, and is reviewed again when its version changes.
- [ ] Layered metrics can localize an end-to-end failure to an accountability boundary.
- [ ] N-run conditions are reproducible, and every run's artifacts are traceable.

### Release

- [ ] The scope and gates for PR, Nightly, Pre-release, Canary, and Production are explicit.
- [ ] Baseline / Candidate comparisons include slices, intervals, and an insufficient-evidence state.
- [ ] Hard gates, non-regression gates, and budget gates are decided independently.
- [ ] Release conclusions, exceptions, rollback, and approvals are auditable.

### Operations

- [ ] Online rules, sampled Judge evaluation, user feedback, and business outcomes form a closed loop.
- [ ] Input, path, quality, system, and data drift are monitored separately.
- [ ] Quality incidents produce a minimal reproduction Case and regression assertions.
