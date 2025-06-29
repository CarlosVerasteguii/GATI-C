"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { showInfo, showWarning, showSuccess } from "@/hooks/use-toast"

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOnline, setIsOnline] = useState(true)

  // Estado para el renderizado en dos pasos - evita conflictos de hidratación
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
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

  if (!isClient) {
    // Renderizado del servidor y primera carga: retorna null para evitar hidratación
    return null
  }

  // Solo cuando isClient es true, renderizamos el layout completo
  return <AppLayout>{children}</AppLayout>
}
