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
import { StatusBadge } from "@/components/status-badge"
import { ActivityDetailSheet } from "@/components/activity-detail-sheet"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ToastDemo } from "@/components/toast-demo"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Definición de tipos para los préstamos
interface PrestamoItem {
  id: number
  articuloId: number
  articulo: string
  numeroSerie: string | null
  prestadoA: string
  fechaPrestamo: string
  fechaDevolucion: string
  estado: "Activo" | "Devuelto" | "Vencido"
  diasRestantes: number
  notas?: string
  registradoPor?: string
}

interface PrestamoItemExtended extends PrestamoItem {
  diasVencido?: number
}

export default function DashboardPage() {
  const { state, updateLoanStatus, updateInventoryItemStatus, addRecentActivity } = useApp()
  const [selectedLoan, setSelectedLoan] = useState<PrestamoItemExtended | null>(null)
  const [isLoanDetailSheetOpen, setIsLoanDetailSheetOpen] = useState(false)
  const [isActivityDetailSheetOpen, setIsActivityDetailSheetOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [loanSheetType, setLoanSheetType] = useState<"overdue" | "expiring">("overdue")
  const router = useRouter()
  const [showToastDemo, setShowToastDemo] = useState(false)

  const totalProducts = state.inventoryData.length
  const availableProducts = state.inventoryData.filter((item) => item.estado === "Disponible").length

  // Derivar todas las métricas del inventario principal
  const assignedProducts = state.inventoryData.filter(item => item.estado === 'Asignado').length;
  const lentProducts = state.inventoryData.filter(item => item.estado === 'Prestado').length;
  const retiredProducts = state.inventoryData.filter(item => item.estado === 'Retirado').length;
  const maintenanceProducts = state.inventoryData.filter(item => item.estado === 'En Mantenimiento').length;

  // Lógica de Tareas Pendientes (ya estaba correcta)
  const pendingTasks = state.tasks ? state.tasks.filter(task => task.status === 'Pendiente').length : 0;

  // --- Lógica para Préstamos Vencidos y Por Vencer (Placeholder) ---
  // NOTA: La estructura de `InventoryItem` no tiene `diasRestantes` o estado de préstamo "Vencido".
  // Dejaremos esto como un placeholder para una futura implementación.
  const prestamosVencidos: PrestamoItemExtended[] = [];
  const prestamosPorVencer: PrestamoItemExtended[] = [];

  const handleLoanClick = (loan: any, type: "overdue" | "expiring") => {
    setSelectedLoan(loan)
    setLoanSheetType(type)
    setIsLoanDetailSheetOpen(true)
  }

  const handleViewActivityDetails = (activity: any) => {
    setSelectedActivity(activity)
    setIsActivityDetailSheetOpen(true)
  }

  // Reemplazamos el gráfico de distribución con métricas más útiles para la toma de decisiones
  const inventoryMetrics = useMemo(() => {
    // Calcular métricas de valor y actividad en lugar de solo distribución
    const totalValue = state.inventoryData.reduce((sum, item) => sum + (item.costo || 0), 0);

    // Productos que requieren atención
    const maintenanceItems = state.inventoryData.filter(item => item.estado === "En Mantenimiento");
    const pendingRetirementItems = state.inventoryData.filter(item => item.estado === "PENDIENTE_DE_RETIRO");

    // Productos por categoría (top 5)
    const categoryCounts = state.inventoryData.reduce((acc, item) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Productos por marca (top 5)
    const brandCounts = state.inventoryData.reduce((acc, item) => {
      acc[item.marca] = (acc[item.marca] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Productos que necesitan renovación (basado en vida útil, si está disponible)
    const needsRenewal = state.inventoryData.filter(item => {
      if (!item.vidaUtil) return false;
      try {
        // Asumiendo que vidaUtil es una fecha límite en formato ISO
        const expiryDate = new Date(item.vidaUtil);
        const today = new Date();
        const monthsRemaining = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
        return monthsRemaining <= 3 && item.estado !== "Retirado"; // Productos con 3 meses o menos de vida útil
      } catch (e) {
        return false;
      }
    });

    return {
      totalValue,
      maintenanceItems,
      pendingRetirementItems,
      topCategories,
      topBrands,
      needsRenewal,
      // Mantener los conteos básicos para referencia
      counts: {
        disponibles: availableProducts,
        asignados: assignedProducts,
        prestados: lentProducts,
        retirados: retiredProducts,
        total: totalProducts
      }
    };
  }, [state.inventoryData, availableProducts, assignedProducts, lentProducts, retiredProducts, totalProducts]);

  // Función para formatear fechas con manejo de errores
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) return "Fecha inválida";
      return date.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "Fecha inválida";
    }
  };

  // Función para formatear fechas con hora con manejo de errores
  const formatDateTime = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) return "Fecha inválida";
      return date.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      console.error("Error al formatear fecha y hora:", error);
      return "Fecha inválida";
    }
  };

  // Función para manejar la devolución de un préstamo
  const handleReturnLoan = () => {
    if (!selectedLoan) return;

    // Actualizar el estado del préstamo a "Devuelto"
    updateLoanStatus(selectedLoan.id, "Devuelto");

    // Actualizar el estado del artículo a "Disponible"
    updateInventoryItemStatus(selectedLoan.articuloId, "Disponible");

    // Registrar la actividad de devolución
    const newActivity = {
      type: "Devolución",
      description: `${selectedLoan.articulo} devuelto por ${selectedLoan.prestadoA}`,
      date: new Date().toISOString(),
      requestedBy: state.user?.nombre || "Usuario del sistema",
      details: {
        returnedBy: selectedLoan.prestadoA,
        returnDate: new Date().toISOString(),
        receivedBy: state.user?.nombre,
        condition: "Bueno",
        items: [
          {
            name: selectedLoan.articulo,
            serial: selectedLoan.numeroSerie,
            quantity: 1,
            estado: "Devuelto"
          }
        ]
      }
    };

    // Añadir la actividad reciente
    addRecentActivity(newActivity);

    // Cerrar el modal
    setIsLoanDetailSheetOpen(false);

    // Mostrar mensaje de éxito (si tienes un sistema de toast)
    // toast.success("Préstamo registrado como devuelto correctamente");
  };

  // Función para navegar a inventario con filtros específicos
  const handleViewInventoryDetails = (filter: string) => {
    if (filter === 'maintenance') {
      router.push('/inventario?estado=En Mantenimiento');
    } else if (filter === 'pending-retirement') {
      router.push('/inventario?estado=PENDIENTE_DE_RETIRO');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground mb-2">
        Resumen general del sistema de inventario
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {availableProducts} disponibles, {retiredProducts} retirados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artículos Asignados</CardTitle>
            <UserCheck className="h-4 w-4 text-status-assigned" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedProducts}</div>
            <p className="text-xs text-muted-foreground">Actualmente en uso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artículos Prestados</CardTitle>
            <FileText className="h-4 w-4 text-status-lent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lentProducts}</div>
            <p className="text-xs text-muted-foreground">En préstamo temporal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-status-maintenance" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Cargas y Retiros por procesar</p>
          </CardContent>
        </Card>
      </div>

      {/* Tarjetas de Alertas con Layout v5.0 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Préstamos Vencidos */}
        <Card className="cfe-border-left cfe-border-left-red">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-status-retired">
              <AlertTriangle className="h-5 w-5 text-status-retired" />
              Préstamos Vencidos ({prestamosVencidos.length})
            </CardTitle>
            <CardDescription>Productos que han superado su fecha de devolución</CardDescription>
          </CardHeader>
          <CardContent>
            {prestamosVencidos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay préstamos vencidos.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {prestamosVencidos.map((prestamo) => (
                  <div
                    key={prestamo.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => handleLoanClick(prestamo, "overdue")}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{prestamo.articulo}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Prestado a: {prestamo.prestadoA}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">N/S: {prestamo.numeroSerie || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-retired text-white">
                        {prestamo.diasVencido} días
                      </Badge>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Préstamos por Vencer */}
        <Card className="cfe-border-left cfe-border-left-yellow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-status-lent">
              <Calendar className="h-5 w-5 text-status-lent" />
              Préstamos por Vencer ({prestamosPorVencer.length})
            </CardTitle>
            <CardDescription>Productos que vencen en los próximos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            {prestamosPorVencer.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay préstamos por vencer.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {prestamosPorVencer.map((prestamo) => (
                  <div
                    key={prestamo.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => handleLoanClick(prestamo, "expiring")}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{prestamo.articulo}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Prestado a: {prestamo.prestadoA}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">N/S: {prestamo.numeroSerie || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-lent text-white">
                        {prestamo.diasRestantes} días
                      </Badge>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reemplazamos la tarjeta de distribución por tarjetas de métricas más útiles */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tarjeta: Productos que requieren atención */}
        <Card className="cfe-border-left cfe-border-left-blue">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-status-maintenance">
              <FileText className="h-5 w-5" />
              Productos que requieren atención
            </CardTitle>
            <CardDescription>Artículos en mantenimiento o pendientes de retiro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">En mantenimiento</p>
                  <p className="text-sm text-muted-foreground">
                    {inventoryMetrics.maintenanceItems.length} productos
                  </p>
                </div>
                <div className="text-2xl font-bold text-status-maintenance">
                  {inventoryMetrics.maintenanceItems.length > 0
                    ? ((inventoryMetrics.maintenanceItems.length / totalProducts) * 100).toFixed(1) + '%'
                    : '0%'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Pendientes de retiro</p>
                  <p className="text-sm text-muted-foreground">
                    {inventoryMetrics.pendingRetirementItems.length} productos
                  </p>
                </div>
                <div className="text-2xl font-bold text-status-pending">
                  {inventoryMetrics.pendingRetirementItems.length > 0
                    ? ((inventoryMetrics.pendingRetirementItems.length / totalProducts) * 100).toFixed(1) + '%'
                    : '0%'}
                </div>
              </div>
              {inventoryMetrics.maintenanceItems.length > 0 || inventoryMetrics.pendingRetirementItems.length > 0 ? (
                <div className="space-y-2">
                  {inventoryMetrics.maintenanceItems.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleViewInventoryDetails('maintenance')}
                    >
                      Ver artículos en mantenimiento
                    </Button>
                  )}
                  {inventoryMetrics.pendingRetirementItems.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleViewInventoryDetails('pending-retirement')}
                    >
                      Ver artículos pendientes de retiro
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center italic">No hay productos que requieran atención</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta: Distribución por categoría */}
        <Card className="cfe-border-left cfe-border-left-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cfe-green">
              <Package className="h-5 w-5" />
              Top Categorías
            </CardTitle>
            <CardDescription>Las categorías con mayor número de productos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryMetrics.topCategories.length > 0 ? (
                inventoryMetrics.topCategories.map(([category, count], index) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{category}</p>
                      <p className="text-sm text-muted-foreground">{count} productos</p>
                    </div>
                    <div className="text-lg font-semibold">
                      {((count / totalProducts) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center italic">No hay datos de categorías</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tarjeta: Métricas adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Métricas de Inventario</CardTitle>
          <CardDescription>Información clave para la toma de decisiones</CardDescription>
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
                Basado en {state.inventoryData.filter(item => item.costo).length} productos con costo registrado
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
              <h3 className="text-sm font-medium">Productos por renovar</h3>
              <div className="text-2xl font-bold text-status-lent">
                {inventoryMetrics.needsRenewal.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Productos con menos de 3 meses de vida útil restante
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Últimas operaciones realizadas en el sistema</CardDescription>
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

      {/* Modal para detalle de préstamos */}
      {/* Esto es un placeholder para mostrar cómo se vería, deberías crear los componentes reales */}
      <Sheet open={isLoanDetailSheetOpen} onOpenChange={setIsLoanDetailSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {loanSheetType === "overdue" ? "Préstamo Vencido" : "Préstamo por Vencer"}
            </SheetTitle>
            <SheetDescription>
              {selectedLoan ? `Detalles del préstamo para: ${selectedLoan.articulo}` : ''}
            </SheetDescription>
          </SheetHeader>
          {selectedLoan && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Producto</h4>
                    <p>{selectedLoan.articulo}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">N/S</h4>
                    <p>{selectedLoan.numeroSerie || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Prestado a</h4>
                  <p>{selectedLoan.prestadoA}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Fecha Préstamo</h4>
                    <p>
                      {formatDate(selectedLoan.fechaPrestamo)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Fecha Devolución</h4>
                    <p>
                      {formatDate(selectedLoan.fechaDevolucion)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Estado</h4>
                  <StatusBadge status={selectedLoan.estado} />
                </div>
                {selectedLoan.notas && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Notas</h4>
                    <p className="text-sm">{selectedLoan.notas}</p>
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
                  Registrar Devolución
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
