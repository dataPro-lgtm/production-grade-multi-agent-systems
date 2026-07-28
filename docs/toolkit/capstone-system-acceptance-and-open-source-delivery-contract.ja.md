---
title: Capstone システム受け入れ検証・オープンソースデリバリー契約
description: プロジェクトスコープ、Vertical Slice、エビデンスパッケージ、リリースゲート、サプライチェーン、再現、オープンソース保守の責任を定義するためのテンプレート
---

# Capstone システム受け入れ検証・オープンソースデリバリー契約

このテンプレートは、「プロジェクトをデモできる」という状態を、「システムを受け入れ検証でき、成果物を検証でき、リポジトリを再現でき、責任を移管できる」状態へ変換するためのものです。

Product Owner、Domain Expert、Agent Architect、Engineering、Quality、Security、SRE、Open-source Maintainer、および実装に参加していない Independent Reviewer が共同で記入することを推奨します。

最初からすべてのセクションを埋めないでください。まず価値の高い Vertical Slice を1つ選び、完全なエビデンスチェーンを構築してから、能力を拡張します。

## 1. 受け入れ検証憲章

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

チェック項目：

- [ ] Problem はソリューション名ではなく、ユーザーの損失を記述しています。
- [ ] Primary Goal は Outcome によって判定できます。
- [ ] In-scope と Out-of-scope の両方が定義されています。
- [ ] Agent 数、Token 数、生成文字数を価値指標としていません。
- [ ] 高リスクの能力には独立した Owner が割り当てられています。

## 2. 価値仮説

| 仮説 ID | ユーザー / ビジネス Outcome | ベースライン | メトリクス | 判断ルール | Owner |
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

## 3. リスク登録簿

| リスク ID | シナリオ | ユーザーへの影響 | 発生可能性 | 深刻度 | コントロール | エビデンス | Owner | レビュー期限 |
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

## 4. 成功・安全契約

| メトリクス / 不変条件 | 定義 | 対象母集団 | 目標 / ルール | ゲート | エビデンス | Owner |
|---|---|---|---|---|---|---|
| Goal Success |  |  |  |  |  |  |
| Evidence Coverage |  |  |  |  |  |  |
| Safe Path |  |  |  |  |  |  |
| Goal Latency |  |  |  |  |  |  |
| Cost per Success |  |  |  |  |  |  |
| Unauthorized Side Effect |  |  | equals 0 | hard |  |  |
| Cross-tenant Leakage |  |  | equals 0 | hard |  |  |

## 5. Requirement レコード

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

チェック項目：

- [ ] Statement は客観的に反証できます。
- [ ] Acceptance では Fact、Path、Outcome、Threshold を区別しています。
- [ ] Forbidden の動作が構造化された条件になっています。
- [ ] Verification が具体的な ID に紐付いています。
- [ ] Requirement に Owner と有効期間があります。

## 6. トレーサビリティマトリクス

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

変更時のチェック項目：

- [ ] Requirement の変更によって影響を受ける項目の再レビューが開始されます。
- [ ] Contract の Major 変更では、すべての Consumer を列挙しています。
- [ ] Obsolete Evidence は現在の Release の根拠になりません。
- [ ] Sign-off は同一の RC に紐付いています。

## 7. アーキテクチャブループリント

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

### 7.1 境界レコード

| 境界 | 呼び出し元 Identity | 呼び出し先 | Contract | 認可 | State Owner | 障害セマンティクス | エビデンス |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 8. ADR インデックス

| ADR ID | 意思決定 | ステータス | 代替案 | 主な帰結 | エビデンス | 置換対象 | Owner |
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

## 9. Contract レジストリ

| Contract ID | Version | Producer | Consumers | Compatibility | Schema | Tests | Deprecation | Owner |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

対象に含めるもの：

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

### 9.1 互換性方針

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

## 10. システム不変条件

| 不変条件 ID | Statement | 適用箇所 | Test | Runtime Signal | Hard Gate? |
|---|---|---|---|---|---:|
|  |  |  |  |  |  |

最小限の不変条件：

