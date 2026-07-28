---
title: Capstone system acceptance and open-source delivery contract
description: Defines project scope, vertical slices, evidence packages, release gates, supply chains, reproducibility, and open-source maintenance responsibilities
---

# Capstone system acceptance and open-source delivery contract

This template turns “the project can be demonstrated” into “the system can be accepted, its artifacts can be verified, its repository can be reproduced, and its responsibilities can be handed over.”

It should be completed jointly by the Product Owner, Domain Expert, Agent Architect, Engineering, Quality, Security, SRE, Open-source Maintainer, and an Independent Reviewer who was not involved in the implementation.

Do not fill in every section at the outset. Start with one high-value Vertical Slice, establish a complete evidence chain, and then expand the system’s capabilities.

## 1. Acceptance charter

```yaml
acceptance_charter:
  project_id: ""
  project_name: ""
  version: ""
  status: draft | review | accepted | conditional | rejected
  problem: ""
  users: []
  primary_goal: ""
  value_hypotheses: []
  in_scope: []
  out_of_scope: []
  anti_goals: []
  supported_intents: []
  supported_risks: []
  owners:
    product: ""
    domain: ""
    architecture: ""
    engineering: ""
    quality: ""
    security: ""
    sre: ""
    open_source: ""
  repositories: []
  target_release: ""
```

Checklist:

- [ ] The Problem describes user harm, not the name of a solution.
- [ ] The Primary Goal can be evaluated through an Outcome.
- [ ] Both In-scope and Out-of-scope are defined.
- [ ] Agent count, Token count, and generated word count are not used as value metrics.
- [ ] Every high-risk capability has a dedicated Owner.

## 2. Value hypothesis

| Hypothesis ID | User / Business Outcome | Baseline | Metric | Decision Rule | Owner |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

```yaml
value_hypothesis:
  hypothesis_id: ""
  statement: ""
  population: ""
  baseline: ""
  metric: ""
  target: ""
  minimum_samples: 0
  measurement_window: ""
  confounders: []
  if_supported: ""
  if_rejected: ""
  owner: ""
```

## 3. Risk register

| Risk ID | Scenario | User Impact | Likelihood | Severity | Control | Evidence | Owner | Review By |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

```yaml
risk:
  risk_id: ""
  category: product | quality | security | privacy | reliability | operations | legal
  scenario: ""
  affected_population: ""
  impact: ""
  likelihood: ""
  severity: low | medium | high | critical
  controls: []
  residual_risk: ""
  accepted_by: ""
  review_by: ""
```

## 4. Success and safety contract

| Metric / Invariant | Definition | Population | Target / Rule | Gate | Evidence | Owner |
|---|---|---|---|---|---|---|
| Goal Success |  |  |  |  |  |  |
| Evidence Coverage |  |  |  |  |  |  |
| Safe Path |  |  |  |  |  |  |
| Goal Latency |  |  |  |  |  |  |
| Cost per Success |  |  |  |  |  |  |
| Unauthorized Side Effect |  |  | equals 0 | hard |  |  |
| Cross-tenant Leakage |  |  | equals 0 | hard |  |  |

## 5. Requirement record

```yaml
requirement:
  requirement_id: ""
  version: 1
  category: business | functional | quality | security | reliability | performance | operations
  statement: ""
  rationale: ""
  user_or_system: ""
  risk: low | medium | high | critical
  preconditions: []
  acceptance:
    required_facts: []
    required_outcomes: []
    required_path: []
    thresholds: {}
  forbidden: []
  verification:
    tests: []
    evaluations: []
    drills: []
    runtime_signals: []
  owner: ""
  approved_by: []
  valid_from: ""
  review_by: ""
```

Checklist:

- [ ] The Statement can be objectively falsified.
- [ ] Acceptance distinguishes among Fact, Path, Outcome, and Threshold.
- [ ] Forbidden behaviors are expressed as structured conditions.
- [ ] Verification is bound to specific IDs.
- [ ] The Requirement has an Owner and a validity period.

## 6. Traceability matrix

| Requirement | ADR | Contract | Implementation | Test / Eval | Runtime Evidence | Sign-off |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

```yaml
traceability_record:
  requirement_ref: ""
  decision_refs: []
  contract_refs: []
  implementation_refs: []
  verification_refs: []
  runtime_evidence_refs: []
  owner: ""
  coverage_status: complete | partial | missing | obsolete
  release: ""
```

