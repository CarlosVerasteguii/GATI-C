import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryTable from '@/components/inventory/InventoryTable';
import type { InventoryViewModel } from '@/types/view-models/inventory';

const vm = (overrides: Partial<InventoryViewModel> = {}): InventoryViewModel => ({
    id: 'p1',
    name: 'Laptop',
    brandName: 'Marca A',
    categoryName: 'Portátiles',
    locationName: 'Almacén',
    serialNumber: '',
    statusLabel: 'Disponible',
    statusColor: 'available',
    purchaseDateFormatted: '2024-01-01',
    createdAt: new Date(),
    updatedAt: new Date(),
    description: '',
    condition: 'available',
    ...overrides,
} as InventoryViewModel);

describe('InventoryTable', () => {
    it('renders rows from products', () => {
        render(<InventoryTable products={[vm(), vm({ id: 'p2', name: 'Mouse' })]} isLoading={false} />);
        expect(screen.getByText('Laptop')).toBeInTheDocument();
        expect(screen.getByText('Mouse')).toBeInTheDocument();
    });

    it('groups non-serialized items into a stack summary', () => {
        // Two items without serial number and same grouping keys will stack
        render(
            <InventoryTable
                products={[vm({ id: 'a' }), vm({ id: 'b' })]}
                isLoading={false}
            />
        );
        // Expect summary row with (x2)
        expect(screen.getByText(/Laptop \(x2\)/)).toBeInTheDocument();
    });

    it('calls onProductSelect when clicking a row', () => {
        const onProductSelect = vi.fn();
        render(<InventoryTable products={[vm({ id: 'p3' })]} isLoading={false} onProductSelect={onProductSelect} />);
        fireEvent.click(screen.getByText('Laptop'));
        expect(onProductSelect).toHaveBeenCalled();
    });

    it('renders serialized items as individual rows (no grouping)', () => {
        render(
            <InventoryTable
                products={[vm({ id: 's1', serialNumber: 'SN-001' }), vm({ id: 's2', serialNumber: 'SN-002' })]}
                isLoading={false}
            />
        );
        // Both rows should appear individually
        expect(screen.getAllByText('—').length).toBeGreaterThan(0); // other cells
        // Ensure no stack summary appears
        expect(screen.queryByText(/\(x2\)/)).toBeNull();
    });

    it('expands and collapses a stack group', () => {
        render(<InventoryTable products={[vm({ id: 'g1' }), vm({ id: 'g2' })]} isLoading={false} />);
        // Expand button is in the first cell of the group summary row (the button shows + or −)
        const expandBtn = screen.getAllByRole('button').find((b) => ['+', '−'].includes((b as HTMLButtonElement).textContent || '')) as HTMLButtonElement;
        expect(expandBtn).toBeTruthy();
        fireEvent.click(expandBtn); // expand
        // Now both item rows should be visible; click again to collapse
        fireEvent.click(expandBtn);
    });

    it('group checkbox selects and deselects all items in the stack', () => {
        const onRowSelectionChange = vi.fn();
        render(
            <InventoryTable
                products={[vm({ id: 'x1' }), vm({ id: 'x2' })]}
                isLoading={false}
                onRowSelectionChange={onRowSelectionChange}
            />
        );
        // First checkbox in summary row toggles selection of the group
        const groupCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
        fireEvent.click(groupCheckbox);
        expect(onRowSelectionChange).toHaveBeenCalled();
        fireEvent.click(groupCheckbox);
        expect(onRowSelectionChange).toHaveBeenCalledTimes(2);
    });
});


