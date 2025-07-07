'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterBadgeProps {
    children: React.ReactNode;
    onRemove: () => void;
}

export function FilterBadge({ children, onRemove }: FilterBadgeProps) {
    return (
        <Badge variant="secondary" className="flex items-center gap-x-2">
            <span>{children}</span>
            <button
                onClick={onRemove}
                className="rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                aria-label="Eliminar filtro"
            >
                <X className="h-3 w-3" />
            </button>
        </Badge>
    );
} 