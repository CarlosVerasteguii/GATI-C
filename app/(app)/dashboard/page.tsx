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
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from "@/components/status-badge"
import { ActivityDetailSheet } from "@/components/activity-detail-sheet"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ToastDemo } from "@/components/toast-demo"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Definición de tipos para los préstamos
interface PrestamoItem {
  id: number
  articuloId: number
  nombre: string
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

// NUEVO: Tipo extendido para préstamos con días calculados
import type { InventoryItem } from '@/types/inventory';

interface PrestamoExtendido extends InventoryItem {
  diasVencido?: number;
  diasRestantes?: number;
}

export default function DashboardPage() {
  const { state, updateLoanStatus, updateInventoryItemStatus, addRecentActivity, devolverPrestamo } = useApp()
  const { user } = useAuthStore()
  const { toast, showSuccess } = useToast();
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

  // Lógica de Tareas Pendientes (ya estaba correcta)
  const pendingTasks = state.tasks ? state.tasks.filter(task => task.status === 'Pendiente').length : 0;

  // --- Lógica para Préstamos Vencidos y Por Vencer (Optimizada) ---
  /**
   * Calcula los préstamos vencidos y por vencer para las métricas del Dashboard.
   * - prestamosVencidos: préstamos cuya fecha de devolución ya pasó.
   * - prestamosPorVencer: préstamos cuya fecha de devolución es en los próximos 7 días.
   * Añade la propiedad diasVencido o diasRestantes según corresponda.
   */
  const { prestamosVencidos, prestamosPorVencer } = React.useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche

    const unDiaEnMs = 24 * 60 * 60 * 1000;

    const prestamosActivos = state.inventoryData.filter(
      (item) => item.estado === 'Prestado' && item.fechaDevolucion
    );

    const vencidos = prestamosActivos
      .filter(p => new Date(p.fechaDevolucion!) < hoy)
      .map(p => {
        const fechaDevolucion = new Date(p.fechaDevolucion!);
        let diasVencido = Math.floor((hoy.getTime() - fechaDevolucion.getTime()) / unDiaEnMs);
        if (diasVencido < 0) diasVencido = 0;
        return { ...p, diasVencido };
      });

    const porVencer = prestamosActivos
      .filter(p => {
        const fechaDevolucion = new Date(p.fechaDevolucion!);
        const unaSemanaDesdeHoy = new Date(hoy.getTime() + 7 * unDiaEnMs);
        return fechaDevolucion >= hoy && fechaDevolucion <= unaSemanaDesdeHoy;
      })
      .map(p => {
        const fechaDevolucion = new Date(p.fechaDevolucion!);
        let diasRestantes = Math.ceil((fechaDevolucion.getTime() - hoy.getTime()) / unDiaEnMs);
        if (diasRestantes < 0) diasRestantes = 0;
        return { ...p, diasRestantes };
      });

    // Tipar explícitamente los arrays como PrestamoExtendido[]
    return { prestamosVencidos: vencidos as PrestamoExtendido[], prestamosPorVencer: porVencer as PrestamoExtendido[] };
  }, [state.inventoryData]);

  // --- Garantías próximas a vencer y vencidas ---
  const { garantiasPorVencer, garantiasVencidas } = React.useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diasAlerta = 30; // Rango configurable
    const unDiaEnMs = 24 * 60 * 60 * 1000;
    const productosConGarantia = state.inventoryData.filter(
      (item) => item.fechaVencimientoGarantia
    );
    const vencidas = productosConGarantia.filter(p => new Date(p.fechaVencimientoGarantia!) < hoy)
      .map(p => {
        const fechaVenc = new Date(p.fechaVencimientoGarantia!);
        let diasVencido = Math.floor((hoy.getTime() - fechaVenc.getTime()) / unDiaEnMs);
        if (diasVencido < 0) diasVencido = 0;
        return { ...p, diasVencido };
      });
    const porVencer = productosConGarantia.filter(p => {
      const fechaVenc = new Date(p.fechaVencimientoGarantia!);
      const limite = new Date(hoy.getTime() + diasAlerta * unDiaEnMs);
      return fechaVenc >= hoy && fechaVenc <= limite;
    }).map(p => {
      const fechaVenc = new Date(p.fechaVencimientoGarantia!);
      let diasRestantes = Math.ceil((fechaVenc.getTime() - hoy.getTime()) / unDiaEnMs);
      if (diasRestantes < 0) diasRestantes = 0;
      return { ...p, diasRestantes };
    });
    return { garantiasPorVencer: porVencer, garantiasVencidas: vencidas };
  }, [state.inventoryData]);

  // --- Inventario Bajo (usando umbrales configurables) ---
  const { getEffectiveLowStockThreshold } = useApp();
  const inventarioBajo = React.useMemo(() => {
    return state.inventoryData.filter(item => {
      if (typeof item.cantidad !== 'number' || item.estado !== 'Disponible') return false;
      const threshold = getEffectiveLowStockThreshold(item);
      return item.cantidad < threshold;
    });
  }, [state.inventoryData, getEffectiveLowStockThreshold]);

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

    // ⚠️ ELIMINADO: Productos que requieren atención - Tarjeta removida del dashboard
    // Código eliminado: const pendingRetirementItems = state.inventoryData.filter(item => item.estado === "PENDIENTE_DE_RETIRO");
    // NO REUTILIZAR: Esta funcionalidad fue eliminada intencionalmente. Si necesitas mostrar productos pendientes de retiro,
    // implementa una nueva solución desde cero, no copies código de versiones anteriores.

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
      totalItems: state.inventoryData.length,
      assignedItems: state.inventoryData.filter(item => item.estado === "Asignado").length,
      lentItems: state.inventoryData.filter(item => item.estado === "Prestado").length,
      // ⚠️ ELIMINADO: pendingRetirementItems - NO REUTILIZAR
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

  /**
   * Refactorización: Ahora la devolución de préstamo usa la función centralizada del contexto.
   * Esto asegura que la lógica de negocio esté unificada, se limpien los campos de préstamo en inventario,
   * se registre el evento en el historial y se mantenga la trazabilidad.
   * Además, se muestra una notificación de éxito y se cierra el modal.
   */
  const handleReturnLoan = () => {
    if (!selectedLoan) return;

    // Llama a la función centralizada del contexto
    devolverPrestamo(selectedLoan.id, user || null);

    // Muestra una notificación de éxito (usando showSuccess del sistema)
    showSuccess({
      title: 'Devolución Registrada',
      description: `El préstamo para "${selectedLoan.nombre}" ha sido registrado como devuelto.`,
    });

    // Cierra el modal
    setIsLoanDetailSheetOpen(false);
  };

  // ⚠️ ELIMINADO: Función handleViewInventoryDetails - Tarjeta "Productos que requieren atención" removida
  // Código eliminado: const handleViewInventoryDetails = (filter: string) => { ... }
  // NO REUTILIZAR: Esta función era específica para la tarjeta eliminada. Si necesitas navegación a inventario,
  // implementa una nueva función desde cero, no copies código de versiones anteriores.

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground mb-2">
        Resumen general del sistema de inventario
      </div>

      {/* Tarjetas principales (Total, Asignados, etc.) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/*
          NOTE on Dashboard Badges & Color Migration:
          This dashboard intentionally uses the generic `ui/badge` for its metric
          counters to allow for specific styling (e.g., larger text).

          MIGRATION STATUS (as of Refactor July 30 2025):
          This file contains a mix of new and legacy color classes.
          - ✅ COMPLETED: "Tareas Pendientes" card now uses the new semantic color system.
          - ⚠️ PENDING: Other cards (e.g., "Préstamos Vencidos") still use @deprecated
            legacy classes like `bg-status-retired`.
          - TODO: Migrate all remaining legacy coep eidlor classes in this file to the new
            semantic system (e.g., `bg-status-retired-bg text-status-retired-text`).
        */}
        <Card className="transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-muted-foreground" />
              <CardTitle className="text-lg font-semibold">Total Productos</CardTitle>
            </div>
            <Badge className="bg-cfe-green text-white text-base px-3 py-1" title="Total productos">{totalProducts}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{totalProducts}</div>
            <p className="text-base text-muted-foreground">
              {availableProducts} disponibles, {retiredProducts} retirados
            </p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-status-assigned" />
              <CardTitle className="text-lg font-semibold">Artículos Asignados</CardTitle>
            </div>
            <Badge className="bg-status-assigned text-white text-base px-3 py-1" title="Artículos asignados">{assignedProducts}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{assignedProducts}</div>
            <p className="text-base text-muted-foreground">Actualmente en uso</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-status-lent" />
              <CardTitle className="text-lg font-semibold">Artículos Prestados</CardTitle>
            </div>
            <Badge className="bg-status-lent text-white text-base px-3 py-1" title="Artículos prestados">{lentProducts}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{lentProducts}</div>
            <p className="text-base text-muted-foreground">En préstamo temporal</p>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-lg font-semibold">Tareas Pendientes</CardTitle>
            </div>
            <Badge className="bg-status-pending-bg text-status-pending-text text-base px-3 py-1" title="Tareas pendientes">{pendingTasks}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{pendingTasks}</div>
            <p className="text-base text-muted-foreground">Cargas y Retiros por procesar</p>
          </CardContent>
        </Card>
      </div>

      {/* Tarjetas de Alertas con Layout v5.0 */}
      {/* Fila de Préstamos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Préstamos Vencidos */}
        <Card className="cfe-border-left cfe-border-left-red transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-status-retired" />
              <CardTitle className="text-lg font-semibold">Préstamos Vencidos</CardTitle>
            </div>
            <Badge className="bg-status-retired text-white text-base px-3 py-1" title="Préstamos vencidos">{prestamosVencidos.length}</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Productos que han superado su fecha de devolución</p>
            {prestamosVencidos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay préstamos vencidos.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(prestamosVencidos as PrestamoExtendido[]).map((prestamo: PrestamoExtendido) => (
                  <div
                    key={prestamo.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => handleLoanClick(prestamo, "overdue")}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{prestamo.nombre}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Prestado a: {prestamo.prestadoA}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">N/S: {prestamo.numeroSerie || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-retired text-white text-base px-2 py-1" title="Días vencido">{prestamo.diasVencido} días</Badge>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Préstamos por Vencer */}
        <Card className="cfe-border-left cfe-border-left-yellow transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-status-lent" />
              <CardTitle className="text-lg font-semibold">Préstamos por Vencer</CardTitle>
            </div>
            <Badge className="bg-status-lent text-white text-base px-3 py-1" title="Préstamos por vencer">{prestamosPorVencer.length}</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Productos que vencen en los próximos 7 días</p>
            {prestamosPorVencer.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay préstamos por vencer.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(prestamosPorVencer as PrestamoExtendido[]).map((prestamo: PrestamoExtendido) => (
                  <div
                    key={prestamo.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => handleLoanClick(prestamo, "expiring")}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{prestamo.nombre}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Prestado a: {prestamo.prestadoA}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">N/S: {prestamo.numeroSerie || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-lent text-white text-base px-2 py-1" title="Días restantes">{prestamo.diasRestantes} días</Badge>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fila de Garantías */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* Garantías Vencidas */}
        <Card className="cfe-border-left cfe-border-left-red transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-status-retired" />
              <CardTitle className="text-lg font-semibold">Garantías Vencidas</CardTitle>
            </div>
            <Badge className="bg-status-retired text-white text-base px-3 py-1" title="Garantías vencidas">{garantiasVencidas.length}</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Productos cuya garantía ya expiró</p>
            {garantiasVencidas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay garantías vencidas.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {garantiasVencidas.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => router.push(`/inventario?producto=${item.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{item.nombre}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">N/S: {item.numeroSerie || "N/A"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Venció: {formatDate(item.fechaVencimientoGarantia || "")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-retired text-white text-base px-2 py-1" title="Días vencido">{item.diasVencido} días</Badge>
                    </div>
                  </div>
                ))}
                {garantiasVencidas.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2">Ver más</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Garantías por Vencer */}
        <Card className="cfe-border-left cfe-border-left-yellow transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-status-lent" />
              <CardTitle className="text-lg font-semibold">Garantías por Vencer</CardTitle>
            </div>
            <Badge className="bg-status-lent text-white text-base px-3 py-1" title="Garantías por vencer">{garantiasPorVencer.length}</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Productos cuya garantía vence en los próximos 30 días</p>
            {garantiasPorVencer.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay garantías próximas a vencer.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {garantiasPorVencer.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => router.push(`/inventario?producto=${item.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{item.nombre}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">N/S: {item.numeroSerie || "N/A"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Vence: {formatDate(item.fechaVencimientoGarantia || "")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-lent text-white text-base px-2 py-1" title="Días restantes">{item.diasRestantes} días</Badge>
                    </div>
                  </div>
                ))}
                {garantiasPorVencer.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2">Ver más</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inventario Bajo (tarjeta alargada) */}
      <div className="mt-6">
        <Card className="cfe-border-left cfe-border-left-orange w-full transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-status-warning" />
              <CardTitle className="text-lg font-semibold">Inventario Bajo</CardTitle>
            </div>
            <Badge className="bg-status-warning text-white text-base px-3 py-1" title={`Umbral: ${getEffectiveLowStockThreshold(inventarioBajo[0])}`}>Bajo</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Productos con stock menor a 3 unidades (mock, ver TODO)</p>
            {inventarioBajo.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay productos con inventario bajo.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {inventarioBajo.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => router.push(`/inventario?producto=${item.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base">{item.nombre}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">N/S: {item.numeroSerie || "N/A"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-status-warning text-white text-base px-2 py-1" title="Inventario bajo">Bajo</Badge>
                    </div>
                  </div>
                ))}
                {inventarioBajo.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2">Ver más</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reemplazamos la tarjeta de distribución por tarjetas de métricas más útiles */}
      <div className="grid gap-6">
        {/* Tarjeta: Distribución por categoría */}
        <Card className="cfe-border-left cfe-border-left-green transition-shadow hover:shadow-lg p-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <CardTitle className="text-lg font-semibold">Top Categorías</CardTitle>
            </div>
            <Badge className="bg-cfe-green text-white text-base px-3 py-1" title="Top categorías">{inventoryMetrics.topCategories.length}</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">Las categorías con mayor número de productos</p>
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
      <Card className="transition-shadow hover:shadow-lg p-6">
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
                Basado en {state.inventoryData.filter(item => typeof item.costo === 'number').length} productos con costo registrado
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
      <Card className="transition-shadow hover:shadow-lg p-6">
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
              {selectedLoan ? `Detalles del préstamo para: ${selectedLoan.nombre}` : ''}
            </SheetDescription>
          </SheetHeader>
          {selectedLoan && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Producto</h4>
                    <p>{selectedLoan.nombre}</p>
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
                  <StatusBadge type="loan" status={selectedLoan.estado} />
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
