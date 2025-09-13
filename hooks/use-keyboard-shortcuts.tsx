"use client"

import { useEffect, useCallback } from "react"

interface KeyboardShortcut {
    key: string
    ctrlKey?: boolean
    metaKey?: boolean
    altKey?: boolean
    shiftKey?: boolean
    callback: () => void
    description: string
    preventDefault?: boolean
}

interface KeyboardShortcutsConfig {
    shortcuts: KeyboardShortcut[]
    enabled?: boolean
}

/**
 * Hook para manejar atajos de teclado globales
 * Soporta múltiples shortcuts con modificadores
 * 
 * @param config - Configuración de atajos de teclado
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   shortcuts: [
 *     {
 *       key: 'b',
 *       ctrlKey: true,
 *       callback: toggleSidebar,
 *       description: 'Toggle Sidebar'
 *     }
 *   ]
 * })
 * ```
 */
export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
    const { shortcuts, enabled = true } = config

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return

        // Evitar interferir con inputs, textareas, etc.
        const target = event.target as HTMLElement
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.contentEditable === 'true' ||
            target.closest('[role="textbox"]')
        ) {
            return
        }

        // Buscar shortcut que coincida
        const matchingShortcut = shortcuts.find(shortcut => {
            return (
                shortcut.key.toLowerCase() === event.key.toLowerCase() &&
                !!shortcut.ctrlKey === event.ctrlKey &&
                !!shortcut.metaKey === event.metaKey &&
                !!shortcut.altKey === event.altKey &&
                !!shortcut.shiftKey === event.shiftKey
            )
        })

        if (matchingShortcut) {
            if (matchingShortcut.preventDefault !== false) {
                event.preventDefault()
            }
            matchingShortcut.callback()
        }
    }, [shortcuts, enabled])

    useEffect(() => {
        if (!enabled) return

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown, enabled])

    // Función para obtener una descripción legible del shortcut
    const getShortcutDescription = useCallback((shortcut: KeyboardShortcut): string => {
        const modifiers = []
        if (shortcut.ctrlKey) modifiers.push('Ctrl')
        if (shortcut.metaKey) modifiers.push('Cmd')
        if (shortcut.altKey) modifiers.push('Alt')
        if (shortcut.shiftKey) modifiers.push('Shift')

        return `${modifiers.join('+')}${modifiers.length > 0 ? '+' : ''}${shortcut.key.toUpperCase()}`
    }, [])

    return {
        getShortcutDescription
    }
}

/**
 * Hook específico para GATI-C con shortcuts predefinidos
 * Incluye toggle de sidebar y otros atajos comunes
 */
export function useGatiKeyboardShortcuts(callbacks: {
    toggleSidebar?: () => void
    goToInventory?: () => void
    goToDashboard?: () => void
    goToTasks?: () => void
}) {
    const shortcuts: KeyboardShortcut[] = [
        // Toggle Sidebar (Ctrl+B - estándar de VS Code, GitHub, etc.)
        ...(callbacks.toggleSidebar ? [{
            key: 'b',
            ctrlKey: true,
            callback: callbacks.toggleSidebar,
            description: 'Toggle Sidebar',
            preventDefault: true
        }] : []),

        // Navegación rápida (Ctrl+Shift+...)
        ...(callbacks.goToDashboard ? [{
            key: 'd',
            ctrlKey: true,
            shiftKey: true,
            callback: callbacks.goToDashboard,
            description: 'Go to Dashboard',
            preventDefault: true
        }] : []),

        ...(callbacks.goToInventory ? [{
            key: 'i',
            ctrlKey: true,
            shiftKey: true,
            callback: callbacks.goToInventory,
            description: 'Go to Inventory',
            preventDefault: true
        }] : []),

        ...(callbacks.goToTasks ? [{
            key: 't',
            ctrlKey: true,
            shiftKey: true,
            callback: callbacks.goToTasks,
            description: 'Go to Pending Tasks',
            preventDefault: true
        }] : [])
    ]

    const { getShortcutDescription } = useKeyboardShortcuts({
        shortcuts,
        enabled: true
    })

    return {
        shortcuts,
        getShortcutDescription
    }
}

export default useKeyboardShortcuts 