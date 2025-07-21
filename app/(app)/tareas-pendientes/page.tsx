"use client"

import {
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu"
import { useState, useMemo } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, ArrowUpDown, Eye, CheckCircle, XCircle, Edit, Plus } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { StatusBadge } from "@/components/status-badge"
import { EditTaskSheet } from "@/components/edit-task-sheet"
import { ConfirmationDialogForEditor } from "@/components/confirmation-dialog-for-editor"
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"
import { TaskAuditLogSheet } from "@/components/task-audit-log-sheet"
import { ActionMenu } from "@/components/action-menu"
import { EmptyState } from "@/components/empty-state"
import { AssignModal } from "@/components/assign-modal"
import { LendModal } from "@/components/lend-modal"
import { QuickLoadModal } from "@/components/quick-load-modal"
import { RetireProductModal } from "@/components/retire-product-modal"
import { InventoryItem } from "@/types/inventory"

interface PendingTask {
  id: number
  type: string
  creationDate: string
  createdBy: string
  status: string
  details: any
  auditLog?: { event: string; user: string; dateTime: string; description: string }[]
}

interface Assignment {
  id: number
  articuloId: number
  nombre: string
  numeroSerie: string | null
  asignadoA: string
  fechaAsignacion: string
  estado: string // Cambiado de tipo enumerado a string para mayor flexibilidad
  notas?: string
  registradoPor?: string
}

interface Loan {
  id: number
  articuloId: number
  nombre: string
  numeroSerie: string | null
  prestadoA: string
  fechaPrestamo: string
  fechaDevolucion: string
  estado: string // Cambiado de tipo enumerado a string para mayor flexibilidad
  diasRestantes: number
  notas?: string
  registradoPor?: string
}

