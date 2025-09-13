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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"
import { Loader2, PackageMinus, HelpCircle } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ProductSearchCombobox } from "./product-search-combobox"

interface QuickRetireModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickRetireModal({ open, onOpenChange }: QuickRetireModalProps) {
  const { state, addPendingTask, addRecentActivity } = useApp()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isSerializedRetirement, setIsSerializedRetirement] = useState(true) // Default to serial number input
  const [formData, setFormData] = useState({
    productIdentifier: "", // Can be serial or product name
    quantity: "1",
    retireReason: "",
    notes: "",
  })


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.productIdentifier || !formData.retireReason || (!isSerializedRetirement && !formData.quantity)) {
      showError({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios."
      })
      return
    }

    setIsLoading(true)

    let productsToRetire = []
    let quantityToRetire = 0

    if (isSerializedRetirement) {
      const serials = formData.productIdentifier
        .split("\n")
        .filter(Boolean)
        .map((s) => s.trim())
      productsToRetire = state.inventoryData.filter(
        (item) => serials.includes(item.numeroSerie || "") && item.estado === "Disponible",
      )
      quantityToRetire = productsToRetire.length

      if (productsToRetire.length !== serials.length) {
        showError({
          title: "Error de Números de Serie",
          description: "Algunos números de serie no fueron encontrados o no están disponibles."
        })
        setIsLoading(false)
        return
      }
    } else {
      const availableProduct = state.inventoryData.find(
        (item) =>
          item.nombre.toLowerCase() === formData.productIdentifier.toLowerCase() &&
          item.numeroSerie === null &&
          item.estado === "Disponible",
      )
      quantityToRetire = Number.parseInt(formData.quantity)

      if (!availableProduct || availableProduct.cantidad < quantityToRetire) {
        showError({
          title: "Error de Cantidad",
          description: `Producto no encontrado o cantidad insuficiente. Disponibles: ${availableProduct?.cantidad || 0}`
        })
        setIsLoading(false)
        return
      }
      productsToRetire = [{ ...availableProduct, cantidad: quantityToRetire }] // Simulate a single product entry for the task
    }

    // Simulate task creation
    setTimeout(() => {
      addPendingTask({
        type: "RETIRO",
        creationDate: new Date().toISOString(),
        createdBy: user?.nombre || "Usuario Rápido",
        status: "Pendiente",
        details: {
          productIdentifier: formData.productIdentifier,
          quantity: quantityToRetire,
          isSerialized: isSerializedRetirement,
          retireReason: formData.retireReason,
          notes: formData.notes,
          productsAffected: productsToRetire.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            numeroSerie: p.numeroSerie,
            cantidad: p.cantidad,
          })),
        },
        auditLog: [
          {
            event: "CREACIÓN",
            user: user?.nombre || "Usuario Rápido",
            dateTime: new Date().toISOString(),
            description: `Solicitud de retiro rápido para ${isSerializedRetirement ? "números de serie" : formData.productIdentifier} (${quantityToRetire} unidades) creada.`,
          },
        ],
      })
      showInfo({
        title: "Solicitud de Retiro Enviada",
        description: "Tu solicitud de retiro rápido ha sido enviada para aprobación y procesamiento."
      })
      addRecentActivity({
        type: "Creación de Tarea",
        description: `Tarea de retiro rápido para ${isSerializedRetirement ? "múltiples ítems" : formData.productIdentifier} creada por ${user?.nombre || "Usuario Rápido"}`,
        date: new Date().toLocaleString(),
        details: {
          productIdentifier: formData.productIdentifier,
          quantity: quantityToRetire,
          retireReason: formData.retireReason,
          createdBy: user?.nombre || "Usuario Rápido",
        },
      })
      // Reset form
      setFormData({
        productIdentifier: "",
        quantity: "1",
        retireReason: "",
        notes: "",
      })
      setIsSerializedRetirement(true)
      setIsLoading(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          {" "}
          {/* Wider modal */}
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackageMinus className="h-5 w-5" />
              Registrar Retiro Rápido
            </DialogTitle>
            <DialogDescription>
              Registra el retiro de productos del inventario para su posterior aprobación por un administrador.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {" "}
            {/* Two columns for better distribution */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isSerialized"
                  checked={isSerializedRetirement}
                  onCheckedChange={setIsSerializedRetirement}
                />
                <Label htmlFor="isSerialized" className="flex items-center gap-1">
                  Retiro por Número de Serie
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Activa esta opción para retirar productos específicos por su número de serie. Desactiva para
                        retirar por nombre de producto y cantidad.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </div>
            </div>
            {isSerializedRetirement ? (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="serialNumbers" className="flex items-center gap-1">
                  Números de Serie *
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ingrese un número de serie por línea para cada unidad a retirar.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Textarea
                  id="serialNumbers"
                  value={formData.productIdentifier}
                  onChange={(e) => handleInputChange("productIdentifier", e.target.value)}
                  rows={4}
                  placeholder="Ingrese un número de serie por línea&#10;Ejemplo:&#10;SN123456789&#10;SN987654321"
                  required
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="productName">Nombre del Producto *</Label>
                  <ProductSearchCombobox
                    value={formData.productIdentifier}
                    onValueChange={(val) => handleInputChange("productIdentifier", val)}
                    placeholder="Selecciona o escribe un producto"
                    filterBySerialized={false} // Only show non-serialized products
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad a Retirar *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="retireReason">Motivo de Retiro *</Label>
              <Select
                value={formData.retireReason}
                onValueChange={(val) => handleInputChange("retireReason", val)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dañado">Dañado</SelectItem>
                  <SelectItem value="Obsoleto">Obsoleto</SelectItem>
                  <SelectItem value="Perdido">Perdido</SelectItem>
                  <SelectItem value="Vendido">Vendido</SelectItem>
                  <SelectItem value="Prestado/Asignado (No Retornado)">Prestado/Asignado (No Retornado)</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
                placeholder="Notas adicionales sobre el retiro"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Solicitud de Retiro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
