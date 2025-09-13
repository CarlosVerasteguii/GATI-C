import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LoadingPapeleraDocumentos() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-80" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-6 w-32" />
            </div>

            {/* Alert Skeleton */}
            <Skeleton className="h-16 w-full rounded-lg" />

            {/* Filters Card Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Table Card Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Table Header */}
                        <div className="grid grid-cols-7 gap-4">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <Skeleton key={i} className="h-4" />
                            ))}
                        </div>

                        {/* Table Rows */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-7 gap-4 py-3">
                                {Array.from({ length: 7 }).map((_, j) => (
                                    <Skeleton key={j} className="h-8" />
                                ))}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 