Change checklist:

- [ ] A Requirement change triggers a review of all affected items.
- [ ] A major Contract version change lists every Consumer.
- [ ] Obsolete Evidence cannot support the current Release.
- [ ] Sign-off is bound to the same RC.

## 7. Architecture blueprint

```yaml
architecture_blueprint:
  blueprint_id: ""
  version: ""
  layers:
    experience: []
    control: []
    agent: []
    capability: []
    platform: []
  trust_boundaries: []
  state_owners: []
  data_flows: []
  side_effect_boundaries: []
  deployment_units: []
  failure_domains: []
  diagrams: []
  approved_by: []
```

### 7.1 Boundary record

| Boundary | Caller Identity | Callee | Contract | Authorization | State Owner | Failure Semantics | Evidence |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 8. ADR index

| ADR ID | Decision | Status | Alternatives | Main Consequence | Evidence | Supersedes | Owner |
|---|---|---|---|---|---|---|---|
|  |  | proposed / accepted / superseded / rejected |  |  |  |  |  |

```yaml
adr:
  adr_id: ""
  title: ""
  status: proposed | accepted | superseded | rejected
  context: ""
  constraints: []
  options:
    - name: ""
      benefits: []
      costs: []
      risks: []
  decision: ""
  consequences:
    positive: []
    negative: []
  validation_evidence: []
  rollback_or_revisit: ""
  supersedes: []
  owner: ""
```

## 9. Contract registry

| Contract ID | Version | Producer | Consumers | Compatibility | Schema | Tests | Deprecation | Owner |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

Required coverage:

- [ ] Goal
- [ ] Execution Plan
- [ ] A2A Dispatch
- [ ] Team / Worker Result
- [ ] Agent Error
- [ ] Evidence Reference
- [ ] Approval
- [ ] Audit / Cost Event
- [ ] Checkpoint
- [ ] Control Action

### 9.1 Compatibility policy

```yaml
compatibility_policy:
  public_contracts: []
  versioning: semantic
  reject_unknown_major: true
  additive_minor_fields: allowed
  required_field_removal: breaking
  enum_extension: consumer_review
  consumer_contract_tests: required
  deprecation:
    announce_at: ""
    supported_until: ""
    migration_guide: ""
  registry: ""
  owner: ""
```

## 10. System invariants

| Invariant ID | Statement | Enforcement Point | Test | Runtime Signal | Hard Gate? |
|---|---|---|---|---|---:|
|  |  |  |  |  |  |

Minimum invariants:

- [ ] `completed` has a result that satisfies the contract.
- [ ] `no_data` and `tool_error` are distinguished from a business fact evaluating to false.
- [ ] Every Claim is bound to the correct Tenant, Subject, Version, and Evidence.
- [ ] Every side effect has authorization, approval, idempotency, and an Expected Version.
- [ ] A Late Result cannot overwrite a new Plan.
- [ ] Partial / Degraded results list what is missing and the resulting impact.

## 11. Vertical slice specification

```yaml
vertical_slice:
  slice_id: ""
  title: ""
  user_goal: ""
  risk: ""
  entrypoint: ""
  boundaries_crossed: []
  steps:
    - step_id: ""
      component: ""
      contract: ""
      state_change: ""
      evidence: ""
  success_outcome: ""
  allowed_partial_outcomes: []
  forbidden_outcomes: []
  faults: []
  required_observability: []
  clean_room_command: ""
  owner: ""
```

### 11.1 Slice gate

| Dimension | Acceptance | Evidence | Result | Owner |
|---|---|---|---|---|
| Correctness |  |  |  |  |
| State |  |  |  |  |
| Security |  |  |  |  |
| Reliability |  |  |  |  |
| Observability |  |  |  |  |
| Reproducibility |  |  |  |  |

Expansion policy:

```yaml
expansion_policy:
  require_slice_gate_pass: true
  next_capability: ""
  new_risks: []
  new_contracts: []
  new_evidence: []
  rollback_to_slice: ""
```

## 12. Milestone definition of done

```yaml
milestone_dod:
  milestone_id: ""
  capability: ""
  contract_changes: []
  code_refs: []
  tests:
    unit: []
    contract: []
    integration: []
    e2e: []
    adversarial: []
    failure: []
  traces:
    success: []
    failure: []
  threat_updates: []
  golden_updates: []
  docs_updates: []
  migration: ""
  rollback: ""
  metric_delta: {}
  cost_delta: {}
  approved_by: []
```

