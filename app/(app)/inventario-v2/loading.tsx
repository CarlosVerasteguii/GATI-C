import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Toolbar skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <Skeleton className="h-9 w-full" />
                </div>
            </div>

            {/* Table skeleton */}
            <div className="rounded-md border">
                <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b bg-gray-50">
                    <div className="col-span-1"><Skeleton className="h-4 w-24" /></div>
                    <div className="col-span-1"><Skeleton className="h-4 w-20" /></div>
                    <div className="col-span-1"><Skeleton className="h-4 w-24" /></div>
                    <div className="col-span-1"><Skeleton className="h-4 w-16" /></div>
                    <div className="col-span-1"><Skeleton className="h-4 w-20" /></div>
                    <div className="col-span-1"><Skeleton className="h-4 w-24" /></div>
                </div>
                <div className="divide-y">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-6 gap-4 px-4 py-3 items-center">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