- [ ] `completed` には Contract を満たす結果があります。
- [ ] `no_data`、`tool_error`、および業務上の事実が否定であることを区別しています。
- [ ] Claim が正しい Tenant、Subject、Version、Evidence に紐付いています。
- [ ] 副作用には認可、承認、冪等性、Expected Version があります。
- [ ] Late Result は新しい Plan を上書きしません。
- [ ] Partial / Degraded では、欠落項目と影響を列挙しています。

## 11. Vertical Slice 仕様

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

### 11.1 Slice ゲート

| ディメンション | 受け入れ基準 | エビデンス | 結果 | Owner |
|---|---|---|---|---|
| 正確性 |  |  |  |  |
| 状態 |  |  |  |  |
| セキュリティ |  |  |  |  |
| 信頼性 |  |  |  |  |
| オブザーバビリティ |  |  |  |  |
| 再現性 |  |  |  |  |

拡張ルール：

```yaml
expansion_policy:
  require_slice_gate_pass: true
  next_capability: ""
  new_risks: []
  new_contracts: []
  new_evidence: []
  rollback_to_slice: ""
```

## 12. マイルストーン Definition of Done

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

## 13. リポジトリアーキテクチャ

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

チェック項目：

- [ ] Contract は Service の実装に依存しません。
- [ ] Team は他の Team の内部コードをインポートしません。
- [ ] Worker は Tool Interface に依存します。
- [ ] Eval は公開エントリーポイントを使用します。
- [ ] Docs はバージョン管理された ADR、Contract、Runbook にリンクしています。

## 14. 再現可能な環境

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

## 15. Clean-room 再現

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

必須条件：

- [ ] 作成者のローカルキャッシュを使用しません。
- [ ] 記録されていないコマンドを使用しません。
- [ ] 必須の手順を個別のチャットで入手しません。
- [ ] 成功パスと失敗パスの両方を実行します。
- [ ] Trace / Evidence を確認できます。
- [ ] 環境を完全にクリーンアップできます。

## 16. Seed マニフェスト

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

## 17. 公開データ・Secret レビュー

| サーフェス | チェック項目 | Tool / Reviewer | 検出事項 | 是正措置 | 結果 |
|---|---|---|---|---|---|
| Git 履歴 | Secret |  |  |  |  |
| Source | 社内 URL / Token |  |  |  |  |
| Dataset | PII / 再識別 |  |  |  |  |
| Prompt / Policy | 機密ルール |  |  |  |  |
| Notebook | 出力 / Credential |  |  |  |  |
| Trace / Dashboard | ユーザーデータ |  |  |  |  |
| Media | 顔 / ロゴ / 著作権 |  |  |  |  |

## 18. エビデンスパッケージマニフェスト

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

## 19. エビデンスレコード

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

## 20. 品質の受け入れ検証

| レイヤー | 品質 Claim | Dataset / Fixture | Evaluator | N-run | Threshold / Rule | 結果 |
|---|---|---|---|---|---|---|
| Planner |  |  |  |  |  |  |
| Router / Team |  |  |  |  |  |  |
| Worker / Tool |  |  |  |  |  |  |
| Consolidator |  |  |  |  |  |  |
| Decision |  |  |  |  |  |  |
| System |  |  |  |  |  |  |
| Safety |  |  |  |  |  |  |

チェック項目：

- [ ] Golden と Fixture は現在のバージョンに紐付いています。
- [ ] N-run では各回の Path と最悪の Slice を保存します。
- [ ] 安全条件を、他の得点で相殺可能な総合スコアに含めません。
- [ ] Judge はキャリブレーション済みで、棄権を許可します。
- [ ] Baseline と Candidate は同一条件を使用します。

## 21. セキュリティの受け入れ検証

| 脅威サーフェス | シナリオ | コントロール | Red-team Case | Hard Gate | 結果 | 例外 |
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

## 22. 障害マトリクス

| 障害 | 注入方法 | 期待するコントロール | 許容される Outcome | 状態 / 副作用のチェック | エビデンス | 結果 |
|---|---|---|---|---|---|---|
| Provider 利用不能 |  |  |  |  |  |  |
| Tool タイムアウト |  |  |  |  |  |  |
| Schema ドリフト |  |  |  |  |  |  |
| Worker クラッシュ |  |  |  |  |  |  |
| Knowledge の陳腐化 |  |  |  |  |  |  |
| Graph / Trace 利用不能 |  |  |  |  |  |  |
| Cache の混同 |  |  |  |  |  |  |

