export type ProductCode = string & { readonly __productCodeBrand: unique symbol };

const productCodePattern = /^[A-Z]{2}-[A-Z0-9]{3}-\d{3}$/;

export function createProductCode(value: string): ProductCode {
  const normalized = value.trim().toUpperCase();

  if (!productCodePattern.test(normalized)) {
    throw new Error(`Invalid product code: ${value}`);
  }

  return normalized as ProductCode;
}

export function productCodeToString(code: ProductCode): string {
  return code;
}
