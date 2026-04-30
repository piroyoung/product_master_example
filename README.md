# Product Master Search Demo

Azure AI Search を使った食品の商品マスタ検索デモです。React Router のサーバールートから Azure AI Search を呼び出し、Fluent UI と CSS Modules で構成した UI で約 5,000 件の商品マスタをインクリメンタル検索します。

## Architecture

- React Router framework mode
- Fluent UI React v9
- CSS Modules
- Static TypeScript product master generator for about 5,000 demo products
- Azure AI Search for search indexing and query execution
- Azure Container Registry and Azure Container Apps for hosting
- Managed identity from Container Apps to Azure AI Search

## Local development

```bash
npm ci
cp .env.example .env
npm run dev
```

`.env` には Azure AI Search のエンドポイントとインデックス名を設定します。ローカルでは `DefaultAzureCredential` を使うため、事前に `az login` してください。

## CI/CD

- `CI`: pull request と `main` push で `npm ci`, typecheck, app build, Docker build, Bicep build を実行します。
- `CD`: `v*.*.*` タグの push または手動実行で、ACR にイメージを push し、Azure Container Apps を更新します。

```bash
git tag v0.1.0
git push origin v0.1.0
```

## GitHub OIDC configuration

CD は GitHub Actions OIDC で Azure にログインします。クライアントシークレットは使いません。GitHub Environment は `production` を使い、Entra ID Federated Credential の subject は次の形式にします。

```text
repo:piroyoung/product_master_example:environment:production
```

Production environment variables:

| Name | Purpose |
| --- | --- |
| `AZURE_CLIENT_ID` | Entra application client ID for GitHub Actions OIDC |
| `AZURE_TENANT_ID` | Azure tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
| `AZURE_RESOURCE_GROUP` | Target resource group |
| `AZURE_CONTAINER_REGISTRY_NAME` | ACR resource name |
| `AZURE_CONTAINER_REGISTRY_LOGIN_SERVER` | ACR login server |
| `AZURE_CONTAINER_APP_NAME` | Container App resource name |
| `AZURE_CONTAINER_APP_FQDN` | Container App FQDN |
| `IMAGE_NAME` | Container image repository name |
