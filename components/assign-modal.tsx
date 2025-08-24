"use client"

import type React from "react"
import { InventoryItem, User } from "@/types/inventory"
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
import { UserCombobox } from "@/components/ui/user-combobox"

interface AssignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: InventoryItem | null
  onSuccess: () => void
}

interface AssignmentActionDetails {
  productId: number
  productName: string
  productSerialNumber: string | null
  assignedTo: string
  assignedToEmail: string
  notes: string
  quantity: number
}

export function AssignModal({ open, onOpenChange, product, onSuccess }: AssignModalProps) {
  const { state, updateInventoryItem, addPendingRequest, addRecentActivity, addInventoryItem, addHistoryEvent } = useApp()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmEditorOpen, setIsConfirmEditorOpen] = useState(false)
  const [pendingActionDetails, setPendingActionDetails] = useState<AssignmentActionDetails | null>(null)
  const [assignedToUser, setAssignedToUser] = useState<User | null>(null)

  if (!product) return null

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
    const notes = formData.get("notes") as string
    const quantity = product.serialNumber === null ? Number.parseInt(formData.get("quantity") as string) : 1

    if (!assignedToUser) {
      showError({
        title: "Error",
        description: "Please select a user for the assignment.",
      })
      setIsLoading(false)
      return
    }

    if (product.serialNumber === null && quantity > availableQuantity) {
      showError({
        title: "Quantity Error",
        description: `Only ${availableQuantity} units are available for assignment.`,
      })
      setIsLoading(false)
      return
    }

    const actionDetails: AssignmentActionDetails = {
      productId: product.id,
      productName: product.name,
      productSerialNumber: product.serialNumber,
      assignedTo: assignedToUser.name,
      assignedToEmail: assignedToUser.email,
      notes,
      quantity,
    }

    if (user?.role === "EDITOR") {
      setPendingActionDetails(actionDetails)
      setIsConfirmEditorOpen(true)
      setIsLoading(false)
      return
    }

    executeAssignment(actionDetails)
  }

  const executeAssignment = (details: AssignmentActionDetails) => {
    setTimeout(() => {
      // Assignment details are stored directly in the item

      // Update inventory state
      if (details.productSerialNumber !== null) {
        // Serialized item: update status and assignment details
        updateInventoryItem(details.productId, {
          status: "ASSIGNED",
          assignedTo: details.assignedTo,
          assignmentDate: new Date().toISOString().split("T")[0],
        })

        addHistoryEvent(details.productId, {
          date: new Date().toISOString(),
          user: user?.name || "System",
          action: "Assignment",
          details: `Assigned to ${details.assignedTo}. Notes: ${details.notes || "N/A"}`,
        })
      } else {
        // --- Logic for non-serialized items (record splitting) ---

        // 1. Find the matching available stack
        const sourceStack = state.inventoryData.find(
          (item) => item.id === details.productId && item.status === "AVAILABLE",
        )

        if (!sourceStack) {
          showError({ title: "Stock Error", description: "Available product group not found." })
          setIsLoading(false)
          return
        }

        // 2. Update source stack
        const updatedSourceStack = {
          ...sourceStack,
          quantity: sourceStack.quantity - details.quantity,
        }
        updateInventoryItem(sourceStack.id, { quantity: updatedSourceStack.quantity })

        // 3. Create or update assigned stack
        const existingAssignedStack = state.inventoryData.find(
          (item) =>
            item.name === details.productName &&
            item.status === "ASSIGNED" &&
            item.assignedTo === details.assignedTo,
        )

        if (existingAssignedStack) {
          updateInventoryItem(existingAssignedStack.id, {
            quantity: existingAssignedStack.quantity + details.quantity,
            assignmentDate: new Date().toISOString().split("T")[0],
          })

          addHistoryEvent(existingAssignedStack.id, {
            date: new Date().toISOString(),
            user: user?.name || "System",
            action: "Assignment",
            details: `Assigned to ${details.assignedTo}. Quantity: ${details.quantity}. Notes: ${details.notes || "N/A"}`,
          })
        } else {
          const newAssignedItem: InventoryItem = {
            ...sourceStack,
            id: Math.floor(Math.random() * 100000) + 1000,
            status: "ASSIGNED",
            quantity: details.quantity,
            assignedTo: details.assignedTo,
            assignmentDate: new Date().toISOString().split("T")[0],
            serialNumber: null,
          }
          const addedItem = addInventoryItem(newAssignedItem)

          addHistoryEvent(newAssignedItem.id, {
            date: new Date().toISOString(),
            user: user?.name || "System",
            action: "Assignment",
            details: `Assigned to ${details.assignedTo}. Quantity: ${details.quantity}. Notes: ${details.notes || "N/A"}`,
          })
        }
      }

      showSuccess({
        title: "Product assigned",
        description: `${details.productName} has been assigned to ${details.assignedTo}.`,
      })
      addRecentActivity({
        type: "Assignment",
        description: `${details.productName} assigned to ${details.assignedTo}`,
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
    if (!pendingActionDetails) return
    addPendingRequest({
      id: Date.now(),
      type: "ASSIGNMENT",
      details: pendingActionDetails,
      requestedBy: user?.name || "Editor",
      date: new Date().toISOString(),
      status: "PENDING",
      auditLog: [
        {
          event: "CREATION",
          user: user?.name || "Editor",
          dateTime: new Date().toISOString(),
          description: `Assignment request for ${pendingActionDetails.productName} created.`,
        },
      ],
    })
    showInfo({
      title: "Request sent",
      description: `Your assignment request for ${pendingActionDetails.productName} has been sent to an administrator for approval.`,
    })
    setIsConfirmEditorOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Product</DialogTitle>
            <DialogDescription>Assign "{product.name}" to a user or department.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign to</Label>
                <UserCombobox
                  value={assignedToUser}
                  onValueChange={setAssignedToUser}
                  placeholder="Select or create a user"
                  currentUserRole={user?.role || "READER"}
                />
              </div>
              {product.serialNumber === null && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity to Assign</Label>
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
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" name="notes" placeholder="Additional notes about the assignment" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading || !assignedToUser}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialogForEditor
        open={isConfirmEditorOpen}
        onOpenChange={setIsConfirmEditorOpen}
        onConfirm={handleConfirmEditorAction}
        title="Confirm Assignment Request"
        description={`A request will be sent to assign the product ${pendingActionDetails?.productName} to ${pendingActionDetails?.assignedTo}.`}
        confirmText="Send Request"
      />
    </>
  )
}

