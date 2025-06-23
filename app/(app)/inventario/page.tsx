"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import { DropdownMenuPortal } from "@/components/ui/dropdown-menu"
import { DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuSub } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  FileDown,
  PackageMinus,
  Edit,
  Handshake,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Columns,
  RotateCcw,
  Copy,
} from "lucide-react"
import { QuickLoadModal } from "@/components/quick-load-modal"
import { useApp } from "@/contexts/app-context"
import { StatusBadge } from "@/components/status-badge"
import { EditProductModal } from "@/components/edit-product-modal"
import { ConfirmationDialogForEditor } from "@/components/confirmation-dialog-for-editor"
import { useToast } from "@/hooks/use-toast"
import { BulkAssignModal } from "@/components/bulk-assign-modal"
import { BulkLendModal } from "@/components/bulk-lend-modal"
import { BulkRetireModal } from "@/components/bulk-retire-modal"
import { ActionMenu } from "@/components/action-menu"
import { BulkEditModal } from "@/components/bulk-edit-modal"

const ITEMS_PER_PAGE = 10

const allColumns = [
  { id: "nombre", label: "Nombre", defaultVisible: true, sortable: true, fixed: "start" },
  { id: "marca", label: "Marca", defaultVisible: true, sortable: true },
  { id: "modelo", label: "Modelo", defaultVisible: true, sortable: true },
  { id: "numeroSerie", label: "N/S", defaultVisible: true, sortable: true },
  { id: "categoria", label: "Categoría", defaultVisible: true, sortable: true },
  { id: "estado", label: "Estado", defaultVisible: true, sortable: true },
  { id: "proveedor", label: "Proveedor", defaultVisible: false, sortable: true },
  { id: "fechaAdquisicion", label: "Fecha Adquisición", defaultVisible: false, sortable: true },
  { id: "contratoId", label: "Contrato ID", defaultVisible: false, sortable: true },
  { id: "asignadoA", label: "Asignado A", defaultVisible: false, sortable: true },
  { id: "fechaAsignacion", label: "Fecha Asignación", defaultVisible: false, sortable: true },
  { id: "qty", label: "QTY", defaultVisible: true, sortable: false, fixed: "end" },
]

