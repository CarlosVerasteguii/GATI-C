"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  AlertTriangle,
  TrendingUp,
  Calendar,
  ExternalLink,
  Package,
  UserCheck,
  FileText,
  Clock,
  Eye,
} from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { useToast } from '@/hooks/use-toast'
import { StatusBadge } from "@/components/status-badge"
import { ActivityDetailSheet } from "@/components/activity-detail-sheet"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ToastDemo } from "@/components/toast-demo"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React from "react"
import type { InventoryItem, InventoryStatus } from "@/types/inventory"

// Extended loan type with calculated days
interface ExtendedLoanItem extends InventoryItem {
  daysOverdue?: number
  daysRemaining?: number
  notes?: string
}

interface RecentActivity {
  type: string
  description: string
  date: string
  details?: Record<string, unknown>
  requestedBy?: string
  status?: string
}

export default function DashboardPage() {
  const { state, updateLoanStatus, updateInventoryItemStatus, addRecentActivity, returnLoan } = useApp()
  const { user } = useAuthStore()
  const { toast, showSuccess } = useToast()
  const [selectedLoan, setSelectedLoan] = useState<ExtendedLoanItem | null>(null)
  const [isLoanDetailSheetOpen, setIsLoanDetailSheetOpen] = useState(false)
  const [isActivityDetailSheetOpen, setIsActivityDetailSheetOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<RecentActivity | null>(null)
  const [loanSheetType, setLoanSheetType] = useState<"overdue" | "expiring">("overdue")
  const router = useRouter()
  const [showToastDemo, setShowToastDemo] = useState(false)

  const totalProducts = state.inventoryData.length
  const availableProducts = state.inventoryData.filter((item) => item.status === "AVAILABLE").length

  // Derive all metrics from main inventory data
  const assignedProducts = state.inventoryData.filter(item => item.status === "ASSIGNED").length
  const lentProducts = state.inventoryData.filter(item => item.status === "LENT").length
  const retiredProducts = state.inventoryData.filter(item => item.status === "RETIRED").length

  // Pending tasks logic
  const pendingTasks = state.tasks ? state.tasks.filter(task => task.status === "PENDING").length : 0

  // --- Overdue and expiring loans ---
  /**
   * Calculates overdue and expiring loans for dashboard metrics.
   * - overdueLoans: loans whose return date has already passed.
   * - expiringLoans: loans whose return date is within the next 7 days.
   * Adds the daysOverdue or daysRemaining property accordingly.
   */
  const { overdueLoans, expiringLoans } = React.useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const oneDayMs = 24 * 60 * 60 * 1000

    const activeLoans = state.inventoryData.filter(
      (item) => item.status === "LENT" && item.returnDate
    )

    const overdue = activeLoans
      .filter(p => new Date(p.returnDate!) < today)
      .map(p => {
        const returnDate = new Date(p.returnDate!)
        let daysOverdue = Math.floor((today.getTime() - returnDate.getTime()) / oneDayMs)
        if (daysOverdue < 0) daysOverdue = 0
        return { ...p, daysOverdue }
      })

    const expiring = activeLoans
      .filter(p => {
        const returnDate = new Date(p.returnDate!)
        const weekFromToday = new Date(today.getTime() + 7 * oneDayMs)
        return returnDate >= today && returnDate <= weekFromToday
      })
      .map(p => {
        const returnDate = new Date(p.returnDate!)
        let daysRemaining = Math.ceil((returnDate.getTime() - today.getTime()) / oneDayMs)
        if (daysRemaining < 0) daysRemaining = 0
        return { ...p, daysRemaining }
      })

    return { overdueLoans: overdue as ExtendedLoanItem[], expiringLoans: expiring as ExtendedLoanItem[] }
  }, [state.inventoryData])

  // --- Expiring and expired warranties ---
  const { expiringWarranties, expiredWarranties } = React.useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const alertDays = 30
    const oneDayMs = 24 * 60 * 60 * 1000
    const itemsWithWarranty = state.inventoryData.filter(
      (item) => item.warrantyExpirationDate
    )
    const expired = itemsWithWarranty.filter(p => new Date(p.warrantyExpirationDate!) < today)
      .map(p => {
        const expDate = new Date(p.warrantyExpirationDate!)
        let daysOverdue = Math.floor((today.getTime() - expDate.getTime()) / oneDayMs)
        if (daysOverdue < 0) daysOverdue = 0
        return { ...p, daysOverdue }
      })
    const expiring = itemsWithWarranty.filter(p => {
      const expDate = new Date(p.warrantyExpirationDate!)
      const limit = new Date(today.getTime() + alertDays * oneDayMs)
      return expDate >= today && expDate <= limit
    }).map(p => {
      const expDate = new Date(p.warrantyExpirationDate!)
      let daysRemaining = Math.ceil((expDate.getTime() - today.getTime()) / oneDayMs)
      if (daysRemaining < 0) daysRemaining = 0
      return { ...p, daysRemaining }
    })
    return { expiringWarranties: expiring, expiredWarranties: expired }
  }, [state.inventoryData])

  // --- Inventario Bajo (usando umbrales configurables) ---
  const { getEffectiveLowStockThreshold } = useApp();
  const lowInventory = React.useMemo(() => {
    return state.inventoryData.filter(item => {
      if (typeof item.quantity !== "number" || item.status !== "AVAILABLE") return false
      const threshold = getEffectiveLowStockThreshold(item)
      return item.quantity < threshold
    })
  }, [state.inventoryData, getEffectiveLowStockThreshold])

  const handleLoanClick = (loan: ExtendedLoanItem, type: "overdue" | "expiring") => {
    setSelectedLoan(loan)
    setLoanSheetType(type)
    setIsLoanDetailSheetOpen(true)
  }

  const handleViewActivityDetails = (activity: RecentActivity) => {
    setSelectedActivity(activity)
    setIsActivityDetailSheetOpen(true)
  }

  // Replace distribution chart with more useful decision metrics
  const inventoryMetrics = useMemo(() => {
    // Calculate value and activity metrics instead of only distribution
    const totalValue = state.inventoryData.reduce((sum, item) => sum + (item.cost || 0), 0);

    // ⚠️ REMOVED: Items requiring attention - card removed from dashboard
    // Removed code: const pendingRetirementItems = state.inventoryData.filter(item => item.estado === "PENDIENTE_DE_RETIRO");
    // DO NOT REUSE: This functionality was intentionally removed. If you need to show items pending retirement,
    // implement a new solution from scratch; do not copy code from previous versions.

    // Products by category (top 5)
    const categoryCounts = state.inventoryData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Products by brand (top 5)
    const brandCounts = state.inventoryData.reduce((acc, item) => {
      acc[item.brand] = (acc[item.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Products needing renewal (based on useful life, if available)
    const needsRenewal = state.inventoryData.filter(item => {
      if (!item.usefulLife) return false;
      try {
        // Assuming usefulLife is a deadline in ISO format
        const expiryDate = new Date(item.usefulLife);
        const today = new Date();
        const monthsRemaining = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
        return monthsRemaining <= 3 && item.status !== "RETIRED"; // Items with 3 months or less of useful life
      } catch (e) {
        return false;
      }
    });

    return {
      totalValue,
      totalItems: state.inventoryData.length,
      assignedItems: state.inventoryData.filter(item => item.status === "ASSIGNED").length,
      lentItems: state.inventoryData.filter(item => item.status === "LENT").length,
      // ⚠️ REMOVED: pendingRetirementItems - DO NOT REUSE
      topCategories,
      topBrands,
      needsRenewal,
      // Keep basic counts for reference
      counts: {
        disponibles: availableProducts,
        asignados: assignedProducts,
        prestados: lentProducts,
        retirados: retiredProducts,
        total: totalProducts
      }
    };
  }, [state.inventoryData, availableProducts, assignedProducts, lentProducts, retiredProducts, totalProducts]);

  // Helper to format dates with error handling
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A"
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid date"
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  // Helper to format dates with time and error handling
  const formatDateTime = (dateString: string) => {
    try {
      if (!dateString) return "N/A"
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid date"
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date and time:", error)
      return "Invalid date"
    }
  }

  /**
   * The loan return now uses the centralized context function.
   * This keeps business logic unified, clears loan fields in inventory,
   * logs the event in history, and maintains traceability.
   * It also shows a success notification and closes the modal.
   */
  const handleReturnLoan = () => {
    if (!selectedLoan) return

    // Call the centralized context function
    returnLoan(selectedLoan.id, user || null)

    // Show a success notification
    showSuccess({
      title: "Return Registered",
      description: `The loan for "${selectedLoan.name}" has been marked as returned.`,
    })

    // Close the modal
    setIsLoanDetailSheetOpen(false)
  }

  // ⚠️ REMOVED: handleViewInventoryDetails - "Items Requiring Attention" card deleted
  // Removed code: const handleViewInventoryDetails = (filter: string) => { ... }
  // DO NOT REUSE: This function was specific to the removed card. If you need inventory navigation,
  // implement a new function from scratch; do not copy code from previous versions.

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground mb-2">
        General overview of the inventory system
      </div>

      {/* Main cards (Total, Assigned, etc.) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/*
          NOTE on Dashboard Badges & Color Migration:
          This dashboard intentionally uses the generic `ui/badge` for its metric
          counters to allow for specific styling (e.g., larger text).

          MIGRATION STATUS (as of Refactor July 30 2025):
          This file contains a mix of new and legacy color classes.
          - ✅ COMPLETED: "Tareas Pendientes" card now uses the new semantic color system.
          - ⚠️ PENDING: Other cards (e.g., "Overdue Loans") still use @deprecated
            legacy classes like `bg-status-retired`.
          - TODO: Migrate all remaining legacy coep eidlor classes in this file to the new
            semantic system (e.g., `bg-status-retired-bg text-status-retired-text`).
        */}
        <Card className="transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-muted-foreground" />
              <CardTitle className="text-lg font-semibold">Total Products</CardTitle>
            </div>
            <Badge className="bg-cfe-green text-white text-base px-3 py-1" title="Total products">{totalProducts}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{totalProducts}</div>
            <p className="text-base text-muted-foreground">
              {availableProducts} available, {retiredProducts} retired
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-status-assigned" />
              <CardTitle className="text-lg font-semibold">Assigned Items</CardTitle>
            </div>
            <Badge className="bg-status-assigned text-white text-base px-3 py-1" title="Assigned items">{assignedProducts}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{assignedProducts}</div>
            <p className="text-base text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-status-lent" />
              <CardTitle className="text-lg font-semibold">Loaned Items</CardTitle>
            </div>
            <Badge className="bg-status-lent text-white text-base px-3 py-1" title="Loaned items">{lentProducts}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{lentProducts}</div>
            <p className="text-base text-muted-foreground">On temporary loan</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-lg font-semibold">Pending Tasks</CardTitle>
            </div>
            <Badge className="bg-status-pending-bg text-status-pending-text text-base px-3 py-1" title="Pending tasks">{pendingTasks}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{pendingTasks}</div>
            <p className="text-base text-muted-foreground">Loads and retirements to process</p>
          </CardContent>
        </Card>
      </div>

      {/* Tarjetas de Alertas con Layout v5.0 */}
      {/* Loans row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Overdue Loans */}
        <Card className="cfe-border-left cfe-border-left-red transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-status-retired" />
              <CardTitle className="text-lg font-semibold">Overdue Loans</CardTitle>
            </div>
            <Badge className="bg-status-retired text-white text-base px-3 py-1" title="Overdue loans">{overdueLoans.length}</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Items past their return date</p>
            {overdueLoans.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overdue loans.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(overdueLoans as ExtendedLoanItem[]).map((loan: ExtendedLoanItem) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => handleLoanClick(loan, "overdue")}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{loan.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Loaned to: {loan.lentTo}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">S/N: {loan.serialNumber || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-retired text-white text-base px-2 py-1" title="Days overdue">{loan.daysOverdue} days</Badge>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loans About to Expire */}
        <Card className="cfe-border-left cfe-border-left-yellow transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-status-lent" />
              <CardTitle className="text-lg font-semibold">Loans About to Expire</CardTitle>
            </div>
            <Badge className="bg-status-lent text-white text-base px-3 py-1" title="Loans about to expire">{expiringLoans.length}</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Items due within the next 7 days</p>
            {expiringLoans.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expiring loans.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(expiringLoans as ExtendedLoanItem[]).map((loan: ExtendedLoanItem) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => handleLoanClick(loan, "expiring")}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{loan.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Loaned to: {loan.lentTo}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">S/N: {loan.serialNumber || "N/A"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Days remaining: {loan.daysRemaining}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-lent text-white text-base px-2 py-1" title="Days remaining">{loan.daysRemaining} days</Badge>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Warranties row */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* Expired Warranties */}
        <Card className="cfe-border-left cfe-border-left-red transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-status-retired" />
              <CardTitle className="text-lg font-semibold">Expired Warranties</CardTitle>
            </div>
            <Badge className="bg-status-retired text-white text-base px-3 py-1" title="Expired warranties">{expiredWarranties.length}</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Items whose warranty has expired</p>
            {expiredWarranties.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expired warranties.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {expiredWarranties.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => router.push(`/inventario?producto=${item.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{item.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">S/N: {item.serialNumber || "N/A"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Expired: {formatDate(item.warrantyExpirationDate || "")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-retired text-white text-base px-2 py-1" title="Days overdue">{item.daysOverdue} days</Badge>
                    </div>
                  </div>
                ))}
                {expiredWarranties.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2">View more</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Warranties Expiring Soon */}
        <Card className="cfe-border-left cfe-border-left-yellow transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-status-lent" />
              <CardTitle className="text-lg font-semibold">Warranties Expiring Soon</CardTitle>
            </div>
            <Badge className="bg-status-lent text-white text-base px-3 py-1" title="Warranties expiring soon">{expiringWarranties.length}</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Items with warranties ending in the next 30 days</p>
            {expiringWarranties.length === 0 ? (
              <p className="text-sm text-muted-foreground">No warranties expiring soon.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {expiringWarranties.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => router.push(`/inventario?producto=${item.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{item.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">S/N: {item.serialNumber || "N/A"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Due: {formatDate(item.warrantyExpirationDate || "")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-lent text-white text-base px-2 py-1" title="Days remaining">{item.daysRemaining} days</Badge>
                    </div>
                  </div>
                ))}
                {expiringWarranties.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2">View more</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Inventory (extended card) */}
      <div className="mt-6">
        <Card className="cfe-border-left cfe-border-left-orange w-full transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-status-warning" />
              <CardTitle className="text-lg font-semibold">Low Inventory</CardTitle>
            </div>
            <Badge className="bg-status-warning text-white text-base px-3 py-1" title={`Threshold: ${getEffectiveLowStockThreshold(lowInventory[0])}`}>Low</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Products with fewer than 3 units in stock (mock, see TODO)</p>
            {lowInventory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products with low inventory.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lowInventory.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => router.push(`/inventario?producto=${item.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{item.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">S/N: {item.serialNumber || "N/A"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-warning text-white text-base px-2 py-1" title="Low inventory">Low</Badge>
                    </div>
                  </div>
                ))}
                {lowInventory.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2">View more</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Replace distribution card with more useful metric cards */}
      <div className="grid gap-6">
        {/* Card: Distribution by category */}
        <Card className="cfe-border-left cfe-border-left-green transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <CardTitle className="text-lg font-semibold">Top Categories</CardTitle>
            </div>
            <Badge className="bg-cfe-green text-white text-base px-3 py-1" title="Top categories">{inventoryMetrics.topCategories.length}</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Categories with the highest number of products</p>
            <div className="space-y-4">
              {inventoryMetrics.topCategories.length > 0 ? (
                inventoryMetrics.topCategories.map(([category, count], index) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{category}</p>
                      <p className="text-sm text-muted-foreground">{count} products</p>
                    </div>
                    <div className="text-lg font-semibold">
                      {((count / totalProducts) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center italic">No category data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional metrics card */}
      <Card className="transition-shadow hover:shadow-lg p-6">
        <CardHeader>
          <CardTitle className="text-lg">Inventory Metrics</CardTitle>
          <CardDescription>Key information for decision-making</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Valor total del inventario */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Valor total del inventario</h3>
              <div className="text-2xl font-bold">
                ${inventoryMetrics.totalValue.toLocaleString('es-MX')}
              </div>
              <p className="text-xs text-muted-foreground">
                Basado en {state.inventoryData.filter(item => typeof item.cost === 'number').length} productos con costo registrado
              </p>
            </div>

            {/* Top marcas */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Top 3 Marcas</h3>
              <div className="space-y-1">
                {inventoryMetrics.topBrands.slice(0, 3).map(([brand, count], index) => (
                  <div key={brand} className="flex items-center justify-between">
                    <span className="text-sm">{brand}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Productos por renovar */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Items to renew</h3>
              <div className="text-2xl font-bold text-status-lent">
                {inventoryMetrics.needsRenewal.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Items with less than 3 months of useful life remaining
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card className="transition-shadow hover:shadow-lg p-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Latest operations performed in the system</CardDescription>
            </div>
            <Dialog open={showToastDemo} onOpenChange={setShowToastDemo}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  🎨 Demo Toast
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>🎨 Sistema de Toast Mejorado</DialogTitle>
                </DialogHeader>
                <ToastDemo />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {state.recentActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay actividad reciente.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {state.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                  onClick={() => handleViewActivityDetails(activity)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDateTime(activity.date)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="flex gap-1 items-center">
                    <ExternalLink className="h-3 w-3" />
                    <span>Ver</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loan detail modal */}
      {/* This is a placeholder to illustrate the structure; create real components */}
      <Sheet open={isLoanDetailSheetOpen} onOpenChange={setIsLoanDetailSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {loanSheetType === "overdue" ? "Overdue Loan" : "Expiring Loan"}
            </SheetTitle>
            <SheetDescription>
              {selectedLoan ? `Loan details for: ${selectedLoan.name}` : ''}
            </SheetDescription>
          </SheetHeader>
          {selectedLoan && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Producto</h4>
                    <p>{selectedLoan.name}</p>
                  </div>
                  <div>
                  <h4 className="text-sm font-medium text-muted-foreground">S/N</h4>
                    <p>{selectedLoan.serialNumber || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Loaned to</h4>
                  <p>{selectedLoan.lentTo}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Loan Date</h4>
                    <p>
                      {formatDate(selectedLoan.loanDate || "")}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Return Date</h4>
                    <p>
                      {formatDate(selectedLoan.returnDate || "")}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <StatusBadge type="loan" status={selectedLoan.status as InventoryStatus} />
                </div>
                {selectedLoan.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                    <p className="text-sm">{selectedLoan.notes}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsLoanDetailSheetOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  onClick={handleReturnLoan}
                  className="bg-cfe-green hover:bg-cfe-green/90"
                >
                  Register Return
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Modal para detalle de actividad */}
      <ActivityDetailSheet
        open={isActivityDetailSheetOpen}
        onOpenChange={setIsActivityDetailSheetOpen}
        activity={selectedActivity}
      />
    </div>
  )
}
