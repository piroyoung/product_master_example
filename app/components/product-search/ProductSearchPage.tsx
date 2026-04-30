import {
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Text,
  Title1,
} from "@fluentui/react-components";

import { useProductSearch } from "~/lib/client/usecase/product-search/use-product-search";

import { ProductResultList } from "./ProductResultList";
import { ProductSearchBox } from "./ProductSearchBox";
import styles from "./ProductSearchPage.module.css";

export function ProductSearchPage() {
  const productSearch = useProductSearch();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Text className={styles.eyebrow}>Azure AI Search demo</Text>
        <Title1>食品の商品マスタをインクリメンタル検索</Title1>
        <Text size={500} className={styles.description}>
          デモ用の約 5,000 件の食品商品マスタを Azure AI Search に同期し、入力に合わせて商品名・カナ・ブランド・カテゴリ・タグ・商品コードを横断検索します。
        </Text>
      </section>

      <section className={styles.panel}>
        <ProductSearchBox
          query={productSearch.query}
          onQueryChange={productSearch.onQueryChange}
        />

        {productSearch.errorMessage ? (
          <MessageBar intent="error" className={styles.error}>
            <MessageBarBody>
              <MessageBarTitle>検索エラー</MessageBarTitle>
              {productSearch.errorMessage}
            </MessageBarBody>
          </MessageBar>
        ) : null}

        <ProductResultList
          status={productSearch.status}
          summary={productSearch.resultSummary}
          items={productSearch.items}
        />
      </section>
    </main>
  );
}
