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
        case 'Available': return 'default';
        case 'Assigned':
        case 'Lent': return 'secondary';
        case 'Retired': return 'destructive';
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

                // If the column is 'brand' or 'model', render an empty cell to maintain alignment.
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
                                ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
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
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Asset Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => onAction('View Details', asset)}>
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Edit', asset)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Duplicate', asset)}>
                            Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        {/* --- CONTEXTUAL LOGIC --- */}
                        {asset.status === 'Available' && (
                            <>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Assign', asset)}>
                                    Assign
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Lend', asset)}>
                                    Lend
                                </DropdownMenuItem>
                            </>
                        )}

                        {asset.status === 'Assigned' && (
                            <>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('release', asset)}>
                                    Release Assignment
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Assign', asset)}>
                                    Re-assign
                                </DropdownMenuItem>
                            </>
                        )}

                        {(asset.status === 'Lent') && (
                            <>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('return', asset)}>
                                    <Undo2 className="mr-2 h-4 w-4" />
                                    <span>Return Loan</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Assign', asset)}>
                                    Re-assign
                                </DropdownMenuItem>
                            </>
                        )}

                        {asset.status === 'Retired' && (
                            <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Reactivate', asset)}>
                                Reactivate Asset
                            </DropdownMenuItem>
                        )}
                        {/* --- END CONTEXTUAL LOGIC --- */}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled={isReadOnly} className="text-red-600" onSelect={() => onAction('Delete', asset)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
} 