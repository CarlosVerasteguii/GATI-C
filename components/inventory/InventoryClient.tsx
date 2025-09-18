'use client';

import { useMemo, useCallback, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useInventoryList } from '@/lib/api/hooks/use-inventory';
import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';
import type { ListParams } from '@/lib/api/schemas/inventory';
import InventoryToolbar from '@/components/inventory/InventoryToolbar';
import InventoryTable from '@/components/inventory/InventoryTable';
import { toViewModels } from '@/types/view-models/inventory';
import type { InventoryViewModel } from '@/types/view-models/inventory';
import InventoryDetailSheet from '@/components/inventory/InventoryDetailSheet';
import CreateProductDialog from '@/components/inventory/CreateProductDialog';
import EditProductDialog from '@/components/inventory/EditProductDialog';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { useDeleteProduct } from '@/lib/api/hooks/use-delete-product';
import { useToast } from '@/hooks/use-toast';

type InventoryClientProps = {
    fallbackData: ProductResultType[];
};

export default function InventoryClient({ fallbackData }: InventoryClientProps) {
    const [selectedProduct, setSelectedProduct] = useState<InventoryViewModel | null>(null);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [productToDelete, setProductToDelete] = useState<InventoryViewModel | null>(null);
    const { deleteProduct, isDeleting } = useDeleteProduct();
    const { toast } = useToast();
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

    const viewModels = useMemo(() => (data ? toViewModels(data) : undefined), [data]);

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
            if (
                'q' in changes ||
                'sortBy' in changes ||
                'sortOrder' in changes ||
                'brandId' in changes ||
                'categoryId' in changes ||
                'locationId' in changes ||
                'condition' in changes ||
                // Advanced filters
                'hasSerialNumber' in changes ||
                'minCost' in changes ||
                'maxCost' in changes ||
                'purchaseDateFrom' in changes ||
                'purchaseDateTo' in changes
            ) {
                current.set('page', '1');
            }

            const query = current.toString();
            router.replace(`${pathname}${query ? `?${query}` : ''}`);
        },
        [pathname, router, searchParams]
    );

    return (
        <div className="container mx-auto p-6">
            <InventoryToolbar initialFilters={params} onFilterChange={handleFilterChange} onCreateNew={() => setCreateDialogOpen(true)} />

            {error ? (
                <div className="mt-4 text-sm text-red-600">Error al cargar inventario</div>
            ) : (
                <InventoryTable
                    products={viewModels}
                    isLoading={isLoading}
                    onProductSelect={setSelectedProduct}
                    onEditProduct={setEditingProductId}
                    onDeleteProduct={(product) => {
                        setProductToDelete(product);
                    }}
                />
            )}

            {/* Loading indicator handled inside InventoryTable via skeletons */}

            <InventoryDetailSheet
                product={selectedProduct}
                isOpen={selectedProduct !== null}
                onOpenChange={(isOpen) => {
                    if (!isOpen) setSelectedProduct(null);
                }}
            />

            <CreateProductDialog isOpen={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />

            <EditProductDialog
                productId={editingProductId}
                isOpen={editingProductId !== null}
                onOpenChange={(isOpen) => {
                    if (!isOpen) setEditingProductId(null);
                }}
            />

            <ConfirmationDialog
                isOpen={productToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setProductToDelete(null);
                }}
                title="Eliminar producto"
                description={productToDelete ? `¿Estás seguro de eliminar "${productToDelete.name}"? Esta acción no se puede deshacer.` : ''}
                confirmText="Eliminar"
                variant="destructive"
                isLoading={isDeleting}
                onConfirm={async () => {
                    if (!productToDelete) return;
                    try {
                        await deleteProduct(productToDelete.id);
                        toast({ title: 'Producto eliminado', description: 'El producto fue eliminado correctamente.' });
                        setProductToDelete(null);
                    } catch (error: any) {
                        toast({ title: 'Error al eliminar', description: error?.message ?? 'No se pudo eliminar el producto.', variant: 'destructive' });
                        setProductToDelete(null);
                    }
                }}
            />
        </div>
    );
}


