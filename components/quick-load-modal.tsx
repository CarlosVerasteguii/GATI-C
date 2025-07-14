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
import { showError, showInfo } from "@/hooks/use-toast"
import { Loader2, PackagePlus, HelpCircle } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BrandCombobox } from "./brand-combobox"

interface QuickLoadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Optional initial values for editing/pre-filling
  initialProductName?: string
  initialQuantity?: string
  initialSerialNumbers?: string
  initialBrand?: string
  initialModel?: string
  initialCategory?: string
  initialDescription?: string
  initialProveedor?: string
  initialFechaAdquisicion?: string
  initialContratoId?: string
  initialHasSerialNumber?: boolean
}

export function QuickLoadModal({
  open,
  onOpenChange,
  initialProductName = "",
  initialQuantity = "1",
  initialSerialNumbers = "",
  initialBrand = "",
  initialModel = "",
  initialCategory = "",
  initialDescription = "",
  initialProveedor = "",
  initialFechaAdquisicion = "",
  initialContratoId = "",
  initialHasSerialNumber = false,
}: QuickLoadModalProps) {
  const { state, addPendingTask, addRecentActivity } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [hasSerialNumber, setHasSerialNumber] = useState(initialHasSerialNumber)
  const [formData, setFormData] = useState({
    productName: initialProductName,
    quantity: initialQuantity,
    serialNumbers: initialSerialNumbers,
    brand: initialBrand,
    model: initialModel,
    category: initialCategory,
    description: initialDescription,
    proveedor: initialProveedor,
    fechaAdquisicion: initialFechaAdquisicion,
    contratoId: initialContratoId,
  })


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (
      !formData.productName ||
      (!hasSerialNumber && !formData.quantity) ||
      (hasSerialNumber && !formData.serialNumbers)
    ) {
      showError({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios."
      })
      return
    }

    setIsLoading(true)

    const serialsArray = hasSerialNumber
      ? formData.serialNumbers
        .split("\n")
        .filter(Boolean)
        .map((s) => s.trim())
      : []
    const quantity = hasSerialNumber ? serialsArray.length : Number.parseInt(formData.quantity)

    // Simulate task creation
    setTimeout(() => {
      addPendingTask({
        id: Math.floor(Math.random() * 10000),
        type: "CARGA",
        creationDate: new Date().toISOString(),
        createdBy: state.user?.nombre || "Usuario Rápido", // Use logged in user or default
        status: "Pendiente",
        details: {
          productName: formData.productName,
          quantity: quantity,
          serialNumbers: hasSerialNumber ? serialsArray : null,
          brand: formData.brand,
          model: formData.model,
          category: formData.category,
          description: formData.description,
          proveedor: formData.proveedor, // New field
          fechaAdquisicion: formData.fechaAdquisicion, // New field
          contratoId: formData.contratoId, // New field
        },
        auditLog: [
          {
            event: "CREACIÓN",
            user: state.user?.nombre || "Usuario Rápido",
            dateTime: new Date().toISOString(),
            description: `Solicitud de carga rápida para ${formData.productName} (${quantity} unidades) creada.`,
          },
        ],
      })
      showInfo({
        title: "Solicitud de Carga Enviada",
        description: "Tu solicitud de carga rápida ha sido enviada para aprobación y procesamiento."
      })
      addRecentActivity({
        type: "Creación de Tarea",
        description: `Tarea de carga rápida para ${formData.productName} creada por ${state.user?.nombre || "Usuario Rápido"}`,
        date: new Date().toLocaleString(),
        details: {
          productName: formData.productName,
          quantity: quantity,
          serialNumbers: hasSerialNumber ? serialsArray : null,
          createdBy: state.user?.nombre || "Usuario Rápido",
        },
      })
      // Reset form
      setFormData({
        productName: "",
        quantity: "1",
        serialNumbers: "",
        brand: "",
        model: "",
        category: "",
        description: "",
        proveedor: "",
        fechaAdquisicion: "",
        contratoId: "",
      })
      setHasSerialNumber(false)
      setIsLoading(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5" />
              Registrar Carga Rápida (Añadir Producto)
            </DialogTitle>
            <DialogDescription>
              Registra nuevos productos en el inventario para su posterior aprobación por un administrador.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Sección: Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <h3 className="col-span-full text-lg font-semibold border-b pb-2 mb-2">Información General</h3>
              <div className="space-y-2">
                <Label htmlFor="productName">Nombre del Producto *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange("productName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <BrandCombobox
                  value={formData.brand}
                  onValueChange={(val) => handleInputChange("brand", val)}
                  placeholder="Selecciona o escribe una marca"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input id="model" value={formData.model} onChange={(e) => handleInputChange("model", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.categorias.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sección: Detalles de Adquisición */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <h3 className="col-span-full text-lg font-semibold border-b pb-2 mb-2">Detalles de Adquisición</h3>
              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Input
                  id="proveedor"
                  value={formData.proveedor}
                  onChange={(e) => handleInputChange("proveedor", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaAdquisicion">Fecha de Adquisición</Label>
                <Input
                  id="fechaAdquisicion"
                  type="date"
                  value={formData.fechaAdquisicion}
                  onChange={(e) => handleInputChange("fechaAdquisicion", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contratoId">SICE / Contrato ID</Label>
                <Input
                  id="contratoId"
                  value={formData.contratoId}
                  onChange={(e) => handleInputChange("contratoId", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Sección: Gestión de Cantidad y Número de Serie */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="col-span-full text-lg font-semibold border-b pb-2 mb-2">Cantidad y Número de Serie</h3>
              <div className="flex items-center space-x-2">
                <Switch id="hasSerial" checked={hasSerialNumber} onCheckedChange={setHasSerialNumber} />
                <Label htmlFor="hasSerial" className="text-base">
                  Este artículo tiene número de serie
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Activa esta opción si cada unidad del producto tiene un número de serie único que debe ser
                        rastreado individualmente.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </div>
              {!hasSerialNumber ? (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    min="1"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="serialNumbers" className="flex items-center gap-1">
                    Números de Serie *
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ingrese un número de serie por línea para cada unidad.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Textarea
                    id="serialNumbers"
                    value={formData.serialNumbers}
                    onChange={(e) => handleInputChange("serialNumbers", e.target.value)}
                    rows={4}
                    placeholder="Ingrese un número de serie por línea&#10;Ejemplo:&#10;SN123456789&#10;SN987654321"
                    required
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary-hover">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Solicitud de Carga
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
