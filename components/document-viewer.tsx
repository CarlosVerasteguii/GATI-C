/**
 * Visualizador y Gestor de Documentos - GATI-C
 * 
 * Funcionalidades según PRD:
 * - Visualización de documentos existentes
 * - Apertura en nueva pestaña
 * - Eliminación con papelera (Admin/Editor)
 * - Restauración (Solo Admin)
 * - Control RBAC completo
 * - Versioning visual
 */

"use client"

import React, { useState } from 'react'
import {
    FileText,
    Download,
    Trash2,
    RotateCcw,
    ExternalLink,
    AlertTriangle,
    Clock,
    User,
    FileX,
    Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
    moveDocumentToTrash,
    restoreDocumentFromTrash,
    getDocumentViewUrl,
    type DocumentMetadata
} from '@/lib/document-storage'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DocumentPreview } from './document-preview'

type UserRole = 'Administrador' | 'Editor' | 'Lector'

interface DocumentViewerProps {
    documents: DocumentMetadata[]
    userRole: UserRole
    currentUserId: string
    showTrash?: boolean
    onDocumentDeleted?: (documentId: string) => void
    onDocumentRestored?: (documentId: string) => void
    className?: string
}

interface DocumentItemProps {
    document: DocumentMetadata
    userRole: UserRole
    currentUserId: string
    showTrash?: boolean
    onDeleted?: (documentId: string) => void
    onRestored?: (documentId: string) => void
}

function DocumentItem({
    document,
    userRole,
    currentUserId,
    showTrash = false,
    onDeleted,
    onRestored
}: DocumentItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)

    // Permisos según PRD
    const canDelete = !document.isDeleted && (userRole === 'Administrador' || userRole === 'Editor')
    const canRestore = document.isDeleted && userRole === 'Administrador'
    const canView = !document.isDeleted

    // Formatear tamaño
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Obtener icono según tipo de archivo
    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) {
            return <FileText className="h-5 w-5 text-red-500" />
        } else if (fileType.includes('word')) {
            return <FileText className="h-5 w-5 text-blue-500" />
        }
        return <FileText className="h-5 w-5 text-gray-500" />
    }

    // Obtener tipo de archivo amigable
    const getFileTypeLabel = (fileType: string): string => {
        if (fileType.includes('pdf')) return 'PDF'
        if (fileType.includes('word')) return 'Word'
        return 'Documento'
    }

    // Manejar visualización del documento
    const handleViewDocument = () => {
        if (canView) {
            const url = getDocumentViewUrl(document)
            window.open(url, '_blank', 'noopener,noreferrer')
        }
    }

    // Manejar eliminación
    const handleDelete = async () => {
        if (!canDelete || isDeleting) return

        setIsDeleting(true)
        try {
            const result = await moveDocumentToTrash(document.id, currentUserId)
            if (result.success) {
                onDeleted?.(document.id)
            }
        } catch (error) {
            console.error('Error al eliminar documento:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    // Manejar restauración
    const handleRestore = async () => {
        if (!canRestore || isRestoring) return

        setIsRestoring(true)
        try {
            const result = await restoreDocumentFromTrash(document.id, currentUserId)
            if (result.success) {
                onRestored?.(document.id)
            }
        } catch (error) {
            console.error('Error al restaurar documento:', error)
        } finally {
            setIsRestoring(false)
        }
    }

    // Información de versión
    const isNewVersion = document.version > 1
    const isDeleted = document.isDeleted

    return (
        <Card className={cn(
            "transition-all duration-200",
            isDeleted && "opacity-60 border-red-200 bg-red-50/50 dark:bg-red-950/20",
            !isDeleted && "hover:shadow-md"
        )}>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icono del archivo */}
                    <div className="flex-shrink-0 mt-1">
                        {getFileIcon(document.fileType)}
                    </div>

                    {/* Información principal */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <h4 className={cn(
                                    "font-medium text-sm truncate",
                                    isDeleted && "line-through text-gray-500"
                                )}>
                                    {document.originalFilename}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                        {getFileTypeLabel(document.fileType)}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                        {formatFileSize(document.fileSize)}
                                    </span>
                                    {isNewVersion && (
                                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                            v{document.version}
                                        </Badge>
                                    )}
                                    {isDeleted && (
                                        <Badge variant="destructive" className="text-xs">
                                            En papelera
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-1">
                                {canView && (
                                    <DocumentPreview
                                        document={document}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            title="Vista previa del documento"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </DocumentPreview>
                                )}

                                {canView && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleViewDocument}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Abrir en nueva pestaña</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                {canDelete && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="flex items-center gap-2">
                                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                                    Eliminar Documento
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    ¿Está seguro que desea eliminar "{document.originalFilename}"?
                                                    El documento se moverá a la papelera y podrá ser restaurado por un Administrador dentro de 30 días.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDelete}
                                                    className="bg-red-600 hover:bg-red-700"
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}

                                {canRestore && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRestore}
                                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
                                                    disabled={isRestoring}
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Restaurar documento</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        </div>

                        {/* Metadatos */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {document.uploadedBy}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(document.uploadedAt, 'dd MMM yyyy, HH:mm', { locale: es })}
                            </span>
                            {isDeleted && document.deletedAt && (
                                <span className="flex items-center gap-1 text-red-500">
                                    <FileX className="h-3 w-3" />
                                    Eliminado: {format(document.deletedAt, 'dd MMM yyyy', { locale: es })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function DocumentViewer({
    documents,
    userRole,
    currentUserId,
    showTrash = false,
    onDocumentDeleted,
    onDocumentRestored,
    className
}: DocumentViewerProps) {
    // Filtrar documentos según si se muestran los eliminados
    const filteredDocuments = documents.filter(doc =>
        showTrash ? doc.isDeleted : !doc.isDeleted
    )

    // Separar por categorías
    const activeDocuments = filteredDocuments.filter(doc => !doc.isDeleted)
    const trashedDocuments = filteredDocuments.filter(doc => doc.isDeleted)

    if (filteredDocuments.length === 0) {
        return (
            <Card className={className}>
                <CardContent className="p-8 text-center">
                    <FileX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {showTrash ? 'Papelera vacía' : 'Sin documentos'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {showTrash
                            ? 'No hay documentos eliminados en la papelera.'
                            : 'No hay documentos adjuntos para este producto.'}
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* Documentos activos */}
            {!showTrash && activeDocuments.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Documentos Adjuntos ({activeDocuments.length})
                    </h3>
                    <div className="space-y-2">
                        {activeDocuments.map((document) => (
                            <DocumentItem
                                key={document.id}
                                document={document}
                                userRole={userRole}
                                currentUserId={currentUserId}
                                onDeleted={onDocumentDeleted}
                                onRestored={onDocumentRestored}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Papelera (solo para Administradores) */}
            {showTrash && userRole === 'Administrador' && trashedDocuments.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-red-600 mb-3 flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Papelera de Documentos ({trashedDocuments.length})
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                        Los documentos se eliminan automáticamente después de 30 días.
                    </p>
                    <div className="space-y-2">
                        {trashedDocuments.map((document) => (
                            <DocumentItem
                                key={document.id}
                                document={document}
                                userRole={userRole}
                                currentUserId={currentUserId}
                                showTrash={true}
                                onDeleted={onDocumentDeleted}
                                onRestored={onDocumentRestored}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
} 