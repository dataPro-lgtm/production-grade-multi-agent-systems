---
title: 多 Agent 评测与持续回归契约
description: 用于定义质量契约、Golden Dataset、Fixture、评估器、Judge、N-run、回归门禁与线上评测
---

# 多 Agent 评测与持续回归契约

这份模板用于把“答案看起来不错”变成可复现、可比较、可审计的发布证据。建议由业务 Owner、领域专家、Agent 工程、数据、安全、SRE 与质量负责人共同维护。

先选一条高价值或高风险垂直链路填写，不要一开始追求覆盖整个产品。

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

需要回答：

- 用户真正要完成的 Goal 是什么？
- 哪些结果必须为零，不能进入统计误差预算？
- 哪些属性可由规则判断，哪些需要领域或语义判断？
- 评测失败会阻断 PR、发布，还是只触发监控？

## 2. Quality Contract

每个指标都必须定义计算、作用人群、切片、评估器、阈值和 Owner。

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

检查：

- [ ] 安全不变量没有被并入加权总分。
- [ ] 比例指标声明分子与分母。
- [ ] 时延和成本声明统计窗口与排除项。
- [ ] 阈值来自业务损失、基线或 SLO，而不是任意整数。
- [ ] 指标失败有明确动作和 Owner。

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

检查：

- [ ] 参考答案已拆成事实、证据、路径与表达属性。
- [ ] `no_data` 不等于业务事实为否。
- [ ] 允许动作和禁止动作均为结构化字段。
- [ ] 开放任务声明多个可接受结果或语义容忍度。
- [ ] Case 有来源、Owner、有效期和 Fixture。

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

Fixture 验证：

- [ ] 工具 Fake 验证输入 Schema、权限和幂等。
- [ ] 能生成超时、限流、未知结果、冲突与迟到响应。
- [ ] 每次运行能重置业务状态、Checkpoint、Memory 和缓存。
- [ ] 数据快照与 Golden 事实处于同一有效时间。

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

补充维度：

- 语言与地区；
- 新用户与历史用户；
- 短上下文与长上下文；
- 常见意图与长尾意图；
- 模型、Provider、Prompt、Team 和 Tool Version；
- 权限、租户、数据分类和风险等级。

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

| 属性 | Evaluator | 为什么适合 | 失败动作 |
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

Rubric 检查：

- [ ] 一个 Criterion 只描述一个属性。
- [ ] Anchor 使用可观察行为，不使用“总体不错”。
- [ ] Judge 不裁决可由代码确定的金额、日期、ID 或权限。
- [ ] 输入中的用户内容、工具结果和被测答案均作为不可信数据隔离。
- [ ] 输出支持 `abstain` 和 EvidenceRef。

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

- [ ] 报告比较 Judge 与独立人工标签，不是与自己生成的标签比较。
- [ ] 分别检查高风险、语言、长度和领域切片。
- [ ] 记录位置交换、冗长和自偏好测试。
- [ ] Judge 模型或 Rubric 变化后重新校准。

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

关联：

- [ ] 每个 Graph Node 可关联 `trace_id` / `span_id`。
- [ ] 每个 Artifact 有内容 Hash 与不可变引用。
- [ ] 每个 Policy Decision 有身份、Scope、资源和规则版本。
- [ ] 每个 Claim 可以回溯到有效 Evidence。

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

- [ ] `pass@k` 与“全部 k 次通过”没有混写。
- [ ] 安全门禁使用 `safe_path_rate` 或明确的全通过条件。
- [ ] 每次运行保留 Plan、Route、Tool、Evidence、Graph、Trace 和 Output。
- [ ] 报告没有把重复运行误称为独立同分布样本。

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

必须覆盖：

- 指代与实体连续性；
- 约束跨轮保持；
- 高风险动作重新授权；
- 取消与超时；
- 上下文压缩后的事实与权限忠实度；
- 会话和租户隔离。

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

十道检查：

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

统计检查：

- [ ] 相同 Case 和 Fixture 做成对比较。
- [ ] 报告点估计、差值、区间和样本量。
- [ ] 缺失运行与 Judge 弃权没有被静默删除。
- [ ] 对多指标和多切片的探索性结论没有冒充确定结论。
- [ ] 统计显著与业务重要性分别说明。

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

- [ ] 线上报告披露采样率与过采样策略。
- [ ] 原始生产内容遵守隐私、保留与访问策略。
- [ ] 低频高风险 Case 不会被总体平均值掩盖。
- [ ] 漂移告警可关联模型、Prompt、Tool、Policy、数据与部署版本。

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

Conditional-Go 必须同时具备：

- [ ] 明确的风险与受影响切片；
- [ ] Canary 或 Shadow 范围；
- [ ] 额外采样与人工复核；
- [ ] 可自动判断的回滚触发器；
- [ ] 修复 Owner 与截止时间；
- [ ] 决策失效时间。

## 23. Definition of Done

### 数据

- [ ] Golden、Holdout、Judge Calibration 和 Adversarial Set 已隔离。
- [ ] Case、Fixture 和 Evidence 有版本、Hash、来源、Owner 与有效期。
- [ ] 覆盖矩阵包含高风险、失败、多轮、恢复和对抗路径。

### 测量

- [ ] 确定性属性没有交给 Judge 猜测。
- [ ] Judge 已校准，可弃权，版本变化会重新评审。
- [ ] 分层指标能把端到端失败定位到责任边界。
- [ ] N-run 条件可复现，每次运行产物可追溯。

### 发布

- [ ] PR、Nightly、Pre-release、Canary 与 Production 的范围和门禁明确。
- [ ] Baseline / Candidate 比较包含切片、区间和证据不足状态。
- [ ] 硬门禁、非回归与预算门禁独立决策。
- [ ] 发布结论、例外、回滚和审批可审计。

### 运营

- [ ] 线上规则、抽样 Judge、用户反馈和业务结果形成闭环。
- [ ] 输入、路径、质量、系统和数据漂移分别监控。
- [ ] 质量事件会沉淀最小复现 Case 和回归断言。
