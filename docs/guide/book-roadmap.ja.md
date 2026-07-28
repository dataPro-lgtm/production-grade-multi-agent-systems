# 本書の全体構成

全10章は、一つのエンジニアリングチェーンに沿って展開します。各章では、決して省略できない一つの問いに答え、その結論をレビュー可能な契約、コード、実行エビデンスへ落とし込みます。

<div class="book-spine" aria-label="本書を貫く知識の流れ">
  <span>判断</span><b>→</b>
  <span>実行</span><b>→</b>
  <span>協調</span><b>→</b>
  <span>エビデンス収集</span><b>→</b>
  <span>稼働</span><b>→</b>
  <span>防御</span><b>→</b>
  <span>統合</span><b>→</b>
  <span>評価</span><b>→</b>
  <span>運用</span><b>→</b>
  <span>デリバリー</span>
</div>

## 第1部：アーキテクチャ判断と実行制御 { #part-one }

まずシステムに自律性が必要かを判断し、次にモデルが提案したアクションを制御されたランタイムで実行します。最後に、複数の Agent 間における制御権と状態の所有権を扱います。

<div class="chapter-grid">

<a class="chapter-card" href="../chapters/01-what-is-an-ai-agent/">
  <span class="chapter-card__number">01</span>
  <h3>Agent の本質とアーキテクチャ境界</h3>
  <p>通常のコード、LLM ワークフロー、単一 Agent、マルチエージェントを区別し、動的ルーティングと実行の自律性をどこまで許容するかを決定します。</p>
  <small>成果物：Agent 判断フレームワーク、自律性境界マトリクス、ADR</small>
</a>

<a class="chapter-card" href="../chapters/02-tool-calling-state-machine-and-mcp/">
  <span class="chapter-card__number">02</span>
  <h3>ツール呼び出し：ステートマシン、コントロールプレーン、MCP</h3>
  <p>Tool Call をモデルからの提案で終わらせず、認可可能かつ復旧可能で、監査でき、同じ副作用を繰り返し発生させない実行へ変換します。</p>
  <small>成果物：Tool Contract、ステートマシン、Checkpoint、MCP 境界</small>
</a>

<a class="chapter-card" href="../chapters/03-multi-agent-patterns-collaboration-and-incident-response/">
  <span class="chapter-card__number">03</span>
  <h3>マルチエージェント協調：アーキテクチャパターン、プロトコル、インシデント対応</h3>
  <p>制御権、責任、状態、失敗セマンティクスに基づいて、Handoff、Supervisor、Router、Fan-out、Join を選択します。</p>
  <small>成果物：パターン決定記録、委任契約、決定論的 Join</small>
</a>

</div>

## 第2部：信頼できるコンテキストと本番運用の保証 { #part-two }

エビデンスとしての要件を満たす情報だけをシステムに使用させ、インフラストラクチャに障害が発生したときやモデルが誤誘導されたときにも、ビジネス上の境界を守れるようにします。

<div class="chapter-grid">

<a class="chapter-card" href="../chapters/04-context-engineering-agentic-rag-and-graphrag/">
  <span class="chapter-card__number">04</span>
  <h3>コンテキストエンジニアリング：Agentic RAG、GraphRAG、エビデンスチェーン</h3>
  <p>クエリ、ハイブリッド検索、関係性のエビデンス、権限、時間的整合性、引用をガバナンスし、コンテキストを追跡可能なランタイムプロダクトにします。</p>
  <small>成果物：コンテキストパック、検索ゲート、GraphRAG エビデンスパス</small>
</a>

<a class="chapter-card" href="../chapters/05-production-infrastructure-observability-and-recovery/">
  <span class="chapter-card__number">05</span>
  <h3>本番基盤：デプロイ、オブザーバビリティ、障害復旧</h3>
  <p>状態の所有権、ヘルスセマンティクス、テレメトリの相関、信頼性を守る仕組み、復旧順序を明確にし、「起動できる」状態を運用上の保証へ変えます。</p>
  <small>成果物：本番稼働準備契約、SLO、復旧演習とエビデンス</small>
</a>