export default function TareasPendientesPage() {
  const {
    state,
    updatePendingTask,
    addRecentActivity,
    updateInventory,
    addAssignment,
    addLoan,
    removeInventoryItem,
    addInventoryItem,
    updateInventoryItem,
  } = useApp()
  const { pendingTasksData, user, inventoryData, asignadosData, prestamosData } = state

  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "Todos",
    type: "Todos",
  })
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  }>({ key: "creationDate", direction: "descending" })

  // Estados para modales y sheets
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<PendingTask | null>(null)
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false)
  const [taskToApprove, setTaskToApprove] = useState<PendingTask | null>(null)
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false)
  const [taskToReject, setTaskToReject] = useState<PendingTask | null>(null)
  const [isAuditLogSheetOpen, setIsAuditLogSheetOpen] = useState(false)

  // Modales para tipos específicos de tareas
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isLendModalOpen, setIsLendModalOpen] = useState(false)
  const [isQuickLoadModalOpen, setIsQuickLoadModalOpen] = useState(false)
  const [isRetireProductModalOpen, setIsRetireProductModalOpen] = useState(false)

  const canApproveOrCancel = user?.rol === "Administrador" || user?.rol === "Editor"

  // Handlers para edición de tareas
  const handleEditTask = (task: PendingTask) => {
    setSelectedTask(task)
    setIsEditSheetOpen(true)
  }

  // Handlers para aprobación y rechazo
  const handleApproveTask = (task: PendingTask) => {
    setTaskToApprove(task)
    setIsApproveConfirmOpen(true)
  }

  const handleRejectTask = (task: PendingTask) => {
    setTaskToReject(task)
    setIsRejectConfirmOpen(true)
  }

  const handleViewAuditLog = (task: PendingTask) => {
    setSelectedTask(task)
    setIsAuditLogSheetOpen(true)
  }

  // Filtrado de tareas
  const filteredTasks = useMemo(() => {
    return pendingTasksData.filter((task) => {
      const matchesSearch =
        (task.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.createdBy || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.details?.productName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.details?.assignedTo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.details?.lentToName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.details?.reason || "").toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filters.status === "Todos" || task.status === filters.status
      const matchesType = filters.type === "Todos" || task.type === filters.type

      return matchesSearch && matchesStatus && matchesType
    })
  }, [pendingTasksData, searchTerm, filters])

  // Ordenamiento de tareas
  const sortedTasks = useMemo(() => {
    if (!sortConfig) {
      return filteredTasks
    }

    return [...filteredTasks].sort((a, b) => {
      let aValue: any
      let bValue: any

      // Manejo especial para propiedades anidadas o específicas
      if (sortConfig.key === "creationDate") {
        aValue = new Date(a.creationDate || "").getTime()
        bValue = new Date(b.creationDate || "").getTime()
      } else if (sortConfig.key === "type" || sortConfig.key === "status" || sortConfig.key === "createdBy") {
        aValue = a[sortConfig.key] || ""
        bValue = b[sortConfig.key] || ""
      } else {
        // Fallback para otras propiedades
        aValue = (a as any)[sortConfig.key] || ""
        bValue = (b as any)[sortConfig.key] || ""
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "ascending" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [filteredTasks, sortConfig])

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    if (sortConfig.direction === "ascending") {
      return <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  // Listas de tipos y estados para filtros
  const allTaskTypes = useMemo(() => {
    const types = new Set(pendingTasksData.map((t) => t.type).filter(Boolean))
    return ["Todos", ...Array.from(types).sort()]
  }, [pendingTasksData])

  const allTaskStatuses = useMemo(() => {
    const statuses = new Set(pendingTasksData.map((t) => t.status).filter(Boolean))
    return ["Todos", ...Array.from(statuses).sort()]
  }, [pendingTasksData])

  // Lógica de confirmación para aprobación de tareas
  const confirmApprove = () => {
    if (!taskToApprove) return

    const currentUser = user?.nombre || "Sistema"
    const currentDateTime = new Date().toLocaleString()

    // Lógica específica según el tipo de tarea
    switch (taskToApprove.type) {
      case "CARGA":
        const newId = Math.max(...(inventoryData || []).map((item) => item.id), 0) + 1
        const newItem: InventoryItem = {
          id: newId,
          nombre: taskToApprove.details.productName,
          marca: taskToApprove.details.brand,
          modelo: taskToApprove.details.model,
          categoria: taskToApprove.details.category,
          descripcion: taskToApprove.details.description,
          estado: "Disponible",
          cantidad: taskToApprove.details.quantity,
          numeroSerie:
            taskToApprove.details.serialNumbers && taskToApprove.details.serialNumbers.length > 0
              ? taskToApprove.details.serialNumbers[0]
              : null,
          fechaIngreso: new Date().toISOString().split("T")[0],
        }
        addInventoryItem(newItem)
        addRecentActivity({
          type: "Carga de Producto",
          description: `Se aprobó la carga de "${taskToApprove.details.productName}" (Cantidad: ${taskToApprove.details.quantity}).`,
          date: currentDateTime,
          details: taskToApprove.details,
        })
        break;
      case "RETIRO":
        const newInventory = [...inventoryData]
        taskToApprove.details.itemsImplicados.forEach((itemToRetire: any) => {
          const itemIndex = newInventory.findIndex(
            (inv) => inv.id === itemToRetire.originalId && inv.numeroSerie === itemToRetire.serial,
          )
          if (itemIndex !== -1) {
            newInventory[itemIndex] = {
              ...newInventory[itemIndex],
              estado: "Retirado",
              motivoRetiro: taskToApprove.details.reason,
              fechaRetiro: new Date().toISOString().split("T")[0],
            }
          }
        })
        updateInventory(newInventory)
        addRecentActivity({
          type: "Retiro de Producto",
          description: `Se aprobó el retiro de "${taskToApprove.details.itemsImplicados[0]?.name || "Múltiples artículos"}" por "${taskToApprove.details.reason}".`,
          date: currentDateTime,
          details: taskToApprove.details,
        })
        break;
      case "ASIGNACION":
        const assignedItem = inventoryData.find(
          (item) =>
            item.id === taskToApprove.details.productId &&
            item.numeroSerie === taskToApprove.details.productSerialNumber,
        )
        if (assignedItem) {
          updateInventoryItem(assignedItem.id, { estado: "Asignado" })
          const newAssignment: Assignment = {
            id: Math.max(...(asignadosData || []).map((a) => a.id), 0) + 1,
            articuloId: assignedItem.id,
            nombre: assignedItem.nombre,
            numeroSerie: assignedItem.numeroSerie,
            asignadoA: taskToApprove.details.assignedTo,
            fechaAsignacion: new Date().toISOString().split("T")[0],
            estado: "Activo",
            notas: taskToApprove.details.notes,
            registradoPor: currentUser,
          }
          addAssignment(newAssignment)
          addRecentActivity({
            type: "Asignación de Producto",
            description: `Se aprobó la asignación de "${assignedItem.nombre}" (SN: ${assignedItem.numeroSerie || "N/A"}) a "${taskToApprove.details.assignedTo}".`,
            date: currentDateTime,
            details: taskToApprove.details,
          })
        }
        break;
      case "PRESTAMO":
        const lentItem = inventoryData.find(
          (item) =>
            item.id === taskToApprove.details.productId &&
            item.numeroSerie === taskToApprove.details.productSerialNumber,
        )
        if (lentItem) {
          updateInventoryItem(lentItem.id, { estado: "Prestado" })
          const newLoan: Loan = {
            id: Math.max(...prestamosData.map((p) => p.id), 0) + 1,
            articuloId: lentItem.id,
            nombre: lentItem.nombre,
            numeroSerie: lentItem.numeroSerie,
            prestadoA: taskToApprove.details.lentToName,
            fechaPrestamo: new Date().toISOString().split("T")[0],
            fechaDevolucion: taskToApprove.details.returnDate,
            estado: "Activo",
            diasRestantes: Math.ceil(
              (new Date(taskToApprove.details.returnDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
            ),
            notas: taskToApprove.details.notes,
            registradoPor: currentUser,
          }
          addLoan(newLoan)
          addRecentActivity({
            type: "Préstamo de Producto",
            description: `Se aprobó el préstamo de "${lentItem.nombre}" (SN: ${lentItem.numeroSerie || "N/A"}) a "${taskToApprove.details.lentToName}".`,
            date: currentDateTime,
            details: taskToApprove.details,
          })
        }
        break;
      default:
        // Otros tipos de tareas
        addRecentActivity({
          type: `Aprobación de ${taskToApprove.type}`,
          description: `Tarea de tipo "${taskToApprove.type}" aprobada.`,
          date: currentDateTime,
          details: { taskId: taskToApprove.id, taskType: taskToApprove.type, taskDetails: taskToApprove.details },
        })
        break;
    }

    // Actualizar estado de la tarea
    updatePendingTask(taskToApprove.id, {
      status: "Finalizada",
      auditLog: [
        ...(taskToApprove.auditLog || []),
        {
          event: "APROBACIÓN",
          user: currentUser,
          dateTime: currentDateTime,
          description: `Tarea aprobada por ${currentUser}.`,
        },
      ],
    })

    showInfo({
      title: "Tarea Aprobada",
      description: `La tarea de ${taskToApprove.type?.toLowerCase() || ""} ha sido aprobada.`,
    })

    setIsApproveConfirmOpen(false)
    setTaskToApprove(null)
  }

  // Lógica de confirmación para rechazo de tareas
  const confirmReject = () => {
    if (!taskToReject) return

    const currentUser = user?.nombre || "Sistema"
    const currentDateTime = new Date().toLocaleString()

    updatePendingTask(taskToReject.id, {
      status: "Cancelada",
      auditLog: [
        ...(taskToReject.auditLog || []),
        {
          event: "CANCELACIÓN",
          user: currentUser,
          dateTime: currentDateTime,
          description: `Tarea cancelada por ${currentUser}.`,
        },
      ],
    })

    addRecentActivity({
      type: "Rechazo de Tarea",
      description: `Tarea "${taskToReject.type}" (ID: ${taskToReject.id}) rechazada.`,
      date: currentDateTime,
      details: { taskId: taskToReject.id, taskType: taskToReject.type, taskDetails: taskToReject.details },
    })

    showInfo({
      title: "Tarea Rechazada",
      description: `La tarea "${taskToReject.type}" ha sido rechazada.`,
    })

    setIsRejectConfirmOpen(false)
    setTaskToReject(null)
  }

  // Función para renderizar los detalles de la tarea según su tipo
  const renderTaskDetails = (task: PendingTask) => {
    switch (task.type) {
      case "CARGA":
        return `Carga de ${task.details?.productName || ""} (x${task.details?.quantity || 0})`;
      case "RETIRO":
        return `Retiro de ${task.details?.itemsImplicados?.[0]?.name || "múltiples artículos"}`;
      case "ASIGNACION":
        return `Asignación de ${task.details?.productName || ""} a ${task.details?.assignedTo || ""}`;
      case "PRESTAMO":
        return `Préstamo de ${task.details?.productName || ""} a ${task.details?.lentToName || ""}`;
      case "Reactivación":
        return `Reactivación de ${task.details?.productName || ""}`;
      case "Creación de Producto":
        return `Creación de ${task.details?.nombre || ""}`;
      case "Edición de Producto":
        return `Edición de ${task.details?.updates?.nombre || task.details?.id || ""}`;
      case "Duplicación de Producto":
        return `Duplicación de ${task.details?.originalProduct?.nombre || ""}`;
      default:
        return task.details?.description || "Sin detalles";
    }
  };

  // Añadir la función handleAddTask que falta
  const handleAddTask = () => {
    showInfo({
      title: "Funcionalidad en desarrollo",
      description: "La creación manual de tareas estará disponible próximamente."
    });
    // Implementación futura: abrir modal para crear nueva tarea
  };

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground mb-6">
        Gestiona las tareas pendientes del sistema
      </div>

      {/* Search Bar and Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar tarea..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAuditLogSheetOpen(true)}>
            <Eye className="mr-2 h-4 w-4" /> Ver Registro
          </Button>
          <Button onClick={handleAddTask} className="bg-primary hover:bg-primary-hover">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Estado</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {allTaskStatuses.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={filters.status === status}
                      onCheckedChange={() => setFilters({ ...filters, status: status })}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Tipo</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {allTaskTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={filters.type === type}
                      onCheckedChange={() => setFilters({ ...filters, type: type })}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort("type")} className="cursor-pointer">
                Tipo
                {getSortIcon("type")}
              </TableHead>
              <TableHead className="cursor-pointer">
                Detalles
              </TableHead>
              <TableHead onClick={() => requestSort("status")} className="cursor-pointer">
                Estado
                {getSortIcon("status")}
              </TableHead>
              <TableHead onClick={() => requestSort("createdBy")} className="cursor-pointer">
                Solicitado Por
                {getSortIcon("createdBy")}
              </TableHead>
              <TableHead onClick={() => requestSort("creationDate")} className="cursor-pointer">
                Fecha Creación
                {getSortIcon("creationDate")}
              </TableHead>
              <TableHead className="w-[150px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <EmptyState
                    title="No hay tareas pendientes"
                    description="No se encontraron tareas que coincidan con los criterios de búsqueda."
                  />
                </TableCell>
              </TableRow>
            ) : (
              sortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.type}</TableCell>
                  <TableCell>{renderTaskDetails(task)}</TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>{task.createdBy}</TableCell>
                  <TableCell>{new Date(task.creationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewAuditLog(task)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver Auditoría</span>
                      </Button>
                      {task.status === "Pendiente" && canApproveOrCancel && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleApproveTask(task)}>
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Aprobar</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRejectTask(task)}>
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Rechazar</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modales y Sheets */}
      {selectedTask && (
        <EditTaskSheet
          open={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          task={selectedTask}
        />
      )}

      <ConfirmationDialogForEditor
        open={isApproveConfirmOpen}
        onOpenChange={setIsApproveConfirmOpen}
        onConfirm={confirmApprove}
        title="Confirmar Aprobación"
        description={`¿Estás seguro de que deseas aprobar la tarea? Esta acción actualizará el inventario.`}
        confirmText="Sí, Aprobar"
        cancelText="No, Cancelar"
      />

      <ConfirmationDialogForEditor
        open={isRejectConfirmOpen}
        onOpenChange={setIsRejectConfirmOpen}
        onConfirm={confirmReject}
        title="Confirmar Rechazo"
        description={`¿Estás seguro de que deseas rechazar la tarea? Esta acción no se puede deshacer.`}
        confirmText="Sí, Rechazar"
        cancelText="No, Cancelar"
      />

      {selectedTask && (
        <TaskAuditLogSheet
          open={isAuditLogSheetOpen}
          onOpenChange={setIsAuditLogSheetOpen}
          task={selectedTask}
        />
      )}

      {/* Modales para tipos específicos de tareas - Simplificados para evitar errores de tipo */}
      {selectedTask?.type === "ASIGNACION" && (
        <AssignModal
          open={isAssignModalOpen}
          onOpenChange={setIsAssignModalOpen}
        />
      )}

      {selectedTask?.type === "PRESTAMO" && (
        <LendModal
          open={isLendModalOpen}
          onOpenChange={setIsLendModalOpen}
        />
      )}

      {selectedTask?.type === "RETIRO" && (
        <RetireProductModal
          open={isRetireProductModalOpen}
          onOpenChange={setIsRetireProductModalOpen}
        />
      )}
    </div>
  )
}