## 13. Repository architecture

```yaml
repository_architecture:
  repository: ""
  boundaries:
    docs: ""
    contracts: ""
    services: ""
    platform: ""
    evals: ""
    tests: ""
    deploy: ""
    examples: ""
  dependency_rules: []
  forbidden_imports: []
  architecture_tests: []
  code_owners: []
```

Checklist:

- [ ] A Contract does not depend on a Service implementation.
- [ ] A Team does not import another Team’s internal code.
- [ ] A Worker depends on a Tool Interface.
- [ ] An Eval uses the public entry point.
- [ ] Docs link to versioned ADRs, Contracts, and Runbooks.

## 14. Reproducible environment

```yaml
environment_contract:
  supported_os: []
  architectures: []
  runtimes: []
  package_managers: []
  lockfiles: []
  container_runtime: ""
  required_ports: []
  minimum_resources: {}
  external_dependencies: []
  environment_variables:
    - name: ""
      required: false
      secret: false
      safe_default: ""
  doctor_command: ""
  bootstrap_command: ""
  start_command: ""
  seed_command: ""
  smoke_command: ""
  eval_smoke_command: ""
  down_command: ""
```

## 15. Clean-room reproduction

```yaml
clean_room_reproduction:
  run_id: ""
  reviewer: ""
  reviewer_role: ""
  prior_project_knowledge: none | limited | substantial
  environment:
    os: ""
    architecture: ""
    runtime_versions: {}
  source_commit: ""
  release_artifact_digest: ""
  cache_state: empty
  steps:
    - command: ""
      expected: ""
      observed: ""
      duration: ""
      result: pass | fail
  successful_scenarios: []
  failure_scenarios: []
  trace_refs: []
  problems_found: []
  undocumented_interventions: []
  total_duration: ""
  result: pass | conditional | fail
  signed_at: ""
```

Hard requirements:

- [ ] Do not use caches from the author’s machine.
- [ ] Do not use undocumented commands.
- [ ] Do not obtain required steps through private messages.
- [ ] Run both the success and failure paths.
- [ ] Trace / Evidence can be inspected.
- [ ] The environment can be cleaned up completely.

## 16. Seed manifest

```yaml
seed_manifest:
  dataset_id: ""
  version: ""
  synthetic: true
  generator_ref: ""
  generator_version: ""
  random_seed: 0
  entities: {}
  edge_cases: []
  expected_hashes: {}
  pii_status: none | deidentified | restricted
  redistribution_rights: ""
  license: ""
  valid_from: ""
  owner: ""
```

## 17. Public data and secret review

| Surface | Check | Tool / Reviewer | Findings | Remediation | Result |
|---|---|---|---|---|---|
| Git history | Secrets |  |  |  |  |
| Source | Internal URLs / Tokens |  |  |  |  |
| Dataset | PII / Reidentification |  |  |  |  |
| Prompt / Policy | Confidential rules |  |  |  |  |
| Notebook | Output / Credentials |  |  |  |  |
| Trace / Dashboard | User data |  |  |  |  |
| Media | Faces / Logos / Copyright |  |  |  |  |

## 18. Evidence package manifest

```yaml
evidence_package:
  package_id: ""
  release_candidate: ""
  source_commit: ""
  generated_at: ""
  product:
    charter: ""
    journeys: []
    acceptance: ""
  architecture:
    blueprint: ""
    adrs: []
    contracts: []
  implementation:
    build_run: ""
    deployment_manifest: ""
    artifact_digests: []
  quality:
    golden_dataset: ""
    eval_run: ""
    n_run_report: ""
    known_failures: []
  security:
    threat_model: ""
    red_team_run: ""
    sbom: ""
    exceptions: []
  reliability:
    failure_matrix: ""
    recovery_report: ""
    gameday: ""
  operations:
    slos: []
    dashboards: []
    alerts: []
    runbooks: []
    orr: ""
  traceability_index: ""
  content_digest: ""
```

## 19. Evidence record

```yaml
evidence_record:
  evidence_id: ""
  claim: ""
  requirement_refs: []
  decision_refs: []
  contract_refs: []
  implementation_refs: []
  test_refs: []
  runtime_refs:
    traces: []
    context_graphs: []
    metrics: []
  artifact_digests: []
  limitations: []
  signed_by: []
  valid_for_release: ""
  expires_at: ""
```

