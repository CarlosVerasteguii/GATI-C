'use client';

import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/contexts/app-context';
import { GroupedInventoryTable } from '@/components/inventory/grouped-inventory-table';
import { QuickRetireModal } from '@/components/inventory/modals/quick-retire-modal';
import { ColumnToggleMenu } from '@/components/inventory/column-toggle-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { GroupedProduct, InventoryItem } from '@/types/inventory';

export default function TestViewPage() {
    const allColumns = [
        { id: 'marca', label: 'Marca' },
        { id: 'modelo', label: 'Modelo' },
        { id: 'numeroSerie', label: 'Número de Serie' },
        { id: 'estado', label: 'Estado' },
        // Añadiremos más columnas aquí en el futuro
    ];

    const { state } = useApp();
    const [searchQuery, setSearchQuery] = useState('');

    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [advancedFilters, setAdvancedFilters] = useState<Record<string, string | null>>({});

    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
        marca: true,
        modelo: true,
        numeroSerie: true,
        estado: true,
    });

    const [isRetireModalOpen, setIsRetireModalOpen] = useState(false);

    // --- NUEVOS ESTADOS PARA PRUEBA DE INTEGRACIÓN ---
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

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

        // 4. Aplicar filtros avanzados
        Object.entries(advancedFilters).forEach(([columnId, filterValue]) => {
            if (filterValue) {
                filteredItems = filteredItems.filter(item => {
                    const itemValue = (item as any)[columnId]?.toString().toLowerCase();
                    return itemValue?.includes(filterValue.toLowerCase());
                });
            }
        });
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
    }, [state.inventoryData, categoryFilter, brandFilter, statusFilter, advancedFilters]);

    // --- QUERY EFECTIVO PARA AUTO-EXPANSIÓN ---
    // Combinamos el searchQuery normal con el filtro de número de serie para la auto-expansión
    const effectiveSearchQuery = useMemo(() => {
        if (advancedFilters.numeroSerie) {
            return advancedFilters.numeroSerie;
        }
        return searchQuery;
    }, [searchQuery, advancedFilters.numeroSerie]);

    const hasActiveFilters = categoryFilter || brandFilter || statusFilter || Object.values(advancedFilters).some(value => value);

    const clearAllFilters = () => {
        setCategoryFilter(null);
        setBrandFilter(null);
        setStatusFilter(null);
        setAdvancedFilters({});
    };

    // --- NUEVOS MANEJADORES PARA PRUEBA DE INTEGRACIÓN ---
    const handleRowSelect = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedRowIds(prev => [...prev, id]);
        } else {
            setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allChildIds = groupedInventoryData.flatMap(group => group.children.map(child => child.id));
            setSelectedRowIds(allChildIds);
        } else {
            setSelectedRowIds([]);
        }
    };

    const handleAction = (action: string, product: GroupedProduct | InventoryItem) => {
        console.log(`Acción: ${action} ejecutada en:`, product);
        // Aquí conectaríamos con los manejadores reales de la página principal
    };

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
                <h1 className="text-2xl font-bold">Página de Pruebas (Con Filtros + Selección)</h1>
                <Button onClick={() => setIsRetireModalOpen(true)}>
                    Registrar Retiro Rápido
                </Button>
            </div>

            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Input
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs"
                />

                {/* --- NUEVA Y MEJORADA INTERFAZ DE FILTROS --- */}
                <div className="flex items-center gap-2 border-l pl-2">
                    <p className="text-sm font-semibold">Filtros:</p>
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

                <div className="flex items-center gap-2 border-l pl-2">
                    <p className="text-sm font-semibold">Configuración:</p>
                    <ColumnToggleMenu
                        columns={allColumns}
                        visibleColumns={visibleColumns}
                        onColumnVisibilityChange={setVisibleColumns}
                    />

                    {/* El Popover de Filtros Avanzados ahora es más simple */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Filtros Avanzados</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-4" align="start">
                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Filtros Avanzados</h4>
                                <p className="text-xs text-muted-foreground">Filtra por columnas visibles.</p>

                                {allColumns.filter(c => c.id === 'numeroSerie').map(column => (
                                    visibleColumns[column.id] ? (
                                        <div key={column.id}>
                                            <Label className="text-xs font-semibold">{column.label}</Label>
                                            <FilterPopover
                                                title={`Seleccionar ${column.label}`}
                                                options={[...new Set(state.inventoryData.map(item => item.numeroSerie).filter(Boolean) as string[])]}
                                                selectedValue={advancedFilters[column.id] || null}
                                                onSelect={(value) => setAdvancedFilters(prev => ({ ...prev, [column.id]: value }))}
                                            />
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
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
                    {Object.entries(advancedFilters).map(([key, value]) => value && (
                        <Badge key={key} variant="secondary">
                            {allColumns.find(c => c.id === key)?.label}: {value}
                            <X
                                className="ml-2 h-3 w-3 cursor-pointer"
                                onClick={() => setAdvancedFilters(prev => ({ ...prev, [key]: null }))}
                            />
                        </Badge>
                    ))}
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Limpiar todos
                    </Button>
                </div>
            )}

            {/* --- NUEVA ÁREA PARA MOSTRAR ELEMENTOS SELECCIONADOS --- */}
            {selectedRowIds.length > 0 && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm font-medium">{selectedRowIds.length} elemento(s) seleccionado(s)</p>
                    <Button variant="outline" size="sm" onClick={() => setSelectedRowIds([])}>
                        Limpiar selección
                    </Button>
                </div>
            )}

            {/* --- TABLA ACTUALIZADA CON NUEVAS PROPS --- */}
            <GroupedInventoryTable
                data={groupedInventoryData}
                searchQuery={effectiveSearchQuery}
                visibleColumns={visibleColumns}
                selectedRowIds={selectedRowIds}
                onRowSelect={handleRowSelect}
                onSelectAll={handleSelectAll}
                onAction={handleAction}
                isLector={false} // Para pruebas, siempre permitir acciones
            />

            <QuickRetireModal
                isOpen={isRetireModalOpen}
                onClose={() => setIsRetireModalOpen(false)}
                inventoryItems={groupedInventoryData}
                productData={null}
            />
        </div>
    );
} 