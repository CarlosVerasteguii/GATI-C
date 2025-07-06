'use client';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchBarProps {
    initialValue?: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({ initialValue = '', onSearchChange, placeholder, className }: SearchBarProps) {
    const [value, setValue] = React.useState(initialValue);
    const debouncedValue = useDebounce(value, 300); // 300ms de retraso

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    // Este useEffect ahora notificará al padre solo cuando el valor "debounced" cambie
    React.useEffect(() => {
        onSearchChange(debouncedValue);
    }, [debouncedValue, onSearchChange]);

    // El botón de limpiar ahora solo necesita setear el valor local
    const handleClear = () => {
        setValue('');
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
                    onClick={handleClear} // Usar el nuevo handler
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                    aria-label="Limpiar búsqueda"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
            )}
        </div>
    );
} 