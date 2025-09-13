"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useApp } from "@/contexts/app-context"

interface ProductSearchComboboxProps {
  value: number | null // Product ID
  onValueChange: (value: number | null) => void
  placeholder?: string
  filterByStatus?: string[] // Optional: filter products by status
}

export function ProductSearchCombobox({
  value,
  onValueChange,
  placeholder = "Buscar producto...",
  filterByStatus,
}: ProductSearchComboboxProps) {
  const { state } = useApp()
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredProducts = React.useMemo(() => {
    let products = state.inventoryData

    // Apply status filter if provided
    if (filterByStatus && filterByStatus.length > 0) {
      products = products.filter((product) => filterByStatus.includes(product.estado))
    }

    // Apply search term filter
    if (searchTerm) {
      products = products.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.numeroSerie && product.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Group non-serialized items by name/model and show available quantity
    const groupedProducts: {
      id: number
      name: string
      serial: string | null
      display: string
      isSerialized: boolean
      availableQty?: number
    }[] = []

    const nonSerializedMap = new Map<string, { id: number; name: string; model: string; availableQty: number }>()

    products.forEach((product) => {
      if (product.numeroSerie === null) {
        const key = `${product.nombre}-${product.modelo}`
        if (product.estado === "Disponible") {
          const existing = nonSerializedMap.get(key)
          if (existing) {
            existing.availableQty += product.cantidad
          } else {
            nonSerializedMap.set(key, {
              id: product.id,
              name: product.nombre,
              model: product.modelo,
              availableQty: product.cantidad,
            })
          }
        }
      } else {
        groupedProducts.push({
          id: product.id,
          name: product.nombre,
          serial: product.numeroSerie,
          display: `${product.nombre} (N/S: ${product.numeroSerie}) - ${product.estado}`,
          isSerialized: true,
        })
      }
    })

    nonSerializedMap.forEach((item) => {
      if (item.availableQty > 0) {
        groupedProducts.push({
          id: item.id, // Use the ID of one of the available instances
          name: item.name,
          serial: null,
          display: `${item.name} (QTY Disponible: ${item.availableQty})`,
          isSerialized: false,
          availableQty: item.availableQty,
        })
      }
    })

    return groupedProducts
  }, [state.inventoryData, searchTerm, filterByStatus])

  const selectedProduct = value ? state.inventoryData.find((p) => p.id === value) : null
  const displayValue = selectedProduct
    ? selectedProduct.numeroSerie
      ? `${selectedProduct.nombre} (N/S: ${selectedProduct.numeroSerie})`
      : `${selectedProduct.nombre} (QTY: ${selectedProduct.cantidad})`
    : ""

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar producto..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <CommandList>
            <CommandEmpty>No se encontró el producto.</CommandEmpty>
            <CommandGroup>
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.display} // Use display for search matching
                  onSelect={() => {
                    onValueChange(product.id)
                    setOpen(false)
                    setSearchTerm("") // Clear search term after selection
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === product.id ? "opacity-100" : "opacity-0")} />
                  {product.display}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