## 23. パフォーマンス、キャパシティ、コスト

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

## 24. 逐次リリースゲート

| ゲート | エントリー条件 | 必須エビデンス | 必須条件 | 判断 | Owner | 署名日時 |
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

## 25. Release Candidate マニフェスト

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

整合性のチェック項目：

- [ ] すべてのエビデンスが同一の Source Commit と RC を参照しています。
- [ ] Artifact には Tag だけでなく Digest を使用しています。
- [ ] Prompt、Policy、Knowledge、Contract のバージョンをすべて固定しています。
- [ ] 重要な変更があるたびに新しい RC を生成します。

## 26. SBOM・サードパーティインベントリ

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

SBOM のチェック項目：

- [ ] Direct Dependency と Transitive Dependency を含めています。
- [ ] Package Identifier、Version、License を記録しています。
- [ ] 現在の Release Artifact に紐付いています。
- [ ] 重大な脆弱性に対してブロックまたは例外が設定されています。
- [ ] NOTICE / Attribution を生成済みです。

## 27. ビルド Provenance・Attestation

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

検証項目：

- [ ] Artifact Digest と Attestation Subject が一致しています。
- [ ] Builder Identity が許可リストに含まれています。
- [ ] Workflow と Build Type が想定どおりです。
- [ ] External Parameters に未承認のフィールドがありません。
- [ ] Source Commit は保護ブランチ上のレビュー済みバージョンです。
- [ ] Attestation があることを「脆弱性がない」と誤って記載していません。

## 28. デプロイ、Canary、ロールバック

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

## 29. Kill / Pause 基準

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

## 30. 運用準備

| 領域 | エビデンス | 結果 | Owner |
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

## 31. リポジトリ公開契約

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

## 32. README 受け入れ検証

- [ ] 1画面以内で、プロジェクトの目的と対象者を説明しています。
- [ ] Out-of-scope と本番運用上の責任に関する声明を明記しています。
- [ ] アーキテクチャ図がリポジトリのバージョンと一致しています。
- [ ] Quickstart が Clean-room 環境で実行できます。
- [ ] 成功パスと失敗パスの両方を示しています。
- [ ] Trace / Evidence のエントリーポイントを示しています。
- [ ] テスト、評価、セキュリティのコマンドを示しています。
- [ ] LICENSE、SECURITY、CONTRIBUTING、SUPPORT にリンクしています。
- [ ] 保守ステータスとサポート対象バージョンを説明しています。

## 33. Asset ライセンスマトリクス

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

## 34. SECURITY.md 契約

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

## 35. コントリビューション・ガバナンス

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

- [ ] Issue / Requirement にリンクしています。
- [ ] Contract と Consumer Tests を更新しています。
- [ ] 必要に応じて ADR を更新しています。
- [ ] Unit、Contract、Integration、E2E がすべて通過しています。
- [ ] リスクに応じて Golden、Adversarial、Failure の各ケースを更新しています。
- [ ] セキュリティとプライバシーのチェックに合格しています。
- [ ] マイグレーション、ロールバック、非推奨化の説明が完全です。
- [ ] CHANGELOG とユーザー向けドキュメントを更新しています。
- [ ] 新しい Evidence をインデックスに追加しています。
- [ ] CODEOWNERS / Owner によるレビューが完了しています。

## 37. バージョン・リリースノート

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

## 38. 保守・持続可能性

| 責任 | Primary | Backup | 対応方針 | 自動化 | 終了条件 |
|---|---|---|---|---|---|
| Issues |  |  |  |  |  |
| PR Review |  |  |  |  |  |
| Security Reports |  |  |  |  |  |
| Dependency Updates |  |  |  |  |  |
| Release |  |  |  |  |  |
| Documentation |  |  |  |  |  |
| Community Moderation |  |  |  |  |  |

## 39. 既知の制約

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

## 40. 独立した受け入れ検証

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

## 41. 最終受け入れ判断

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

最終原則：

> システムのデリバリーが完了したと言えるのは、宣言を追跡でき、実行パスを再現でき、リスクを検証でき、成果物を検証でき、制約が可視化され、責任を移管できる場合に限ります。
