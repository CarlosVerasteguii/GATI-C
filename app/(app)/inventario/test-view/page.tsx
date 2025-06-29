'use client';

import { useState } from 'react';
import { GroupedInventoryTable } from '@/components/inventory/grouped-inventory-table';
import { mockInventoryData } from '@/lib/mocks/inventory-mock-data';
import { Input } from '@/components/ui/input';

export default function TestViewPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Página de Pruebas - Tabla Anidada</h1>
            <p className="mb-4">Este es un laboratorio aislado para desarrollar el nuevo componente de inventario.</p>

            <div className="mb-4">
                <Input
                    placeholder="Buscar por nombre, marca, modelo, N/S..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border p-4 rounded-lg">
                <GroupedInventoryTable data={mockInventoryData} searchQuery={searchQuery} />
            </div>
        </div>
    );
} 