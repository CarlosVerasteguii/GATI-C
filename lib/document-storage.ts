/**
 * Sistema de Gestión de Documentos Adjuntos - GATI-C
 * Implementa las especificaciones exactas del PRD para documentos SISE/Contrato de Compra
 * 
 * Características:
 * - Tipos permitidos: PDF, DOCX
 * - Tamaño máximo: 100MB por archivo
 * - Múltiples documentos por producto
 * - Sistema de papelera (30 días)
 * - Versioning con backup automático
 * - Error handling específico del PRD
 */

import { v4 as uuidv4 } from 'uuid'

// Tipos de documentos según PRD
export const ALLOWED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
} as const

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB en bytes
export const TRASH_RETENTION_DAYS = 30

// Interfaces
export interface DocumentMetadata {
    id: string
    originalFilename: string
    storedFilename: string
    fileType: string
    fileSize: number
    productId: number
    uploadedBy: string
    uploadedAt: Date
    isDeleted: boolean
    deletedAt?: Date
    deletedBy?: string
    version: number
    previousVersionId?: string
}

export interface DocumentUploadResult {
    success: boolean
    document?: DocumentMetadata
    error?: {
        code: string
        message: string
        details?: any
    }
}

export interface DocumentValidationResult {
    isValid: boolean
    error?: {
        code: 'INVALID_TYPE' | 'SIZE_EXCEEDED' | 'CORRUPTED_FILE' | 'SERVER_ERROR'
        message: string
    }
}

/**
 * Valida un archivo según las especificaciones del PRD
 */
export function validateDocument(file: File): DocumentValidationResult {
    // Validar tipo de archivo
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
        return {
            isValid: false,
            error: {
                code: 'INVALID_TYPE',
                message: 'Tipo de archivo no permitido. Solo se aceptan PDF y Word.'
            }
        }
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: {
                code: 'SIZE_EXCEEDED',
                message: 'El archivo excede el tamaño máximo permitido de 100MB.'
            }
        }
    }

    // Validar que el archivo no esté corrupto (verificación básica)
    if (file.size === 0) {
        return {
            isValid: false,
            error: {
                code: 'CORRUPTED_FILE',
                message: 'Error al procesar el archivo. Por favor, intente con otro archivo.'
            }
        }
    }

    return { isValid: true }
}

/**
 * Genera un nombre único para almacenamiento manteniendo la extensión original
 */
export function generateStoredFilename(originalFilename: string): string {
    const extension = originalFilename.split('.').pop()
    const uuid = uuidv4()
    return `${uuid}.${extension}`
}

/**
 * Simula la subida de un documento al servidor
 * En producción, esto se conectaría con el backend real
 */
export async function uploadDocument(
    file: File,
    productId: number,
    uploadedBy: string
): Promise<DocumentUploadResult> {
    try {
        // Validar el archivo
        const validation = validateDocument(file)
        if (!validation.isValid) {
            return {
                success: false,
                error: validation.error
            }
        }

        // Simular tiempo de subida real
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Generar metadata del documento
        const document: DocumentMetadata = {
            id: uuidv4(),
            originalFilename: file.name,
            storedFilename: generateStoredFilename(file.name),
            fileType: file.type,
            fileSize: file.size,
            productId,
            uploadedBy,
            uploadedAt: new Date(),
            isDeleted: false,
            version: 1
        }

        // En producción aquí se haría:
        // 1. Subir archivo al sistema de archivos del servidor
        // 2. Guardar metadata en base de datos
        // 3. Generar URL para acceso

        return {
            success: true,
            document
        }

    } catch (error) {
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Ocurrió un error en el servidor al subir el archivo. Por favor, inténtelo de nuevo más tarde.',
                details: error
            }
        }
    }
}

/**
 * Mueve un documento a la papelera (soft delete)
 */
export async function moveDocumentToTrash(
    documentId: string,
    deletedBy: string
): Promise<DocumentUploadResult> {
    try {
        // En producción: actualizar base de datos marcando isDeleted = true
        // y programar eliminación automática en 30 días

        await new Promise(resolve => setTimeout(resolve, 300))

        return {
            success: true,
            document: {
                id: documentId,
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy
            } as DocumentMetadata
        }

    } catch (error) {
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Error al mover el documento a la papelera.',
                details: error
            }
        }
    }
}

/**
 * Restaura un documento de la papelera (solo Administradores)
 */
export async function restoreDocumentFromTrash(
    documentId: string,
    restoredBy: string
): Promise<DocumentUploadResult> {
    try {
        // En producción: verificar que el usuario sea Administrador
        // y restaurar el documento marcando isDeleted = false

        await new Promise(resolve => setTimeout(resolve, 300))

        return {
            success: true,
            document: {
                id: documentId,
                isDeleted: false,
                deletedAt: undefined,
                deletedBy: undefined
            } as DocumentMetadata
        }

    } catch (error) {
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Error al restaurar el documento.',
                details: error
            }
        }
    }
}

/**
 * Obtiene la URL para visualizar/descargar un documento
 */
export function getDocumentViewUrl(document: DocumentMetadata): string {
    // En producción: generar URL firmada para acceso seguro
    // Por ahora retornamos una URL simulada
    return `/api/documents/${document.storedFilename}/view`
}

/**
 * Maneja el versioning cuando se sube una nueva versión de un documento existente
 */
export async function uploadDocumentVersion(
    file: File,
    existingDocumentId: string,
    uploadedBy: string
): Promise<DocumentUploadResult> {
    try {
        // 1. Mover versión anterior a papelera
        await moveDocumentToTrash(existingDocumentId, uploadedBy)

        // 2. Subir nueva versión
        const result = await uploadDocument(file, 0, uploadedBy) // productId se obtendría del documento existente

        if (result.success && result.document) {
            // 3. Marcar como nueva versión
            result.document.version = 2 // En producción, incrementar basado en versión anterior
            result.document.previousVersionId = existingDocumentId
        }

        return result

    } catch (error) {
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Error al actualizar la versión del documento.',
                details: error
            }
        }
    }
}

export default {
    validateDocument,
    uploadDocument,
    moveDocumentToTrash,
    restoreDocumentFromTrash,
    getDocumentViewUrl,
    uploadDocumentVersion,
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
    TRASH_RETENTION_DAYS
} 