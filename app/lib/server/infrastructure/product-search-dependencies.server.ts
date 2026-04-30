import { searchProducts } from "~/lib/server/usecase/product-search/search-products";
import type { SearchProductsInput } from "~/lib/server/usecase/product-search/search-products";

import { createAzureCredential } from "./azure-credential.server";
import { getSearchServiceConfig } from "./config/env.server";
import { AzureSearchProductGateway } from "./gateways/azure-search-product-gateway";
import { StaticProductRepository } from "./repositories/static-product-repository";

export async function searchProductsWithDefaultDependencies(input: SearchProductsInput) {
  const productRepository = new StaticProductRepository();
  const searchGateway = new AzureSearchProductGateway(
    getSearchServiceConfig(),
    createAzureCredential(),
  );

  return searchProducts(input, { productRepository, searchGateway });
}
