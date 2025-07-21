import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { LoanStatus } from "@/types/inventory"

interface LoanStatusBadgeProps {
    status: LoanStatus
    className?: string
}

export function LoanStatusBadge({ status, className }: LoanStatusBadgeProps) {
    const getStatusClass = (status: LoanStatus) => {
        switch (status) {
            case "Activo":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            case "Devuelto":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            case "Vencido":
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