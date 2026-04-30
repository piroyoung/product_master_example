# お客様デモガイド

このドキュメントは、Microsoft エンジニアがお客様向けに Azure AI Search の商品マスタ検索デモを実施するためのガイドです。

## デモの位置づけ

このデモは、商品マスタ、カタログ、部品表、問い合わせナレッジ、社内業務データなどを「ユーザーが素早く見つけられるようにしたい」という相談に対して、Azure AI Search を検索レイヤーとしてどう組み込めるかを説明するためのものです。

商品マスタの元データはアプリ内で生成しています。これはデモをシンプルに保つためであり、本番では ERP、PIM、MDM、SQL Database、Data Lake、API などの既存システムを source of truth として扱います。

## 一番伝えたいメッセージ

Azure AI Search は、既存の商品マスタを置き換えるデータベースではなく、検索に最適化されたインデックスです。基幹システムやマスタデータ管理システムから検索用ドキュメントを同期し、業務アプリに高速で使いやすい検索体験を追加できます。

## 事前チェックリスト

- Live app を開く: https://ca-product-search-demo-rbwwno.braveriver-06d53d2c.japaneast.azurecontainerapps.io/
- `/api/health` が `{"status":"ok"}` を返すことを確認する。
- `トマト` で検索し、結果サマリに `インデックス 5000 件` が表示されることを確認する。
- `FD-DRK` で検索し、商品コード prefix 検索が動作することを確認する。
- GitHub リポジトリを開ける状態にする: https://github.com/piroyoung/product_master_example
- Azure Portal を見せる場合は、次のブレードを事前に開いておく。
  - Azure Container Apps
  - Azure Container Registry
  - Azure AI Search
  - Managed Identity / Access control
  - Application Insights または Log Analytics

## デモシナリオ

想定シナリオは、食品小売、卸、メーカーなどで、多数の商品マスタを扱う業務です。オペレーターは、商品名、カナ、ブランド、カテゴリ、タグ、アレルゲン、商品コードなどから素早く商品を探したい、という前提です。

このアプリで示すこと:

1. 業務アプリらしい検索 UI。
2. 約 5,000 件の商品マスタ。
3. Azure AI Search による検索実行。
4. Azure Container Apps によるシンプルなコンテナホスティング。
5. Managed Identity と GitHub OIDC による passwordless な認証。

## 推奨デモフロー

### 1. 業務課題から入る

商品マスタ検索では、単純な SQL の `LIKE` 検索だけでは使い勝手が不足しがちです。たとえば、利用者は次のような複数の観点で検索します。

- 商品名: `トマトジュース`
- カナ: `トマト`
- ブランド: `Green Farm`
- カテゴリ: `飲料`
- タグ: `有機`, `無塩`, `冷凍`
- 社内商品コード: `FD-DRK-001`

ここで、Azure AI Search を「既存マスタの横に置く検索専用レイヤー」として紹介します。

### 2. アプリを見せる

Live app を開き、次を説明します。

- Fluent UI による業務アプリ風 UI。
- 入力に応じて検索するインクリメンタル検索。
- 最大 100 件を表示するテーブル形式の検索結果。
- 商品コード、商品名/カナ、ブランド、カテゴリ、規格、価格、タグ、アレルゲン、score の表示。
- 約 5,000 件のインデックスが使われていること。

### 3. 日本語検索を見せる

次の検索語を使うと説明しやすいです。

| 検索語 | 説明ポイント |
| --- | --- |
| `トマト` | 商品名や説明文に含まれる日本語検索 |
| `有機` | タグや商品名に含まれる属性検索 |
| `カレー` | レトルト食品の検索 |
| `沖縄` | 産地やバリエーションを含む検索 |

### 4. 商品コード検索を見せる

次のような商品コード prefix を検索します。

```text
FD-DRK
FD-CND
FD-RTD
```

ハイフンを含むコードは、通常のテキスト解析では期待通りに検索できない場合があります。このデモでは hidden field の `codeSearch` を使い、ハイフンあり/なしの検索を扱いやすくしています。

### 5. アーキテクチャを説明する

[アーキテクチャと運用ガイド](architecture-and-operations.md) の図を使い、次の流れで説明します。

