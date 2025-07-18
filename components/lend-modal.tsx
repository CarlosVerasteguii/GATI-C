"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { showError, showSuccess, showInfo, showWarning } from "@/hooks/use-toast"
import { useApp } from "@/contexts/app-context"
import { User } from "@/types/inventory";
import { UserCombobox } from '@/components/ui/user-combobox';
import { InventoryItem } from "@/types/inventory";

interface LendModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any
  onSuccess: () => void
}

export function LendModal({ open, onOpenChange, product, onSuccess }: LendModalProps) {
  const { state, updateInventoryItemStatus, addRecentActivity, addPendingRequest, updateInventoryItem, addHistoryEvent } = useApp()
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)



  useEffect(() => {
    if (!open) {
      setSelectedUser(null)
      setReturnDate(undefined)
      setIsLoading(false)
    }
  }, [open])

  const executeLend = () => {
    if (!product || !selectedUser || !returnDate) {
      showError({ title: "Error Interno", description: "Faltan datos para registrar el préstamo." });
      return;
    }

    setIsLoading(true);

    const updates: Partial<InventoryItem> = {
      estado: 'Prestado',
      prestadoA: selectedUser.nombre,
      fechaPrestamo: new Date().toISOString().split('T')[0],
      fechaDevolucion: returnDate.toISOString().split('T')[0]
    };

    updateInventoryItem(product.id, updates);

    addHistoryEvent(product.id, {
      fecha: new Date().toISOString(),
      usuario: state.user?.nombre || 'Sistema',
      accion: 'Préstamo',
      detalles: `Prestado a ${selectedUser.nombre} hasta el ${returnDate.toLocaleDateString()}.`
    });

    showSuccess({
      title: "Préstamo Registrado",
      description: `${product.nombre} ha sido prestado a ${selectedUser.nombre}.`,
    });

    setIsLoading(false);
    onSuccess();
    onOpenChange(false);
  };

  const handleLend = () => {
    if (!selectedUser || !returnDate) {
      showError({
        title: "Campos incompletos",
        description: "Por favor, selecciona un usuario y completa la fecha de devolución."
      })
      return
    }

    if (state.user?.rol === "Editor") {
      addPendingRequest({
        type: "Préstamo",
        details: {
          productId: product.id,
          productName: product.nombre,
          productSerialNumber: product.numeroSerie,
          lentTo: selectedUser.nombre,
          lentToEmail: selectedUser.email,
          returnDate: returnDate ? format(returnDate, "PPP") : "N/A",
        },
        requestedBy: state.user?.nombre || "Editor",
        date: new Date().toISOString(),
        status: "Pendiente",
        auditLog: [
          {
            event: "CREACIÓN",
            user: state.user?.nombre || "Editor",
            dateTime: new Date().toISOString(),
            description: `Solicitud de préstamo para ${product.nombre} creada.`,
          },
        ],
      })
      showInfo({
        title: "Solicitud enviada",
        description: `Tu solicitud de préstamo para ${product.nombre} ha sido enviada a un administrador para aprobación.`,
      })
      onOpenChange(false)
      return
    }

    executeLend()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Prestar Artículo: {product?.nombre}</DialogTitle>
          <DialogDescription>Registra el préstamo de este artículo a un usuario.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user">Prestar a *</Label>
            <UserCombobox
              value={selectedUser}
              onValueChange={setSelectedUser}
              placeholder="Selecciona o crea un usuario"
              currentUserRole={state.user?.rol || "Lector"}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="returnDate">Fecha de Devolución *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !returnDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => {
                    setReturnDate(date)
                    if (date && date < new Date(new Date().setHours(0, 0, 0, 0))) {
                      showWarning({
                        title: "Fecha en el pasado",
                        description: "La fecha de devolución no puede ser anterior a hoy"
                      })
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleLend} disabled={isLoading || !selectedUser || !returnDate}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrar Préstamo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
