"use client"

import { useState, useEffect, useReducer, useMemo } from "react"
import * as React from 'react';
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { GroupedProduct, InventoryItem } from "@/types/inventory"
import { DetailSheet } from "@/components/detail-sheet"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  ListFilter,
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
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { ConfirmationDialogForEditor } from "@/components/confirmation-dialog-for-editor"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import DocumentManager from "@/components/document-manager"
import { GroupedInventoryTable } from '@/components/inventory/grouped-inventory-table';
import { ColumnToggleMenu } from '@/components/inventory/column-toggle-menu';
import { EditProductModal } from "@/components/edit-product-modal"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { DateRange } from "react-day-picker"
import { AdvancedFilterState } from "@/types/inventory"
import { AdvancedFilterForm } from "@/components/inventory/advanced-filter-form"
import { LocationCombobox } from '@/components/location-combobox';
import { SearchBar } from "@/components/inventory/search-bar";
import { FilterBadge } from "@/components/ui/filter-badge";
import { useInventory } from "@/hooks/useInventory";
import { createProductAPI, updateProductAPI, deleteProductAPI, type CreateProductData, type UpdateProductData } from "@/lib/api/inventory";
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"


// El tipo InventoryItem ahora se importa desde @/types/inventory

interface AssignmentItem {
  serialNumber: string
  status: string
  assignedTo: string
  assignmentDate: string
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
  pendingRetire: number
}

interface PendingActionDetails {
  type: string
  productData?: Partial<InventoryItem>
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
  visible?: boolean
}

// Define all possible columns and their properties
const allColumns: ColumnDefinition[] = [
  { id: "name", label: "Nombre", defaultVisible: true, sortable: true, fixed: "start", type: 'string' },
  { id: "brand", label: "Marca", defaultVisible: true, sortable: true, type: 'string' },
  { id: "model", label: "Modelo", defaultVisible: true, sortable: true, type: 'string' },
  { id: "serialNumber", label: "N/S", defaultVisible: true, sortable: false },
  { id: "category", label: "Categoría", defaultVisible: true, sortable: true, type: 'string' },
  { id: "location", label: "Ubicación", defaultVisible: false, sortable: true, type: 'string' },
  { id: "status", label: "Estado", defaultVisible: true, sortable: true, type: 'status' },
  { id: "provider", label: "Proveedor", defaultVisible: false, sortable: true, type: 'string' },
  { id: "purchaseDate", label: "Fecha Adquisición", defaultVisible: false, sortable: true, type: 'date' },
  { id: "contractId", label: "Contrato ID", defaultVisible: false, sortable: false },
  { id: "assignedTo", label: "Asignado A", defaultVisible: false, sortable: true, type: 'string' },
  { id: "assignmentDate", label: "Fecha Asignación", defaultVisible: false, sortable: true, type: 'date' },
  { id: "cost", label: "Costo", defaultVisible: false, sortable: true, type: "number" },
]

