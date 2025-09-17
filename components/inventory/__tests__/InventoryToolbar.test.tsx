import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryToolbar from '@/components/inventory/InventoryToolbar';
import userEvent from '@testing-library/user-event';

describe('InventoryToolbar', () => {
    it('renders with initial filters', () => {
        render(
            <InventoryToolbar
                initialFilters={{ q: 'laptop', brandId: 'b1', categoryId: 'c1', condition: 'new' }}
                onFilterChange={vi.fn()}
            />
        );
        // Input should have initial value
        const input = screen.getByLabelText('Búsqueda') as HTMLInputElement;
        expect(input.value).toBe('laptop');
    });

    it('calls onFilterChange when search input changes', () => {
        const onFilterChange = vi.fn();
        render(
            <InventoryToolbar
                initialFilters={{}}
                onFilterChange={onFilterChange}
            />
        );

        const input = screen.getByLabelText('Búsqueda') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'mouse' } });
        expect(onFilterChange).toHaveBeenCalledWith({ q: 'mouse' });
    });

    it('calls onFilterChange with { q: undefined } when clearing search', () => {
        const onFilterChange = vi.fn();
        render(<InventoryToolbar initialFilters={{ q: 'abc' }} onFilterChange={onFilterChange} />);
        const input = screen.getByLabelText('Búsqueda') as HTMLInputElement;
        fireEvent.change(input, { target: { value: '' } });
        expect(onFilterChange).toHaveBeenCalledWith({ q: undefined });
    });

    it('updates brand filter via Select and calls onFilterChange with brandId', async () => {
        const onFilterChange = vi.fn();
        render(<InventoryToolbar initialFilters={{}} onFilterChange={onFilterChange} />);
        const user = userEvent.setup();
        const brandTrigger = screen.getByLabelText('Marca');
        await user.click(brandTrigger);
        await user.click(screen.getByRole('option', { name: /Marca A/i }).catch?.(() => screen.getByText('Marca A')) as any);
        expect(onFilterChange).toHaveBeenCalledWith({ brandId: 'b1' });
    });

    it('updates category filter via Select and calls onFilterChange with categoryId', async () => {
        const onFilterChange = vi.fn();
        render(<InventoryToolbar initialFilters={{}} onFilterChange={onFilterChange} />);
        const user = userEvent.setup();
        const categoryTrigger = screen.getByLabelText('Categoría');
        await user.click(categoryTrigger);
        await user.click(screen.getByRole('option', { name: /Categoría X/i }).catch?.(() => screen.getByText('Categoría X')) as any);
        expect(onFilterChange).toHaveBeenCalledWith({ categoryId: 'c1' });
    });
});


