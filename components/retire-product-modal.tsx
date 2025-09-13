"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"
import { useApp } from "@/contexts/app-context"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { ConfirmationDialogForEditor } from "./confirmation-dialog-for-editor"

interface RetireProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any // This modal is for a specific product
  onSuccess: () => void
}

export function RetireProductModal({ open, onOpenChange, product, onSuccess }: RetireProductModalProps) {
  const { state, updateInventoryItemStatus, addPendingRequest, addRecentActivity, updateInventory } = useApp()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmEditorOpen, setIsConfirmEditorOpen] = useState(false)
  const [pendingActionDetails, setPendingActionDetails] = useState<any>(null)

  const availableQuantity =
    product?.numeroSerie === null
      ? state.inventoryData
        .filter(
          (item) => item.nombre === product.nombre && item.modelo === product.modelo && item.estado === "Disponible",
        )
        .reduce((sum, item) => sum + item.cantidad, 0)
      : 1 // For serialized, it's always 1 if available

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const retireReason = formData.get("retireReason") as string
    const notes = formData.get("notes") as string
    const quantity = product.numeroSerie === null ? Number.parseInt(formData.get("quantity") as string) : 1

    if (!retireReason) {
      showError({
        title: "Error",
        description: "Por favor, selecciona un motivo de retiro."
      })
      setIsLoading(false)
      return
    }

    if (product.numeroSerie === null && quantity > availableQuantity) {
      showError({
        title: "Error de Cantidad",
        description: `Solo hay ${availableQuantity} unidades disponibles para retirar.`
      })
      setIsLoading(false)
      return
    }

    const actionDetails = {
      type: "Retiro",
      productId: product.id,
      productName: product.nombre,
      productSerialNumber: product.numeroSerie,
      retireReason,
      notes,
      quantity,
      productModel: product.modelo, // Added for non-serialized logic
    }

    if (user?.rol === "Editor") {
      setPendingActionDetails(actionDetails)
      setIsConfirmEditorOpen(true)
      setIsLoading(false)
      return
    }

    executeRetirement(actionDetails)
  }

  const executeRetirement = (details: any) => {
    setTimeout(() => {
      if (details.productSerialNumber !== null) {
        // Serialized item
        updateInventoryItemStatus(details.productId, "Retirado", null, null, details.retireReason)
      } else {
        // Non-serialized item: find and update available units
        let remainingToRetire = details.quantity
        const updatedInventory = state.inventoryData.map((item) => {
          if (
            item.nombre === details.productName &&
            item.modelo === details.productModel &&
            item.numeroSerie === null &&
            item.estado === "Disponible" &&
            remainingToRetire > 0
          ) {
            const qtyToTake = Math.min(item.cantidad, remainingToRetire)
            remainingToRetire -= qtyToTake
            return {
              ...item,
              cantidad: item.cantidad - qtyToTake,
              estado: item.cantidad - qtyToTake === 0 ? "Retirado" : item.estado,
            }
          }
          return item
        })

        // Add new retired entries for the non-serialized items
        if (details.quantity > 0) {
          const newRetiredItem = {
            id: Math.max(...state.inventoryData.map((item) => item.id)) + 1, // Generate new ID
            nombre: details.productName,
            marca: product.marca, // Assuming product has brand
            modelo: product.modelo,
            categoria: product.categoria,
            descripcion: product.descripcion,
            estado: "Retirado",
            cantidad: details.quantity,
            numeroSerie: null,
            fechaIngreso: product.fechaIngreso, // Keep original entry date
            motivoRetiro: details.retireReason,
            fechaRetiro: new Date().toISOString().split("T")[0],
            notasRetiro: details.notes,
            proveedor: product.proveedor, // Include new fields
            fechaAdquisicion: product.fechaAdquisicion, // Include new fields
            contratoId: product.contratoId, // Include new fields
          }
          updatedInventory.push(newRetiredItem)
        }
        updateInventory(updatedInventory)
      }

      showSuccess({
        title: "Producto retirado",
        description: `${details.productName} ha sido marcado como retirado por ${details.retireReason}.`,
      })
      addRecentActivity({
        type: "Retiro de Producto",
        description: `${details.productName} retirado por ${details.retireReason}`,
        date: new Date().toLocaleString(),
        details: {
          product: { id: details.productId, name: details.productName, serial: details.productSerialNumber },
          retireReason: details.retireReason,
          notes: details.notes,
          quantity: details.quantity,
        },
      })
      onSuccess()
      onOpenChange(false)
      setIsLoading(false)
    }, 1000)
  }

  const handleConfirmEditorAction = () => {
    addPendingRequest({
      type: pendingActionDetails.type,
      details: pendingActionDetails,
      requestedBy: user?.nombre || "Editor",
      date: new Date().toISOString(),
      status: "Pendiente",
      auditLog: [
        {
          event: "CREACIÓN",
          user: user?.nombre || "Editor",
          dateTime: new Date().toISOString(),
          description: `Solicitud de ${pendingActionDetails.type.toLowerCase()} creada.`,
        },
      ],
    })
    showInfo({
      title: "Solicitud enviada",
      description: `Tu solicitud de ${pendingActionDetails.type.toLowerCase()} ha sido enviada a un administrador para aprobación.`,
    })
    setIsConfirmEditorOpen(false)
    onOpenChange(false)
  }

  if (!product) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Retirar Producto</DialogTitle>
            <DialogDescription>Marca "{product.nombre}" como retirado del inventario.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="retireReason">Motivo de Retiro</Label>
                <Select name="retireReason" required>
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
              {product.numeroSerie === null && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad a Retirar</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    defaultValue={1}
                    min={1}
                    max={availableQuantity}
                    required
                  />
                  <p className="text-sm text-muted-foreground">Actualmente disponibles: {availableQuantity}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (Opcional)</Label>
                <Textarea id="notes" name="notes" placeholder="Notas adicionales sobre el retiro" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Retiro
              </Button>
            </DialogFooter>
          </form>
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
