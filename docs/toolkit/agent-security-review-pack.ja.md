---
title: Agentセキュリティレビューおよびレッドチーム契約
description: 再利用可能な脅威記録、Tool Security Manifest、承認、監査、レッドチーム、セキュリティ受け入れテンプレート
---

# Agentセキュリティレビューおよびレッドチーム契約

本テンプレートは、AgentセキュリティをPrompt上の推奨事項から実行可能な契約へと変換するためのものです。アプリケーション、プラットフォーム、セキュリティ、データ、ビジネスの各オーナーが共同でレビューし、それぞれの結論に実装箇所または検証エビデンスを紐付けることを推奨します。

!!! warning "テンプレートの完成をシステムの安全性と同一視しないでください"
    テンプレートは、チームが見落としを発見するための手段にすぎません。最終的な結論は、Policy Test、実際のアイデンティティ連携テスト、攻撃テスト、コントロールプレーンへの障害注入、および運用エビデンスに基づく必要があります。

## 1. システムセキュリティコンテキスト

```yaml
system:
  name:
  release:
  environment:
  business_owner:
  application_owner:
  platform_owner:
  security_owner:

purpose:
  intended_users:
  allowed_tasks:
  prohibited_tasks:
  risk_ceiling:
  human_oversight:

assets:
  - id:
    description:
    classification:
    source_of_truth:
    owner:
    worst_case_impact:

identities:
  users:
  workloads:
  peer_agents:
  administrators:
  service_accounts:

trust_boundaries:
  - id:
    from:
    to:
    data:
    authentication:
    authorization:
    encryption:
    validation:
    audit:
```

## 2. 脅威記録

```yaml
threat_id:
title:
status: open | mitigated | accepted | transferred

asset:
boundary:
actors:
preconditions:
entry_points:
attack_path:

impact:
  confidentiality:
  integrity:
  availability:
  privacy:
  financial:
  safety:

framework_mapping:
  owasp_agentic:
  owasp_llm:
  stride:

controls:
  preventive:
  detective:
  responsive:
  recovery:

evidence:
  implementation:
  tests:
  dashboards:
  drills:

residual_risk:
  description:
  owner:
  decision:
  expires_at:
  compensating_controls:

review:
  reviewers:
  last_reviewed_at:
  next_review_at:
```

### 脅威レビューの確認事項

- 攻撃者は目標またはツールの実行順序を変更できるか。
- 低権限の主体が高権限のAgentの権限を利用できないか。
- 2つの正当なToolを組み合わせることで、データを外部へ流出させられないか。
- Memory / RAGに悪意のあるコンテンツが永続化される可能性はないか。
- コントロールバックエンドの障害時に、システムはFail Openになるか、Fail Closedになるか。
- インシデント発生後に、どのように隔離、失効、復旧するか。
- 高リスクの脅威ごとに再現可能なテストがあるか。

## 3. セキュリティコントロールマトリクス

| 脅威 | 資産 | 境界 | 予防 | 検知 | 対応 | 復旧 | ポリシーオーナー | 実装オーナー | テスト | メトリクス | 残余リスク |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

## 4. Tool Security Manifest

```yaml
identity:
  tool_id:
  display_name:
  publisher:
  version:
  code_digest:
  description_digest:
  manifest_digest:
  review_status:

contract:
  action:
  resource_type:
  input_schema:
  output_schema:
  side_effect:
  reversibility:
  risk: R0 | R1 | R2 | R3

authorization:
  required_permissions:
  allowed_callers:
  task_scopes:
  resource_acl:
  tenant_constraints:
  environment_constraints:
  purpose_constraints:

execution:
  executor:
  workload_identity:
  credential_mode: just-in-time
  token_audience:
  secret_access:
  network_egress:
  filesystem:
  sandbox:
  timeout:
  rate_limit:
  max_result_rows:
  max_result_bytes:

safety:
  idempotency:
  expected_version:
  dry_run:
  approval:
  compensation:
  kill_switch:

data:
  input_classification:
  output_classification:
  allowed_channels:
  retention:
  dlp_policy:

audit:
  level:
  required_fields:
  artifact_policy:

tests:
  contract:
  policy:
  integration:
  adversarial:
  failure_modes:
```

### Toolの即時却下条件

