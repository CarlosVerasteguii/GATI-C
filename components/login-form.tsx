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
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { ThemeToggle } from "@/components/theme-toggle"
import { QuickLoadModal } from "@/components/quick-load-modal"
import { QuickRetireModal } from "@/components/quick-retire-modal"
import { AccessRequestModal } from "@/components/access-request-modal"
import { HelpModal } from "@/components/help-modal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isQuickLoadModalOpen, setIsQuickLoadModalOpen] = useState(false)
  const [isQuickRetireModalOpen, setIsQuickRetireModalOpen] = useState(false)
  const [isAccessRequestModalOpen, setIsAccessRequestModalOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const { login, isLoading, isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
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
        localStorage.removeItem("gati-c-remember-me")
      }
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login(username, password)

      if (rememberMe) {
        const rememberedName = (user?.name ?? username)
        localStorage.setItem("gati-c-remember-me", JSON.stringify({
          username: rememberedName,
          rememberMe: true,
          lastLogin: new Date().toISOString()
        }))
      } else {
        localStorage.removeItem("gati-c-remember-me")
      }

      showSuccess({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${user?.name || username}!`
      })
      router.replace('/dashboard');

    } catch (err) {
      showError({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Por favor, inténtalo de nuevo."
      })
    }
  }

  const showQuickActions = false

  return (
    <>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsHelpOpen(true)}
                    className={cn(
                      "text-muted-foreground hover:text-foreground transition-opacity duration-700",
                      isMounted ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ayuda</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {showQuickActions && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsQuickLoadModalOpen(true)}
                        className={cn(
                          "text-muted-foreground hover:text-foreground transition-opacity duration-700",
                          isMounted ? "opacity-100" : "opacity-0"
                        )}
                      >
                        <PackagePlus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Carga Rápida</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsQuickRetireModalOpen(true)}
                        className={cn(
                          "text-muted-foreground hover:text-foreground transition-opacity duration-700",
                          isMounted ? "opacity-100" : "opacity-0"
                        )}
                      >
                        <PackageMinus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Baja Rápida</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </CardFooter>
        </Card>
      </div>

      <AccessRequestModal
        open={isAccessRequestModalOpen}
        onOpenChange={setIsAccessRequestModalOpen}
      />
      <QuickLoadModal
        open={isQuickLoadModalOpen}
        onOpenChange={setIsQuickLoadModalOpen}
      />
      <QuickRetireModal
        open={isQuickRetireModalOpen}
        onOpenChange={setIsQuickRetireModalOpen}
      />
      <HelpModal
        open={isHelpOpen}
        onOpenChange={setIsHelpOpen}
      />
      <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Acerca de GATI-C
            </DialogTitle>
            <DialogDescription>
              Sistema de Gestión de Activos y Tareas de Infraestructura de Cómputo (GATI-C)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">Versión:</p>
              <p className="text-sm text-muted-foreground">2.0.0 (Enterprise-Grade)</p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">Desarrollado por:</p>
              <p className="text-sm text-muted-foreground">Equipo de Desarrollo de TI - CFE</p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">Contacto:</p>
              <p className="text-sm text-muted-foreground">soporte.gatic@cfe.mx</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAboutOpen(false)} className="bg-primary hover:bg-primary-hover">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
