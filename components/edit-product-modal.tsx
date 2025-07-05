"use client"

import { useState, useEffect } from "react"
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
import { showError, showSuccess, showWarning } from "@/hooks/use-toast"
import { Loader2, Edit, HelpCircle, ExternalLink, Trash2 } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BrandCombobox } from "./brand-combobox"
import { ProviderCombobox } from './provider-combobox';
import { LocationCombobox } from './location-combobox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { InventoryItem } from "@/types/inventory";

interface EditProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any // The product object to edit
  onSuccess: () => void
}

export function EditProductModal({ open, onOpenChange, product, onSuccess }: EditProductModalProps) {
  const { state, addPendingTask, addInventoryItem, updateInventoryItem } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [hasSerialNumber, setHasSerialNumber] = useState(product?.numeroSerie !== null)
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "documents">("basic")
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [formData, setFormData] = useState({
    productName: product?.nombre || "",
    brand: product?.marca || "",
    model: product?.modelo || "",
    category: product?.categoria || "",
    description: product?.descripcion || "",
    proveedor: product?.proveedor || "",
    ubicacion: product?.ubicacion || "",
    fechaIngreso: product?.fechaIngreso || new Date().toISOString().split('T')[0],
    fechaAdquisicion: product?.fechaAdquisicion || "",
    contratoId: product?.contratoId || "",
    // For serialized items, quantity is always 1, serial number is direct
    // For non-serialized, quantity is editable, serial number is null
    quantity: product?.cantidad?.toString() || "1",
    serialNumber: product?.numeroSerie || "",
    costo: product?.costo?.toString() || "",
    garantia: product?.garantia || "",
    vidaUtil: product?.vidaUtil || "",
  })


  // Documentos adjuntos (simulados)
  const [attachedDocuments, setAttachedDocuments] = useState<{ id: string, name: string, url: string, uploadDate: string }[]>(
    product?.documentosAdjuntos?.map((doc: any, index: number) => ({
      id: `doc-${index}`,
      name: doc.name,
      url: doc.url,
      uploadDate: new Date().toISOString().split('T')[0]
    })) || []
  )

  // Update form data when product prop changes (e.g., when a different product is selected for editing)
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.nombre || "",
        brand: product.marca || "",
        model: product.modelo || "",
        category: product.categoria || "",
        description: product.descripcion || "",
        proveedor: product.proveedor || "",
        ubicacion: product.ubicacion || "",
        fechaIngreso: product.fechaIngreso || new Date().toISOString().split('T')[0],
        fechaAdquisicion: product.fechaAdquisicion || "",
        contratoId: product.contratoId || "",
        quantity: product.cantidad?.toString() || "1",
        serialNumber: product.numeroSerie || "",
        costo: product.costo?.toString() || "",
        garantia: product.garantia || "",
        vidaUtil: product.vidaUtil || "",
      })
      setHasSerialNumber(product.numeroSerie !== null)

      // Actualizar documentos adjuntos
      setAttachedDocuments(
        product?.documentosAdjuntos?.map((doc: any, index: number) => ({
          id: `doc-${index}`,
          name: doc.name,
          url: doc.url,
          uploadDate: new Date().toISOString().split('T')[0]
        })) || []
      )
    }
  }, [product])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Validación inteligente en tiempo real
    if (field === "serialNumber" && value.trim() && hasSerialNumber) {
      // Verificar si el número de serie ya existe (excluyendo el producto actual)
      const existingProduct = state.inventoryData.find(
        (item) => item.numeroSerie === value.trim() && item.id !== product.id
      )

      if (existingProduct) {
        showWarning({
          title: "Número de serie duplicado",
          description: `Este número ya pertenece a "${existingProduct.nombre}"`
        })
      }
    }

    if (field === "costo" && value) {
      const cost = parseFloat(value)
      if (isNaN(cost) || cost < 0) {
        showWarning({
          title: "Costo inválido",
          description: "El costo debe ser un número positivo"
        })
      }
    }
  }

  const handleFileUpload = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      showError({
        title: "Error",
        description: "Seleccione al menos un archivo para subir."
      });
      return;
    }

    // Simulación de subida
    setUploadingFiles(true);

    setTimeout(() => {
      const newDocs = Array.from(selectedFiles).map(file => ({
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString().split('T')[0]
      }));

      setAttachedDocuments(prev => [...prev, ...newDocs]);
      setSelectedFiles(null);
      setUploadingFiles(false);

      showSuccess({
        title: "Documentos subidos",
        description: `Se han subido ${newDocs.length} documento(s) correctamente.`
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    // Verificar campos obligatorios independientemente de la pestaña activa
    if (!formData.productName || !formData.brand || !formData.model || !formData.category || !formData.fechaIngreso) {
      // Determinar qué campos están faltando para mostrar un mensaje más específico
      const missingFields = [];
      if (!formData.productName) missingFields.push("Nombre del Producto");
      if (!formData.brand) missingFields.push("Marca");
      if (!formData.model) missingFields.push("Modelo");
      if (!formData.category) missingFields.push("Categoría");
      if (!formData.fechaIngreso) missingFields.push("Fecha de Ingreso");

      showError({
        title: "Campos requeridos",
        description: `Por favor, completa los siguientes campos obligatorios: ${missingFields.join(", ")}.`
      });

      // Cambiar a la pestaña básica si hay campos faltantes
      setActiveTab("basic");
      return;
    }

    setIsLoading(true)

    // Prepare updates based on whether it's serialized or not
    const updates = {
      nombre: formData.productName,
      marca: formData.brand,
      modelo: formData.model,
      categoria: formData.category,
      descripcion: formData.description,
      fechaIngreso: formData.fechaIngreso,
      proveedor: formData.proveedor,
      ubicacion: formData.ubicacion,
      fechaAdquisicion: formData.fechaAdquisicion,
      contratoId: formData.contratoId,
      cantidad: hasSerialNumber ? 1 : Number.parseInt(formData.quantity),
      numeroSerie: hasSerialNumber ? formData.serialNumber : null,
      costo: formData.costo ? parseFloat(formData.costo) : undefined,
      garantia: formData.garantia || undefined,
      vidaUtil: formData.vidaUtil || undefined,
      documentosAdjuntos: attachedDocuments.map(doc => ({
        name: doc.name,
        url: doc.url
      }))
    }

    const mode = product ? 'edit' : 'add';

    if (state.user?.rol === 'Administrador') {
      // --- FLUJO PARA ADMINISTRADOR: EJECUCIÓN DIRECTA ---
      if (mode === 'edit' && product?.id) {
        // Estamos editando un producto existente
        updateInventoryItem(product.id, updates);
        showSuccess({
          title: "Producto Actualizado",
          description: "Los cambios en el producto han sido guardados."
        });
      } else {
        // Estamos creando un nuevo producto
        const newItem: InventoryItem = {
          id: Math.floor(Math.random() * 10000), // ID Temporal
          estado: 'Disponible', // Estado por defecto
          ...updates
        } as InventoryItem;
        addInventoryItem(newItem);
        showSuccess({
          title: "Producto Añadido",
          description: "El nuevo producto ha sido añadido al inventario."
        });
      }
      setIsLoading(false);
      onOpenChange(false);
      onSuccess();

    } else {
      // --- FLUJO PARA OTROS ROLES: CREAR TAREA PENDIENTE ---
      setTimeout(() => {
        addPendingTask({
          id: Math.floor(Math.random() * 10000),
          type: mode === 'edit' ? "Edición de Producto" : "Creación de Producto",
          creationDate: new Date().toISOString(),
          createdBy: state.user?.nombre || "Usuario Desconocido",
          status: "Pendiente",
          details: {
            originalProductId: product?.id,
            updates: updates,
          },
          auditLog: [
            {
              event: "CREACIÓN",
              user: state.user?.nombre || "Usuario Desconocido",
              dateTime: new Date().toISOString(),
              description: `Solicitud de ${mode === 'edit' ? 'edición' : 'creación'} para el producto ${updates.nombre} creada.`,
            },
          ],
        });
        showSuccess({
          title: "Solicitud Enviada",
          description: "Tu solicitud ha sido enviada para aprobación."
        });
        setIsLoading(false);
        onOpenChange(false);
        onSuccess();
      }, 1000);
    }
  }

  // Si no hay producto, no retornamos null porque también necesitamos abrir el modal para añadir productos
  // Antes: if (!product) return null

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {product ? "Editar Producto" : "Añadir Producto"}
            </DialogTitle>
            <DialogDescription>
              {product
                ? `Modifica la información del producto "${product.nombre}".`
                : "Añade un nuevo producto al inventario."
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "basic" | "details" | "documents")}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Información Básica</TabsTrigger>
              <TabsTrigger value="details">Detalles Técnicos</TabsTrigger>
              <TabsTrigger value="documents">Documentación</TabsTrigger>
            </TabsList>

            {/* Pestaña: Información Básica */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nombre del Producto <span className="text-red-500">*</span></Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca <span className="text-red-500">*</span></Label>
                  <BrandCombobox
                    value={formData.brand}
                    onValueChange={(val) => handleInputChange("brand", val)}
                    placeholder="Selecciona o escribe una marca"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo <span className="text-red-500">*</span></Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría <span className="text-red-500">*</span></Label>
                  <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)} required>
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
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <LocationCombobox
                    value={formData.ubicacion || ''}
                    onValueChange={(val) => handleInputChange("ubicacion", val)}
                    placeholder="Selecciona o escribe una ubicación"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasSerial"
                      checked={hasSerialNumber}
                      onCheckedChange={setHasSerialNumber}
                      disabled={product?.numeroSerie !== null && product?.cantidad === 1} // Disable if it's a serialized item that cannot be changed to non-serialized
                    />
                    <Label htmlFor="hasSerial" className="flex items-center gap-1">
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

                  {hasSerialNumber ? (
                    <div className="space-y-2">
                      <Label htmlFor="serialNumber">Número de Serie</Label>
                      <Input
                        id="serialNumber"
                        value={formData.serialNumber}
                        onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                        disabled={product?.numeroSerie !== null} // Disable if it's an existing serialized item
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Cantidad</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Pestaña: Detalles Técnicos */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaIngreso">Fecha de Ingreso <span className="text-red-500">*</span></Label>
                  <Input
                    id="fechaIngreso"
                    type="date"
                    value={formData.fechaIngreso}
                    onChange={(e) => handleInputChange("fechaIngreso", e.target.value)}
                    disabled={state.user?.rol !== "Administrador"}
                    required
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
                  <Label htmlFor="provider">Proveedor</Label>
                  <ProviderCombobox
                    value={formData.proveedor || ''}
                    onValueChange={(val) => handleInputChange("proveedor", val)}
                    placeholder="Selecciona o escribe un proveedor"
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
                  <Label htmlFor="costo">Costo de Adquisición</Label>
                  <Input
                    id="costo"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.costo}
                    onChange={(e) => handleInputChange("costo", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="garantia">Garantía (hasta)</Label>
                  <Input
                    id="garantia"
                    type="date"
                    value={formData.garantia}
                    onChange={(e) => handleInputChange("garantia", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vidaUtil">Vida Útil (hasta)</Label>
                  <Input
                    id="vidaUtil"
                    type="date"
                    value={formData.vidaUtil}
                    onChange={(e) => handleInputChange("vidaUtil", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Pestaña: Documentación */}
            <TabsContent value="documents" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Documentos Adjuntos</h3>

                {attachedDocuments.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {attachedDocuments.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded bg-muted/30">
                        <div className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm font-medium">{doc.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">Ver</a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => setAttachedDocuments(prev => prev.filter(d => d.id !== doc.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">No hay documentos adjuntos para este producto.</p>
                )}

                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={(e) => setSelectedFiles(e.target.files)}
                      disabled={uploadingFiles}
                    />
                    <Button
                      type="button"
                      onClick={handleFileUpload}
                      disabled={!selectedFiles || uploadingFiles}
                      className="whitespace-nowrap"
                    >
                      {uploadingFiles ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Subiendo...
                        </>
                      ) : (
                        "Subir"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatos permitidos: PDF, DOCX. Tamaño máximo: 100MB.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary-hover">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
