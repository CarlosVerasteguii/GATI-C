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
    isReadOnly?: boolean;
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
    onParentRowSelect,
    isReadOnly = false
}: ParentRowProps) {
    const { product, summary } = parentProduct;

    const areAllChildrenSelected = parentProduct.children.length > 0 && parentProduct.children.every(child => selectedRowIds.includes(child.id));

    const renderStatusTooltip = () => (
        <div className="flex flex-col gap-1 p-1 text-xs">
            <h4 className="font-bold text-sm mb-1">Stock Breakdown</h4>
            {summary.states.Assigned > 0 && <div>Assigned: <strong>{summary.states.Assigned}</strong></div>}
            {summary.states.Lent > 0 && <div>Lent: <strong>{summary.states.Lent}</strong></div>}
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
                    <span className="font-semibold">{product.name}</span>
                </div>
            </TableCell>
            {columns.filter(c => c.id !== 'name' && c.visible).map(col => {
                let content: React.ReactNode = null;
                if (col.id === 'cost') {
                    const totalCost = parentProduct.children.reduce(
                        (sum, child) => sum + (typeof child.cost === 'number' ? child.cost : 0),
                        0
                    );
                    content = totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                } else {
                    switch (col.id) {
                        case 'brand':
                            content = product.brand;
                            break;
                        case 'model':
                            content = product.model;
                            break;
                        case 'serialNumber':
                            content = null;
                            break;
                        case 'category':
                            content = product.category;
                            break;
                        case 'status':
                            content = (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex flex-col cursor-pointer">
                                                <span>{`${summary.total} Total`}</span>
                                                <span className="text-xs text-green-600">{`${summary.available} Avail.`}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {renderStatusTooltip()}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                            break;
                        default:
                            // For other columns, you might want to show something by default
                            // or simply not render the cell if there's no case for it.
                            content = parentProduct.product[col.id as keyof typeof parentProduct.product] || '';
                    }
                }
                return <TableCell key={col.id}>{content}</TableCell>;
            })}
            <TableCell colSpan={2} className="py-2">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <div>Total: <strong>{summary.total}</strong></div>
                    {summary.states.Available > 0 && <div>Available: <strong>{summary.states.Available}</strong></div>}
                    {summary.states.Assigned > 0 && <div>Assigned: <strong>{summary.states.Assigned}</strong></div>}
                    {summary.states.Lent > 0 && <div>Lent: <strong>{summary.states.Lent}</strong></div>}
                    {summary.states['PENDING_RETIREMENT'] > 0 && <div>Pending Retirement: <strong>{summary.states['PENDING_RETIREMENT']}</strong></div>}
                    {summary.states.Retired > 0 && <div>Retired: <strong>{summary.states.Retired}</strong></div>}
                </div>
            </TableCell>
            <TableCell colSpan={2} className="text-right py-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Stock Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Assign', parentProduct)}>
                            Assign from Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Lend', parentProduct)}>
                            Lend from Stock
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled={isReadOnly} onSelect={() => onAction('Quick Retirement', parentProduct)}>
                            Quick Stock Retirement
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
} 