- モデルが本番環境のSecretを直接読み取れる。
- Tool IDまたはPublisherが一意ではない。
- バージョンまたはSchemaが固定されていない。
- 高リスクの副作用に承認が不要である。
- 書き込み操作に冪等性とリソースバージョンのチェックがない。
- 外部ネットワークへのアクセスが無制限である。
- 結果にフィールドACLとデータ分類が適用されていない。
- そのToolだけを個別に無効化できない。

## 5. 実効権限の決定

```yaml
request:
  request_id:
  occurred_at:
  user:
  workload:
  task:
  delegation_chain:
  environment:

intent:
  tool_id:
  tool_version:
  action:
  resource:
  arguments_hash:
  requested_scopes:

authority_inputs:
  user_permissions:
  workload_permissions:
  delegation_scopes:
  task_scopes:
  tool_required_permissions:
  resource_permissions:
  runtime_constraints:
  approval_scopes:

decision:
  effect: allow | deny | require_approval
  granted_scopes:
  reason_codes:
  policy_id:
  policy_version:
  valid_until:
  obligations:

evidence:
  audit_event:
  trace_id:
```

## 6. Bound Approval

```yaml
approval:
  approval_id:
  policy:
  risk:
  approvers:
  separation_of_duties:

action:
  action_hash:
  tool_id:
  tool_version:
  resource_id:
  expected_version:
  parameter_diff:
  impact_summary:
  reversibility:
  data_classification:

grant:
  scopes:
  issued_at:
  expires_at:
  nonce:
  audience:
  signature:

execution:
  idempotency_key:
  compare_and_set:
  result:
  audit_event:
```

### 承認の受け入れ基準

- [ ] 承認者に、確定したパラメータと差分が提示される。
- [ ] TokenがAction、Resource、Version、Scope、Expiryに紐付けられている。
- [ ] 実行前にユーザーとリソースが再検証される。
- [ ] リソースが変更された場合は再承認が必要になる。
- [ ] Tokenを他のToolまたはリソースに使用できない。
- [ ] R3の操作が職務分離の要件を満たす。
- [ ] 拒否と期限切れのいずれについても一貫した監査記録が残る。

## 7. 委任セキュリティ契約

```yaml
delegation:
  delegation_id:
  parent_task_id:
  child_task_id:
  sender:
  recipient:
  user_delegation_ref:

scope:
  goals:
  allowed_tools:
  allowed_resources:
  scopes:
  data_classification_ceiling:
  risk_ceiling:
  deadline:
  max_cost:

integrity:
  issued_at:
  expires_at:
  nonce:
  audience:
  contract_version:
  payload_hash:
  signature:

receiver_checks:
  sender_authenticated:
  delegation_is_subset:
  resource_authorized:
  nonce_unused:
  not_expired:
  schema_valid:
  policy_decision:
```

不変条件：

```text
child_scope ⊆ parent_effective_scope
child_deadline ≤ parent_deadline
child_risk ≤ parent_risk
```

## 8. プライバシーおよびメモリの記録

```yaml
data_element:
  name:
  source:
  classification:
  data_subject:
  owner:

purpose:
  allowed_purposes:
  prohibited_purposes:
  model_requires_raw_value:
  lawful_or_policy_basis:
  consent_ref:

transformation:
  method: redact | mask | tokenize | hash | encrypt | synthetic
  detector:
  detector_version:
  false_positive_review:
  reidentification_authority:

storage:
  context:
  conversation:
  memory:
  vector_index:
  artifact:
  audit:
  evaluation_dataset:

access:
  roles:
  tenants:
  channels:
  regions:

retention:
  ttl:
  policy:
  deletion_triggers:
  backup_expiry:

deletion_propagation:
  targets:
  completion_slo:
  evidence:
```

## 9. 監査イベント契約

```yaml
event:
  event_id:
  occurred_at:
  received_at:

actor:
  actor_type:
  actor_id_hash:
  user_id_hash:
  tenant_id:
  delegation_ref:

operation:
  task_id:
  action:
  resource_type:
  resource_id_hash:
  tool_id:
  tool_version:

decision:
  policy_id:
  policy_version:
  effect:
  reason_codes:
  obligations:

execution:
  outcome:
  error_class:
  idempotency_key_hash:
  approval_id:
  trace_id:

integrity:
  previous_event_hash:
  event_hash:
  signer:
  timestamp_ref:
  immutable_storage_ref:

privacy:
  included_fields:
  excluded_fields:
  artifact_refs:
  retention:
```

