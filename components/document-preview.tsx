/**
 * Componente de Vista Previa de Documentos - GATI-C
 * 
 * Permite visualizar documentos directamente en la interfaz sin abrir nueva pestaña:
 * - PDFs: Preview embedded con iframe
 * - Word: Información del archivo y opción de descarga
 * - Modal responsive
 */

"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  FileText,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  User,
  HardDrive,
  Info
} from 'lucide-react'
import { type DocumentMetadata } from '@/lib/document-storage'

interface DocumentPreviewProps {
  document: DocumentMetadata
  children?: React.ReactNode
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DocumentPreview({
  document,
  children,
  defaultOpen = false,
  onOpenChange
}: DocumentPreviewProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Obtener tipo de archivo legible
  const getFileTypeDisplay = (mimeType: string): string => {
    if (mimeType.includes('pdf')) return 'PDF'
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Word Document'
    return 'Documento'
  }

  // Verificar si es PDF para mostrar preview
  const isPdf = document.fileType.includes('pdf')

  // URL simulada del documento (en producción sería real)
  const documentUrl = `/api/documents/preview/${document.id}`

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            Vista Previa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vista Previa del Documento</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Header con información del documento */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold">{document.originalFilename}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {getFileTypeDisplay(document.fileType)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {formatFileSize(document.fileSize)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional del documento */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Información del Documento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Subido por:</span>
                    <span className="font-medium">{document.uploadedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Fecha:</span>
                    <span className="font-medium">
                      {document.uploadedAt.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Tamaño:</span>
                    <span className="font-medium">{formatFileSize(document.fileSize)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(documentUrl, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir en nueva pestaña
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Simular descarga
                const link = window.document.createElement('a')
                link.href = documentUrl
                link.download = document.originalFilename
                link.click()
              }}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar
            </Button>
          </div>

          {/* Vista previa del documento */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista Previa
            </h4>

            {/* Contenido de la vista previa */}
            {isPdf ? (
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="aspect-[3/4] w-full">
                  <iframe
                    src={`${documentUrl}#view=FitH`}
                    title={`Vista previa: ${document.originalFilename}`}
                    className="w-full h-full border-0"
                    style={{ minHeight: '600px' }}
                  />
                </div>
              </div>
            ) : (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  La vista previa no está disponible para documentos de Word.
                  Puedes <strong>descargar</strong> el archivo o <strong>abrirlo en nueva pestaña</strong> para visualizarlo.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente más simple para usar como trigger inline
export function DocumentPreviewTrigger({
  document,
  variant = "ghost",
  size = "sm",
  className = ""
}: {
  document: DocumentMetadata
  variant?: "ghost" | "outline" | "default"
  size?: "sm" | "default" | "lg"
  className?: string
}) {
  return (
    <DocumentPreview document={document}>
      <Button
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
        title={`Vista previa: ${document.originalFilename}`}
      >
        <Eye className="h-4 w-4" />
        {size !== "sm" && "Vista Previa"}
      </Button>
    </DocumentPreview>
  )
}

export default DocumentPreview
