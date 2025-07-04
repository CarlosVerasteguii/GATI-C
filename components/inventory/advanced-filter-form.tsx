'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { AdvancedFilterState } from '@/types/inventory';

interface AdvancedFilterFormProps {
  currentFilters: AdvancedFilterState;
  onApplyFilters: (filters: AdvancedFilterState) => void;
  onClearFilters: () => void;
}

export function AdvancedFilterForm({ currentFilters, onApplyFilters, onClearFilters }: AdvancedFilterFormProps) {
  const [localFilters, setLocalFilters] = React.useState<AdvancedFilterState>(currentFilters);
  const initialFilters = React.useRef(currentFilters);
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
    setLocalFilters(initialFilters.current);
    onClearFilters()
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

      {/* Placeholder para el ComboBox de Proveedor */}
      <div className="flex flex-col space-y-2">
        <Label>Proveedor</Label>
        <p className="text-sm text-muted-foreground">(ComboBox de Proveedor próximamente)</p>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" onClick={handleReset}>Limpiar</Button>
          <Button onClick={handleApply}>Aplicar Filtros</Button>
      </div>
    </div>
  );
} 