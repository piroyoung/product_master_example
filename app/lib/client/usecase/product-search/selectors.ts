import type { ProductSearchResultDto } from "~/lib/client/infrastructure/api/product-search-api";

import type { ProductSearchState } from "./state";
import type { ProductSearchViewItem } from "./types";

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

export function toProductSearchViewItem(
  result: ProductSearchResultDto,
): ProductSearchViewItem {
  return {
    ...result,
    displayPrice: yenFormatter.format(result.price),
    scoreLabel: result.score > 0 ? result.score.toFixed(2) : "-",
  };
}

export function selectResultSummary(state: ProductSearchState): string {
  if (state.status === "loading" && state.items.length === 0) {
    return "検索インデックスを準備しています...";
  }

  if (state.status === "error") {
    return "検索に失敗しました";
  }

  if (state.query.trim()) {
    return `${state.items.length} 件 / インデックス ${state.indexedCount} 件`;
  }

  return `おすすめ ${state.items.length} 件 / インデックス ${state.indexedCount} 件`;
}
