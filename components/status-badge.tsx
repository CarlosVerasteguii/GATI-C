import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { InventoryStatus, LoanStatus, AssignmentStatus, TaskStatus } from "@/types/inventory"

// Tipos de badge disponibles
type BadgeType = "inventory" | "loan" | "assignment" | "task" | "generic"

// Union type para todos los estados posibles
type Status = InventoryStatus | LoanStatus | AssignmentStatus | TaskStatus | 
  "success" | "error" | "warning" | "info" | "active"

interface StatusBadgeProps {
  type?: BadgeType
  status: Status
  className?: string
}

/**
 * A specialized component for displaying consistent business logic statuses.
 * It uses a centralized semantic color system for visual consistency.
 *
 * ARCHITECTURAL NOTE (Refactor 2025 30 julio ):
 * This component is intentionally separate from the generic `ui/badge.tsx`.
 * The generic badge is used for flexible UI elements (like counters in the
 * dashboard) that require custom sizing, while this component guarantees
 * a standard appearance for all business statuses.
 *
 * @param type - The business context (e.g., 'inventory', 'loan').
 * @param status - The specific status to display.
 */
export function StatusBadge({ type = "generic", status, className }: StatusBadgeProps) {
  const getStatusClass = (status: Status, type: BadgeType) => {
    // Lógica específica por tipo de badge
    switch (type) {
      case "inventory":
        return getInventoryStatusClass(status as InventoryStatus)
      case "loan":
        return getLoanStatusClass(status as LoanStatus)
      case "assignment":
        return getAssignmentStatusClass(status as AssignmentStatus)
      case "task":
        return getTaskStatusClass(status as TaskStatus)
      case "generic":
      default:
        return getGenericStatusClass(status)
    }
  }

  const getInventoryStatusClass = (status: InventoryStatus) => {
    switch (status) {
      case "Disponible":
        return "bg-status-available-bg text-status-available-text"
      case "Asignado":
        return "bg-status-assigned-bg text-status-assigned-text"
      case "Prestado":
        return "bg-status-lent-bg text-status-lent-text"
      case "PENDIENTE_DE_RETIRO":
        return "bg-status-pendingRetire-bg text-status-pendingRetire-text"
      case "Retirado":
        return "bg-status-retired-bg text-status-retired-text"
      default:
        return "bg-status-default-bg text-status-default-text"
    }
  }

  const getLoanStatusClass = (status: LoanStatus) => {
    switch (status) {
      case "Activo":
        return "bg-status-lent-bg text-status-lent-text"
      case "Devuelto":
        return "bg-status-available-bg text-status-available-text"
      case "Vencido":
        return "bg-status-retired-bg text-status-retired-text"
      default:
        return "bg-status-default-bg text-status-default-text"
    }
  }

  const getAssignmentStatusClass = (status: AssignmentStatus) => {
    switch (status) {
      case "Activo":
        return "bg-status-assigned-bg text-status-assigned-text"
      case "Devuelto":
        return "bg-status-available-bg text-status-available-text"
      default:
        return "bg-status-default-bg text-status-default-text"
    }
  }

  const getTaskStatusClass = (status: TaskStatus) => {
    switch (status) {
      case "Aprobado":
        return "bg-status-approved-bg text-status-approved-text"
      case "Rechazado":
        return "bg-status-rejected-bg text-status-rejected-text"
      case "Pendiente":
        return "bg-status-pending-bg text-status-pending-text"
      case "Carga Rápida":
      case "Retiro Rápido":
      case "Edición Masiva":
      case "Asignación Masiva":
      case "Préstamo Masivo":
      case "Retiro Masivo":
        return "bg-status-info-bg text-status-info-text"
      default:
        return "bg-status-default-bg text-status-default-text"
    }
  }

  const getGenericStatusClass = (status: Status) => {
    switch (status) {
      case "Disponible":
      case "success":
      case "Aprobado":
      case "Devuelto":
        return "bg-status-success-bg text-status-success-text"
      case "Asignado":
      case "Activo":
        return "bg-status-assigned-bg text-status-assigned-text"
      case "Prestado":
        return "bg-status-lent-bg text-status-lent-text"
      case "PENDIENTE_DE_RETIRO":
      case "warning":
      case "Pendiente":
        return "bg-status-warning-bg text-status-warning-text"
      case "Retirado":
      case "error":
      case "Rechazado":
      case "Vencido":
        return "bg-status-error-bg text-status-error-text"
      case "info":
      case "Carga Rápida":
      case "Retiro Rápido":
      case "Edición Masiva":
      case "Asignación Masiva":
      case "Préstamo Masivo":
      case "Retiro Masivo":
        return "bg-status-info-bg text-status-info-text"
      default:
        return "bg-status-default-bg text-status-default-text"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStatusClass(status, type),
        className
      )}
    >
      {status}
    </span>
  )
}

// Componentes de conveniencia para mantener compatibilidad
export function InventoryStatusBadge({ status, className }: { status: InventoryStatus; className?: string }) {
  return <StatusBadge type="inventory" status={status} className={className} />
}

export function LoanStatusBadge({ status, className }: { status: LoanStatus; className?: string }) {
  return <StatusBadge type="loan" status={status} className={className} />
}

export function AssignmentStatusBadge({ status, className }: { status: AssignmentStatus; className?: string }) {
  return <StatusBadge type="assignment" status={status} className={className} />
}

export function TaskStatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return <StatusBadge type="task" status={status} className={className} />
}
