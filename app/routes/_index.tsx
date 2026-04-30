import type { Route } from "./+types/_index";

import { ProductSearchPage } from "~/components/product-search/ProductSearchPage";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "食品商品マスタ検索 | Azure AI Search Demo" },
    {
      name: "description",
      content: "Azure AI Search を使った食品商品マスタのインクリメンタル検索デモ",
    },
  ];
}

export default function Index() {
  return <ProductSearchPage />;
}
