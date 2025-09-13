"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

export function ToastDemo() {
    const { showSuccess, showError, showWarning, showInfo, toast } = useToast()

    const handleSuccessToast = () => {
        showSuccess({
            title: "¡Operación Exitosa!",
            description: "El producto ha sido actualizado correctamente en el inventario.",
        })
    }

    const handleErrorToast = () => {
        showError({
            title: "Error en la Operación",
            description: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
        })
    }

    const handleWarningToast = () => {
        showWarning({
            title: "Advertencia de Inventario",
            description: "Quedan menos de 5 unidades de este producto. Considera reabastecer pronto.",
        })
    }

    const handleInfoToast = () => {
        showInfo({
            title: "Información del Sistema",
            description: "Se ha programado mantenimiento para el domingo de 2:00 AM a 4:00 AM.",
        })
    }

    const handleCustomToast = () => {
        toast({
            variant: "destructive",
            title: "Toast Destructivo",
            description: "Este es un toast destructivo con la variante clásica.",
        })
    }

    const handlePersistentToast = () => {
        showError({
            title: "Error Crítico",
            description: "Este toast no se auto-cierra. Úsalo para errores críticos.",
            duration: 0, // No auto-dismiss
        })
    }

    const handleQuickToast = () => {
        showSuccess({
            title: "Guardado",
            description: "Los cambios se guardaron automáticamente.",
            duration: 2000, // Se cierra en 2 segundos
        })
    }

    const handleMultipleToasts = () => {
        // Mostrar múltiples toasts para demostrar el apilamiento mejorado
        showSuccess({
            title: "Primer Toast",
            description: "Este es el primer toast del grupo.",
            duration: 8000,
        })

        setTimeout(() => {
            showWarning({
                title: "Segundo Toast",
                description: "Este es el segundo toast, con espaciado mejorado.",
                duration: 8000,
            })
        }, 500)

        setTimeout(() => {
            showInfo({
                title: "Tercer Toast",
                description: "Ahora los toasts tienen mejor espaciado y opacidad gradual.",
                duration: 8000,
            })
        }, 1000)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    🎨 Sistema de Toast Mejorado
                </CardTitle>
                <CardDescription>
                    Toasts rediseñados para máxima legibilidad - sin brillos molestos, solo claridad profesional.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Toast Types */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Tipos de Toast</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={handleSuccessToast}
                            variant="outline"
                            className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                        >
                            ✅ Éxito
                        </Button>
                        <Button
                            onClick={handleErrorToast}
                            variant="outline"
                            className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                        >
                            ❌ Error
                        </Button>
                        <Button
                            onClick={handleWarningToast}
                            variant="outline"
                            className="bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
                        >
                            ⚠️ Advertencia
                        </Button>
                        <Button
                            onClick={handleInfoToast}
                            variant="outline"
                            className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                        >
                            ℹ️ Información
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Duration Examples */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Duración Personalizada</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={handleQuickToast}
                            variant="outline"
                            size="sm"
                        >
                            ⚡ Toast Rápido (2s)
                        </Button>
                        <Button
                            onClick={handlePersistentToast}
                            variant="outline"
                            size="sm"
                        >
                            📌 Toast Persistente
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Multiple Toasts Demo */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">🎭 Demo de Apilamiento</h3>
                    <Button
                        onClick={handleMultipleToasts}
                        variant="outline"
                        className="w-full bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200"
                    >
                        🚀 Mostrar 3 Toasts (Máxima Legibilidad)
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        Sin brillos molestos, solo textos claros sobre fondos suaves con perfecto contraste
                    </p>
                </div>

                <Separator />

                {/* Legacy Support */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Compatibilidad</h3>
                    <Button
                        onClick={handleCustomToast}
                        variant="destructive"
                        size="sm"
                    >
                        🔥 Toast Destructivo (API Original)
                    </Button>
                </div>

                <Separator />

                {/* Features List */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">✨ Toast System v3.0 - Ultra Limpio</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 📖 <strong>Legibilidad extrema</strong> - Sin efectos que distraigan</li>
                        <li>• 🎨 Iconos automáticos con colores balanceados</li>
                        <li>• 🌊 Animaciones suaves sin rebotes excesivos</li>
                        <li>• 🎯 Colores de fondo sutiles (emerald-50, red-50, etc.)</li>
                        <li>• 🌙 Soporte completo para modo oscuro</li>
                        <li>• ⏰ Auto-cierre inteligente con duraciones por tipo</li>
                        <li>• 🚀 APIs convenientes: showSuccess, showError, etc.</li>
                        <li>• 📚 Espaciado perfecto entre múltiples toasts</li>
                        <li>• 🔗 Totalmente compatible con el sistema anterior</li>
                        <li>• ✨ Eliminados todos los brillos y rings molestos</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
} 