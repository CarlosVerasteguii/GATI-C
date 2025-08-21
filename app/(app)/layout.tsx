"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { showInfo, showWarning, showSuccess } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/stores/useAuthStore"

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOnline, setIsOnline] = useState(true)
  const { checkSession, isLoading, sessionChecked } = useAuthStore()

  // Estado para el renderizado en dos pasos - evita conflictos de hidratación
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    checkSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Simular estados de conexión ocasionales para demostrar toasts del sistema
    const simulateConnectionStates = () => {
      const intervals = [
        // Sincronización automática cada 30 segundos
        setInterval(() => {
          showInfo({
            title: "Sincronizando...",
            description: "Actualizando datos del servidor",
            duration: 2000
          })

          // Simular sincronización completada
          setTimeout(() => {
            showSuccess({
              title: "Sincronización completada",
              description: "Datos actualizados correctamente",
              duration: 2000
            })
          }, 1500)
        }, 30000),

        // Simular pérdida de conexión ocasional (muy raro)
        setInterval(() => {
          if (Math.random() < 0.1) { // 10% de probabilidad cada 60 segundos
            setIsOnline(false)
            showWarning({
              title: "Conexión inestable",
              description: "Reintentando conexión automáticamente...",
              duration: 3000
            })

            // Restaurar conexión después de 3 segundos
            setTimeout(() => {
              setIsOnline(true)
              showSuccess({
                title: "Conexión restaurada",
                description: "Vuelves a estar conectado al servidor",
                duration: 2000
              })
            }, 3000)
          }
        }, 60000)
      ]

      return () => {
        intervals.forEach(interval => clearInterval(interval))
      }
    }

    const cleanup = simulateConnectionStates()

    return cleanup
  }, [])

  if (!isClient || isLoading || !sessionChecked) {
    // Renderizado del servidor y primera carga: retorna null para evitar hidratación
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>Verificando sesión...</span>
        </div>
      </div>
    )
  }

  // Solo cuando isClient es true, renderizamos el layout completo
  return <AppLayout>{children}</AppLayout>
}
