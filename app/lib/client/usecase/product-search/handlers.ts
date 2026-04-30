import type { Dispatch } from "react";

import type { ProductSearchAction } from "./reducer";

export function createQueryChangeHandler(dispatch: Dispatch<ProductSearchAction>) {
  return (query: string) => {
    dispatch({ type: "queryChanged", query });
  };
}
