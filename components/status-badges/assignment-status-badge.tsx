import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AssignmentStatus } from "@/types/inventory"

interface AssignmentStatusBadgeProps {
    status: AssignmentStatus
    className?: string
}

export function AssignmentStatusBadge({ status, className }: AssignmentStatusBadgeProps) {
    const getStatusClass = (status: AssignmentStatus) => {
        switch (status) {
            case "Activo":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            case "Devuelto":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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