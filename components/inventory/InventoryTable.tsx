'use client';

import { useMemo, useState, useCallback, Fragment } from 'react';
import type { InventoryViewModel } from '@/types/view-models/inventory';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { useInventoryPreferencesStore } from '@/lib/stores/use-inventory-preferences-store';

export type SortState = {
    sortBy: keyof InventoryViewModel | 'brandName' | 'categoryName' | 'locationName' | 'statusLabel' | 'purchaseDateFormatted';
    sortOrder: 'asc' | 'desc';
};

export type InventoryTableProps = {
    products: InventoryViewModel[] | undefined;
    isLoading: boolean;
    selectedIds?: string[];
    onRowSelectionChange?: (ids: string[]) => void;
    sort?: SortState;
    onSortChange?: (sort: SortState) => void;
    onProductSelect?: (product: InventoryViewModel) => void;
};

type GroupKey = string;

function buildGroupKey(item: InventoryViewModel): GroupKey {
    // Group by non-serialized products using name + brand as a simple heuristic
    // Serialized items should have a serial_number; treat empty/null as non-serialized
    const serial = (item.serialNumber ?? '').toString().trim();
    const isSerialized = !!serial;
    if (isSerialized) return `SERIAL:${item.id}`; // unique per item
    // Strengthen key by including category and location as well
    return `STACK:${(item.name ?? '').toLowerCase()}|${(item.brandName ?? '').toLowerCase()}|${(item.categoryName ?? '').toLowerCase()}|${(item.locationName ?? '').toLowerCase()}`;
}

function sortItems(items: InventoryViewModel[], sort?: SortState): InventoryViewModel[] {
    if (!sort) return items;
    const { sortBy, sortOrder } = sort;
    const dir = sortOrder === 'asc' ? 1 : -1;
    return [...items].sort((a, b) => {
        const va = (a as any)[sortBy];
        const vb = (b as any)[sortBy];
        if (va == null && vb == null) return 0;
        if (va == null) return -1 * dir;
        if (vb == null) return 1 * dir;
        if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
        return String(va).localeCompare(String(vb)) * dir;
    });
}

