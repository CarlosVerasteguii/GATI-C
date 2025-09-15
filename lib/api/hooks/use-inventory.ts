import useSWR from 'swr';
import { listProducts } from '../endpoints/inventory';
import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';

// Centralized, stable SWR keys for Inventory domain
export const inventoryKeys = {
  all: ['inventory'] as const,
  list: (params: unknown = 'all') => [...inventoryKeys.all, 'list', params] as const,
};

export type UseInventoryListOptions = {
  fallbackData?: ProductResultType[];
};

export function useInventoryList(
  params?: unknown,
  options?: UseInventoryListOptions
) {
  const { data, error, isLoading, mutate } = useSWR<ProductResultType[]>(
    inventoryKeys.list(params ?? 'all'),
    () => listProducts(),
    {
      keepPreviousData: true,
      ...(options?.fallbackData ? { fallbackData: options.fallbackData } : {}),
    }
  );

  return { data, isLoading, error, mutate };
}