### 監査の完全性チェック

- [ ] Subject、Action、Resource、Policy、Decision、Outcomeを再構築できる。
- [ ] Prompt、Secret、PII、および完全な業務処理結果が不必要に複製されていない。
- [ ] 欠落、遅延、署名失敗、Hashチェーンの断絶を検知してアラートを発報できる。
- [ ] Auditが利用できない場合、高リスクのアクションはFail Closedになる。
- [ ] 鍵、時刻、イミュータブルストレージの管理責任が互いに独立している。
- [ ] 監査記録自体のエクスポートとアクセスも監査される。

## 10. コントロール障害マトリクス

| コントロール | 障害 | R0 | R1 | R2 | R3 | アラート | 復旧オーナー |
|---|---|---|---|---|---|---|---|
| アイデンティティ | 利用不能 |  |  |  |  |  |  |
| ポリシー | 利用不能 / 古い |  |  |  |  |  |  |
| 承認 | 利用不能 |  |  |  |  |  |  |
| DLP | 利用不能 |  |  |  |  |  |  |
| 監査 | 利用不能 |  |  |  |  |  |  |
| Nonce Store | 利用不能 |  |  |  |  |  |  |
| セキュリティモニター | 利用不能 |  |  |  |  |  |  |
| Tool Registry | ダイジェスト不一致 |  |  |  |  |  |  |

## 11. レッドチームケース

```yaml
case:
  case_id:
  category:
  threat_id:
  title:
  version:

entry:
  entry_point:
  payload_ref:
  encoding:
  preconditions:

identities:
  user:
  workload:
  peer_agent:
  tenant:

task:
  objective:
  allowed_tools:
  allowed_resources:
  risk_ceiling:

forbidden:
  tools:
  resources:
  outputs:
  side_effects:

expected:
  task_status:
  task_can_complete:
  security_events:
  policy_decisions:
  side_effect_count: 0

execution:
  environment:
  model:
  prompt_version:
  policy_version:
  tool_registry_hash:
  repetitions:

cleanup:
  actions:
  verification:

evidence:
  traces:
  audit_events:
  artifacts:
  screenshots:
```

## 12. レッドチーム結果

```yaml
result:
  case_id:
  release:
  executed_at:
  repetitions:
  attack_successes:
  valid_task_completions:
  false_blocks:
  unauthorized_tool_executions:
  sensitive_item_leaks:
  security_events_observed:
  alert_latency_seconds:
  control_latency_ms:
  outcome: passed | failed | inconclusive

scope_statement:
  この結果は、記録されたリリース、ポリシー、ツールレジストリ、
  モデル、データセットのケース、および反復回数にのみ適用されます。

findings:
  - id:
    severity:
    description:
    evidence:
    owner:
    due_at:

reviewers:
```

## 13. セキュリティ受け入れレポート

```yaml
release:
evaluated_at:

baseline:
  threat_model_version:
  policy_version:
  tool_registry_hash:
  identity_configuration:
  red_team_dataset:
  model_routes:
  prompt_versions:

metrics:
  attack_success_rate:
    numerator:
    denominator:
    value:
  safe_task_completion:
    numerator:
    denominator:
    value:
  false_block_rate:
    numerator:
    denominator:
    value:
  pii_leakage_rate:
    numerator:
    denominator:
    value:
  unauthorized_tool_rate:
    numerator:
    denominator:
    value:
  audit_coverage:
    numerator:
    denominator:
    value:

drills:
  kill_switch:
  secret_revocation:
  policy_backend_failure:
  dlp_backend_failure:
  audit_backend_failure:
  nonce_store_failure:

findings:
  open_critical:
  open_high:
  accepted_residual_risks:

decision:
  effect: approved | approved_with_conditions | rejected
  conditions:

approvers:
  application_owner:
  platform_owner:
  security_owner:
  data_owner:

evidence_refs:
```

レポート内のバージョン、分母、エビデンス、残余リスクをすべて追跡できる場合に限り、「セキュリティ受け入れ合格」が監査可能な結論となります。
