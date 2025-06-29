'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/app-context';
import { GroupedInventoryTable } from '@/components/inventory/grouped-inventory-table';
import { QuickRetireModal } from '@/components/inventory/modals/quick-retire-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GroupedProduct } from '@/types/inventory';

export default function TestViewPage() {
    const { state } = useApp();
    const [searchQuery, setSearchQuery] = useState('');

    // --- NUEVO ESTADO PARA EL FILTRO DE CATEGORÍA ---
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    const [isRetireModalOpen, setIsRetireModalOpen] = useState(false);

    const groupedInventoryData = useMemo((): GroupedProduct[] => {
        // --- LÓGICA DE FILTRADO MEJORADA ---
        let filteredItems = state.inventoryData;

        // 1. Aplicar filtro de categoría si existe
        if (categoryFilter) {
            filteredItems = filteredItems.filter(item => item.categoria === categoryFilter);
        }
        // --- FIN FILTRADO MEJORADO ---

        const productGroups: { [key: string]: GroupedProduct } = {};

        filteredItems.forEach(item => {
            const groupKey = `${item.marca}-${item.modelo}-${item.categoria}`;
            if (!productGroups[groupKey]) {
                // Determinar si es serializado basado en si hay número de serie
                const isSerialized = item.numeroSerie !== null && item.numeroSerie !== '';

                productGroups[groupKey] = {
                    isParent: true,
                    product: {
                        id: groupKey,
                        nombre: item.nombre,
                        marca: item.marca,
                        modelo: item.modelo,
                        isSerialized: isSerialized
                    },
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
    }, [state.inventoryData, categoryFilter]); // Añadimos categoryFilter a las dependencias

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Página de Pruebas (Con Filtros)</h1>
                <Button onClick={() => setIsRetireModalOpen(true)}>
                    Registrar Retiro Rápido
                </Button>
            </div>

            {/* --- CABECERA DE FILTROS Y BÚSQUEDA --- */}
            <div className="flex items-center gap-4 mb-4">
                <Input
                    placeholder="Buscar por nombre, marca, modelo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />

                {/* --- NUEVO BOTÓN DE FILTROS CON POPOVER --- */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">Filtros</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Buscar categoría..." />
                            <CommandList>
                                <CommandEmpty>No se encontró la categoría.</CommandEmpty>
                                <CommandGroup>
                                    {state.categorias.map((categoria) => (
                                        <CommandItem
                                            key={categoria}
                                            value={categoria}
                                            onSelect={(currentValue) => {
                                                setCategoryFilter(currentValue === categoryFilter ? null : currentValue);
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", categoryFilter === categoria ? "opacity-100" : "opacity-0")} />
                                            {categoria}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {categoryFilter && (
                    <Button variant="ghost" onClick={() => setCategoryFilter(null)}>Limpiar Filtro</Button>
                )}
            </div>
            {/* --- FIN CABECERA --- */}

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