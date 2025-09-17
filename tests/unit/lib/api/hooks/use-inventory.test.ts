import { describe, it, expect, vi, beforeEach } from 'vitest';
import useSWR from 'swr';
import { useInventoryList, inventoryKeys } from '@/lib/api/hooks/use-inventory';
import * as endpoints from '@/lib/api/endpoints/inventory';

vi.mock('swr', async (importOriginal) => {
    const mod = await importOriginal<any>();
    return {
        ...mod,
        default: vi.fn(),
    };
});

vi.mock('@/lib/api/endpoints/inventory');

describe('useInventoryList hook', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('uses a stable key including params and calls endpoint with params', () => {
        const swrMock = useSWR as unknown as ReturnType<typeof vi.fn>;
        (swrMock as any).mockReturnValue({ data: [], error: undefined, isLoading: false, mutate: vi.fn() });

        const params = { q: 'abc', page: 3 } as any;

        useInventoryList(params);

        // Assert key passed to SWR
        const [keyArg] = (swrMock as any).mock.calls[0];
        expect(keyArg).toEqual(inventoryKeys.list(params));

        // Assert endpoint called with params via fetcher
        const fetcher = (swrMock as any).mock.calls[0][1];
        const listSpy = vi.spyOn(endpoints, 'listProducts');
        (listSpy as any).mockResolvedValue([]);

        // Invoke fetcher to ensure it forwards params
        return fetcher().then(() => {
            expect(listSpy).toHaveBeenCalledWith(params);
        });
    });

    it('returns immutable key along with data state', () => {
        const swrMock = useSWR as unknown as ReturnType<typeof vi.fn>;
        (swrMock as any).mockReturnValue({ data: [1], error: undefined, isLoading: false, mutate: vi.fn() });

        const { key, data, isLoading, error } = useInventoryList();

        expect(key).toEqual(inventoryKeys.list('all'));
        expect(data).toEqual([1]);
        expect(isLoading).toBe(false);
        expect(error).toBeUndefined();
    });
});


