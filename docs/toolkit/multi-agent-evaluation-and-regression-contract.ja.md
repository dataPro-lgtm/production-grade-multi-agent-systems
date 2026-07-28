---
title: マルチエージェント評価と継続的回帰テストの契約
description: 品質契約、Golden Dataset、Fixture、評価器、Judge、N-run、回帰ゲート、オンライン評価を定義するためのテンプレート
---

# マルチエージェント評価と継続的回帰テストの契約

このテンプレートは、「回答が良さそうに見える」という状態を、再現可能で比較可能、かつ監査可能なリリースエビデンスへと変換するためのものです。ビジネス Owner、ドメイン専門家、Agent エンジニアリング、データ、セキュリティ、SRE、品質責任者が共同で管理することを推奨します。

まず、価値またはリスクの高い垂直フローを 1 つ選んで記入してください。最初から製品全体を網羅しようとする必要はありません。

## 1. 評価チャーター

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

次の問いに答える必要があります。

- ユーザーが本当に達成したい Goal は何ですか。
- どの結果は必ずゼロでなければならず、統計的な誤差予算に含めてはなりませんか。
- どの属性はルールで判定でき、どの属性にはドメインまたは意味上の判断が必要ですか。
- 評価の失敗は PR やリリースをブロックしますか。それとも監視をトリガーするだけですか。

## 2. 品質契約

各メトリクスでは、計算方法、対象集団、スライス、評価器、閾値、Owner を必ず定義します。

| メトリクス ID | 成果／リスク | 対象集団 | 計算方法 | 評価器 | 閾値 | ゲート | Owner |
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

チェック項目：

- [ ] 安全性の不変条件が、重み付き総合スコアに組み込まれていません。
- [ ] 比率メトリクスに分子と分母が宣言されています。
- [ ] レイテンシとコストに統計ウィンドウと除外項目が宣言されています。
- [ ] 閾値が任意の整数ではなく、ビジネス上の損失、ベースライン、または SLO に基づいています。
- [ ] メトリクスが失敗した場合のアクションと Owner が明確です。

## 3. Dataset マニフェスト

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

チェック項目：

- [ ] 参照回答が、事実、エビデンス、経路、表現上の属性に分解されています。
- [ ] `no_data` を、ビジネス上の事実が偽であることと同一視していません。
- [ ] 許可されるアクションと禁止されるアクションが、どちらも構造化フィールドになっています。
- [ ] オープンなタスクでは、複数の許容可能な結果または意味上の許容範囲が宣言されています。
- [ ] Case に出所、Owner、有効期限、Fixture が設定されています。

## 5. Fixture マニフェスト

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

Fixture の検証：

- [ ] Tool Fake が入力 Schema、権限、冪等性を検証します。
- [ ] タイムアウト、レート制限、結果不明、競合、遅延応答を生成できます。
- [ ] 実行のたびに、ビジネス状態、Checkpoint、Memory、キャッシュをリセットできます。
- [ ] データスナップショットと Golden の事実が同じ有効時点にあります。

## 6. カバレッジマトリクス

| スライス | Case 数 | 反復回数 | 主なリスク | 必須の評価器 | 最小カバレッジ | Owner |
|---|---:|---:|---|---|---:|---|
| 単一チームの読み取り |  |  |  |  |  |  |
| 複数チームの並列実行 |  |  |  |  |  |  |
| 複数チームの逐次実行 |  |  |  |  |  |  |
| マルチターン |  |  |  |  |  |  |
| 高リスクな意思決定 |  |  |  |  |  |  |
| 復旧／リプレイ |  |  |  |  |  |  |
| 敵対的ケース |  |  |  |  |  |  |
| データなし／競合 |  |  |  |  |  |  |

追加のディメンション：

- 言語と地域
- 新規ユーザーと既存ユーザー
- 短いコンテキストと長いコンテキスト
- 一般的なインテントとロングテールのインテント
- モデル、Provider、Prompt、Team、Tool Version
- 権限、テナント、データ分類、リスクレベル

