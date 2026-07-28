---
title: マルチエージェントシステムの統合と受け入れ検証契約
description: レイヤー型マルチエージェントシステムの階層、能力、計画、A2A、MCP、状態、Context Graph、障害、および受け入れ検証を設計するためのテンプレート
---

# マルチエージェントシステムの統合と受け入れ検証契約

このテンプレートは、「複数の Agent を呼び出せる」段階から「1 つのシステムとしてリリースできる」段階へ進めるために使用します。ビジネス Owner、Agent プラットフォーム、ドメインチーム、セキュリティ、SRE、評価責任者が共同で記入することを推奨します。

すべての項目を一度に埋める必要はありません。まず、実際の垂直業務フローを 1 つ選び、契約と受け入れ検証エビデンスを確立してから、チームと能力を拡張します。

## 1. ドキュメントのメタデータ

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

## 2. システムミッション

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

必ず次の問いに答えてください。

- なぜ決定論的ワークフローではないのですか。
- なぜ単一 Agent ではないのですか。
- マルチエージェントによる効果を評価できますか。
- 単一 Agent または読み取り専用モードに縮退した場合でも、どのビジネス価値が維持されますか。

## 3. レイヤー分割の判断

| 判断軸 | エビデンス | 独立した境界が必要か | Owner |
|---|---|---|---|
| ドメインエンティティとルール |  |  |  |
| データとテナント |  |  |  |
| ツールと副作用 |  |  |  |
| 権限と承認 |  |  |  |
| スケーリングとデプロイ |  |  |  |
| リリースライフサイクル |  |  |  |
| 障害影響範囲 |  |  |  |
| レイテンシ予算 |  |  |  |

```yaml
architecture_decision:
  selected_shape: single_agent | deterministic_workflow | hierarchical_multi_agent
  reasons: []
  rejected_options: []
  expected_benefits: []
  added_costs: []
  rollback_shape: ""
```

## 4. レイヤー／チームレジストリ

| レイヤー／チーム | 担当すること | 明示的に担当しないこと | 入力契約 | 出力契約 | デプロイ Owner |
|---|---|---|---|---|---|
| Access API |  |  |  |  |  |
| Central Supervisor |  |  |  |  |  |
| Team Supervisor A |  |  |  |  |  |
| Worker A1 |  |  |  |  |  |
| MCP Server A |  |  |  |  |  |

境界テスト：

- [ ] Central Supervisor はビジネスデータベースへ直接アクセスしません。
- [ ] Team Supervisor はユーザーまたは親タスクの Scope を拡大しません。
- [ ] Worker は名前付き能力のみを実行します。
- [ ] Tool は自由形式のビジネス目標を解釈しません。
- [ ] 計画、認可、実行、受け入れ検証を 1 つの Prompt に集中させません。

## 5. 能力契約

### 5.1 A2A AgentCard の出所

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

### 5.2 内部能力スナップショット

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

検証：

- [ ] 能力スナップショットは AgentCard をそのまま複製したものではありません。
- [ ] Planner に渡すフィールドは最小化されています。
- [ ] Card に静的な Secret は含まれていません。
- [ ] Endpoint、バージョン、署名、ヘルス状態は Dispatch 時に再確認されます。

## 6. Goal 契約

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

不変条件：

- [ ] Goal の作成後、下流で暗黙的に書き換えてはなりません。
- [ ] 禁止アクションは Prompt 内だけでなく、構造化フィールドにも格納します。
- [ ] Goal を改訂するたびに、バージョンとイベントを生成します。

## 7. 実行計画契約

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

### 7.1 Plan Validator

- [ ] Schema が有効です。
- [ ] Step ID が一意です。
- [ ] Team / Skill が存在します。
- [ ] プロトコルと契約のバージョンに互換性があります。
- [ ] 依存先が存在し、循環がありません。
- [ ] 必須入力をマッピングできます。
- [ ] 予算、並行実行数、Deadline が有効です。
- [ ] 各 Step の実効権限が有効です。
- [ ] 高リスクの Step に承認が宣言されています。
- [ ] Join はすべての結果ステータスを区別できます。
- [ ] Evidence Requirement を満たせます。
- [ ] Replan の回数に上限があります。

## 8. A2A Dispatch 契約

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

受信側の検証：

