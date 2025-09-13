import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/contexts/app-context"
import { Toaster } from "@/components/ui/toaster" // Asegúrate de que Toaster esté disponible

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GATI-C",
  description: "Sistema de Gestión de Activos Tecnológicos e Inventario - CFE",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AppProvider>
            {children}
            <Toaster /> {/* Renderiza el Toaster aquí para que esté disponible globalmente */}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
