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
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BrandCombobox } from "./brand-combobox"
import { ProviderCombobox } from './provider-combobox';
import { LocationCombobox } from './location-combobox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { InventoryItem } from "@/types/inventory";
import type { CreateProductData, UpdateProductData } from "@/lib/api/inventory";
import React from "react";

export interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: InventoryItem | null;
  onSuccess?: (args: { mode: 'add' | 'edit'; payload: CreateProductData | UpdateProductData; productId?: string }) => void;
}

export function EditProductModal({
  open,
  onOpenChange,
  product,
  onSuccess
}: EditProductModalProps) {
  const { state } = useApp()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "documents">("basic")
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [formData, setFormData] = useState({
    productName: product?.name || "",
    brand: product?.brand || "",
    model: product?.model || "",
    category: product?.category || "",
    description: product?.description || "",
    provider: product?.provider || "",
    location: product?.location || "",
    entryDate: product?.entryDate || new Date().toISOString().split('T')[0],
    purchaseDate: product?.purchaseDate || "",
    contractId: product?.contractId || "",
    // For serialized items, quantity is always 1, serial number is direct
    // For non-serialized, quantity is editable, serial number is null
    quantity: product?.quantity?.toString() || "1",
    serialNumber: product?.serialNumber || "",
    cost: product?.cost?.toString() || "",
    warrantyExpirationDate: product?.warrantyExpirationDate || "",
    usefulLife: product?.usefulLife || "",
  })

  // Add local state for serialization
  const [modalHasSerial, setModalHasSerial] = React.useState(false);


  // Documentos adjuntos (simulados)
  const [attachedDocuments, setAttachedDocuments] = useState<{ id: string, name: string, url: string, uploadDate: string }[]>(
    product?.attachedDocuments?.map((doc: any, index: number) => ({
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
        productName: product.name || "",
        brand: product.brand || "",
        model: product.model || "",
        category: product.category || "",
        description: product.description || "",
        provider: product.provider || "",
        location: product.location || "",
        entryDate: product.entryDate || new Date().toISOString().split('T')[0],
        purchaseDate: product.purchaseDate || "",
        contractId: product.contractId || "",
        quantity: product.quantity?.toString() || "1",
        serialNumber: product.serialNumber || "",
        cost: product.cost?.toString() || "",
        warrantyExpirationDate: product.warrantyExpirationDate || "",
        usefulLife: product.usefulLife || "",
      })
      // Set local state based on product's serial number
      setModalHasSerial(!!product.serialNumber);

      // Actualizar documentos adjuntos
      setAttachedDocuments(
        product?.attachedDocuments?.map((doc: any, index: number) => ({
          id: `doc-${index}`,
          name: doc.name,
          url: doc.url,
          uploadDate: new Date().toISOString().split('T')[0]
        })) || []
      )
    } else {
      // Si estamos creando un nuevo producto, asegurarnos de que el estado esté limpio
      // Esto es crucial para cuando el modal se reutiliza sin un "product"
      setFormData({
        productName: "",
        brand: "",
        model: "",
        category: "",
        description: "",
        provider: "",
        location: "",
        entryDate: new Date().toISOString().split('T')[0],
        purchaseDate: "",
        contractId: "",
        quantity: "1",
        serialNumber: "",
        cost: "",
        warrantyExpirationDate: "",
        usefulLife: "",
      });
      // For new products, default to non-serialized
      setModalHasSerial(false);
      setAttachedDocuments([]);
    }
  }, [product, open]); // Añadimos 'open' para que se resetee cada vez que se abre para un nuevo producto

  // Modify handleInputChange to use local state
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Validación inteligente en tiempo real
    if (field === "serialNumber" && value.trim() && modalHasSerial) {
      // Verificar si el número de serie ya existe (excluyendo el producto actual)
      const existingProduct = state.inventoryData.find(
        (item) => item.serialNumber === value.trim() && item.id !== product?.id
      )

      if (existingProduct) {
        showWarning({
          title: "Número de serie duplicado",
          description: `Este número ya pertenece a "${existingProduct.name}"`
        })
      }
    }

    if (field === "cost" && value) {
      const cost = parseFloat(value)
      if (isNaN(cost) || cost < 0) {
        showWarning({
          title: "Costo inválido",
          description: "El costo debe ser un número positivo"
        })
      }
    }

    // Validación para fecha de garantía
    if (field === "warrantyExpirationDate" && value) {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        showWarning({
          title: "Fecha de garantía inválida",
          description: "La fecha de vencimiento debe ser hoy o en el futuro."
        });
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

  // Modify handleSubmit to use local state
  const handleSubmit = async () => {
    // Verificar campos obligatorios independientemente de la pestaña activa
    if (!formData.productName || !formData.brand || !formData.model || !formData.category || !formData.entryDate) {
      // Determinar qué campos están faltando para mostrar un mensaje más específico
      const missingFields = [];
      if (!formData.productName) missingFields.push("Nombre del Producto");
      if (!formData.brand) missingFields.push("Marca");
      if (!formData.model) missingFields.push("Modelo");
      if (!formData.category) missingFields.push("Categoría");
      if (!formData.entryDate) missingFields.push("Fecha de Ingreso");

      showError({
        title: "Campos requeridos",
        description: `Por favor, completa los siguientes campos obligatorios: ${missingFields.join(", ")}.`
      });

      // Cambiar a la pestaña básica si hay campos faltantes
      setActiveTab("basic");
      return;
    }

    // Use modalHasSerial instead of hasSerialNumber
    const tempCantidad = modalHasSerial ? 1 : (Number(formData.quantity) || 1);
    const tempNumeroSerie = modalHasSerial ? formData.serialNumber : null;

    if (!tempCantidad || tempCantidad < 1) {
      showError({
        title: "Cantidad Inválida",
        description: "Por favor, especifica una cantidad válida (mínimo 1) para productos no serializados."
      });
      return;
    }

    setIsLoading(true)

    const mode = product ? 'edit' : 'add';

    // Build unified camelCase payload
    const common = {
      name: formData.productName,
      serialNumber: modalHasSerial ? (formData.serialNumber || null) : null,
      description: formData.description || null,
      cost: formData.cost ? parseFloat(formData.cost) : null,
      purchaseDate: formData.purchaseDate || null,
      condition: null as string | null,
      brandId: null as string | null,
      categoryId: null as string | null,
      locationId: null as string | null,
    };

    try {
      if (mode === 'edit' && product) {
        const updatePayload: UpdateProductData = { ...common };
        onSuccess?.({ mode: 'edit', payload: updatePayload, productId: String(product.id) });
      } else {
        const createPayload: CreateProductData = { ...common };
        onSuccess?.({ mode: 'add', payload: createPayload });
      }
      onOpenChange(false);
    } finally {
      setIsLoading(false);
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
                ? `Modifica la información del producto "${product.name}".`
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
                    value={formData.location || ''}
                    onValueChange={(val) => handleInputChange("location", val)}
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
                      checked={modalHasSerial}
                      onCheckedChange={setModalHasSerial}
                      disabled={product?.serialNumber !== null && product?.quantity === 1} // Disable if it's a serialized item that cannot be changed to non-serialized
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

                  {modalHasSerial ? (
                    <div className="space-y-2">
                      <Label htmlFor="serialNumber">Número de Serie</Label>
                      <Input
                        id="serialNumber"
                        value={formData.serialNumber}
                        onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                        disabled={product?.serialNumber !== null} // Disable if it's an existing serialized item
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
                  <Label htmlFor="entryDate">Fecha de Ingreso <span className="text-red-500">*</span></Label>
                  <Input
                    id="entryDate"
                    type="date"
                    value={formData.entryDate}
                    onChange={(e) => handleInputChange("entryDate", e.target.value)}
                    disabled={user?.rol !== "Administrador"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Fecha de Adquisición</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Proveedor</Label>
                  <ProviderCombobox
                    value={formData.provider || ''}
                    onValueChange={(val) => handleInputChange("provider", val)}
                    placeholder="Selecciona o escribe un proveedor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contratoId">ID de Contrato</Label>
                  <Input
                    id="contratoId"
                    value={formData.contractId || ''}
                    onChange={(e) => handleInputChange("contractId", e.target.value)}
                    placeholder="Ej: CFE-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Costo de Adquisición</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.cost}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warrantyExpirationDate">Fecha de Vencimiento de Garantía</Label>
                  <Input
                    id="warrantyExpirationDate"
                    type="date"
                    value={formData.warrantyExpirationDate}
                    onChange={(e) => handleInputChange("warrantyExpirationDate", e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                  <span className="text-xs text-muted-foreground">Deja vacío si el producto no tiene garantía.</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usefulLife">Vida Útil (hasta)</Label>
                  <Input
                    id="usefulLife"
                    type="date"
                    value={formData.usefulLife}
                    onChange={(e) => handleInputChange("usefulLife", e.target.value)}
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