## 7. 評価器レジストリ

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

| 属性 | 評価器 | 適している理由 | 失敗時のアクション |
|---|---|---|---|
| Schema / Type |  |  |  |
| Plan / Dependency |  |  |  |
| Route / Tool / Args |  |  |  |
| Policy / Side Effect |  |  |  |
| Evidence / Faithfulness |  |  |  |
| Completeness / Utility |  |  |  |
| Cost / Latency |  |  |  |

## 8. Judge 契約

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

| 評価基準 | 定義 | 合格アンカー | 不合格アンカー | 必須エビデンス | 重み |
|---|---|---|---|---|---:|
|  |  |  |  |  |  |

Rubric のチェック項目：

- [ ] 1 つの評価基準では、1 つの属性だけを記述しています。
- [ ] アンカーには、「全体的に良い」ではなく観察可能な振る舞いを使用しています。
- [ ] Judge は、コードで判定できる金額、日付、ID、権限を裁定しません。
- [ ] 入力内のユーザーコンテンツ、ツール結果、評価対象の回答は、いずれも信頼できないデータとして隔離されています。
- [ ] 出力が `abstain` と EvidenceRef をサポートしています。

## 9. Judge キャリブレーションレポート

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

- [ ] レポートでは、Judge を独立した人間のラベルと比較しており、Judge 自身が生成したラベルとは比較していません。
- [ ] 高リスク、言語、長さ、ドメインの各スライスを個別に検査しています。
- [ ] 位置交換、冗長性、自己選好のテストを記録しています。
- [ ] Judge のモデルまたは Rubric が変更された場合は、再度キャリブレーションします。

## 10. レイヤー別スコアカード

### 10.1 Planner

| メトリクス | 定義 | 評価器 | ゲート |
|---|---|---|---|
| plan_valid_rate |  |  |  |
| team_recall |  |  |  |
| team_precision |  |  |  |
| dependency_accuracy |  |  |  |
| constraint_coverage |  |  |  |
| plan_minimality |  |  |  |

### 10.2 Router / Team

| メトリクス | 定義 | 評価器 | ゲート |
|---|---|---|---|
| route_precision |  |  |  |
| unnecessary_dispatch_rate |  |  |  |
| effective_scope_validity |  |  |  |
| fallback_correctness |  |  |  |
| team_result_contract_rate |  |  |  |

### 10.3 Worker / Tool

| メトリクス | 定義 | 評価器 | ゲート |
|---|---|---|---|
| tool_selection_accuracy |  |  |  |
| tool_argument_validity |  |  |  |
| worker_faithfulness |  |  |  |
| error_semantics_accuracy |  |  |  |
| unauthorized_side_effects |  |  | hard |

### 10.4 Consolidator / Decision

| メトリクス | 定義 | 評価器 | ゲート |
|---|---|---|---|
| claim_evidence_coverage |  |  |  |
| contradiction_rate |  |  |  |
| required_fact_recall |  |  |  |
| uncertainty_calibration |  |  |  |
| recommendation_accuracy |  |  |  |
| approval_requirement_accuracy |  |  | hard |

## 11. Context Graph アサーション

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

関連付け：

- [ ] 各 Graph Node を `trace_id` / `span_id` に関連付けられます。
- [ ] 各 Artifact にコンテンツ Hash と不変参照があります。
- [ ] 各 Policy Decision にアイデンティティ、Scope、リソース、ルールのバージョンがあります。
- [ ] 各 Claim を有効な Evidence まで遡れます。

## 12. N-run プロトコル

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

- [ ] `pass@k` と「k 回すべて合格」が混同されていません。
- [ ] 安全性ゲートでは、`safe_path_rate` または明示的な全回合格条件を使用しています。
- [ ] 各実行の Plan、Route、Tool、Evidence、Graph、Trace、Output を保存しています。
- [ ] レポートで反復実行を独立同分布のサンプルと誤って表現していません。

