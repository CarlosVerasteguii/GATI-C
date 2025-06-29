'use client';

import { useState } from 'react';
import { GroupedInventoryTable } from '@/components/inventory/grouped-inventory-table';
import { mockInventoryData, mockUsers as initialUsers } from '@/lib/mocks/inventory-mock-data';
import { Input } from '@/components/ui/input';

export default function TestViewPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // --- ESTADO CENTRALIZADO PARA USUARIOS ---
    const [users, setUsers] = useState(initialUsers);

    const handleAddUser = (newUserLabel: string) => {
        const newUserValue = newUserLabel.toLowerCase().replace(/\s+/g, '.');
        const newUser = { value: newUserValue, label: newUserLabel };

        // Verificamos si el usuario ya existe antes de añadirlo
        const userExists = users.some(user => user.value === newUserValue);
        if (!userExists) {
            // Añadimos el nuevo usuario a la lista
            setUsers(prevUsers => [...prevUsers, newUser]);
            console.log("Nuevo usuario añadido a la lista central:", newUser);
        }
        return newUserValue; // Devolvemos el 'value' para que el formulario lo use
    };

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
                {/* Pasamos la lista de usuarios y la función para añadir como props */}
                <GroupedInventoryTable
                    data={mockInventoryData}
                    searchQuery={searchQuery}
                    users={users}
                    onAddUser={handleAddUser}
                />
            </div>
        </div>
    );
} 