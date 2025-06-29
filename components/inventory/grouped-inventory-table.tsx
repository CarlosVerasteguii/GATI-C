'use client';

import { useEffect } from 'react';

// Asegúrate de definir el tipo para 'data' basándote en la estructura del mock
type GroupedInventoryData = any; // Temporal, podemos refinarlo luego

export function GroupedInventoryTable({ data }: { data: GroupedInventoryData[] }) {
    useEffect(() => {
        console.log('Datos recibidos por la tabla agrupada (cliente):', data);
    }, [data]);

    return (
        <div>
            <p>Tabla de Inventario Agrupada (en construcción)...</p>
        </div>
    );
} 