- [ ] プロトコルのバージョンがサポートされています。
- [ ] 呼び出し元の ID が有効です。
- [ ] Audience が現在の Agent システムを指しています。
- [ ] Expiry の期限が切れていません。
- [ ] Nonce がリプレイされていません。
- [ ] Subject / Tenant が自然言語内だけでなく、構造化されています。
- [ ] Skill が存在し、現在利用できます。
- [ ] 受信側でリソースレベルの認可を再実行します。
- [ ] 下流の Scope は縮小のみ可能です。
- [ ] Task / Context の可視性が ACL に準拠しています。

## 9. MCP Tool 契約

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

検証：

- [ ] Tool Description は権限を付与しません。
- [ ] パラメーターには構造化された Schema を使用します。
- [ ] Resource を Tenant にバインドします。
- [ ] Tool Result は State に取り込む前に検証します。
- [ ] 副作用には Idempotency と Expected Version を使用します。
- [ ] MCP Tasks を使用する前に Capability Negotiation を完了します。
- [ ] HTTP 認可は現在の MCP 認可フレームワークに準拠しています。

## 10. Result および Artifact 契約

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

Artifact：

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

ルール：

- [ ] A2A タスクの出力には Artifact を使用し、一時的な Message には依存しません。
- [ ] `completed` には契約を完全に満たす Result があります。
- [ ] `no_data` と `failed` を区別します。
- [ ] `partial` / `degraded` には不足項目と影響を列挙します。
- [ ] Result には Plan Version と Hash を付与します。
- [ ] Artifact には不変の参照、分類、保持ポリシーがあります。

## 11. エビデンス契約

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

検証：

- [ ] Anchor を再現可能な形で特定できます。
- [ ] Source Version / Hash を検証できます。
- [ ] Evidence の権限は Context に取り込まれた後も失われません。
- [ ] 高リスクの Claim にはすべて Evidence があります。
- [ ] 推論と事実を分離します。

## 12. 状態所有権カタログ

| フィールド／オブジェクト | 正規情報源 | 唯一の書き込み主体 | Reducer／マージ | 保持 | 復旧戦略 |
|---|---|---|---|---|---|
| Goal |  |  |  |  |  |
| Plan |  |  |  |  |  |
| StepResult |  |  |  |  |  |
| Evidence |  |  |  |  |  |
| Error |  |  | Append-only |  |  |
| Budget |  |  |  |  |  |
| Approval |  |  |  |  |  |
| FinalAnswer |  |  |  |  |  |

システム不変条件：

- [ ] 完了した Step には Result または No Data が必ずあります。
- [ ] 強い依存関係が完了していない場合、下流を開始しません。
- [ ] Final Claim から Evidence までたどれます。
- [ ] 副作用から認可、承認、冪等キーまでたどれます。
- [ ] 古い Plan の Result が新しい Plan を汚染しません。
- [ ] 重複した Result の Hash が異なる場合は処理をブロックします。

## 13. Join 契約

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

テスト：

- [ ] Required は Success、Optional は Timeout。
- [ ] Required が No Data。
- [ ] Required が Failure。
- [ ] 同一 Hash の Duplicate。
- [ ] 異なる Hash の Duplicate。
- [ ] 古い Plan からの Late Result。
- [ ] Evidence の Conflict。
- [ ] Join 中の Cancel。

## 14. Context Graph Schema

### 14.1 ノード

| ノードタイプ | 必須フィールド | 正規情報源 | 保持期間 |
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

### 14.2 エッジ

| エッジタイプ | 接続元 | 接続先 | 多重度 | 必須エビデンス |
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

### 14.3 コピーではなく参照

- [ ] 大きなオブジェクトには Artifact Ref のみを保存します。
- [ ] Trace には Trace / Span Ref のみを保存します。
- [ ] Knowledge Entity には Versioned Ref を使用します。
- [ ] グラフクエリで ACL と Tenant を強制します。
- [ ] 削除リクエストをインデックスと派生プロジェクションへ伝播できます。

## 15. ストレージ責任マップ

| メカニズム | 正規データ | 書き込みタイミング | 一貫性 | 障害時の戦略 |
|---|---|---|---|---|
| Checkpoint |  |  |  |  |
| Event Log |  |  |  |  |
| State Store |  |  |  |  |
| Context Graph |  |  |  |  |
| Artifact Store |  |  |  |  |
| Trace Backend |  |  |  |  |
| Audit Store |  |  |  |  |

## 16. Error 契約

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

デフォルト戦略：