export default function InventarioPage() {
  const { state, dispatch: appDispatch } = useApp()
  const { user } = useAuthStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const { inventory, isLoading: inventoryLoading, isError: inventoryError, mutate } = useInventory()
  const inventoryData = React.useMemo(() => Array.isArray(inventory) ? (inventory as unknown as InventoryItem[]) : [], [inventory])

  // Definir el reducer local para manejar acciones específicas del componente
  interface InventoryLocalState {
    lastRefresh: number;
  }

  type InventoryAction =
    | { type: "REFRESH_INVENTORY" }
    | { type: string };

  const inventoryReducer = (state: InventoryLocalState, action: InventoryAction): InventoryLocalState => {
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
    const userId = user?.id;
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
    return inventoryData.filter(item => selectedRowIds.includes(item.id));
  }, [selectedRowIds, inventoryData]);
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
  const [searchTerm, setSearchTerm] = useState<string | null>(searchParams.get("search"))
  const [filterCategoria, setFilterCategoria] = useState<string | null>(searchParams.get("categoria"))
  const [filterMarca, setFilterMarca] = useState<string | null>(searchParams.get("marca"))
  const [filterEstado, setFilterEstado] = useState<string | null>(searchParams.get("estado"))
  const [hasSerialNumber, setHasSerialNumber] = useState(false)

  const handleFilterChange = (filterType: 'categoria' | 'marca' | 'estado', value: string | null) => {
    if (filterType === 'categoria') setFilterCategoria(value);
    if (filterType === 'marca') setFilterMarca(value);
    if (filterType === 'estado') setFilterEstado(value);
  };

  // Modify handleSerialNumberFilterChange to use local state
  const handleSerialNumberFilterChange = (isChecked: boolean) => {
    setHasSerialNumber(isChecked);
  };

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
  const [isReactivateConfirmOpen, setIsReactivateConfirmOpen] = useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
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
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
    startDate: null,
    endDate: null,
    provider: '',
    contractId: '',
    minCost: null,
    maxCost: null,
  });
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const proveedoresUnicos = React.useMemo(() => {
    const proveedores = new Set(inventoryData.map(item => item.provider).filter(Boolean));
    return Array.from(proveedores) as string[];
  }, [inventoryData]);

  // Lista de motivos de retiro
  const retirementReasons = [
    "Fin de vida útil",
    "Daño Irreparable",
    "Extravío",
    "Venta",
    "Donación",
    "Otro"
  ]

  // Column state, loaded from user preferences or default
  const [columns, setColumns] = useState<ColumnDefinition[]>(() => {
    const userId = user?.id;
    const pageId = "inventario";
    const userPrefs = state.userColumnPreferences?.find(pref => pref.page === pageId);

    // Si existen preferencias de usuario para esta página, las aplicamos
    if (userId && userPrefs?.preferences) {
      // Mapeamos sobre allColumns para asegurar que tenemos todas las columnas disponibles
      return allColumns.map(col => {
        const savedPref = userPrefs.preferences.find(p => p.id === col.id);
        // Si hay una preferencia guardada para esta columna, usamos su visibilidad
        // Si no, usamos el valor por defecto de la columna
        return { ...col, visible: savedPref ? savedPref.visible : col.defaultVisible };
      }).sort((a, b) => {
        // Opcional: Añadir lógica para ordenar según el orden guardado si existe
        const orderA = userPrefs.preferences.findIndex(p => p.id === a.id);
        const orderB = userPrefs.preferences.findIndex(p => p.id === b.id);
        if (orderA !== -1 && orderB !== -1) {
          return orderA - orderB;
        }
        return 0;
      });
    }

    // Si no hay preferencias de usuario, inicializamos con la visibilidad por defecto
    return allColumns.map(col => ({ ...col, visible: col.defaultVisible }));
  })

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")



  // Handle URL params for processing tasks
  useEffect(() => {
    if (isReadOnly) return
    const processCargaTaskId = searchParams.get("processCargaTaskId")
    const highlightRetireTask = searchParams.get("highlightRetireTask")

    if (isProcessingUrlParam) return

    if (processCargaTaskId) {
      setIsProcessingUrlParam(true)
      const taskId = Number.parseInt(processCargaTaskId)
      const task = state.tasks.find((t) => t.id === taskId && t.type === "CARGA")
      if (task) {
        const productData: Partial<InventoryItem> = {
          id: 0, // Este ID será reemplazado al guardar
          name: task.details.productName || "",
          quantity: task.details.quantity || 1,
          serialNumber: task.details.serialNumbers ? task.details.serialNumbers.join("\n") : null,
          brand: task.details.brand || "",
          model: task.details.model || "",
          category: task.details.category || "",
          description: task.details.description || "",
          status: "Disponible"
        };
        setSelectedProduct(productData as InventoryItem);
        setTempMarca(task.details.brand || "")
        setModalMode("process-carga")
        setIsAddProductModalOpen(true)
        setProcessingTaskId(taskId)
        router.replace("/inventario", { scroll: false })
      }
      setTimeout(() => setIsProcessingUrlParam(false), 100)
    } else if (highlightRetireTask) {
      setIsProcessingUrlParam(true)
      const taskId = Number.parseInt(highlightRetireTask)
      const task = state.tasks.find((t) => t.id === taskId && t.type === "RETIRO")
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
  }, [searchParams, state.tasks, router, isProcessingUrlParam])

  // Calcular si hay filtros activos
  const hasActiveFilters = filterCategoria || filterMarca || filterEstado || Object.values(advancedFilters).some(value => value);

  const clearAllFilters = () => {
    setSearchTerm(null);
    setFilterCategoria(null);
    setFilterMarca(null);
    setFilterEstado(null);
    setAdvancedFilters({
      startDate: null,
      endDate: null,
      provider: '',
      contractId: '',
      minCost: null,
      maxCost: null,
    });
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
    if (user?.id) {
      const visibleColumnIds = columns.filter(col => col.visible).map(col => col.id);
      appDispatch({
        type: 'UPDATE_USER_COLUMN_PREFERENCES',
        payload: {
          userId: user.id,
          pageId: "inventario",
          columns: visibleColumnIds
        }
      })
    }
  }, [columns, user?.id, appDispatch])

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
    if (item.serialNumber) {
      const activeAssignment = state.assignmentsData.find(
        (a) => a.serialNumber === item.serialNumber && a.status === "Activo",
      )
      if (activeAssignment) {
        return {
          asignadoA: activeAssignment.assignedTo,
          fechaAsignacion: activeAssignment.assignmentDate,
        }
      }
    }
    return { asignadoA: null, fechaAsignacion: null }
  }

  // Función segura para obtener valores de columnas
  const getColumnValue = (item: InventoryItem, columnId: string): string | number | null => {
    switch (columnId) {
      case "name":
        return item.name;
      case "brand":
        return item.brand;
      case "model":
        return item.model;
      case "serialNumber":
        return item.serialNumber || "";
      case "category":
        return item.category;
      case "location":
        return item.location || null;
      case "status":
        return item.status;
      case "provider":
        return item.provider || null;
      case "purchaseDate":
        return item.purchaseDate || null;
      case "contractId":
        return ""; // Not sortable yet
      case "entryDate":
        return item.entryDate || null;
      case "assignedTo":
        return getAssignmentDetails(item).asignadoA;
      case "assignmentDate":
        return getAssignmentDetails(item).fechaAsignacion;
      case "cost":
        return item.cost ?? null;
      default:
        return null;
    }
  };

  // Hooks de Procesamiento de Datos - Cadena de Transformación
  const expandedInventory = React.useMemo(() => {
    return inventoryData.flatMap(item => {
      if (item.isSerialized === false && item.quantity > 1) {
        // Para stacks, expandir en items virtuales
        return Array.from({ length: item.quantity }, (_, index) => ({
          ...item,
          reactKey: `${item.id}-${item.status}-${index}`, // Key única para React
          isVirtual: true,
          originalId: item.id, // Guardar referencia al ID original
          quantity: 1,
        }));
      }
      // Para items normales, solo añadir la reactKey
      return { ...item, reactKey: item.id.toString(), isVirtual: false };
    });
  }, [inventoryData]);

  const filteredData = React.useMemo(() => {
    const results = expandedInventory.filter((item: InventoryItem) => {
      // --- INICIO DE BLOQUE DE DIAGNÓSTICO DE PROPIEDADES NULAS ---
      if (item.name === null || item.brand === null || item.model === null) {
        console.warn("¡ALERTA DE DATO NULO! Ítem con propiedad nula encontrado:", item);
      }
      // --- FIN DE BLOQUE DE DIAGNÓSTICO ---

      const lowercasedQuery = searchTerm?.toLowerCase() || "";
      const matchesSearch = searchTerm === "" ||
        (item.name && item.name.toLowerCase().includes(lowercasedQuery)) ||
        (item.brand && item.brand.toLowerCase().includes(lowercasedQuery)) ||
        (item.model && item.model.toLowerCase().includes(lowercasedQuery)) ||
        (item.serialNumber && item.serialNumber.toLowerCase().includes(lowercasedQuery)) ||
        (item.category && item.category.toLowerCase().includes(lowercasedQuery)) ||
        (item.status && item.status.toLowerCase().includes(lowercasedQuery)) ||
        (item.assignedTo && item.assignedTo.toLowerCase().includes(lowercasedQuery));

      const matchesCategoria = !filterCategoria || item.category === filterCategoria;
      const matchesMarca = !filterMarca || item.brand === filterMarca;
      const matchesEstado = !filterEstado || item.status === filterEstado;
      const matchesSerialNumber = hasSerialNumber ? !!item.serialNumber : true;

      // Lógica para Filtros Avanzados
      const matchesAdvancedFilters = () => {
        // Filtro por Rango de Fechas
        if (advancedFilters.startDate && advancedFilters.endDate && item.purchaseDate) {
          const itemDate = new Date(item.purchaseDate);
          // Normalizamos las fechas para ignorar la hora
          const startDate = new Date(advancedFilters.startDate.setHours(0, 0, 0, 0));
          const endDate = new Date(advancedFilters.endDate.setHours(23, 59, 59, 999));

          if (itemDate < startDate || itemDate > endDate) {
            return false;
          }
        }

        // Filtro por Proveedor
        if (advancedFilters.provider) {
          if (item.provider !== advancedFilters.provider) {
            return false;
          }
        }

        // Filtro por ID de Contrato
        if (advancedFilters.contractId) {
          if (!item.contractId || !item.contractId.toLowerCase().includes(advancedFilters.contractId.toLowerCase())) {
            return false;
          }
        }

        // Filtro por Rango de Costo
        if (item.cost !== null && item.cost !== undefined) {
          if (advancedFilters.minCost !== null && item.cost < advancedFilters.minCost) {
            return false;
          }
          if (advancedFilters.maxCost !== null && item.cost > advancedFilters.maxCost) {
            return false;
          }
        } else {
          // Si el ítem no tiene costo, no coincide si se especifica un rango
          if (advancedFilters.minCost !== null || advancedFilters.maxCost !== null) {
            return false;
          }
        }

        return true; // Si pasa todos los filtros avanzados
      };

      const passesAllFilters = matchesSearch &&
        matchesCategoria &&
        matchesMarca &&
        matchesEstado &&
        matchesSerialNumber &&
        matchesAdvancedFilters();



      return passesAllFilters;
    });

    return results;
  }, [
    expandedInventory,
    searchTerm,
    filterCategoria,
    filterMarca,
    filterEstado,
    hasSerialNumber,
    advancedFilters
  ]);

  const groupedData = React.useMemo(() => {
    const productGroups: { [key: string]: any } = {};

    filteredData.forEach((item: any) => {
      const groupKey = `${item.brand}-${item.model}-${item.category}`;

      if (!productGroups[groupKey]) {
        productGroups[groupKey] = {
          isParent: true,
          product: {
            id: groupKey,
            name: item.name,
            brand: item.brand,
            model: item.model,
            category: item.category,
            isSerialized: !!item.serialNumber
          },
          summary: { total: 0, available: 0, states: {} },
          children: [],
        };
      }

      productGroups[groupKey].children.push(item);
      productGroups[groupKey].summary.total++;

      if (item.status === 'Disponible') {
        productGroups[groupKey].summary.available++;
      }

      productGroups[groupKey].summary.states[item.status] =
        (productGroups[groupKey].summary.states[item.status] || 0) + 1;
    });

    const groupedResults = Object.values(productGroups);

    return groupedResults;
  }, [filteredData]);

  const groupedAndFilteredData = React.useMemo(() => {
    let sortedData = [...groupedData];

    if (sortColumn) {
      const getGroupStatus = (group: any) => {
        const statuses = new Set(group.children.map((item: any) => item.status));
        if (statuses.has('Disponible')) return 'Disponible';
        if (statuses.has('PENDIENTE_DE_RETIRO')) return 'Pendiente';
        if (statuses.has('Asignado')) return 'Asignado';
        if (statuses.has('Prestado')) return 'Prestado';
        return 'Retirado';
      };

      const getGroupValue = (group: any, column: string) => {
        if (column === 'status') {
          return getGroupStatus(group);
        }
        // Para otras columnas, obtenemos el valor del 'product' del grupo
        return group.product?.[column];
      };

      sortedData.sort((a, b) => {
        const aValue = getGroupValue(a, sortColumn);
        const bValue = getGroupValue(b, sortColumn);

        const columnConfig = allColumns.find(c => c.id === sortColumn);
        const sortType = columnConfig ? columnConfig.type : 'string';

        const statusOrder: { [key: string]: number } = {
          'Disponible': 1, 'Asignado': 2, 'Prestado': 3, 'PENDIENTE_DE_RETIRO': 4, 'Retirado': 5
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

    return sortedData;
  }, [groupedData, sortColumn, sortDirection, allColumns]);

  // Datos paginados para la tabla
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return groupedAndFilteredData.slice(startIndex, endIndex);
  }, [groupedAndFilteredData, currentPage, itemsPerPage]);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(groupedAndFilteredData.length / itemsPerPage);

  const selectedProducts = inventoryData.filter((item) => selectedRowIds.includes(item.id))

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
      const allVisibleIds = groupedAndFilteredData.flatMap(group => group.children.map((child: InventoryItem) => child.id));
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
    setIsAddProductModalOpen(true)
  }

  const handleDuplicate = (_product: InventoryItem) => {
    showInfo({ title: "Pendiente", description: "Duplicar no implementado en esta iteración." })
  }

  const handleMarkAsRetired = (_product: InventoryItem) => {
    showInfo({ title: "Pendiente", description: "Flujo de retiro fuera de alcance de este cambio." })
  }

  const executeReactivate = (_product: InventoryItem) => {
    showInfo({ title: "Modo lectura", description: "Reactivación deshabilitada temporalmente." })
  }

  const handleReactivate = (_product: InventoryItem) => {
    showInfo({ title: "Pendiente", description: "Reactivación fuera de alcance de este cambio." })
  }

  const handleAddProduct = () => {
    setIsAddProductModalOpen(true)
  }

  const handleCreateProduct = async (productData: { mode: 'add' | 'edit'; payload: CreateProductData | UpdateProductData; productId?: string }) => {
    try {
      if (productData.mode === 'add') {
        await createProductAPI(productData.payload as CreateProductData)
      } else if (productData.mode === 'edit' && productData.productId) {
        await updateProductAPI(productData.productId, productData.payload as UpdateProductData)
      }

      // Revalidar los datos del inventario
      await mutate()

      setIsAddProductModalOpen(false)

      // Mostrar notificación de éxito
      showSuccess({
        title: productData.mode === 'add' ? "Producto creado" : "Producto actualizado",
        description: productData.mode === 'add' ? "Se creó el producto correctamente." : "Se actualizó el producto correctamente."
      })
    } catch (error) {
      console.error('Error creating product:', error)

      // Mostrar notificación de error
      showError({
        title: productData.mode === 'add' ? "Error al crear producto" : "Error al actualizar producto",
        description: "Ocurrió un error en la operación. Inténtalo de nuevo."
      })
    }
  }

  const handleDeleteProduct = async (asset: InventoryItem) => {
    try {
      await deleteProductAPI(String(asset.id))
      await mutate()
      showSuccess({ title: "Producto eliminado", description: `Se eliminó "${asset.name}".` })
    } catch (error) {
      console.error('Error deleting product:', error)
      showError({ title: "Error al eliminar", description: "No se pudo eliminar el producto." })
    }
  }

  const executeSaveProduct = (_productData: Partial<InventoryItem>) => {
    showInfo({ title: "Modo lectura", description: "Guardado deshabilitado temporalmente." })
  }

  const handleSaveProduct = async () => {
    showInfo({ title: "Modo lectura", description: "Guardar deshabilitado temporalmente." })
  }

  const handleImportCSV = () => {
    showInfo({ title: "Modo lectura", description: "Importación deshabilitada temporalmente." })
  }

  const executeRetirement = () => {
    showInfo({ title: "Modo lectura", description: "Retiro deshabilitado temporalmente." })
  }

  const confirmRetirement = () => {
    showInfo({ title: "Modo lectura", description: "Retiro deshabilitado temporalmente." })
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

  const handleAssign = (_product: InventoryItem) => {
    showInfo({ title: "Modo lectura", description: "Asignación deshabilitada temporalmente." })
  }

  const handleLend = (_product: InventoryItem) => {
    showInfo({ title: "Modo lectura", description: "Préstamo deshabilitado temporalmente." })
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
          requestedBy: user?.nombre || "Editor",
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

  const isLector = false
  const isReadOnly = false

  // Function to calculate available and unavailable quantities for non-serialized items
  const getNonSerializedQtyBreakdown = (item: InventoryItem): QtyBreakdown | null => {
    if (item.serialNumber !== null) return null

    let totalAvailable = 0
    let totalUnavailable = 0
    let assignedCount = 0
    let lentCount = 0
    let pendingRetireCount = 0
    let totalInInventory = 0

    const allInstances = inventoryData.filter(
      (invItem) => invItem.name === item.name && invItem.model === item.model && invItem.serialNumber === null,
    )

    allInstances.forEach((instance: InventoryItem) => {
      if (instance.status !== "Retirado") {
        totalInInventory += instance.quantity
      }

      if (instance.status === "Disponible") {
        totalAvailable += instance.quantity
      } else if (instance.status === "Asignado") {
        assignedCount += instance.quantity
        totalUnavailable += instance.quantity
      } else if (instance.status === "Prestado") {
        lentCount += instance.quantity
        totalUnavailable += instance.quantity
      } else if (instance.status === "PENDIENTE_DE_RETIRO") {
        pendingRetireCount += instance.quantity
        totalUnavailable += instance.quantity
      }
    })

    return {
      total: totalInInventory,
      available: totalAvailable,
      unavailable: totalUnavailable,
      assigned: assignedCount,
      lent: lentCount,
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
      case "PENDIENTE_DE_RETIRO":
        return "text-status-pendiente-de-retiro"
      case "Retirado":
        return "text-status-retirado"
      default:
        return "text-muted-foreground"
    }
  }

  const canShowBulkActions = selectedRowIds.length > 0 && user?.rol !== "Lector" // Corregido según PRD

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
    const categories = new Set((inventoryData || []).map((p) => p.category).filter(Boolean))
    return [...Array.from(categories).sort()]
  }, [inventoryData])

  const allBrands = useMemo(() => {
    const brands = new Set((inventoryData || []).map((p) => p.brand).filter(Boolean))
    return [...Array.from(brands).sort()]
  }, [inventoryData])

  const allStatuses = useMemo(() => {
    const statuses = new Set((inventoryData || []).map((p) => p.status).filter(Boolean))
    return [...Array.from(statuses).sort()]
  }, [inventoryData])

  // Verificar si hay filtros avanzados activos
  const hasAdvancedFilters = advancedFilters.startDate || advancedFilters.endDate ||
    advancedFilters.provider || advancedFilters.contractId ||
    advancedFilters.minCost !== null || advancedFilters.maxCost !== null;

  if (inventoryLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando inventario...
      </div>
    )
  }

  if (inventoryError) {
    return (
      <div className="p-4 text-sm text-red-600">Error al cargar inventario. Inténtalo más tarde.</div>
    )
  }

  if (groupedAndFilteredData.length === 0 && !searchTerm && !filterCategoria && !filterMarca && !filterEstado && !hasAdvancedFilters) {
    return (
      <EmptyState
        title="No hay productos en el inventario"
        description="Comienza añadiendo productos a tu inventario."
        action={undefined}
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
    const fixedStart = columns.find((col) => col.fixed === "start")
    const fixedEnd = columns.find((col) => col.fixed === "end")
    const otherColumns = columns.filter((col) => col.visible && !col.fixed)

    // Ensure fixed columns are always present and in correct order
    let finalColumns = []
    if (fixedStart) finalColumns.push(columns.find((col) => col.fixed === "start")!)
    finalColumns = [...finalColumns, ...otherColumns]
    if (fixedEnd) finalColumns.push(columns.find((col) => col.fixed === "end")!)

    return finalColumns
  }, [columns])

  const handleColumnToggle = (columnId: string, checked: boolean) => {
    const column = columns.find((col) => col.id === columnId)
    if (column?.fixed) return // Prevent toggling fixed columns

    setColumns((prev) =>
      prev.map(col =>
        col.id === columnId
          ? { ...col, visible: checked }
          : col
      )
    )
  }

  // Manejador central para acciones de menú en la tabla anidada
  const handleMenuAction = (action: string, data: GroupedProduct | InventoryItem) => {
    if (action !== 'Ver Detalles') {
      // Allow edit/delete
    }
    const isGroup = 'isParent' in data && data.isParent;
    let targetItem: InventoryItem | undefined | null = null;

    // --- LÓGICA DE DECISIÓN MEJORADA ---
    if (isGroup) {
      // En modo lectura, para ver detalles de un grupo tomamos el primer hijo disponible
      targetItem = data.children.find((child: InventoryItem) => child.status === 'Disponible')
        || data.children[0];
      if (!targetItem) {
        console.error("No hay unidades en el grupo para ver detalles.");
        return;
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
      case 'Ver Detalles':
        handleViewDetails(targetItem);
        break;
      case 'Editar':
        handleEdit(targetItem)
        break;
      case 'Retiro Definitivo':
        handleMarkAsRetired(targetItem)
        break;
      case 'Eliminar':
        handleDeleteProduct(targetItem)
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
        <Button
          variant="ghost"
          className={cn(
            "text-sm transition-colors", // <-- AÑADIDO AQUÍ
            selectedValue && "bg-cfe-green-very-light text-cfe-green hover:bg-cfe-green-very-light/80"
          )}
        >
          <ListFilter className="mr-2 h-4 w-4" />
          {title}
        </Button>
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
    return (state.inventoryData || []).filter((product: InventoryItem) => {
      const lowercasedQuery = searchTerm?.toLowerCase() || "";
      const matchesSearch = searchTerm === "" ||
        (product.name && product.name.toLowerCase().includes(lowercasedQuery)) ||
        (product.brand && product.brand.toLowerCase().includes(lowercasedQuery)) ||
        (product.model && product.model.toLowerCase().includes(lowercasedQuery)) ||
        (product.serialNumber && product.serialNumber.toLowerCase().includes(lowercasedQuery)) ||
        (product.provider && product.provider.toLowerCase().includes(lowercasedQuery)) ||
        (product.contractId && product.contractId.toLowerCase().includes(lowercasedQuery));

      const matchesCategoria = !filterCategoria || product.category === filterCategoria;
      const matchesMarca = !filterMarca || product.brand === filterMarca;
      const matchesEstado = !filterEstado || product.status === filterEstado;

      return matchesSearch && matchesCategoria && matchesMarca && matchesEstado;
    });
  }, [searchTerm, filterCategoria, filterMarca, filterEstado, state.inventoryData])

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* ... existing code ... */}

        {/* NUEVA COMMAND BAR UNIFICADA */}
        <div className="flex flex-col gap-4">
          {/* BARRA DE ACCIONES MASIVAS (se queda como está si existe) */}
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
                disabled
                onClick={() => setIsBulkAssignModalOpen(true)}
              >
                Asignar Selección
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled
                onClick={() => setIsBulkRetireModalOpen(true)}
              >
                Retirar Selección
              </Button>
            </div>
          )}

          {/* NUEVA COMMAND BAR PRINCIPAL */}
          <div className="flex items-center justify-between">
            {/* Grupo Izquierdo: Búsqueda y Filtros Rápidos */}
            <div className="flex items-center gap-2 flex-1">
              <SearchBar
                initialValue={searchTerm || ''}
                onSearchChange={setSearchTerm}
                placeholder="Buscar por nombre, marca, modelo..."
                className="w-full max-w-sm"
              />
              <FilterPopover
                title="Categoría"
                options={state.categories}
                selectedValue={filterCategoria || null}
                onSelect={(value) => handleFilterChange('categoria', value)}
              />
              <FilterPopover
                title="Marca"
                options={state.brands}
                selectedValue={filterMarca || null}
                onSelect={(value) => handleFilterChange('marca', value)}
              />
              <FilterPopover
                title="Estado"
                options={[...new Set(state.inventoryData.map(item => item.status))]}
                selectedValue={filterEstado || null}
                onSelect={(value) => handleFilterChange('estado', value)}
              />
            </div>
            {/* Grupo Derecho: Acciones de Vista y Globales */}
            <div className="flex items-center gap-2">
              <ColumnToggleMenu
                columns={columns}
                onColumnsChange={setColumns}
              />
              <Button variant="outline" onClick={() => setIsAdvancedFilterOpen(true)}>
                Filtros Avanzados
              </Button>
              <Button variant="outline" onClick={() => setIsImportModalOpen(true)} disabled>
                Importar
              </Button>
              <Button onClick={handleAddProduct}>
                Añadir Producto
              </Button>
            </div>
          </div>

          {/* Sección de Filtros Activos */}
          {(() => {
            const hasActiveFilters = filterCategoria || filterMarca || filterEstado || advancedFilters.startDate || advancedFilters.provider || advancedFilters.contractId || advancedFilters.minCost !== null || advancedFilters.maxCost !== null;
            if (hasActiveFilters) {
              return (
                <div className="flex items-center flex-wrap gap-2 mb-4">
                  <span className="text-sm font-semibold">Filtros activos:</span>
                  {filterCategoria && (
                    <FilterBadge onRemove={() => setFilterCategoria(null)}>
                      Categoría: {filterCategoria}
                    </FilterBadge>
                  )}
                  {filterMarca && (
                    <FilterBadge onRemove={() => setFilterMarca(null)}>
                      Marca: {filterMarca}
                    </FilterBadge>
                  )}
                  {filterEstado && (
                    <FilterBadge onRemove={() => setFilterEstado(null)}>
                      Estado: {filterEstado}
                    </FilterBadge>
                  )}
                  {advancedFilters.startDate && advancedFilters.endDate && (
                    <FilterBadge onRemove={() => setAdvancedFilters(prev => ({ ...prev, startDate: null, endDate: null }))}>
                      Fecha: {advancedFilters.startDate.toLocaleDateString()} - {advancedFilters.endDate.toLocaleDateString()}
                    </FilterBadge>
                  )}
                  {advancedFilters.provider && (
                    <FilterBadge onRemove={() => setAdvancedFilters(prev => ({ ...prev, provider: '' }))}>
                      Proveedor: {advancedFilters.provider}
                    </FilterBadge>
                  )}
                  {advancedFilters.contractId && (
                    <FilterBadge onRemove={() => setAdvancedFilters(prev => ({ ...prev, contractId: '' }))}>
                      Contrato: {advancedFilters.contractId}
                    </FilterBadge>
                  )}
                  {(advancedFilters.minCost !== null || advancedFilters.maxCost !== null) && (
                    <FilterBadge onRemove={() => setAdvancedFilters(prev => ({ ...prev, minCost: null, maxCost: null }))}>
                      Costo: {advancedFilters.minCost ?? 'Min'} - {advancedFilters.maxCost ?? 'Max'}
                    </FilterBadge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-red-500 hover:text-red-600">
                    Limpiar todos
                  </Button>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* El Card ahora solo contiene la tabla */}
        <Card>
          <Separator />
          <CardContent className="p-0">
            <GroupedInventoryTable
              data={paginatedData}
              searchQuery={searchTerm || ''}
              columns={columns}
              selectedRowIds={selectedRowIds}
              onRowSelect={handleRowSelect}
              onSelectAll={handleSelectAll}
              onAction={handleMenuAction}
              isLector={false}
              onParentRowSelect={handleParentRowSelect}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              isReadOnly={false}
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

      {/* --- INICIO DE MODALES DE ACCIONES MASIVAS (deshabilitadas en sólo lectura) --- */}
      {/* <BulkAssignModal ... /> y <BulkRetireModal ... /> omitidos temporalmente */}

      {/* Modales de Préstamo/Asignación omitidos en modo sólo lectura */}

      {/* Panel de Detalles */}
      <DetailSheet
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        product={selectedProduct}
      />

      {/* Modal de Edición de Producto omitido en modo sólo lectura */}

      {/* Diálogo de Confirmación para Retiro omitido en modo sólo lectura */}

      {/* Diálogo de Confirmación para Reactivar omitido en modo sólo lectura */}

      <Sheet open={isAdvancedFilterOpen} onOpenChange={setIsAdvancedFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros Avanzados</SheetTitle>
            <SheetDescription>
              Aplica filtros detallados para refinar tu búsqueda en el inventario.
            </SheetDescription>
          </SheetHeader>
          <AdvancedFilterForm
            currentFilters={advancedFilters}
            proveedores={proveedoresUnicos}
            onApplyFilters={(newFilters) => {
              setAdvancedFilters(newFilters);
              setIsAdvancedFilterOpen(false);
            }}
            onClearFilters={() => {
              setAdvancedFilters({
                startDate: null,
                endDate: null,
                provider: '',
                contractId: '',
                minCost: null,
                maxCost: null
              });
            }}
            hasSerialNumber={hasSerialNumber}
            onSerialNumberFilterChange={handleSerialNumberFilterChange}
          />
        </SheetContent>
      </Sheet>

      {/* Modal para añadir/editar producto */}
      <EditProductModal
        open={isAddProductModalOpen}
        onOpenChange={setIsAddProductModalOpen}
        product={modalMode === 'edit' ? selectedProduct : null}
        onSuccess={handleCreateProduct}
      />
    </TooltipProvider>
  )
}
