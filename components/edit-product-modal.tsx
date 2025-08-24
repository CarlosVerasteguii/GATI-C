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

interface AttachedDocument {
  id: string
  name: string
  url: string
  uploadDate: string
}

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


  // Simulated attached documents
  const [attachedDocuments, setAttachedDocuments] = useState<AttachedDocument[]>(
    product?.attachedDocuments?.map((doc: { name: string; url: string }, index: number) => ({
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

      // Update attached documents
      setAttachedDocuments(
        product?.attachedDocuments?.map((doc: { name: string; url: string }, index: number) => ({
          id: `doc-${index}`,
          name: doc.name,
          url: doc.url,
          uploadDate: new Date().toISOString().split('T')[0]
        })) || []
      )
    } else {
      // When creating a new product ensure the state is clean
      // This is crucial when the modal is reused without a "product"
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
  }, [product, open]); // We include 'open' so it resets each time it opens for a new product

  // Modify handleInputChange to use local state
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Intelligent real-time validation
    if (field === "serialNumber" && value.trim() && modalHasSerial) {
      // Check if the serial number already exists (excluding the current product)
      const existingProduct = state.inventoryData.find(
        (item) => item.serialNumber === value.trim() && item.id !== product?.id
      )

      if (existingProduct) {
        showWarning({
          title: "Duplicate serial number",
          description: `This number already belongs to "${existingProduct.name}"`
        })
      }
    }

    if (field === "cost" && value) {
      const cost = parseFloat(value)
      if (isNaN(cost) || cost < 0) {
        showWarning({
          title: "Invalid cost",
          description: "Cost must be a positive number"
        })
      }
    }

    // Validation for warranty date
    if (field === "warrantyExpirationDate" && value) {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        showWarning({
          title: "Invalid warranty date",
          description: "The expiration date must be today or in the future."
        });
      }
    }
  }

  const handleFileUpload = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      showError({
        title: "Error",
        description: "Please select at least one file to upload."
      });
      return;
    }

    // Simulated upload
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
        title: "Documents uploaded",
        description: `${newDocs.length} document(s) uploaded successfully.`
      });
    }, 1000);
  };

  // Modify handleSubmit to use local state
  const handleSubmit = async () => {
    // Check required fields regardless of active tab
    if (!formData.productName || !formData.brand || !formData.model || !formData.category || !formData.entryDate) {
      // Determine which fields are missing for a more specific message
      const missingFields: string[] = [];
      if (!formData.productName) missingFields.push("Product Name");
      if (!formData.brand) missingFields.push("Brand");
      if (!formData.model) missingFields.push("Model");
      if (!formData.category) missingFields.push("Category");
      if (!formData.entryDate) missingFields.push("Entry Date");

      showError({
        title: "Required fields",
        description: `Please complete the following required fields: ${missingFields.join(", ")}.`
      });

      // Switch to the basic tab if fields are missing
      setActiveTab("basic");
      return;
    }

    // Use modalHasSerial instead of hasSerialNumber
    const tempQuantity = modalHasSerial ? 1 : (Number(formData.quantity) || 1);
    if (!tempQuantity || tempQuantity < 1) {
      showError({
        title: "Invalid Quantity",
        description: "Please specify a valid quantity (minimum 1) for non-serialized products."
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
      brandId: null as string | null,
      categoryId: null as string | null,
      locationId: null as string | null,
      contractId: formData.contractId || null,
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

  // If there's no product, we still render the modal to allow adding new products
  // Previously: if (!product) return null

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {product ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription>
              {product
                ? `Modify the information for product "${product.name}".`
                : "Add a new product to the inventory."
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "basic" | "details" | "documents")}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="details">Technical Details</TabsTrigger>
              <TabsTrigger value="documents">Documentation</TabsTrigger>
            </TabsList>

            {/* Tab: Basic Information */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand <span className="text-red-500">*</span></Label>
                  <BrandCombobox
                    value={formData.brand}
                    onValueChange={(val) => handleInputChange("brand", val)}
                    placeholder="Select or type a brand"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <LocationCombobox
                    value={formData.location || ''}
                    onValueChange={(val) => handleInputChange("location", val)}
                    placeholder="Select or type a location"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description (optional)</Label>
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
                        This item has a serial number
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Enable this option if each unit of the product has a unique serial number that needs to be tracked individually.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                  </div>

                  {modalHasSerial ? (
                    <div className="space-y-2">
                      <Label htmlFor="serialNumber">Serial Number</Label>
                      <Input
                        id="serialNumber"
                        value={formData.serialNumber}
                        onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                        disabled={product?.serialNumber !== null} // Disable if it's an existing serialized item
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
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

            {/* Tab: Technical Details */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryDate">Entry Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="entryDate"
                    type="date"
                    value={formData.entryDate}
                    onChange={(e) => handleInputChange("entryDate", e.target.value)}
                    disabled={user?.role !== "ADMINISTRATOR"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <ProviderCombobox
                    value={formData.provider || ''}
                    onValueChange={(val) => handleInputChange("provider", val)}
                    placeholder="Select or type a provider"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractId">Contract ID</Label>
                  <Input
                    id="contractId"
                    value={formData.contractId || ''}
                    onChange={(e) => handleInputChange("contractId", e.target.value)}
                    placeholder="E.g., CFE-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Acquisition Cost</Label>
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
                  <Label htmlFor="warrantyExpirationDate">Warranty Expiration Date</Label>
                  <Input
                    id="warrantyExpirationDate"
                    type="date"
                    value={formData.warrantyExpirationDate}
                    onChange={(e) => handleInputChange("warrantyExpirationDate", e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                  <span className="text-xs text-muted-foreground">Leave empty if the product has no warranty.</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usefulLife">Useful Life (until)</Label>
                  <Input
                    id="usefulLife"
                    type="date"
                    value={formData.usefulLife}
                    onChange={(e) => handleInputChange("usefulLife", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab: Documentation */}
            <TabsContent value="documents" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Attached Documents</h3>

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
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">View</a>
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
                  <p className="text-sm text-muted-foreground mb-4">No attached documents for this product.</p>
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
                          Uploading...
                        </>
                      ) : (
                        "Upload"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allowed formats: PDF, DOCX. Max size: 100MB.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary-hover">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
