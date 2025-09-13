"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
    label: string
    href?: string
    isCurrentPage?: boolean
}

interface BreadcrumbsProps {
    className?: string
    separator?: React.ReactNode
    homeIcon?: boolean
    maxItems?: number
}

// Mapeo de rutas a nombres amigables
const ROUTE_NAMES: Record<string, string> = {
    // Rutas principales
    'dashboard': 'Dashboard',
    'inventario': 'Inventario',
    'prestamos': 'Préstamos',
    'asignados': 'Asignados',
    'tareas-pendientes': 'Tareas Pendientes',
    'historial': 'Historial',
    'configuracion': 'Configuración',
    'perfil': 'Perfil',

    // Sub-rutas comunes
    'crear': 'Crear',
    'editar': 'Editar',
    'ver': 'Ver',
    'detalles': 'Detalles',
    'nuevo': 'Nuevo',
    'procesar': 'Procesar',
    'completar': 'Completar',

    // Rutas de configuración
    'usuarios': 'Usuarios',
    'categorias': 'Categorías',
    'marcas': 'Marcas',
    'ubicaciones': 'Ubicaciones',

    // Estados y acciones
    'pendiente': 'Pendiente',
    'completado': 'Completado',
    'cancelado': 'Cancelado'
}

/**
 * Componente de breadcrumbs inteligente para GATI-C
 * Genera automáticamente las migas de pan basado en la ruta actual
 * 
 * @param className - Clases CSS adicionales
 * @param separator - Elemento separador personalizado
 * @param homeIcon - Mostrar icono de home en lugar de texto
 * @param maxItems - Número máximo de items a mostrar
 */
export function Breadcrumbs({
    className,
    separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
    homeIcon = true,
    maxItems = 4
}: BreadcrumbsProps) {
    const pathname = usePathname()

    // Generar breadcrumbs automáticamente
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const segments = pathname.split('/').filter(Boolean)
        const breadcrumbs: BreadcrumbItem[] = []

        // Home/Dashboard
        breadcrumbs.push({
            label: homeIcon ? 'Home' : 'Dashboard',
            href: '/dashboard'
        })

        // Construir breadcrumbs para cada segmento
        let currentPath = ''
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`
            const isLast = index === segments.length - 1

            // Obtener nombre amigable del segmento
            const friendlyName = ROUTE_NAMES[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

            // Para IDs numéricos o códigos, intentar obtener un nombre más descriptivo
            const enhancedLabel = enhanceSegmentLabel(segment, segments, index)

            breadcrumbs.push({
                label: enhancedLabel || friendlyName,
                href: isLast ? undefined : currentPath,
                isCurrentPage: isLast
            })
        })

        return breadcrumbs
    }

    // Mejorar etiquetas de segmentos específicos
    const enhanceSegmentLabel = (segment: string, segments: string[], index: number): string | null => {
        const prevSegment = segments[index - 1]

        // Si el segmento anterior es "inventario" y este parece un ID
        if (prevSegment === 'inventario' && /^[A-Z0-9-]+$/i.test(segment)) {
            return `Producto ${segment.toUpperCase()}`
        }

        // Si el segmento anterior es "usuarios" y este parece un ID
        if (prevSegment === 'usuarios' && /^\d+$/.test(segment)) {
            return `Usuario #${segment}`
        }

        // Si el segmento anterior es "tareas-pendientes" y este parece un ID
        if (prevSegment === 'tareas-pendientes' && /^\d+$/.test(segment)) {
            return `Tarea #${segment}`
        }

        return null
    }

    const breadcrumbs = generateBreadcrumbs()

    // Truncar si excede maxItems
    const displayBreadcrumbs = breadcrumbs.length > maxItems
        ? [
            breadcrumbs[0], // Siempre mostrar home
            { label: '...', isCurrentPage: false }, // Ellipsis
            ...breadcrumbs.slice(-2) // Últimos 2 items
        ]
        : breadcrumbs

    // No mostrar breadcrumbs en la página de dashboard principal
    if (pathname === '/dashboard' || pathname === '/') {
        return null
    }

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
        >
            <ol className="flex items-center space-x-1">
                {displayBreadcrumbs.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <span className="mx-2" aria-hidden="true">
                                {separator}
                            </span>
                        )}

                        {item.label === '...' ? (
                            <span className="px-1">...</span>
                        ) : item.href && !item.isCurrentPage ? (
                            <Link
                                href={item.href}
                                className="hover:text-foreground transition-colors duration-200 flex items-center gap-1"
                                aria-label={`Go to ${item.label}`}
                            >
                                {index === 0 && homeIcon ? (
                                    <Home className="h-4 w-4" />
                                ) : (
                                    item.label
                                )}
                            </Link>
                        ) : (
                            <span
                                className={cn(
                                    "flex items-center gap-1",
                                    item.isCurrentPage && "text-foreground font-medium"
                                )}
                                aria-current={item.isCurrentPage ? "page" : undefined}
                            >
                                {index === 0 && homeIcon ? (
                                    <Home className="h-4 w-4" />
                                ) : (
                                    item.label
                                )}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

/**
 * Breadcrumbs específicos para páginas complejas
 * Permite override manual de breadcrumbs cuando la detección automática no es suficiente
 */
interface CustomBreadcrumbsProps extends BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export function CustomBreadcrumbs({ items, className, separator, homeIcon }: CustomBreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
        >
            <ol className="flex items-center space-x-1">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <span className="mx-2" aria-hidden="true">
                                {separator || <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                            </span>
                        )}

                        {item.href && !item.isCurrentPage ? (
                            <Link
                                href={item.href}
                                className="hover:text-foreground transition-colors duration-200 flex items-center gap-1"
                            >
                                {index === 0 && homeIcon ? (
                                    <Home className="h-4 w-4" />
                                ) : (
                                    item.label
                                )}
                            </Link>
                        ) : (
                            <span
                                className={cn(
                                    "flex items-center gap-1",
                                    item.isCurrentPage && "text-foreground font-medium"
                                )}
                                aria-current={item.isCurrentPage ? "page" : undefined}
                            >
                                {index === 0 && homeIcon ? (
                                    <Home className="h-4 w-4" />
                                ) : (
                                    item.label
                                )}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumbs 