"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trash2, RotateCcw, Search, FileText, Calendar, User, Package, Info, X } from 'lucide-react'
import { useApp } from '@/contexts/app-context'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { showSuccess, showError } from '@/hooks/use-toast'

interface DeletedDocument {
    id: string
    originalFilename: string
    fileType: string
    fileSize: number
    productId: number
    productName: string
    uploadedBy: string
    uploadedAt: Date
    deletedBy: string
    deletedAt: Date
    deletionReason: 'manual_delete' | 'version_overwrite' | 'admin_purge'
    previousVersion?: boolean
    replacedByVersion?: string
    retentionDaysLeft: number
}

// Función helper para mapear roles
const mapRoleToEnglish = (spanishRole: string): string => {
    switch (spanishRole) {
        case "Administrador": return "admin"
        case "Editor": return "editor"
        case "Lector": return "lector"
        default: return "lector"
    }
}

export default function PapeleraDocumentosPage() {
    const { state } = useApp()
    const { user } = useAuthStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [filterProduct, setFilterProduct] = useState("")
    const [filterReason, setFilterReason] = useState("")
    const [filterUser, setFilterUser] = useState("")

    // Verificar permisos - CORREGIDO para usar roles en español
    const userRole = user?.rol
    const hasAccess = userRole === "Administrador" || userRole === "Editor"
    const canRestore = userRole === "Administrador"

    // Datos simulados de documentos eliminados (en producción vendría del backend)
    const deletedDocuments: DeletedDocument[] = [
        {
            id: "doc-001",
            originalFilename: "CONTRATO_LAPTOPS_2024.pdf",
            fileType: "application/pdf",
            fileSize: 2547892,
            productId: 1,
            productName: "Laptop Dell Inspiron 15",
            uploadedBy: "Carlos Mendez",
            uploadedAt: new Date("2024-01-15T10:30:00"),
            deletedBy: "Ana Rodriguez",
            deletedAt: new Date("2024-01-20T14:45:00"),
            deletionReason: "manual_delete",
            retentionDaysLeft: 25
        },
        {
            id: "doc-002",
            originalFilename: "SISE_MONITORES_OLD.pdf",
            fileType: "application/pdf",
            fileSize: 1823456,
            productId: 5,
            productName: "Monitor Samsung 24\"",
            uploadedBy: "Luis Garcia",
            uploadedAt: new Date("2024-01-10T09:15:00"),
            deletedBy: "Luis Garcia",
            deletedAt: new Date("2024-01-22T11:20:00"),
            deletionReason: "version_overwrite",
            previousVersion: true,
            replacedByVersion: "SISE_MONITORES_V2.pdf",
            retentionDaysLeft: 23
        },
        {
            id: "doc-003",
            originalFilename: "GARANTIA_IMPRESORAS.docx",
            fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            fileSize: 456789,
            productId: 12,
            productName: "Impresora HP LaserJet",
            uploadedBy: "Maria Fernandez",
            uploadedAt: new Date("2024-01-05T16:20:00"),
            deletedBy: "Carlos Admin",
            deletedAt: new Date("2024-01-25T13:10:00"),
            deletionReason: "admin_purge",
            retentionDaysLeft: 20
        }
    ]

    // Filtrar documentos
    const filteredDocuments = deletedDocuments.filter(doc => {
        const matchesSearch = doc.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.productName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesProduct = !filterProduct || filterProduct === "__all__" || doc.productName.includes(filterProduct)
        const matchesReason = !filterReason || filterReason === "__all__" || doc.deletionReason === filterReason
        const matchesUser = !filterUser || doc.deletedBy.includes(filterUser)

        return matchesSearch && matchesProduct && matchesReason && matchesUser
    })

    // Formatear tamaño de archivo
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Obtener badge de razón de eliminación
    const getDeletionReasonBadge = (reason: string, previousVersion?: boolean) => {
        switch (reason) {
            case 'manual_delete':
                return <Badge variant="destructive" className="text-xs">Eliminación Manual</Badge>
            case 'version_overwrite':
                return <Badge variant="secondary" className="text-xs">Versión Anterior</Badge>
            case 'admin_purge':
                return <Badge variant="outline" className="text-xs">Purga Administrativa</Badge>
            default:
                return <Badge variant="outline" className="text-xs">Desconocido</Badge>
        }
    }

    // Obtener color de días restantes
    const getRetentionColor = (daysLeft: number) => {
        if (daysLeft <= 7) return "text-red-600"
        if (daysLeft <= 14) return "text-orange-600"
        return "text-green-600"
    }

    // Manejar restauración
    const handleRestore = async (doc: DeletedDocument) => {
        if (!canRestore) {
            showError({
                title: "Sin permisos",
                description: "Solo los Administradores pueden restaurar documentos."
            })
            return
        }

        // Simular restauración
        showSuccess({
            title: "Documento Restaurado",
            description: `"${doc.originalFilename}" ha sido restaurado al producto "${doc.productName}".`
        })
    }

    // Manejar eliminación permanente
    const handlePermanentDelete = async (doc: DeletedDocument) => {
        if (!canRestore) {
            showError({
                title: "Sin permisos",
                description: "Solo los Administradores pueden eliminar permanentemente documentos."
            })
            return
        }

        showSuccess({
            title: "Documento Eliminado Permanentemente",
            description: `"${doc.originalFilename}" ha sido eliminado permanentemente del sistema.`
        })
    }

    // Función para limpiar todos los filtros
    const clearAllFilters = () => {
        setSearchTerm("");
        setFilterProduct("");
        setFilterReason("");
        setFilterUser("");
    }

    if (!hasAccess) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                <Alert className="max-w-2xl mx-auto">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        No tienes permisos para acceder a la papelera de documentos.
                        Solo Administradores y Editores pueden ver esta sección.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Trash2 className="h-8 w-8" />
                        Papelera de Documentos
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestión centralizada de documentos eliminados del sistema
                    </p>
                </div>
                <Badge variant="outline" className="text-sm">
                    {filteredDocuments.length} documentos en papelera
                </Badge>
            </div>

            {/* Información de retención */}
            <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                    Los documentos se eliminan automáticamente después de <strong>30 días</strong> en papelera.
                    Solo los Administradores pueden restaurar documentos eliminados.
                </AlertDescription>
            </Alert>

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
                        {(searchTerm || filterProduct || filterReason || filterUser) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="flex items-center text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Limpiar filtros
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Buscar</label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Nombre de archivo o producto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                                {searchTerm && (
                                    <button
                                        className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                                        onClick={() => setSearchTerm("")}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Producto</label>
                            <Select value={filterProduct} onValueChange={setFilterProduct}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos los productos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todos los productos</SelectItem>
                                    <SelectItem value="Laptop">Laptops</SelectItem>
                                    <SelectItem value="Monitor">Monitores</SelectItem>
                                    <SelectItem value="Impresora">Impresoras</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Razón de Eliminación</label>
                            <Select value={filterReason} onValueChange={setFilterReason}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas las razones" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todas las razones</SelectItem>
                                    <SelectItem value="manual_delete">Eliminación Manual</SelectItem>
                                    <SelectItem value="version_overwrite">Versión Anterior</SelectItem>
                                    <SelectItem value="admin_purge">Purga Administrativa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Eliminado por</label>
                            <div className="relative">
                                <Input
                                    placeholder="Nombre de usuario..."
                                    value={filterUser}
                                    onChange={(e) => setFilterUser(e.target.value)}
                                />
                                {filterUser && (
                                    <button
                                        className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                                        onClick={() => setFilterUser("")}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabla de documentos */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Documentos Eliminados</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredDocuments.length === 0 ? (
                        <div className="text-center py-12">
                            <Trash2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No hay documentos en papelera</h3>
                            <p className="text-muted-foreground">
                                {deletedDocuments.length === 0
                                    ? "La papelera está vacía."
                                    : "No hay documentos que coincidan con los filtros aplicados."
                                }
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Documento</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Razón</TableHead>
                                    <TableHead>Eliminado por</TableHead>
                                    <TableHead>Fecha Eliminación</TableHead>
                                    <TableHead>Días Restantes</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDocuments.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium text-sm">{doc.originalFilename}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(doc.fileSize)} •
                                                        {doc.fileType.includes('pdf') ? ' PDF' : ' Word'}
                                                    </p>
                                                    {doc.replacedByVersion && (
                                                        <p className="text-xs text-blue-600">
                                                            Reemplazado por: {doc.replacedByVersion}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{doc.productName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getDeletionReasonBadge(doc.deletionReason, doc.previousVersion)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{doc.deletedBy}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {doc.deletedAt.toLocaleDateString('es-ES', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-sm font-medium ${getRetentionColor(doc.retentionDaysLeft)}`}>
                                                {doc.retentionDaysLeft} días
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {canRestore && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleRestore(doc)}
                                                            className="text-green-600 hover:text-green-700"
                                                        >
                                                            <RotateCcw className="h-4 w-4 mr-1" />
                                                            Restaurar
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePermanentDelete(doc)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Eliminar
                                                        </Button>
                                                    </>
                                                )}
                                                {!canRestore && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Solo Admin
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 