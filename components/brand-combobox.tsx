"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useApp } from "@/contexts/app-context"
import { showError, showSuccess, showInfo } from "@/hooks/use-toast"

interface BrandComboboxProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function BrandCombobox({ value, onValueChange, placeholder = "Selecciona una marca" }: BrandComboboxProps) {
  const { state, updateMarcas, addRecentActivity } = useApp()
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

  const handleCreateNewBrand = () => {
    if (inputValue && !state.marcas.includes(inputValue)) {
      const newMarcas = [...state.marcas, inputValue].sort()
      updateMarcas(newMarcas)
      onValueChange(inputValue)
      setOpen(false)
      showSuccess({
        title: "Marca Añadida",
        description: `"${inputValue}" ha sido añadida a las marcas disponibles.`
      })
      addRecentActivity({
        type: "Gestión de Atributos",
        description: `Marca "${inputValue}" añadida`,
        date: new Date().toLocaleString(),
        details: { newBrand: inputValue },
      })
    } else if (inputValue && state.marcas.includes(inputValue)) {
      showError({
        title: "Marca Existente",
        description: `"${inputValue}" ya existe en la lista de marcas.`
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
          <CommandInput placeholder="Buscar marca..." value={inputValue} onValueChange={setInputValue} />
          <CommandList>
            <CommandEmpty>
              <div className="p-2">
                <p className="text-sm text-muted-foreground mb-2">No se encontró la marca.</p>
                <Button size="sm" onClick={handleCreateNewBrand} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear nueva marca: "{inputValue}"
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {state.marcas.map((marca) => (
                <CommandItem key={marca} value={marca} onSelect={() => handleSelect(marca)}>
                  <Check className={cn("mr-2 h-4 w-4", value === marca ? "opacity-100" : "opacity-0")} />
                  {marca}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
