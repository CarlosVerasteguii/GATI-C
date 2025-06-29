'use client';

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type ChildRowProps = {
    asset: any;
};

export function ChildRow({ asset }: ChildRowProps) {
    return (
        <TableRow>
            <TableCell className="pl-12 text-sm text-muted-foreground">
                {/* Dejamos este espacio para el nombre del producto padre, pero lo mostramos atenuado */}
            </TableCell>
            <TableCell></TableCell> {/* Celda vacía para alinear con Marca */}
            <TableCell></TableCell> {/* Celda vacía para alinear con Modelo */}
            <TableCell className="text-sm">{asset.numeroSerie}</TableCell>
            <TableCell className="text-sm">{asset.estado}</TableCell>
            <TableCell className="text-right">
                <Button variant="ghost" size="icon" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
} 