'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/app-context';
import { GroupedInventoryTable } from '@/components/inventory/grouped-inventory-table';
import { QuickRetireModal } from '@/components/inventory/modals/quick-retire-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestViewPage() {
    const { state } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [isRetireModalOpen, setIsRetireModalOpen] = useState(false);

    const groupedInventoryData = useMemo(() => {
        const productGroups: { [key: string]: any } = {};

        state.inventoryData.forEach(item => {
            const groupKey = `${item.marca}-${item.modelo}-${item.categoria}`;
            if (!productGroups[groupKey]) {
                productGroups[groupKey] = {
                    isParent: true,
                    product: { ...item, id: groupKey },
                    summary: { total: 0, disponible: 0, estados: {} },
                    children: [],
                };
            }
            productGroups[groupKey].children.push(item);
            productGroups[groupKey].summary.total++;
            if (item.estado === 'Disponible') {
                productGroups[groupKey].summary.disponible++;
            }
        });

        return Object.values(productGroups);
    }, [state.inventoryData]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Página de Pruebas (Con Datos Reales)</h1>
                <Button onClick={() => setIsRetireModalOpen(true)}>
                    Registrar Retiro Rápido
                </Button>
            </div>
            <div className="mb-4">
                <Input
                    placeholder="Buscar por nombre, marca, modelo, N/S..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border p-4 rounded-lg">
                <GroupedInventoryTable
                    data={groupedInventoryData}
                    searchQuery={searchQuery}
                />
            </div>

            <QuickRetireModal
                isOpen={isRetireModalOpen}
                onClose={() => setIsRetireModalOpen(false)}
                inventoryItems={groupedInventoryData}
            />
        </div>
    );
} 