import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status =
  | "Disponible"
  | "Asignado"
  | "Prestado"
  | "Retirado"
  | "PENDIENTE_DE_RETIRO"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "Carga Rápida"
  | "Retiro Rápido"
  | "Edición Masiva"
  | "Asignación Masiva"
  | "Préstamo Masivo"
  | "Retiro Masivo"
  | "Aprobado"
  | "Rechazado"
  | "Pendiente"


interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusClass = (status: Status) => {
    switch (status) {
      case "Disponible":
      case "success":
      case "Aprobado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Asignado":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Prestado":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "PENDIENTE_DE_RETIRO":
      case "warning":
      case "Pendiente":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "Retirado":
      case "error":
      case "Rechazado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "info":
      case "Carga Rápida":
      case "Retiro Rápido":
      case "Edición Masiva":
      case "Asignación Masiva":
      case "Préstamo Masivo":
      case "Retiro Masivo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStatusClass(status),
        className
      )}
    >
      {status}
    </span>
  )
}
