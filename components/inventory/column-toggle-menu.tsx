'use client';

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type ColumnToggleMenuProps = {
    columns: { id: string; label: string }[];
    visibleColumns: Record<string, boolean>;
    onColumnVisibilityChange: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};

export function ColumnToggleMenu({ columns, visibleColumns, onColumnVisibilityChange }: ColumnToggleMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Columnas</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Alternar Columnas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={visibleColumns[column.id] ?? false}
                        onCheckedChange={(value) =>
                            onColumnVisibilityChange((prev) => ({
                                ...prev,
                                [column.id]: !!value,
                            }))
                        }
                    >
                        {column.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 