"use client"

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
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, ArrowUpDown, AlertTriangle } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { StatusBadge } from "@/components/status-badge"
import { ConfirmationDialogForEditor } from "@/components/confirmation-dialog-for-editor"
import { showSuccess, showInfo } from "@/hooks/use-toast"
import { ActionMenu } from "@/components/action-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

// Definición de tipos para los préstamos
interface PrestamoItem {
  id: number;
  articuloId: number;
  nombre: string;
  numeroSerie: string | null;
  prestadoA: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: "Activo" | "Devuelto" | "Vencido";
  diasRestantes: number;
  notas?: string;
  registradoPor?: string;
  categoria?: string;
  marca?: string;
}

export default function PrestamosPage() {
  const { state, dispatch, addRecentActivity, updateLoanStatus } = useApp()


  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    estado: "Todos",
    categoria: "Todas",
    marca: "Todas",
  })
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [isReturnConfirmOpen, setIsReturnConfirmOpen] = useState(false)
  const [loanToReturn, setLoanToReturn] = useState<PrestamoItem | null>(null)
  const [isBulkLoanModalOpen, setIsBulkLoanModalOpen] = useState(false)

  // Función segura para acceder a propiedades que podrían ser undefined
  const safeAccess = <T, K extends keyof T>(obj: T | undefined | null, key: K): T[K] | undefined => {
    return obj ? obj[key] : undefined
  }

  const handleReturnLoan = (loan: PrestamoItem) => {
    setLoanToReturn(loan)
    setIsReturnConfirmOpen(true)
  }

  const confirmReturn = () => {
    if (loanToReturn) {
      updateLoanStatus(loanToReturn.id, "Devuelto")
      addRecentActivity({
        type: "Devolución de Préstamo",
        description: `Producto ${loanToReturn.nombre} (N/S: ${loanToReturn.numeroSerie || "N/A"
          }) devuelto por ${loanToReturn.prestadoA}.`,
        date: new Date().toLocaleString(),
        details: {
          loanId: loanToReturn.id,
          productName: loanToReturn.nombre,
          lentTo: loanToReturn.prestadoA,
        },
      })
      showSuccess({
        title: "Préstamo Devuelto",
        description: `El producto ${loanToReturn.nombre} ha sido devuelto al inventario.`,
      })
      setIsReturnConfirmOpen(false)
      setLoanToReturn(null)
    }
  }

  const filteredLoans = useMemo(() => {
    return (state.prestamosData || []).filter((loan) => {
      const matchesSearch =
        safeAccess(loan, "nombre")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        safeAccess(loan, "numeroSerie")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        safeAccess(loan, "prestadoA")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        safeAccess(loan, "estado")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        safeAccess(loan, "fechaPrestamo")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        safeAccess(loan, "fechaDevolucion")?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = filters.estado === "Todos" || loan.estado === filters.estado

      // Buscar información adicional del producto en el inventario
      const inventoryItem = state.inventoryData.find(item => item.id === loan.articuloId)
      const categoria = inventoryItem?.categoria || ""
      const marca = inventoryItem?.marca || ""

      const matchesCategoria =
        filters.categoria === "Todas" ||
        categoria.toLowerCase() === filters.categoria.toLowerCase()

      const matchesMarca =
        filters.marca === "Todas" ||
        marca.toLowerCase() === filters.marca.toLowerCase()

      return matchesSearch && matchesEstado && matchesCategoria && matchesMarca
    })
  }, [state.prestamosData, state.inventoryData, searchTerm, filters])

  const sortedLoans = useMemo(() => {
    if (!sortConfig) {
      return filteredLoans
    }

    const sorted = [...filteredLoans].sort((a, b) => {
      const aValue = safeAccess(a, sortConfig.key as keyof typeof a) || ""
      const bValue = safeAccess(b, sortConfig.key as keyof typeof b) || ""

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
    return sorted
  }, [filteredLoans, sortConfig])

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [filterType]: value })
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

  // Obtener categorías y marcas desde el inventario para los filtros
  const allCategories = useMemo(() => {
    const categories = new Set((state.inventoryData || []).map((item) => item.categoria).filter(Boolean))
    return ["Todas", ...Array.from(categories).sort()]
  }, [state.inventoryData])

  const allBrands = useMemo(() => {
    const brands = new Set((state.inventoryData || []).map((item) => item.marca).filter(Boolean))
    return ["Todas", ...Array.from(brands).sort()]
  }, [state.inventoryData])

  const allStatuses = useMemo(() => {
    const statuses = new Set((state.prestamosData || []).map((p) => p.estado).filter(Boolean))
    return ["Todos", ...Array.from(statuses).sort()]
  }, [state.prestamosData])

  // Calcular préstamos vencidos
  const vencidosCount = useMemo(() => {
    return (state.prestamosData || []).filter(loan => loan.estado === "Vencido").length
  }, [state.prestamosData])

  // Función para renderizar el indicador de días restantes
  const renderDiasRestantes = (diasRestantes: number, estado: string) => {
    if (estado === "Devuelto") {
      return <span className="text-muted-foreground">Devuelto</span>
    }

    if (diasRestantes < 0) {
      return (
        <div className="flex items-center gap-1 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>Vencido por {Math.abs(diasRestantes)} días</span>
        </div>
      )
    }

    let color = "bg-green-500"
    if (diasRestantes <= 3) color = "bg-red-500"
    else if (diasRestantes <= 7) color = "bg-amber-500"

    return (
      <div className="w-full space-y-1">
        <div className="flex justify-between text-xs">
          <span>{diasRestantes} días</span>
        </div>
        <Progress value={(diasRestantes / 30) * 100} className={`h-2 ${color}`} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Préstamos</h1>
          {vencidosCount > 0 && (
            <div className="mt-1 flex items-center text-sm text-destructive">
              <AlertTriangle className="mr-1 h-4 w-4" />
              {vencidosCount} préstamos vencidos
            </div>
          )}
        </div>

        <Dialog open={isBulkLoanModalOpen} onOpenChange={setIsBulkLoanModalOpen}>
          <DialogTrigger asChild>
            <Button>Prestar Masivo</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Préstamo Masivo</DialogTitle>
              <DialogDescription>
                Seleccione los productos que desea prestar y complete la información del préstamo.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Aquí iría el formulario de préstamo masivo */}
              <p className="text-sm text-muted-foreground">
                Funcionalidad en desarrollo. Esta característica permitirá prestar múltiples artículos
                a una misma persona o entidad en una sola operación.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBulkLoanModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled>
                Confirmar Préstamo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por artículo, N/S, prestado a..."
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
                      checked={filters.estado === status}
                      onCheckedChange={() => handleFilterChange("estado", status)}
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
                      checked={filters.categoria === category}
                      onCheckedChange={() => handleFilterChange("categoria", category)}
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
                      checked={filters.marca === brand}
                      onCheckedChange={() => handleFilterChange("marca", brand)}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort("nombre")} className="cursor-pointer">
                Artículo {getSortIcon("nombre")}
              </TableHead>
              <TableHead onClick={() => requestSort("numeroSerie")} className="cursor-pointer">
                Número de Serie {getSortIcon("numeroSerie")}
              </TableHead>
              <TableHead onClick={() => requestSort("prestadoA")} className="cursor-pointer">
                Prestado A {getSortIcon("prestadoA")}
              </TableHead>
              <TableHead onClick={() => requestSort("fechaPrestamo")} className="cursor-pointer">
                Fecha Préstamo {getSortIcon("fechaPrestamo")}
              </TableHead>
              <TableHead onClick={() => requestSort("fechaDevolucion")} className="cursor-pointer">
                Fecha Devolución {getSortIcon("fechaDevolucion")}
              </TableHead>
              <TableHead onClick={() => requestSort("diasRestantes")} className="cursor-pointer">
                Días Restantes {getSortIcon("diasRestantes")}
              </TableHead>
              <TableHead onClick={() => requestSort("estado")} className="cursor-pointer">
                Estado {getSortIcon("estado")}
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLoans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No se encontraron préstamos
                </TableCell>
              </TableRow>
            ) : (
              sortedLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.nombre}</TableCell>
                  <TableCell>{loan.numeroSerie || "N/A"}</TableCell>
                  <TableCell>{loan.prestadoA}</TableCell>
                  <TableCell>{loan.fechaPrestamo}</TableCell>
                  <TableCell>{loan.fechaDevolucion}</TableCell>
                  <TableCell className="w-32">
                    {renderDiasRestantes(loan.diasRestantes, loan.estado)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge type="loan" status={loan.estado} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionMenu
                      actions={[
                        {
                          label: "Ver Detalles",
                          onClick: () => { },
                        },
                        {
                          label: "Registrar Devolución",
                          onClick: () => handleReturnLoan(loan),
                          disabled: loan.estado === "Devuelto",
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

      <ConfirmationDialogForEditor
        open={isReturnConfirmOpen}
        onOpenChange={setIsReturnConfirmOpen}
        onConfirm={confirmReturn}
        title="Confirmar Devolución"
        description={`¿Está seguro que desea registrar la devolución del artículo ${loanToReturn?.nombre || ""
          }?`}
        confirmText="Confirmar Devolución"
        cancelText="Cancelar"
      />
    </div>
  )
}
