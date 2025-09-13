/**
 * Componente de Upload de Documentos - GATI-C
 * 
 * Implementa la funcionalidad completa de upload de documentos adjuntos
 * según las especificaciones del PRD:
 * - Drag & Drop intuitivo
 * - Validación en tiempo real
 * - Progress indicators
 * - Error handling específico del PRD
 * - Interfaz moderna y fluida
 */

"use client"

import React, { useState, useCallback, useRef } from 'react'
import { FileText, Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    validateDocument,
    uploadDocument,
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
    type DocumentMetadata,
    type DocumentUploadResult
} from '@/lib/document-storage'
import { cn } from '@/lib/utils'

interface DocumentUploadProps {
    productId: number
    existingDocuments?: DocumentMetadata[]
    onUploadSuccess?: (document: DocumentMetadata) => void
    onUploadError?: (error: string) => void
    maxFiles?: number
    disabled?: boolean
    className?: string
}

interface UploadState {
    isDragOver: boolean
    isUploading: boolean
    uploadProgress: number
    error: string | null
    successMessage: string | null
}

export default function DocumentUpload({
    productId,
    existingDocuments = [],
    onUploadSuccess,
    onUploadError,
    maxFiles = 10,
    disabled = false,
    className
}: DocumentUploadProps) {
    const [state, setState] = useState<UploadState>({
        isDragOver: false,
        isUploading: false,
        uploadProgress: 0,
        error: null,
        successMessage: null
    })

    const fileInputRef = useRef<HTMLInputElement>(null)
    const dragCounter = useRef(0)

    // Formatear tamaño de archivo
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Reset states
    const resetStates = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null,
            successMessage: null,
            uploadProgress: 0
        }))
    }, [])

    // Manejo de drag & drop
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dragCounter.current++

        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setState(prev => ({ ...prev, isDragOver: true }))
        }
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dragCounter.current--

        if (dragCounter.current === 0) {
            setState(prev => ({ ...prev, isDragOver: false }))
        }
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setState(prev => ({ ...prev, isDragOver: false }))
        dragCounter.current = 0

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            handleFileUpload(files)
        }
    }, [])

    // Manejo de upload de archivos
    const handleFileUpload = async (files: File[]) => {
        if (disabled || state.isUploading) return

        resetStates()

        // Validar límite de archivos
        if (existingDocuments.length + files.length > maxFiles) {
            setState(prev => ({
                ...prev,
                error: `No se pueden subir más de ${maxFiles} documentos por producto.`
            }))
            return
        }

        setState(prev => ({ ...prev, isUploading: true }))

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]

                // Simular progreso durante la validación
                setState(prev => ({
                    ...prev,
                    uploadProgress: (i / files.length) * 20
                }))

                // Validar archivo
                const validation = validateDocument(file)
                if (!validation.isValid && validation.error) {
                    setState(prev => ({
                        ...prev,
                        isUploading: false,
                        error: validation.error!.message
                    }))
                    onUploadError?.(validation.error.message)
                    return
                }

                // Simular progreso durante upload
                setState(prev => ({
                    ...prev,
                    uploadProgress: ((i / files.length) * 80) + 20
                }))

                // Subir archivo
                const result: DocumentUploadResult = await uploadDocument(
                    file,
                    productId,
                    'usuario-actual' // En producción, obtener del contexto de autenticación
                )

                if (!result.success || !result.document) {
                    setState(prev => ({
                        ...prev,
                        isUploading: false,
                        error: result.error?.message || 'Error desconocido durante la subida'
                    }))
                    onUploadError?.(result.error?.message || 'Error desconocido')
                    return
                }

                // Notificar éxito
                onUploadSuccess?.(result.document)
            }

            // Completar progreso
            setState(prev => ({
                ...prev,
                uploadProgress: 100,
                successMessage: files.length === 1
                    ? 'Documento subido exitosamente'
                    : `${files.length} documentos subidos exitosamente`
            }))

            // Limpiar éxito después de 3 segundos
            setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    successMessage: null,
                    uploadProgress: 0
                }))
            }, 3000)

        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'Error inesperado durante la subida. Inténtelo de nuevo.'
            }))
            onUploadError?.('Error inesperado durante la subida')
        } finally {
            setState(prev => ({ ...prev, isUploading: false }))
        }
    }

    // Abrir selector de archivos
    const openFileSelector = () => {
        if (!disabled && !state.isUploading) {
            fileInputRef.current?.click()
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            handleFileUpload(files)
        }
        // Reset input para permitir subir el mismo archivo de nuevo
        e.target.value = ''
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* Área de Upload */}
            <Card
                className={cn(
                    "relative transition-all duration-200 cursor-pointer",
                    "border-dashed border-2",
                    state.isDragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-400",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileSelector}
            >
                <CardContent className="flex flex-col items-center justify-center py-8 px-6 text-center">
                    {state.isUploading ? (
                        <>
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subiendo documento...
                            </p>
                            <Progress value={state.uploadProgress} className="w-full max-w-xs" />
                            <p className="text-xs text-gray-500 mt-1">
                                {Math.round(state.uploadProgress)}% completado
                            </p>
                        </>
                    ) : (
                        <>
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Arrastra documentos aquí o <span className="text-blue-600 hover:text-blue-700">haz clic para seleccionar</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF y Word (.docx) • Máx. {formatFileSize(MAX_FILE_SIZE)} por archivo
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {Object.keys(ALLOWED_FILE_TYPES).map((type) => (
                                    <Badge key={type} variant="outline" className="text-xs">
                                        {type.includes('pdf') ? 'PDF' : 'DOCX'}
                                    </Badge>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>

                {/* Input oculto */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={Object.keys(ALLOWED_FILE_TYPES).join(',')}
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={disabled || state.isUploading}
                />
            </Card>

            {/* Mensajes de estado */}
            {state.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state.error}</AlertDescription>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => setState(prev => ({ ...prev, error: null }))}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </Alert>
            )}

            {state.successMessage && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                        {state.successMessage}
                    </AlertDescription>
                </Alert>
            )}

            {/* Información de límites */}
            <div className="text-xs text-gray-500 space-y-1">
                <p>• Documentos actuales: {existingDocuments.length}/{maxFiles}</p>
                <p>• Tipos permitidos: PDF, Word (.docx)</p>
                <p>• Tamaño máximo por archivo: {formatFileSize(MAX_FILE_SIZE)}</p>
                <p>• Los documentos se pueden eliminar y restaurar (solo Administradores)</p>
            </div>
        </div>
    )
} 