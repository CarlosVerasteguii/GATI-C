import useSWR from 'swr';
import { fetcher } from '@/lib/api/client';

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export function useInventory() {
    const { data, error, isLoading } = useSWR<ApiResponse<any[]>>('/api/v1/inventory', fetcher);

    return {
        inventory: data?.data,
        isLoading,
        isError: error,
    } as const;
}


