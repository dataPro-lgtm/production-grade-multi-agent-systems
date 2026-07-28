# 全編を貫くプロジェクト：CaseOps

CaseOps は、本書とは独立して保守されている、本番運用を志向したリファレンスシステムです。

[CaseOps コードリポジトリを開く](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops){ .md-button .md-button--primary }

本書とコードは、2 つのリポジトリに分けて管理しています。書籍リポジトリは、課題の説明、判断の導出、読書体験の構成を担い、コードリポジトリはランタイム、テスト、コンテナ、CI、セキュリティ、バージョンリリースを担います。本文から参照するのは検証済みの tag または commit のみであり、実態と乖離しやすいソースコードのスナップショットを複製することはありません。

## 安定版リリース

| 項目 | 値 |
|---|---|
| 章のマイルストーン | `chapter-10-slice-9` |
| リリースバージョン | `v1.0.0` |
| 固定 commit | `d52f0e0` |
| 実行方法 | Docker Compose |
| サービス | FastAPI、A2A HTTP+JSON、MCP Streamable HTTP、PostgreSQL 17、OTel Collector、Tempo、Prometheus、Grafana |
| ライセンス | MIT |

[CaseOps v1.0.0 正式リリースを見る](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0)

## 全 10 章に対応するシステム機能

### Slice 0：決定論的ベースライン

第 1 章の C-102 調査は、決定論的なドメインカーネルが実行します。

1. 認証結果からテナントの識別情報を取得します。
2. テナント境界内で案件を読み取ります。
3. 案件の提出時点で適用されるルールバージョンを固定します。
4. 不足書類を判定し、追加書類依頼の通知案を生成します。
5. 同一トランザクション内で、調査結果、監査イベント、Outbox イベントを保存します。