export default function InventoryPage() {
  const { state, dispatch, addRecentActivity } = useApp()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [filterEstado, setFilterEstado] = useState(searchParams.get("estado") || "Todos")
  const [filterCategoria, setFilterCategoria] = useState(
    searchParams.get("categoria") || "Todas",
  )
  const [filterMarca, setFilterMarca] = useState(searchParams.get("marca") || "Todas")
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  )
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    allColumns.filter((c) => c.defaultVisible).map((c) => c.id),
  )
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"ascending" | "descending">(
    "ascending",
  )
  const [isQuickLoadModalOpen, setIsQuickLoadModalOpen] = useState(false)
  const [isQuickRetireModalOpen, setIsQuickRetireModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<any>(null)
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false)
  const [isBulkLendModalOpen, setIsBulkLendModalOpen] = useState(false)
  const [isBulkRetireModalOpen, setIsBulkRetireModalOpen] = useState(false)
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [showImportProgress, setShowImportProgress] = useState(false)
  const [importProgress, setImportProgress] = useState(0)

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (filterEstado !== "Todos") params.set("estado", filterEstado)
    if (filterCategoria !== "Todas") params.set("categoria", filterCategoria)
    if (filterMarca !== "Todas") params.set("marca", filterMarca)
    if (currentPage > 1) params.set("page", currentPage.toString())
    router.replace(`/inventario${params.toString() ? "?" + params.toString() : ""}`, { scroll: false })
  }, [searchTerm, filterEstado, filterCategoria, filterMarca, currentPage, router])

  useEffect(() => {
    const processId = searchParams.get("processCargaTaskId")
    const highlightId = searchParams.get("highlightRetireTask")
    if (processId) {
      dispatch({ type: "PROCESS_CARGA_TASK", payload: Number(processId) })
    } else if (highlightId) {
      dispatch({ type: "HIGHLIGHT_RETIRE_TASK", payload: Number(highlightId) })
    }
  }, [searchParams, dispatch])

  const handleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) => (prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]))
  }

  const handleSelectAllProducts = () => {
    if (selectedProductIds.length === filteredAndSortedProducts.length) {
      setSelectedProductIds([])
    } else {
      setSelectedProductIds(filteredAndSortedProducts.map((p) => p.id))
    }
  }

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch({ type: "DELETE_PRODUCT", payload: productToDelete.id })
      addRecentActivity({
        type: "Eliminación de Producto",
        description: `Producto ${productToDelete.nombre} (N/S: ${
          productToDelete.numeroSerie || "N/A"
        }) eliminado del inventario.`,
        date: new Date().toLocaleString(),
        details: { productId: productToDelete.id, productName: productToDelete.nombre },
      })
      toast({
        title: "Producto Eliminado",
        description: `El producto ${productToDelete.nombre} ha sido eliminado.`,
      })
      setIsDeleteConfirmOpen(false)
      setProductToDelete(null)
    }
  }

  const handleUpdateProduct = (updatedProduct: any) => {
    dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct })
    addRecentActivity({
      type: "Actualización de Producto",
      description: `Producto ${updatedProduct.nombre} (N/S: ${updatedProduct.numeroSerie || "N/A"}) actualizado.`,
      date: new Date().toLocaleString(),
      details: { productId: updatedProduct.id, productName: updatedProduct.nombre },
    })
    toast({
      title: "Producto Actualizado",
      description: `El producto ${updatedProduct.nombre} ha sido actualizado.`,
    })
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handleBulkAssign = (assignData: {
    productIds: string[]
    assignedTo: string
    assignmentDate: string
  }) => {
    dispatch({ type: "BULK_ASSIGN_PRODUCTS", payload: assignData })
    assignData.productIds.forEach((id) => {
      const product = state.inventoryData.find((p) => p.id === id)
      if (product) {
        addRecentActivity({
          type: "Asignación Masiva",
          description: `Producto ${product.nombre} (N/S: ${
            product.numeroSerie || "N/A"
          }) asignado a ${assignData.assignedTo}.`,
          date: new Date().toLocaleString(),
          details: {
            productId: product.id,
            productName: product.nombre,
            assignedTo: assignData.assignedTo,
          },
        })
      }
    })
    toast({
      title: "Asignación Masiva Exitosa",
      description: `${assignData.productIds.length} productos han sido asignados.`,
    })
    setSelectedProductIds([])
    setIsBulkAssignModalOpen(false)
  }

  const handleBulkLend = (lendData: {
    productIds: string[]
    lentTo: string
    loanDate: string
    returnDate: string
  }) => {
    dispatch({ type: "BULK_LEND_PRODUCTS", payload: lendData })
    lendData.productIds.forEach((id) => {
      const product = state.inventoryData.find((p) => p.id === id)
      if (product) {
        addRecentActivity({
          type: "Préstamo Masivo",
          description: `Producto ${product.nombre} (N/S: ${
            product.numeroSerie || "N/A"
          }) prestado a ${lendData.lentTo}.`,
          date: new Date().toLocaleString(),
          details: {
            productId: product.id,
            productName: product.nombre,
            lentTo: lendData.lentTo,
          },
        })
      }
    })
    toast({
      title: "Préstamo Masivo Exitoso",
      description: `${lendData.productIds.length} productos han sido prestados.`,
    })
    setSelectedProductIds([])
    setIsBulkLendModalOpen(false)
  }

  const handleBulkRetire = (retireData: { productIds: string[]; retirementReason: string }) => {
    dispatch({ type: "BULK_RETIRE_PRODUCTS", payload: retireData })
    retireData.productIds.forEach((id) => {
      const product = state.inventoryData.find((p) => p.id === id)
      if (product) {
        addRecentActivity({
          type: "Retiro Masivo",
          description: `Producto ${product.nombre} (N/S: ${
            product.numeroSerie || "N/A"
          }) retirado por: ${retireData.retirementReason}.`,
          date: new Date().toLocaleString(),
          details: {
            productId: product.id,
            productName: product.nombre,
            reason: retireData.retirementReason,
          },
        })
      }
    })
    toast({
      title: "Retiro Masivo Exitoso",
      description: `${retireData.productIds.length} productos han sido retirados.`,
    })
    setSelectedProductIds([])
    setIsBulkRetireModalOpen(false)
  }

  const handleBulkEdit = (editData: { productIds: string[]; updates: Partial<any> }) => {
    dispatch({ type: "BULK_EDIT_PRODUCTS", payload: editData })
    editData.productIds.forEach((id) => {
      const product = state.inventoryData.find((p) => p.id === id)
      if (product) {
        addRecentActivity({
          type: "Edición Masiva",
          description: `Producto ${product.nombre} (N/S: ${product.numeroSerie || "N/A"}) editado masivamente.`,
          date: new Date().toLocaleString(),
          details: {
            productId: product.id,
            productName: product.nombre,
            updates: editData.updates,
          },
        })
      }
    })
    toast({
      title: "Edición Masiva Exitosa",
      description: `${editData.productIds.length} productos han sido actualizados.`,
    })
    setSelectedProductIds([])
    setIsBulkEditModalOpen(false)
  }

  const filteredProducts = useMemo(() => {
    const filtered = state.inventoryData.filter((product) => {
      const matchesSearch =
        product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.numeroSerie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.idContrato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = filterEstado === "Todos" || product.estado === filterEstado
      const matchesCategoria = filterCategoria === "Todas" || product.categoria === filterCategoria
      const matchesMarca = filterMarca === "Todas" || product.marca === filterMarca

      return matchesSearch && matchesEstado && matchesCategoria && matchesMarca
    })

    return filtered
  }, [state.inventoryData, searchTerm, filterEstado, filterCategoria, filterMarca])

  const sortedProducts = useMemo(() => {
    if (!sortColumn) {
      return filteredProducts
    }

    const sorted = [...filteredProducts].sort((a, b) => {
      const aValue = a[sortColumn] || ""
      const bValue = b[sortColumn] || ""

      if (aValue < bValue) {
        return sortDirection === "ascending" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === "ascending" ? 1 : -1
      }
      return 0
    })
    return sorted
  }, [filteredProducts, sortColumn, sortDirection])

  const requestSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === "ascending" ? "descending" : "ascending")
    } else {
      setSortColumn(key)
      setSortDirection("ascending")
    }
  }

  const getSortIcon = (key: string) => {
    if (sortColumn !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === "ascending" ? (
      <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    )
  }

  const allCategories = useMemo(() => {
    const categories = new Set(state.inventoryData.map((p) => p.categoria).filter(Boolean))
    return ["Todas", ...Array.from(categories).sort()]
  }, [state.inventoryData])

  const allBrands = useMemo(() => {
    const brands = new Set(state.inventoryData.map((p) => p.marca).filter(Boolean))
    return ["Todas", ...Array.from(brands).sort()]
  }, [state.inventoryData])

  const allStatuses = useMemo(() => {
    const statuses = new Set(state.inventoryData.map((p) => p.estado).filter(Boolean))
    return ["Todos", ...Array.from(statuses).sort()]
  }, [state.inventoryData])

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE))
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const displayedColumns = useMemo(() => {
    const fixedStart = allColumns.find((c) => c.fixed === "start")
    const fixedEnd = allColumns.find((c) => c.fixed === "end")
    const others = allColumns.filter((c) => visibleColumns.includes(c.id) && !c.fixed)
    let cols: any[] = []
    if (fixedStart) cols.push(fixedStart)
    cols = [...cols, ...others]
    if (fixedEnd) cols.push(fixedEnd)
    return cols
  }, [visibleColumns])

  const handleColumnToggle = (id: string, checked: boolean) => {
    const column = allColumns.find((c) => c.id === id)
    if (column?.fixed) return
    setVisibleColumns((prev) => (checked ? [...prev, id] : prev.filter((c) => c !== id)))
  }

  const getAssignmentDetails = (item: any) => {
    if (item.numeroSerie) {
      const active = state.asignadosData.find(
        (a) => a.numeroSerie === item.numeroSerie && a.estado === "Activo",
      )
      if (active) {
        return { asignadoA: active.asignadoA, fechaAsignacion: active.fechaAsignacion }
      }
    }
    return { asignadoA: null, fechaAsignacion: null }
  }

  const handleReactivate = (product: any) => {
    dispatch({ type: "REACTIVATE_PRODUCT", payload: product.id })
    addRecentActivity({
      type: "Reactivación",
      description: `${product.nombre} reactivado`,
      date: new Date().toLocaleString(),
      details: { productId: product.id },
    })
    toast({
      title: "Producto reactivado",
      description: `${product.nombre} ha sido reactivado y está disponible.`,
    })
  }

  const handleDuplicate = (product: any) => {
    dispatch({ type: "DUPLICATE_PRODUCT", payload: product.id })
    toast({ title: "Producto duplicado", description: `${product.nombre} duplicado.` })
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
            dispatch({ type: "IMPORT_CSV_COMPLETE" })
            toast({ title: "Importación completada" })
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const filteredAndSortedProducts = paginatedProducts

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="ml-auto" onClick={() => setIsImportModalOpen(true)}>
            <FileDown className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
          <Button onClick={() => setIsQuickLoadModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Producto
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
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
                  {allStatuses.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={filterEstado === status}
                      onCheckedChange={() => setFilterEstado(status)}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Categoría</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {allCategories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={filterCategoria === category}
                      onCheckedChange={() => setFilterCategoria(category)}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Marca</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {allBrands.map((brand) => (
                    <DropdownMenuCheckboxItem
                      key={brand}
                      checked={filterMarca === brand}
                      onCheckedChange={() => setFilterMarca(brand)}
                    >
                      {brand}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedProductIds.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <span className="text-sm text-muted-foreground">{selectedProductIds.length} productos seleccionados</span>
          <Button variant="outline" size="sm" onClick={() => setIsBulkAssignModalOpen(true)} className="ml-auto">
            <UserCheck className="mr-2 h-4 w-4" /> Asignar Masivo
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsBulkLendModalOpen(true)}>
            <Handshake className="mr-2 h-4 w-4" /> Prestar Masivo
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsBulkRetireModalOpen(true)}>
            <PackageMinus className="mr-2 h-4 w-4" /> Retirar Masivo
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsBulkEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Editar Masivo
          </Button>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={
                    selectedProductIds.length === filteredAndSortedProducts.length &&
                    filteredAndSortedProducts.length > 0
                  }
                  onChange={handleSelectAllProducts}
                />
              </TableHead>
              <TableHead onClick={() => requestSort("nombre")} className="cursor-pointer">
                Nombre del Producto
                {getSortIcon("nombre")}
              </TableHead>
              <TableHead onClick={() => requestSort("marca")} className="cursor-pointer">
                Marca
                {getSortIcon("marca")}
              </TableHead>
              <TableHead onClick={() => requestSort("modelo")} className="cursor-pointer">
                Modelo
                {getSortIcon("modelo")}
              </TableHead>
              <TableHead onClick={() => requestSort("numeroSerie")} className="cursor-pointer">
                N/S
                {getSortIcon("numeroSerie")}
              </TableHead>
              <TableHead onClick={() => requestSort("categoria")} className="cursor-pointer">
                Categoría
                {getSortIcon("categoria")}
              </TableHead>
              <TableHead onClick={() => requestSort("estado")} className="cursor-pointer">
                Estado
                {getSortIcon("estado")}
              </TableHead>
              <TableHead onClick={() => requestSort("cantidad")} className="cursor-pointer">
                Cantidad
                {getSortIcon("cantidad")}
              </TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.nombre}</TableCell>
                  <TableCell>{product.marca}</TableCell>
                  <TableCell>{product.modelo}</TableCell>
                  <TableCell>{product.numeroSerie || "N/A"}</TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell>
                    <StatusBadge status={product.estado} />
                  </TableCell>
                  <TableCell>{product.cantidad}</TableCell>
                  <TableCell>
                    <ActionMenu
                      actions={[
                        { label: "Editar", onClick: () => handleEditProduct(product), icon: Edit },
                        { label: "Duplicar", onClick: () => handleDuplicate(product), icon: Copy },
                        {
                          label: "Reactivar",
                          onClick: () => handleReactivate(product),
                          icon: RotateCcw,
                          disabled: product.estado !== "Retirado",
                        },
                        {
                          label: "Asignar...",
                          onClick: () => {
                            setSelectedProductIds([product.id])
                            setIsBulkAssignModalOpen(true)
                          },
                          icon: UserCheck,
                        },
                        {
                          label: "Prestar...",
                          onClick: () => {
                            setSelectedProductIds([product.id])
                            setIsBulkLendModalOpen(true)
                          },
                          icon: Handshake,
                        },
                        {
                          label: "Marcar Retiro",
                          onClick: () => {
                            setSelectedProductIds([product.id])
                            setIsBulkRetireModalOpen(true)
                          },
                          icon: PackageMinus,
                        },
                        {
                          label: "Eliminar",
                          onClick: () => handleDeleteProduct(product),
                          icon: PackageMinus,
                          destructive: true,
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredAndSortedProducts.length} de {sortedProducts.length} productos
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <QuickLoadModal open={isQuickLoadModalOpen} onOpenChange={setIsQuickLoadModalOpen} />
      {selectedProduct && (
        <EditProductModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          product={selectedProduct}
          onUpdateProduct={handleUpdateProduct}
        />
      )}
      <ConfirmationDialogForEditor
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />
      <BulkAssignModal
        open={isBulkAssignModalOpen}
        onOpenChange={setIsBulkAssignModalOpen}
        selectedProducts={selectedProductIds}
        onAssign={handleBulkAssign}
      />
      <BulkLendModal
        open={isBulkLendModalOpen}
        onOpenChange={setIsBulkLendModalOpen}
        selectedProducts={selectedProductIds}
        onLend={handleBulkLend}
      />
      <BulkRetireModal
        open={isBulkRetireModalOpen}
        onOpenChange={setIsBulkRetireModalOpen}
        selectedProducts={selectedProductIds}
        onRetire={handleBulkRetire}
      />
      <BulkEditModal
        open={isBulkEditModalOpen}
        onOpenChange={setIsBulkEditModalOpen}
        selectedProducts={selectedProductIds}
        onBulkEdit={handleBulkEdit}
      />
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar desde CSV</DialogTitle>
            <DialogDescription>
              Selecciona un archivo CSV para importar productos al inventario.
            </DialogDescription>
          </DialogHeader>
          {!showImportProgress ? (
            <div className="grid gap-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csvFile">Archivo CSV</Label>
                <Input id="csvFile" type="file" accept=".csv" />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <Label>Progreso de importación</Label>
              <Progress value={importProgress} />
              <p className="text-sm text-muted-foreground">{importProgress}% completado</p>
            </div>
          )}
          {!showImportProgress && (
            <DialogFooter>
              <Button onClick={handleImportCSV}>
                <FileDown className="mr-2 h-4 w-4" /> Importar
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
