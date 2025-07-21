import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TaskStatus } from "@/types/inventory"

interface TaskStatusBadgeProps {
    status: TaskStatus
    className?: string
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
    const getStatusClass = (status: TaskStatus) => {
        switch (status) {
            case "Aprobado":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "Rechazado":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            case "Pendiente":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
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