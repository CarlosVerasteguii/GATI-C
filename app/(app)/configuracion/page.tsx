"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  PlusCircle, 
  AlertTriangle, 
  Settings, 
  Users, 
  Shield, 
  Database, 
  ArrowLeft,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  FileText,
  Trash2,
  Archive,
  RefreshCw,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"
import { StatusBadge } from "@/components/status-badge"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function ConfiguracionPage() {
  const { state } = useApp()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  // Datos mock para demostración - en producción vendrían del backend
  const systemStats = {
    totalUsers: 24,
    activeUsers: 18,
    pendingRequests: 3,
    systemHealth: 98,
    lastBackup: "2024-01-15T10:30:00Z",
    uptime: "99.7%",
    totalProducts: 1247,
    lowStockItems: 12,
    pendingTasks: 8,
    auditLogs: 15420
  }

  const recentActivity = [
    { id: 1, user: "María González", action: "Configuró umbrales de inventario", time: "2 min", status: "success" },
    { id: 2, user: "Carlos Ruiz", action: "Solicitó acceso de Editor", time: "15 min", status: "pending" },
    { id: 3, user: "Ana Martínez", action: "Eliminó categoría 'Dispositivos Antiguos'", time: "1 hora", status: "warning" },
    { id: 4, user: "Luis Pérez", action: "Restauró 3 documentos de papelera", time: "2 horas", status: "success" },
    { id: 5, user: "Sistema", action: "Backup automático completado", time: "3 horas", status: "info" }
  ]

  const handleNavigateBack = () => {
    router.push("/dashboard")
  }

  const handleNavigateToThresholds = () => {
    router.push("/configuracion/umbrales-inventario")
  }

  const handleRefreshStats = () => {
    showInfo("Actualizando estadísticas del sistema...")
    // Aquí se haría la llamada al backend para refrescar stats
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      case 'info': return <Activity className="h-4 w-4 text-blue-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header con Navegación */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Breadcrumbs 
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Configuración", href: "/configuracion" }
            ]} 
          />
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <h1 className="text-3xl font-bold text-cfe-black">Configuración del Sistema</h1>
          </div>
          <p className="text-muted-foreground">
            Gestión centralizada de usuarios, permisos, configuración del sistema y monitoreo de actividad
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStats}
            className="text-cfe-green border-cfe-green hover:bg-cfe-green hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-cfe-green">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cfe-black">{systemStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              de {systemStats.totalUsers} total
            </p>
            <Progress value={(systemStats.activeUsers / systemStats.totalUsers) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Solicitudes Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cfe-black">{systemStats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Database className="h-4 w-4" />
              Salud del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cfe-black">{systemStats.systemHealth}%</div>
            <p className="text-xs text-muted-foreground">
              Uptime: {systemStats.uptime}
            </p>
            <Progress value={systemStats.systemHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Inventario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cfe-black">{systemStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.lowStockItems} con stock bajo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Configuración */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuarios ({systemStats.totalUsers})
          </TabsTrigger>
          <TabsTrigger value="access-requests" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Solicitudes ({systemStats.pendingRequests})
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Umbrales
          </TabsTrigger>
        </TabsList>

        {/* Tab: Resumen */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actividad Reciente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>
                  Últimas acciones realizadas en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cfe-black truncate">
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.action}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Información del Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Información del Sistema
                </CardTitle>
                <CardDescription>
                  Estado actual y configuración del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Último backup:</span>
                    <span className="text-sm font-medium">{formatDate(systemStats.lastBackup)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tareas pendientes:</span>
                    <Badge variant={systemStats.pendingTasks > 0 ? "destructive" : "secondary"}>
                      {systemStats.pendingTasks}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Registros de auditoría:</span>
                    <span className="text-sm font-medium">{systemStats.auditLogs.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Productos con stock bajo:</span>
                    <Badge variant={systemStats.lowStockItems > 0 ? "destructive" : "secondary"}>
                      {systemStats.lowStockItems}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-cfe-black">Acciones Rápidas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNavigateToThresholds}
                      className="text-cfe-green border-cfe-green hover:bg-cfe-green hover:text-white"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Configurar Umbrales
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Gestionar Usuarios
            </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Usuarios */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>
                    Administra usuarios, roles y permisos del sistema
                  </CardDescription>
                </div>
                <Button className="bg-cfe-green hover:bg-cfe-green/90">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
          <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
              />
            </div>
              
            <Table>
              <TableHeader>
                <TableRow>
                    <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Acceso</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">María González</TableCell>
                      <TableCell>
                      <Badge variant="default" className="bg-cfe-green text-white">
                        Administrador
                      </Badge>
                      </TableCell>
                      <TableCell>
                      <StatusBadge status="active" />
                    </TableCell>
                    <TableCell>Hace 2 minutos</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                          Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="h-4 w-4 mr-2" />
                            Desactivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Carlos Ruiz</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        Editor
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status="active" />
                    </TableCell>
                    <TableCell>Hace 15 minutos</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="h-4 w-4 mr-2" />
                            Desactivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Solicitudes de Acceso */}
        <TabsContent value="access-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes de Acceso Pendientes</CardTitle>
              <CardDescription>
                Gestiona las solicitudes de cambio de rol y permisos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {systemStats.pendingRequests > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                      <TableHead>Solicitante</TableHead>
                      <TableHead>Rol Actual</TableHead>
                      <TableHead>Rol Solicitado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Carlos Ruiz</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Lector</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-cfe-green text-white">
                          Editor
                        </Badge>
                      </TableCell>
                      <TableCell>Hace 15 minutos</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-cfe-green hover:bg-cfe-green/90">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Aprobar
                            </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Rechazar
                            </Button>
                          </div>
                      </TableCell>
                    </TableRow>
              </TableBody>
            </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay solicitudes de acceso pendientes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Sistema */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>
                  Parámetros generales y configuración de la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tiempo de sesión (minutos)</label>
                  <Input type="number" defaultValue="480" className="max-w-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frecuencia de backup (horas)</label>
                  <Input type="number" defaultValue="24" className="max-w-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tamaño máximo de archivo (MB)</label>
                  <Input type="number" defaultValue="100" className="max-w-xs" />
                </div>
                <Button className="bg-cfe-green hover:bg-cfe-green/90">
                  Guardar Configuración
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mantenimiento del Sistema</CardTitle>
                <CardDescription>
                  Herramientas de administración y limpieza
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Archive className="h-4 w-4 mr-2" />
                    Limpiar registros antiguos
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Vaciar papelera
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reindexar base de datos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Umbrales */}
        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Umbrales de Inventario</CardTitle>
                  <CardDescription>
                    Configura los umbrales mínimos de stock para alertas automáticas
                  </CardDescription>
          </div>
                    <Button
                  onClick={handleNavigateToThresholds}
                  className="bg-cfe-green hover:bg-cfe-green/90"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Umbrales
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información de Umbrales */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-yellow-800">Información de Umbrales</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• <strong>Umbral Global:</strong> Valor por defecto para todos los productos</li>
                        <li>• <strong>Umbral por Categoría:</strong> Valores específicos por tipo de producto</li>
                        <li>• <strong>Umbral por Producto:</strong> Valores individuales para productos críticos</li>
                        <li>• <strong>Prioridad:</strong> Producto → Categoría → Global</li>
                        <li>• <strong>Alertas:</strong> Se muestran en el dashboard cuando el stock está bajo</li>
                      </ul>
                    </div>
              </div>
            </div>

                {/* Estado Actual */}
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">Estado Actual</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Umbral Global:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Categorías configuradas:</span>
                        <span className="font-medium">2 / 8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Productos configurados:</span>
                        <span className="font-medium">4 / 20</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Cobertura de configuración:</span>
                        <span className="font-medium">21%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Cómo funcionan los umbrales */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Cómo funcionan los umbrales</h4>
                    <p className="text-sm text-gray-700">
                      Los umbrales determinan cuándo un producto tiene "inventario bajo" y aparecerá en las alertas del dashboard. 
                      El sistema usa una jerarquía: primero busca un umbral específico del producto, luego de la categoría, 
                      y finalmente el global.
                    </p>
              </div>
            </div>
          </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
