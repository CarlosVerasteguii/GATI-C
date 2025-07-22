"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, Edit, PackagePlus, PackageMinus, UserPlus, Calendar, RefreshCcw } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { showSuccess } from "@/hooks/use-toast"
import { BrandCombobox } from "./brand-combobox"

interface EditTaskSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: any // The task object to edit
}

export function EditTaskSheet({ open, onOpenChange, task }: EditTaskSheetProps) {
  const { state, updatePendingTask, addRecentActivity } = useApp()
  const [isLoading, setIsLoading] = useState(false)

  // States for form fields, initialized from task details
  const [productName, setProductName] = useState(task?.details?.productName || task?.details?.productData?.nombre || "")
  const [quantity, setQuantity] = useState(task?.details?.quantity || 1)
  const [serialNumbers, setSerialNumbers] = useState(
    task?.details?.serialNumbers?.join("\n") || task?.details?.productData?.numeroSerie || "",
  )
  const [brand, setBrand] = useState(task?.details?.brand || task?.details?.productData?.marca || "")
  const [model, setModel] = useState(task?.details?.model || task?.details?.productData?.modelo || "")
  const [category, setCategory] = useState(task?.details?.category || task?.details?.productData?.categoria || "")
  const [description, setDescription] = useState(
    task?.details?.description || task?.details?.productData?.descripcion || "",
  )
  const [reason, setReason] = useState(task?.details?.reason || "")
  const [notes, setNotes] = useState(task?.details?.notes || "")
  const [assignedTo, setAssignedTo] = useState(task?.details?.assignedTo || "")
  const [lentToName, setLentToName] = useState(task?.details?.lentToName || "")
  const [lentToEmail, setLentToEmail] = useState(task?.details?.lentToEmail || "")
  const [returnDate, setReturnDate] = useState(task?.details?.returnDate || "")

  // Update states when a new task is passed
  useEffect(() => {
    if (task) {
      setProductName(task.details?.productName || task.details?.productData?.nombre || "")
      setQuantity(task.details?.quantity || 1)
      setSerialNumbers(task.details?.serialNumbers?.join("\n") || task.details?.productData?.numeroSerie || "")
      setBrand(task.details?.brand || task.details?.productData?.marca || "")
      setModel(task.details?.model || task.details?.productData?.modelo || "")
      setCategory(task.details?.category || task.details?.productData?.categoria || "")
      setDescription(task.details?.description || task.details?.productData?.descripcion || "")
      setReason(task.details?.reason || "")
      setNotes(task.details?.notes || "")
      setAssignedTo(task.details?.assignedTo || "")
      setLentToName(task.details?.lentToName || "")
      setLentToEmail(task.details?.lentToEmail || "")
      setReturnDate(task.details?.returnDate || "")
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    let updatedDetails = { ...task.details }

    switch (task.type) {
      case "CARGA":
        updatedDetails = {
          productName,
          quantity: Number(quantity),
          serialNumbers: serialNumbers ? serialNumbers.split("\n").filter(Boolean) : [],
          brand,
          model,
          category,
          description,
        }
        break
      case "RETIRO":
        updatedDetails = {
          ...task.details, // Keep itemsImplicados as is
          reason,
          notes,
        }
        break
      case "Asignación":
        updatedDetails = {
          ...task.details,
          assignedTo,
          notes,
        }
        break
      case "Préstamo":
        updatedDetails = {
          ...task.details,
          lentToName,
          lentToEmail,
          returnDate,
          notes,
        }
        break
      case "Creación de Producto":
      case "Edición de Producto":
      case "Duplicación de Producto":
        updatedDetails.productData = {
          nombre: productName,
          marca: brand,
          modelo: model,
          categoria: category,
          descripcion: description,
          cantidad: Number(quantity),
          numeroSerie: serialNumbers || null,
        }
        break
      case "Reactivación":
        // Reactivation details are usually just product ID/name, no complex edits here
        break
    }

    setTimeout(() => {
      updatePendingTask(task.id, {
        details: updatedDetails,
        auditLog: [
          ...(task.auditLog || []),
          {
            event: "EDICIÓN",
            user: state.user?.nombre || "Administrador",
            dateTime: new Date().toISOString(),
            description: `Tarea editada por ${state.user?.nombre || "Administrador"}.`,
          },
        ],
      })
      showSuccess({
        title: "Tarea Actualizada",
        description: `La tarea #${task.id} ha sido actualizada exitosamente.`
      })
      addRecentActivity({
        type: "Edición de Tarea",
        description: `Tarea #${task.id} (${task.type}) editada.`,
        date: new Date().toLocaleString(),
        details: { taskId: task.id, taskType: task.type, updatedDetails },
      })
      setIsLoading(false)
      onOpenChange(false)
    }, 1000)
  }

  const getSheetTitle = () => {
    switch (task?.type) {
      case "CARGA":
        return "Editar Tarea de Carga"
      case "RETIRO":
        return "Editar Tarea de Retiro"
      case "Asignación":
        return "Editar Solicitud de Asignación"
      case "Préstamo":
        return "Editar Solicitud de Préstamo"
      case "Creación de Producto":
        return "Editar Solicitud de Creación"
      case "Edición de Producto":
        return "Editar Solicitud de Edición"
      case "Duplicación de Producto":
        return "Editar Solicitud de Duplicación"
      case "Reactivación":
        return "Editar Solicitud de Reactivación"
      default:
        return "Editar Tarea"
    }
  }

  const getSheetIcon = () => {
    switch (task?.type) {
      case "CARGA":
      case "Creación de Producto":
      case "Duplicación de Producto":
        return <PackagePlus className="h-5 w-5" />
      case "RETIRO":
        return <PackageMinus className="h-5 w-5" />
      case "Asignación":
        return <UserPlus className="h-5 w-5" />
      case "Préstamo":
        return <Calendar className="h-5 w-5" />
      case "Edición de Producto":
        return <Edit className="h-5 w-5" />
      case "Reactivación":
        return <RefreshCcw className="h-5 w-5" />
      default:
        return null
    }
  }

  if (!task) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {getSheetIcon()}
            {getSheetTitle()}
          </SheetTitle>
          <SheetDescription>Modifica los detalles de la tarea pendiente antes de procesarla.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Common fields for product-related tasks */}
          {(task.type === "CARGA" ||
            task.type === "Creación de Producto" ||
            task.type === "Edición de Producto" ||
            task.type === "Duplicación de Producto") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="productName">Nombre del Producto *</Label>
                  <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <BrandCombobox value={brand} onValueChange={setBrand} placeholder="Selecciona o escribe una marca" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

          {/* Specific fields for CARGA / Creation / Duplication */}
          {(task.type === "CARGA" ||
            task.type === "Creación de Producto" ||
            task.type === "Duplicación de Producto") && (
              <>
                {task.details?.serialNumbers?.length > 0 ||
                  (task.details?.productData?.numeroSerie && task.details.productData.numeroSerie !== null) ? (
                  <div className="space-y-2">
                    <Label htmlFor="serialNumbers">Números de Serie (uno por línea)</Label>
                    <Textarea
                      id="serialNumbers"
                      value={serialNumbers}
                      onChange={(e) => setSerialNumbers(e.target.value)}
                      rows={4}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Cantidad</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                )}
              </>
            )}

          {/* Specific fields for RETIRO */}
          {task.type === "RETIRO" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo del Retiro *</Label>
                <Select value={reason} onValueChange={setReason} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Obsoleto">Obsoleto</SelectItem>
                    <SelectItem value="Dañado">Dañado</SelectItem>
                    <SelectItem value="Perdido">Perdido</SelectItem>
                    <SelectItem value="Fin de Vida Útil">Fin de Vida Útil</SelectItem>
                    <SelectItem value="Prestado/Asignado (No Retornado)">Prestado/Asignado (No Retornado)</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>
            </>
          )}

          {/* Specific fields for Asignación */}
          {task.type === "Asignación" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Asignado A *</Label>
                <Input id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>
            </>
          )}

          {/* Specific fields for Préstamo */}
          {task.type === "Préstamo" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="lentToName">Nombre del Receptor *</Label>
                <Input id="lentToName" value={lentToName} onChange={(e) => setLentToName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lentToEmail">Email del Receptor *</Label>
                <Input
                  id="lentToEmail"
                  type="email"
                  value={lentToEmail}
                  onChange={(e) => setLentToEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="returnDate">Fecha de Devolución *</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>
            </>
          )}

          {/* No specific editable fields for Reactivación, as it's usually just confirming the product */}
          {task.type === "Reactivación" && (
            <p className="text-sm text-muted-foreground">
              No hay campos editables para esta tarea. La reactivación se aplica al producto:{" "}
              <span className="font-semibold">{task.details?.productName}</span>
              {task.details?.productSerialNumber && ` (N/S: ${task.details.productSerialNumber})`}
            </p>
          )}

          {/* TODO: [Fase 4 - Tareas Pendientes y Garantía]
            Pendiente: Implementar soporte para captura/edición de 'fechaVencimientoGarantia' (garantía) al procesar tareas pendientes de productos.
            IMPORTANTE: No eliminar este comentario. La lógica de tareas pendientes con garantía debe ser diseñada e implementada aquí cuando el sistema soporte este flujo. */}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
