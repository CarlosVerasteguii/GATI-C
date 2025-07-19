'use client';

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GroupedProduct, ColumnDefinition } from '@/types/inventory';
import { cn } from "@/lib/utils";

interface ParentRowProps {
    parentProduct: GroupedProduct;
    isExpanded: boolean;
    onToggle: () => void;
    onAction: (action: string, product: GroupedProduct) => void;
    columns: ColumnDefinition[];
    selectedRowIds: number[];
    onRowSelect: (id: number, checked: boolean) => void;
    isLector: boolean;
    onParentRowSelect: (group: GroupedProduct, checked: boolean) => void;
}

export function ParentRow({
    parentProduct,
    isExpanded,
    onToggle,
    onAction,
    columns,
    selectedRowIds,
    onRowSelect,
    isLector,
    onParentRowSelect
}: ParentRowProps) {
    const { product, summary } = parentProduct;

    const areAllChildrenSelected = parentProduct.children.length > 0 && parentProduct.children.every(child => selectedRowIds.includes(child.id));

    const renderEstadoTooltip = () => (
        <div className="flex flex-col gap-1 p-1 text-xs">
            <h4 className="font-bold text-sm mb-1">Desglose de Stock</h4>
            {summary.estados.asignado > 0 && <div>Asignado: <strong>{summary.estados.asignado}</strong></div>}
            {summary.estados.prestado > 0 && <div>Prestado: <strong>{summary.estados.prestado}</strong></div>}
        </div>
    );

    return (
        <TableRow
            onClick={onToggle}
            className={cn(
                "bg-muted/50 cursor-pointer",
                areAllChildrenSelected && "bg-blue-100 dark:bg-blue-900/40",
                "hover:border-l-4 hover:border-l-green-500 transition-all duration-150"
            )}
        >
            <TableCell onClick={(e) => e.stopPropagation()}>
                {!isLector && (
                    <Checkbox
                        checked={areAllChildrenSelected}
                        onCheckedChange={(checked) => onParentRowSelect(parentProduct, !!checked)}
                    />
                )}
            </TableCell>
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                        variant="ghost"
                        size="sm"
                    >
                        <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                    </Button>
                    <span className="font-semibold">{product.nombre}</span>
                </div>
            </TableCell>
            {columns.filter(c => c.id !== 'nombre' && c.visible).map(col => {
                let content: React.ReactNode = null;
                switch (col.id) {
                    case 'marca':
                        content = product.marca;
                        break;
                    case 'modelo':
                        content = product.modelo;
                        break;
                    case 'numeroSerie':
                        content = null;
                        break;
                    case 'categoria':
                        content = product.categoria;
                        break;
                    case 'estado':
                        content = (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-col cursor-pointer">
                                            <span>{`${summary.total} en Total`}</span>
                                            <span className="text-xs text-green-600">{`${summary.disponible} Disp.`}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {renderEstadoTooltip()}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                        break;
                    default:
                        // Para otras columnas, podrías querer mostrar algo por defecto
                        // o simplemente no renderizar la celda si no hay un caso para ella.
                        content = parentProduct.product[col.id as keyof typeof parentProduct.product] || '';
                }
                return <TableCell key={col.id}>{content}</TableCell>;
            })}
            <TableCell colSpan={2} className="py-2">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <div>Total: <strong>{summary.total}</strong></div>
                    {summary.estados.disponible > 0 && <div>Disponible: <strong>{summary.estados.disponible}</strong></div>}
                    {summary.estados.asignado > 0 && <div>Asignado: <strong>{summary.estados.asignado}</strong></div>}
                    {summary.estados.prestado > 0 && <div>Prestado: <strong>{summary.estados.prestado}</strong></div>}
                    {summary.estados.pendienteRetiro > 0 && <div>Pendiente Retiro: <strong>{summary.estados.pendienteRetiro}</strong></div>}
                    {summary.estados.retirado > 0 && <div>Retirado: <strong>{summary.estados.retirado}</strong></div>}
                </div>
            </TableCell>
            <TableCell colSpan={2} className="text-right py-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones de Stock</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => onAction('Asignar', parentProduct)}>
                            Asignar desde Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onAction('Prestar', parentProduct)}>
                            Prestar desde Stock
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => onAction('Retiro Rápido', parentProduct)}>
                            Retiro Rápido de Stock
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
} 