## 20. Quality acceptance

| Layer | Quality Claim | Dataset / Fixture | Evaluator | N-run | Threshold / Rule | Result |
|---|---|---|---|---|---|---|
| Planner |  |  |  |  |  |  |
| Router / Team |  |  |  |  |  |  |
| Worker / Tool |  |  |  |  |  |  |
| Consolidator |  |  |  |  |  |  |
| Decision |  |  |  |  |  |  |
| System |  |  |  |  |  |  |
| Safety |  |  |  |  |  |  |

Checklist:

- [ ] Golden and Fixture are bound to the current version.
- [ ] N-run preserves the path from every run and the worst-performing slice.
- [ ] Safety conditions are excluded from any compensable aggregate score.
- [ ] The Judge is calibrated and allowed to abstain.
- [ ] Baseline and Candidate use the same conditions.

## 21. Security acceptance

| Threat Surface | Scenario | Control | Red-team Case | Hard Gate | Result | Exception |
|---|---|---|---|---:|---|---|
| Prompt Injection |  |  |  |  |  |  |
| Tool / MCP |  |  |  |  |  |  |
| A2A Delegation |  |  |  |  |  |  |
| Memory / RAG |  |  |  |  |  |  |
| Side Effect |  |  |  |  |  |  |
| Output / DLP |  |  |  |  |  |  |
| Supply Chain |  |  |  |  |  |  |
| Operations |  |  |  |  |  |  |

```yaml
security_acceptance:
  run_id: ""
  release_candidate: ""
  threat_model_version: ""
  red_team_cases: 0
  high_risk_n_run: 0
  unauthorized_side_effects: 0
  cross_tenant_leakage: 0
  replay_block_rate: ""
  pii_block_rate: ""
  secret_scan: pass | fail
  sbom_ref: ""
  dependency_critical_vulnerabilities: 0
  open_exceptions: []
  approved_by: []
```

## 22. Failure matrix

| Failure | Injection | Expected Control | Allowed Outcome | State / Side-effect Check | Evidence | Result |
|---|---|---|---|---|---|---|
| Provider unavailable |  |  |  |  |  |  |
| Tool timeout |  |  |  |  |  |  |
| Schema drift |  |  |  |  |  |  |
| Worker crash |  |  |  |  |  |  |
| Knowledge stale |  |  |  |  |  |  |
| Graph / Trace unavailable |  |  |  |  |  |  |
| Cache confusion |  |  |  |  |  |  |

## 23. Performance, capacity and cost

```yaml
performance_budget:
  population: ""
  load_model:
    arrival_pattern: ""
    concurrency: 0
    intent_mix: {}
    risk_mix: {}
    conversation_length: {}
  latency:
    p50_ms: 0
    p95_ms: 0
    p99_ms: 0
  throughput: ""
  queue_age: ""
  model_tokens: ""
  tool_calls: ""
  cost_per_success: ""
  retry_amplification: ""
  test_environment: ""
  known_differences_from_production: []
```

## 24. Sequential release gates

| Gate | Entry Condition | Required Evidence | Hard Conditions | Decision | Owner | Signed At |
|---|---|---|---|---|---|---|
| G0 Problem |  |  |  |  |  |  |
| G1 Design |  |  |  |  |  |  |
| G2 Slice |  |  |  |  |  |  |
| G3 Quality |  |  |  |  |  |  |
| G4 Security |  |  |  |  |  |  |
| G5 Operations |  |  |  |  |  |  |

```yaml
gate_decision:
  gate: ""
  release_candidate: ""
  decision: pass | conditional | fail
  evidence_refs: []
  hard_gate_results: {}
  conditions:
    - condition: ""
      scope: ""
      owner: ""
      due_at: ""
      verifier: ""
  signed_by: []
  signed_at: ""
```

## 25. Release candidate manifest

```yaml
release_manifest:
  release: ""
  source_commit: ""
  contracts: {}
  agents: {}
  prompts: {}
  models: {}
  tools: {}
  knowledge_snapshot: ""
  capability_snapshot: ""
  policy_version: ""
  checkpoint_schema: ""
  container_digests: []
  datasets: []
  evaluation_run: ""
  security_run: ""
  sbom_ref: ""
  provenance_ref: ""
  evidence_index: ""
  rollback_to: ""
  created_at: ""
```

