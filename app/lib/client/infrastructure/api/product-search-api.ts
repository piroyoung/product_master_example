export type ProductSearchResultDto = {
  id: string;
  code: string;
  name: string;
  kana: string;
  brand: string;
  category: string;
  tags: string[];
  allergens: string[];
  price: number;
  packageSize: string;
  description: string;
  updatedAt: string;
  score: number;
};

export type ProductSearchResponseDto = {
  query: string;
  indexedCount: number;
  items: ProductSearchResultDto[];
};

export async function fetchProductSearch(
  query: string,
  signal?: AbortSignal,
): Promise<ProductSearchResponseDto> {
  const params = new URLSearchParams({
    q: query,
    top: "8",
  });
  const response = await fetch(`/api/products/search?${params.toString()}`, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });
  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error(readErrorMessage(payload));
  }

  return parseProductSearchResponse(payload);
}

function readErrorMessage(payload: unknown): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return "商品検索に失敗しました。";
}

function parseProductSearchResponse(payload: unknown): ProductSearchResponseDto {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("query" in payload) ||
    !("indexedCount" in payload) ||
    !("items" in payload) ||
    typeof payload.query !== "string" ||
    typeof payload.indexedCount !== "number" ||
    !Array.isArray(payload.items)
  ) {
    throw new Error("商品検索 API のレスポンス形式が不正です。");
  }

  return {
    query: payload.query,
    indexedCount: payload.indexedCount,
    items: payload.items.map(parseProductSearchResult),
  };
}

function parseProductSearchResult(value: unknown): ProductSearchResultDto {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("code" in value) ||
    !("name" in value) ||
    !("kana" in value) ||
    !("brand" in value) ||
    !("category" in value) ||
    !("tags" in value) ||
    !("allergens" in value) ||
    !("price" in value) ||
    !("packageSize" in value) ||
    !("description" in value) ||
    !("updatedAt" in value) ||
    !("score" in value) ||
    typeof value.id !== "string" ||
    typeof value.code !== "string" ||
    typeof value.name !== "string" ||
    typeof value.kana !== "string" ||
    typeof value.brand !== "string" ||
    typeof value.category !== "string" ||
    !Array.isArray(value.tags) ||
    !value.tags.every((item) => typeof item === "string") ||
    !Array.isArray(value.allergens) ||
    !value.allergens.every((item) => typeof item === "string") ||
    typeof value.price !== "number" ||
    typeof value.packageSize !== "string" ||
    typeof value.description !== "string" ||
    typeof value.updatedAt !== "string" ||
    typeof value.score !== "number"
  ) {
    throw new Error("商品検索結果の形式が不正です。");
  }

  return {
    id: value.id,
    code: value.code,
    name: value.name,
    kana: value.kana,
    brand: value.brand,
    category: value.category,
    tags: value.tags,
    allergens: value.allergens,
    price: value.price,
    packageSize: value.packageSize,
    description: value.description,
    updatedAt: value.updatedAt,
    score: value.score,
  };
}