## 13. マルチターンシナリオ

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

次の項目を必ず網羅します。

- 指示語とエンティティの連続性
- 複数ターンにわたる制約の維持
- 高リスクなアクションの再承認
- キャンセルとタイムアウト
- コンテキスト圧縮後の事実と権限の忠実度
- セッションとテナントの分離

## 14. 敵対的ケース

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

## 15. フィードバック実験

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

## 16. 回帰ゲートポリシー

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

10 項目のチェック：

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

## 17. 評価実行マニフェスト

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

## 18. ベースライン比較

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

統計上のチェック項目：

- [ ] 同一の Case と Fixture をペア比較しています。
- [ ] 点推定、差分、区間、サンプルサイズを報告しています。
- [ ] 欠損した実行と Judge の棄権を暗黙的に削除していません。
- [ ] 複数のメトリクスやスライスに関する探索的な結論を、確定的な結論として扱っていません。
- [ ] 統計的有意性とビジネス上の重要性を別々に説明しています。

## 19. パイプラインマトリクス

| ステージ | Dataset | 反復回数 | 評価器 | ゲート | Artifact の保持 |
|---|---|---:|---|---|---|
| PR |  |  |  |  |  |
| Nightly |  |  |  |  |  |
| Pre-release |  |  |  |  |  |
| Canary / Shadow |  |  |  |  |  |
| Production |  |  |  |  |  |

## 20. オンライン評価とドリフト

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

- [ ] オンラインレポートで、サンプリング率とオーバーサンプリング戦略を開示しています。
- [ ] 本番環境の生データが、プライバシー、保持、アクセスポリシーに従っています。
- [ ] 発生頻度が低く高リスクな Case が、全体平均に隠されていません。
- [ ] ドリフトアラートを、モデル、Prompt、Tool、Policy、データ、デプロイの各バージョンに関連付けられます。

## 21. 品質インシデント

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

## 22. 評価レポートとリリース判断

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

Conditional-Go では、次の項目をすべて満たす必要があります。

- [ ] リスクと影響を受けるスライスが明確です。
- [ ] Canary または Shadow の範囲が定義されています。
- [ ] 追加のサンプリングと人手レビューが定義されています。
- [ ] 自動判定可能なロールバックトリガーがあります。
- [ ] 修正担当の Owner と期限が設定されています。
- [ ] 判断の有効期限が設定されています。

## 23. 完了の定義

### データ

- [ ] Golden、Holdout、Judge Calibration、Adversarial Set が分離されています。
- [ ] Case、Fixture、Evidence にバージョン、Hash、出所、Owner、有効期限があります。
- [ ] カバレッジマトリクスに、高リスク、失敗、マルチターン、復旧、敵対的経路が含まれています。

### 測定

- [ ] 決定論的な属性を Judge に推測させていません。
- [ ] Judge はキャリブレーション済みで、棄権でき、バージョン変更時に再レビューされます。
- [ ] レイヤー別メトリクスによって、エンドツーエンドの失敗を責任境界まで特定できます。
- [ ] N-run の条件が再現可能で、各実行の成果物を追跡できます。

### リリース

- [ ] PR、Nightly、Pre-release、Canary、Production の範囲とゲートが明確です。
- [ ] Baseline / Candidate の比較に、スライス、区間、エビデンス不足の状態が含まれています。
- [ ] ハードゲート、非回帰ゲート、予算ゲートが独立して判断されます。
- [ ] リリース判断、例外、ロールバック、承認を監査できます。

### 運用

- [ ] オンラインルール、サンプリング Judge、ユーザーフィードバック、ビジネス成果によるフィードバックループが形成されています。
- [ ] 入力、経路、品質、システム、データのドリフトを個別に監視しています。
- [ ] 品質インシデントから、最小再現 Case と回帰アサーションが蓄積されます。
