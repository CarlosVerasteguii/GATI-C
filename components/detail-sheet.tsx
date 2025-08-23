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

  const getStatusVariant = (status: InventoryItem['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
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
                    <p>{product.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Marca:</span>
                    <p>{product.brand}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Modelo:</span>
                    <p>{product.model}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Número de Serie:</span>
                    <p>{product.serialNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Categoría:</span>
                    <p>{product.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Proveedor:</span>
                    <p>{product.provider || 'No especificado'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Ubicación:</span>
                    <p>{product.location || 'No especificada'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">ID de Contrato:</span>
                    <p>{product.contractId || 'No especificado'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Estado:</span>
                    <p>{product.status}</p>
                  </div>
                  {product.status === 'Asignado' && (
                    <>
                      <div>
                        <span className="text-sm text-muted-foreground">Asignado a:</span>
                        <p>{product.assignedTo || 'No especificado'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Fecha de Asignación:</span>
                        <p>{product.assignmentDate || 'No especificada'}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-sm text-muted-foreground">Costo de Adquisición:</span>
                    <p>{typeof product.cost === 'number' ? product.cost.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : '$0.00'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Garantía:</span>
                    <p>{product.warrantyExpirationDate ? new Date(product.warrantyExpirationDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin garantía registrada'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Detalles Adicionales</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Descripción:</span>
                    <p>{product.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="estado" className="mt-4">
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-muted-foreground">Estado Actual:</span>
                <Badge variant={getStatusVariant(product.status)} className="text-base px-3 py-1">
                  {product.status}
                </Badge>
              </div>

              {product.status === 'Asignado' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Detalles de la Asignación</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Asignado a:</span> {product.assignedTo || 'N/D'}</p>
                    <p><span className="text-muted-foreground">Fecha:</span> {product.assignmentDate ? new Date(product.assignmentDate).toLocaleDateString() : 'N/D'}</p>
                  </div>
                </div>
              )}

              {product.status === 'Prestado' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Detalles del Préstamo</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Prestado a:</span> {product.lentTo || 'N/D'}</p>
                    <p><span className="text-muted-foreground">Fecha de Devolución:</span> {product.returnDate ? new Date(product.returnDate).toLocaleDateString() : 'N/D'}</p>
                  </div>
                </div>
              )}

              {product.status === 'Retirado' && (
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
              {product.history && product.history.length > 0 ? (
                [...product.history].reverse().map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1">
                      {getHistoryIcon(event.action)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.action} por {event.user}</p>
                      <p className="text-sm text-muted-foreground">{event.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.date).toLocaleString()}
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