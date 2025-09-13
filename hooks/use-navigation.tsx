"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface NavigationState {
    isNavigating: boolean
    loadingPage: string | null
    previousPage: string | null
}

/**
 * Hook personalizado para manejar estados de navegación y carga
 * Proporciona feedback visual durante las transiciones de página
 * 
 * @returns {NavigationState & { setNavigating: (loading: boolean, page?: string) => void }}
 */
export function useNavigation() {
    const [state, setState] = useState<NavigationState>({
        isNavigating: false,
        loadingPage: null,
        previousPage: null
    })

    const router = useRouter()
    const pathname = usePathname()

    // Función manual para indicar navegación
    const setNavigating = (loading: boolean, page?: string) => {
        setState(prev => ({
            ...prev,
            isNavigating: loading,
            loadingPage: loading ? page || null : null,
            previousPage: loading ? prev.loadingPage : prev.previousPage
        }))
    }

    // Detectar cambios de ruta automáticamente
    useEffect(() => {
        const handleRouteChangeStart = (url: string) => {
            setState(prev => ({
                isNavigating: true,
                loadingPage: url,
                previousPage: pathname
            }))
        }

        const handleRouteChangeComplete = () => {
            setState(prev => ({
                isNavigating: false,
                loadingPage: null,
                previousPage: prev.loadingPage
            }))
        }

        const handleRouteChangeError = () => {
            setState(prev => ({
                isNavigating: false,
                loadingPage: null,
                previousPage: prev.previousPage
            }))
        }

        // En Next.js App Router creamos un wrapper para detectar navegación
        // No podemos interceptar router.push directamente, así que usaremos
        // un enfoque diferente con eventos personalizados

        // Cleanup automático cuando la página cambia
        let navigationTimeout: NodeJS.Timeout | null = null

        const startNavigation = () => {
            handleRouteChangeStart(pathname)

            // Auto-clear después de un tiempo
            if (navigationTimeout) clearTimeout(navigationTimeout)
            navigationTimeout = setTimeout(handleRouteChangeComplete, 2000)
        }

        const completeNavigation = () => {
            if (navigationTimeout) clearTimeout(navigationTimeout)
            handleRouteChangeComplete()
        }

        // Limpiar timeout al desmontar
        return () => {
            if (navigationTimeout) clearTimeout(navigationTimeout)
        }
    }, [router, pathname])

    // Auto-clear loading after timeout (failsafe)
    useEffect(() => {
        if (state.isNavigating) {
            const timeout = setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    isNavigating: false,
                    loadingPage: null
                }))
            }, 5000) // 5 segundos máximo

            return () => clearTimeout(timeout)
        }
    }, [state.isNavigating])

    return {
        ...state,
        setNavigating
    }
}

export default useNavigation 