'use client';

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InventoryItem, ColumnDefinition } from '@/types/inventory';
import { cn } from "@/lib/utils";

const getStatusVariant = (status: InventoryItem['status']): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (status) {
        case 'Disponible': return 'default';
        case 'Asignado':
        case 'Prestado': return 'secondary';
        case 'Retirado': return 'destructive';
        default: return 'secondary';
    }
};

interface ChildRowProps {
    asset: InventoryItem;
    isHighlighted: boolean;
    columns: ColumnDefinition[];
    selectedRowIds: number[];
    onRowSelect: (id: number, checked: boolean) => void;
    isLector: boolean;
    isReadOnly?: boolean;
    onAction: (action: string, asset: InventoryItem) => void;
}

export function ChildRow({
    asset,
    isHighlighted,
    columns,
    selectedRowIds,
    onRowSelect,
    isLector,
    isReadOnly = false,
    onAction
}: ChildRowProps) {
    const isSelected = selectedRowIds.includes(asset.id);

    return (
        <TableRow className={cn(
            isHighlighted && "bg-green-100 dark:bg-green-900/30",
            isSelected && "bg-blue-100 dark:bg-blue-900/40",
            "hover:border-l-4 hover:border-l-green-500 transition-all duration-150",
            "animate-fadeIn"
        )}>
            <TableCell className="pl-12">
                {!isLector && (
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onRowSelect(asset.id, !!checked)}
                    />
                )}
            </TableCell>
            <TableCell />
            {columns.filter(c => c.id !== 'name' && c.visible).map(col => {
                const value = asset[col.id as keyof InventoryItem];

                // Si la columna es 'marca' o 'modelo', renderiza una celda vacía para mantener la alineación.
                if (col.id === 'brand' || col.id === 'model') {
                    return <TableCell key={col.id} />;
                }

                if (col.id === 'status') {
                    return (
                        <TableCell key={col.id}>
                            <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
                        </TableCell>
                    );
                }

                if (col.id === 'cost') {
                    return (
                        <TableCell key={col.id}>
                            {typeof value === 'number'
                                ? value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
                                : '$0.00'}
                        </TableCell>
                    );
                }

                let content: React.ReactNode;

                switch (col.type) {
                    case 'string':
                    case 'number':
                    case 'date':
                    case 'status':
                        content = typeof value === 'string' || typeof value === 'number' ? value : String(value);
                        break;
                    default:
                        if (typeof value === 'string' || typeof value === 'number') {
                            content = value;
                        } else if (value && typeof value.toString === 'function') {
                            content = (value.toString() !== '[object Object]') ? value.toString() : 'N/A';
                        } else {
                            content = 'N/A';
                        }
                }

                return <TableCell key={col.id}>{content}</TableCell>;
            })}
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
                        <DropdownMenuItem onSelect={() => onAction('Ver Detalles', asset)}>
                            Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Editar', asset)}>
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Duplicar', asset)}>
                            Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        {/* --- LÓGICA CONTEXTUAL --- */}
                        {asset.status === 'Disponible' && (
                            <>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Asignar', asset)}>
                                    Asignar
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Prestar', asset)}>
                                    Prestar
                                </DropdownMenuItem>
                            </>
                        )}

                        {asset.status === 'Asignado' && (
                            <>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('liberar', asset)}>
                                    Liberar Asignación
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Asignar', asset)}>
                                    Re-asignar
                                </DropdownMenuItem>
                            </>
                        )}

                        {(asset.status === 'Prestado') && (
                            <>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('devolver', asset)}>
                                    <Undo2 className="mr-2 h-4 w-4" />
                                    <span>Devolver Préstamo</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Asignar', asset)}>
                                    Re-asignar
                                </DropdownMenuItem>
                            </>
                        )}

                        {asset.status === 'Retirado' && (
                            <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Reactivar', asset)}>
                                Reactivar Activo
                            </DropdownMenuItem>
                        )}
                        {/* --- FIN LÓGICA CONTEXTUAL --- */}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled={isReadOnly} className="text-red-600" onSelect={() => onAction('Eliminar', asset)}>
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
} 