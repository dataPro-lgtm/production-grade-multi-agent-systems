---
title: AgentOps 本番運用・準備契約
description: マルチエージェントシステムのGoalレベルのSLO、診断、制御、復旧、コスト、GameDay、ORRを定義するためのテンプレート
---

# AgentOps 本番運用・準備契約

このテンプレートは、マルチエージェントシステムを「デプロイ済み」の段階から「継続的に運用可能」な段階へ進めるためのものです。汎用的な監視フィールドを網羅した一覧ではなく、ビジネス、Agentエンジニアリング、プラットフォーム、SRE、セキュリティ、データ、コストの各チームを横断する責任契約です。

まずは価値またはリスクの高いGoalフローを1つ選んで記入し、リリース前に実際のコントロールプレーンを使って机上演習を1回、制御されたGameDayを1回実施することを推奨します。

## 1. サービスと運用の境界

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

チェック項目：

- [ ] サポート対象が単なるAPI一覧ではなく、ユーザーのGoalとして定義されています。
- [ ] サポートしないIntent、リスク、副作用が明確になっています。
- [ ] 運用上の意思決定ごとにOwnerが割り当てられています。
- [ ] リリースバージョンからPrompt、Model、Policy、Tool、Knowledgeの各バージョンを関連付けられます。

## 2. 相関の主軸と実行ID

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

### 2.1 バージョンインベントリ

| バージョン要素 | 現行 | 直前 | 信頼できる唯一の情報源 | ロールバック参照 | Owner |
|---|---|---|---|---|---|
| アプリケーションリリース |  |  |  |  |  |
| Prompt |  |  |  |  |  |
| Model / Provider |  |  |  |  |  |
| Agent契約 |  |  |  |  |  |
| Tool契約 |  |  |  |  |  |
| Policy |  |  |  |  |  |
| Knowledgeスナップショット |  |  |  |  |  |
| Capabilityスナップショット |  |  |  |  |  |
| Checkpointスキーマ |  |  |  |  |  |

## 3. Goal Outcome Event

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

制約：

- [ ] `outcome=complete` に、実行可能なビジネス定義があります。
- [ ] `goal_success` は、結果、エビデンス、安全な経路をすべて考慮します。
- [ ] キャンセル、ユーザーによる断念、依存先障害について、分母に含めるかどうかの方針が明確です。
- [ ] 元のユーザーID、Prompt、PIIをMetric Labelに含めません。

## 4. Tier 1メトリクスとSLO

| Metric ID | ユーザーへの約束 | 対象母集団 | 計算方法 | ウィンドウ | 目標 | スライス | Owner |
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

### 4.1 エラーバジェット方針

| バジェット状態 | 移行条件 | 変更方針 | 封じ込め | 解除条件 | 承認者 |
|---|---|---|---|---|---|
| 正常 |  |  |  |  |  |
| 注意 |  |  |  |  |  |
| 急速消費 |  |  |  |  |  |
| 枯渇 |  |  |  |  |  |

チェック項目：

- [ ] しきい値は業界の言い伝えではなく、事業損失、ベースライン、リスクに基づいています。
- [ ] Fast BurnとSlow Burnの両方に方針があります。
- [ ] セキュリティイベントを信頼性バジェットで相殺しません。
- [ ] バジェット枯渇時に停止する変更と、許可する修正が明記されています。

## 5. Tier 2診断メトリクスカタログ

| レイヤー | メトリクス | 定義 | ラベル | 高カーディナリティ参照 | しきい値 / ベースライン | Owner |
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

## 6. Telemetry Schemaとデータガバナンス

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

### 6.1 カーディナリティレビュー

Metric Labelに適した候補：

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

デフォルトではMetric Labelにしてはならないもの：

- `request_id`
- `user_id`
- 任意のURLまたはQuery
- 元のPrompt
- Tool Output
- Evidence本文
- PII

### 6.2 サンプリング方針

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

## 7. 5つのビューからなるDashboard

### 7.1 Business View

- [ ] Goal Success / Partial / Blocked
- [ ] Evidence Coverage
- [ ] Human Escalation
- [ ] Intent、Risk、Tenant Tier、Releaseによるスライス

### 7.2 Execution View

- [ ] Plan / Replan
- [ ] Route / Fallback
- [ ] Critical Path
- [ ] Step / Join / Deadline
- [ ] Retry Amplification

### 7.3 Model View

- [ ] Provider / Model / Prompt Version
- [ ] TTFT / Latency / Token
- [ ] Structured Output Failure
- [ ] Fallbackと機能縮退

### 7.4 Tool View

- [ ] Tool Intent / Policy Decision
- [ ] Latency / Error / Rate Limit
- [ ] Idempotency / Unknown Side Effect
- [ ] Evidence Freshness

### 7.5 Control View

- [ ] Circuit / Degradation State
- [ ] Approval Queue / Expiry
- [ ] Budget / Rate Limit
- [ ] Active Override / Break-glass
- [ ] Rollback / Recovery Verification

