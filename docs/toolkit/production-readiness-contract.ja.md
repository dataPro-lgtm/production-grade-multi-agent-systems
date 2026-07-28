---
title: 本番運用準備および復旧契約
description: 再利用可能な状態所有権、サービス実行、デプロイ検証、復旧訓練のテンプレート
---

# 本番運用準備および復旧契約

本テンプレートは、「サービスを起動できる」という状態を、検証可能な本番運用上の保証へと変換するためのものです。サービスごとにまず Service Runtime Contract を記入し、永続化される状態ごとに State Ownership Catalog を記入したうえで、プラットフォーム責任者が Deployment Verification と Restore Drill Record を管理することを推奨します。

!!! tip "利用原則"
    テンプレート全体をモデルに自動入力させ、そのまま保存しないでください。各 Owner、SLO、RPO、RTO、縮退戦略、復旧不変条件について担当チームの確認を得て、対象環境に検証エビデンスを残す必要があります。

## 1. State Ownership Catalog

```yaml
state_id: task-checkpoint
description: Agent Task Graph、ステップ状態、承認、復旧カーソル

ownership:
  business_owner: agent-platform
  runtime_writer: orchestration-service
  oncall: platform-oncall
  source_of_truth: postgres.agent_tasks
  other_writers_allowed: false

contract:
  schema_version: 42
  consistency: transactional
  ordering_scope: task_id
  durability: durable
  immutable_fields:
    - task_id
    - created_at
  pii_classification: internal
  residency: cn-east

dependencies:
  upstream:
    - gateway
  downstream:
    - worker
    - audit-export
  derived_views:
    - task_search_index

recovery:
  rebuildable: false
  backup_method: base-backup-plus-wal
  backup_interval: continuous
  retention: 35d
  rpo: 5m
  rto: 30m
  restore_order: 2
  runbook: runbooks/restore-task-store.md
  invariants:
    - completed tasks do not re-execute side effects
    - pending tasks resume from the latest valid checkpoint
    - approval decisions remain bound to the original policy version

deletion:
  retention: 365d
  tombstone_propagation:
    - task_search_index
    - audit_export
```

### Catalog のレビュー項目

- 競合が発生した場合、最終的な判断権限を持つのは誰ですか。
- 2 つのサービスが、どちらも自らに書き込み権限があると認識していませんか。
- 派生インデックスを SoT から完全に再構築できますか。
- 削除、権限変更、訂正はどのように伝播しますか。
- バックアップに Schema、鍵のバージョン、依存オブジェクトが含まれていますか。
- RPO / RTO について、直近の訓練によるエビデンスがありますか。

## 2. Service Runtime Contract

```yaml
service:
  name: evidence-worker
  owner: knowledge-platform
  repository: org/agent-platform
  image: registry.example/evidence-worker@sha256:...
  build_revision: git:a6d42f1
  runtime: python-3.13
  run_as_non_root: true
  read_only_root_filesystem: true

interfaces:
  inbound:
    - protocol: queue
      contract: evidence-index-requested.v3
  outbound:
    - target: object-store
      operation: read-source
    - target: vector-store
      operation: upsert-index

identity:
  workload_identity: evidence-worker
  secrets:
    - name: vector-store-credential
      delivery: secret-manager
      rotation_slo: 24h
  permissions:
    - object:read:knowledge-source
    - vector:write:knowledge-index

startup:
  config_schema: worker-config.v5
  compatible_db_schema: ">=42,<44"
  migrations_run_by_service: false
  max_startup_seconds: 90
  failure_classes:
    - CONFIG_INVALID
    - SECRET_UNAVAILABLE
    - SCHEMA_INCOMPATIBLE

health:
  startup:
    path: /health/startup
    success: config-valid-and-client-initialized
  liveness:
    path: /health/live
    success: event-loop-progressing
  readiness:
    path: /health/ready
    hard_dependencies:
      - queue
      - object-store
    degradable_dependencies:
      - telemetry-collector

shutdown:
  stop_receiving_new_work: true
  checkpoint_inflight_work: true
  release_lease: true
  grace_period_seconds: 120

budgets:
  max_task_seconds: 600
  max_attempts: 5
  max_concurrency: 20
  max_queue_age_seconds: 300
  max_embedding_tokens_per_task: 100000

reliability:
  idempotency_key: source_id-plus-content_hash-plus-index_version
  retry_owner: worker
  retryable_errors:
    - RATE_LIMITED
    - TEMPORARY_UNAVAILABLE
  non_retryable_errors:
    - INVALID_SCHEMA
    - PERMISSION_DENIED
  backoff: exponential-with-full-jitter
  dlq: evidence-index-dlq

telemetry:
  trace_spans:
    - worker.consume
    - source.read
    - embedding.batch
    - vector.upsert
  metrics:
    - worker_tasks_total
    - worker_task_duration_seconds
    - worker_retry_total
    - worker_queue_age_seconds
  forbidden_attributes:
    - source_content
    - access_token
    - user_id

slo:
  indicator: valid index jobs completed within 5 minutes
  objective: 99.5%
  window: 28d
  runbook: runbooks/evidence-worker-slo.md
```