Consistency checklist:

- [ ] All evidence points to the same Source Commit and RC.
- [ ] Artifacts use Digests, not Tags alone.
- [ ] Prompt, Policy, Knowledge, and Contract versions are all pinned.
- [ ] Every critical change generates a new RC.

## 26. SBOM and third-party inventory

```yaml
third_party_asset:
  asset_id: ""
  name: ""
  version: ""
  asset_type: package | container | model | dataset | tool | media | document
  source: ""
  package_identifier: ""
  license_id: ""
  copyright: ""
  transitive: false
  modified: false
  redistribution_allowed: false
  notice_required: false
  vulnerabilities: []
  end_of_life: ""
  owner: ""
```

SBOM checklist:

- [ ] Includes Direct and Transitive Dependencies.
- [ ] Records the Package Identifier, Version, and License.
- [ ] Bound to the current Release Artifact.
- [ ] Critical vulnerabilities are blocked or covered by an exception.
- [ ] NOTICE / Attribution has been generated.

## 27. Build provenance and attestation

```yaml
build_provenance:
  artifact_name: ""
  artifact_digest: ""
  source_repository: ""
  source_commit: ""
  builder_identity: ""
  workflow_ref: ""
  build_type: ""
  external_parameters: {}
  resolved_dependencies: []
  started_at: ""
  finished_at: ""
  attestation_ref: ""
  signature_verified: false
  verification_policy: ""
  verification_result: pass | fail
```

Verification:

- [ ] The Artifact Digest matches the Attestation Subject.
- [ ] The Builder Identity is on the allowlist.
- [ ] The Workflow and Build Type match expectations.
- [ ] External Parameters contain no unapproved fields.
- [ ] The Source Commit is a reviewed revision on a protected branch.
- [ ] The presence of an Attestation is not misrepresented as “no vulnerabilities.”

## 28. Deployment, canary and rollback

```yaml
release_strategy:
  shadow:
    population: ""
    exit: []
  canary:
    population: ""
    slices: []
    duration: ""
    exit: []
  dual_run:
    enabled: false
    comparison: ""
  promote:
    conditions: []
  rollback:
    target_release: ""
    command_or_control: ""
    state_migration: ""
    cache: ""
    knowledge: ""
    verification: []
  retire:
    drain: ""
    data_retention: ""
    support_end: ""
```

## 29. Kill / pause criteria

```yaml
kill_or_pause:
  conditions:
    - signal: ""
      operator: gt | gte | lt | lte | eq
      threshold: ""
      window: ""
      scope: ""
      action: pause | rollback | degrade | block
  manual_triggers:
    - business_owner_request
    - security_incident
    - legal_request
  authority:
    requestors: []
    approvers: []
  audit_ref: ""
  recovery_conditions: []
```

## 30. Operational readiness

| Area | Evidence | Result | Owner |
|---|---|---|---|
| SLI / SLO |  |  |  |
| Error Budget |  |  |  |
| Dashboard |  |  |  |
| Alert |  |  |  |
| Control Plane |  |  |  |
| Runbook |  |  |  |
| On-call |  |  |  |
| GameDay |  |  |  |
| Incident Bundle |  |  |  |
| Cost / Budget |  |  |  |

## 31. Repository public contract

```yaml
repository_public_contract:
  repository: ""
  visibility: public
  project_status: experimental | active | maintenance | archived
  readme: ""
  license: ""
  contributing: ""
  code_of_conduct: ""
  security: ""
  governance: ""
  support: ""
  changelog: ""
  citation: ""
  issue_templates: []
  pull_request_template: ""
  maintainers: []
  support_window: ""
```

## 32. README acceptance

- [ ] The first screen explains what the project does and who it is for.
- [ ] The Out-of-scope boundary and production responsibility statement are explicit.
- [ ] The architecture diagram matches the repository version.
- [ ] Quickstart runs in a Clean-room environment.
- [ ] Both success and failure paths are demonstrated.
- [ ] A Trace / Evidence entry point is provided.
- [ ] Test, evaluation, and security commands are provided.
- [ ] LICENSE, SECURITY, CONTRIBUTING, and SUPPORT are linked.
- [ ] Maintenance status and supported versions are stated.

## 33. Asset license matrix