| ロール | Business | Execution | Model | Tool | Control |
|---|---:|---:|---:|---:|---:|
| Business Ops |  |  |  |  |  |
| On-call |  |  |  |  |  |
| Security |  |  |  |  |  |
| Platform Admin |  |  |  |  |  |

## 8. Alert Registry

| Alert ID | SLI / リスク | 条件 | 影響 | 必須コンテキスト | Runbook | Owner | テスト日 |
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

チェック項目：

- [ ] アラートはユーザー影響または明確なリスクに対応しています。
- [ ] オンコール担当者がバージョンや代表サンプルを探し直す必要がありません。
- [ ] アラートが実行可能なRunbookを参照しています。
- [ ] Silenceに承認、適用範囲、有効期限があります。

## 9. Incident Bundle

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

| 時刻 | 種別 | 事実 / 仮説 / アクション | エビデンス | 結果 | 実行者 |
|---|---|---|---|---|---|
|  | fact |  |  |  |  |
|  | hypothesis |  |  |  |  |
|  | excluded |  |  |  |  |
|  | action |  |  |  |  |

## 10. インシデントの因果再構築

| ノード | 想定される契約 | 観測結果 | エビデンス | 最初に誤ったノードか | Owner |
|---|---|---|---|---|---|
| Goal / Constraint |  |  |  |  |  |
| Plan / Dependency |  |  |  |  |  |
| Route / Capability |  |  |  |  |  |
| Team / Worker |  |  |  |  |  |
| Tool / Data |  |  |  |  |  |
| Context / Memory |  |  |  |  |  |
| Evidence / Claim |  |  |  |  |  |
| Decision / Answer |  |  |  |  |  |

根本原因の記録：

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

## 11. Failure Taxonomy

| クラス | 定義 | 例 | 決定論的シグナル | Triage Owner |
|---|---|---|---|---|
| Input / Context |  |  |  |  |
| Planner |  |  |  |  |
| Router |  |  |  |  |
| Worker |  |  |  |  |
| Tool / Data |  |  |  |  |
| Consolidator |  |  |  |  |
| Runtime |  |  |  |  |
| Security |  |  |  |  |

クラスタリングキー：

```text
team × failure_class × release_version × prompt_version × intent × risk
```

## 12. Control Action Contract

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

チェック項目：

- [ ] 影響の大きいアクションには2名によるレビューを採用しています。
- [ ] Break-glassにTTL、理由、監査があります。
- [ ] Expected Versionを使って、同時変更の上書きを防止します。
- [ ] 自動アクションは、演習済みでロールバック可能な範囲だけを対象にします。
- [ ] AIによる提案と決定論的な実行権限を分離します。

## 13. Circuit、縮退、復旧の方針

| 状態 | 移行条件 | 許可されるアクション | 結果のセマンティクス | Probe | 解除条件 |
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

## 14. Checkpoint、復旧、Reconcile

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

### 14.1 Replan Contract

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

## 15. DeadlineとRetry Policy

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

## 16. Provider ContractとFailover

| Provider / Model | Capability | サポート対象のIntent | 対象外のリスク | Eval Run | TTFT / P95 | データ方針 | Owner |
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

統一エラー：

```text
rate_limited | timeout | unavailable | invalid_output
safety_block | context_exceeded | authentication | billing
```

## 17. Cost Eventとバジェット

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

| メトリクス | 計算方法 | ウィンドウ | スライス | バジェット | アクション | Owner |
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

## 18. KnowledgeとContext Operations

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

| シグナル | 定義 | しきい値 | 診断Query | Owner |
|---|---|---|---|---|
| entity_resolution_error |  |  |  |  |
| cross_scope_edge_count |  |  |  |  |
| knowledge_freshness_lag |  |  |  |  |
| retrieval_no_data_rate |  |  |  |  |
| traversal_expansion |  |  |  |  |
| claim_evidence_mismatch |  |  |  |  |

### 18.1 Context Compression

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

## 19. Semantic Cache Contract

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

## 20. FeedbackとExperience Governance

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

チェック項目：

- [ ] 本番環境のフィードバックがPromptや長期記憶へ自動的に書き込まれることはありません。
- [ ] Provenance、Reviewer、Scope、Validity、Compatibilityがすべて揃っています。
- [ ] PII、インジェクション、フィードバックポイズニングを検査します。
- [ ] リリース前にHoldout / A-Bまたは段階的ロールアウトを通過しています。

## 21. Prompt Release Manifest

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

ライフサイクル：

```text
Draft → Review → Offline Eval → Canary → Promote
      → Operate → Rollback → Retire
```

## 22. CapacityとHigh Availability

| 境界 | ボトルネックシグナル | スケールアクション | 最大値 | Drain | Checkpoint | 副作用の防止 |
|---|---|---|---|---|---|---|
| Gateway |  |  |  |  |  |  |
| Supervisor |  |  |  |  |  |  |
| Team / Worker |  |  |  |  |  |  |
| MCP / Tool |  |  |  |  |  |  |
| Context Graph |  |  |  |  |  |  |
| Evaluation |  |  |  |  |  |  |

フェイルオーバーチェック：

