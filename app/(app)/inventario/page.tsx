"use client"

import { useState, useEffect, useReducer, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"
import {
  Plus,
  Upload,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Loader2,
  ExternalLink,
  Edit,
  Eye,
  Copy,
  UserPlus,
  Trash2,
  Calendar,
  RotateCcw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns,
  LayoutList,
  LayoutGrid,
  X,
  Badge,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AssignModal } from "@/components/assign-modal"
import { LendModal } from "@/components/lend-modal"
import { BulkEditModal } from "@/components/bulk-edit-modal"
import { BulkAssignModal } from "@/components/bulk-assign-modal"
import { BulkLendModal } from "@/components/bulk-lend-modal"
import { BulkRetireModal } from "@/components/bulk-retire-modal"
import { BrandCombobox } from "@/components/brand-combobox"
import { EmptyState } from "@/components/empty-state"
import { useApp } from "@/contexts/app-context"
import { ConfirmationDialogForEditor } from "@/components/confirmation-dialog-for-editor"
import { ActionMenu } from "@/components/action-menu"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import DocumentManager from "@/components/document-manager"
import { GroupedInventoryTable } from '@/components/inventory/grouped-inventory-table';
import { mockInventoryData } from '@/lib/mocks/inventory-mock-data';


// Definición de interfaces para tipar correctamente
interface InventoryItem {
  id: number
  nombre: string
  marca: string
  modelo: string
  categoria: string
  estado: "Disponible" | "Asignado" | "Prestado" | "Retirado" | "En Mantenimiento" | "PENDIENTE_DE_RETIRO"
  cantidad: number
  numeroSerie: string | null
  descripcion?: string
  proveedor?: string | null
  fechaAdquisicion?: string | null
  contratoId?: string | null
  fechaIngreso?: string
  costo?: number
  fechaCompra?: string
  garantia?: string
  vidaUtil?: string
  mantenimiento?: string
  historialMantenimiento?: { date: string; description: string }[]
  documentosAdjuntos?: { name: string; url: string }[]
}

interface AssignmentItem {
  numeroSerie: string
  estado: string
  asignadoA: string
  fechaAsignacion: string
}

interface AssignmentDetails {
  asignadoA: string | null
  fechaAsignacion: string | null
}

interface QtyBreakdown {
  total: number
  available: number
  unavailable: number
  assigned: number
  lent: number
  maintenance: number
  pendingRetire: number
}

interface PendingActionDetails {
  type: string
  productData?: any
  originalProductId?: number
  productId?: number
  productName?: string
  productSerialNumber?: string | null
}

interface ColumnDefinition {
  id: string
  label: string
  defaultVisible: boolean
  sortable: boolean
  fixed?: "start" | "end"
}

// Define all possible columns and their properties
const allColumns: ColumnDefinition[] = [
  { id: "nombre", label: "Nombre", defaultVisible: true, sortable: true, fixed: "start" },
  { id: "marca", label: "Marca", defaultVisible: true, sortable: true },
  { id: "modelo", label: "Modelo", defaultVisible: true, sortable: true },
  { id: "numeroSerie", label: "N/S", defaultVisible: true, sortable: true },
  { id: "categoria", label: "Categoría", defaultVisible: true, sortable: true },
  { id: "estado", label: "Estado", defaultVisible: true, sortable: true },
  { id: "proveedor", label: "Proveedor", defaultVisible: false, sortable: true }, // New
  { id: "fechaAdquisicion", label: "Fecha Adquisición", defaultVisible: false, sortable: true }, // New
  { id: "contratoId", label: "Contrato ID", defaultVisible: false, sortable: true }, // New
  { id: "asignadoA", label: "Asignado A", defaultVisible: false, sortable: true }, // New (derived)
  { id: "fechaAsignacion", label: "Fecha Asignación", defaultVisible: false, sortable: true }, // New (derived)
  { id: "qty", label: "QTY", defaultVisible: true, sortable: false, fixed: "end" },
]

export default function InventarioPage() {
  const { state, dispatch: appDispatch } = useApp()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Definir el reducer local para manejar acciones específicas del componente
  const inventoryReducer = (state: any, action: any) => {
    switch (action.type) {
      case "REFRESH_INVENTORY":
        // Esta acción simplemente desencadena una actualización del estado local
        return { ...state, lastRefresh: Date.now() };
      default:
        return state;
    }
  };

  // Usar useReducer para manejar acciones locales
  const [localState, dispatch] = useReducer(inventoryReducer, { lastRefresh: Date.now() });

  // Reemplazar la constante ITEMS_PER_PAGE por un estado
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    const userId = state.user?.id;
    const pageId = "inventario";

    // Obtener de preferencias de usuario si están disponibles
    if (userId &&
      state.userColumnPreferences &&
      Array.isArray(state.userColumnPreferences) &&
      state.userColumnPreferences.some(pref => pref.page === pageId)) {
      const userPrefs = state.userColumnPreferences.find(pref => pref.page === pageId);
      if (userPrefs && userPrefs.itemsPerPage) {
        return userPrefs.itemsPerPage;
      }
    }
    // Valor por defecto
    return 25;
  });

  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([])
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)
  const [modalMode, setModalMode] = useState<"add" | "edit" | "duplicate" | "process-carga">("add")
  const [isLoading, setIsLoading] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [showImportProgress, setShowImportProgress] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [filterCategoria, setFilterCategoria] = useState(searchParams.get("categoria") || "")
  const [filterMarca, setFilterMarca] = useState(searchParams.get("marca") || "")
  const [filterEstado, setFilterEstado] = useState(searchParams.get("estado") || "")
  const [hasSerialNumber, setHasSerialNumber] = useState(false)
  // Estado para las pestañas del formulario de edición
  const [activeFormTab, setActiveFormTab] = useState<"basic" | "details" | "documents">("basic")
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isLendModalOpen, setIsLendModalOpen] = useState(false)
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false)
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false)
  const [isBulkLendModalOpen, setIsBulkLendModalOpen] = useState(false)
  const [isBulkRetireModalOpen, setIsBulkRetireModalOpen] = useState(false)
  const [isConfirmEditorOpen, setIsConfirmEditorOpen] = useState(false)
  const [pendingActionDetails, setPendingActionDetails] = useState<PendingActionDetails | null>(null)
  const [processingTaskId, setProcessingTaskId] = useState<number | null>(null)
  const [tempMarca, setTempMarca] = useState("")
  const [isProcessingUrlParam, setIsProcessingUrlParam] = useState(false)
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false)
  const [maintenanceDetails, setMaintenanceDetails] = useState({
    provider: "",
    notes: "",
    productId: 0
  })
  const [retirementDetails, setRetirementDetails] = useState({
    reason: "",
    date: new Date().toISOString().split("T")[0],
    disposalMethod: "",
    notes: "",
    finalDestination: ""
  })
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [attachedDocuments, setAttachedDocuments] = useState<{ id: string, name: string, url: string, uploadDate: string }[]>([]);
  // Añadir estado para el modo de visualización
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Lista de motivos de retiro
  const retirementReasons = [
    "Obsolescencia",
    "Daño Irreparable",
    "Extravío",
    "Venta",
    "Donación",
    "Otro"
  ]

  // Column visibility state, loaded from user preferences or default
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const userId = state.user?.id
    const pageId = "inventario"

    // Si el usuario está identificado y existe una preferencia para la página de inventario
    if (userId &&
      state.userColumnPreferences &&
      Array.isArray(state.userColumnPreferences) &&
      state.userColumnPreferences.some(pref => pref.page === pageId)) {
      const userPrefs = state.userColumnPreferences.find(pref => pref.page === pageId)
      if (userPrefs && userPrefs.preferences) {
        return userPrefs.preferences.filter(p => p.visible).map(p => p.id)
      }
    }

    // Si no hay preferencias, usar los valores por defecto
    return allColumns.filter((col) => col.defaultVisible).map((col) => col.id)
  })

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")



  // Handle URL params for processing tasks
  useEffect(() => {
    const processCargaTaskId = searchParams.get("processCargaTaskId")
    const highlightRetireTask = searchParams.get("highlightRetireTask")

    if (isProcessingUrlParam) return

    if (processCargaTaskId) {
      setIsProcessingUrlParam(true)
      const taskId = Number.parseInt(processCargaTaskId)
      const task = state.pendingTasksData.find((t) => t.id === taskId && t.type === "CARGA")
      if (task) {
        const productData: Partial<InventoryItem> = {
          id: 0, // Este ID será reemplazado al guardar
          nombre: task.details.productName || "",
          cantidad: task.details.quantity || 1,
          numeroSerie: task.details.serialNumbers ? task.details.serialNumbers.join("\n") : null,
          marca: task.details.brand || "",
          modelo: task.details.model || "",
          categoria: task.details.category || "",
          descripcion: task.details.description || "",
          estado: "Disponible"
        };
        setSelectedProduct(productData as InventoryItem);
        setTempMarca(task.details.brand || "")
        setModalMode("process-carga")
        setHasSerialNumber(!!task.details.serialNumbers && task.details.serialNumbers.length > 0)
        setIsAddProductModalOpen(true)
        setProcessingTaskId(taskId)
        router.replace("/inventario", { scroll: false })
      }
      setTimeout(() => setIsProcessingUrlParam(false), 100)
    } else if (highlightRetireTask) {
      setIsProcessingUrlParam(true)
      const taskId = Number.parseInt(highlightRetireTask)
      const task = state.pendingTasksData.find((t) => t.id === taskId && t.type === "RETIRO")
      if (task && task.details.itemsImplicados) {
        setSelectedRowIds(task.details.itemsImplicados.map((item: any) => item.id))
        showInfo({
          title: "Tarea de Retiro Pendiente",
          description: `Artículos de la tarea #${taskId} seleccionados para completar el retiro.`,
        })
        router.replace("/inventario", { scroll: false })
      }
      setTimeout(() => setIsProcessingUrlParam(false), 100)
    }
  }, [searchParams, state.pendingTasksData, router, isProcessingUrlParam])

  // Añadir función para limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterCategoria("");
    setFilterMarca("");
    setFilterEstado("");
    setCurrentPage(1); // Volver a la primera página al limpiar filtros
  };

  // Actualizar URL con filtros
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (filterCategoria && filterCategoria !== "all") params.set("categoria", filterCategoria)
    if (filterMarca && filterMarca !== "all") params.set("marca", filterMarca)
    if (filterEstado && filterEstado !== "all") params.set("estado", filterEstado)

    const newUrl = params.toString() ? `?${params.toString()}` : ""
    router.replace(`/inventario${newUrl}`, { scroll: false })
  }, [searchTerm, filterCategoria, filterMarca, filterEstado, router])

  // Save column preferences when they change
  useEffect(() => {
    if (state.user?.id) {
      dispatch({
        type: 'UPDATE_USER_COLUMN_PREFERENCES',
        payload: {
          userId: state.user.id,
          pageId: "inventario",
          columns: visibleColumns
        }
      })
    }
  }, [visibleColumns, state.user?.id, dispatch])

  // Sorting logic
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnId)
      setSortDirection("asc")
    }
  }

  // Helper to get current assignee/assignment date for a serialized item
  const getAssignmentDetails = (item: InventoryItem): AssignmentDetails => {
    if (item.numeroSerie) {
      const activeAssignment = state.asignadosData.find(
        (a) => a.numeroSerie === item.numeroSerie && a.estado === "Activo",
      )
      if (activeAssignment) {
        return {
          asignadoA: activeAssignment.asignadoA,
          fechaAsignacion: activeAssignment.fechaAsignacion,
        }
      }
    }
    return { asignadoA: null, fechaAsignacion: null }
  }

  // Función segura para obtener valores de columnas
  const getColumnValue = (item: InventoryItem, columnId: string): string | number => {
    switch (columnId) {
      case "nombre":
        return item.nombre;
      case "marca":
        return item.marca;
      case "modelo":
        return item.modelo;
      case "categoria":
        return item.categoria;
      case "estado":
        return item.estado;
      case "numeroSerie":
        return item.numeroSerie || "";
      case "proveedor":
        return item.proveedor || "";
      case "fechaAdquisicion":
        return item.fechaAdquisicion || "";
      case "contratoId":
        return item.contratoId || "";
      case "fechaIngreso":
        return item.fechaIngreso || "";
      case "cantidad":
        return item.cantidad;
      default:
        return "";
    }
  };

  // Filtrar y ordenar datos
  const sortedAndFilteredData = useMemo(() => {
    let data = state.inventoryData.filter((item) => {
      const matchesSearch = searchTerm === "" || (
        (item.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.marca?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.modelo?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.numeroSerie && item.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.proveedor && item.proveedor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.contratoId && item.contratoId.toLowerCase().includes(searchTerm.toLowerCase()))
      )

      const matchesCategoria = !filterCategoria || filterCategoria === "" || filterCategoria === "all" || filterCategoria === "__all__" || item.categoria === filterCategoria
      const matchesMarca = !filterMarca || filterMarca === "" || filterMarca === "all" || filterMarca === "__all__" || item.marca === filterMarca
      const matchesEstado = !filterEstado || filterEstado === "" || filterEstado === "all" || filterEstado === "__all__" || item.estado === filterEstado

      return matchesSearch && matchesCategoria && matchesMarca && matchesEstado
    })

    if (sortColumn) {
      data = [...data].sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        // Handle special cases for sorting derived columns
        if (sortColumn === "asignadoA") {
          aValue = getAssignmentDetails(a).asignadoA || ""
          bValue = getAssignmentDetails(b).asignadoA || ""
        } else if (sortColumn === "fechaAsignacion") {
          aValue = getAssignmentDetails(a).fechaAsignacion || ""
          bValue = getAssignmentDetails(b).fechaAsignacion || ""
        } else {
          aValue = getColumnValue(a, sortColumn);
          bValue = getColumnValue(b, sortColumn);
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }
        return 0
      })
    }
    return data
  }, [
    state.inventoryData,
    state.asignadosData, // Dependency for derived columns
    searchTerm,
    filterCategoria,
    filterMarca,
    filterEstado,
    sortColumn,
    sortDirection,
  ])

  // Paginación
  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedAndFilteredData.slice(startIndex, endIndex)

  const selectedProducts = state.inventoryData.filter((item) => selectedRowIds.includes(item.id))

  const handleRowSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRowIds((prev) => [...prev, id])
    } else {
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(paginatedData.map((item) => item.id))
    } else {
      setSelectedRowIds([])
    }
  }

  const handleViewDetails = (product: InventoryItem) => {
    setSelectedProduct(product)
    setIsDetailSheetOpen(true)
  }

  const handleEdit = (product: InventoryItem) => {
    setSelectedProduct(product)
    setModalMode("edit")
    setHasSerialNumber(!!product.numeroSerie)
    setTempMarca(product.marca)
    setIsAddProductModalOpen(true)
  }

  const handleDuplicate = (product: InventoryItem) => {
    setSelectedProduct(product)
    setModalMode("duplicate")
    setHasSerialNumber(!!product.numeroSerie)
    setTempMarca(product.marca)
    setIsAddProductModalOpen(true)
  }

  const handleMarkAsRetired = (product: InventoryItem) => {
    setSelectedProduct(product)
    setIsConfirmDialogOpen(true)
  }

  const executeReactivate = (product: InventoryItem) => {
    appDispatch({
      type: 'UPDATE_INVENTORY_ITEM_STATUS',
      payload: { id: product.id, status: "Disponible" }
    })
    appDispatch({
      type: 'ADD_RECENT_ACTIVITY',
      payload: {
        type: "Reactivación",
        description: `${product.nombre} reactivado`,
        date: new Date().toLocaleString(),
        details: { product: { id: product.id, name: product.nombre, serial: product.numeroSerie } },
      }
    })
    showSuccess({
      title: "Producto reactivado",
      description: `${product.nombre} ha sido reactivado y está disponible.`,
    })
  }

  const handleReactivate = (product: InventoryItem) => {
    if (state.user?.rol === "Editor") {
      setPendingActionDetails({
        type: "Reactivación",
        productId: product.id,
        productName: product.nombre,
        productSerialNumber: product.numeroSerie,
      })
      setIsConfirmEditorOpen(true)
      return
    }
    executeReactivate(product)
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setModalMode("add")
    setHasSerialNumber(false)
    setTempMarca("")
    setIsAddProductModalOpen(true)
  }

  const executeSaveProduct = (productData: Partial<InventoryItem>) => {
    // Toast de autoguardado inmediato
    showInfo({
      title: "Guardando cambios...",
      description: "Sincronizando datos con el servidor"
    })

    // Simulation logic remains the same
    setTimeout(() => {
      let newInventory = [...state.inventoryData]

      if (modalMode === "add") {
        // Add new product
        const newId = Math.max(...state.inventoryData.map((item) => item.id)) + 1
        const newProduct = {
          id: newId,
          fechaIngreso: new Date().toISOString().split("T")[0],
          ...productData,
        } as InventoryItem

        newInventory = [...state.inventoryData, newProduct]
        showSuccess({
          title: "Producto añadido",
          description: `${productData.nombre} ha sido añadido al inventario exitosamente.`,
        })
        appDispatch({
          type: 'ADD_RECENT_ACTIVITY',
          payload: {
            type: "Creación de Producto",
            description: `Producto "${productData.nombre}" creado`,
            date: new Date().toLocaleString(),
            details: newProduct,
          }
        })
      } else if (modalMode === "edit") {
        // Edit existing product
        const originalProduct = state.inventoryData.find((item) => item.id === selectedProduct?.id)
        newInventory = state.inventoryData.map((item) =>
          item.id === selectedProduct?.id
            ? {
              ...item,
              ...productData,
            }
            : item,
        )

        // Toast mejorado con información de cambios
        showSuccess({
          title: "Producto actualizado",
          description: `Cambios guardados para "${productData.nombre || originalProduct?.nombre}"`
        })
        appDispatch({
          type: 'ADD_RECENT_ACTIVITY',
          payload: {
            type: "Edición de Producto",
            description: `Producto "${productData.nombre || originalProduct?.nombre}" actualizado`,
            date: new Date().toLocaleString(),
            details: { originalProduct, updatedProduct: productData },
          }
        })
      } else if (modalMode === "duplicate") {
        // Duplicate product
        const newId = Math.max(...state.inventoryData.map((item) => item.id)) + 1
        const duplicatedProduct = {
          ...productData,
          id: newId,
          estado: "Disponible" as const,
          numeroSerie: null, // Reset serial number for duplicated items
          fechaIngreso: new Date().toISOString().split("T")[0],
        } as InventoryItem

        newInventory = [...state.inventoryData, duplicatedProduct]
        showSuccess({
          title: "Producto duplicado",
          description: `Se ha creado una copia de "${productData.nombre}".`,
        })
        appDispatch({
          type: 'ADD_RECENT_ACTIVITY',
          payload: {
            type: "Duplicación de Producto",
            description: `Producto "${productData.nombre}" duplicado`,
            date: new Date().toLocaleString(),
            details: duplicatedProduct,
          }
        })
      } else if (modalMode === "process-carga") {
        // Process pending task
        if (processingTaskId) {
          const task = state.tareasData.find((t) => t.id === processingTaskId)
          if (!task) return

          const newId = Math.max(...state.inventoryData.map((item) => item.id)) + 1
          const newProduct = {
            id: newId,
            nombre: task.details.productName,
            marca: task.details.brand || "Sin marca",
            modelo: task.details.model || "Sin modelo",
            categoria: task.details.category || "Sin categoría",
            descripcion: task.details.description || "",
            estado: "Disponible" as const,
            cantidad: task.details.quantity,
            numeroSerie: task.details.serialNumbers?.[0] || null,
            fechaIngreso: new Date().toISOString().split("T")[0],
            proveedor: task.details.proveedor || null,
            fechaAdquisicion: task.details.fechaAdquisicion || null,
            contratoId: task.details.contratoId || null,
          } as InventoryItem

          newInventory = [...state.inventoryData, newProduct]

          // Remove the processed task
          const updatedTasks = state.tareasData.filter((t) => t.id !== processingTaskId)
          appDispatch({
            type: 'UPDATE_PENDING_TASK',
            payload: {
              id: processingTaskId,
              updates: {
                status: "Finalizada",
                auditLog: [
                  ...(state.pendingTasksData.find((t) => t.id === processingTaskId)?.auditLog || []),
                  {
                    event: "FINALIZACIÓN",
                    user: state.user?.nombre || "Sistema",
                    dateTime: new Date().toISOString(),
                    description: `Tarea de carga procesada y producto añadido/actualizado en inventario.`,
                  },
                ],
              }
            }
          })

          showSuccess({
            title: "Tarea procesada exitosamente",
            description: `El producto "${task.details.productName}" ha sido añadido al inventario.`,
          })
          appDispatch({
            type: 'ADD_RECENT_ACTIVITY',
            payload: {
              type: "Procesamiento de Tarea",
              description: `Tarea #${processingTaskId} procesada: "${task.details.productName}" añadido`,
              date: new Date().toLocaleString(),
              details: { taskId: processingTaskId, newProduct },
            }
          })
        }
      }

      appDispatch({
        type: 'UPDATE_INVENTORY',
        payload: newInventory
      })
      setIsAddProductModalOpen(false)
      setSelectedProduct(null)
      setProcessingTaskId(null)
      setIsLoading(false)
      setModalMode("add")
      setActiveFormTab("basic")
      setTempMarca("")
      setHasSerialNumber(false)
      // Clear form data after successful save
      const form = document.getElementById("product-form") as HTMLFormElement
      if (form) {
        form.reset()
      }
    }, 1200) // Ligeramente más tiempo para mostrar el progreso
  }

  const handleSaveProduct = async () => {
    setIsLoading(true)
    const form = document.getElementById("product-form") as HTMLFormElement
    const formData = new FormData(form)

    // Verificar campos obligatorios independientemente de la pestaña activa
    const nombre = formData.get("nombre") as string || selectedProduct?.nombre
    const marca = tempMarca || selectedProduct?.marca
    const modelo = formData.get("modelo") as string || selectedProduct?.modelo
    const categoria = formData.get("categoria") as string || selectedProduct?.categoria

    if (!nombre || !marca || !modelo || !categoria) {
      showError({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios (Nombre, Marca, Modelo y Categoría).",
      })
      setIsLoading(false)
      // Cambiar a la pestaña básica si hay campos faltantes
      setActiveFormTab("basic")
      return
    }

    const productData = {
      nombre: nombre,
      marca: marca,
      modelo: modelo,
      categoria: categoria,
      descripcion: formData.get("descripcion") as string,
      estado: selectedProduct?.estado || "Disponible",
      cantidad: hasSerialNumber ? 1 : Number.parseInt(formData.get("cantidad") as string) || 1,
      numeroSerie: hasSerialNumber ? (formData.get("numerosSerie") as string) || null : null,
      proveedor: (formData.get("proveedor") as string) || null,
      fechaAdquisicion: (formData.get("fechaAdquisicion") as string) || null,
      contratoId: (formData.get("contratoId") as string) || null,
      costo: formData.get("costo") ? parseFloat(formData.get("costo") as string) : undefined,
      garantia: (formData.get("garantia") as string) || undefined,
      vidaUtil: (formData.get("vidaUtil") as string) || undefined
    }

    if (state.user?.rol === "Editor") {
      // Removed modalMode !== "process-carga" condition
      setPendingActionDetails({
        type:
          modalMode === "add"
            ? "Creación de Producto"
            : modalMode === "edit"
              ? "Edición de Producto"
              : "Duplicación de Producto",
        productData: productData,
        originalProductId: selectedProduct?.id,
      })
      setIsConfirmEditorOpen(true)
      setIsLoading(false)
      return
    }

    executeSaveProduct(productData)
  }

  const handleImportCSV = () => {
    setShowImportProgress(true)
    setImportProgress(0)

    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setShowImportProgress(false)
            setIsImportModalOpen(false)
            appDispatch({ type: 'UPDATE_INVENTORY', payload: state.inventoryData }) // Trigger re-render with current data
            showSuccess({
              title: "Importación completada",
              description: "Se han importado 25 productos exitosamente.",
            })
            appDispatch({
              type: 'ADD_RECENT_ACTIVITY',
              payload: {
                type: "Importación CSV",
                description: "Se importaron 25 productos",
                date: new Date().toLocaleString(),
                details: { count: 25 },
              }
            })
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const executeRetirement = () => {
    // Validar que se haya seleccionado un motivo
    if (!retirementDetails.reason) {
      showError({
        title: "Error",
        description: "Debe seleccionar un motivo para el retiro.",
      })
      return
    }

    appDispatch({
      type: 'UPDATE_INVENTORY_ITEM_STATUS',
      payload: { id: selectedProduct!.id, status: "Retirado" }
    })
    appDispatch({
      type: 'ADD_RECENT_ACTIVITY',
      payload: {
        type: "Retiro de Producto",
        description: `${selectedProduct?.nombre} retirado por ${retirementDetails.reason}`,
        date: new Date().toLocaleString(),
        details: {
          product: { id: selectedProduct!.id, name: selectedProduct!.nombre, serial: selectedProduct!.numeroSerie },
          retirementDetails: retirementDetails
        },
      }
    })
    showSuccess({
      title: "Producto retirado",
      description: `${selectedProduct?.nombre} ha sido marcado como retirado.`,
    })
    setIsConfirmDialogOpen(false) // Ensure dialog is closed
    setSelectedProduct(null) // Clear selected product
  }

  const confirmRetirement = () => {
    if (state.user?.rol === "Editor") {
      setPendingActionDetails({
        type: "Retiro de Producto",
        productId: selectedProduct.id,
        productName: selectedProduct.nombre,
        productSerialNumber: selectedProduct.numeroSerie,
      })
      setIsConfirmEditorOpen(true)
      return
    }
    executeRetirement()
  }

  const getModalTitle = () => {
    switch (modalMode) {
      case "add":
        return "Añadir Producto"
      case "edit":
        return "Editar Producto"
      case "duplicate":
        return "Duplicar Producto"
      case "process-carga":
        return "Procesar Tarea de Carga"
      default:
        return "Producto"
    }
  }

  const handleAssign = (product: InventoryItem) => {
    setSelectedProduct(product)
    setIsAssignModalOpen(true)
  }

  const handleLend = (product: InventoryItem) => {
    setSelectedProduct(product)
    setIsLendModalOpen(true)
  }

  const handleBulkSuccess = () => {
    setSelectedRowIds([])
    // Usar dispatch local para refrescar el inventario
    dispatch({ type: "REFRESH_INVENTORY" })
  }

  const handleConfirmEditorAction = () => {
    if (pendingActionDetails) {
      appDispatch({
        type: 'ADD_PENDING_REQUEST',
        payload: {
          id: Math.floor(Math.random() * 1000),
          type: pendingActionDetails.type as any, // Cast para evitar errores de tipo
          requestedBy: state.user?.nombre || "Editor",
          date: new Date().toISOString(),
          status: "Pendiente",
          details: pendingActionDetails,
        }
      });

      appDispatch({
        type: 'ADD_RECENT_ACTIVITY',
        payload: {
          type: "Solicitud",
          description: `Solicitud de ${pendingActionDetails.type.toLowerCase()} enviada a administrador`,
          date: new Date().toLocaleString(),
          details: pendingActionDetails,
        }
      });

      setIsConfirmEditorOpen(false)

      if (pendingActionDetails.type === "Asignación") {
        setIsAssignModalOpen(false)
      } else if (pendingActionDetails.type === "Préstamo") {
        setIsLendModalOpen(false)
      }
    }
  }

  const isLector = state.user?.rol === "Lector" // Corregido según PRD

  // Function to calculate available and unavailable quantities for non-serialized items
  const getNonSerializedQtyBreakdown = (item: InventoryItem): QtyBreakdown | null => {
    if (item.numeroSerie !== null) return null

    let totalAvailable = 0
    let totalUnavailable = 0
    let assignedCount = 0
    let lentCount = 0
    let maintenanceCount = 0
    let pendingRetireCount = 0
    let totalInInventory = 0

    const allInstances = state.inventoryData.filter(
      (invItem) => invItem.nombre === item.nombre && invItem.modelo === item.modelo && invItem.numeroSerie === null,
    )

    allInstances.forEach((instance) => {
      if (instance.estado !== "Retirado") {
        totalInInventory += instance.cantidad
      }

      if (instance.estado === "Disponible") {
        totalAvailable += instance.cantidad
      } else if (instance.estado === "Asignado") {
        assignedCount += instance.cantidad
        totalUnavailable += instance.cantidad
      } else if (instance.estado === "Prestado") {
        lentCount += instance.cantidad
        totalUnavailable += instance.cantidad
      } else if (instance.estado === "En Mantenimiento") {
        maintenanceCount += instance.cantidad
        totalUnavailable += instance.cantidad
      } else if (instance.estado === "PENDIENTE_DE_RETIRO") {
        pendingRetireCount += instance.cantidad
        totalUnavailable += instance.cantidad
      }
    })

    return {
      total: totalInInventory,
      available: totalAvailable,
      unavailable: totalUnavailable,
      assigned: assignedCount,
      lent: lentCount,
      maintenance: maintenanceCount,
      pendingRetire: pendingRetireCount,
    }
  }

  // Get status-based color class for serialized items
  const getSerializedQtyColorClass = (status: string) => {
    switch (status) {
      case "Disponible":
        return "text-status-disponible"
      case "Prestado":
        return "text-status-prestado"
      case "Asignado":
        return "text-status-asignado"
      case "En Mantenimiento": // Updated status name
        return "text-status-mantenimiento"
      case "PENDIENTE_DE_RETIRO":
        return "text-status-pendiente-de-retiro"
      case "Retirado":
        return "text-status-retirado"
      default:
        return "text-muted-foreground"
    }
  }

  const canShowBulkActions = selectedRowIds.length > 0 && state.user?.rol !== "Lector" // Corregido según PRD

  // Función para manejar el cambio a estado de mantenimiento
  const handleMaintenanceState = (product: InventoryItem) => {
    setMaintenanceDetails({
      provider: "",
      notes: "",
      productId: product.id
    })
    setIsMaintenanceModalOpen(true)
  }

  // Función para ejecutar el cambio de estado a mantenimiento
  const executeMaintenanceChange = () => {
    if (!maintenanceDetails.provider.trim()) {
      showError({
        title: "Error",
        description: "Debe especificar un proveedor de mantenimiento.",
      })
      return
    }

    appDispatch({
      type: 'UPDATE_INVENTORY_ITEM_STATUS',
      payload: { id: maintenanceDetails.productId, status: "En Mantenimiento" }
    })

    appDispatch({
      type: 'ADD_RECENT_ACTIVITY',
      payload: {
        type: "Cambio a Mantenimiento",
        description: `Producto enviado a mantenimiento con ${maintenanceDetails.provider}`,
        date: new Date().toLocaleString(),
        details: {
          productId: maintenanceDetails.productId,
          provider: maintenanceDetails.provider,
          notes: maintenanceDetails.notes
        },
      }
    })

    showSuccess({
      title: "Producto en mantenimiento",
      description: "El producto ha sido marcado como en mantenimiento.",
    })

    setIsMaintenanceModalOpen(false)
  }

  // Función simulada para subir documentos
  const handleFileUpload = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      showError({
        title: "Error",
        description: "Seleccione al menos un archivo para subir.",
      });
      return;
    }

    // Simulación de subida
    setUploadingFiles(true);

    setTimeout(() => {
      const newDocs = Array.from(selectedFiles).map(file => ({
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString().split('T')[0]
      }));

      setAttachedDocuments(prev => [...prev, ...newDocs]);
      setSelectedFiles(null);
      setUploadingFiles(false);

      showSuccess({
        title: "Documentos subidos",
        description: `Se han subido ${newDocs.length} documento(s) correctamente.`
      });
    }, 2000);
  };

  // Asegurarse de que localState.lastRefresh se use como dependencia para refrescar datos
  useEffect(() => {
    // Aquí podrías realizar alguna acción cuando se refresca el inventario
    // Por ejemplo, actualizar filtros, resetear selecciones, etc.
  }, [localState.lastRefresh]);

  const allCategories = useMemo(() => {
    const categories = new Set((state.inventoryData || []).map((p) => p.categoria).filter(Boolean))
    return [...Array.from(categories).sort()]
  }, [state.inventoryData])

  const allBrands = useMemo(() => {
    const brands = new Set((state.inventoryData || []).map((p) => p.marca).filter(Boolean))
    return [...Array.from(brands).sort()]
  }, [state.inventoryData])

  const allStatuses = useMemo(() => {
    const statuses = new Set((state.inventoryData || []).map((p) => p.estado).filter(Boolean))
    return [...Array.from(statuses).sort()]
  }, [state.inventoryData])

  if (sortedAndFilteredData.length === 0 && !searchTerm && !filterCategoria && !filterMarca && !filterEstado) {
    return (
      <EmptyState
        title="No hay productos en el inventario"
        description="Comienza añadiendo productos a tu inventario."
        action={
          <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary-hover">
            <Plus className="mr-2 h-4 w-4" />
            Añadir Producto
          </Button>
        }
      />
    )
  }

  const SortIcon = ({ columnId }: { columnId: string }) => {
    if (sortColumn !== columnId) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
    }
    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
  }

  // Filter columns to display based on visibility state
  const displayedColumns = useMemo(() => {
    const fixedStart = allColumns.find((col) => col.fixed === "start")
    const fixedEnd = allColumns.find((col) => col.fixed === "end")
    const otherColumns = allColumns.filter((col) => visibleColumns.includes(col.id) && !col.fixed)

    // Ensure fixed columns are always present and in correct order
    let finalColumns = []
    if (fixedStart) finalColumns.push(allColumns.find((col) => col.fixed === "start")!)
    finalColumns = [...finalColumns, ...otherColumns]
    if (fixedEnd) finalColumns.push(allColumns.find((col) => col.fixed === "end")!)

    return finalColumns
  }, [visibleColumns])

  const handleColumnToggle = (columnId: string, checked: boolean) => {
    const column = allColumns.find((col) => col.id === columnId)
    if (column?.fixed) return // Prevent toggling fixed columns

    setVisibleColumns((prev) => (checked ? [...prev, columnId] : prev.filter((id) => id !== columnId)))
  }

  const handleViewModeChange = (mode: "table" | "cards") => {
    if (viewMode !== mode) {
      setViewMode(mode)
    }
  }

  const filteredProducts = useMemo(() => {
    return (state.inventoryData || []).filter((product) => {
      const matchesSearch = searchTerm === "" || (
        (product.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (product.marca?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (product.modelo?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (product.numeroSerie && product.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.proveedor && product.proveedor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.contratoId && product.contratoId.toLowerCase().includes(searchTerm.toLowerCase()))
      )

      const matchesCategoria = !filterCategoria || filterCategoria === "" || filterCategoria === "all" || filterCategoria === "__all__" || product.categoria === filterCategoria
      const matchesMarca = !filterMarca || filterMarca === "" || filterMarca === "all" || filterMarca === "__all__" || product.marca === filterMarca
      const matchesEstado = !filterEstado || filterEstado === "" || filterEstado === "all" || filterEstado === "__all__" || product.estado === filterEstado

      return matchesSearch && matchesCategoria && matchesMarca && matchesEstado
    })
  }, [searchTerm, filterCategoria, filterMarca, filterEstado, state.inventoryData])

  return (
    <TooltipProvider>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header con título y botones de acción */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
            <p className="text-muted-foreground mt-1">
              Gestión centralizada de activos de TI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddProduct}
              className="bg-primary hover:bg-primary-hover"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Añadir Producto
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkRetireModalOpen(true)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Retirar Selección
            </Button>
          </div>
        </div>

        {/* Card de filtros y acciones */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[240px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, marca, modelo, serie..."
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                    {(filterCategoria || filterMarca || filterEstado) && (
                      <Badge variant="secondary" className="ml-2 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
                        {[filterCategoria, filterMarca, filterEstado].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium leading-none">Filtros</h4>
                      {(filterCategoria || filterMarca || filterEstado) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="h-8 flex items-center text-muted-foreground hover:text-foreground"
                        >
                          Limpiar filtros
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Filtra los productos por categoría, marca o estado
                    </p>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="filterCategoria">Categoría</Label>
                        <div className="col-span-2 relative">
                          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Todas</SelectItem>
                              {allCategories.map((categoria) => (
                                <SelectItem key={categoria} value={categoria}>
                                  {categoria}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="filterMarca">Marca</Label>
                        <div className="col-span-2 relative">
                          <Select value={filterMarca} onValueChange={setFilterMarca}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Todas</SelectItem>
                              {allBrands.map((marca) => (
                                <SelectItem key={marca} value={marca}>
                                  {marca}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="filterEstado">Estado</Label>
                        <div className="col-span-2 relative">
                          <Select value={filterEstado} onValueChange={setFilterEstado}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Todos</SelectItem>
                              {allStatuses.map((estado) => (
                                <SelectItem key={estado} value={estado}>
                                  {estado}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Mostrar filtros activos en forma de badges */}
              {(filterCategoria || filterMarca || filterEstado) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Filtros activos:</span>
                  {filterCategoria && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Categoría: {filterCategoria}
                      <button onClick={() => setFilterCategoria("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filterMarca && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Marca: {filterMarca}
                      <button onClick={() => setFilterMarca("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filterEstado && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Estado: {filterEstado}
                      <button onClick={() => setFilterEstado("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {(filterCategoria || filterMarca || filterEstado) && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 px-2">
                      Limpiar todos
                    </Button>
                  )}
                </div>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Columns className="mr-2 h-4 w-4" />
                    Columnas
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Mostrar Columnas</p>
                    {allColumns.map((column) => (
                      <div key={column.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`col-${column.id}`}
                          checked={visibleColumns.includes(column.id)}
                          onCheckedChange={(checked) => handleColumnToggle(column.id, checked as boolean)}
                          disabled={!!column.fixed} // Disable fixed columns
                        />
                        <label
                          htmlFor={`col-${column.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {column.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {/* Botones para cambiar el modo de visualización */}
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-none ${viewMode === "table" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => handleViewModeChange("table")}
                >
                  <LayoutList className="h-4 w-4 mr-1" />
                  Tabla
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-none ${viewMode === "cards" ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => handleViewModeChange("cards")}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Tarjetas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {canShowBulkActions && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{selectedRowIds.length} producto(s) seleccionado(s)</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setIsBulkEditModalOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Selección
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsBulkAssignModalOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Asignar Selección
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsBulkLendModalOpen(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Prestar Selección
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsBulkRetireModalOpen(true)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Retirar Selección
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table or Cards View based on viewMode */}
        {sortedAndFilteredData.length === 0 ? (
          <EmptyState
            title="No se encontraron productos"
            description="Intenta ajustar los filtros o términos de búsqueda para encontrar lo que buscas."
          />
        ) : viewMode === "table" ? (
          <>
            {/*
            <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {!isLector && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRowIds.length === paginatedData.length && paginatedData.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                    )}
                    {displayedColumns.map((column) => (
                      <TableHead
                        key={column.id}
                        className={cn(column.sortable && "cursor-pointer")}
                        onClick={() => column.sortable && handleSort(column.id)}
                      >
                        <div className="flex items-center">
                          {column.label} {column.sortable && <SortIcon columnId={column.id} />}
                        </div>
                      </TableHead>
                    ))}
                    {!isLector && <TableHead className="w-12">Acciones</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => {
                    const isUnavailableForActions =
                      item.estado === "Prestado" || item.estado === "En Mantenimiento" || item.estado === "Asignado"
                    const isRetired = item.estado === "Retirado"
                    const isPendingRetire = item.estado === "PENDIENTE_DE_RETIRO"

                    const qtyBreakdown = getNonSerializedQtyBreakdown(item)
                    const assignmentDetails = getAssignmentDetails(item) // Get assignment details

                    const actions = [
                      {
                        label: "Ver Detalles",
                        onClick: () => handleViewDetails(item),
                        icon: Eye,
                      },
                      {
                        label: "Editar",
                        onClick: () => handleEdit(item),
                        disabled: isPendingRetire,
                        tooltip: isPendingRetire ? "No se puede editar un artículo pendiente de retiro." : undefined,
                        icon: Edit,
                      },
                      {
                        label: "Duplicar",
                        onClick: () => handleDuplicate(item),
                        disabled: isPendingRetire,
                        tooltip: isPendingRetire
                          ? "No se puede duplicar un artículo pendiente de retiro."
                          : undefined,
                        icon: Copy,
                      },
                      ...(isRetired
                        ? [
                          {
                            label: "Reactivar Artículo",
                            onClick: () => handleReactivate(item),
                            icon: RotateCcw,
                          },
                        ]
                        : [
                          {
                            label: "Asignar...",
                            onClick: () => handleAssign(item),
                            disabled: isUnavailableForActions || isPendingRetire,
                            tooltip:
                              isUnavailableForActions || isPendingRetire
                                ? "No se puede asignar un artículo en este estado."
                                : undefined,
                            icon: UserPlus,
                          },
                          {
                            label: "Prestar...",
                            onClick: () => handleLend(item),
                            disabled: isUnavailableForActions || isPendingRetire,
                            tooltip:
                              isUnavailableForActions || isPendingRetire
                                ? "No se puede prestar un artículo en este estado."
                                : undefined,
                            icon: Calendar,
                          },
                          {
                            label: "Marcar como Retirado",
                            onClick: () => handleMarkAsRetired(item),
                            destructive: true,
                            disabled: isUnavailableForActions || isPendingRetire,
                            tooltip:
                              isUnavailableForActions || isPendingRetire
                                ? "No se puede retirar un artículo en este estado."
                                : undefined,
                            icon: Trash2,
                          },
                        ]),
                    ]

                    return (
                      <TableRow key={item.id}>
                        {!isLector && (
                          <TableCell>
                            <Checkbox
                              checked={selectedRowIds.includes(item.id)}
                              onCheckedChange={(checked) => handleRowSelect(item.id, checked as boolean)}
                            />
                          </TableCell>
                        )}
                        {displayedColumns.map((column) => (
                          <TableCell
                            key={column.id}
                            className={cn(
                              column.id === "nombre" && "font-medium",
                              column.id === "numeroSerie" && "font-mono text-sm",
                            )}
                          >
                            {column.id === "nombre" && item.nombre}
                            {column.id === "marca" && item.marca}
                            {column.id === "modelo" && item.modelo}
                            {column.id === "numeroSerie" && (item.numeroSerie || "N/A")}
                            {column.id === "categoria" && item.categoria}
                            {column.id === "estado" && <StatusBadge status={item.estado} />}
                            {column.id === "proveedor" && (item.proveedor || "N/A")}
                            {column.id === "fechaAdquisicion" && (item.fechaAdquisicion || "N/A")}
                            {column.id === "contratoId" && (item.contratoId || "N/A")}
                            {column.id === "asignadoA" && (assignmentDetails.asignadoA || "N/A")}
                            {column.id === "fechaAsignacion" && (assignmentDetails.fechaAsignacion || "N/A")}
                            {column.id === "qty" &&
                              (item.numeroSerie !== null ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span
                                      className={cn("font-bold text-lg", getSerializedQtyColorClass(item.estado))}
                                    >
                                      1
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>1 {item.estado}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : qtyBreakdown ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="flex items-baseline gap-1">
                                      {qtyBreakdown.available === qtyBreakdown.total ? (
                                        <span className="qty-available">{qtyBreakdown.total}</span>
                                      ) : qtyBreakdown.available === 0 ? (
                                        <>
                                          <span className="qty-total">{qtyBreakdown.total}</span>
                                          <span className="qty-unavailable">{qtyBreakdown.unavailable}</span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="qty-total">{qtyBreakdown.total}</span>
                                          <span className="qty-available">{qtyBreakdown.available}</span>
                                          <span className="qty-unavailable">{qtyBreakdown.unavailable}</span>
                                        </>
                                      )}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="p-3">
                                    <div className="space-y-2">
                                      <div className="font-bold text-foreground">
                                        Inventario Total: {qtyBreakdown.total}
                                      </div>
                                      <hr className="border-t border-gray-200" />
                                      <div className="space-y-1">
                                        <div className="text-status-disponible">
                                          Disponibles: {qtyBreakdown.available}
                                        </div>
                                        {qtyBreakdown.assigned > 0 && (
                                          <div className="text-status-asignado ml-4">
                                            Asignados: {qtyBreakdown.assigned}
                                          </div>
                                        )}
                                        {qtyBreakdown.lent > 0 && (
                                          <div className="text-status-prestado ml-4">
                                            Prestados: {qtyBreakdown.lent}
                                          </div>
                                        )}
                                        {qtyBreakdown.maintenance > 0 && (
                                          <div className="text-status-mantenimiento ml-4">
                                            Mantenimiento: {qtyBreakdown.maintenance}
                                          </div>
                                        )}
                                        {qtyBreakdown.pendingRetire > 0 && (
                                          <div className="text-status-pendiente-de-retiro ml-4">
                                            Pendientes de Retiro: {qtyBreakdown.pendingRetire}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                item.cantidad
                              ))}
                          </TableCell>
                        ))}
                        {!isLector && (
                          <TableCell>
                            <ActionMenu actions={actions} />
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          */}
            {/* --- INICIO DE NUESTRO INJERTO DE PRUEBA --- */}
            <Card>
              <CardContent className="p-0">
                <p className="p-4 text-sm text-blue-500">MODO DE PRUEBA: Mostrando tabla nueva con datos mockeados.</p>
                <GroupedInventoryTable
                  data={mockInventoryData}
                  searchQuery={""}
                  visibleColumns={{
                    marca: true,
                    modelo: true,
                    numeroSerie: true,
                    estado: true,
                  }}
                  selectedRowIds={[]}
                  onRowSelect={() => { }}
                  onSelectAll={() => { }}
                  onAction={() => { }}
                  isLector={false}
                />
              </CardContent>
            </Card>
            {/* --- FIN DE NUESTRO INJERTO DE PRUEBA --- */}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg truncate">{item.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{item.marca} {item.modelo}</p>
                      </div>
                      <StatusBadge status={item.estado} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Categoría</p>
                        <p>{item.categoria}</p>
                      </div>
                      {item.numeroSerie ? (
                        <div>
                          <p className="text-muted-foreground">N/S</p>
                          <p className="truncate">{item.numeroSerie}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-muted-foreground">Cantidad</p>
                          <p>{item.cantidad}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t p-2 bg-muted/30 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Detalles
                    </Button>
                    {!isLector && (
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginación */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
              <span className="font-medium">{Math.min(endIndex, sortedAndFilteredData.length)}</span> de{" "}
              <span className="font-medium">{sortedAndFilteredData.length}</span> resultados
            </p>
          </div>
          <div className="flex items-center space-x-6">
            {/* Selector de ítems por página */}
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Ítems por página:</p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  const newItemsPerPage = parseInt(value);
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1); // Resetear a la primera página

                  // Guardar en preferencias de usuario
                  if (state.user?.id) {
                    appDispatch({
                      type: 'UPDATE_USER_COLUMN_PREFERENCES',
                      payload: {
                        userId: state.user.id,
                        pageId: "inventario",
                        columns: visibleColumns,
                        itemsPerPage: newItemsPerPage
                      }
                    });
                  }
                }}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="25" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="250">250</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Página anterior</span>
              </Button>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Página {currentPage} de {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Página siguiente</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Modal: Add/Edit Product */}
        <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{getModalTitle()}</DialogTitle>
              <DialogDescription>
                {modalMode === "add"
                  ? "Añade un nuevo producto al inventario."
                  : modalMode === "edit"
                    ? "Modifica la información del producto existente."
                    : modalMode === "duplicate"
                      ? "Duplica un producto existente con nuevos datos."
                      : "Procesa la tarea de carga completando la información del producto."}
              </DialogDescription>
            </DialogHeader>
            <form
              id="product-form"
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveProduct()
              }}
            >
              {/* Pestañas para organizar el formulario */}
              <Tabs value={activeFormTab} onValueChange={(value) => setActiveFormTab(value as "basic" | "details" | "documents")}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Información Básica</TabsTrigger>
                  <TabsTrigger value="details">Detalles Técnicos</TabsTrigger>
                  <TabsTrigger value="documents">Documentación</TabsTrigger>
                </TabsList>

                {/* Pestaña: Información Básica */}
                <TabsContent value="basic">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-right">
                          Nombre del Producto <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          defaultValue={selectedProduct?.nombre || ""}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="marca" className="text-right">
                          Marca <span className="text-red-500">*</span>
                        </Label>
                        <BrandCombobox
                          value={tempMarca}
                          onValueChange={setTempMarca}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="modelo" className="text-right">
                          Modelo <span className="text-red-500">*</span>
                        </Label>
                        <Input id="modelo" name="modelo" defaultValue={selectedProduct?.modelo || ""} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoria" className="text-right">
                          Categoría <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          name="categoria"
                          defaultValue={selectedProduct?.categoria || ""}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {state.categorias.map((categoria) => (
                              <SelectItem key={categoria} value={categoria}>
                                {categoria}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                          id="descripcion"
                          name="descripcion"
                          defaultValue={selectedProduct?.descripcion || ""}
                          rows={3}
                          placeholder="Descripción opcional del producto"
                        />
                      </div>

                      <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="hasSerial"
                            checked={hasSerialNumber}
                            onCheckedChange={setHasSerialNumber}
                            disabled={modalMode === "process-carga"}
                          />
                          <Label htmlFor="hasSerial" className="flex items-center gap-1">
                            Este artículo tiene número de serie
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3 w-3" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Activa esta opción si cada unidad del producto tiene un número de serie único que debe ser
                                  rastreado individualmente.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                        </div>

                        {!hasSerialNumber ? (
                          <div className="space-y-2">
                            <Label htmlFor="cantidad">Cantidad</Label>
                            <Input
                              id="cantidad"
                              name="cantidad"
                              type="number"
                              defaultValue={selectedProduct?.cantidad || "1"}
                              min="1"
                              readOnly={modalMode === "process-carga"}
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label htmlFor="numerosSerie" className="flex items-center gap-1">
                              Números de Serie
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Ingrese un número de serie por línea para crear múltiples artículos individuales</p>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <Textarea
                              id="numerosSerie"
                              name="numerosSerie"
                              rows={4}
                              defaultValue={selectedProduct?.numeroSerie || ""}
                              placeholder="Ingrese un número de serie por línea&#10;Ejemplo:&#10;SN123456789&#10;SN987654321"
                              readOnly={modalMode === "edit" || modalMode === "process-carga"}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pestaña: Detalles Técnicos */}
                <TabsContent value="details">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="proveedor">Proveedor</Label>
                        <Input id="proveedor" name="proveedor" defaultValue={selectedProduct?.proveedor || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fechaAdquisicion">Fecha de Adquisición</Label>
                        <Input
                          id="fechaAdquisicion"
                          name="fechaAdquisicion"
                          type="date"
                          defaultValue={selectedProduct?.fechaAdquisicion || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contratoId">ID de Contrato</Label>
                        <Input id="contratoId" name="contratoId" defaultValue={selectedProduct?.contratoId || ""} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="costo">Costo de Adquisición</Label>
                        <Input
                          id="costo"
                          name="costo"
                          type="number"
                          defaultValue={selectedProduct?.costo || ""}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="garantia">Garantía (hasta)</Label>
                        <Input
                          id="garantia"
                          name="garantia"
                          type="date"
                          defaultValue={selectedProduct?.garantia || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vidaUtil">Vida Útil (hasta)</Label>
                        <Input
                          id="vidaUtil"
                          name="vidaUtil"
                          type="date"
                          defaultValue={selectedProduct?.vidaUtil || ""}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pestaña: Documentación */}
                <TabsContent value="documents">
                  <DocumentManager
                    productId={selectedProduct?.id || 0}
                    productName={selectedProduct?.nombre || "Producto"}
                    userRole={state.user?.rol === "Administrador" ? "admin" : state.user?.rol === "Editor" ? "editor" : "lector"}
                    currentUserId={state.user?.nombre || "usuario"}
                    maxFiles={10}
                  />
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-hover">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal: Import CSV */}
        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Importar desde CSV
              </DialogTitle>
              <DialogDescription>Selecciona un archivo CSV para importar productos al inventario.</DialogDescription>
            </DialogHeader>
            {!showImportProgress ? (
              <div className="grid gap-4 py-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="csvFile">Archivo CSV</Label>
                  <Input id="csvFile" type="file" accept=".csv" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>El archivo debe contener las columnas: nombre, marca, modelo, categoría, descripción.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Progreso de importación</Label>
                  <Progress value={importProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">{importProgress}% completado</p>
                </div>
              </div>
            )}
            {!showImportProgress && (
              <DialogFooter>
                <Button onClick={handleImportCSV} className="bg-primary hover:bg-primary-hover">
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog for Retirement */}
        <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <AlertDialogContent className="max-w-[600px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Retirar Producto</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Seguro que desea retirar el producto <strong>{selectedProduct?.nombre}</strong>
                {selectedProduct?.numeroSerie ? ` con N/S ${selectedProduct.numeroSerie}` : ""}?
                <br />
                Esta acción cambiará el estado del producto a 'Retirado'.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="retirement-reason">Motivo del Retiro *</Label>
                <Select
                  value={retirementDetails.reason}
                  onValueChange={(value) => setRetirementDetails({ ...retirementDetails, reason: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {retirementReasons.map(reason => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retirement-date">Fecha de Retiro *</Label>
                <Input
                  type="date"
                  id="retirement-date"
                  value={retirementDetails.date}
                  onChange={(e) => setRetirementDetails({ ...retirementDetails, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disposal-method">Método de Disposición</Label>
                <Input
                  id="disposal-method"
                  placeholder="Ej: Desecho electrónico, Reciclaje"
                  value={retirementDetails.disposalMethod}
                  onChange={(e) => setRetirementDetails({ ...retirementDetails, disposalMethod: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="final-destination">Destino Final</Label>
                <Input
                  id="final-destination"
                  placeholder="Ej: Almacén de desechos"
                  value={retirementDetails.finalDestination}
                  onChange={(e) => setRetirementDetails({ ...retirementDetails, finalDestination: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="retirement-notes">Notas de Retiro</Label>
                <Textarea
                  id="retirement-notes"
                  placeholder="Detalles adicionales del retiro"
                  value={retirementDetails.notes}
                  onChange={(e) => setRetirementDetails({ ...retirementDetails, notes: e.target.value })}
                />
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onClick={executeRetirement}
                  variant="destructive"
                  disabled={!retirementDetails.reason || !retirementDetails.date}
                >
                  Retirar
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Product Detail Sheet */}
        <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
          <SheetContent className="md:max-w-xl lg:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Detalles del Producto</SheetTitle>
            </SheetHeader>

            {selectedProduct && (
              <div className="space-y-6 mt-4">
                {/* Tabs para organizar la información */}
                <Tabs defaultValue="general">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="documents">Documentos</TabsTrigger>
                    <TabsTrigger value="history">Historial</TabsTrigger>
                    <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
                  </TabsList>

                  {/* Tab: Información General */}
                  <TabsContent value="general" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nombre</p>
                        <p className="font-medium">{selectedProduct.nombre}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Marca</p>
                        <p className="font-medium">{selectedProduct.marca}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Modelo</p>
                        <p className="font-medium">{selectedProduct.modelo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Categoría</p>
                        <p className="font-medium">{selectedProduct.categoria}</p>
                      </div>
                      {selectedProduct.numeroSerie && (
                        <div>
                          <p className="text-sm text-muted-foreground">Número de Serie</p>
                          <p className="font-medium">{selectedProduct.numeroSerie}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Estado</p>
                        <StatusBadge status={selectedProduct.estado} />
                      </div>
                      {selectedProduct.proveedor && (
                        <div>
                          <p className="text-sm text-muted-foreground">Proveedor</p>
                          <p className="font-medium">{selectedProduct.proveedor}</p>
                        </div>
                      )}
                      {selectedProduct.fechaAdquisicion && (
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha de Adquisición</p>
                          <p className="font-medium">{selectedProduct.fechaAdquisicion}</p>
                        </div>
                      )}
                      {/* Usar acceso seguro para propiedades opcionales */}
                      {selectedProduct.contratoId && (
                        <div>
                          <p className="text-sm text-muted-foreground">Contrato ID</p>
                          <p className="font-medium">{selectedProduct.contratoId}</p>
                        </div>
                      )}
                      {selectedProduct.fechaIngreso && (
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                          <p className="font-medium">{selectedProduct.fechaIngreso}</p>
                        </div>
                      )}
                    </div>

                    {selectedProduct.descripcion && (
                      <div>
                        <p className="text-sm text-muted-foreground">Descripción</p>
                        <p className="mt-1">{selectedProduct.descripcion}</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Tab: Documentos */}
                  <TabsContent value="documents" className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Documentos Adjuntos</h3>

                      {attachedDocuments.length > 0 ? (
                        <div className="space-y-2">
                          {attachedDocuments.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-2 border rounded bg-muted/30">
                              <div className="flex items-center">
                                <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm font-medium">{doc.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={doc.url} target="_blank" rel="noopener noreferrer">Ver</a>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay documentos adjuntos para este producto.</p>
                      )}

                      {/* Subir nuevo documento */}
                      <div className="mt-4">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={(e) => setSelectedFiles(e.target.files)}
                            disabled={uploadingFiles}
                          />
                          <Button
                            onClick={handleFileUpload}
                            disabled={!selectedFiles || uploadingFiles}
                            className="whitespace-nowrap"
                          >
                            {uploadingFiles ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Subiendo...
                              </>
                            ) : (
                              "Subir"
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Formatos permitidos: PDF, DOCX. Tamaño máximo: 100MB.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tab: Historial */}
                  <TabsContent value="history" className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Historial de Actividades</h3>

                      {/* Filtrar actividades relacionadas con este producto */}
                      {(() => {
                        const productActivities = state.recentActivities.filter(activity =>
                          (activity.details?.productId === selectedProduct.id) ||
                          (activity.details?.product?.id === selectedProduct.id)
                        );

                        return productActivities.length > 0 ? (
                          <div className="space-y-2">
                            {productActivities.map((activity, index) => (
                              <div key={index} className="p-2 border rounded bg-muted/30">
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium">{activity.description}</p>
                                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">{activity.type}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No hay actividades registradas para este producto.</p>
                        );
                      })()}
                    </div>
                  </TabsContent>

                  {/* Tab: Mantenimiento */}
                  <TabsContent value="maintenance" className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Historial de Mantenimiento</h3>

                      {selectedProduct && selectedProduct.historialMantenimiento && selectedProduct.historialMantenimiento.length > 0 ? (
                        <div className="space-y-2">
                          {selectedProduct.historialMantenimiento.map((entry, index) => (
                            <div key={index} className="p-2 border rounded bg-muted/30">
                              <div className="flex justify-between">
                                <p className="text-sm font-medium">{entry.description}</p>
                                <p className="text-xs text-muted-foreground">{entry.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay registros de mantenimiento para este producto.</p>
                      )}

                      {/* Verificar que el producto no esté ya en mantenimiento antes de mostrar el botón */}
                      {selectedProduct && selectedProduct.estado !== "En Mantenimiento" && (
                        <Button
                          onClick={() => handleMaintenanceState(selectedProduct)}
                          className="mt-4"
                        >
                          Enviar a Mantenimiento
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Modals */}
        <AssignModal
          open={isAssignModalOpen}
          onOpenChange={setIsAssignModalOpen}
          product={selectedProduct}
          onSuccess={() => dispatch({ type: "REFRESH_INVENTORY" })}
        />

        <LendModal
          open={isLendModalOpen}
          onOpenChange={setIsLendModalOpen}
          product={selectedProduct}
          onSuccess={() => dispatch({ type: "REFRESH_INVENTORY" })}
        />

        <BulkEditModal
          open={isBulkEditModalOpen}
          onOpenChange={setIsBulkEditModalOpen}
          selectedProductIds={selectedRowIds}
          onSuccess={handleBulkSuccess}
        />

        <BulkAssignModal
          open={isBulkAssignModalOpen}
          onOpenChange={setIsBulkAssignModalOpen}
          selectedProducts={selectedProducts}
          onSuccess={handleBulkSuccess}
        />

        <BulkLendModal
          open={isBulkLendModalOpen}
          onOpenChange={setIsBulkLendModalOpen}
          selectedProducts={selectedProducts}
          onSuccess={handleBulkSuccess}
        />

        <BulkRetireModal
          open={isBulkRetireModalOpen}
          onOpenChange={setIsBulkRetireModalOpen}
          selectedProducts={selectedProducts}
          onSuccess={handleBulkSuccess}
        />

        <ConfirmationDialogForEditor
          open={isConfirmEditorOpen}
          onOpenChange={setIsConfirmEditorOpen}
          onConfirm={handleConfirmEditorAction}
        />

        {/* Modal: Mantenimiento */}
        <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Mantenimiento</DialogTitle>
              <DialogDescription>
                Por favor, ingrese los detalles del mantenimiento.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                executeMaintenanceChange()
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Proveedor</Label>
                  <Input
                    id="provider"
                    name="provider"
                    value={maintenanceDetails.provider}
                    onChange={(e) => setMaintenanceDetails({ ...maintenanceDetails, provider: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={maintenanceDetails.notes}
                    onChange={(e) => setMaintenanceDetails({ ...maintenanceDetails, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-primary hover:bg-primary-hover">
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
