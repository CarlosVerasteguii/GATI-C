"use client"

import React from "react"
import { Keyboard, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface KeyboardShortcut {
    keys: string[]
    description: string
    category: string
}

const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
    // Navegación
    {
        keys: ["Ctrl", "B"],
        description: "Colapsar/Expandir sidebar",
        category: "Navegación"
    },
    {
        keys: ["Ctrl", "Shift", "D"],
        description: "Ir a Dashboard",
        category: "Navegación"
    },
    {
        keys: ["Ctrl", "Shift", "I"],
        description: "Ir a Inventario",
        category: "Navegación"
    },
    {
        keys: ["Ctrl", "Shift", "T"],
        description: "Ir a Tareas Pendientes",
        category: "Navegación"
    },

    // Formularios (futuros)
    {
        keys: ["Ctrl", "S"],
        description: "Guardar formulario",
        category: "Formularios"
    },
    {
        keys: ["Esc"],
        description: "Cerrar modal/formulario",
        category: "Formularios"
    },

    // Búsqueda (futuros)
    {
        keys: ["Ctrl", "K"],
        description: "Búsqueda global",
        category: "Búsqueda"
    },
    {
        keys: ["/"],
        description: "Búsqueda rápida",
        category: "Búsqueda"
    }
]

interface KeyboardShortcutsHelpProps {
    className?: string
    variant?: "icon" | "text"
}

export function KeyboardShortcutsHelp({
    className = "",
    variant = "icon"
}: KeyboardShortcutsHelpProps) {
    const [open, setOpen] = React.useState(false)

    // Agrupar shortcuts por categoría
    const groupedShortcuts = KEYBOARD_SHORTCUTS.reduce((acc, shortcut) => {
        if (!acc[shortcut.category]) {
            acc[shortcut.category] = []
        }
        acc[shortcut.category].push(shortcut)
        return acc
    }, {} as Record<string, KeyboardShortcut[]>)

    const renderKeyCombo = (keys: string[]) => (
        <div className="flex items-center gap-1">
            {keys.map((key, index) => (
                <React.Fragment key={key}>
                    <Badge variant="outline" className="px-2 py-1 text-xs font-mono bg-muted">
                        {key}
                    </Badge>
                    {index < keys.length - 1 && (
                        <span className="text-muted-foreground">+</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size={variant === "icon" ? "icon" : "sm"}
                    className={className}
                    title="Ver atajos de teclado (Ctrl+?)"
                >
                    <Keyboard className="h-4 w-4" />
                    {variant === "text" && <span className="ml-2">Atajos</span>}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Keyboard className="h-5 w-5" />
                        Atajos de Teclado
                    </DialogTitle>
                    <DialogDescription>
                        Usa estos atajos para navegar más rápido por GATI-C
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                        <div key={category}>
                            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                                {category}
                            </h3>

                            <div className="space-y-3">
                                {shortcuts.map((shortcut, index) => (
                                    <div key={index} className="flex items-center justify-between py-2">
                                        <span className="text-sm">{shortcut.description}</span>
                                        {renderKeyCombo(shortcut.keys)}
                                    </div>
                                ))}
                            </div>

                            {category !== Object.keys(groupedShortcuts)[Object.keys(groupedShortcuts).length - 1] && (
                                <Separator className="mt-4" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                        <strong>Tip:</strong> Los atajos funcionan en toda la aplicación, excepto cuando estás escribiendo en campos de texto.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

/**
 * Hook para mostrar el modal de atajos con Ctrl+?
 */
export function useKeyboardShortcutsHelp() {
    const [showHelp, setShowHelp] = React.useState(false)

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ctrl+? o Ctrl+/
            if (event.ctrlKey && (event.key === '?' || event.key === '/')) {
                event.preventDefault()
                setShowHelp(true)
            }

            // Escape para cerrar
            if (event.key === 'Escape') {
                setShowHelp(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return {
        showHelp,
        setShowHelp
    }
}

export default KeyboardShortcutsHelp 