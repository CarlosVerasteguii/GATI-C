'use client';

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDefinition } from "@/types/inventory";

type ColumnToggleMenuProps = {
    columns: ColumnDefinition[];
    onColumnsChange: (newColumns: ColumnDefinition[]) => void;
};

export function ColumnToggleMenu({ columns, onColumnsChange }: ColumnToggleMenuProps) {
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
                        checked={column.visible ?? false}
                        onCheckedChange={(value) => {
                            const newColumns = columns.map(col =>
                                col.id === column.id ? { ...col, visible: !!value } : col
                            );
                            onColumnsChange(newColumns);
                        }}
                        onSelect={(e) => e.preventDefault()}
                    >
                        {column.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 