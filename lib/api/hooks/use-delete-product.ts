import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { deleteProduct } from '../endpoints/inventory';
import { inventoryKeys } from './use-inventory';

async function deleteProductFetcher(
  _key: readonly unknown[],
  { arg }: { arg: string }
) {
  return deleteProduct(arg);
}

export function useDeleteProduct() {
  const { trigger, isMutating, error } = useSWRMutation(
    inventoryKeys.all,
    deleteProductFetcher,
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
    deleteProduct: trigger,
    isDeleting: isMutating,
    deleteError: error,
  };
}

