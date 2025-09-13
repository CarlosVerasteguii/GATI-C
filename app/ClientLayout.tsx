"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useAuthStore } from "@/lib/stores/useAuthStore"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const protectedRoutes = [
    "/dashboard",
    "/inventario",
    "/prestamos",
    "/asignados",
    "/tareas-pendientes",
    "/historial",
    "/configuracion",
  ]

  useEffect(() => {
    if (!isAuthenticated && protectedRoutes.includes(pathname)) {
      router.push("/login")
    }
  }, [isAuthenticated, pathname, router, protectedRoutes])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
