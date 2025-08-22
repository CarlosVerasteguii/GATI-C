import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export function useInventory() {
    const { data, error, isLoading, mutate } = useSWR<ApiResponse<any[]>>('/api/v1/inventory', fetcher);

    return {
        inventory: data?.data,
        isLoading,
        isError: error,
        mutate,
    } as const;
}


