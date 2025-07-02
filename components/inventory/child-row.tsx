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
            <TableCell />
            {visibleColumns.marca && <TableCell>{asset.marca}</TableCell>}
            {visibleColumns.modelo && <TableCell>{asset.modelo}</TableCell>}
            {visibleColumns.numeroSerie && <TableCell className="text-sm">{asset.numeroSerie}</TableCell>}
            {visibleColumns.categoria && <TableCell>{asset.categoria}</TableCell>}
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