## 3. Deployment Verification

### 3.1 ビルドとサプライチェーン

- [ ] イメージには Digest または不変バージョンを使用している。
- [ ] ベースイメージと言語依存関係を固定している。
- [ ] SBOM を生成し、保存している。
- [ ] 脆弱性スキャンがリリースポリシーの基準を満たしている。
- [ ] Secret が Git、イメージレイヤー、ビルドログに含まれていない。
- [ ] 実行中のインスタンスから Build Revision を確認できる。
- [ ] 実行ユーザー、ファイルシステム、Linux Capability が最小権限の原則に準拠している。

### 3.2 構成とマイグレーション

- [ ] 構成が型と範囲の検証を通過している。
- [ ] 現在のアプリケーションと Schema のバージョンに互換性がある。
- [ ] Expand—Migrate—Contract の各フェーズを明示している。
- [ ] データバックフィルの進捗と検証結果を観測できる。
- [ ] Prompt、Policy、Model Route、Embedding、Index の各バージョンを記録している。
- [ ] ロールバック時に互換性のないデータを読み込まない。

### 3.3 ヘルスとトラフィック

- [ ] Startup Probe が、遅い起動を想定した上限時間内に成功する。
- [ ] Liveness は、再起動によって復旧できる内部障害だけを検出する。
- [ ] Readiness は、互換性のないインスタンスへのトラフィック流入を防止できる。
- [ ] 縮退可能な依存関係と必須の依存関係を分離している。
- [ ] Graceful Shutdown 中は新しいタスクを受け付けない。
- [ ] Synthetic Check により実際のビジネス処理経路を検証している。

### 3.4 状態とメッセージ

- [ ] 永続化されるすべての状態に一意の Owner が存在する。
- [ ] SoT と Derived Index を明示している。
- [ ] Consumer は少なくとも 1 回の配信に対して冪等性を維持する。
- [ ] キューの深さ、経過時間、Attempt、DLQ を観測できる。
- [ ] リプレイには認可が必要であり、冪等性を検証している。
- [ ] インスタンスの置き換え後も Checkpoint から復旧できる。

### 3.5 オブザーバビリティとアラート

- [ ] Trace が Gateway、Agent、Tool、Queue、DB を横断している。
- [ ] Metric Label に高カーディナリティまたは機密データが含まれていない。
- [ ] Log が安定したエラーカテゴリを使用し、Trace ID を含んでいる。
- [ ] Dashboard にリリースと構成の変更が表示される。
- [ ] アラートが Owner、Runbook、検証アクションに紐づいている。
- [ ] SLO とエラーバジェットのポリシーが承認されている。

### 3.6 セキュリティ

