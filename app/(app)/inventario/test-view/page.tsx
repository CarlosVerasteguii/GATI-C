'use client';

import { useState } from 'react';
import { GroupedInventoryTable } from '@/components/inventory/grouped-inventory-table';
import { mockInventoryData } from '@/lib/mocks/inventory-mock-data';
import { QuickRetireModal } from '@/components/inventory/modals/quick-retire-modal';
import { Button } from '@/components/ui/button';

export default function TestViewPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isRetireModalOpen, setIsRetireModalOpen] = useState(false);
    const [users, setUsers] = useState([
        { value: 'user1', label: 'Usuario 1' },
        { value: 'user2', label: 'Usuario 2' },
    ]);

    const handleAddUser = (label: string) => {
        const newValue = `user${users.length + 1}`;
        setUsers(prev => [...prev, { value: newValue, label }]);
        return newValue;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Página de Pruebas - Tabla Anidada</h1>
                <Button onClick={() => setIsRetireModalOpen(true)}>
                    Registrar Retiro Rápido
                </Button>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre, marca, modelo o número de serie..."
                    className="w-full p-2 border rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <GroupedInventoryTable
                    data={mockInventoryData}
                    searchQuery={searchQuery}
                    users={users}
                    onAddUser={handleAddUser}
                />
            </div>

            <QuickRetireModal
                isOpen={isRetireModalOpen}
                onClose={() => setIsRetireModalOpen(false)}
                inventoryItems={mockInventoryData}
            />
        </div>
    );
} 