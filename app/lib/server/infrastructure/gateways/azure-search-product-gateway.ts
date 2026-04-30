import type { TokenCredential } from "@azure/core-auth";
import {
  SearchClient,
  SearchIndexClient,
  type SearchIndex,
} from "@azure/search-documents";

import type { Product, ProductSearchHit } from "~/lib/domain/entities/product";
import { createProductCode, productCodeToString } from "~/lib/domain/value-objects/product-code";
import type {
  ProductSearchGateway,
  ProductSearchQuery,
} from "~/lib/server/usecase/product-search/search-products";

import type { SearchServiceConfig } from "../config/env.server";

type ProductSearchDocument = {
  id: string;
  code: string;
  codeSearch?: string;
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
};

const suggesterName = "product-suggester";
const searchableFields = [
  "code",
  "codeSearch",
  "name",
  "kana",
  "brand",
  "category",
  "tags",
  "description",
] as const;
const selectFields = [
  "id",
  "code",
  "name",
  "kana",
  "brand",
  "category",
  "tags",
  "allergens",
  "price",
  "packageSize",
  "description",
  "updatedAt",
] as const;

export class AzureSearchProductGateway implements ProductSearchGateway {
  private readonly indexClient: SearchIndexClient;
  private readonly searchClient: SearchClient<ProductSearchDocument>;

  constructor(
    private readonly config: SearchServiceConfig,
    credential: TokenCredential,
  ) {
    this.indexClient = new SearchIndexClient(config.endpoint, credential);
    this.searchClient = new SearchClient<ProductSearchDocument>(
      config.endpoint,
      config.indexName,
      credential,
    );
  }

  async ensureIndex(): Promise<void> {
    await this.indexClient.createOrUpdateIndex(createIndexDefinition(this.config.indexName), {
      allowIndexDowntime: true,
    });
  }

  async mergeOrUploadProducts(products: readonly Product[]): Promise<void> {
    if (products.length === 0) {
      return;
    }

    const result = await this.searchClient.mergeOrUploadDocuments(
      products.map(toSearchDocument),
    );
    const failed = result.results.filter((item) => !item.succeeded);

    if (failed.length > 0) {
      throw new Error(`Azure AI Search indexing failed for ${failed.length} product documents.`);
    }
  }

  async searchProducts(query: ProductSearchQuery): Promise<ProductSearchHit[]> {
    const searchText = createSearchText(query.query);
    const results = await this.searchClient.search(searchText, {
      queryType: "simple",
      searchMode: "all",
      top: query.top,
      searchFields: searchableFields,
      select: selectFields,
      scoringProfile: "productBoost",
    });

    const hits: ProductSearchHit[] = [];

    for await (const result of results.results) {
      hits.push(toProductSearchHit(result.document, result.score ?? 0));
    }

    return hits;
  }
}

function createIndexDefinition(indexName: string): SearchIndex {
  return {
    name: indexName,
    fields: [
      { name: "id", type: "Edm.String", key: true, filterable: true },
      {
        name: "code",
        type: "Edm.String",
        searchable: true,
        filterable: true,
        sortable: true,
      },
      {
        name: "codeSearch",
        type: "Edm.String",
        searchable: true,
        hidden: true,
      },
      {
        name: "name",
        type: "Edm.String",
        searchable: true,
        sortable: true,
        analyzerName: "ja.microsoft",
      },
      {
        name: "kana",
        type: "Edm.String",
        searchable: true,
        sortable: true,
        analyzerName: "ja.microsoft",
      },
      {
        name: "brand",
        type: "Edm.String",
        searchable: true,
        filterable: true,
        facetable: true,
        analyzerName: "ja.microsoft",
      },
      {
        name: "category",
        type: "Edm.String",
        searchable: true,
        filterable: true,
        facetable: true,
        analyzerName: "ja.microsoft",
      },
      {
        name: "tags",
        type: "Collection(Edm.String)",
        searchable: true,
        filterable: true,
        facetable: true,
        analyzerName: "ja.microsoft",
      },
      {
        name: "allergens",
        type: "Collection(Edm.String)",
        filterable: true,
        facetable: true,
      },
      { name: "price", type: "Edm.Int32", filterable: true, sortable: true },
      { name: "packageSize", type: "Edm.String", searchable: true },
      {
        name: "description",
        type: "Edm.String",
        searchable: true,
        analyzerName: "ja.microsoft",
      },
      { name: "updatedAt", type: "Edm.DateTimeOffset", filterable: true, sortable: true },
    ],
    suggesters: [
      {
        name: suggesterName,
        searchMode: "analyzingInfixMatching",
        sourceFields: ["code", "name", "kana", "brand", "category", "tags"],
      },
    ],
    scoringProfiles: [
      {
        name: "productBoost",
        textWeights: {
          weights: {
            code: 4,
            codeSearch: 4,
            name: 5,
            kana: 4,
            brand: 2,
            category: 2,
            tags: 3,
            description: 1,
          },
        },
      },
    ],
  };
}

function createSearchText(query: string): string {
  const normalized = query.trim();

  if (!normalized) {
    return "*";
  }

  const escaped = normalized.replace(/[+&|!(){}\[\]^"~*?:\\/\-]/g, " ");
  return escaped
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => `${term}*`)
    .join(" ");
}

function toSearchDocument(product: Product): ProductSearchDocument {
  return {
    id: product.id,
    code: productCodeToString(product.code),
    codeSearch: createCodeSearchText(productCodeToString(product.code)),
    name: product.name,
    kana: product.kana,
    brand: product.brand,
    category: product.category,
    tags: [...product.tags],
    allergens: [...product.allergens],
    price: product.price,
    packageSize: product.packageSize,
    description: product.description,
    updatedAt: product.updatedAt.toISOString(),
  };
}

function createCodeSearchText(code: string): string {
  return `${code} ${code.replace(/-/g, " ")} ${code.replace(/-/g, "")}`;
}

function toProductSearchHit(document: ProductSearchDocument, score: number): ProductSearchHit {
  return {
    id: document.id,
    code: createProductCode(document.code),
    name: document.name,
    kana: document.kana,
    brand: document.brand,
    category: document.category,
    tags: document.tags,
    allergens: document.allergens,
    price: document.price,
    packageSize: document.packageSize,
    description: document.description,
    updatedAt: new Date(document.updatedAt),
    score,
  };
}
