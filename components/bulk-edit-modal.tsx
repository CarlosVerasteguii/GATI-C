"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { showSuccess, showInfo } from "@/hooks/use-toast"
import { Loader2, Edit } from "lucide-react"
import { BrandCombobox } from "@/components/brand-combobox"
import { useApp } from "@/contexts/app-context"
import { ConfirmationDialogForEditor } from "./confirmation-dialog-for-editor"

interface BulkEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedProductIds: number[] // Directive 3.1: Pass actual IDs
  onSuccess: () => void
}

export function BulkEditModal({ open, onOpenChange, selectedProductIds, onSuccess }: BulkEditModalProps) {
  const { state, addPendingRequest, addRecentActivity } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    categoria: "",
    marca: "",
    estado: "",
    descripcion: "",
  })
  const [isConfirmEditorOpen, setIsConfirmEditorOpen] = useState(false)


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const executeBulkEdit = () => {
    // Toast de progreso inmediato
    showInfo({
      title: "Procesando edición masiva...",
      description: `Aplicando cambios a ${selectedProductIds.length} productos`
    })

    // Simular edición masiva
    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
      setFormData({ categoria: "", marca: "", estado: "", descripcion: "" })

      // Toast de éxito con más contexto
      showSuccess({
        title: "Edición masiva completada",
        description: `${selectedProductIds.length} productos actualizados exitosamente`
      })

      addRecentActivity({
        type: "Edición Masiva",
        description: `Se editaron ${selectedProductIds.length} productos`,
        date: new Date().toLocaleString(),
        details: {
          selectedProductIds: selectedProductIds, // Pass actual IDs
          updates: formData,
        },
      })
      onSuccess()
    }, 1000)
  }

  const handleBulkEdit = async () => {
    setIsLoading(true)

    if (state.user?.rol === "Editor") {
      // Do not clear form here, clear it after confirmation
      setIsConfirmEditorOpen(true)
      setIsLoading(false) // Reset loading if opening confirmation dialog
      return
    }

    executeBulkEdit()
  }

  const handleConfirmEditorAction = () => {
    addPendingRequest({
      id: Date.now(), // Añadir un ID temporal basado en el timestamp
      type: "Edición Masiva",
      details: {
        selectedProductIds: selectedProductIds, // Directive 3.1: Pass actual IDs
        updates: formData,
      },
      requestedBy: state.user?.nombre || "Editor",
      date: new Date().toISOString(),
      status: "Pendiente",
      auditLog: [
        {
          event: "CREACIÓN",
          user: state.user?.nombre || "Editor",
          dateTime: new Date().toISOString(),
          description: `Solicitud de edición masiva para ${selectedProductIds.length} productos creada.`,
        },
      ],
    })
    showInfo({
      title: "Solicitud enviada",
      description: "Tu edición masiva ha sido enviada a un administrador para aprobación."
    })
    onOpenChange(false)
    setFormData({ categoria: "", marca: "", estado: "", descripcion: "" }) // Clear form after sending request
    setIsConfirmEditorOpen(false)
    addRecentActivity({
      type: "Solicitud de Edición Masiva",
      description: `Solicitud de edición masiva para ${selectedProductIds.length} productos enviada`,
      date: new Date().toLocaleString(),
      details: {
        selectedProductIds: selectedProductIds, // Pass actual IDs
        updates: formData,
      },
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edición Masiva de Productos
            </DialogTitle>
            <DialogDescription>
              Aplica cambios a {selectedProductIds.length} producto(s) seleccionado(s). Deja los campos en blanco para
              no modificar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select value={formData.categoria} onValueChange={(val) => handleInputChange("categoria", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="No cambiar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-cambiar-categoria">No cambiar</SelectItem>
                  {state.categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <BrandCombobox
                value={formData.marca}
                onValueChange={(val) => handleInputChange("marca", val)}
                placeholder="No cambiar"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} onValueChange={(val) => handleInputChange("estado", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="No cambiar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-cambiar-estado">No cambiar</SelectItem>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Prestado">Prestado</SelectItem>
                  <SelectItem value="Asignado">Asignado</SelectItem>
                  <SelectItem value="Retirado">Retirado</SelectItem>
                  <SelectItem value="PENDIENTE_DE_RETIRO">Pendiente de Retiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                placeholder="No cambiar"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleBulkEdit}
              disabled={isLoading}
              className="bg-primary hover:bg-primary-hover"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aplicar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialogForEditor
        open={isConfirmEditorOpen}
        onOpenChange={setIsConfirmEditorOpen}
        onConfirm={handleConfirmEditorAction}
      />
    </>
  )
}
