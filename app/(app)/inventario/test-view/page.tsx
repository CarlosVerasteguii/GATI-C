'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/app-context';
import { GroupedInventoryTable } from '@/components/inventory/grouped-inventory-table';
import { QuickRetireModal } from '@/components/inventory/modals/quick-retire-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { GroupedProduct } from '@/types/inventory';

export default function TestViewPage() {
    const { state } = useApp();
    const [searchQuery, setSearchQuery] = useState('');

    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const [isRetireModalOpen, setIsRetireModalOpen] = useState(false);

    const groupedInventoryData = useMemo((): GroupedProduct[] => {
        // --- LÓGICA DE FILTRADO MEJORADA ---
        let filteredItems = state.inventoryData;

        // 1. Aplicar filtro de categoría si existe
        if (categoryFilter) {
            filteredItems = filteredItems.filter(item => item.categoria === categoryFilter);
        }

        // 2. Aplicar filtro de marca si existe
        if (brandFilter) {
            filteredItems = filteredItems.filter(item => item.marca === brandFilter);
        }

        // 3. Aplicar filtro de estado si existe
        if (statusFilter) {
            filteredItems = filteredItems.filter(item => item.estado === statusFilter);
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
    }, [state.inventoryData, categoryFilter, brandFilter, statusFilter]);

    const hasActiveFilters = categoryFilter || brandFilter || statusFilter;

    // --- COMPONENTE REUTILIZABLE PARA LOS POPOVERS DE FILTRO ---
    const FilterPopover = ({ title, options, selectedValue, onSelect }: {
        title: string,
        options: string[],
        selectedValue: string | null,
        onSelect: (value: string | null) => void
    }) => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">{title}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={`Buscar ${title.toLowerCase()}...`} />
                    <CommandList>
                        <CommandEmpty>No se encontró.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option}
                                    value={option}
                                    onSelect={() => onSelect(option === selectedValue ? null : option)}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", selectedValue === option ? "opacity-100" : "opacity-0")} />
                                    {option}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Página de Pruebas (Con Filtros)</h1>
                <Button onClick={() => setIsRetireModalOpen(true)}>
                    Registrar Retiro Rápido
                </Button>
            </div>

            <div className="flex items-center gap-4 mb-2">
                <Input
                    placeholder="Buscar por nombre, marca, modelo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />

                {/* --- NUEVA INTERFAZ DE BOTONES DE FILTRO --- */}
                <FilterPopover
                    title="Categoría"
                    options={state.categorias}
                    selectedValue={categoryFilter}
                    onSelect={setCategoryFilter}
                />
                <FilterPopover
                    title="Marca"
                    options={state.marcas}
                    selectedValue={brandFilter}
                    onSelect={setBrandFilter}
                />
                <FilterPopover
                    title="Estado"
                    options={[...new Set(state.inventoryData.map(item => item.estado))]}
                    selectedValue={statusFilter}
                    onSelect={setStatusFilter}
                />
            </div>

            {/* --- NUEVA ÁREA PARA MOSTRAR BADGES DE FILTROS ACTIVOS --- */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 mb-4">
                    <p className="text-sm text-muted-foreground">Filtros activos:</p>
                    {categoryFilter && (
                        <Badge variant="secondary">
                            Categoría: {categoryFilter}
                            <X
                                className="ml-2 h-3 w-3 cursor-pointer"
                                onClick={() => setCategoryFilter(null)}
                            />
                        </Badge>
                    )}
                    {brandFilter && (
                        <Badge variant="secondary">
                            Marca: {brandFilter}
                            <X
                                className="ml-2 h-3 w-3 cursor-pointer"
                                onClick={() => setBrandFilter(null)}
                            />
                        </Badge>
                    )}
                    {statusFilter && (
                        <Badge variant="secondary">
                            Estado: {statusFilter}
                            <X
                                className="ml-2 h-3 w-3 cursor-pointer"
                                onClick={() => setStatusFilter(null)}
                            />
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setCategoryFilter(null);
                            setBrandFilter(null);
                            setStatusFilter(null);
                        }}
                    >
                        Limpiar todo
                    </Button>
                </div>
            )}

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