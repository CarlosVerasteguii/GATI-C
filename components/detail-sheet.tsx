import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { InventoryItem } from "@/types/inventory"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, UserCheck, Undo2, Wrench, Info, ArrowRightLeft, Pencil, Archive, History } from 'lucide-react';

interface DetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: InventoryItem | null
}

export function DetailSheet({ open, onOpenChange, product }: DetailSheetProps) {
  if (!product) return null

  const getStatusVariant = (status: InventoryItem['estado']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Disponible': return 'default';
      case 'Asignado': return 'secondary';
      case 'Prestado': return 'secondary';
      case 'PENDIENTE_DE_RETIRO': return 'outline';
      case 'Retirado': return 'destructive';
      default: return 'outline';
    }
  };

  const getHistoryIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'creación': return <PlusCircle className="h-5 w-5 text-green-500" />;
      case 'asignación': return <UserCheck className="h-5 w-5 text-purple-500" />;
      case 'préstamo': return <ArrowRightLeft className="h-5 w-5 text-yellow-500" />;
      case 'devolución': return <Undo2 className="h-5 w-5 text-blue-500" />;
      case 'edición': return <Pencil className="h-5 w-5 text-gray-500" />;
      case 'retiro': return <Archive className="h-5 w-5 text-red-500" />;
      default: return <History className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalles del Activo</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="estado">Estado</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="relacionados">Activos Relacionados</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Información Básica</h3>
                <div className="space-y-2">
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
                  <div>
                    <span className="text-sm text-muted-foreground">Costo de Adquisición:</span>
                    <p>{typeof product.costo === 'number' ? product.costo.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : '$0.00'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Garantía:</span>
                    <p>{product.fechaVencimientoGarantia ? new Date(product.fechaVencimientoGarantia).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin garantía registrada'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Detalles Adicionales</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Descripción:</span>
                    <p>{product.descripcion}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="estado" className="mt-4">
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-muted-foreground">Estado Actual:</span>
                <Badge variant={getStatusVariant(product.estado)} className="text-base px-3 py-1">
                  {product.estado}
                </Badge>
              </div>

              {product.estado === 'Asignado' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Detalles de la Asignación</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Asignado a:</span> {product.asignadoA || 'N/D'}</p>
                    <p><span className="text-muted-foreground">Fecha:</span> {product.fechaAsignacion ? new Date(product.fechaAsignacion).toLocaleDateString() : 'N/D'}</p>
                  </div>
                </div>
              )}

              {product.estado === 'Prestado' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Detalles del Préstamo</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Prestado a:</span> {product.prestadoA || 'N/D'}</p>
                    <p><span className="text-muted-foreground">Fecha de Devolución:</span> {product.fechaDevolucion ? new Date(product.fechaDevolucion).toLocaleDateString() : 'N/D'}</p>
                  </div>
                </div>
              )}

              {product.estado === 'Retirado' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Detalles del Retiro</h4>
                  <div className="space-y-2 text-sm">
                    {/* Aquí irían los detalles específicos del retiro */}
                    <p><span className="text-muted-foreground">Motivo:</span> Fin de vida útil</p>
                    <p><span className="text-muted-foreground">Fecha de retiro:</span> 2024-01-15</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="historial" className="mt-4">
            <div className="space-y-4">
              {product.historial && product.historial.length > 0 ? (
                [...product.historial].reverse().map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1">
                      {getHistoryIcon(event.accion)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.accion} por {event.usuario}</p>
                      <p className="text-sm text-muted-foreground">{event.detalles}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.fecha).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay historial de actividades para este activo.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documentos" className="mt-4">
            <p>La lista de documentos adjuntos irá aquí.</p>
          </TabsContent>

          <TabsContent value="relacionados" className="mt-4">
            <p>La información sobre activos relacionados irá aquí.</p>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
} 