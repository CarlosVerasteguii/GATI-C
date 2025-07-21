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
import { Search, Filter, ArrowUpDown, ArrowUpRight } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { StatusBadge } from "@/components/status-badge"
import { ConfirmationDialogForEditor } from "@/components/confirmation-dialog-for-editor"
import { showSuccess, showWarning, showInfo } from "@/hooks/use-toast"
import { ActionMenu } from "@/components/action-menu"

// Definir una función segura para acceder a propiedades
const safeAccess = (obj: any, key: string) => {
  if (!obj) return ""

  // Mapeamos las propiedades incorrectas a las correctas
  const propertyMap: Record<string, string> = {
    articulo: "articuloNombre",
  }

  const mappedKey = propertyMap[key] || key
  return obj[mappedKey] || ""
}

/**
 * AsignadosPage - Página principal para gestionar los artículos asignados.
 * Muestra una lista de los productos asignados con funcionalidad de filtrado,
 * búsqueda y ordenamiento. Permite devolver productos al inventario.
 */
export default function AsignadosPage() {
  const { state, addRecentActivity, updateAssignmentStatus } = useApp()


  // Estado local para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [previousSearchTerm, setPreviousSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    estado: "Todos",
    categoria: "Todas",
    marca: "Todas",
  })

  // Estado para ordenamiento de columnas
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  } | null>(null)

  // Estado para el diálogo de confirmación de devolución
  const [isReturnConfirmOpen, setIsReturnConfirmOpen] = useState(false)
  const [assignmentToReturn, setAssignmentToReturn] = useState<any>(null)

  /**
   * Maneja la solicitud de devolución de un artículo asignado
   * @param assignment El objeto de asignación a devolver
   */
  const handleReturnAssignment = (assignment: any) => {
    setAssignmentToReturn(assignment)
    setIsReturnConfirmOpen(true)
  }

  /**
   * Confirma la devolución del artículo y actualiza el estado
   */
  const confirmReturn = () => {
    if (assignmentToReturn) {
      // Usar updateAssignmentStatus para marcar como devuelto
      updateAssignmentStatus(assignmentToReturn.id, "Devuelto");

      addRecentActivity({
        type: "Devolución de Asignación",
        description: `Producto ${assignmentToReturn.articuloNombre} (N/S: ${assignmentToReturn.numeroSerie || "N/A"
          }) devuelto por ${assignmentToReturn.asignadoA}.`,
        date: new Date().toLocaleString(),
        details: {
          assignmentId: assignmentToReturn.id,
          productName: assignmentToReturn.articuloNombre,
          assignedTo: assignmentToReturn.asignadoA,
        },
      })
      showSuccess({
        title: "Asignación Devuelta",
        description: `El producto ${assignmentToReturn.articuloNombre} ha sido devuelto al inventario.`,
      })
      setIsReturnConfirmOpen(false)
      setAssignmentToReturn(null)
    }
  }

  /**
   * Filtra las asignaciones según los criterios de búsqueda y filtros establecidos
   */
  const filteredAssignments = useMemo(() => {
    // Extraer datos de inventario para tener información de categoría y marca
    const inventoryMap = new Map(
      (state.inventoryData || []).map(item => [item.id, item])
    )

    const filtered = (state.asignadosData || []).filter((assignment) => {
      const inventoryItem = inventoryMap.get(assignment.articuloId)

      const matchesSearch =
        (assignment.articuloNombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assignment.numeroSerie || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assignment.asignadoA || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assignment.estado || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assignment.fechaAsignacion || "").toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = filters.estado === "Todos" || assignment.estado === filters.estado
      const matchesCategoria =
        filters.categoria === "Todas" ||
        (inventoryItem?.categoria && inventoryItem.categoria.toLowerCase() === filters.categoria.toLowerCase())
      const matchesMarca =
        filters.marca === "Todas" ||
        (inventoryItem?.marca && inventoryItem.marca.toLowerCase() === filters.marca.toLowerCase())

      return matchesSearch && matchesEstado && matchesCategoria && matchesMarca
    })

    return filtered
  }, [state.asignadosData, state.inventoryData, searchTerm, filters])

  /**
   * Ordena las asignaciones según la columna y dirección seleccionada
   */
  const sortedAssignments = useMemo(() => {
    if (!sortConfig) {
      return filteredAssignments
    }

    const sorted = [...filteredAssignments].sort((a, b) => {
      const aValue = safeAccess(a, sortConfig.key)
      const bValue = safeAccess(b, sortConfig.key)

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
    return sorted
  }, [filteredAssignments, sortConfig])

  /**
   * Cambia la configuración de ordenamiento de una columna
   * @param key La clave de la columna a ordenar
   */
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)

    // Si es una búsqueda nueva y no está vacía
    if (value.length >= 3 && value !== previousSearchTerm) {
      setPreviousSearchTerm(value)

      // Simular búsqueda y verificar resultados después de un breve delay
      setTimeout(() => {
        if (filteredAssignments.length === 0 && value === searchTerm) {
          // Buscar sugerencias similares en todo el inventario
          const suggestions = state.asignadosData
            .filter(item =>
              item.articuloNombre.toLowerCase().includes(value.toLowerCase().substring(0, 3)) ||
              item.asignadoA.toLowerCase().includes(value.toLowerCase().substring(0, 3))
            )
            .slice(0, 3)
            .map(item => item.articuloNombre)

          if (suggestions.length > 0) {
            showWarning({
              title: "Sin resultados exactos",
              description: `¿Te refieres a: ${suggestions.join(", ")}?`,
            })
          } else {
            showWarning({
              title: "Sin resultados",
              description: `No se encontraron asignaciones que coincidan con "${value}"`,
            })
          }
        } else if (filteredAssignments.length > 0 && value === searchTerm) {
          showInfo({
            title: "Búsqueda completada",
            description: `${filteredAssignments.length} asignación(es) encontrada(s)`,
          })
        }
      }, 500)
    }
  }

  /**
   * Obtiene el ícono de ordenamiento para una columna específica
   * @param key La clave de la columna
   */
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    if (sortConfig.direction === "ascending") {
      return <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  // Extrae categorías, marcas y estados únicos para los filtros usando el inventario
  const allCategories = useMemo(() => {
    const categories = new Set((state.inventoryData || []).map(p => p.categoria).filter(Boolean))
    return ["Todas", ...Array.from(categories).sort()]
  }, [state.inventoryData])

  const allBrands = useMemo(() => {
    const brands = new Set((state.inventoryData || []).map(p => p.marca).filter(Boolean))
    return ["Todas", ...Array.from(brands).sort()]
  }, [state.inventoryData])

  const allStatuses = useMemo(() => {
    const statuses = new Set((state.asignadosData || []).map(p => p.estado).filter(Boolean))
    return ["Todos", ...Array.from(statuses).sort()]
  }, [state.asignadosData])

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground mb-6">
        Gestiona los productos asignados a usuarios o departamentos
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre, número de serie o usuario..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={() => { }}>Asignar Masivo</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Estado: {filters.estado}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {allStatuses.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={filters.estado === status}
                      onCheckedChange={() =>
                        setFilters((prev) => ({ ...prev, estado: status }))
                      }
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Categoría: {filters.categoria}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {allCategories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={filters.categoria === category}
                      onCheckedChange={() =>
                        setFilters((prev) => ({ ...prev, categoria: category }))
                      }
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Marca: {filters.marca}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {allBrands.map((brand) => (
                    <DropdownMenuCheckboxItem
                      key={brand}
                      checked={filters.marca === brand}
                      onCheckedChange={() =>
                        setFilters((prev) => ({ ...prev, marca: brand }))
                      }
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

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort("articuloNombre")} className="cursor-pointer">
                Artículo
                {getSortIcon("articuloNombre")}
              </TableHead>
              <TableHead onClick={() => requestSort("numeroSerie")} className="cursor-pointer">
                Número de Serie
                {getSortIcon("numeroSerie")}
              </TableHead>
              <TableHead onClick={() => requestSort("asignadoA")} className="cursor-pointer">
                Asignado A{getSortIcon("asignadoA")}
              </TableHead>
              <TableHead onClick={() => requestSort("fechaAsignacion")} className="cursor-pointer">
                Fecha Asignación
                {getSortIcon("fechaAsignacion")}
              </TableHead>
              <TableHead onClick={() => requestSort("estado")} className="cursor-pointer">
                Estado
                {getSortIcon("estado")}
              </TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No se encontraron asignaciones.
                </TableCell>
              </TableRow>
            ) : (
              sortedAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.articuloNombre}</TableCell>
                  <TableCell>{assignment.numeroSerie || "N/A"}</TableCell>
                  <TableCell>{assignment.asignadoA}</TableCell>
                  <TableCell>{assignment.fechaAsignacion}</TableCell>
                  <TableCell>
                    <StatusBadge status={assignment.estado} />
                  </TableCell>
                  <TableCell>
                    <ActionMenu
                      actions={[
                        {
                          label: "Ver detalles",
                          onClick: () => { },
                          icon: ArrowUpRight
                        },
                        {
                          label: "Devolver",
                          onClick: () => handleReturnAssignment(assignment),
                        }
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
      />
    </div>
  )
}