- [ ] サービスごとに独立した Workload Identity を使用している。
- [ ] 権限を対象リソースと許可されたアクションに限定している。
- [ ] ネットワークはデフォルト拒否とし、外向き通信を制限している。
- [ ] Secret のローテーション訓練に成功し、旧バージョンを失効させている。
- [ ] Baggage、Trace、Log に Secret / PII が含まれていない。
- [ ] 高リスクの Tool にはポリシーと承認が必要である。

## 4. Fault Injection Record

```yaml
experiment_id: fi-model-rate-limit-001
date: 2026-07-23
owner: agent-platform
environment: staging

hypothesis:
  when: primary model route returns 429 for 10 minutes
  system_should:
    - honor retry-after
    - apply bounded jittered retry
    - switch compatible route after retry budget
    - preserve request deadline
    - avoid duplicate tool side effects

injection:
  target: model-gateway
  method: response-fault
  duration: 10m
  blast_radius: test-tenant-only
  abort_condition: production-traffic-detected

observed:
  request_success_rate: 99.2%
  p95_seconds: 74
  retry_amplification: 1.6
  duplicate_side_effects: 0
  alert_fired_seconds: 125
  trace_complete: true

result: passed
evidence:
  dashboard: https://...
  trace_query: https://...
  artifact: s3://...
follow_ups: []
```

## 5. Restore Drill Record

```yaml
drill:
  id: dr-primary-region-loss-001
  scenario: primary-region-loss
  owner: platform-oncall
  started_at: 2026-07-23T01:50:00Z
  completed_at: 2026-07-23T02:07:24Z
  environment: recovery-test

objectives:
  rpo: 5m
  rto: 30m

restore:
  point: 2026-07-23T01:48:28Z
  data_loss_seconds: 92
  service_restore_seconds: 1044
  order:
    - workload-identity
    - postgres
    - object-store
    - queue
    - graph
    - vector-index
    - agent-runtime
    - gateway

versions:
  application: 2.4.1
  db_schema: 42
  tool_contract: v7
  prompt: incident-investigator-v12
  embedding: text-embed-v7
  vector_index: knowledge-2026-07-22
  encryption_key_versions:
    - key-v11
    - key-v12

invariants:
  - name: completed-task-no-replay
    result: passed
    evidence: artifact://...
  - name: pending-task-safe-resume
    result: passed
    evidence: trace://...
  - name: artifact-hash-match
    result: passed
    evidence: report://...
  - name: graph-critical-paths
    result: passed
    evidence: query://...
  - name: vector-source-version-alignment
    result: passed
    evidence: report://...
  - name: synthetic-incident-investigation
    result: passed
    evidence: trace://...

exceptions: []
result: passed
approved_by:
  - platform-owner
  - application-owner
next_drill_due: 2026-10-23
```

## 6. Production Evolution Map

| ローカル実装 | 対象プラットフォームでの実装 | 補うべき保証 | Owner | 検証エビデンス |
|---|---|---|---|---|
| Compose Service |  | 複数レプリカ、スケジューリング、ローリングリリース |  |  |
| Named Volume |  | 永続性、レプリケーション、バックアップ、復旧 |  |  |
| Local Secret |  | アイデンティティ、ローテーション、監査 |  |  |
| Internal Network |  | デフォルト拒否、外向き通信の制限 |  |  |
| Local Collector |  | 高可用性、バッファリング、保持 |  |  |
| Manual Snapshot |  | RPO / RTO と Restore Drill |  |  |

## 7. 最終承認

```yaml
release_candidate: 2.4.1
decision: approved | approved-with-conditions | rejected
conditions: []

evidence:
  build: artifact://...
  contract_tests: artifact://...
  migration_test: artifact://...
  synthetic_test: trace://...
  fault_injection: artifact://...
  restore_drill: artifact://...
  slo_dashboard: https://...

signoff:
  application_owner:
  platform_owner:
  security_owner:
  data_owner:
  approved_at:
```

これらのフィールドから実際のエビデンスにたどれる場合に限り、「本番運用の準備が整っている」という判断は、会議での主観的な判断ではなく、エンジニアリング上の結論となります。