<a class="chapter-card" href="../chapters/06-agent-security-tool-guard-privacy-and-red-teaming/">
  <span class="chapter-card__number">06</span>
  <h3>Agent セキュリティ：多層防御、Tool Guard、レッドチーム検証</h3>
  <p>モデルが失敗する可能性を前提とし、アイデンティティ、権限の積集合、リソースバインディング、データ開示、レッドチーム回帰テストによって、実際の影響を限定します。</p>
  <small>成果物：Tool Guard、セキュリティ監査、プライバシーライフサイクル、レッドチームエビデンス</small>
</a>

</div>

## 第3部：システム統合と継続的デリバリー { #part-three }

分散したコンポーネントを一つの因果チェーンに統合し、評価と本番運用によって継続的に検証します。最終的には、再現可能で追跡可能かつ保守可能なシステムとしてデリバリーします。

<div class="chapter-grid chapter-grid--four">

<a class="chapter-card" href="../chapters/07-layered-multi-agent-supervisor-a2a-mcp-context-graph/">
  <span class="chapter-card__number">07</span>
  <h3>システム統合：Supervisor、A2A、MCP、Context Graph</h3>
  <p>目標、計画、委任、ツール、状態、エビデンス、エラー、復旧の各セマンティクスを一貫してつなぎ、エンドツーエンドで受け入れ検証できるシステムを構築します。</p>
  <small>成果物：レイヤー化アーキテクチャ、Context Graph、システム統合契約</small>
</a>

<a class="chapter-card" href="../chapters/08-multi-agent-evaluation-golden-dataset-and-continuous-regression/">
  <span class="chapter-card__number">08</span>
  <h3>品質エンジニアリング：Golden Dataset、レイヤー別評価、継続的回帰テスト</h3>
  <p>Goal から Answer までの完全な因果チェーンを評価し、決定論的チェック、Judge、N-run、ゲートによってランダム性を制御します。</p>
  <small>成果物：Golden Dataset、レイヤー別指標、継続的回帰テストのゲート</small>
</a>

<a class="chapter-card" href="../chapters/09-agentops-incident-diagnosis-resilience-and-continuous-optimization/">
  <span class="chapter-card__number">09</span>
  <h3>AgentOps：インシデント診断、システムレジリエンス、コストガバナンス</h3>
  <p>ユーザー目標を軸にインシデントの因果チェーンを再構築し、監査可能な制御、復旧、コスト帰属、継続的な最適化を実行します。</p>
  <small>成果物：目標単位の SLO、Incident Bundle、GameDay、ORR</small>
</a>

<a class="chapter-card" href="../chapters/10-capstone-system-acceptance-and-open-source-delivery/">
  <span class="chapter-card__number">10</span>
  <h3>システムデリバリー：受け入れ検証エビデンス、Release Gate、オープンソースガバナンス</h3>
  <p>要件のトレーサビリティからクリーンな環境での再現までを実現し、さらに SBOM、ビルド来歴、ガバナンスファイルによって公開デリバリーを完了します。</p>
  <small>成果物：Evidence Package、Release Gate、検証可能な v1.0</small>
</a>

</div>

## 全編を貫くプロジェクト：CaseOps

本書全体を通して、一つの複合的な保険金請求ケースを使用します。案件 `C-102` が完了していない理由を調査し、不足している書類と適用されるルールを確認します。顧客への連絡が必要な場合は、下書きの生成だけが許可され、自動送信は禁止されます。

CaseOps は決定論的なドメインカーネルから出発し、ツールのステートマシン、マルチエージェント協調、ガバナンスされたコンテキスト、本番運用の保証、セキュリティ制御、システム評価、AgentOps、検証可能なリリースを順に備えていきます。完全な実装は、独立した [CaseOps コードリポジトリ](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops) で管理されており、正式版は [`v1.0.0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0) です。

[読み始める](../chapters/01-what-is-an-ai-agent.md){ .md-button .md-button--primary }
[CaseOps を実行する](caseops-project.md){ .md-button }
[エンジニアリングテンプレートを見る](../toolkit/agent-definition-card.md){ .md-button }
