import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { InventoryStatus } from "@/types/inventory"

interface InventoryStatusBadgeProps {
    status: InventoryStatus
    className?: string
}

export function InventoryStatusBadge({ status, className }: InventoryStatusBadgeProps) {
    const getStatusClass = (status: InventoryStatus) => {
        switch (status) {
            case "Disponible":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "Asignado":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            case "Prestado":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            case "PENDIENTE_DE_RETIRO":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
            case "Retirado":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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