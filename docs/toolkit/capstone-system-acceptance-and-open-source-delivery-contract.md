---
title: Capstone 系统验收与开源交付契约
description: 用于定义项目范围、垂直切片、证据包、发布门禁、供应链、复现与开源维护责任
---

# Capstone 系统验收与开源交付契约

这份模板用于把“项目能演示”变成“系统可验收、制品可验证、仓库可复现、责任可移交”。

建议由 Product Owner、Domain Expert、Agent Architect、Engineering、Quality、Security、SRE、Open-source Maintainer 和一名未参与实现的 Independent Reviewer 共同填写。

不要一开始填满所有章节。先选择一条高价值 Vertical Slice，建立完整证据链，再扩展能力。

## 1. Acceptance Charter

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

检查：

- [ ] Problem 描述用户损失，而不是解决方案名称。
- [ ] Primary Goal 可以通过 Outcome 判断。
- [ ] In-scope 与 Out-of-scope 同时存在。
- [ ] 不以 Agent 数量、Token 或生成字数作为价值指标。
- [ ] 高风险能力有独立 Owner。

## 2. Value Hypothesis

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

## 3. Risk Register

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

## 4. Success and Safety Contract

| Metric / Invariant | Definition | Population | Target / Rule | Gate | Evidence | Owner |
|---|---|---|---|---|---|---|
| Goal Success |  |  |  |  |  |  |
| Evidence Coverage |  |  |  |  |  |  |
| Safe Path |  |  |  |  |  |  |
| Goal Latency |  |  |  |  |  |  |
| Cost per Success |  |  |  |  |  |  |
| Unauthorized Side Effect |  |  | equals 0 | hard |  |  |
| Cross-tenant Leakage |  |  | equals 0 | hard |  |  |

## 5. Requirement Record

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

检查：

- [ ] Statement 可被客观证伪。
- [ ] Acceptance 区分 Fact、Path、Outcome 和 Threshold。
- [ ] Forbidden 行为是结构化条件。
- [ ] Verification 绑定具体 ID。
- [ ] Requirement 有 Owner 和有效期。

## 6. Traceability Matrix

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

变更检查：

- [ ] Requirement 变化会触发受影响项复核。
- [ ] Contract Major 变化列出所有 Consumer。
- [ ] Obsolete Evidence 不会支持当前 Release。
- [ ] Sign-off 与同一 RC 绑定。

## 7. Architecture Blueprint

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

### 7.1 Boundary Record

| Boundary | Caller Identity | Callee | Contract | Authorization | State Owner | Failure Semantics | Evidence |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 8. ADR Index

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

## 9. Contract Registry

| Contract ID | Version | Producer | Consumers | Compatibility | Schema | Tests | Deprecation | Owner |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

应覆盖：

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

### 9.1 Compatibility Policy

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

## 10. System Invariants

| Invariant ID | Statement | Enforcement Point | Test | Runtime Signal | Hard Gate? |
|---|---|---|---|---|---:|
|  |  |  |  |  |  |

最低不变量：

- [ ] `completed` 有满足合同的结果。
- [ ] `no_data`、`tool_error` 与业务事实为否分开。
- [ ] Claim 绑定正确 Tenant、Subject、Version 和 Evidence。
- [ ] 副作用有授权、审批、幂等和 Expected Version。
- [ ] Late Result 不覆盖新 Plan。
- [ ] Partial / Degraded 列出缺失与影响。

## 11. Vertical Slice Specification

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

### 11.1 Slice Gate

| Dimension | Acceptance | Evidence | Result | Owner |
|---|---|---|---|---|
| Correctness |  |  |  |  |
| State |  |  |  |  |
| Security |  |  |  |  |
| Reliability |  |  |  |  |
| Observability |  |  |  |  |
| Reproducibility |  |  |  |  |

扩展规则：

```yaml
expansion_policy:
  require_slice_gate_pass: true
  next_capability: ""
  new_risks: []
  new_contracts: []
  new_evidence: []
  rollback_to_slice: ""
```

## 12. Milestone Definition of Done

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

## 13. Repository Architecture

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

检查：

- [ ] Contract 不依赖 Service 实现。
- [ ] Team 不导入其他 Team 内部代码。
- [ ] Worker 依赖 Tool Interface。
- [ ] Eval 使用公开入口。
- [ ] Docs 链接版本化 ADR、Contract 与 Runbook。

## 14. Reproducible Environment

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

## 15. Clean-room Reproduction

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

硬条件：

- [ ] 不使用作者本机缓存。
- [ ] 不使用未记录命令。
- [ ] 不通过私聊获得必要步骤。
- [ ] 运行成功和失败路径。
- [ ] 能查看 Trace / Evidence。
- [ ] 能完整清理环境。

## 16. Seed Manifest

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

## 17. Public Data and Secret Review

| Surface | Check | Tool / Reviewer | Findings | Remediation | Result |
|---|---|---|---|---|---|
| Git history | Secrets |  |  |  |  |
| Source | Internal URLs / Tokens |  |  |  |  |
| Dataset | PII / Reidentification |  |  |  |  |
| Prompt / Policy | Confidential rules |  |  |  |  |
| Notebook | Output / Credentials |  |  |  |  |
| Trace / Dashboard | User data |  |  |  |  |
| Media | Faces / Logos / Copyright |  |  |  |  |

