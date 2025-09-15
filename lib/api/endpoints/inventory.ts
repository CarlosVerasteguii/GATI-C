import apiClient from '../client';
import { parseAndTransformProducts } from '../schemas/inventory';
import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';
import type { ProductInputType } from '@types-generated/schemas/variants/input/Product.input';

// Input types for create/update operations, based on canonical generated types
export type CreateProductData = Omit<
  ProductInputType,
  'id' | 'createdAt' | 'updatedAt' | 'documents' | 'brand' | 'category' | 'location'
>;
export type UpdateProductData = Partial<CreateProductData>;

export async function listProducts(): Promise<ProductResultType[]> {
  try {
    const response = await apiClient('/api/v1/inventory');
    const payload = await response.json();
    const cleanData = parseAndTransformProducts(payload);
    return cleanData;
  } catch (error) {
    console.error('Failed to list products:', error);
    throw error;
  }
}

export async function getProduct(id: string): Promise<ProductResultType> {
  throw new Error('Not implemented');
}

export async function createProduct(data: CreateProductData): Promise<ProductResultType> {
  throw new Error('Not implemented');
}

export async function updateProduct(
  id: string,
  data: UpdateProductData
): Promise<ProductResultType> {
  throw new Error('Not implemented');
}

export async function deleteProduct(id: string): Promise<void> {
  throw new Error('Not implemented');
}

