"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface AccessRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccessRequestModal({ open, onOpenChange }: AccessRequestModalProps) {
  const { addSolicitudAcceso, addRecentActivity } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    justification: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.justification) {
      showError({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios."
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      showError({
        title: "Contraseñas no coinciden",
        description: "La contraseña y su confirmación deben ser iguales."
      })
      return
    }

    if (formData.password.length < 4) {
      showError({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 4 caracteres."
      })
      return
    }

    setIsLoading(true)

    // Simular envío de solicitud
    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
      setFormData({ name: "", email: "", password: "", confirmPassword: "", justification: "" })

      const newRequest = {
        id: Math.floor(Math.random() * 100000),
        nombre: formData.name,
        email: formData.email,
        justificacion: formData.justification,
        fecha: new Date().toISOString().split("T")[0],
        estado: "Pendiente" as const,
        password: formData.password, // ✅ Incluir contraseña temporal para cuando se apruebe
      }

      addSolicitudAcceso(newRequest)

      showSuccess({
        title: "Solicitud Enviada",
        description: "Tu solicitud de acceso ha sido enviada. Recibirás una notificación cuando sea aprobada."
      })

      addRecentActivity({
        type: "Solicitud de Acceso",
        description: `Nueva solicitud de acceso de ${formData.name} con contraseña definida`,
        date: new Date().toLocaleString(),
        details: {
          name: formData.name,
          email: formData.email,
          justification: formData.justification,
          passwordLength: formData.password.length,
        },
      })
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Solicitar Acceso al Sistema
          </DialogTitle>
          <DialogDescription>
            Completa el formulario para solicitar acceso. Define tu contraseña que usarás una vez aprobada tu solicitud.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Grid de 2 columnas para información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="tu.email@cfe.mx"
                  required
                />
              </div>
            </div>

            {/* Grid de 2 columnas para contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Define tu contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirma tu contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Justificación a ancho completo */}
            <div className="space-y-2">
              <Label htmlFor="justification">Justificación del Acceso *</Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => setFormData((prev) => ({ ...prev, justification: e.target.value }))}
                placeholder="Explica por qué necesitas acceso al sistema de inventario..."
                rows={3}
                required
              />
            </div>

            {/* Nota informativa */}
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 Una vez que un administrador apruebe tu solicitud, podrás iniciar sesión con las credenciales que definiste aquí.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-hover">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Solicitud con Contraseña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
