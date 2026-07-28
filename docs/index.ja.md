<div class="book-home" markdown>

<section class="book-hero" markdown>

<div class="book-hero__content" markdown>
<p class="book-kicker">オープンソース技術書 · 全10章の完全版</p>

# プロダクショングレード・マルチエージェントシステム

<p class="book-subtitle">アーキテクチャ判断からエンジニアリング実装まで</p>
<p class="book-lead">本書が扱うのは、Agent の一群を短期間で組み上げる方法ではありません。目標、権限、状態、コンテキスト、エビデンス、障害境界を、検証可能な本番運用システムとしてどのように構成するかを論じます。全10章を通じて一貫したエンジニアリングの流れをたどり、Agent が必要かどうかという判断から、評価、運用、公開リリースまでを扱います。</p>
<div class="book-actions">
<a class="md-button md-button--primary" href="chapters/01-what-is-an-ai-agent/">読み始める</a>
<a class="md-button" href="guide/book-roadmap/">全体を見る</a>
<a class="md-button" href="guide/caseops-project/">CaseOps を実行する</a>
</div>
<p class="book-meta">全10章の本文 · オリジナルのアーキテクチャ図68点 · エンジニアリングテンプレート10点 · 実行可能なリファレンスシステム1式</p>
</div>
<div class="book-hero__visual" aria-hidden="true"></div>

</section>

## 一つの判断から始める

多くの Agent プロジェクトは、フレームワーク、ロール、Prompt から始まります。本書では、その順序を逆にします。まず、どの経路で動的な意思決定が必要か、どの状態を決定論的システムが所有すべきか、どの副作用はモデルがどれほど確信していても権限を越えて実行してはならないかを確認します。責任境界が成立して初めて、Agent の追加が正味の価値をもたらし得ます。

<div class="book-grid book-grid--four">
  <article class="book-card">
    <span class="book-card__index">01</span>
    <h3>アーキテクチャ判断</h3>
    <p>ワークフロー、単一 Agent、マルチエージェントを区別し、自律性の範囲と実質的な分割境界を定めます。</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">02</span>
    <h3>制御された実行</h3>
    <p>ツール、状態、コンテキスト、権限、復旧セマンティクスを実行可能な契約として定義します。</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">03</span>
    <h3>本番運用の保証</h3>
    <p>デプロイ、オブザーバビリティ、セキュリティ、評価、AgentOps の運用サイクルを確立します。</p>
  </article>
  <article class="book-card">
    <span class="book-card__index">04</span>
    <h3>検証可能なデリバリー</h3>
    <p>第三者がシステムを再現し、エビデンスを追跡し、リリース成果物の出所を検証できるようにします。</p>
  </article>
</div>

## 本書の構成

<div class="book-grid book-grid--parts">
  <article class="part-card">
    <p class="part-card__label">第1部 · 第01〜03章</p>
    <h3>アーキテクチャ判断と実行制御</h3>
    <p>Agent の本質を理解し、ツール呼び出しのコントロールプレーンを構築したうえで、マルチエージェントにおける制御権、状態の所有権、協調契約を扱います。</p>
    <a href="guide/book-roadmap/#part-one">この部を見る →</a>
  </article>
  <article class="part-card">
    <p class="part-card__label">第2部 · 第04〜06章</p>
    <h3>信頼できるコンテキストと本番運用の保証</h3>
    <p>検索結果をエビデンスとしてガバナンスし、サービス提供と復旧が可能で、攻撃の影響を抑制できる本番運用基盤をシステムに構築します。</p>
    <a href="guide/book-roadmap/#part-two">この部を見る →</a>
  </article>
  <article class="part-card">
    <p class="part-card__label">第3部 · 第07〜10章</p>
    <h3>システム統合と継続的デリバリー</h3>
    <p>Agent 間の因果チェーンを接続し、評価と AgentOps によって継続的に検証し、最終的に再現可能で保守可能な公開成果物を作り上げます。</p>
    <a href="guide/book-roadmap/#part-three">この部を見る →</a>
  </article>
</div>

## 全編を貫く CaseOps

CaseOps は、本書とは独立して保守されている、本番運用を重視したリファレンスシステムです。保険金請求案件 `C-102` を題材に、案件が完了していない理由を調査し、不足資料と適用ルールを確認します。顧客への連絡が必要な場合も、下書きの生成だけを行い、自動送信はしません。

この業務フローには、動的な調査、複数ソースのエビデンス、テナント分離、承認境界、長時間実行タスク、障害復旧、品質検証が含まれています。読者は [`v1.0.0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0) でシステム全体を実行できるほか、各章のタグを使って、それぞれの機能が必要になった理由を確認できます。

[CaseOps 実行ガイドを見る](guide/caseops-project.md){ .md-button .md-button--primary }
[コードリポジトリを開く](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops){ .md-button }

## 読了後にできるようになること

<div class="book-outcomes" markdown>

- 説明可能な基準を用いて、ある問題に Agent が必要か、またマルチエージェントに分割する価値があるかを判断できます。
- Tool Contract、ステートマシン、協調プロトコル、Context Pack、安全な実行境界を設計できます。
- デプロイ、オブザーバビリティ、復旧、セキュリティ、評価、本番運用を網羅した本番運用保証を確立できます。
- ADR、Golden Dataset、Evidence Package、Release Gate を用いてアーキテクチャ判断を支えられます。
- クリーンな環境でマルチエージェントシステムを構築・検収し、リリースの出所を検証できます。

</div>

!!! info "原則を優先し、フレームワークから分離する"
    LangGraph、AutoGen、CrewAI などのフレームワークは今後も変化し続けます。本書では、より安定したアーキテクチャ上の責任、エンジニアリング契約、検証手法を優先して扱います。これにより、モデル、プロトコル実装、オーケストレーションフレームワークを変更した後も、これらの判断は有効であり続けます。

<div class="book-closing">
  <p>初めて体系的に学ぶ場合は、第1章から順に読むことをお勧めします。具体的な問題の解決に取り組んでいる場合は、読書ガイドから直接該当箇所に進めます。</p>
  <a class="md-button md-button--primary" href="chapters/01-what-is-an-ai-agent/">第01章から始める</a>
  <a class="md-button" href="guide/reading-path/">読書ガイドを見る</a>
</div>

</div>
