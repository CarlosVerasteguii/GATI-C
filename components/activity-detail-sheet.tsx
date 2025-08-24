"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Info, History, FileText, User } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { InventoryItem } from "@/types/inventory"

interface ActivityItem {
  type: string
  description: string
  date: string
  details?: Record<string, unknown>
  requestedBy?: string
  status?: string
}

interface ActivityDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: ActivityItem | null
}

const renderDetail = (label: string, value: React.ReactNode, className?: string) => {
  if (value === undefined || value === null || value === "") return null
  return (
    <div className={cn("flex justify-between items-center py-1", className)}>
      <dt className="text-sm font-medium text-muted-foreground">{label}:</dt>
      <dd className="text-sm text-right">{value}</dd>
    </div>
  )
}

const renderDiff = (
  oldData: Record<string, unknown> = {},
  newData: Record<string, unknown> = {}
) => {
  const keys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]))

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="space-y-2">
        <h4 className="font-semibold text-muted-foreground">Before:</h4>
        {keys.map((key) => {
          const oldValue = oldData?.[key]
          const newValue = newData?.[key]
          const changed = oldValue !== newValue
          return (
            <div key={key} className={cn("flex justify-between", changed && "font-medium")}>
              <span className="text-muted-foreground">{key}:</span>
              <span className={cn(changed && "text-red-500 line-through")}>
                {oldValue !== undefined ? String(oldValue) : "N/A"}
              </span>
            </div>
          )
        })}
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold text-muted-foreground">After:</h4>
        {keys.map((key) => {
          const oldValue = oldData?.[key]
          const newValue = newData?.[key]
          const changed = oldValue !== newValue
          return (
            <div key={key} className={cn("flex justify-between", changed && "font-medium")}>
              <span className="text-muted-foreground">{key}:</span>
              <span className={cn(changed && "text-green-500")}>
                {newValue !== undefined ? String(newValue) : "N/A"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Date formatting helpers with error handling
const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid date"
    return format(date, "dd/MM/yyyy", { locale: enUS })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}

const formatDateTime = (dateString: string) => {
  try {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid date"
    return format(date, "dd/MM/yyyy, HH:mm:ss", { locale: enUS })
  } catch (error) {
    console.error("Error formatting date and time:", error)
    return "Invalid date"
  }
}

export function ActivityDetailSheet({ open, onOpenChange, activity }: ActivityDetailSheetProps) {
  if (!activity) return null

  const renderActivityDetails = () => {
    switch (activity.type) {
      case "Product Edit":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Edit Details</h3>
            {renderDiff(activity.details?.oldData as Record<string, unknown>, activity.details?.newData as Record<string, unknown>)}
            {renderDetail("Product ID", activity.details?.productId)}
            {renderDetail("Edited By", activity.details?.editedBy || activity.requestedBy)}
            {renderDetail("Edit Notes", activity.details?.notes)}
          </>
        )
      case "New Product":
      case "Product Duplication":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Added/Duplicated Products</h3>
            <ul className="list-disc pl-5 space-y-1">
              {(activity.details?.newProducts as InventoryItem[] | undefined)?.map((product, index) => (
                <li key={index} className="text-sm">
                  {product.name} ({product.serialNumber || `QTY: ${product.quantity}`}) - {product.brand} - {product.model} - {product.category} - Provider: {product.provider || "N/A"} - Purchase Date: {product.purchaseDate || "N/A"} - Contract ID: {product.contractId || "N/A"}
                </li>
              ))}
            </ul>
            {renderDetail("Created By", activity.details?.createdBy || activity.requestedBy)}
            {renderDetail("Entry Date", activity.details?.entryDate)}
          </>
        )
      case "Product Retirement":
      case "Reactivation":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Involved Product</h3>
            {renderDetail("Name", (activity.details?.product as InventoryItem | undefined)?.name)}
            {renderDetail("Serial Number", (activity.details?.product as InventoryItem | undefined)?.serialNumber || "N/A")}
            {renderDetail("Product ID", (activity.details?.product as InventoryItem | undefined)?.id)}
            {renderDetail("Previous Status", activity.details?.oldStatus)}
            {renderDetail("New Status", activity.details?.newStatus)}
            {renderDetail("Retirement Reason", activity.details?.reason)}
            {renderDetail("Action Performed By", activity.details?.actionBy || activity.requestedBy)}
          </>
        )
      case "Assignment":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Assignment Details</h3>
            {renderDetail("Assigned to", activity.details?.assignedTo)}
            {renderDetail("Department", activity.details?.department)}
            {renderDetail("Assignment Date", formatDate(activity.details?.assignmentDate as string))}
            {renderDetail("Assigned By", activity.details?.assignedBy || activity.requestedBy)}
            {renderDetail("Notes", activity.details?.notes)}
            <h4 className="font-semibold mt-4 mb-2">Assigned Items:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {(activity.details?.items as InventoryItem[] | undefined)?.map((item, index) => (
                <li key={index} className="text-sm">
                  {item.name} (S/N: {item.serialNumber || "N/A"}) - QTY: {item.quantity} - Brand: {item.brand || "N/A"} - Model: {item.model || "N/A"} - Category: {item.category || "N/A"}
                </li>
              ))}
            </ul>
          </>
        )
      case "Loan":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Loan Details</h3>
            {renderDetail("Loaned to", activity.details?.lentTo)}
            {renderDetail("Loan Date", formatDate(activity.details?.loanDate as string))}
            {renderDetail("Return Date", formatDate(activity.details?.returnDate as string))}
            {renderDetail("Loaned By", activity.details?.lentBy || activity.requestedBy)}
            {renderDetail("Notes", activity.details?.notes)}
            <h4 className="font-semibold mt-4 mb-2">Loaned Items:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {(activity.details?.items as InventoryItem[] | undefined)?.map((item, index) => (
                <li key={index} className="text-sm">
                  {item.name} (S/N: {item.serialNumber || "N/A"}) - QTY: {item.quantity} - Brand: {item.brand || "N/A"} - Model: {item.model || "N/A"} - Category: {item.category || "N/A"}
                </li>
              ))}
            </ul>
          </>
        )
      case "Return":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Return Details</h3>
            {renderDetail("Returned by", activity.details?.returnedBy)}
            {renderDetail("Return Date", formatDate(activity.details?.returnDate as string))}
            {renderDetail("Received By", activity.details?.receivedBy || activity.requestedBy)}
            {renderDetail("Condition on Return", activity.details?.condition)}
            <h4 className="font-semibold mt-4 mb-2">Returned Items:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {(activity.details?.items as InventoryItem[] | undefined)?.map((item, index) => (
                <li key={index} className="text-sm">
                  {item.name} (S/N: {item.serialNumber || "N/A"}) - QTY: {item.quantity} - Status: {item.status || "N/A"}
                </li>
              ))}
            </ul>
          </>
        )
      case "CSV Import":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Import Details</h3>
            {renderDetail("Number of Imported Products", activity.details?.count)}
            {renderDetail("File Name", activity.details?.fileName)}
            {renderDetail("Imported By", activity.details?.importedBy || activity.requestedBy)}
          </>
        )
      case "Task Creation":
      case "Task Cancellation":
      case "Task Completion":
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Task Details</h3>
            {renderDetail("Task ID", activity.details?.taskId)}
            {renderDetail("Task Type", activity.details?.taskType)}
            {renderDetail("Created By", activity.details?.createdBy || activity.requestedBy)}
            {renderDetail("Creation Date", formatDate(activity.details?.creationDate as string))}
            {activity.details?.productName && renderDetail("Product", activity.details.productName)}
            {activity.details?.quantity && renderDetail("Quantity", activity.details.quantity)}
            {activity.details?.serialNumbers &&
              renderDetail("Serial Numbers", (activity.details.serialNumbers as string[]).join(", "))}
            {activity.details?.involvedItems && (
              <>
                <h4 className="font-semibold mt-4 mb-2">Involved Items:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {(activity.details.involvedItems as InventoryItem[]).map((item, index) => (
                    <li key={index} className="text-sm">
                      {item.name} (S/N: {item.serialNumber || "N/A"}) - QTY: {item.quantity || 1} - Status: {item.status || "N/A"}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {activity.details?.auditLog && (activity.details.auditLog as { event: string; user: string; dateTime: string; description: string }[]).length > 0 && (
              <>
                <h4 className="font-semibold mt-4 mb-2">Audit Log:</h4>
                <div className="space-y-2">
                  {(activity.details.auditLog as { event: string; user: string; dateTime: string; description: string }[]).map((log, index) => (
                    <Card key={index} className="p-3">
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(log.dateTime)}
                      </p>
                      <p className="text-sm font-medium">
                        {log.event} by {log.user}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.description}</p>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )
      default:
        // Render all details dynamically for unknown types
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
            <dl className="space-y-2">
              {Object.entries(activity.details || {}).map(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                  return (
                    <div key={key} className="pt-2 border-t">
                      <dt className="text-sm font-medium text-muted-foreground mb-1">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                      </dt>
                      <dd className="text-sm">
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </dd>
                    </div>
                  )
                }
                return renderDetail(
                  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
                  String(value),
                )
              })}
            </dl>
          </>
        )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] md:w-[680px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Activity Detail
          </SheetTitle>
          <SheetDescription>Complete information about the recorded activity.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="mt-6 space-y-6 pb-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="h-5 w-5" />
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {renderDetail("Activity Type", <StatusBadge status={activity.type} />)}
                  {renderDetail("Description", activity.description)}
                  {renderDetail("Date and Time", formatDateTime(activity.date))}
                  {activity.requestedBy && renderDetail("Recorded by", (
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {activity.requestedBy}
                    </span>
                  ))}
                  {activity.status && renderDetail("Request Status", <StatusBadge status={activity.status} />)}
                </dl>
              </CardContent>
            </Card>

            {activity.details && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Specific Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">{renderActivityDetails()}</CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
