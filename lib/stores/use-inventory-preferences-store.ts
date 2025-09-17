import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InventoryColumnId =
    | 'name'
    | 'brandName'
    | 'serialNumber'
    | 'statusLabel'
    | 'locationName'
    | 'purchaseDateFormatted';

type InventoryPreferencesState = {
    visibleColumns: Record<InventoryColumnId, boolean>;
    toggleColumnVisibility: (columnId: InventoryColumnId) => void;
    setColumnVisibility: (columnId: InventoryColumnId, visible: boolean) => void;
};

const defaultVisibility: Record<InventoryColumnId, boolean> = {
    name: true,
    brandName: true,
    serialNumber: true,
    statusLabel: true,
    locationName: true,
    purchaseDateFormatted: true,
};

export const useInventoryPreferencesStore = create<InventoryPreferencesState>()(
    persist(
        (set, get) => ({
            visibleColumns: defaultVisibility,
            toggleColumnVisibility: (columnId) => {
                const current = get().visibleColumns;
                set({ visibleColumns: { ...current, [columnId]: !current[columnId] } });
            },
            setColumnVisibility: (columnId, visible) => {
                const current = get().visibleColumns;
                set({ visibleColumns: { ...current, [columnId]: visible } });
            },
        }),
        {
            name: 'inventory-preferences',
            version: 1,
        }
    )
);


