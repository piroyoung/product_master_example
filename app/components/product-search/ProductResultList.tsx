import {
  Badge,
  Caption1,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
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

      {items.length > 0 ? (
        <div className={styles.tableWrapper}>
          <Table aria-label="商品検索結果" className={styles.table}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell className={styles.codeColumn}>商品コード</TableHeaderCell>
                <TableHeaderCell className={styles.productColumn}>商品名</TableHeaderCell>
                <TableHeaderCell>ブランド</TableHeaderCell>
                <TableHeaderCell>カテゴリ</TableHeaderCell>
                <TableHeaderCell>規格</TableHeaderCell>
                <TableHeaderCell>価格</TableHeaderCell>
                <TableHeaderCell className={styles.tagsColumn}>タグ</TableHeaderCell>
                <TableHeaderCell>アレルゲン</TableHeaderCell>
                <TableHeaderCell>score</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={styles.code}>
                    <TableCellLayout>
                      <span>{item.code}</span>
                    </TableCellLayout>
                  </TableCell>
                  <TableCell>
                    <TableCellLayout>
                      <div className={styles.productName}>
                        <Text weight="semibold">{item.name}</Text>
                        <Caption1 className={styles.kana}>{item.kana}</Caption1>
                      </div>
                    </TableCellLayout>
                  </TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>
                    <Badge appearance="filled" color="brand">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.packageSize}</TableCell>
                  <TableCell>{item.displayPrice}</TableCell>
                  <TableCell>
                    <div className={styles.tags}>
                      {item.tags.map((tag) => (
                        <Badge key={tag} appearance="tint">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.allergens.length ? item.allergens.join("、") : "なし"}
                  </TableCell>
                  <TableCell>{item.scoreLabel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </section>
  );
}