- [ ] 実行中のGoalをDrainします。
- [ ] Checkpointを定義済みのSafe Pointで取得します。
- [ ] Idempotency / Reconcileによって副作用の重複を防止します。
- [ ] 移行後にAuthorization / Approvalを再検証します。
- [ ] Late Resultが新しいPlanを上書きしません。

## 23. Trust Boundaryと運用セキュリティ

| 境界 | Identity | 暗号化 | スキーマ | 最小権限 | 出力サニタイズ | 監査 |
|---|---|---|---|---|---|---|
| Intent → Gateway |  |  |  |  |  |  |
| Gateway → Agent Zone |  |  |  |  |  |  |
| Agent → MCP / Tool |  |  |  |  |  |  |
| Agent → Knowledge |  |  |  |  |  |  |
| Agent → Context Graph |  |  |  |  |  |  |

運用セキュリティシグナル：

- Tool Output Injection。
- Cross-tenant Retrieval。
- PII / DLP検出。
- Unauthorized Action。
- Approval Expiry / Replay。
- Delegation Scope Mismatch。

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

自動化の境界：

| ステップ | 自動化するか | 必要な承認 | 最大適用範囲 | ロールバック | エビデンス |
|---|---:|---|---|---|---|
| コンテキスト収集 |  |  |  |  |  |
| 封じ込めの適用 |  |  |  |  |  |
| Reconcile |  |  |  |  |  |
| 復旧 |  |  |  |  |  |
| 解除の確認 |  |  |  |  |  |

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

推奨シナリオ：

- [ ] Providerの5xx / レート制限。
- [ ] Toolが遅延し、未知の副作用が発生します。
- [ ] Knowledge Snapshotが古くなっています。
- [ ] Checkpoint取得後にクラッシュします。
- [ ] Capability Cardがドリフトします。
- [ ] Context Compressionが主体を取り違えます。
- [ ] Feedback Poisoning。
- [ ] Semantic Cacheが異なる主体に対してヒットします。

## 26. Operational Readiness Review

### 26.1 サービスとSLO

- [ ] Goal、Intent、リスク、除外範囲が定義されています。
- [ ] Tier 1 / Tier 2メトリクスを本番データから計算できます。
- [ ] SLOとエラーバジェット方針が承認されています。
- [ ] ゼロトレランスのセキュリティ条件を相殺可能な総合スコアへ組み込んでいません。

### 26.2 品質とエビデンス

- [ ] Golden Dataset、Fixture、N-run、段階的ロールアウトのエビデンスを追跡できます。
- [ ] Claim → Evidenceの経路を照会できます。
- [ ] 重要な実行Artifactに、アクセス、保持、削除の方針があります。
- [ ] Prompt / Model / Tool / Knowledgeの各バージョンを関連付けられます。

### 26.3 診断と対応

- [ ] 5つのビューからなるDashboardを利用できます。
- [ ] アラートに、影響、スライス、サンプル、変更、Runbookが含まれています。
- [ ] Incident Bundleが基本的な事実を自動収集できます。
- [ ] Failure TaxonomyとTriage Ownerが定義されています。

### 26.4 制御と復旧

- [ ] サーキットブレーカー、縮退、キャンセル、ロールバックをコントロールプレーンから実行できます。
- [ ] Control ActionにScope、Approval、TTL、Auditがあります。
- [ ] Checkpoint Resumeで再認可し、Deadlineを確認します。
- [ ] 未知の副作用をReconcileで処理します。
- [ ] 復旧の解除条件がGoal、Evidence、セキュリティ、コストをすべて対象にしています。

### 26.5 レジリエンスとキャパシティ

- [ ] DeadlineとRetry Budgetをエンドツーエンドで伝播します。
- [ ] Provider Failoverが互換性評価を通過しています。
- [ ] Agent数の推測ではなく、実際のボトルネックに基づいてスケールします。
- [ ] Drain、Checkpoint、Side-effect Protectionを検証済みです。

### 26.6 コスト、Knowledge、学習

- [ ] Cost Eventを成功したGoalに帰属させられます。
- [ ] バジェット枯渇時のビジネス上のセマンティクスが明示されています。
- [ ] Knowledge / Ontologyのリリースに互換性テストとロールバックがあります。
- [ ] Context Compressionが主体、制約、Evidenceを保持します。
- [ ] Feedback / Experienceに人によるガバナンスと有効期限があります。

### 26.7 人とプロセス

- [ ] On-call、エスカレーション、インシデント対応の各ロールが明確です。
- [ ] Runbookを作成者以外が実行済みです。
- [ ] 高リスクシナリオを少なくとも1つGameDayで完了しています。
- [ ] 演習のアクション項目にOwnerと期限があります。

## 27. ORR意思決定記録

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

最終原則：

> リリースできるバージョンが、必ずしも運用できるとは限りません。Goalを測定でき、因果関係を再構築でき、アクションを監査でき、状態を復旧でき、コストを帰属でき、障害を演習できて初めて、マルチエージェントシステムは真に本番運用の準備が整ったと言えます。
