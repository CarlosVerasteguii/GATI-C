'use client';

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type ChildRowProps = {
    asset: any;
    isHighlighted: boolean;
};

export function ChildRow({ asset, isHighlighted }: ChildRowProps) {
    return (
        <TableRow className={isHighlighted ? "bg-green-100 dark:bg-green-900/30" : ""}>
            <TableCell className="pl-12 text-sm text-muted-foreground"></TableCell>
            <TableCell />
            <TableCell />
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