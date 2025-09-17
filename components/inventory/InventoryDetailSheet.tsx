'use client';

import type { InventoryViewModel } from '@/types/view-models/inventory';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export type InventoryDetailSheetProps = {
    product: InventoryViewModel | null;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export default function InventoryDetailSheet({ product, isOpen, onOpenChange }: InventoryDetailSheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                {!product ? (
                    <div className="py-8 text-sm text-gray-500">Sin producto seleccionado</div>
                ) : (
                    <div className="space-y-6">
                        <SheetHeader>
                            <SheetTitle className="truncate">{product.name}</SheetTitle>
                            <SheetDescription>
                                Estado: <span className="font-medium">{product.statusLabel}</span>
                            </SheetDescription>
                        </SheetHeader>

                        <section>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Información General</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <div className="text-gray-500">Marca</div>
                                    <div className="font-medium">{product.brandName}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Categoría</div>
                                    <div className="font-medium">{product.categoryName}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Ubicación</div>
                                    <div className="font-medium">{product.locationName}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Número de Serie</div>
                                    <div className="font-medium">{product.serialNumber ?? '—'}</div>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Fechas</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <div className="text-gray-500">Fecha de Compra</div>
                                    <div className="font-medium">{product.purchaseDateFormatted ?? '—'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Última Actualización</div>
                                    <div className="font-medium">{product.updatedAt ? new Date(product.updatedAt).toLocaleString('es-ES') : '—'}</div>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h3>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                {product.description?.trim() || '—'}
                            </div>
                        </section>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}


