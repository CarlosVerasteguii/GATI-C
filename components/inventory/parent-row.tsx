'use client';

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

// Tipos para las props
type ParentRowProps = {
    parentProduct: any;
    isExpanded: boolean;
    onToggle: () => void;
    onAction: (action: string) => void;
};

export function ParentRow({ parentProduct, isExpanded, onToggle, onAction }: ParentRowProps) {
    const { product, summary } = parentProduct;

    const renderEstadoTooltip = () => (
        <div className="flex flex-col gap-1 p-1 text-xs">
            <h4 className="font-bold text-sm mb-1">Desglose de Stock</h4>
            {summary.estados.asignado > 0 && <div>Asignado: <strong>{summary.estados.asignado}</strong></div>}
            {summary.estados.prestado > 0 && <div>Prestado: <strong>{summary.estados.prestado}</strong></div>}
            {summary.estados.enMantenimiento > 0 && <div>En Mantenimiento: <strong>{summary.estados.enMantenimiento}</strong></div>}
        </div>
    );

    return (
        <TableRow className="bg-muted/50 hover:bg-muted/80">
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={onToggle}
                        variant="ghost"
                        size="sm"
                    >
                        <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                    </Button>
                    <span>{product.nombre}</span>
                </div>
            </TableCell>
            <TableCell>{product.marca}</TableCell>
            <TableCell>{product.modelo}</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell className="text-right">
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
                        <DropdownMenuItem onSelect={() => onAction('Asignar')}>Asignar desde Stock</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onAction('Retiro Rápido')}>Retiro Rápido</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onAction('Editar')}>Editar Modelo</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
} 