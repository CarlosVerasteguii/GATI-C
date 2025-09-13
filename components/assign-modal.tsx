"use client"

import type React from "react"
import { InventoryItem } from "@/types/inventory"

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
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"
import { useApp } from "@/contexts/app-context"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { ConfirmationDialogForEditor } from "./confirmation-dialog-for-editor"
import { UserCombobox } from '@/components/ui/user-combobox';
import { User } from "@/types/inventory";

interface AssignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: InventoryItem | null
  onSuccess: () => void
}

export function AssignModal({ open, onOpenChange, product, onSuccess }: AssignModalProps) {
  const { state, updateInventoryItem, addPendingRequest, addRecentActivity, addInventoryItem, updateInventory, addHistoryEvent } = useApp()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmEditorOpen, setIsConfirmEditorOpen] = useState(false)
  const [pendingActionDetails, setPendingActionDetails] = useState<any>(null)
  const [assignedToUser, setAssignedToUser] = useState<User | null>(null);

  if (!product) return null

  const availableQuantity =
    product.numeroSerie === null
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
    const assignedTo = assignedToUser?.nombre || '';
    const assignedToEmail = assignedToUser?.email || '';
    const notes = formData.get("notes") as string
    const quantity = product.numeroSerie === null ? Number.parseInt(formData.get("quantity") as string) : 1

    if (!assignedToUser) {
      showError({
        title: "Error",
        description: "Por favor, selecciona un usuario para la asignación."
      })
      setIsLoading(false)
      return
    }

    if (product.numeroSerie === null && quantity > availableQuantity) {
      showError({
        title: "Error de Cantidad",
        description: `Solo hay ${availableQuantity} unidades disponibles para asignar.`
      })
      setIsLoading(false)
      return
    }

    const actionDetails = {
      type: "Asignación",
      productId: product.id,
      productName: product.nombre,
      productSerialNumber: product.numeroSerie,
      assignedTo: assignedToUser.nombre,
      assignedToEmail: assignedToUser.email,
      notes,
      quantity,
    }

    if (user?.rol === "Editor") {
      setPendingActionDetails(actionDetails)
      setIsConfirmEditorOpen(true)
      setIsLoading(false)
      return
    }

    executeAssignment(actionDetails)
  }

  const executeAssignment = (details: any) => {
    setTimeout(() => {
      // Ya no se llama a addAssignment, los datos se guardan en el item.

      // Actualizar el estado en el inventario
      if (details.productSerialNumber !== null) {
        // Ítem serializado: se actualiza el estado y los detalles de asignación.
        updateInventoryItem(details.productId, {
          estado: "Asignado",
          asignadoA: details.assignedTo,
          fechaAsignacion: new Date().toISOString().split("T")[0]
        });

        addHistoryEvent(details.productId, {
          fecha: new Date().toISOString(),
          usuario: user?.nombre || 'Sistema',
          accion: 'Asignación',
          detalles: `Asignado a ${details.assignedTo}. Notas: ${details.notes || 'N/A'}`
        });
      } else {
        // --- LÓGICA PARA ITEMS NO SERIALIZADOS (DIVISIÓN DE REGISTRO) ---

        // 1. Encontrar el stack de items disponibles que coincida
        const sourceStack = state.inventoryData.find(
          (item) => item.id === details.productId && item.estado === 'Disponible'
        );

        if (!sourceStack) {
          showError({ title: "Error de Stock", description: "No se encontró el grupo de productos disponibles." });
          setIsLoading(false);
          return;
        }

        // 2. Actualizar el stack de origen
        const updatedSourceStack = {
          ...sourceStack,
          cantidad: sourceStack.cantidad - details.quantity,
        };
        updateInventoryItem(sourceStack.id, { cantidad: updatedSourceStack.cantidad });

        // 3. Crear el nuevo stack de items asignados
        // Primero, buscamos si ya existe un stack asignado a la misma persona para agruparlos
        const existingAssignedStack = state.inventoryData.find(
          (item) =>
            item.nombre === details.productName &&
            item.estado === 'Asignado' &&
            item.asignadoA === details.assignedTo
        );

        if (existingAssignedStack) {
          // Si ya existe, solo actualizamos su cantidad
          updateInventoryItem(existingAssignedStack.id, {
            cantidad: existingAssignedStack.cantidad + details.quantity,
            fechaAsignacion: new Date().toISOString().split('T')[0], // Actualizar fecha a la más reciente
            // Podríamos añadir notas aquí si el modelo de datos lo permite
          });

          addHistoryEvent(existingAssignedStack.id, {
            fecha: new Date().toISOString(),
            usuario: user?.nombre || 'Sistema',
            accion: 'Asignación',
            detalles: `Asignado a ${details.assignedTo}. Cantidad: ${details.quantity}. Notas: ${details.notes || 'N/A'}`
          });
        } else {
          // Si no existe, creamos una nueva entrada en el inventario
          const newAssignedItem: InventoryItem = {
            ...sourceStack, // Hereda todos los datos base
            id: Math.floor(Math.random() * 100000) + 1000, // ID Temporal único
            estado: 'Asignado',
            cantidad: details.quantity,
            asignadoA: details.assignedTo,
            fechaAsignacion: new Date().toISOString().split('T')[0],
            numeroSerie: null, // Asegurarnos de que sea null
          };
          const addedItem = addInventoryItem(newAssignedItem);

          addHistoryEvent(newAssignedItem.id, {
            fecha: new Date().toISOString(),
            usuario: user?.nombre || 'Sistema',
            accion: 'Asignación',
            detalles: `Asignado a ${details.assignedTo}. Cantidad: ${details.quantity}. Notas: ${details.notes || 'N/A'}`
          });
        }
      }

      showSuccess({
        title: "Producto asignado",
        description: `${details.productName} ha sido asignado a ${details.assignedTo}.`
      })
      addRecentActivity({
        type: "Asignación",
        description: `${details.productName} asignado a ${details.assignedTo}`,
        date: new Date().toLocaleString(),
        details: {
          product: { id: details.productId, name: details.productName, serial: details.productSerialNumber },
          assignedTo: details.assignedTo,
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
      id: Date.now(),
      type: pendingActionDetails.type,
      details: pendingActionDetails,
      requestedBy: user?.nombre || "Editor",
      date: new Date().toISOString(),
      status: "Pendiente",
    })
    showInfo({
      title: "Solicitud enviada",
      description: `Tu solicitud de ${pendingActionDetails.type.toLowerCase()} ha sido enviada a un administrador para aprobación.`
    })
    setIsConfirmEditorOpen(false)
    onOpenChange(false)
  }


  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Asignar Producto</DialogTitle>
            <DialogDescription>Asigna "{product.nombre}" a un usuario o departamento.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Asignar a</Label>
                <UserCombobox
                  value={assignedToUser}
                  onValueChange={setAssignedToUser}
                  placeholder="Selecciona o crea un usuario"
                  currentUserRole={user?.rol || "Lector"}
                />
              </div>
              {product.numeroSerie === null && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad a Asignar</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    defaultValue={1}
                    min={1}
                    max={availableQuantity}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (Opcional)</Label>
                <Textarea id="notes" name="notes" placeholder="Notas adicionales sobre la asignación" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading || !assignedToUser}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Asignar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialogForEditor
        open={isConfirmEditorOpen}
        onOpenChange={setIsConfirmEditorOpen}
        onConfirm={handleConfirmEditorAction}
        title="Confirmar Solicitud de Asignación"
        description={`Se enviará una solicitud para asignar el producto ${pendingActionDetails?.productName} a ${pendingActionDetails?.assignedTo}.`}
        confirmText="Enviar Solicitud"
      />
    </>
  )
}
