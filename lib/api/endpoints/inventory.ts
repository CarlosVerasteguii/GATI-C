import apiClient from '../client';
import { parseAndTransformProducts, parseAndTransformProduct, ListParamsSchema } from '../schemas/inventory';
import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';
import type { ProductInputType } from '@types-generated/schemas/variants/input/Product.input';
import type { ListParams } from '../schemas/inventory';

// Input types for create/update operations, based on canonical generated types
export type CreateProductData = Omit<
  ProductInputType,
  'id' | 'createdAt' | 'updatedAt' | 'documents' | 'brand' | 'category' | 'location'
>;
export type UpdateProductData = Partial<CreateProductData>;

function buildInventoryQuery(params?: ListParams): string {
  if (!params) return '';
  // Sanitize/strip unknown keys via Zod; all fields optional
  const safe = ListParamsSchema.parse(params);
  const qs = new URLSearchParams();
  if (safe.q) qs.set('q', safe.q);
  if (typeof safe.page === 'number') qs.set('page', String(safe.page));
  if (typeof safe.pageSize === 'number') qs.set('pageSize', String(safe.pageSize));
  if (safe.sortBy) qs.set('sortBy', safe.sortBy);
  if (safe.sortOrder) qs.set('sortOrder', safe.sortOrder);
  if (safe.brandId) qs.set('brandId', safe.brandId);
  if (safe.categoryId) qs.set('categoryId', safe.categoryId);
  if (safe.locationId) qs.set('locationId', safe.locationId);
  if (safe.condition) qs.set('condition', safe.condition);
  if (typeof safe.hasSerialNumber === 'boolean') qs.set('hasSerialNumber', String(safe.hasSerialNumber));
  if (typeof safe.minCost === 'number') qs.set('minCost', String(safe.minCost));
  if (typeof safe.maxCost === 'number') qs.set('maxCost', String(safe.maxCost));
  if (safe.purchaseDateFrom) qs.set('purchaseDateFrom', safe.purchaseDateFrom);
  if (safe.purchaseDateTo) qs.set('purchaseDateTo', safe.purchaseDateTo);

  const queryString = qs.toString();
  return queryString ? `?${queryString}` : '';
}

export async function listProducts(params?: ListParams): Promise<ProductResultType[]> {
  try {
    const query = buildInventoryQuery(params);
    const response = await apiClient(`/api/v1/inventory${query}`);
    const payload = await response.json();
    const cleanData = parseAndTransformProducts(payload);
    return cleanData;
  } catch (error) {
    console.error('Failed to list products:', error);
    throw error;
  }
}

export async function getProduct(id: string): Promise<ProductResultType> {
  try {
    const response = await apiClient(`/api/v1/inventory/${encodeURIComponent(id)}`);
    const payload = await response.json();
    const clean = parseAndTransformProduct(payload);
    return clean;
  } catch (error) {
    console.error('Failed to get product:', error);
    throw error;
  }
}

export async function createProduct(data: CreateProductData): Promise<ProductResultType> {
  try {
    const response = await apiClient('/api/v1/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const payload = await response.json();
    const clean = parseAndTransformProduct(payload);
    return clean;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

export async function updateProduct(
  id: string,
  data: UpdateProductData
): Promise<ProductResultType> {
  try {
    const response = await apiClient(`/api/v1/inventory/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    const payload = await response.json();
    const clean = parseAndTransformProduct(payload);
    return clean;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await apiClient(`/api/v1/inventory/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}

