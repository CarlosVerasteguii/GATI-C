"use client"

import { useState, useEffect, useCallback } from "react"
import { useApp } from "@/contexts/app-context"
import { useAuthStore } from "@/lib/stores/useAuthStore"

interface PendingTasksCount {
    total: number
    quickLoads: number
    quickRetires: number
    editorRequests: number
    lastUpdated: Date | null
}

/**
 * Hook to handle pending tasks counter
 * Implements automatic polling every 60 seconds as specified in the SRS
 *
 * @returns {PendingTasksCount & { isLoading: boolean, refresh: () => void }}
 */
export function usePendingTasks() {
    const { state } = useApp()
    const { user } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [tasksCount, setTasksCount] = useState<PendingTasksCount>({
        total: 0,
        quickLoads: 0,
        quickRetires: 0,
        editorRequests: 0,
        lastUpdated: null
    })

    // Function to fetch pending tasks count
    const fetchPendingTasks = useCallback(async () => {
        if (!user || !["ADMINISTRATOR", "EDITOR"].includes(user.role)) {
            return // Only Admins and Editors can see pending tasks
        }

        try {
            setIsLoading(true)

            // Simulate API call - in production it would be:
            // const response = await fetch('/api/v1/tasks/pending/count')
            // const data = await response.json()

            // SIMULATED DATA FOR DEMONSTRATION
            const simulatedData: PendingTasksCount = {
                total: Math.floor(Math.random() * 15), // 0-14 tasks
                quickLoads: Math.floor(Math.random() * 8), // 0-7 quick loads
                quickRetires: Math.floor(Math.random() * 5), // 0-4 quick retires
                editorRequests: user.role === "ADMINISTRATOR" ? Math.floor(Math.random() * 3) : 0, // 0-2 requests (Admin only)
                lastUpdated: new Date()
            }

            // Calculate actual total
            simulatedData.total = simulatedData.quickLoads + simulatedData.quickRetires + simulatedData.editorRequests

            setTasksCount(simulatedData)

        } catch (error) {
            console.error("Error fetching pending tasks count:", error)
            // En caso de error, mantener el último valor conocido
        } finally {
            setIsLoading(false)
        }
    }, [user])

    // Manual refresh function
    const refresh = useCallback(() => {
        fetchPendingTasks()
    }, [fetchPendingTasks])

    // Set up automatic polling every 60 seconds
    useEffect(() => {
        // Initial fetch
        fetchPendingTasks()

        // Set up 60-second interval as specified in the SRS
        const interval = setInterval(fetchPendingTasks, 60000)

        return () => clearInterval(interval)
    }, [fetchPendingTasks])

    // Refresh when user or role changes
    useEffect(() => {
        fetchPendingTasks()
    }, [user?.role, fetchPendingTasks])

    return {
        ...tasksCount,
        isLoading,
        refresh
    }
}

export default usePendingTasks 