"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useApp } from "@/contexts/app-context"
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"

interface ProviderComboboxProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function ProviderCombobox({ value, onValueChange, placeholder = "Selecciona un proveedor" }: ProviderComboboxProps) {
  const { state, updateProveedores, addRecentActivity } = useApp()
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue === value ? "" : currentValue)
    setInputValue(currentValue)
    setOpen(false)
  }

  const handleCreateNewProvider = () => {
    if (inputValue && !state.proveedores.includes(inputValue)) {
      const newProveedores = [...state.proveedores, inputValue].sort()
      updateProveedores(newProveedores)
      onValueChange(inputValue)
      setOpen(false)
      showSuccess({
        title: "Proveedor Añadido",
        description: `"${inputValue}" ha sido añadido a los proveedores disponibles.`
      })
      addRecentActivity({
        type: "Gestión de Atributos",
        description: `Proveedor "${inputValue}" añadido`,
        date: new Date().toLocaleString(),
        details: { newProvider: inputValue },
      })
    } else if (inputValue && state.proveedores.includes(inputValue)) {
      showError({
        title: "Proveedor Existente",
        description: `"${inputValue}" ya existe en la lista de proveedores.`
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar proveedor..." value={inputValue} onValueChange={setInputValue} />
          <CommandList>
            <CommandEmpty>
              <div className="p-2">
                <p className="text-sm text-muted-foreground mb-2">No se encontró el proveedor.</p>
                <Button size="sm" onClick={handleCreateNewProvider} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear nuevo proveedor: "{inputValue}"
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {state.proveedores.map((proveedor) => (
                <CommandItem key={proveedor} value={proveedor} onSelect={() => handleSelect(proveedor)}>
                  <Check className={cn("mr-2 h-4 w-4", value === proveedor ? "opacity-100" : "opacity-0")} />
                  {proveedor}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 