## 18. Evidence Package Manifest

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

## 19. Evidence Record

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

## 20. Quality Acceptance

| Layer | Quality Claim | Dataset / Fixture | Evaluator | N-run | Threshold / Rule | Result |
|---|---|---|---|---|---|---|
| Planner |  |  |  |  |  |  |
| Router / Team |  |  |  |  |  |  |
| Worker / Tool |  |  |  |  |  |  |
| Consolidator |  |  |  |  |  |  |
| Decision |  |  |  |  |  |  |
| System |  |  |  |  |  |  |
| Safety |  |  |  |  |  |  |

检查：

- [ ] Golden 与 Fixture 绑定当前版本。
- [ ] N-run 保存每次路径和最坏切片。
- [ ] 安全条件不进入可抵扣总分。
- [ ] Judge 经过校准并允许弃权。
- [ ] Baseline 与 Candidate 使用同一条件。

## 21. Security Acceptance

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

## 22. Failure Matrix

| Failure | Injection | Expected Control | Allowed Outcome | State / Side-effect Check | Evidence | Result |
|---|---|---|---|---|---|---|
| Provider unavailable |  |  |  |  |  |  |
| Tool timeout |  |  |  |  |  |  |
| Schema drift |  |  |  |  |  |  |
| Worker crash |  |  |  |  |  |  |
| Knowledge stale |  |  |  |  |  |  |
| Graph / Trace unavailable |  |  |  |  |  |  |
| Cache confusion |  |  |  |  |  |  |

## 23. Performance, Capacity and Cost

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

## 24. Sequential Release Gates

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

## 25. Release Candidate Manifest

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

一致性检查：

- [ ] 所有证据指向同一 Source Commit 和 RC。
- [ ] Artifact 使用 Digest，不只使用 Tag。
- [ ] Prompt、Policy、Knowledge 和 Contract 均固定版本。
- [ ] 任何关键变更都会生成新 RC。

## 26. SBOM and Third-party Inventory

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

SBOM 检查：

- [ ] 包含 Direct 与 Transitive Dependency。
- [ ] 记录 Package Identifier、Version 和 License。
- [ ] 与当前 Release Artifact 绑定。
- [ ] 关键漏洞有阻断或例外。
- [ ] NOTICE / Attribution 已生成。

## 27. Build Provenance and Attestation

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

验证：

- [ ] Artifact Digest 与 Attestation Subject 一致。
- [ ] Builder Identity 在允许列表。
- [ ] Workflow 与 Build Type 符合预期。
- [ ] External Parameters 没有未批准字段。
- [ ] Source Commit 是受保护分支上的已审查版本。
- [ ] 有 Attestation 不被误写成“没有漏洞”。

## 28. Deployment, Canary and Rollback

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

## 29. Kill / Pause Criteria

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

## 30. Operational Readiness

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

## 31. Repository Public Contract

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

## 32. README Acceptance

- [ ] 一屏内说明项目做什么和适合谁。
- [ ] 明确 Out-of-scope 与生产责任声明。
- [ ] 架构图与仓库版本一致。
- [ ] Quickstart 在 Clean-room 运行。
- [ ] 同时展示成功和失败路径。
- [ ] 提供 Trace / Evidence 入口。
- [ ] 提供测试、评测和安全命令。
- [ ] 链接 LICENSE、SECURITY、CONTRIBUTING 和 SUPPORT。
- [ ] 说明维护状态和支持版本。

## 33. Asset License Matrix

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

## 34. SECURITY.md Contract

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

## 35. Contribution and Governance

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

## 36. Pull Request Definition of Done

- [ ] Issue / Requirement 已链接。
- [ ] Contract 与 Consumer Tests 已更新。
- [ ] ADR 在必要时更新。
- [ ] Unit、Contract、Integration、E2E 通过。
- [ ] Golden、Adversarial、Failure 用例按风险更新。
- [ ] 安全与隐私检查通过。
- [ ] 迁移、回滚和弃用说明完整。
- [ ] CHANGELOG 与用户文档更新。
- [ ] 新 Evidence 已进入索引。
- [ ] CODEOWNERS / Owner 完成评审。

## 37. Version and Release Notes

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

## 38. Maintenance and Sustainability

| Responsibility | Primary | Backup | Response Policy | Automation | End Condition |
|---|---|---|---|---|---|
| Issues |  |  |  |  |  |
| PR Review |  |  |  |  |  |
| Security Reports |  |  |  |  |  |
| Dependency Updates |  |  |  |  |  |
| Release |  |  |  |  |  |
| Documentation |  |  |  |  |  |
| Community Moderation |  |  |  |  |  |

## 39. Known Limitations

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

## 40. Independent Acceptance

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

## 41. Final Acceptance Decision

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

最终原则：

> 系统只有在声明可追溯、路径可复现、风险可验证、制品可校验、限制可见、责任可移交时，才算完成交付。
