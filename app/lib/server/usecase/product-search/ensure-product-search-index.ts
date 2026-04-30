import type { ProductRepository } from "~/lib/domain/repositories/product-repository";

import type { ProductSearchGateway } from "./search-products";

type EnsureProductSearchIndexDependencies = {
  productRepository: ProductRepository;
  searchGateway: ProductSearchGateway;
};

export async function ensureProductSearchIndex(
  dependencies: EnsureProductSearchIndexDependencies,
): Promise<number> {
  const products = await dependencies.productRepository.listProducts();

  await dependencies.searchGateway.ensureIndex();
  await dependencies.searchGateway.mergeOrUploadProducts(products);

  return products.length;
}
