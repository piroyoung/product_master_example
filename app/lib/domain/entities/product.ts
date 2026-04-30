import type { ProductCode } from "../value-objects/product-code";

export type Product = {
  id: string;
  code: ProductCode;
  name: string;
  kana: string;
  brand: string;
  category: string;
  tags: readonly string[];
  allergens: readonly string[];
  price: number;
  packageSize: string;
  description: string;
  updatedAt: Date;
};

export type ProductSearchHit = Product & {
  score: number;
};
