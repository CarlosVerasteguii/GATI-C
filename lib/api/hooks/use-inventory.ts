import useSWR from 'swr';
import { listProducts } from '../endpoints/inventory';
import type { ListParams } from '../schemas/inventory';
import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';

// Centralized, stable SWR keys for Inventory domain
export const inventoryKeys = {
  all: ['inventory'] as const,
  list: (params: ListParams | 'all' = 'all') => [...inventoryKeys.all, 'list', params] as const,
};

export type UseInventoryListOptions = {
  fallbackData?: ProductResultType[];
};

export function useInventoryList(
  params?: ListParams,
  options?: UseInventoryListOptions
) {
  const key = inventoryKeys.list(params ?? 'all');
  const { data, error, isLoading, mutate } = useSWR<ProductResultType[]>(
    key,
    () => listProducts(params),
    {
      keepPreviousData: true,
      ...(options?.fallbackData ? { fallbackData: options.fallbackData } : {}),
    }
  );

  return { data, isLoading, error, mutate, key } as const;
}

