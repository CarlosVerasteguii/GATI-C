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
import type { InventoryItem } from "@/types/inventory"

interface RetireProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: InventoryItem
  onSuccess: () => void
}

interface RetirementActionDetails {
  productId: number
  productName: string
  productSerialNumber: string | null
  retireReason: string
  notes: string
  quantity: number
  productModel: string
}

export function RetireProductModal({ open, onOpenChange, product, onSuccess }: RetireProductModalProps) {
  const { state, updateInventoryItemStatus, addPendingRequest, addRecentActivity, updateInventory } = useApp()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmEditorOpen, setIsConfirmEditorOpen] = useState(false)
  const [pendingActionDetails, setPendingActionDetails] = useState<RetirementActionDetails | null>(null)

  const availableQuantity =
    product.serialNumber === null
      ? state.inventoryData
          .filter(
            (item) => item.name === product.name && item.model === product.model && item.status === "AVAILABLE",
          )
          .reduce((sum, item) => sum + item.quantity, 0)
      : 1 // For serialized, it's always 1 if available

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const retireReason = formData.get("retireReason") as string
    const notes = formData.get("notes") as string
    const quantity = product.serialNumber === null ? Number.parseInt(formData.get("quantity") as string) : 1

    if (!retireReason) {
      showError({
        title: "Error",
        description: "Please select a retirement reason.",
      })
      setIsLoading(false)
      return
    }

    if (product.serialNumber === null && quantity > availableQuantity) {
      showError({
        title: "Quantity Error",
        description: `Only ${availableQuantity} units are available to retire.`,
      })
      setIsLoading(false)
      return
    }

    const actionDetails: RetirementActionDetails = {
      productId: product.id,
      productName: product.name,
      productSerialNumber: product.serialNumber,
      retireReason,
      notes,
      quantity,
      productModel: product.model,
    }

    if (user?.role === "EDITOR") {
      setPendingActionDetails(actionDetails)
      setIsConfirmEditorOpen(true)
      setIsLoading(false)
      return
    }

    executeRetirement(actionDetails)
  }

  const executeRetirement = (details: RetirementActionDetails) => {
    setTimeout(() => {
      if (details.productSerialNumber !== null) {
        // Serialized item
        updateInventoryItemStatus(details.productId, "RETIRED")
      } else {
        // Non-serialized item: find and update available units
        let remainingToRetire = details.quantity
        const updatedInventory = state.inventoryData.map((item) => {
          if (
            item.name === details.productName &&
            item.model === details.productModel &&
            item.serialNumber === null &&
            item.status === "AVAILABLE" &&
            remainingToRetire > 0
          ) {
            const qtyToTake = Math.min(item.quantity, remainingToRetire)
            remainingToRetire -= qtyToTake
            return {
              ...item,
              quantity: item.quantity - qtyToTake,
              status: item.quantity - qtyToTake === 0 ? "RETIRED" : item.status,
            }
          }
          return item
        })

        // Add new retired entries for the non-serialized items
        if (details.quantity > 0) {
          const newRetiredItem: InventoryItem & {
            retirementReason: string
            retirementDate: string
            retirementNotes: string
          } = {
            id: Math.max(...state.inventoryData.map((item) => item.id)) + 1,
            name: details.productName,
            brand: product.brand,
            model: product.model,
            category: product.category,
            description: product.description,
            status: "RETIRED",
            quantity: details.quantity,
            serialNumber: null,
            entryDate: product.entryDate,
            retirementReason: details.retireReason,
            retirementDate: new Date().toISOString().split("T")[0],
            retirementNotes: details.notes,
            provider: product.provider,
            purchaseDate: product.purchaseDate,
            contractId: product.contractId,
          }
          updatedInventory.push(newRetiredItem)
        }
        updateInventory(updatedInventory)
      }

      showSuccess({
        title: "Product retired",
        description: `${details.productName} has been marked as retired due to ${details.retireReason}.`,
      })
      addRecentActivity({
        type: "Product Retirement",
        description: `${details.productName} retired due to ${details.retireReason}`,
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
    if (!pendingActionDetails) return
    addPendingRequest({
      id: Date.now(),
      type: "PRODUCT_RETIREMENT",
      details: pendingActionDetails,
      requestedBy: user?.name || "Editor",
      date: new Date().toISOString(),
      status: "PENDING",
      auditLog: [
        {
          event: "CREATION",
          user: user?.name || "Editor",
          dateTime: new Date().toISOString(),
          description: `Product retirement request created.`,
        },
      ],
    })
    showInfo({
      title: "Request sent",
      description: `Your product retirement request has been sent to an administrator for approval.`,
    })
    setIsConfirmEditorOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Retire Product</DialogTitle>
            <DialogDescription>Mark "{product.name}" as retired from the inventory.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="retireReason">Retirement Reason</Label>
                <Select name="retireReason" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                    <SelectItem value="Obsolete">Obsolete</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Loaned/Assigned (Not Returned)">Loaned/Assigned (Not Returned)</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {product.serialNumber === null && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity to Retire</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    defaultValue={1}
                    min={1}
                    max={availableQuantity}
                    required
                  />
                  <p className="text-sm text-muted-foreground">Currently available: {availableQuantity}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" name="notes" placeholder="Additional notes about the retirement" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Retirement
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

