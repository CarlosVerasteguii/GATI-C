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
    const debouncedValue = useDebounce(value, 300); // 300ms delay
    const isInitialMount = React.useRef(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    // This useEffect will now notify the parent only when the "debounced" value changes
    React.useEffect(() => {
        if (isInitialMount.current) {
            // On first mount, do nothing, just change the flag.
            isInitialMount.current = false;
            return;
        }
        onSearchChange(debouncedValue);
    }, [debouncedValue, onSearchChange]);

    // The clear button now only needs to set the local value
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
                className="pl-10 pr-10" // Add padding for icons
            />
            {value && (
                <button
                    onClick={handleClear} // Use the new handler
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
            )}
        </div>
    );
} 