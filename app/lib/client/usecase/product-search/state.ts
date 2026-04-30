import type { ProductSearchViewItem, ProductSearchStatus } from "./types";

export type ProductSearchState = {
  query: string;
  status: ProductSearchStatus;
  items: ProductSearchViewItem[];
  indexedCount: number;
  errorMessage: string | null;
};

export const initialProductSearchState: ProductSearchState = {
  query: "",
  status: "idle",
  items: [],
  indexedCount: 0,
  errorMessage: null,
};
