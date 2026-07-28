# コンテキストエンジニアリング設計キャンバス

> AgentまたはRAGシステムのコンテキスト生成パイプラインを設計するためのキャンバスです。まず意思決定とエビデンスを定義し、その後で検索技術を選択します。

## 1. タスクと意思決定

| フィールド | 内容 |
|---|---|
| ユースケース |  |
| ユーザーが行うべき意思決定 |  |
| Agentが達成すべき目標 |  |
| `as_of` / 時点 |  |
| 受け入れ基準 |  |
| 許容されない結果 |  |
| 最大検索ラウンド数 |  |
| 期限とコスト予算 |  |

## 2. コンテキストインベントリ

| 種類 | 必須情報 | ソース | Owner | ライフサイクル | モデルに入力するか |
|---|---|---|---|---|---|
| 環境 |  |  |  | ランタイム |  |
| タスクと目標 |  |  |  | タスク |  |
| 履歴 / Memory |  |  |  | スレッド / 会話横断 |  |
| Agent状態 |  |  |  | 実行 |  |
| オーケストレーション |  |  |  | タスクグラフ |  |
| 時間 |  |  |  | イベント / 有効時間 |  |
| ポリシー / 規範 |  |  |  | バージョン管理 |  |

各コンテキスト項目について、さらに次の点を確認します。

- ソースは信頼できるか？
- 誰が書き込み、修正、削除できるか？
- ユーザー、Agent、および現在の用途に読み取り権限があるか？
- どのくらいの期間で失効するか？
- 代替バージョンが存在するか？
- 予算を超過した場合、どのように圧縮または省略するか？
- Model Contextに入力する必要があるか、それともTool Runtimeにのみ入力するか？

## 3. ソースマニフェスト

```yaml
source_id:
source_type: doc | git | db | api | graph
owner_team:
classification:
acl_policy:
refresh_sla:
valid_time_field:
deletion_mode:
parser_version:
schema_version:
```

### インデックスオブジェクトの最小フィールド

- `source_id`
- `source_version`
- `content_hash`
- `observed_at`
- `valid_time`
- `acl_labels`
- `parser_version`
- `locator`

## 4. エビデンス契約

```yaml
evidence_id:
source_id:
source_version:
locator:
content:
claims_supported:
  -
observed_at:
valid_time:
  from:
  to:
access_label:
retrieval_scores:
transformations:
content_hash:
```

確認事項：

- [ ] Evidenceから元のソースをたどれる。
- [ ] 時間範囲が、裏付けるべきClaimをカバーしている。
- [ ] データを返す前に権限を適用している。
- [ ] 圧縮とマスキングの手順が可視化されている。
- [ ] 削除または修正を伝播できる。

## 5. 検索プラン

```yaml
question:
intents:
  -
entities:
  - type:
    id:
time_scope:
  from:
  to:
  as_of:
channels:
  - fts
  - vector
  - graph
  - sql
  - api
filters:
required_graph_paths:
evidence_requirements:
  -
max_rounds:
deadline:
token_budget:
termination:
  no_progress_rounds:
  on_missing_evidence: partial
```

### クエリ形状とチャネル

| クエリ形状 | 優先チャネル |
|---|---|
| 番号、エラーコード、厳密な用語 | FTS / BM25 |
| 同義表現、概念、説明 | Vector |
| 所属、依存関係、パス、影響範囲 | Graph |
| 集計、グループ化、時間ウィンドウ | SQL / Analytics |
| 現在の注文、デプロイ、在庫 | Operational API / DB |

## 6. コンテキストパックマニフェスト

```yaml
pack_id:
task_id:
purpose:
as_of:
instruction_version:
goal_ref:
state_version:
evidence:
  - evidence_id:
tools:
  - name:
    version:
omissions:
  - candidate:
    reason:
token_allocation:
  instructions:
  task_state:
  evidence:
  tools:
  response_reserve:
built_at:
builder_version:
pack_hash:
```

### Packの不変条件

- [ ] 関連性：各項目が現在のタスクに寄与する。
- [ ] 認可：ユーザー、Agent、用途に対してアクセスが許可されている。
- [ ] 適時性：`as_of`、有効期間、Freshnessを満たす。
- [ ] 追跡可能性：ソース、バージョン、Locatorがある。
- [ ] 予算内：ポリシーに従って選択され、無作為に打ち切られていない。
- [ ] 評価可能性：Packを保存、再生、比較できる。

## 7. Graphクエリガード

| 制御 | 設定 |
|---|---|
| ノードAllowlist |  |
| リレーションAllowlist |  |
| 許可する方向とパステンプレート |  |
| 最大Hop |  |
| `LIMIT` |  |
| クエリタイムアウト |  |
| 読み取り専用トランザクション |  |
| Tenant / Object ACL |  |
| Valid Time条件 |  |
| コスト上限 |  |
| レスポンスSchema |  |

## 8. コンテキストトレース

最低限、次のイベントを記録します。

- `source_discovered`
- `retrieval_executed`
- `candidate_rejected`
- `evidence_transformed`
- `pack_built`
- `claim_generated`
- `answer_validated`

各拒否イベントには、Candidate ID、理由、ポリシー、または代替バージョンを含める必要があります。

## 9. 段階別評価

### Retriever

- Required Evidence Recall：
- Exact Match Recall：
- Multi-hop Path Accuracy：
- Temporal Retrieval Accuracy：

### Context Pack

- Context Precision：
- Provenance Completeness：
- Freshness Accuracy：
- ACL Violation Rate：
- Token Efficiency：
- Compression Fidelity：

### Answer

- Claim Evidence Coverage：
- Faithfulness：
- Citation Correctness：
- Epistemic Status Accuracy：
- Missing Evidence Disclosure：

## 10. 障害注入

- [ ] ベクトル検索が類似度の高い旧バージョンを返す。
- [ ] 正しいエビデンスが最初のTop-kに含まれていない。
- [ ] Graphのリレーションに`valid_to`がない。
- [ ] ドキュメントに間接的なPrompt Injectionが含まれている。
- [ ] Packが予算を超過する。
- [ ] 圧縮処理が否定語、金額、または時間を削除する。
- [ ] 現在のユーザーはマスキング済みの要約しか閲覧できない。
- [ ] 2つのソースが互いに矛盾する結論を示す。
- [ ] ドキュメントを削除した後もキャッシュまたはMemoryに残っている。
- [ ] 動的検索で2ラウンド連続して新しいエビデンスが得られない。

## 11. リリースゲート

- [ ] 重要なClaimの100%がEvidence IDに紐付けられている。
- [ ] ACL Violation Rateが0である。
- [ ] 旧バージョン、将来バージョン、削除済みのエビデンスがPackに含まれない。
- [ ] GraphクエリがSchema、Hop、時間、コストの制限を満たす。
- [ ] Packを保存して再生できる。
- [ ] Retriever、Pack、Answerの障害を個別に特定できる。
- [ ] 動的検索にラウンド数、時間、コスト、進捗なしの終了条件がある。
- [ ] 単純な2段階RAGと比較した効果が定量化されている。
