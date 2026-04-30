import type { ProductSearchResultDto } from "~/lib/client/infrastructure/api/product-search-api";

export type ProductSearchStatus = "idle" | "loading" | "success" | "error";

export type ProductSearchViewItem = ProductSearchResultDto & {
  displayPrice: string;
  scoreLabel: string;
};
