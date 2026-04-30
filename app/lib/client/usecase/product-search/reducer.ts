import type { ProductSearchViewItem } from "./types";
import type { ProductSearchState } from "./state";

export type ProductSearchAction =
  | { type: "queryChanged"; query: string }
  | { type: "searchStarted" }
  | {
      type: "searchSucceeded";
      items: ProductSearchViewItem[];
      indexedCount: number;
    }
  | { type: "searchFailed"; errorMessage: string };

export function productSearchReducer(
  state: ProductSearchState,
  action: ProductSearchAction,
): ProductSearchState {
  switch (action.type) {
    case "queryChanged":
      return {
        ...state,
        query: action.query,
      };
    case "searchStarted":
      return {
        ...state,
        status: "loading",
        errorMessage: null,
      };
    case "searchSucceeded":
      return {
        ...state,
        status: "success",
        items: action.items,
        indexedCount: action.indexedCount,
        errorMessage: null,
      };
    case "searchFailed":
      return {
        ...state,
        status: "error",
        errorMessage: action.errorMessage,
      };
  }
}
