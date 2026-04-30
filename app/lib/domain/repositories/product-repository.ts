import type { Product } from "../entities/product";

export interface ProductRepository {
  listProducts(): Promise<Product[]>;
}
