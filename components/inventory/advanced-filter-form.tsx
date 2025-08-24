'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { AdvancedFilterState } from '@/types/inventory';
import { ProviderCombobox } from '@/components/provider-combobox'; // Import ComboBox
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox

interface AdvancedFilterFormProps {
  currentFilters: AdvancedFilterState;
  providers: string[]; // Add prop for providers list
  onApplyFilters: (filters: AdvancedFilterState) => void;
  onClearFilters: () => void;
  // New props for serial number filter
  hasSerialNumber?: boolean;
  onSerialNumberFilterChange?: (isChecked: boolean) => void;
}

export function AdvancedFilterForm({
  currentFilters,
  providers, // Receive the prop
  onApplyFilters,
  onClearFilters,
  // New props
  hasSerialNumber,
  onSerialNumberFilterChange
}: AdvancedFilterFormProps) {
  const [localFilters, setLocalFilters] = React.useState<AdvancedFilterState>(currentFilters);

  // Sync local state if main filters change from outside
  React.useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      startDate: dateRange?.from || null,
      endDate: dateRange?.to || null,
    }));
  };

  const handleReset = () => {
    const emptyFilters: AdvancedFilterState = {
      startDate: null,
      endDate: null,
      provider: '',
      contractId: '',
      minCost: null,
      maxCost: null,
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
        <Label htmlFor="date-range">Acquisition Date</Label>
        <DatePickerWithRange
          id="date-range"
          className="w-full"
          date={{ from: localFilters.startDate ?? undefined, to: localFilters.endDate ?? undefined }}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Provider ComboBox */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="provider-filter">Provider</Label>
        <ProviderCombobox
          value={localFilters.provider}
          onValueChange={(provider) => {
            setLocalFilters(prev => ({ ...prev, provider: provider }));
          }}
          placeholder="Select a provider"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="contract-filter">Contract ID</Label>
        <Input
          id="contract-filter"
          placeholder="Ex: CFE-2024-001"
          value={localFilters.contractId || ''}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, contractId: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="min-cost">Minimum Cost</Label>
          <Input
            id="min-cost"
            type="number"
            placeholder="0.00"
            value={localFilters.minCost ?? ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, minCost: e.target.value ? parseFloat(e.target.value) : null }))}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="max-cost">Maximum Cost</Label>
          <Input
            id="max-cost"
            type="number"
            placeholder="9999.99"
            value={localFilters.maxCost ?? ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, maxCost: e.target.value ? parseFloat(e.target.value) : null }))}
          />
        </div>
      </div>

      {/* Serial Number Filter */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="serial-number-filter"
          checked={hasSerialNumber}
          onCheckedChange={(checked) => {
            // Ensure it's a boolean value
            const isChecked = checked === true;
            onSerialNumberFilterChange?.(isChecked);
          }}
        />
        <Label
          htmlFor="serial-number-filter"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Only show products with Serial Number
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="ghost" onClick={handleReset}>Clear</Button>
        <Button onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  );
} 