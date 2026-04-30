import type { Product, ProductSearchHit } from "~/lib/domain/entities/product";
import type { ProductRepository } from "~/lib/domain/repositories/product-repository";

import { ensureProductSearchIndex } from "./ensure-product-search-index";

export type ProductSearchQuery = {
  query: string;
  top: number;
};

export interface ProductSearchGateway {
  ensureIndex(): Promise<void>;
  mergeOrUploadProducts(products: readonly Product[]): Promise<void>;
  searchProducts(query: ProductSearchQuery): Promise<ProductSearchHit[]>;
}

export type SearchProductsInput = {
  query: string;
  top?: number;
};

export type SearchProductsOutput = {
  query: string;
  indexedCount: number;
  items: ProductSearchItemDto[];
};

export type ProductSearchItemDto = {
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

type SearchProductsDependencies = {
  productRepository: ProductRepository;
  searchGateway: ProductSearchGateway;
};

export async function searchProducts(
  input: SearchProductsInput,
  dependencies: SearchProductsDependencies,
): Promise<SearchProductsOutput> {
  const query = input.query.trim();
  const top = normalizeTop(input.top);
  const indexedCount = await ensureProductSearchIndex(dependencies);
  const hits = await dependencies.searchGateway.searchProducts({ query, top });

  return {
    query,
    indexedCount,
    items: hits.map(toDto),
  };
}

function normalizeTop(top: number | undefined): number {
  if (top === undefined || Number.isNaN(top)) {
    return 8;
  }

  return Math.min(Math.max(Math.trunc(top), 1), 20);
}

function toDto(hit: ProductSearchHit): ProductSearchItemDto {
  return {
    id: hit.id,
    code: hit.code,
    name: hit.name,
    kana: hit.kana,
    brand: hit.brand,
    category: hit.category,
    tags: [...hit.tags],
    allergens: [...hit.allergens],
    price: hit.price,
    packageSize: hit.packageSize,
    description: hit.description,
    updatedAt: hit.updatedAt.toISOString(),
    score: hit.score,
  };
}
