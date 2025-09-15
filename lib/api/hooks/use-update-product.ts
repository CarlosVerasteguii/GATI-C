import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { updateProduct } from '../endpoints/inventory';
import { inventoryKeys } from './use-inventory';
import type { UpdateProductData } from '../endpoints/inventory';
import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';

type UpdateArg = { id: string; data: UpdateProductData };

async function updateProductFetcher(
  _key: readonly unknown[],
  { arg }: { arg: UpdateArg }
): Promise<ProductResultType> {
  return updateProduct(arg.id, arg.data);
}

export function useUpdateProduct() {
  const { trigger, isMutating, error } = useSWRMutation(
    inventoryKeys.all,
    updateProductFetcher,
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
    updateProduct: trigger,
    isUpdating: isMutating,
    updateError: error,
  };
}

