import { useEffect, useMemo, useReducer } from "react";

import { fetchProductSearch } from "~/lib/client/infrastructure/api/product-search-api";

import { createQueryChangeHandler } from "./handlers";
import { productSearchReducer } from "./reducer";
import { toProductSearchViewItem, selectResultSummary } from "./selectors";
import { initialProductSearchState } from "./state";

const debounceMs = 250;

export function useProductSearch() {
  const [state, dispatch] = useReducer(
    productSearchReducer,
    initialProductSearchState,
  );

  useEffect(() => {
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => {
      dispatch({ type: "searchStarted" });

      fetchProductSearch(state.query, abortController.signal)
        .then((response) => {
          dispatch({
            type: "searchSucceeded",
            indexedCount: response.indexedCount,
            items: response.items.map(toProductSearchViewItem),
          });
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          dispatch({
            type: "searchFailed",
            errorMessage:
              error instanceof Error ? error.message : "商品検索に失敗しました。",
          });
        });
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [state.query]);

  return useMemo(
    () => ({
      query: state.query,
      status: state.status,
      items: state.items,
      errorMessage: state.errorMessage,
      resultSummary: selectResultSummary(state),
      onQueryChange: createQueryChangeHandler(dispatch),
    }),
    [state],
  );
}
