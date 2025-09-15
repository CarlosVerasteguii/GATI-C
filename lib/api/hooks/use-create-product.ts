import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { createProduct } from '../endpoints/inventory';
import { inventoryKeys } from './use-inventory';
import type { CreateProductData } from '../endpoints/inventory';
import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';

async function createProductFetcher(
  _key: readonly unknown[],
  { arg }: { arg: CreateProductData }
): Promise<ProductResultType> {
  return createProduct(arg);
}

export function useCreateProduct() {
  const { trigger, isMutating, error } = useSWRMutation(
    inventoryKeys.all,
    createProductFetcher,
    {
      onSuccess: () => {
        mutate(
          (key) => Array.isArray(key) && key[0] === 'inventory' && key[1] === 'list',
          undefined,
          { revalidate: true }
        );
      },
    }
  );

  return {
    createProduct: trigger,
    isCreating: isMutating,
    createError: error,
  };
}