1. React UI がサーバー側 API route を呼び出す。
2. API route が Azure AI Search の index を準備する。
3. 商品ドキュメントを Azure AI Search に同期する。
4. インクリメンタル検索のたびに Azure AI Search へクエリする。
5. Container Apps は Managed Identity で Azure AI Search にアクセスする。
6. GitHub Actions は OIDC で Azure にログインし、シークレットなしでデプロイする。

### 6. CI/CD とセキュリティを見せる

GitHub Actions を開き、次を説明します。

- CI は typecheck、build、Docker build、Bicep build を実行。
- CD は `v0.3.1` のようなタグ発行で起動。
- CD は GitHub OIDC で Azure にログイン。
- ACR に image を push し、Container Apps を更新。
- GitHub に Azure client secret を保存していない。

### 7. お客様固有の設計に接続する

最後に、次の質問でお客様環境への展開に話を進めます。

- 商品マスタの source of truth はどこにありますか。
- 更新頻度はリアルタイム、日次、随時のどれですか。
- 検索対象は商品だけですか。店舗、在庫、FAQ、仕様書も含めますか。
- 検索結果にフィルターやファセットは必要ですか。
- 閉域網、Private Endpoint、監査ログなどの要件はありますか。

## 話すと効果的なポイント

| テーマ | メッセージ |
| --- | --- |
| Search relevance | Azure AI Search ではフィールド重み付けや analyzer を調整できます。このデモでは商品名、商品コード、カナ、タグを強めています。 |
| 日本語対応 | 商品名、カナ、ブランド、カテゴリ、タグ、説明文に日本語 analyzer を設定しています。 |
| セキュリティ | アプリは Managed Identity、CI/CD は OIDC を利用します。検索キーや client secret は使いません。 |
| 拡張性 | デモは 5,000 件ですが、実運用では専用の indexing pipeline に分離してより大きなカタログに拡張します。 |
| Source of truth | Azure AI Search は検索用 projection であり、マスタデータの正本ではありません。 |
| UX 拡張 | ファセット、フィルター、ソート、詳細画面、CSV 出力などを追加できます。 |

## 想定 Q&A

| 質問 | 回答例 |
| --- | --- |
| Azure AI Search が商品マスタ DB になりますか。 | いいえ。商品マスタの正本は既存システムに残し、Azure AI Search は検索用 index として使います。 |
| 更新はどう反映しますか。 | 本番では source system からの差分同期、イベント駆動、バッチなどで indexing pipeline を作ります。このデモではシンプル化のためアプリが生成データを同期します。 |
| カテゴリやアレルゲンで絞り込めますか。 | はい。該当 field は filterable/facetable にできます。UI に facet/filter を追加することで対応できます。 |
| 表記揺れや同義語に対応できますか。 | はい。analyzer、synonym map、scoring profile などで relevance tuning が可能です。 |
| ベクトル検索やセマンティック検索もできますか。 | はい。このデモは keyword-first ですが、vector/hybrid search や semantic ranker の追加余地があります。 |
| セキュリティはどう考えますか。 | Managed Identity、Azure RBAC、local auth の無効化、Private Endpoint、最小権限の CI/CD identity を組み合わせます。 |
| Kubernetes は必要ですか。 | このデモでは不要です。Azure Container Apps でコンテナ化した業務アプリ/API を簡単にホストできます。 |
| お客様サブスクリプションに展開できますか。 | はい。Bicep と GitHub Actions の構成を、お客様の landing zone、命名規則、ガバナンスに合わせて調整します。 |

## デモ時の Do / Don't

Do:

- データは架空の生成データであると明示する。
- 検索体験を見せてから、アーキテクチャや CI/CD を説明する。
- Managed Identity と OIDC による passwordless 構成を強調する。
- お客様の既存商品マスタや業務フローに話を接続する。

Don't:

- 生成データを本番データアーキテクチャとして説明しない。
- Azure AI Search をマスタデータの正本として説明しない。
- GitHub に Azure key や client secret を保存する運用を提案しない。
- 本番化に必要な networking、監査、運用、差分同期の議論を省略しない。

## 次のワークショップ候補

- お客様サンプルデータを使った search relevance tuning
- 商品マスタ indexing pipeline の設計
- セキュリティ、ネットワーク、RBAC の設計レビュー
- CI/CD と landing zone の整合
- facet/filter、synonym、vector/hybrid search の追加プロトタイプ

