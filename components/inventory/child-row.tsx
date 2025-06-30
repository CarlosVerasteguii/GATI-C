'use client';

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InventoryItem } from '@/types/inventory';

interface ChildRowProps {
    asset: InventoryItem;
    isHighlighted: boolean;
    visibleColumns: Record<string, boolean>;
    selectedRowIds: number[];
    onRowSelect: (id: number, checked: boolean) => void;
    isLector: boolean;
    onAction: (action: string, asset: InventoryItem) => void;
}

export function ChildRow({
    asset,
    isHighlighted,
    visibleColumns,
    selectedRowIds,
    onRowSelect,
    isLector,
    onAction
}: ChildRowProps) {
    return (
        <TableRow className={isHighlighted ? "bg-green-100 dark:bg-green-900/30" : ""}>
            <TableCell className="pl-12">
                {!isLector && (
                    <Checkbox
                        checked={selectedRowIds.includes(asset.id)}
                        onCheckedChange={(checked) => onRowSelect(asset.id, !!checked)}
                    />
                )}
            </TableCell>
            <TableCell className="pl-12 text-sm text-muted-foreground"></TableCell>
            {visibleColumns.marca && <TableCell />}
            {visibleColumns.modelo && <TableCell />}
            {visibleColumns.numeroSerie && <TableCell className="text-sm">{asset.numeroSerie}</TableCell>}
            {visibleColumns.estado && <TableCell className="text-sm">{asset.estado}</TableCell>}
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones de Activo</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => onAction('Ver Detalles', asset)}>Ver Detalles</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onAction('Editar', asset)}>Editar Activo</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onAction('Mover a Mantenimiento', asset)}>Mover a Mantenimiento</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
} 