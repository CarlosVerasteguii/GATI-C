'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ParentRow } from './parent-row';
import { ChildRow } from './child-row';

// Definimos un tipo más específico para nuestros datos
type InventoryAsset = any; // Podemos refinar esto después
type InventoryProduct = {
    isParent: boolean;
    product: any;
    summary: any;
    children: InventoryAsset[];
};

export function GroupedInventoryTable({ data }: { data: InventoryProduct[] }) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (productId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    return (
        <Table>
            <TableCaption>Una lista de los activos de tu inventario.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[400px]">Nombre del Producto</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>N/S</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((parent) => (
                    <React.Fragment key={parent.product.id}>
                        <ParentRow
                            key={parent.product.id}
                            parentProduct={parent}
                            isExpanded={!!expandedRows[parent.product.id]}
                            onToggle={() => toggleRow(parent.product.id)}
                        />
                        {expandedRows[parent.product.id] && parent.children.map((child) => (
                            <ChildRow key={child.id} asset={child} />
                        ))}
                    </React.Fragment>
                ))}
            </TableBody>
        </Table>
    );
} 