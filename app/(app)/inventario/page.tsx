"use client"

import { useState, useEffect, useReducer, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GroupedProduct, InventoryItem } from "@/types/inventory"
import { DetailSheet } from "@/components/detail-sheet"
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
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check } from "lucide-react"
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
import { ColumnToggleMenu } from '@/components/inventory/column-toggle-menu';
import { EditProductModal } from "@/components/edit-product-modal"
import { MaintenanceModal } from "@/components/maintenance-modal"


// El tipo InventoryItem ahora se importa desde @/types/inventory

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
  type?: 'string' | 'number' | 'date' | 'status';
  fixed?: "start" | "end"
}

// Define all possible columns and their properties
const allColumns: ColumnDefinition[] = [
  { id: "nombre", label: "Nombre", defaultVisible: true, sortable: true, fixed: "start", type: 'string' },
  { id: "marca", label: "Marca", defaultVisible: true, sortable: true, type: 'string' },
  { id: "modelo", label: "Modelo", defaultVisible: true, sortable: true, type: 'string' },
  { id: "numeroSerie", label: "N/S", defaultVisible: true, sortable: false },
  { id: "categoria", label: "Categoría", defaultVisible: true, sortable: true, type: 'string' },
  { id: "estado", label: "Estado", defaultVisible: true, sortable: true, type: 'status' },
  { id: "proveedor", label: "Proveedor", defaultVisible: false, sortable: true, type: 'string' },
  { id: "fechaAdquisicion", label: "Fecha Adquisición", defaultVisible: false, sortable: true, type: 'date' },
  { id: "contratoId", label: "Contrato ID", defaultVisible: false, sortable: false }, // New
  { id: "asignadoA", label: "Asignado A", defaultVisible: false, sortable: true, type: 'string' }, // New (derived)
  { id: "fechaAsignacion", label: "Fecha Asignación", defaultVisible: false, sortable: true, type: 'date' }, // New (derived)
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
  const selectedProductsData = useMemo(() => {
    return state.inventoryData.filter(item => selectedRowIds.includes(item.id));
  }, [selectedRowIds, state.inventoryData]);
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
  const [isReactivateConfirmOpen, setIsReactivateConfirmOpen] = useState(false)
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
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, string | null>>({});

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

  // Calcular si hay filtros activos
  const hasActiveFilters = filterCategoria || filterMarca || filterEstado || Object.values(advancedFilters).some(value => value);

  // Añadir función para limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterCategoria("");
    setFilterMarca("");
    setFilterEstado("");
    setAdvancedFilters({});
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
    setCurrentPage(1);
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
  const getColumnValue = (item: InventoryItem, columnId: string): string | number | null => {
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
        return item.proveedor || null;
      case "fechaAdquisicion":
        return item.fechaCompra || null;
      case "contratoId":
        return ""; // Not sortable yet
      case "fechaIngreso":
        return item.fechaIngreso || null;
      case "asignadoA":
        return getAssignmentDetails(item).asignadoA;
      case "fechaAsignacion":
        return getAssignmentDetails(item).fechaAsignacion;
      default:
        return null;
    }
  };

  // Unified filtering, sorting and grouping logic
  const groupedAndFilteredData: any[] = useMemo(() => { // <-- Usamos any[] temporalmente
    // 1. LÓGICA DE FILTRADO Y ORDENAMIENTO
    let data = state.inventoryData.filter((item: any) => { // <-- Usamos any
      const lowercasedQuery = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        (item.nombre?.toLowerCase().includes(lowercasedQuery)) ||
        (item.marca?.toLowerCase().includes(lowercasedQuery)) ||
        (item.modelo?.toLowerCase().includes(lowercasedQuery)) ||
        (item.numeroSerie && item.numeroSerie.toLowerCase().includes(lowercasedQuery));

      const matchesCategoria = !filterCategoria || item.categoria === filterCategoria;
      const matchesMarca = !filterMarca || item.marca === filterMarca;
      const matchesEstado = !filterEstado || item.estado === filterEstado;

      return matchesSearch && matchesCategoria && matchesMarca && matchesEstado;
    });



    // 2. LÓGICA DE AGRUPAMIENTO
    const productGroups: { [key: string]: any } = {};
    data.forEach((item: any) => { // <-- Usamos any
      const groupKey = `${item.marca}-${item.modelo}-${item.categoria}`;
      if (!productGroups[groupKey]) {
        productGroups[groupKey] = {
          isParent: true,
          product: {
            id: groupKey,
            nombre: item.nombre,
            marca: item.marca,
            modelo: item.modelo,
            categoria: item.categoria,
            isSerialized: !!item.numeroSerie
          },
          summary: { total: 0, disponible: 0, estados: {} },
          children: [],
        };
      }
      productGroups[groupKey].children.push(item);
      productGroups[groupKey].summary.total++;
      if (item.estado === 'Disponible') {
        productGroups[groupKey].summary.disponible++;
      }
      productGroups[groupKey].summary.estados[item.estado] = (productGroups[groupKey].summary.estados[item.estado] || 0) + 1;
    });

    let groupedData = Object.values(productGroups);

    if (sortColumn) {
      const getGroupStatus = (group: any) => {
        if (!group.isParent) return group.estado;
        if (group.summary.disponible > 0) return 'Disponible';
        const firstChildStatus = group.children[0]?.estado;
        return firstChildStatus || 'Retirado';
      };

      const getGroupValue = (group: any, column: string) => {
        if (column === 'estado') {
          return getGroupStatus(group);
        }
        // Para otras columnas, obtenemos el valor del 'product' del grupo
        return group.product?.[column];
      };

      groupedData.sort((a, b) => {
        const aValue = getGroupValue(a, sortColumn);
        const bValue = getGroupValue(b, sortColumn);

        const columnConfig = allColumns.find(c => c.id === sortColumn);
        const sortType = columnConfig ? columnConfig.type : 'string';

        const statusOrder: { [key: string]: number } = {
          'Disponible': 1, 'Asignado': 2, 'Prestado': 3, 'En Mantenimiento': 4, 'PENDIENTE_DE_RETIRO': 5, 'Retirado': 6
        };

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        let comparison = 0;

        switch (sortType) {
          case 'number':
            comparison = (aValue as number) - (bValue as number);
            break;
          case 'date':
            const dateA = new Date(aValue as string).getTime();
            const dateB = new Date(bValue as string).getTime();
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;
            comparison = dateA - dateB;
            break;
          case 'status':
            comparison = (statusOrder[aValue as string] || 99) - (statusOrder[bValue as string] || 99);
            break;
          default: // 'string'
            comparison = String(aValue).localeCompare(String(bValue));
            break;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return groupedData;

  }, [state.inventoryData, searchTerm, filterCategoria, filterMarca, filterEstado, sortColumn, sortDirection]);

  // Datos paginados para la tabla
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return groupedAndFilteredData.slice(startIndex, endIndex);
  }, [groupedAndFilteredData, currentPage, itemsPerPage]);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(groupedAndFilteredData.length / itemsPerPage);

  const selectedProducts = state.inventoryData.filter((item) => selectedRowIds.includes(item.id))

  const handleRowSelect = (id: number, checked: boolean) => {
    // En nuestra nueva tabla, el ID que recibimos siempre es de un 'InventoryItem' (un hijo)
    setSelectedRowIds((prev) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((rowId) => rowId !== id);
      }
    });
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Aplanamos todos los hijos de los grupos filtrados y obtenemos sus IDs
      const allVisibleIds = groupedAndFilteredData.flatMap(group => group.children.map(child => child.id));
      setSelectedRowIds(allVisibleIds);
    } else {
      setSelectedRowIds([]);
    }
  }

  const handleParentRowSelect = (group: GroupedProduct, checked: boolean) => {
    const childIds = group.children.map((child: InventoryItem) => child.id);
    setSelectedRowIds(prev => {
      if (checked) {
        // Añade todos los IDs de los hijos que no estén ya en la lista
        const newIds = childIds.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      } else {
        // Elimina todos los IDs de los hijos de la lista
        return prev.filter(id => !childIds.includes(id));
      }
    });
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
    setSelectedProduct(product)

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

    setIsReactivateConfirmOpen(true)
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
          const task = state.pendingTasksData.find((t) => t.id === processingTaskId)
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
          const updatedTasks = state.pendingTasksData.filter((t) => t.id !== processingTaskId)
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
    // Validar que exista un producto seleccionado
    if (!selectedProduct) {
      showError({
        title: "Error",
        description: "No hay producto seleccionado para retirar.",
      })
      return
    }

    appDispatch({
      type: 'UPDATE_INVENTORY_ITEM_STATUS',
      payload: { id: selectedProduct.id, status: "Retirado" }
    })
    appDispatch({
      type: 'ADD_RECENT_ACTIVITY',
      payload: {
        type: "Retiro de Producto",
        description: `${selectedProduct.nombre} retirado`,
        date: new Date().toLocaleString(),
        details: {
          product: { id: selectedProduct.id, name: selectedProduct.nombre, serial: selectedProduct.numeroSerie },
        },
      }
    })
    showSuccess({
      title: "Producto retirado",
      description: `${selectedProduct.nombre} ha sido marcado como retirado.`,
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

  if (groupedAndFilteredData.length === 0 && !searchTerm && !filterCategoria && !filterMarca && !filterEstado) {
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
    setViewMode(mode);
  }

  // Manejador central para acciones de menú en la tabla anidada
  const handleMenuAction = (action: string, data: GroupedProduct | InventoryItem) => {
    console.log(`Ejecutando acción: ${action}`);

    const isGroup = 'isParent' in data && data.isParent;
    let targetItem: InventoryItem | undefined | null = null;

    // --- LÓGICA DE DECISIÓN MEJORADA ---
    if (isGroup) {
      // Si la acción es sobre un grupo...
      if (action === 'Retiro Rápido') {
        // Para retiro rápido, pasamos todo el grupo al modal.
        handleOpenQuickRetire(data);
        return; // Salimos de la función aquí.
      } else {
        // Para otras acciones (Asignar, Prestar), buscamos un hijo disponible.
        targetItem = data.children.find(child => child.estado === 'Disponible');
        if (!targetItem) {
          console.error(`Acción '${action}' falló: No hay unidades disponibles en el grupo.`);
          // Aquí podríamos usar showError() para notificar al usuario.
          return;
        }
      }
    } else {
      // Si la acción es sobre un hijo, ese es nuestro objetivo.
      targetItem = data as InventoryItem;
    }
    // --- FIN DE LA LÓGICA DE DECISIÓN ---

    // Si no tenemos un item válido a este punto, no hacemos nada.
    if (!targetItem) {
      console.error("No se pudo determinar un activo válido para la acción.");
      return;
    }

    // Router de acciones que ahora recibe un targetItem válido.
    switch (action) {
      case 'Asignar':
        handleAssign(targetItem);
        break;
      case 'Prestar':
        handleLend(targetItem);
        break;
      case 'Ver Detalles':
        handleViewDetails(targetItem);
        break;
      case 'Editar':
        handleEdit(targetItem);
        break;
      case 'Duplicar':
        handleDuplicate(targetItem);
        break;
      case 'Mover a Mantenimiento':
        handleMaintenanceState(targetItem);
        break;
      case 'Marcar como Retirado': // Para la acción de "Retiro Definitivo"
        handleMarkAsRetired(targetItem);
        break;
      case 'Reactivar':
        handleReactivate(targetItem);
        break;
      default:
        console.warn(`Acción no manejada: ${action}`);
    }
  };

  // --- COMPONENTE REUTILIZABLE PARA LOS POPOVERS DE FILTRO ---
  const FilterPopover = ({ title, options, selectedValue, onSelect }: {
    title: string,
    options: string[],
    selectedValue: string | null,
    onSelect: (value: string | null) => void
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{title}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Buscar ${title.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No se encontró.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => onSelect(option === selectedValue ? null : option)}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedValue === option ? "opacity-100" : "opacity-0")} />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

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
      <div className="space-y-4">
        {/* ... existing code ... */}

        {/* --- INICIO DE LA BARRA DE ACCIONES MASIVAS --- */}
        {selectedRowIds.length > 0 && (
          <div className="flex items-center gap-4 rounded-md border bg-muted p-2 text-sm text-muted-foreground mb-4">
            <div className="flex-1">
              {selectedRowIds.length} elemento(s) seleccionado(s).
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRowIds([])}>
              Limpiar selección
            </Button>
            {/* Botones de acciones masivas */}
            <Button
              size="sm"
              onClick={() => setIsBulkAssignModalOpen(true)}
            >
              Asignar Selección
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBulkRetireModalOpen(true)}
            >
              Retirar Selección
            </Button>
          </div>
        )}
        {/* --- FIN DE LA BARRA DE ACCIONES MASIVAS --- */}

        {/* Tabla anidada */}
        <Card>
          <CardHeader className="px-7">
            <div className="flex items-center justify-between gap-4">
              {/* Lado Izquierdo: Barra de Búsqueda */}
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre, marca, modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-sm"
                />
              </div>

              {/* Lado Derecho: Botones de Acción Globales */}
              <div className="flex items-center gap-2">
                <Button onClick={() => setIsAddProductModalOpen(true)}>
                  Añadir Producto
                </Button>
                <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                  Importar
                </Button>
                {selectedRowIds.length > 0 && (
                  <Button variant="destructive" onClick={() => setIsBulkRetireModalOpen(true)}>
                    Retirar Selección
                  </Button>
                )}
              </div>
            </div>

            {/* Fila Inferior: Filtros y Configuración de Vista */}
            <div className="flex items-center justify-between gap-2 pt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold">Filtros:</p>
                <FilterPopover
                  title="Categoría"
                  options={state.categorias}
                  selectedValue={filterCategoria || null}
                  onSelect={(value) => setFilterCategoria(value || "")}
                />
                <FilterPopover
                  title="Marca"
                  options={state.marcas}
                  selectedValue={filterMarca || null}
                  onSelect={(value) => setFilterMarca(value || "")}
                />
                <FilterPopover
                  title="Estado"
                  options={[...new Set(state.inventoryData.map(item => item.estado))]}
                  selectedValue={filterEstado || null}
                  onSelect={(value) => setFilterEstado(value || "")}
                />
              </div>
              <div className="flex items-center gap-2">
                <ColumnToggleMenu
                  columns={allColumns}
                  visibleColumns={Object.fromEntries(visibleColumns.map(id => [id, true]))}
                  onColumnVisibilityChange={(newColumns) => {
                    setVisibleColumns(Object.keys(newColumns).filter(key => newColumns[key]));
                  }}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Filtros Avanzados</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-4" align="start">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Filtros Avanzados</h4>
                      <p className="text-xs text-muted-foreground">Filtra por columnas visibles.</p>
                      {allColumns.filter(c => c.id === 'numeroSerie').map(column => (
                        visibleColumns.includes(column.id) ? (
                          <div key={column.id}>
                            <Label className="text-xs font-semibold">{column.label}</Label>
                            <FilterPopover
                              title={`Seleccionar ${column.label}`}
                              options={[...new Set(state.inventoryData.map(item => item.numeroSerie).filter(Boolean) as string[])]}
                              selectedValue={advancedFilters[column.id] || null}
                              onSelect={(value) => setAdvancedFilters(prev => ({ ...prev, [column.id]: value }))}
                            />
                          </div>
                        ) : null
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <ToggleGroup type="single" variant="outline" value={viewMode} onValueChange={setViewMode}>
                  <ToggleGroupItem value="table" aria-label="Vista de tabla">Tabla</ToggleGroupItem>
                  <ToggleGroupItem value="cards" aria-label="Vista de tarjetas">Tarjetas</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            { (filterCategoria || filterMarca || filterEstado) && (
  <div className="flex items-center gap-2 mb-4">
    <p className="text-sm text-muted-foreground">Filtros activos:</p>

    {filterCategoria && (
      <Badge variant="secondary" className="flex items-center gap-1">
        Categoría: {filterCategoria}
        <X
          className="h-3 w-3 cursor-pointer rounded-full hover:bg-muted-foreground/20"
          onClick={() => setFilterCategoria("")}
        />
      </Badge>
    )}

    {filterMarca && (
      <Badge variant="secondary" className="flex items-center gap-1">
        Marca: {filterMarca}
        <X
          className="h-3 w-3 cursor-pointer rounded-full hover:bg-muted-foreground/20"
          onClick={() => setFilterMarca("")}
        />
      </Badge>
    )}

    {filterEstado && (
      <Badge variant="secondary" className="flex items-center gap-1">
        Estado: {filterEstado}
        <X
          className="h-3 w-3 cursor-pointer rounded-full hover:bg-muted-foreground/20"
          onClick={() => setFilterEstado("")}
        />
      </Badge>
    )}

    <Button
      variant="ghost"
      size="sm"
      className="h-auto px-2 py-1 text-xs"
      onClick={() => {
        setFilterCategoria("");
        setFilterMarca("");
        setFilterEstado("");
      }}
    >
      Limpiar todos
    </Button>
  </div>
)}
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <GroupedInventoryTable
              data={paginatedData}
              searchQuery={searchTerm}
              columns={allColumns}
              visibleColumns={Object.fromEntries(visibleColumns.map(id => [id, true]))}
              selectedRowIds={selectedRowIds}
              onRowSelect={handleRowSelect}
              onSelectAll={handleSelectAll}
              onAction={handleMenuAction}
              isLector={isLector}
              onParentRowSelect={handleParentRowSelect}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          </CardContent>
          <CardFooter className="flex items-center justify-between py-4">
            <div className="text-xs text-muted-foreground">
              Mostrando {paginatedData.length} de {groupedAndFilteredData.length} productos agrupados.
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs">Items por página:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1); // Reset a la primera página al cambiar
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map(size => (
                      <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs font-medium">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* ... rest of the JSX ... */}
      </div>

      {/* --- INICIO DE MODALES DE ACCIONES MASIVAS --- */}
      <BulkAssignModal
        open={isBulkAssignModalOpen}
        onOpenChange={setIsBulkAssignModalOpen}
        selectedProducts={selectedProductsData}
        onSuccess={handleBulkSuccess}
      />
      <BulkRetireModal
        open={isBulkRetireModalOpen}
        onOpenChange={setIsBulkRetireModalOpen}
        selectedProducts={selectedProductsData}
        onSuccess={handleBulkSuccess}
      />
      {/* --- FIN DE MODALES DE ACCIONES MASIVAS --- */}

      {/* Modal de Préstamo Individual */}
      <LendModal
        open={isLendModalOpen}
        onOpenChange={setIsLendModalOpen}
        product={selectedProduct}
        onSuccess={handleBulkSuccess}
      />

      {/* Modal de Asignación Individual */}
      <AssignModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        product={selectedProduct}
        onSuccess={handleBulkSuccess}
      />

      {/* Panel de Detalles */}
      <DetailSheet
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        product={selectedProduct}
      />

      {/* Modal de Edición de Producto */}
      <EditProductModal
        open={isAddProductModalOpen}
        onOpenChange={setIsAddProductModalOpen}
        product={selectedProduct}
        onSuccess={handleBulkSuccess}
      />

      {/* Modal de Mantenimiento */}
      <MaintenanceModal
        open={isMaintenanceModalOpen}
        onOpenChange={setIsMaintenanceModalOpen}
        product={selectedProduct}
        onSuccess={handleBulkSuccess}
      />

      {/* Diálogo de Confirmación para Retiro Definitivo */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Retiro Definitivo</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedProduct && `¿Estás seguro de que deseas marcar "${selectedProduct.nombre}" como retirado? Esta acción no se puede deshacer.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeRetirement}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de Confirmación para Reactivar */}
      <AlertDialog open={isReactivateConfirmOpen} onOpenChange={setIsReactivateConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Reactivación</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedProduct && `¿Estás seguro de que deseas reactivar "${selectedProduct.nombre}" y devolverlo al inventario como "Disponible"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedProduct && executeReactivate(selectedProduct)}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
