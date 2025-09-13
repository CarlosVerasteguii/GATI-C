"use client"

import React from "react"
import { CheckCircle } from "lucide-react"

export function NavigationDemo() {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Mejoras de Navegación Implementadas</h2>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Indicadores de carga implementados</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Badge contador de tareas pendientes</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Atajos de teclado (Ctrl+B)</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Breadcrumbs inteligentes</span>
                </div>
            </div>
        </div>
    )
}

export default NavigationDemo 