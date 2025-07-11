"use client"

import * as React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { LogIn, Info, HelpCircle, Loader2, PackageMinus, PackagePlus } from "lucide-react"
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"
import { useApp } from "@/contexts/app-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { QuickLoadModal } from "@/components/quick-load-modal"
import { QuickRetireModal } from "@/components/quick-retire-modal" // New QuickRetireModal
import { AccessRequestModal } from "@/components/access-request-modal"
import { HelpModal } from "@/components/help-modal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ParticleBackground from "@/components/ui/particle-background"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    // Pequeño retraso para dar tiempo al fondo a renderizarse primero
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 100) // 100ms es suficiente

    return () => clearTimeout(timer)
  }, [])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isQuickLoadModalOpen, setIsQuickLoadModalOpen] = useState(false)
  const [isQuickRetireModalOpen, setIsQuickRetireModalOpen] = useState(false)
  const [isAccessRequestModalOpen, setIsAccessRequestModalOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false) // Added back for the About dialog
  const [isLoading, setIsLoading] = useState(false)

  const { state, setUser, addRecentActivity } = useApp()
  const router = useRouter()

  // Load remembered credentials on component mount
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (state.user) {
      router.push("/dashboard")
      return
    }

    // Load remembered credentials from localStorage
    const rememberedCredentials = localStorage.getItem("gati-c-remember-me")
    if (rememberedCredentials) {
      try {
        const { username: savedUsername, rememberMe: wasRemembered } = JSON.parse(rememberedCredentials)
        if (wasRemembered && savedUsername) {
          setUsername(savedUsername)
          setRememberMe(true)
          showInfo({
            title: "Sesión recordada",
            description: `Bienvenido de vuelta, ${savedUsername}. Solo ingresa tu contraseña.`,
            duration: 3000
          })
        }
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("gati-c-remember-me")
      }
    }
  }, [state.user, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    // Remove debug console.log for production
    // console.log("Attempting login with:", { username, password })

    const foundUser = state.usersData.find(
      (user) => user.nombre.toLowerCase() === username.toLowerCase() && user.password === password, // Check password
    )

    if (foundUser) {
      // Handle Remember Me functionality
      if (rememberMe) {
        localStorage.setItem("gati-c-remember-me", JSON.stringify({
          username: foundUser.nombre,
          rememberMe: true,
          lastLogin: new Date().toISOString()
        }))
        showInfo({
          title: "Credenciales guardadas",
          description: "Tus credenciales han sido guardadas para próximos inicios de sesión.",
          duration: 2000
        })
      } else {
        // Clear any existing remembered credentials if user unchecked the box
        localStorage.removeItem("gati-c-remember-me")
      }

      setUser(foundUser)
      addRecentActivity({
        type: "Inicio de Sesión",
        description: `Usuario ${foundUser.nombre} (${foundUser.rol}) ha iniciado sesión ${rememberMe ? 'con credenciales recordadas' : ''}.`,
        date: new Date().toLocaleString(),
        details: {
          userId: foundUser.id,
          userName: foundUser.nombre,
          userRole: foundUser.rol,
          rememberMe: rememberMe,
          loginMethod: rememberMe ? "remembered" : "manual"
        },
      })
      showSuccess({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${foundUser.nombre}!`
      })
      router.push("/dashboard")
    } else {
      showError({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Por favor, inténtalo de nuevo."
      })
    }

    setIsLoading(false)
  }

  // Determine if quick actions should be available (e.g., for trusted IPs or specific roles)
  // For demo, let's make it available if any user is logged in or if a specific trusted user exists
  const simulatedCurrentIp = "192.168.1.100"
  const trustedUserForQuickActions = state.usersData.find((user) => (user as any).trustedIp === simulatedCurrentIp)
  const showQuickActions = !!trustedUserForQuickActions

  return (
    <>
      {/* Capa 1: Fondo de Partículas */}
      <ParticleBackground />

      {/* Capa 2: Contenido Principal (Formulario Centrado) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-2xl pointer-events-auto">
          <Card
            className={cn(
              "bg-card/95 backdrop-blur-sm border-white/20 shadow-xl transition-all duration-700",
              isMounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            )}
          >
            <CardHeader className="space-y-1 p-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold text-cfe-green">GATI-C</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ThemeToggle />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cambiar tema</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="focus:ring-2 focus:ring-primary transition-colors duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-2 focus:ring-primary transition-colors duration-200"
                    required
                  />
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Recordar mis credenciales
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-8 pt-0">
              <Button
                variant="link"
                onClick={() => setIsAccessRequestModalOpen(true)}
                className={cn(
                  "text-sm p-0 h-auto text-cfe-green dark:text-muted-foreground hover:underline transition-opacity duration-700",
                  isMounted ? "opacity-100" : "opacity-0"
                )}
              >
                ¿No tienes cuenta? Solicitar Acceso
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsAboutOpen(true)}
                      className={cn(
                        "text-muted-foreground hover:text-foreground transition-opacity duration-700",
                        isMounted ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Acerca de GATI-C</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>

          {/* Quick Actions Card for Trusted IP */}
          {showQuickActions && (
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg">
                  Acciones Rápidas para {trustedUserForQuickActions?.nombre || "Usuario Rápido"}
                </CardTitle>
                <CardDescription>Realiza cargas o retiros sin iniciar sesión completa.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button variant="outline" onClick={() => setIsQuickLoadModalOpen(true)}>
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Registrar Carga Rápida
                </Button>
                <Button variant="outline" onClick={() => setIsQuickRetireModalOpen(true)}>
                  <PackageMinus className="mr-2 h-4 w-4" />
                  Registrar Retiro Rápido
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Capa 3: Modales (Se renderizan en el nivel superior) */}
      <AccessRequestModal
        open={isAccessRequestModalOpen}
        onOpenChange={setIsAccessRequestModalOpen}
      />
      <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-status-maintenance" />
              Acerca de GATI-C
            </DialogTitle>
            <DialogDescription>Sistema de Gestión de Activos Tecnológicos e Inventario - CFE</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Versión</h4>
              <p className="text-sm text-muted-foreground">v11.0 - Edición CFE</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Desarrollado para</h4>
              <p className="text-sm text-muted-foreground">Comisión Federal de Electricidad (CFE)</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Características</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gestión integral de inventario</li>
                <li>• Control de préstamos y asignaciones</li>
                <li>• Flujo de tareas pendientes</li>
                <li>• Auditoría completa de actividades</li>
                <li>• Interfaz optimizada para CFE</li>
                <li>• Recordar credenciales de usuario</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Soporte</h4>
              <p className="text-sm text-muted-foreground">Para soporte técnico, contacta al departamento de TI.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <HelpModal open={isHelpOpen} onOpenChange={setIsHelpOpen} />
      {showQuickActions && (
        <>
          <QuickLoadModal open={isQuickLoadModalOpen} onOpenChange={setIsQuickLoadModalOpen} />
          <QuickRetireModal open={isQuickRetireModalOpen} onOpenChange={setIsQuickRetireModalOpen} />
        </>
      )}
    </>
  )
}