固定バージョンは [`chapter-01-slice-0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/tree/chapter-01-slice-0) です。このバージョンでは `ACCIDENT_CERTIFICATE` の不足を判定し、後続の Agent 化に向けた正確性、コスト、複雑性のベースラインを提供します。

### Slice 1：制御された Agent と MCP ツールインターフェース

第 2 章では、最初の制約付き Investigation Agent を追加します。

1. Planner は各ターンで、1 回のツール呼び出しまたは終端状態だけを提示します。
2. ランタイムは Schema、allowlist、scope、リスク、案件境界を検証します。
3. 独立した MCP Server が 4 つの読み取り専用ツールを公開します。
4. 短期タスクトークンは、テナント、タスク、主体、scope、audience にバインドされます。
5. すべての状態遷移とツール呼び出しが永続化されます。
6. timeout、回数制限付き retry、step budget、アクションフィンガープリントによって暴走を防止します。
7. 読み取り専用ツールは、クラッシュウィンドウから安全に復旧できます。
8. 非構造化データの「道路交通事故認定書」を `ACCIDENT_CERTIFICATE` に正規化します。

最終的な結論は `DOCUMENTS_COMPLETE_AFTER_NORMALIZATION` です。これはルールをモデルに置き換えるのではありません。Planner が次に何を調べるかを決め、ルールとエビデンスは引き続き決定論的なツールが提供します。

### Slice 2：ガバナンスされたマルチエージェント協調

第 3 章では、Slice 1 を機械的に 3 つ複製するのではなく、まず分離すべきコントロール境界を明確にします。

1. Supervisor が全体目標、期限、委任台帳、最終結果を所有します。
2. coverage、document、risk の 3 つの専門 Agent は、それぞれ制限された問いにのみ回答します。
3. A2A 1.0 は `DelegationTask` と `SpecialistResult` を伝送し、サーバー側でプロトコルの Task を永続化します。
4. 各 Agent は、タスクにバインドされた最小限の scope を持つ短期トークンを使用し、MCP 経由で事実を読み取ります。
5. Evidence Join は、quorum、必須専門家、エビデンスのプレフィックス、競合ルールによって決定論的に収束します。
6. 実行開始、3 つの委任完了、全体完了により、合計 5 つの CloudEvents 1.0 Outbox イベントが生成されます。
7. C-102 は高額で保険契約期間が短いため人手レビューを必要としますが、システムは保険金請求の拒否、凍結、通知を実行しません。

このフローでは、3 種類の状態を明確に区別します。A2A Task はプロトコルのライフサイクルを管理し、Delegated Task は業務委任を管理し、CloudEvent はサービス間の事実を管理します。最終結果は `COMPLETE_WITH_REVIEW_REQUIRED` であり、実行結果は `side_effect = none` です。

### Slice 3：ガバナンスされた Context Pack

第 4 章では、検索システムを Agent のコントロールプレーンに組み込みます。

1. Source Registry に Owner、分類、更新 SLA、Parser Version を登録します。
2. Knowledge Object は、ソースバージョン、有効期間、ACL、用途、Locator、コンテンツハッシュを保持します。
3. Planner に許可するのは、構造化クエリ、PostgreSQL 全文検索、明示的な Graph Path Template のみです。
4. 複数チャネルの候補は RRF で融合し、比較不可能な生スコアの混在を避けます。
5. Context Builder は Scope、用途、時点整合性、完全性、信頼性、重複排除、予算のゲートを適用します。
6. Evidence Sufficiency は必須エビデンス種別ごとに不足を計算し、追加検索を 2 ラウンドに制限します。
7. 3 つの重要な Claim は、すべて Context Pack 内の Evidence ID にバインドされます。
8. 過去のルールとプロンプトインジェクションを含む外部メールは決定論的に拒否され、Context Trace が保持されます。

`v1.0.0` の Hybrid Retrieval は、構造化クエリ、全文検索、グラフパスで構成されます。Vector Channel は型コントラクトに組み込まれていますが、実際のドメインコーパス、固定された Embedding バージョン、ACL ポリシー、再現可能な評価が整うまでは、デフォルトで有効になりません。

### Slice 4：実行可能な本番運用保証

第 5 章では、YAML を増やして本番運用対応に見せかけるのではなく、4 種類の保証を失敗可能な受け入れ検証として実装します。

1. API、A2A、MCP が W3C Trace Context を統一的に解析して伝播します。
2. 相対 timeout は入口で絶対 deadline に変換され、下流では残り時間のみを使用します。
3. startup、liveness、readiness を分離し、データベース障害とオプション依存関係の縮退では異なるセマンティクスを適用します。
4. OpenTelemetry Collector が Span を集約し、Tempo がサービス間の因果関係を再構築します。
5. Prometheus は低カーディナリティの SLI、記録ルール、実行可能なアラートを使用し、Grafana には運用ダッシュボードが事前設定されています。
6. 受け入れ検証では実際に A2A を停止し、API が稼働を継続しつつ readiness が縮退することを確認した後、サービスを復旧します。
7. PostgreSQL の custom-format バックアップには、revision、サイズ、SHA-256 を記載したマニフェストが付属します。
8. 隔離環境での復元では、ソースデータベースと復元データベースの内容署名を比較し、テナント `tenant-demo` の `C-102` に関する業務不変条件を検証します。

このローカルプラットフォームのスライスは、運用コントラクトが実行可能であることを証明します。ただし、単一マシンでの復旧時間やローカルのしきい値を、企業の本番 RTO / SLO として表現するものではありません。

### Slice 5：モデルの外側にあるセキュリティコントロールプレーン

第 6 章では、セキュリティ責任を別のモデルに委ねるのではなく、実行経路に決定論的な境界を維持します。

1. 5 つの読み取り専用ツールは、それぞれバージョン、定義ダイジェスト、scope、purpose、リソースタイプ、分類、リスク、副作用にバインドされます。
2. MCP ツールは実行前に、デフォルト拒否の ToolGuard を必ず通過します。
3. 有効な権限は、ユーザー、ワークロード、今回の委任 scope の共通部分です。
4. 短期トークンは、tenant、task、audience、workload、purpose、case resource にバインドされます。
5. ツール定義、scope、リスク宣言にドリフトがある場合は、実行を拒否します。
6. 許可と拒否のすべてをダイジェスト化されたセキュリティ監査に記録し、Prompt、引数、ツールペイロードは複製しません。
7. OutputGuard はメールアドレスと電話番号を最小化し、合成 canary secret と未承認の Restricted データをブロックします。
8. バージョン管理された 11 個のレッドチームサンプルと、実際の悪意ある協調目標 1 件により、権限を逸脱する副作用がゼロであることを検証します。

これらのエビデンスが対象とするのは、`v1.0.0` で宣言された実装境界のみです。リポジトリは、開発用の HS256 タスクトークンを企業 IdP と称することも、正規表現による検出を完全な DLP と称することもありません。

### Slice 6：レイヤー化されたシステム統合と Runtime Context Graph

第 7 章では、新たな「万能 Agent」を追加するのではなく、既存の Context Team と Collaboration Team を、受け入れ検証可能な 1 つのシステムに統合します。

1. Central Supervisor が 3 ステップの非巡回 DAG を作成して検証します。
2. Context Team が Context Pack と、エビデンスにバインドされた主張を提供します。
3. Collaboration Team が実際の A2A → MCP フローを通じて Coverage、Document、Risk をスケジューリングします。
4. システム Reducer が、ルールバージョン、書類状態、リスクゲート、エビデンス、副作用を照合します。
5. `system_runs` と `system_steps` が、親子実行、依存関係、試行、結果の要約を永続化します。
6. Runtime Context Graph が Goal、Plan、Step、Task、Claim、Evidence、Acceptance、Result を接続します。
7. グラフには参照、分類、SHA-256 ダイジェストのみを保持し、生の Prompt と業務ペイロードは複製しません。
8. 同一の冪等キーでリプレイしても、システム実行、子実行、来歴グラフが重複して作成されることはありません。

C-102 は 7 項目のシステムチェックに合格し、最終結果は `SYSTEM_ACCEPTED_WITH_HUMAN_REVIEW` です。これは、人手レビューが必須ゲートであることをシステムが証明したという意味であり、システムが外部アクションを実行したという意味ではありません。

### Slice 7：Golden Dataset とシステムレベルのリリースゲート

第 8 章では、評価用の簡略化された経路を別途作るのではなく、Slice 6 の実際の API、A2A → MCP 協調フロー、PostgreSQL、Runtime Context Graph を直接回帰テストします。

1. Golden Dataset、Quality Contract、v0.7.0 Baseline はそれぞれバージョン管理されます。
2. 5 種類のシナリオで、13 回の独立した HTTP 実行を行います。
3. コントラクト、結果、経路、エビデンス、セキュリティ、効率性の 6 レイヤーを個別に採点します。
4. 成功した各実行で、3 ステップの DAG、7 項目の受け入れ検証、Claim → Evidence グラフの不変条件を検証します。
5. 別テナントが成功した各実行の Context Graph にアクセスした場合は、必ず 404 が返されなければなりません。
6. N-run は、実行の識別情報とタイムスタンプを除外したセマンティックフィンガープリントの一貫性を確認します。
7. Candidate と Baseline を Case ごと、Layer ごとにペア比較し、ハードゲート間の相殺は認めません。
8. CI は、各 Trial の診断結果とリリース判定を JSON Artifact として保存します。

Conformance 実行器は決定論的です。この 13 回の実行は、コントロールプレーンとシステム経路の安定性を検証するものであり、実際の確率的モデルに関する母集団評価を装うものではありません。

### Slice 8：インシデントエビデンス、リソース帰属、復旧検証

第 9 章では、ログを自由に読む「インシデント分析 Agent」を追加するのではなく、運用診断を明示的かつ冪等で、テナント分離された永続化プロダクトとして実装します。

1. 終端状態に到達したシステム実行だけが `caseops.operational-assessment.v1` を生成できます。
2. レポートは、影響、事実に基づくタイムライン、最初の障害点、エビデンス一覧、リソース帰属、制御に関する提案、バージョンスナップショットを固定項目として含みます。
3. 診断では、`system_runs`、`system_steps` から `collaboration_runs`、`delegated_tasks` までドリルダウンします。
4. Incident Bundle は参照、ダイジェスト、数量のみを保存し、Prompt、ツール引数、業務ペイロードは複製しません。
5. ステップ試行、Context Run、委任試行、セキュリティ判定を個別に記録し、単位の異なる値を合算しません。
6. token 使用量とバージョン管理された料金表がない場合、金額コストは明示的に `null` とします。
7. GameDay では実際に A2A を停止し、3 つの委任タスクが制御された形で失敗すること、最初の障害が協調レイヤーにあること、外部への副作用が 0 であることを検証します。
8. A2A の復旧後に新たなシステム実行を行い、健全性評価を再び得られなければなりません。
9. CI は、ベースライン、インシデント、復旧の 3 つの評価で構成される、バージョン管理された JSON エビデンスを保存します。

1 回の実測では、3 件の運用評価、12 件のリソースコストイベント、3 件の監査記録が残りました。エンジニアリングテストは 62 項目すべてに合格し、ブランチカバレッジを含むカバレッジは 85.99% でした。

### Slice 9：クリーン環境での再現と検証可能なリリース

第 10 章では、業務 Agent を追加し続けるのではなく、ソースコードから利用者までのデリバリーエビデンスチェーンを完成させます。

1. Python ベースイメージを不変 digest に固定し、ランタイム依存関係と開発依存関係をそれぞれハッシュ付きロックファイルで制約します。
2. 最終審査では、commit 済みの `git archive HEAD` だけからビルドし、`.env`、ローカルデータベース、キャッシュ、過去のレポートは読み取りません。
3. クリーンイメージで UID 10001、パッケージバージョン、OCI version、ソース revision、マイグレーションヘッドを検証します。
4. Syft が実際の実行イメージをスキャンし、SPDX 2.3 JSON SBOM を生成します。
5. Release Evidence Manifest が、Commit、イメージ Digest、OpenAPI、評価、GameDay、SBOM、ファイルダイジェストをバインドします。
6. GitHub Release Workflow がすべてのゲートを再実行した後、GHCR イメージとダウンロードパッケージをプッシュします。
7. イメージにはビルド来歴と SBOM Attestation が付与され、ダウンロードパッケージには独立した来歴 Attestation が付与されます。
8. `gh attestation verify` と `SHA256SUMS` により、利用者は作者の口頭説明に頼ることなく、来歴と完全性を検証できます。

このスライスは境界を明確に保ちます。SBOM は脆弱性レポートではなく、Attestation もセキュリティ認証ではありません。これらにより「何が含まれているか」と「どこからビルドされたか」を検証可能にしますが、残存リスクを受け入れるかどうかは、引き続き利用者と業務 Owner が判断します。

## すべての受け入れ検証を実行する

```bash
git clone https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops.git
cd production-grade-multi-agent-caseops
git checkout v1.0.0

docker compose up --build --wait --wait-timeout 120 -d
make acceptance-chapter-08
make acceptance-chapter-09
make acceptance-chapter-10
```

3 つの最終ゲートは順に、システム品質、インシデントからの復旧、クリーン環境でのデリバリーを証明します。第 10 章が成功した場合の終端状態は次のとおりです。

```text
clean-room runtime import accepted
chapter 10 accepted: clean archive -> pinned image -> non-root runtime
-> SPDX SBOM -> checksummed release evidence
```

詳細なコマンド、エビデンス一覧、利用者向け検証手順については、[第 10 章ランブック](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/blob/v1.0.0/docs/chapter-10-runbook.md)を参照してください。インシデント診断と復旧は、引き続き `make acceptance-chapter-09` で個別に実行できます。

## リファレンス実装のエンジニアリング境界

CaseOps は、コンポーネント数によって「本番運用級」であることを証明するのではありません。失敗可能でレビュー可能なエンジニアリング上の責務によって、本書の結論を支えます。

- **ドメインと状態**：FastAPI、PostgreSQL、Alembic、テナント境界、冪等性、監査、トランザクショナル Outbox。
- **Agent の実行**：明示的なステートマシン、Checkpoint、ツール実行台帳、MCP Streamable HTTP、A2A Task。
- **コンテキストとセキュリティ**：Source Registry、全文検索とグラフ検索、Context Pack、Tool Guard、Output Guard、レッドチーム回帰テスト。
- **本番運用**：非 root コンテナ、ヘルスコントラクト、W3C Trace Context、Prometheus、Tempo、依存関係の縮退、隔離環境での復元。
- **品質と運用管理**：Golden Dataset、レイヤー別 Grader、N-run、運用評価、Incident Bundle、GameDay。
- **リリースとサプライチェーン**：ハッシュ付きロックファイル、固定ベースイメージ、クリーンな Git アーカイブ、SPDX SBOM、Release Evidence、Artifact Attestation。

`v1.0.0` では制限事項も明確に宣言しています。企業向け ID 連携、キャパシティ認証、PITR、リージョン間の災害復旧、実際のモデルに関する母集団評価、完全な DLP は提供しません。公開されたコントラクトが対象とするのは、すでに実装され、エビデンスが残されている機能だけです。

## 全 10 章で 1 つのリポジトリを共有する方法

`main` は常に実行可能な状態に保ち、各章で不変のマイルストーン tag をリリースします。読者は tag ごとにシステムの進化を追うことも、`v1.0.0` で完全かつ安定した実装を利用することもできます。

| 章 | 主なコード差分 |
|---|---|
| 1 | 決定論的ドメインカーネル、API、トランザクション、監査、Outbox |
| 2 | ツール用ステートマシン、MCP、timeout、サーキットブレーカー、読み取り専用処理の復旧 |
| 3 | Supervisor、委任、並列処理、Join Contract |
| 4 | Context Pipeline、Hybrid / Agentic RAG、GraphRAG、エビデンス |
| 5 | プラットフォーム化されたデプロイ、テレメトリ、SLO、復旧 |
| 6 | Tool Guard、権限の共通部分、プライバシー情報の開示、セキュリティ監査、レッドチーム |
| 7 | レイヤー化された DAG、チーム統合、システム受け入れ検証、Runtime Context Graph |
| 8 | Golden Dataset、N-run、継続的回帰テスト |
| 9 | AgentOps、インシデント診断、コストガバナンス |
| 10 | Clean-room 受け入れ検証、SBOM、リリース来歴証明 |
