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
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"
import { Loader2, Calendar } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { ConfirmationDialogForEditor } from "./confirmation-dialog-for-editor"

interface BulkLendModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedProducts: any[]
  onSuccess: () => void
}

export function BulkLendModal({ open, onOpenChange, selectedProducts, onSuccess }: BulkLendModalProps) {
  const { state, addPendingRequest, addRecentActivity, updateInventory, updatePrestamos } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState("") // New state for user name
  const [userEmail, setUserEmail] = useState("") // New state for user email
  const [returnDate, setReturnDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isConfirmEditorOpen, setIsConfirmEditorOpen] = useState(false)


  const executeBulkLend = () => {
    // Toast de progreso con contexto completo
    showInfo({
      title: "Procesando préstamo masivo...",
      description: `Prestando ${selectedProducts.length} productos a ${userName}`
    })

    // Simular préstamo masivo
    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
      setUserName("")
      setUserEmail("")
      setReturnDate("")
      setNotes("")

      let updatedInventory = [...state.inventoryData]
      const lentItems = []

      selectedProducts.forEach((product) => {
        if (product.numeroSerie === null) {
          // For non-serialized items, find the available quantity and decrement it
          const existingAvailableItemIndex = updatedInventory.findIndex(
            (item) => item.nombre === product.nombre && item.modelo === product.modelo && item.estado === "Disponible",
          )

          if (existingAvailableItemIndex !== -1) {
            const availableItem = updatedInventory[existingAvailableItemIndex]
            if (availableItem.cantidad > 0) {
              // Decrement available quantity
              updatedInventory[existingAvailableItemIndex] = {
                ...availableItem,
                cantidad: availableItem.cantidad - 1,
              }

              // Create a new entry for the lent unit
              lentItems.push({
                id: Math.max(...state.inventoryData.map((item) => item.id)) + 1 + lentItems.length, // Unique ID
                nombre: product.nombre,
                marca: product.marca,
                modelo: product.modelo,
                categoria: product.categoria,
                estado: "Prestado",
                cantidad: 1,
                numeroSerie: null,
                fechaIngreso: product.fechaIngreso,
                descripcion: product.descripcion,
              })
            }
          }
        } else {
          // For serialized items, change the status of the specific item
          updatedInventory = updatedInventory.map((item) => {
            if (item.id === product.id) {
              return { ...item, estado: "Prestado" }
            }
            return item
          })
          lentItems.push({
            id: Math.max(...state.prestamosData.map((item) => item.id)) + 1 + lentItems.length,
            nombre: product.nombre,
            numeroSerie: product.numeroSerie,
            prestadoA: userName,
            fechaDevolucion: returnDate,
            estado: "Activo" as const,
            diasRestantes: Math.ceil((new Date(returnDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
          })
        }
      })

      updateInventory(updatedInventory)
      updatePrestamos([...state.prestamosData, ...lentItems])

      // Toast mejorado con fecha de devolución
      const fechaFormateada = new Date(returnDate).toLocaleDateString('es-ES')
      showSuccess({
        title: "Préstamo masivo completado",
        description: `${selectedProducts.length} productos prestados hasta ${fechaFormateada}`
      })
      addRecentActivity({
        type: "Préstamo Masivo",
        description: `Se prestaron ${selectedProducts.length} productos a ${userName}`,
        date: new Date().toLocaleString(),
        details: {
          selectedProductIds: selectedProducts.map((p) => ({ id: p.id, name: p.nombre, serial: p.numeroSerie })),
          lentTo: userName,
          returnDate: returnDate,
          notes: notes,
        },
      })
      onSuccess()
    }, 1000)
  }

  const handleBulkLend = async () => {
    if (!userName || !userEmail || !returnDate) return

    setIsLoading(true)

    if (state.user?.rol === "Editor") {
      setIsConfirmEditorOpen(true)
      setIsLoading(false)
      return
    }

    executeBulkLend()
  }

  const handleConfirmEditorAction = () => {
    addPendingRequest({
      type: "Préstamo Masivo",
      details: {
        selectedProductIds: selectedProducts.map((p) => ({ id: p.id, name: p.nombre, serial: p.numeroSerie })),
        lentToName: userName,
        lentToEmail: userEmail,
        returnDate: returnDate,
        notes: notes,
      },
      requestedBy: state.user?.nombre || "Editor",
      date: new Date().toISOString(),
      status: "Pendiente",
      auditLog: [
        {
          event: "CREACIÓN",
          user: state.user?.nombre || "Editor",
          dateTime: new Date().toISOString(),
          description: `Solicitud de préstamo masivo para ${selectedProducts.length} productos creada.`,
        },
      ],
    })
    showInfo({
      title: "Solicitud enviada",
      description: "Tu préstamo masivo ha sido enviado a un administrador para aprobación."
    })
    onOpenChange(false)
    setUserName("")
    setUserEmail("")
    setReturnDate("")
    setNotes("")
    setIsConfirmEditorOpen(false)
    addRecentActivity({
      type: "Solicitud de Préstamo Masivo",
      description: `Solicitud de préstamo masivo para ${selectedProducts.length} productos enviada`,
      date: new Date().toLocaleString(),
      details: {
        selectedProductIds: selectedProducts.map((p) => ({ id: p.id, name: p.nombre, serial: p.numeroSerie })),
        lentTo: userName,
        returnDate: returnDate,
        notes: notes,
      },
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Prestar Productos (Masivo)
            </DialogTitle>
            <DialogDescription>
              Presta {selectedProducts.length} producto(s) seleccionado(s) temporalmente a un usuario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nombre del Receptor *</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Correo del Receptor *</Label>
              <Input
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="correo@empresa.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaDevolucion">Fecha de Devolución *</Label>
              <Input
                id="fechaDevolucion"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notas">Notas (opcional)</Label>
              <Textarea
                id="notas"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Propósito del préstamo, condiciones especiales, etc."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleBulkLend}
              disabled={isLoading || !userName || !userEmail || !returnDate}
              className="bg-primary hover:bg-primary-hover"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Prestar Productos
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