| Path / Asset | Type | Copyright | License ID | Source | Modified | Redistribution | Notice |
|---|---|---|---|---|---:|---:|---:|
|  |  |  |  |  |  |  |  |

```yaml
asset_license:
  path: ""
  asset_type: code | documentation | data | model | media
  copyright_holder: ""
  license_id: ""
  source: ""
  modified: false
  redistribution_allowed: false
  notice_required: false
  approved_by: ""
```

## 34. SECURITY.md contract

```yaml
security_policy:
  supported_versions: []
  private_reporting_channel: ""
  do_not_report_publicly: []
  required_report_fields: []
  acknowledgement_target: ""
  triage_target: ""
  remediation_process: ""
  coordinated_disclosure: ""
  advisory_process: ""
  cve_process: ""
  security_contacts: []
```

## 35. Contribution and governance

```yaml
contribution_contract:
  development_setup: ""
  branch_policy: ""
  commit_policy: ""
  required_checks: []
  required_evidence: []
  review_owners: []
  security_review_triggers: []
  compatibility_review_triggers: []
  dco_or_cla: ""
  release_authority: []
```

```yaml
governance:
  maintainers: []
  decision_process: ""
  voting_or_consensus: ""
  escalation: ""
  conflict_of_interest: ""
  moderation: ""
  maintainer_addition: ""
  maintainer_removal: ""
  succession: ""
  archival_policy: ""
```

## 36. Pull request definition of done

- [ ] The Issue / Requirement is linked.
- [ ] The Contract and Consumer Tests are updated.
- [ ] The ADR is updated when necessary.
- [ ] Unit, Contract, Integration, and E2E tests pass.
- [ ] Golden, Adversarial, and Failure cases are updated according to risk.
- [ ] Security and privacy checks pass.
- [ ] Migration, rollback, and deprecation guidance is complete.
- [ ] The CHANGELOG and user documentation are updated.
- [ ] New Evidence has been added to the index.
- [ ] CODEOWNERS / Owners have completed their review.

## 37. Version and release notes

```yaml
release_notes:
  release: ""
  date: ""
  status: rc | stable | deprecated | retired
  what_works: []
  target_users: []
  quality_evidence: []
  security_evidence: []
  known_limitations: []
  compatibility: []
  migration: []
  rollback: []
  artifact_digests: []
  provenance: ""
  support_until: ""
  maintainers: []
```

## 38. Maintenance and sustainability

| Responsibility | Primary | Backup | Response Policy | Automation | End Condition |
|---|---|---|---|---|---|
| Issues |  |  |  |  |  |
| PR Review |  |  |  |  |  |
| Security Reports |  |  |  |  |  |
| Dependency Updates |  |  |  |  |  |
| Release |  |  |  |  |  |
| Documentation |  |  |  |  |  |
| Community Moderation |  |  |  |  |  |

## 39. Known limitations

```yaml
known_limitation:
  limitation_id: ""
  description: ""
  affected_users: []
  affected_versions: []
  impact: ""
  workaround: ""
  detection: ""
  planned_resolution: ""
  owner: ""
  review_by: ""
```

## 40. Independent acceptance

```yaml
independent_acceptance:
  review_id: ""
  reviewer: ""
  reviewer_role: ""
  independent_from_implementation: true
  source_commit: ""
  release_artifact_digest: ""
  environment: ""
  requirements_sampled: []
  evidence_verified: []
  clean_room_run: ""
  success_scenarios: []
  failure_scenarios: []
  security_checks: []
  operational_checks: []
  limitations_confirmed: []
  findings: []
  result: accepted | conditional | rejected
  conditions:
    - condition: ""
      owner: ""
      due_at: ""
      verifier: ""
  signed_at: ""
```

## 41. Final acceptance decision

```yaml
final_acceptance:
  project_id: ""
  release: ""
  evidence_package: ""
  gate_results:
    g0_problem: ""
    g1_design: ""
    g2_slice: ""
    g3_quality: ""
    g4_security: ""
    g5_operations: ""
  independent_review: ""
  known_risks: []
  decision: accepted | conditional | rejected
  conditions: []
  approved_by:
    product: ""
    architecture: ""
    engineering: ""
    quality: ""
    security: ""
    operations: ""
    open_source: ""
  signed_at: ""
```

Final principle:

> Delivery is complete only when claims are traceable, paths are reproducible, risks are verifiable, artifacts can be validated, limitations are visible, and responsibilities can be handed over.
