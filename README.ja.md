# 『プロダクショングレード・マルチエージェントシステム：アーキテクチャ判断からエンジニアリング実装まで』

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md)

[![Open Book](https://img.shields.io/badge/在线阅读-Open%20Book-173a63)](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/)
[![Book Build](https://github.com/dataPro-lgtm/production-grade-multi-agent-systems/actions/workflows/pages.yml/badge.svg)](https://github.com/dataPro-lgtm/production-grade-multi-agent-systems/actions/workflows/pages.yml)
[![CaseOps](https://img.shields.io/badge/CaseOps-v1.0.0-2f7d67)](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-d97706)](LICENSE)

AIエンジニア、アーキテクト、プラットフォームチーム、セキュリティチーム、技術リーダーを対象としたオープンソースの書籍です。簡体字中国語、英語、日本語の完全版を提供しています。

本書は、ひとつの基本的な問いから始まります。システムのどの部分が、環境からのフィードバックに応じて次の行動を自律的に決める必要が本当にあるのでしょうか。この問いを軸に、全10章で制御されたツール呼び出し、マルチエージェント協調、コンテキストエンジニアリング、本番基盤、セキュリティ、システム統合、評価、AgentOps、検証可能なデリバリーを順に扱います。

[简体中文](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/) ·
[English](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/en/) ·
[日本語](https://datapro-lgtm.github.io/production-grade-multi-agent-systems/ja/) ·
[全書構成](docs/guide/book-roadmap.md) ·
[読書ガイド](docs/guide/reading-path.md) ·
[CaseOps実行ガイド](docs/guide/caseops-project.md)

## 全書の構成

| パート | 章 | 解決する問い |
|---|---|---|
| アーキテクチャ判断と実行制御 | 01—03 | Agentは必要か、モデルを安全に行動させるにはどうすればよいか、複数のAgentを確実に協調させるにはどうすればよいか |
| 信頼できるコンテキストと本番運用の保証 | 04—06 | モデルは何を根拠に行動するのか、システムをどのように運用・復旧し、セキュリティ上の影響を抑えるのか |
| システム統合と継続的デリバリー | 07—10 | コンポーネントをどのようにシステムへ統合し、品質をどう証明し、本番稼働後にどう運用してオープンに提供するのか |

全章一覧：

1. Agentの本質とアーキテクチャ境界
2. ツール呼び出し：ステートマシン、コントロールプレーン、MCP
3. マルチエージェント協調：アーキテクチャパターン、プロトコル、インシデント対応
4. コンテキストエンジニアリング：Agentic RAG、GraphRAG、エビデンスチェーン
5. 本番基盤：デプロイ、オブザーバビリティ、障害復旧
6. Agentセキュリティ：多層防御、Tool Guard、レッドチーム検証
7. システム統合：Supervisor、A2A、MCP、Context Graph
8. 品質エンジニアリング：Golden Dataset、レイヤー別評価、継続的回帰テスト
9. AgentOps：インシデント診断、システムレジリエンス、コストガバナンス
10. システムデリバリー：受け入れ検証エビデンス、リリースゲート、オープンソースガバナンス

## 全編を通じて扱うプロジェクト

[CaseOps](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops)は、本書の独立したリファレンス実装です。保険金請求案件の調査を題材に、業務フロー全体を構築し、本書で扱うTool Contract、MCP、A2A、Context Graph、Tool Guard、Golden Dataset、AgentOps、リリースエビデンスを、ひとつの実行可能なシステムに実装しています。

正式リリースの[`v1.0.0`](https://github.com/dataPro-lgtm/production-grade-multi-agent-caseops/releases/tag/v1.0.0)では、次を提供します。

- 依存関係とベースイメージのダイジェストを固定
- 非rootコンテナとクリーン環境での再ビルド
- ユニット、統合、プロトコル、セキュリティ、評価、GameDayの各ゲート
- SPDX SBOM、Release Evidence Manifest、SHA-256検証
- GHCRイメージと、検証可能なビルドプロベナンス証明

本書は、概念、原理、トレードオフ、判断方法を明確に説明します。CaseOpsは、契約を実装し、障害を注入して、実行エビデンスを提供します。両者は別々のリポジトリで管理し、固定したバージョンで相互参照します。

## 付属のエンジニアリング資料

本リポジトリでは、68点のオリジナルアーキテクチャ図と、再利用可能な10点のエンジニアリングテンプレートを提供します。内容は次のとおりです。

- Agent定義カード、アーキテクチャ決定記録、マルチエージェントパターン決定記録
- Context Engineeringキャンバス、本番対応とセキュリティレビューの契約
- システム統合、継続的評価、AgentOps、オープンソースデリバリーの契約

アーキテクチャ図は編集可能なSVGとWeb向けPNGの両方を用意し、一貫したアーキテクト向けホワイトボードスタイルを採用しています。

## ローカルで読む

Python 3.10以降が必要です。

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
mkdocs serve
```

ブラウザで`http://127.0.0.1:8000`を開き、ページ上部の言語セレクターから简体中文、English、日本語を切り替えます。

コミット前に厳格な検証を実行します。

```bash
./scripts/validate.sh
```

## リポジトリ構成

```text
.
├── docs/
│   ├── chapters/            # 全10章の正式本文
│   ├── guide/               # 全書構成、読書ガイド、CaseOpsガイド
│   ├── toolkit/             # 再利用可能なエンジニアリング契約とチェックリスト
│   ├── appendices/          # 用語集、ライセンス、参考文献
│   └── assets/              # 3言語のSVG、PNG、サイトスタイル
├── i18n/                    # 用語規則、図版の翻訳、バージョン同期チェックリスト
├── sources/                 # 原資料とバージョン来歴
├── scripts/                 # コンテンツ、図版、ビルドの検証
├── .github/                 # コントリビューションフローと自動公開
└── mkdocs.yml               # サイト設定
```

## コントリビューション

誤記の修正、ケース、図解、エンジニアリング上の改善を歓迎します。最初に[コントリビューションガイド](CONTRIBUTING.md)をお読みください。コードに関するコントリビューションでは、実際のファイルパス、実行方法、失敗経路、検証エビデンスを提示してください。

翻訳へのコントリビューションは、[Translation Guide](i18n/TRANSLATION_GUIDE.md)に従ってください。中国語版を内容の正本とし、英語ファイルには`.en.md`、日本語ファイルには`.ja.md`の接尾辞を使用します。3言語版すべてで、構造、リンク、図版、バージョン同期の検証に合格する必要があります。

## ライセンスと著者

本書の本文、図表、付属資料には[CC BY 4.0](LICENSE)ライセンスを適用します。複製、共有、改変する場合は、適切なクレジットを表示してください。第三者の資料には、それぞれのライセンスが適用されます。

著者：DataDan
