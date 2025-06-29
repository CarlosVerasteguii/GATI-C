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

// Tipos para las props
type ParentRowProps = {
    parentProduct: any;
    isExpanded: boolean;
    onToggle: () => void;
};

export function ParentRow({ parentProduct, isExpanded, onToggle }: ParentRowProps) {
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
                        variant="ghost"
                        size="sm"
                        onClick={onToggle}
                        className="h-6 w-6 p-0"
                    >
                        <ChevronRight
                            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
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
                <Button variant="ghost" size="icon" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
} 