'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { AdvancedFilterState } from '@/types/inventory';
import { ProviderCombobox } from '@/components/provider-combobox'; // Importar ComboBox

interface AdvancedFilterFormProps {
  currentFilters: AdvancedFilterState;
  proveedores: string[]; // Añadir prop para la lista de proveedores
  onApplyFilters: (filters: AdvancedFilterState) => void;
  onClearFilters: () => void;
}

export function AdvancedFilterForm({
  currentFilters,
  proveedores, // Recibir la prop
  onApplyFilters,
  onClearFilters
}: AdvancedFilterFormProps) {
  const [localFilters, setLocalFilters] = React.useState<AdvancedFilterState>(currentFilters);

  // Sincroniza el estado local si los filtros principales cambian desde fuera
  React.useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      fechaInicio: dateRange?.from || null,
      fechaFin: dateRange?.to || null,
    }));
  };

  const handleReset = () => {
    const emptyFilters: AdvancedFilterState = {
      fechaInicio: null,
      fechaFin: null,
      proveedor: '',
      contratoId: '',
      costoMin: null,
      costoMax: null,
    };
    setLocalFilters(emptyFilters);
    onClearFilters();
  }

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  return (
    <div className="grid gap-6 py-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="date-range">Fecha de Adquisición</Label>
        <DatePickerWithRange
          id="date-range"
          className="w-full"
          date={{ from: localFilters.fechaInicio ?? undefined, to: localFilters.fechaFin ?? undefined }}
          onDateChange={handleDateChange}
        />
      </div>

      {/* ComboBox de Proveedor */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="provider-filter">Proveedor</Label>
        <ProviderCombobox
          value={localFilters.proveedor}
          onValueChange={(provider) => {
            setLocalFilters(prev => ({ ...prev, proveedor: provider }));
          }}
          placeholder="Selecciona un proveedor"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="contrato-filter">ID de Contrato</Label>
        <Input
          id="contrato-filter"
          placeholder="Ej: CFE-2024-001"
          value={localFilters.contratoId || ''}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, contratoId: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="costo-min">Costo Mínimo</Label>
          <Input
            id="costo-min"
            type="number"
            placeholder="0.00"
            value={localFilters.costoMin ?? ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, costoMin: e.target.value ? parseFloat(e.target.value) : null }))}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="costo-max">Costo Máximo</Label>
          <Input
            id="costo-max"
            type="number"
            placeholder="9999.99"
            value={localFilters.costoMax ?? ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, costoMax: e.target.value ? parseFloat(e.target.value) : null }))}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="ghost" onClick={handleReset}>Limpiar</Button>
        <Button onClick={handleApply}>Aplicar Filtros</Button>
      </div>
    </div>
  );
} 