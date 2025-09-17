'use client';

import type { ListParams } from '@/lib/api/schemas/inventory';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useInventoryPreferencesStore } from '@/lib/stores/use-inventory-preferences-store';
import type { InventoryColumnId } from '@/lib/stores/use-inventory-preferences-store';

export type InventoryToolbarProps = {
    initialFilters: Partial<ListParams>;
    onFilterChange: (changes: Partial<ListParams>) => void;
    // Optional props for options (mock or real)
    brands?: Array<{ id: string; name: string }>; // mock for now
    categories?: Array<{ id: string; name: string }>; // mock for now
    conditions?: Array<{ id: string; label: string }>; // mock for now
    // Column visibility control
    visibleColumns?: Record<string, boolean>;
    onToggleColumn?: (columnId: string, visible: boolean) => void;
    // Actions
    onCreateNew?: () => void;
};

const defaultBrands = [
    { id: 'b1', name: 'Marca A' },
    { id: 'b2', name: 'Marca B' },
];

const defaultCategories = [
    { id: 'c1', name: 'Categoría X' },
    { id: 'c2', name: 'Categoría Y' },
];

const defaultConditions = [
    { id: 'new', label: 'Nuevo' },
    { id: 'used', label: 'Usado' },
    { id: 'retired', label: 'Retirado' },
];

export default function InventoryToolbar(props: InventoryToolbarProps) {
    const {
        initialFilters,
        onFilterChange,
        brands = defaultBrands,
        categories = defaultCategories,
        conditions = defaultConditions,
        visibleColumns,
        onToggleColumn,
        onCreateNew,
    } = props;

    const storeVisible = useInventoryPreferencesStore((s) => s.visibleColumns);
    const toggleColumn = useInventoryPreferencesStore((s) => s.toggleColumnVisibility);
    const currentColumns = useMemo(() => visibleColumns ?? storeVisible, [visibleColumns, storeVisible]);

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="col-span-1 md:col-span-2">
                    <Label htmlFor="q">Búsqueda</Label>
                    <Input
                        id="q"
                        placeholder="Buscar productos..."
                        value={initialFilters.q ?? ''}
                        onChange={(e) => onFilterChange({ q: e.target.value || undefined })}
                    />
                </div>

                <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Select
                        value={initialFilters.brandId ?? ''}
                        onValueChange={(value) => onFilterChange({ brandId: value || undefined })}
                    >
                        <SelectTrigger id="brand">
                            <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Todas</SelectItem>
                            {brands.map((b) => (
                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                        value={initialFilters.categoryId ?? ''}
                        onValueChange={(value) => onFilterChange({ categoryId: value || undefined })}
                    >
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Todas</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="condition">Estado</Label>
                    <Select
                        value={initialFilters.condition ?? ''}
                        onValueChange={(value) => onFilterChange({ condition: value || undefined })}
                    >
                        <SelectTrigger id="condition">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Todos</SelectItem>
                            {conditions.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="default" onClick={() => { onCreateNew?.(); }}>
                    Crear Nuevo Producto
                </Button>

                <Separator orientation="vertical" className="h-6 hidden md:block" />

                {/* Pagination controls */}
                <div className="flex items-end gap-2">
                    <div>
                        <Label htmlFor="pageSize">Tamaño página</Label>
                        <Select
                            value={String(initialFilters.pageSize ?? '')}
                            onValueChange={(value) => onFilterChange({ pageSize: value ? Number(value) : undefined, page: 1 })}
                        >
                            <SelectTrigger id="pageSize" className="w-28">
                                <SelectValue placeholder="Auto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Auto</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end gap-2">
                        <Button variant="outline" onClick={() => onFilterChange({ page: Math.max(1, (initialFilters.page ?? 1) - 1) })}>
                            Anterior
                        </Button>
                        <div className="text-sm">Página {initialFilters.page ?? 1}</div>
                        <Button variant="outline" onClick={() => onFilterChange({ page: (initialFilters.page ?? 1) + 1 })}>
                            Siguiente
                        </Button>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Columnas</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {Object.keys(currentColumns).length === 0 ? (
                            <div className="px-2 py-1 text-xs text-gray-500">
                                Sin columnas configurables
                            </div>
                        ) : (
                            Object.entries(currentColumns).map(([columnId, visible]) => (
                                <DropdownMenuCheckboxItem
                                    key={columnId}
                                    checked={!!visible}
                                    onCheckedChange={(checked) => {
                                        if (onToggleColumn) onToggleColumn(columnId, !!checked);
                                        else toggleColumn(columnId as InventoryColumnId);
                                    }}
                                >
                                    {columnId}
                                </DropdownMenuCheckboxItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}


