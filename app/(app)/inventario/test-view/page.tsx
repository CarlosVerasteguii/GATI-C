import { GroupedInventoryTable } from '@/components/inventory/grouped-inventory-table';
import { mockInventoryData } from '@/lib/mocks/inventory-mock-data';

export default function TestViewPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Página de Pruebas - Tabla Anidada</h1>
            <p className="mb-4">Este es un laboratorio aislado para desarrollar el nuevo componente de inventario.</p>
            <div className="border p-4 rounded-lg">
                <GroupedInventoryTable data={mockInventoryData} />
            </div>
        </div>
    );
} 