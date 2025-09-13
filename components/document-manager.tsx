/**
 * Gestor Principal de Documentos - GATI-C
 * 
 * Componente integrador que combina upload y visualización de documentos
 * Maneja el estado completo del sistema de documentos adjuntos según PRD
 */

"use client"

import React, { useState, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FileText, Upload, Trash2, Settings, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import DocumentUpload from './document-upload'
import DocumentViewer from './document-viewer'
import { type DocumentMetadata } from '@/lib/document-storage'
import { cn } from '@/lib/utils'

type UserRole = 'Administrador' | 'Editor' | 'Lector'

interface DocumentManagerProps {
    productId: number
    productName: string
    userRole: UserRole
    currentUserId: string
    initialDocuments?: DocumentMetadata[]
    maxFiles?: number
    disabled?: boolean
    className?: string
    onDocumentChange?: (documents: DocumentMetadata[]) => void
}

export default function DocumentManager({
    productId,
    productName,
    userRole,
    currentUserId,
    initialDocuments = [],
    maxFiles = 10,
    disabled = false,
    className,
    onDocumentChange
}: DocumentManagerProps) {
    const [documents, setDocuments] = useState<DocumentMetadata[]>(initialDocuments)
    const [activeTab, setActiveTab] = useState('upload')

    // Permisos según PRD
    const canUpload = userRole === 'Administrador' || userRole === 'Editor'
    const canViewTrash = userRole === 'Administrador'

    // Filtros de documentos
    const activeDocuments = documents.filter(doc => !doc.isDeleted)
    const trashedDocuments = documents.filter(doc => doc.isDeleted)

    // Manejar subida exitosa
    const handleUploadSuccess = useCallback((newDocument: DocumentMetadata) => {
        setDocuments(prev => {
            const updated = [...prev, newDocument]
            onDocumentChange?.(updated)
            return updated
        })
    }, [onDocumentChange])

    // Manejar eliminación de documento
    const handleDocumentDeleted = useCallback((documentId: string) => {
        setDocuments(prev => {
            const updated = prev.map(doc =>
                doc.id === documentId
                    ? { ...doc, isDeleted: true, deletedAt: new Date(), deletedBy: currentUserId }
                    : doc
            )
            onDocumentChange?.(updated)
            return updated
        })
    }, [currentUserId, onDocumentChange])

    // Manejar restauración de documento
    const handleDocumentRestored = useCallback((documentId: string) => {
        setDocuments(prev => {
            const updated = prev.map(doc =>
                doc.id === documentId
                    ? { ...doc, isDeleted: false, deletedAt: undefined, deletedBy: undefined }
                    : doc
            )
            onDocumentChange?.(updated)
            return updated
        })
    }, [onDocumentChange])

    // Cambiar tab automáticamente después de upload
    const handleUploadSuccessWithTabChange = useCallback((newDocument: DocumentMetadata) => {
        handleUploadSuccess(newDocument)
        // Cambiar a vista de documentos después de subir
        setActiveTab('documents')
    }, [handleUploadSuccess])

    // Verificar si hay espacio para más documentos
    const hasSpaceForUpload = activeDocuments.length < maxFiles

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Documentos Adjuntos
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Gestión de documentos SISE / Contrato de Compra para <strong>{productName}</strong>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {activeDocuments.length}/{maxFiles} activos
                        </Badge>
                        {trashedDocuments.length > 0 && canViewTrash && (
                            <Badge variant="secondary" className="text-xs">
                                {trashedDocuments.length} en papelera
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger
                            value="upload"
                            disabled={!canUpload || disabled || !hasSpaceForUpload}
                            className="flex items-center gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Subir
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Documentos ({activeDocuments.length})
                        </TabsTrigger>
                        {canViewTrash && (
                            <TabsTrigger
                                value="trash"
                                className="flex items-center gap-2"
                                disabled={trashedDocuments.length === 0}
                            >
                                <Trash2 className="h-4 w-4" />
                                Papelera ({trashedDocuments.length})
                            </TabsTrigger>
                        )}
                    </TabsList>

                    {/* Tab de Upload */}
                    <TabsContent value="upload" className="space-y-4 mt-4">
                        {!canUpload ? (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    No tienes permisos para subir documentos. Solo Administradores y Editores pueden realizar esta acción.
                                </AlertDescription>
                            </Alert>
                        ) : !hasSpaceForUpload ? (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    Se ha alcanzado el límite máximo de {maxFiles} documentos por producto.
                                    Elimina algunos documentos existentes para poder subir nuevos.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <DocumentUpload
                                productId={productId}
                                existingDocuments={activeDocuments}
                                onUploadSuccess={handleUploadSuccessWithTabChange}
                                maxFiles={maxFiles}
                                disabled={disabled}
                            />
                        )}
                    </TabsContent>

                    {/* Tab de Documentos Activos */}
                    <TabsContent value="documents" className="space-y-4 mt-4">
                        <DocumentViewer
                            documents={activeDocuments}
                            userRole={userRole}
                            currentUserId={currentUserId}
                            showTrash={false}
                            onDocumentDeleted={handleDocumentDeleted}
                            onDocumentRestored={handleDocumentRestored}
                        />
                    </TabsContent>

                    {/* Tab de Papelera (Solo Admins) */}
                    {canViewTrash && (
                        <TabsContent value="trash" className="space-y-4 mt-4">
                            <Alert className="mb-4">
                                <Trash2 className="h-4 w-4" />
                                <AlertDescription>
                                    Los documentos en la papelera se eliminan automáticamente después de 30 días.
                                    Solo los Administradores pueden restaurar documentos eliminados.
                                </AlertDescription>
                            </Alert>
                            <DocumentViewer
                                documents={trashedDocuments}
                                userRole={userRole}
                                currentUserId={currentUserId}
                                showTrash={true}
                                onDocumentDeleted={handleDocumentDeleted}
                                onDocumentRestored={handleDocumentRestored}
                            />
                        </TabsContent>
                    )}
                </Tabs>

                {/* Información adicional */}
                <Separator className="my-4" />
                <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Política de Documentos GATI-C:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Solo se permiten archivos PDF y Word (.docx)</li>
                        <li>Tamaño máximo por archivo: 100MB</li>
                        <li>Máximo {maxFiles} documentos por producto</li>
                        <li>Los documentos eliminados van a papelera por 30 días</li>
                        <li>Solo Administradores pueden ver y restaurar la papelera</li>
                        <li>Al subir un archivo con el mismo nombre, la versión anterior se mueve a papelera</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
} 