export default function InventoryTable({ products, isLoading, selectedIds = [], onRowSelectionChange, sort, onSortChange, onProductSelect }: InventoryTableProps) {
    const data = useMemo(() => products ?? [], [products]);
    const [expandedGroups, setExpandedGroups] = useState<Record<GroupKey, boolean>>({});
    const visible = useInventoryPreferencesStore((s) => s.visibleColumns);

    const toggleGroup = useCallback((key: GroupKey) => {
        setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const grouped = useMemo(() => {
        const map = new Map<GroupKey, InventoryViewModel[]>();
        sortItems(data, sort).forEach((item) => {
            const key = buildGroupKey(item);
            const arr = map.get(key) ?? [];
            arr.push(item);
            map.set(key, arr);
        });
        return map;
    }, [data, sort]);

    const toggleSelection = (id: string) => {
        if (!onRowSelectionChange) return;
        const set = new Set(selectedIds);
        if (set.has(id)) set.delete(id);
        else set.add(id);
        onRowSelectionChange(Array.from(set));
    };

    const headerCell = (label: string, key: SortState['sortBy']) => (
        <TableHead
            className="cursor-pointer select-none"
            onClick={() =>
                onSortChange?.({
                    sortBy: key,
                    sortOrder: sort?.sortBy === key && sort?.sortOrder === 'asc' ? 'desc' : 'asc',
                })
            }
            aria-sort={sort?.sortBy === key ? (sort.sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
        >
            {label}
        </TableHead>
    );

    return (
        <div className="mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12"></TableHead>
                        {visible.name && headerCell('Nombre', 'name')}
                        {visible.brandName && headerCell('Marca', 'brandName')}
                        {visible.serialNumber && headerCell('Núm. Serie', 'serialNumber')}
                        {visible.statusLabel && headerCell('Estado', 'statusLabel')}
                        {visible.locationName && headerCell('Ubicación', 'locationName')}
                        {visible.purchaseDateFormatted && headerCell('Fecha Compra', 'purchaseDateFormatted')}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        Array.from({ length: 8 }).map((_, i) => (
                            <TableRow key={`sk-${i}`}>
                                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            </TableRow>
                        ))
                    )}

                    {!isLoading && data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                                No hay productos para mostrar
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && data.length > 0 && (
                        Array.from(grouped.entries()).map(([groupKey, items]) => {
                            const isStack = groupKey.startsWith('STACK:');
                            if (!isStack) {
                                const item = items[0];
                                const checked = selectedIds.includes(item.id);
                                return (
                                    <TableRow key={item.id} data-group="serialized" className="cursor-pointer" onClick={() => onProductSelect?.(item)}>
                                        <TableCell>
                                            <Checkbox checked={checked} onCheckedChange={() => toggleSelection(item.id)} />
                                        </TableCell>
                                        {visible.name && <TableCell className="font-medium">{item.name}</TableCell>}
                                        {visible.brandName && <TableCell>{item.brandName}</TableCell>}
                                        {visible.serialNumber && <TableCell>{item.serialNumber ?? '—'}</TableCell>}
                                        {visible.statusLabel && <TableCell>{item.statusLabel}</TableCell>}
                                        {visible.locationName && <TableCell>{item.locationName}</TableCell>}
                                        {visible.purchaseDateFormatted && <TableCell>{item.purchaseDateFormatted ?? '—'}</TableCell>}
                                    </TableRow>
                                );
                            }

                            // Stack: show summary row
                            const representative = items[0];
                            const total = items.length;
                            const selectedInGroup = items.filter((it) => selectedIds.includes(it.id)).length;
                            const groupChecked: boolean | 'indeterminate' = selectedInGroup === total ? true : selectedInGroup > 0 ? 'indeterminate' : false;
                            const isExpanded = !!expandedGroups[groupKey];

                            return (
                                <Fragment key={groupKey}>
                                    <TableRow data-group="stack-summary">
                                        <TableCell className="space-x-2">
                                            <Checkbox
                                                checked={groupChecked}
                                                onCheckedChange={(checked) => {
                                                    if (!onRowSelectionChange) return;
                                                    const isOn = checked === true || checked === 'indeterminate';
                                                    if (isOn) {
                                                        const union = Array.from(new Set([...selectedIds, ...items.map((i) => i.id)]));
                                                        onRowSelectionChange(union);
                                                    } else {
                                                        const filtered = selectedIds.filter((id) => !items.some((i) => i.id === id));
                                                        onRowSelectionChange(filtered);
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="inline-flex h-5 w-5 items-center justify-center rounded border"
                                                aria-label={isExpanded ? 'Colapsar grupo' : 'Expandir grupo'}
                                                onClick={() => toggleGroup(groupKey)}
                                            >
                                                {isExpanded ? '−' : '+'}
                                            </button>
                                        </TableCell>
                                        {visible.name && (
                                            <TableCell className="font-medium">{representative.name} (x{total})</TableCell>
                                        )}
                                        {visible.brandName && <TableCell>{representative.brandName}</TableCell>}
                                        {visible.serialNumber && <TableCell>—</TableCell>}
                                        {visible.statusLabel && <TableCell>Apilado</TableCell>}
                                        {visible.locationName && <TableCell>{representative.locationName}</TableCell>}
                                        {visible.purchaseDateFormatted && <TableCell>{representative.purchaseDateFormatted ?? '—'}</TableCell>}
                                    </TableRow>

                                    {isExpanded && items.map((item) => {
                                        const checked = selectedIds.includes(item.id);
                                        return (
                                            <TableRow key={item.id} data-group="stack-item" className="cursor-pointer" onClick={() => onProductSelect?.(item)}>
                                                <TableCell>
                                                    <Checkbox checked={checked} onCheckedChange={() => toggleSelection(item.id)} />
                                                </TableCell>
                                                {visible.name && <TableCell className="pl-6">{item.name}</TableCell>}
                                                {visible.brandName && <TableCell>{item.brandName}</TableCell>}
                                                {visible.serialNumber && <TableCell>—</TableCell>}
                                                {visible.statusLabel && <TableCell>{item.statusLabel}</TableCell>}
                                                {visible.locationName && <TableCell>{item.locationName}</TableCell>}
                                                {visible.purchaseDateFormatted && <TableCell>{item.purchaseDateFormatted ?? '—'}</TableCell>}
                                            </TableRow>
                                        );
                                    })}
                                </Fragment>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}


