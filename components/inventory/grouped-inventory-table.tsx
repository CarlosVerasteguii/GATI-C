'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ParentRow } from './parent-row';
import { ChildRow } from './child-row';
import { AssignModal } from './modals/assign-modal';
import { QuickRetireModal } from './modals/quick-retire-modal';
import { GroupedProduct, InventoryItem } from '@/types/inventory';

type GroupedInventoryTableProps = {
    data: GroupedProduct[];
    searchQuery: string;
    visibleColumns: Record<string, boolean>;
    selectedRowIds: number[];
    onRowSelect: (id: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onAction: (action: string, product: GroupedProduct | InventoryItem) => void;
    isLector: boolean;
    onParentRowSelect: (group: GroupedProduct, checked: boolean) => void;
};

export function GroupedInventoryTable({
    data,
    searchQuery,
    visibleColumns,
    selectedRowIds,
    onRowSelect,
    onSelectAll,
    onAction,
    isLector,
    onParentRowSelect
}: GroupedInventoryTableProps) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const [modalState, setModalState] = useState<{
        type: 'assign' | null;
        data: GroupedProduct | null;
    }>({ type: null, data: null });

    const [quickRetireState, setQuickRetireState] = useState<{
        isOpen: boolean;
        product?: GroupedProduct | null;
    }>({ isOpen: false });

    const handleOpenQuickRetire = (product: GroupedProduct | null = null) => {
        setQuickRetireState({ isOpen: true, product: product || null });
    };

    const handleCloseQuickRetire = () => {
        setQuickRetireState({ isOpen: false, product: null });
    };

    const toggleRow = (productId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    const lowercasedQuery = searchQuery.trim().toLowerCase();

    const filteredData = useMemo(() => {
        if (!lowercasedQuery) return data.map(p => ({ ...p, highlightedChildId: null }));

        return data
            .map(parent => {
                const parentMatches =
                    (parent.product.nombre?.toLowerCase().includes(lowercasedQuery)) ||
                    (parent.product.marca?.toLowerCase().includes(lowercasedQuery)) ||
                    (parent.product.modelo?.toLowerCase().includes(lowercasedQuery));

                // --- LÓGICA DE RESALTADO ---
                let highlightedChildId: string | null = null;
                const matchingChildren = parent.children.filter(child =>
                    child.numeroSerie && child.numeroSerie.toLowerCase().includes(lowercasedQuery)
                );

                if (matchingChildren.length === 1 && !parentMatches) {
                    // Si solo un hijo coincide y el padre no, lo marcamos para resaltar.
                    highlightedChildId = matchingChildren[0].id.toString();
                }
                // --- FIN LÓGICA DE RESALTADO ---

                if (parentMatches || matchingChildren.length > 0) {
                    return { ...parent, highlightedChildId }; // Devolvemos el padre con la info de resaltado
                }
                return null;
            })
            .filter((p): p is GroupedProduct & { highlightedChildId: string | null } => p !== null);
    }, [data, lowercasedQuery]);

    // --- LÓGICA PARA AUTO-EXPANDIR ---
    useEffect(() => {
        if (lowercasedQuery) {
            // Si la búsqueda filtra y deja un único resultado padre, lo expandimos.
            if (filteredData.length === 1) {
                setExpandedRows({ [filteredData[0].product.id]: true });
            } else {
                // Si hay más de un resultado o ninguno, colapsamos todo para una vista limpia.
                setExpandedRows({});
            }
        } else {
            // Si la búsqueda está vacía, colapsamos todo.
            setExpandedRows({});
        }
    }, [searchQuery, filteredData]);
    // --- FIN LÓGICA PARA AUTO-EXPANDIR ---

    const handleMenuAction = (action: string, product: GroupedProduct) => {
        if (action === 'Asignar') {
            setModalState({ type: 'assign', data: product });
        } else if (action === 'Retiro Rápido') {
            handleOpenQuickRetire(product);
        } else {
            onAction(action, product);
        }
    };

    const handleCloseModal = () => {
        setModalState({ type: null, data: null });
    };

    return (
        <>
            <Table>
                <TableCaption>Una lista de los activos de tu inventario.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            {!isLector && (
                                <Checkbox
                                    checked={
                                        selectedRowIds.length > 0 &&
                                        data.flatMap(p => p.children).every(c => selectedRowIds.includes(c.id))
                                    }
                                    onCheckedChange={(checked) => onSelectAll(!!checked)}
                                />
                            )}
                        </TableHead>
                        <TableHead className="w-[400px]">Producto</TableHead>
                        {visibleColumns.marca && <TableHead>Marca</TableHead>}
                        {visibleColumns.modelo && <TableHead>Modelo</TableHead>}
                        {visibleColumns.numeroSerie && <TableHead>N/S</TableHead>}
                        {visibleColumns.estado && <TableHead>Estado</TableHead>}
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.map((parent) => (
                        <React.Fragment key={parent.product.id}>
                            <ParentRow
                                parentProduct={parent}
                                isExpanded={!!expandedRows[parent.product.id]}
                                onToggle={() => toggleRow(parent.product.id)}
                                onAction={(action) => handleMenuAction(action, parent)}
                                visibleColumns={visibleColumns}
                                selectedRowIds={selectedRowIds}
                                onRowSelect={onRowSelect}
                                isLector={isLector}
                                onParentRowSelect={onParentRowSelect}
                            />
                            {expandedRows[parent.product.id] && (
                                parent.children.map((child) => (
                                    <ChildRow
                                        key={child.id}
                                        asset={child}
                                        isHighlighted={child.id.toString() === parent.highlightedChildId}
                                        visibleColumns={visibleColumns}
                                        selectedRowIds={selectedRowIds}
                                        onRowSelect={onRowSelect}
                                        isLector={isLector}
                                        onAction={onAction}
                                    />
                                ))
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>

            <AssignModal
                isOpen={modalState.type === 'assign'}
                onClose={handleCloseModal}
                productData={modalState.data}
            />

            <QuickRetireModal
                isOpen={quickRetireState.isOpen}
                onClose={handleCloseQuickRetire}
                inventoryItems={data}
                productData={quickRetireState.product}
            />
        </>
    );
} 