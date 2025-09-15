import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';

export type InventoryViewModel = ProductResultType & {
  statusLabel: string;
  statusColor: string;
  purchaseDateFormatted: string | null;
  brandName: string;
  categoryName: string;
  locationName: string;
};

function getName(value: unknown, fallback: string): string {
  if (value && typeof value === 'object' && 'name' in value) {
    const n = (value as any).name;
    if (typeof n === 'string' && n.trim()) return n;
  }
  return fallback;
}

function resolveStatus(condition: string | null | undefined): {
  statusLabel: InventoryViewModel['statusLabel'];
  statusColor: InventoryViewModel['statusColor'];
} {
  const raw = (condition ?? '').toString().toLowerCase();

  if (raw.includes('asign') || raw.includes('assign')) {
    return { statusLabel: 'Asignado', statusColor: 'assigned' };
  }
  if (raw.includes('prest') || raw.includes('loan')) {
    return { statusLabel: 'Prestado', statusColor: 'loaned' };
  }
  if (raw.includes('repar') || raw.includes('repair')) {
    return { statusLabel: 'En reparación', statusColor: 'repairing' };
  }
  if (raw.includes('retir') || raw.includes('decom') || raw.includes('baja')) {
    return { statusLabel: 'Retirado', statusColor: 'retired' };
  }
  // default / available
  return { statusLabel: 'Disponible', statusColor: 'available' };
}

export function toViewModel(product: ProductResultType): InventoryViewModel {
  const { statusLabel, statusColor } = resolveStatus(product.condition);

  return {
    ...product,
    statusLabel,
    statusColor,
    purchaseDateFormatted: product.purchaseDate
      ? new Date(product.purchaseDate).toLocaleDateString('es-ES')
      : null,
    brandName: getName(product.brand ?? null, 'Sin Marca'),
    categoryName: getName(product.category ?? null, 'Sin Categoría'),
    locationName: getName(product.location ?? null, 'Sin Ubicación'),
  };
}

export function toViewModels(products: ProductResultType[]): InventoryViewModel[] {
  return products.map(toViewModel);
}

