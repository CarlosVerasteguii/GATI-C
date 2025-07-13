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
import { GroupedProduct, InventoryItem, ColumnDefinition } from '@/types/inventory';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortConfig = {
    key: string;
    direction: 'ascending' | 'descending';
};

type GroupedInventoryTableProps = {
    data: GroupedProduct[];
    searchQuery: string;
    selectedRowIds: number[];
    onRowSelect: (id: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onAction: (action: string, product: GroupedProduct | InventoryItem) => void;
    isLector: boolean;
    onParentRowSelect: (group: GroupedProduct, checked: boolean) => void;
    onSort: (columnId: string) => void;
    sortColumn: string | null;
    sortDirection: 'asc' | 'desc';
    columns: ColumnDefinition[];
};

const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | null }) => {
    if (!direction) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
};

export function GroupedInventoryTable({
    data,
    searchQuery,
    selectedRowIds,
    onRowSelect,
    onSelectAll,
    onAction,
    isLector,
    onParentRowSelect,
    onSort,
    sortColumn,
    sortDirection,
    columns
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

                        {columns.filter(c => c.visible).map((column) => (
                            <TableHead key={column.id}>
                                {column.sortable ? (
                                    <Button variant="ghost" onClick={() => onSort(column.id)}>
                                        {column.label}
                                        <SortIcon direction={sortColumn === column.id ? sortDirection : null} />
                                    </Button>
                                ) : (
                                    <span>{column.label}</span>
                                )}
                            </TableHead>
                        ))}
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
                                columns={columns}
                                selectedRowIds={selectedRowIds}
                                onRowSelect={onRowSelect}
                                isLector={isLector}
                                onParentRowSelect={onParentRowSelect}
                            />
                            {expandedRows[parent.product.id] && (
                                parent.children.map((child) => (
                                    <ChildRow
                                        key={child.reactKey || child.id.toString()}
                                        asset={child}
                                        isHighlighted={child.id.toString() === parent.highlightedChildId}
                                        columns={columns}
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