'use client';

import { useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useInventoryList } from '@/lib/api/hooks/use-inventory';
import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';
import type { ListParams } from '@/lib/api/schemas/inventory';
import InventoryToolbar from '@/components/inventory/InventoryToolbar';

type InventoryClientProps = {
    fallbackData: ProductResultType[];
};

function InventoryTable({ products }: { products: ProductResultType[] | undefined }) {
    return (
        <div className="rounded border p-3">
            <div className="text-sm mb-2">Table Placeholder</div>
            <div className="text-xs text-gray-500">Items: {products?.length ?? 0}</div>
        </div>
    );
}

export default function InventoryClient({ fallbackData }: InventoryClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Derive params from URL (single source of truth)
    const params: ListParams = useMemo(() => {
        const sp = searchParams;
        const toNum = (v: string | null) => (v != null && v !== '' ? Number(v) : undefined);
        const toBool = (v: string | null) => (v === 'true' ? true : v === 'false' ? false : undefined);

        return {
            q: sp.get('q') ?? undefined,
            page: toNum(sp.get('page')) ?? 1,
            pageSize: toNum(sp.get('pageSize')),
            sortBy: sp.get('sortBy') ?? undefined,
            sortOrder: (sp.get('sortOrder') as 'asc' | 'desc' | null) ?? undefined,
            brandId: sp.get('brandId') ?? undefined,
            categoryId: sp.get('categoryId') ?? undefined,
            locationId: sp.get('locationId') ?? undefined,
            condition: sp.get('condition') ?? undefined,
            hasSerialNumber: toBool(sp.get('hasSerialNumber')),
            minCost: toNum(sp.get('minCost')),
            maxCost: toNum(sp.get('maxCost')),
            purchaseDateFrom: sp.get('purchaseDateFrom') ?? undefined,
            purchaseDateTo: sp.get('purchaseDateTo') ?? undefined,
        } satisfies ListParams;
    }, [searchParams]);

    // SWR consumption with fallbackData to avoid duplicate initial fetch
    const { data, isLoading, error } = useInventoryList(params, { fallbackData });

    // Update URL on filter/pagination changes; no local state duplication
    const handleFilterChange = useCallback(
        (changes: Partial<ListParams>) => {
            const current = new URLSearchParams(Array.from(searchParams.entries()));

            Object.entries(changes).forEach(([key, value]) => {
                if (value === undefined || value === null || value === '') {
                    current.delete(key);
                } else {
                    current.set(key, String(value));
                }
            });

            // Reset page to 1 when filters (other than page) change
            if ('q' in changes || 'sortBy' in changes || 'sortOrder' in changes || 'brandId' in changes || 'categoryId' in changes || 'locationId' in changes || 'condition' in changes) {
                current.set('page', '1');
            }

            const query = current.toString();
            router.replace(`${pathname}${query ? `?${query}` : ''}`);
        },
        [pathname, router, searchParams]
    );

    return (
        <div className="container mx-auto p-6">
            <InventoryToolbar initialFilters={params} onFilterChange={handleFilterChange} />

            {error ? (
                <div className="mt-4 text-sm text-red-600">Error al cargar inventario</div>
            ) : (
                <InventoryTable products={data} />
            )}

            {isLoading && <div className="mt-2 text-xs text-gray-500">Cargando...</div>}
        </div>
    );
}