| カテゴリ | 自動再試行 | デフォルトアクション |
|---|---|---|
| Validation | いいえ | 入力の修正または有界な Replan |
| Authorization | いいえ | 拒否または承認の申請 |
| Transient | 条件付き | 有界バックオフ |
| Dependency | いいえ | 強く依存する下流処理をブロック |
| Model | 条件付き | 構造の修復または限定的な Replan |
| Business | いいえ | ビジネス結果として返却 |
| Side Effect Unknown | いいえ | Reconcile |
| Systemic | 条件付き | Circuit Breaker / Failover |

## 17. 復旧契約

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

復旧訓練：

- [ ] Tool の実行前にクラッシュ。
- [ ] Tool の実行後、State への反映前にクラッシュ。
- [ ] State への反映後、Context Graph への反映前にクラッシュ。
- [ ] A2A Task の実行中に Client が再起動。
- [ ] MCP Task の実行中に接続が切断。
- [ ] 古い Token / Approval の期限切れ。
- [ ] リソースのバージョン変更。
- [ ] Parent Task がすでにキャンセル済み。

## 18. キャンセル契約

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

- [ ] Cancel Accepted と Execution Stopped を分けて記録します。
- [ ] Terminal Task を誤って再度キャンセルしません。
- [ ] 実行中の Side Effect には Reconcile / Compensation があります。
- [ ] Context Graph にキャンセル理由と Actor を記録します。

## 19. コンテキスト圧縮契約

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

品質ゲート：

- [ ] 事実保持率。
- [ ] 制約保持率。
- [ ] 否定保持率。
- [ ] Evidence Anchor 保持率。
- [ ] 下流タスク成功率。
- [ ] 機密情報の最小化。

## 20. オブザーバビリティ契約

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

| プレーン | メトリクス | アラート | ダッシュボード | Owner |
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

## 21. デプロイと Readiness

### 21.1 デプロイの依存関係

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

- [ ] 設定、証明書、鍵が有効です。
- [ ] Migration のバージョンが一致しています。
- [ ] State / Event / Artifact を読み書きできます。
- [ ] Context Graph が利用可能、または制御されたバッファリングが成立しています。
- [ ] Audit と Trace に書き込めます。
- [ ] 依存先の AgentCard、A2A、MCP、ビジネス契約に互換性があります。
- [ ] モデルの Provider と Fallback が利用できます。
- [ ] Policy / Approval / Kill Switch が利用できます。
- [ ] Synthetic Golden Path に合格しています。

## 22. Golden Scenario Manifest

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

## 23. 障害訓練マトリクス

| ID | 注入ポイント | 障害 | 期待する状態 | 再試行／縮退 | 不変条件 | エビデンスの場所 | Owner |
|---|---|---|---|---|---|---|---|
| F1 | Planner | 循環依存 |  |  | Tool Call なし |  |  |
| F2 | A2A Team | Timeout |  |  |  |  |  |
| F3 | MCP Tool | 不正な Schema |  |  | Result を State に取り込まない |  |  |
| F4 | Worker | Tool 実行後にクラッシュ |  |  | 副作用の重複なし |  |  |
| F5 | Auth | Token の期限切れ |  |  | 古い Token を再利用しない |  |  |
| F6 | Context Graph | 利用不可 |  |  |  |  |  |
| F7 | Scheduler | Cancel Race |  |  | 下流を開始しない |  |  |
| F8 | Model Provider | 5xx |  |  | バージョンを追跡可能 |  |  |

## 24. システム受け入れ検証レポート

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

## 25. リリースゲート

| ゲート | Go | No-Go | 現在の結論 | エビデンス |
|---|---|---|---|---|
| 契約 | 互換性があり、Migration の訓練済み | バージョン未設定／後方互換性を破壊 |  |  |
| ビジネス | Golden Scenario が基準を達成 | Goal / Evidence が基準未達 |  |  |
| 復旧 | 訓練に合格し、アクションの重複なし | Unknown の処置なし |  |  |
| セキュリティ | 最小権限、承認、監査に合格 | 権限逸脱／リプレイ／テナント横断が可能 |  |  |
| 運用 | SLO、Alert、Runbook の準備完了 | 人手による監視に依存 |  |  |
| コスト | 予算内で帰属先を特定可能 | 成功した Goal あたりのコストが制御不能 |  |  |
| ロールバック | バージョンとデータをロールバック可能 | 不可逆で補償なし |  |  |

## 26. 最終承認

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

テンプレート内の不明項目が、明確なリスク、Owner、期限、リリース判断に置き換わった時点で、初めてシステムのアーキテクチャレビューが完了します。空欄は「後で記入する」という意味ではなく、ゲートをまだ通過していないことを意味します。
