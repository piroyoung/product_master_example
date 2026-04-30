import {
  Badge,
  Card,
  CardFooter,
  Caption1,
  Spinner,
  Text,
  Title3,
} from "@fluentui/react-components";

import type { ProductSearchViewItem, ProductSearchStatus } from "~/lib/client/usecase/product-search/types";

import styles from "./ProductResultList.module.css";

type ProductResultListProps = {
  status: ProductSearchStatus;
  summary: string;
  items: ProductSearchViewItem[];
};

export function ProductResultList({
  status,
  summary,
  items,
}: ProductResultListProps) {
  const isLoading = status === "loading";

  return (
    <section className={styles.root} aria-live="polite">
      <div className={styles.status}>
        {isLoading ? <Spinner size="tiny" label="検索中" /> : null}
        <Text>{summary}</Text>
      </div>

      {items.length === 0 && !isLoading ? (
        <div className={styles.empty}>
          <Text>該当する商品がありません。別のキーワードを入力してください。</Text>
        </div>
      ) : null}

      <div className={styles.list}>
        {items.map((item) => (
          <Card key={item.id} className={styles.card} appearance="filled-alternative">
            <div className={styles.cardHeader}>
              <div className={styles.titleRow}>
                <Title3>{item.name}</Title3>
                <Badge appearance="filled" color="brand">
                  {item.category}
                </Badge>
              </div>
              <Caption1 className={styles.code}>
                {item.code} / {item.kana}
              </Caption1>
            </div>

            <div className={styles.meta}>
              <Badge appearance="outline">{item.brand}</Badge>
              <Badge appearance="outline">{item.packageSize}</Badge>
              <Badge appearance="outline">{item.displayPrice}</Badge>
              <Badge appearance="outline">score {item.scoreLabel}</Badge>
            </div>

            <Text className={styles.description}>{item.description}</Text>

            <CardFooter className={styles.footer}>
              <div className={styles.tags}>
                {item.tags.map((tag) => (
                  <Badge key={tag} appearance="tint">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Caption1>
                アレルゲン: {item.allergens.length ? item.allergens.join("、") : "なし"}
              </Caption1>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
