'use client';

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, MoreHorizontal } from "lucide-react";

// Tipos para las props
type ParentRowProps = {
    parentProduct: any;
    isExpanded: boolean;
    onToggle: () => void;
};

export function ParentRow({ parentProduct, isExpanded, onToggle }: ParentRowProps) {
    const { product, summary } = parentProduct;

    return (
        <TableRow className="bg-muted/50 hover:bg-muted/80">
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <Button onClick={onToggle} variant="ghost" size="sm">
                        <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        />
                    </Button>
                    {product.nombre}
                </div>
            </TableCell>
            <TableCell>{product.marca}</TableCell>
            <TableCell>{product.modelo}</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span>{`${summary.total} en Total`}</span>
                    <span className="text-xs text-green-600">{`${summary.disponible} Disp.`}</span>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <Button variant="ghost" size="icon" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
} 