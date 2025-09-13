"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"

interface TaskAuditLogSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: any // The pending task object
}

export function TaskAuditLogSheet({ open, onOpenChange, task }: TaskAuditLogSheetProps) {
  if (!task) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Log de Auditoría - Tarea #{task.id}
          </SheetTitle>
          <SheetDescription>Detalles y eventos registrados para esta tarea.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-150px)] pr-4">
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Información General</h3>
              <p className="text-sm text-muted-foreground">
                Tipo: <span className="font-medium text-foreground">{task.type}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Estado: <span className="font-medium text-foreground">{task.status}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Creado por: <span className="font-medium text-foreground">{task.createdBy}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Fecha de Creación:{" "}
                <span className="font-medium text-foreground">{new Date(task.creationDate).toLocaleString()}</span>
              </p>
            </div>

            {task.details && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Detalles de la Tarea</h3>
                  {task.type === "CARGA" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Producto: <span className="font-medium text-foreground">{task.details.productName}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: <span className="font-medium text-foreground">{task.details.quantity}</span>
                      </p>
                      {task.details.serialNumbers && (
                        <p className="text-sm text-muted-foreground">
                          Números de Serie:{" "}
                          <span className="font-mono text-foreground">{task.details.serialNumbers.join(", ")}</span>
                        </p>
                      )}
                      {task.details.brand && (
                        <p className="text-sm text-muted-foreground">
                          Marca: <span className="font-medium text-foreground">{task.details.brand}</span>
                        </p>
                      )}
                      {task.details.model && (
                        <p className="text-sm text-muted-foreground">
                          Modelo: <span className="font-medium text-foreground">{task.details.model}</span>
                        </p>
                      )}
                      {task.details.category && (
                        <p className="text-sm text-muted-foreground">
                          Categoría: <span className="font-medium text-foreground">{task.details.category}</span>
                        </p>
                      )}
                      {task.details.description && (
                        <p className="text-sm text-muted-foreground">
                          Descripción: <span className="font-medium text-foreground">{task.details.description}</span>
                        </p>
                      )}
                    </>
                  )}
                  {task.type === "RETIRO" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Motivo del Retiro:{" "}
                        <span className="font-medium text-foreground">{task.details.reason || "N/A"}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Notas: <span className="font-medium text-foreground">{task.details.notes || "N/A"}</span>
                      </p>
                      {task.details.itemsImplicados && task.details.itemsImplicados.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Artículos Implicados:</p>
                          <ul className="list-disc list-inside text-sm text-foreground">
                            {task.details.itemsImplicados.map((item: any, index: number) => (
                              <li key={index}>
                                {item.name} {item.serial ? `(N/S: ${item.serial})` : `(QTY: ${item.quantity})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}

            {task.auditLog && task.auditLog.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Eventos del Log</h3>
                  {task.auditLog.map((log: any, index: number) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <p className="text-sm font-medium text-foreground">{log.event}</p>
                      <p className="text-xs text-muted-foreground">
                        Por: {log.user} el {new Date(log.dateTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{log.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
