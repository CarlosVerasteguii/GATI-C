import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { InventoryItem } from "@/types/inventory"

interface DetailSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: InventoryItem | null
}

export function DetailSheet({ open, onOpenChange, product }: DetailSheetProps) {
    if (!product) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Detalles del Activo</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                    <div>
                        <h3 className="font-medium">Información Básica</h3>
                        <div className="mt-2 space-y-2">
                            <div>
                                <span className="text-sm text-muted-foreground">Nombre:</span>
                                <p>{product.nombre}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Marca:</span>
                                <p>{product.marca}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Modelo:</span>
                                <p>{product.modelo}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Número de Serie:</span>
                                <p>{product.numeroSerie || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Categoría:</span>
                                <p>{product.categoria}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Proveedor:</span>
                                <p>{product.proveedor || 'No especificado'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Ubicación:</span>
                                <p>{product.ubicacion || 'No especificada'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">ID de Contrato:</span>
                                <p>{product.contratoId || 'No especificado'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Estado:</span>
                                <p>{product.estado}</p>
                            </div>
                            {product.estado === 'Asignado' && (
                                <>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Asignado a:</span>
                                        <p>{product.asignadoA || 'No especificado'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Fecha de Asignación:</span>
                                        <p>{product.fechaAsignacion || 'No especificada'}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium">Detalles Adicionales</h3>
                        <div className="mt-2 space-y-2">
                            <div>
                                <span className="text-sm text-muted-foreground">Descripción:</span>
                                <p>{product.descripcion}</p>
                            </div>
                            {/* {product.asignadoA && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Asignado a:</span>
                                    <p>{product.asignadoA}</p>
                                </div>
                            )}
                            {product.fechaAsignacion && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Fecha de Asignación:</span>
                                    <p>{new Date(product.fechaAsignacion).toLocaleDateString()}</p>
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
} 