"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Info, History, FileText, Calendar, Package, User, Clock, Tag } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ActivityDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: any
}

const renderDetail = (label: string, value: any, className?: string) => {
  if (value === undefined || value === null || value === "") return null
  return (
    <div className={cn("flex justify-between items-center py-1", className)}>
      <dt className="text-sm font-medium text-muted-foreground">{label}:</dt>
      <dd className="text-sm text-right">{value}</dd>
    </div>
  )
}

const renderDiff = (oldData: any, newData: any) => {
  const keys = Array.from(new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]))

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="space-y-2">
        <h4 className="font-semibold text-muted-foreground">Antes:</h4>
        {keys.map((key) => {
          const oldValue = oldData?.[key]
          const newValue = newData?.[key]
          const changed = oldValue !== newValue
          return (
            <div key={key} className={cn("flex justify-between", changed && "font-medium")}>
              <span className="text-muted-foreground">{key}:</span>
              <span className={cn(changed && "text-red-500 line-through")}>
                {oldValue !== undefined ? String(oldValue) : "N/A"}
              </span>
            </div>
          )
        })}
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold text-muted-foreground">Después:</h4>
        {keys.map((key) => {
          const oldValue = oldData?.[key]
          const newValue = newData?.[key]
          const changed = oldValue !== newValue
          return (
            <div key={key} className={cn("flex justify-between", changed && "font-medium")}>
              <span className="text-muted-foreground">{key}:</span>
              <span className={cn(changed && "text-green-500")}>
                {newValue !== undefined ? String(newValue) : "N/A"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Función para formatear fechas con manejo de errores
const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return "Fecha inválida";
    return format(date, "dd/MM/yyyy", { locale: es });
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Fecha inválida";
  }
};

// Función para formatear fechas con hora con manejo de errores
const formatDateTime = (dateString: string) => {
  try {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return "Fecha inválida";
    return format(date, "dd/MM/yyyy, HH:mm:ss", { locale: es });
  } catch (error) {
    console.error("Error al formatear fecha y hora:", error);
    return "Fecha inválida";
  }
};

export function ActivityDetailSheet({ open, onOpenChange, activity }: ActivityDetailSheetProps) {
  if (!activity) return null

  const renderActivityDetails = () => {
    switch (activity.type) {
      case "Edición de Producto":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Detalles de Edición</h3>
            {renderDiff(activity.details.oldData, activity.details.newData)}
            {renderDetail("ID de Producto", activity.details.productId)}
            {renderDetail("Editado Por", activity.details.editedBy || activity.requestedBy)}
            {renderDetail("Notas de Edición", activity.details.notes)}
          </>
        )
      case "Nuevo Producto":
      case "Duplicación de Producto":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Productos Añadidos/Duplicados</h3>
            <ul className="list-disc pl-5 space-y-1">
              {activity.details.newProducts?.map((product: any, index: number) => (
                <li key={index} className="text-sm">
                  {product.nombre} ({product.numeroSerie || `QTY: ${product.cantidad}`}) - {product.marca} -{" "}
                  {product.modelo} - {product.categoria} - Proveedor: {product.proveedor || "N/A"} - Fecha Adq:{" "}
                  {product.fechaAdquisicion || "N/A"} - Contrato ID: {product.contratoId || "N/A"}
                </li>
              ))}
            </ul>
            {renderDetail("Creado Por", activity.details.createdBy || activity.requestedBy)}
            {renderDetail("Fecha de Ingreso", activity.details.fechaIngreso)}
          </>
        )
      case "Retiro de Producto":
      case "Reactivación":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Producto Involucrado</h3>
            {renderDetail("Nombre", activity.details.product?.name)}
            {renderDetail("Número de Serie", activity.details.product?.serial || "N/A")}
            {renderDetail("ID de Producto", activity.details.product?.id)}
            {renderDetail("Estado Anterior", activity.details.oldStatus)}
            {renderDetail("Estado Nuevo", activity.details.newStatus)}
            {renderDetail("Razón de Retiro", activity.details.reason)}
            {renderDetail("Acción Realizada Por", activity.details.actionBy || activity.requestedBy)}
          </>
        )
      case "Asignación":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Detalles de Asignación</h3>
            {renderDetail("Asignado a", activity.details.assignedTo)}
            {renderDetail("Departamento", activity.details.department)}
            {renderDetail("Fecha de Asignación", formatDate(activity.details.assignmentDate))}
            {renderDetail("Asignado Por", activity.details.assignedBy || activity.requestedBy)}
            {renderDetail("Notas", activity.details.notes)}
            <h4 className="font-semibold mt-4 mb-2">Artículos Asignados:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {activity.details.items?.map((item: any, index: number) => (
                <li key={index} className="text-sm">
                  {item.name} (N/S: {item.serial || "N/A"}) - QTY: {item.quantity} - Marca: {item.brand || "N/A"} -
                  Modelo: {item.model || "N/A"} - Categoría: {item.category || "N/A"}
                </li>
              ))}
            </ul>
          </>
        )
      case "Préstamo":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Detalles de Préstamo</h3>
            {renderDetail("Prestado a", activity.details.lentTo)}
            {renderDetail("Fecha de Préstamo", formatDate(activity.details.loanDate))}
            {renderDetail("Fecha de Devolución", formatDate(activity.details.returnDate))}
            {renderDetail("Prestado Por", activity.details.lentBy || activity.requestedBy)}
            {renderDetail("Notas", activity.details.notes)}
            <h4 className="font-semibold mt-4 mb-2">Artículos Prestados:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {activity.details.items?.map((item: any, index: number) => (
                <li key={index} className="text-sm">
                  {item.name} (N/S: {item.serial || "N/A"}) - QTY: {item.quantity} - Marca: {item.brand || "N/A"} -
                  Modelo: {item.model || "N/A"} - Categoría: {item.category || "N/A"}
                </li>
              ))}
            </ul>
          </>
        )
      case "Devolución":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Detalles de Devolución</h3>
            {renderDetail("Devuelto por", activity.details.returnedBy)}
            {renderDetail("Fecha de Devolución", formatDate(activity.details.returnDate))}
            {renderDetail("Recibido Por", activity.details.receivedBy || activity.requestedBy)}
            {renderDetail("Condición al Devolver", activity.details.condition)}
            <h4 className="font-semibold mt-4 mb-2">Artículos Devueltos:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {activity.details.items?.map((item: any, index: number) => (
                <li key={index} className="text-sm">
                  {item.name} (N/S: {item.serial || "N/A"}) - QTY: {item.quantity} - Estado: {item.estado || "N/A"}
                </li>
              ))}
            </ul>
          </>
        )
      case "Importación CSV":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Detalles de Importación</h3>
            {renderDetail("Cantidad de Productos Importados", activity.details.count)}
            {renderDetail("Nombre del Archivo", activity.details.fileName)}
            {renderDetail("Importado Por", activity.details.importedBy || activity.requestedBy)}
          </>
        )
      case "Creación de Tarea":
      case "Cancelación de Tarea":
      case "Finalización de Tarea":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Detalles de Tarea</h3>
            {renderDetail("ID de Tarea", activity.details.taskId)}
            {renderDetail("Tipo de Tarea", activity.details.taskType)}
            {renderDetail("Creado Por", activity.details.createdBy || activity.requestedBy)}
            {renderDetail("Fecha de Creación", formatDate(activity.details.creationDate))}
            {activity.details.productName && renderDetail("Producto", activity.details.productName)}
            {activity.details.quantity && renderDetail("Cantidad", activity.details.quantity)}
            {activity.details.serialNumbers &&
              renderDetail("Números de Serie", activity.details.serialNumbers.join(", "))}
            {activity.details.itemsImplicados && (
              <>
                <h4 className="font-semibold mt-4 mb-2">Artículos Implicados:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {activity.details.itemsImplicados.map((item: any, index: number) => (
                    <li key={index} className="text-sm">
                      {item.name} (N/S: {item.serial || "N/A"}) - QTY: {item.quantity || 1} - Estado:{" "}
                      {item.estado || "N/A"}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {activity.details.auditLog && activity.details.auditLog.length > 0 && (
              <>
                <h4 className="font-semibold mt-4 mb-2">Log de Auditoría:</h4>
                <div className="space-y-2">
                  {activity.details.auditLog.map((log: any, index: number) => (
                    <Card key={index} className="p-3">
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(log.dateTime)}
                      </p>
                      <p className="text-sm font-medium">
                        {log.event} por {log.user}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.description}</p>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )
      default:
        // Render all details dynamically for unknown types
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Detalles Adicionales</h3>
            <dl className="space-y-2">
              {Object.entries(activity.details || {}).map(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                  return (
                    <div key={key} className="pt-2 border-t">
                      <dt className="text-sm font-medium text-muted-foreground mb-1">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                      </dt>
                      <dd className="text-sm">
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </dd>
                    </div>
                  )
                }
                return renderDetail(
                  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
                  String(value),
                )
              })}
            </dl>
          </>
        )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] md:w-[680px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Detalle de Actividad
          </SheetTitle>
          <SheetDescription>Información completa sobre la actividad registrada.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="mt-6 space-y-6 pb-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="h-5 w-5" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {renderDetail("Tipo de Actividad", <StatusBadge status={activity.type} />)}
                  {renderDetail("Descripción", activity.description)}
                  {renderDetail("Fecha y Hora", formatDateTime(activity.date))}
                  {activity.requestedBy && renderDetail("Registrado por", (
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {activity.requestedBy}
                    </span>
                  ))}
                  {activity.status && renderDetail("Estado de Solicitud", <StatusBadge status={activity.status} />)}
                </dl>
              </CardContent>
            </Card>

            {activity.details && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Detalles Específicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">{renderActivityDetails()}</CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
