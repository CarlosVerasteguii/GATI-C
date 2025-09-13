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
 * Hook para manejar el contador de tareas pendientes
 * Implementa polling automático cada 60 segundos como especifica el SRS
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

    // Función para obtener el conteo de tareas pendientes
    const fetchPendingTasks = useCallback(async () => {
        if (!user || !["Administrador", "Editor"].includes(user.rol)) {
            return // Solo Admins y Editores ven tareas pendientes
        }

        try {
            setIsLoading(true)

            // Simular llamada a API - en producción sería:
            // const response = await fetch('/api/v1/tasks/pending/count')
            // const data = await response.json()

            // SIMULACIÓN DE DATOS PARA DEMOSTRACIÓN
            const simulatedData: PendingTasksCount = {
                total: Math.floor(Math.random() * 15), // 0-14 tareas
                quickLoads: Math.floor(Math.random() * 8), // 0-7 cargas rápidas
                quickRetires: Math.floor(Math.random() * 5), // 0-4 retiros rápidos
                editorRequests: user.rol === "Administrador" ? Math.floor(Math.random() * 3) : 0, // 0-2 solicitudes (solo para Admin)
                lastUpdated: new Date()
            }

            // Calcular total real
            simulatedData.total = simulatedData.quickLoads + simulatedData.quickRetires + simulatedData.editorRequests

            setTasksCount(simulatedData)

        } catch (error) {
            console.error("Error fetching pending tasks count:", error)
            // En caso de error, mantener el último valor conocido
        } finally {
            setIsLoading(false)
        }
    }, [user])

    // Función manual para refrescar
    const refresh = useCallback(() => {
        fetchPendingTasks()
    }, [fetchPendingTasks])

    // Configurar polling automático cada 60 segundos
    useEffect(() => {
        // Fetch inicial
        fetchPendingTasks()

        // Configurar intervalo de 60 segundos como especifica el SRS
        const interval = setInterval(fetchPendingTasks, 60000)

        return () => clearInterval(interval)
    }, [fetchPendingTasks])

    // Refrescar cuando cambia el usuario o su rol
    useEffect(() => {
        fetchPendingTasks()
    }, [user?.rol, fetchPendingTasks])

    return {
        ...tasksCount,
        isLoading,
        refresh
    }
}

export default usePendingTasks 