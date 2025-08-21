"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/contexts/app-context"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { showError, showSuccess, showInfo, showWarning } from "@/hooks/use-toast"
import { Lock, User, Mail, Shield, Wifi, Loader2 } from "lucide-react"

// Extendemos el tipo User para incluir trustedIp
interface ExtendedUser {
  id: number
  nombre: string
  email: string
  password?: string
  rol: "Administrador" | "Editor" | "Lector"
  departamento?: string
  trustedIp?: string
}

export default function ProfilePage() {
  const { state, updateUserInUsersData, addRecentActivity } = useApp()
  const { user } = useAuthStore()


  const currentUser = user as ExtendedUser | null

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false)

  const [newIpAddress, setNewIpAddress] = useState(currentUser?.trustedIp || "")
  const [isIpUpdateLoading, setIsIpUpdateLoading] = useState(false)
  const [autoDetectingIp, setAutoDetectingIp] = useState(false)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setIsPasswordChangeLoading(true)

    if (currentPassword !== currentUser.password) {
      showError({
        title: "Error al cambiar contraseña",
        description: "La contraseña actual es incorrecta."
      })
      setIsPasswordChangeLoading(false)
      return
    }

    if (newPassword !== confirmNewPassword) {
      showError({
        title: "Error al cambiar contraseña",
        description: "La nueva contraseña y la confirmación no coinciden."
      })
      setIsPasswordChangeLoading(false)
      return
    }

    if (newPassword.length < 6) {
      showError({
        title: "Error al cambiar contraseña",
        description: "La nueva contraseña debe tener al menos 6 caracteres."
      })
      setIsPasswordChangeLoading(false)
      return
    }

    // Simular una demora para mejor UX
    setTimeout(() => {
      updateUserInUsersData(currentUser.id, {
        password: newPassword
      })

      addRecentActivity({
        type: "Cambio de Contraseña",
        description: `Contraseña del usuario ${currentUser.nombre} (${currentUser.rol}) cambiada.`,
        date: new Date().toLocaleString(),
        details: { userId: currentUser.id, userName: currentUser.nombre },
      })
      showSuccess({
        title: "Contraseña Actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente."
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
      setIsPasswordChangeLoading(false)
    }, 800)
  }

  const handleIpUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setIsIpUpdateLoading(true)

    // Basic IP validation (can be more robust)
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
    if (newIpAddress && !ipRegex.test(newIpAddress)) {
      showError({
        title: "Error al actualizar IP",
        description: "Formato de dirección IP inválido."
      })
      setIsIpUpdateLoading(false)
      return
    }

    // Simular una demora para mejor UX
    setTimeout(() => {
      // Usamos any para evitar problemas de tipo con trustedIp
      updateUserInUsersData(currentUser.id, {
        trustedIp: newIpAddress
      } as any)

      addRecentActivity({
        type: "Actualización de IP Confiable",
        description: `IP confiable del usuario ${currentUser.nombre} (${currentUser.rol}) actualizada a ${newIpAddress || "N/A"}.`,
        date: new Date().toLocaleString(),
        details: { userId: currentUser.id, userName: currentUser.nombre, newIp: newIpAddress },
      })
      showSuccess({
        title: "IP Confiable Actualizada",
        description: "La dirección IP confiable ha sido actualizada exitosamente."
      })

      setIsIpUpdateLoading(false)
    }, 800)
  }

  const handleAutoDetectIp = () => {
    setAutoDetectingIp(true)

    // Toast de progreso inmediato
    showInfo({
      title: "Detectando IP...",
      description: "Consultando dirección IP actual"
    })

    // Simulación de detección automática de IP con validación
    setTimeout(() => {
      const simulatedIp = "192.168.1." + Math.floor(Math.random() * 255)
      setNewIpAddress(simulatedIp)
      setAutoDetectingIp(false)

      // Validar que la IP detectada no sea la misma que la actual
      if (currentUser?.trustedIp === simulatedIp) {
        showWarning({
          title: "IP sin cambios",
          description: "La IP detectada es la misma que tienes configurada"
        })
      } else {
        showSuccess({
          title: "IP detectada automáticamente",
          description: `Nueva IP encontrada: ${simulatedIp}`
        })
      }
    }, 1500)
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Cargando información del usuario...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona la información de tu cuenta y preferencias.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Información del Usuario */}
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="bg-muted/40">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Información Personal
            </CardTitle>
            <CardDescription>Detalles de tu cuenta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label>Nombre</Label>
              <p className="text-lg font-medium">{currentUser.nombre}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-lg font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {currentUser.email}
              </p>
            </div>
            <div>
              <Label>Rol</Label>
              <p className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {currentUser.rol}
              </p>
            </div>
            {currentUser.departamento && (
              <div>
                <Label>Departamento</Label>
                <p className="text-lg font-medium">{currentUser.departamento}</p>
              </div>
            )}
            <div>
              <Label>Estado</Label>
              <p className="text-green-600 font-medium">Activo</p>
            </div>
          </CardContent>
        </Card>

        {/* Cambiar Contraseña */}
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="bg-muted/40">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-primary transition-colors duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-primary transition-colors duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-primary transition-colors duration-200"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full transition-colors duration-200"
                disabled={isPasswordChangeLoading}
              >
                {isPasswordChangeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPasswordChangeLoading ? "Cambiando..." : "Cambiar Contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Asignar IP Confiable (Solo para Administradores/Editores) */}
        {(currentUser.rol === "Administrador" || currentUser.rol === "Editor") && (
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="bg-muted/40">
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" />
                IP Confiable
              </CardTitle>
              <CardDescription>Asigna una dirección IP para acceso rápido sin autenticación completa.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleIpUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trusted-ip">Dirección IP Confiable</Label>
                  <div className="flex gap-2">
                    <Input
                      id="trusted-ip"
                      type="text"
                      placeholder="Ej. 192.168.1.100"
                      value={newIpAddress}
                      onChange={(e) => setNewIpAddress(e.target.value)}
                      className="focus:ring-2 focus:ring-primary transition-colors duration-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAutoDetectIp}
                      disabled={autoDetectingIp}
                    >
                      {autoDetectingIp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Detectar"
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Deja vacío para deshabilitar la IP confiable.</p>
                </div>
                <Button
                  type="submit"
                  className="w-full transition-colors duration-200"
                  disabled={isIpUpdateLoading}
                >
                  {isIpUpdateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isIpUpdateLoading ? "Actualizando..." : "Actualizar IP"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  (Nota: En un entorno real, tu IP se detectaría automáticamente. Aquí es una simulación.)
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
