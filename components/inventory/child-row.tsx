'use client';

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
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

const getStatusVariant = (status: InventoryItem['estado']): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (status) {
        case 'Disponible': return 'default';
        case 'Asignado':
        case 'Prestado': return 'secondary';
        case 'En Mantenimiento': return 'outline';
        case 'PENDIENTE_DE_RETIRO':
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
    onAction: (action: string, asset: InventoryItem) => void;
}

export function ChildRow({
    asset,
    isHighlighted,
    columns,
    selectedRowIds,
    onRowSelect,
    isLector,
    onAction
}: ChildRowProps) {
    const isSelected = selectedRowIds.includes(asset.id);

    return (
        <TableRow className={cn(
            isHighlighted && "bg-green-100 dark:bg-green-900/30",
            isSelected && "bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-100/90 dark:hover:bg-blue-900/50"
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
            {columns.filter(c => c.id !== 'nombre' && c.visible).map(col => {
                // Si la columna es 'marca' o 'modelo', renderiza una celda vacía para mantener la alineación.
                if (col.id === 'marca' || col.id === 'modelo') {
                    return <TableCell key={col.id} />;
                }

                if (col.id === 'estado') {
                    return (
                        <TableCell key={col.id}>
                            <Badge variant={getStatusVariant(asset.estado)}>{asset.estado}</Badge>
                        </TableCell>
                    );
                }

                const value = asset[col.id as keyof InventoryItem];
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
                        <DropdownMenuItem onSelect={() => onAction('Editar', asset)}>
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onAction('Duplicar', asset)}>
                            Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        {/* --- LÓGICA CONTEXTUAL --- */}
                        {asset.estado === 'Disponible' && (
                            <>
                                <DropdownMenuItem onSelect={() => onAction('Asignar', asset)}>
                                    Asignar
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onAction('Prestar', asset)}>
                                    Prestar
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onAction('Mover a Mantenimiento', asset)}>
                                    Mantenimiento
                                </DropdownMenuItem>
                            </>
                        )}

                        {(asset.estado === 'Asignado' || asset.estado === 'Prestado') && (
                            <DropdownMenuItem onSelect={() => onAction('Marcar como Retirado', asset)}>
                                Devolver / Liberar
                            </DropdownMenuItem>
                        )}

                        {asset.estado === 'Retirado' && (
                            <DropdownMenuItem onSelect={() => onAction('Reactivar', asset)}>
                                Reactivar Activo
                            </DropdownMenuItem>
                        )}
                        {/* --- FIN LÓGICA CONTEXTUAL --- */}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onSelect={() => onAction('Marcar como Retirado', asset)}>
                            Retiro Definitivo
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
} 