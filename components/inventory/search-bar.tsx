'use client';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    initialValue?: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({ initialValue = '', onSearchChange, placeholder, className }: SearchBarProps) {
    const [value, setValue] = React.useState(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onSearchChange(e.target.value);
    };

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="pl-10 pr-10" // Añadimos padding para los iconos
            />
            {value && (
                <button
                    onClick={() => {
                        setValue('');
                        onSearchChange('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                    aria-label="Limpiar búsqueda"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
            )}
        </div>
    );
} 