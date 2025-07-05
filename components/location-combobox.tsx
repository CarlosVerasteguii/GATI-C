"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useApp } from "@/contexts/app-context"
import { showError, showSuccess } from "@/hooks/use-toast"

interface LocationComboboxProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
}

export function LocationCombobox({ value, onValueChange, placeholder = "Selecciona una ubicación" }: LocationComboboxProps) {
    const { state, updateUbicaciones, addRecentActivity } = useApp()
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

    const handleCreateNewLocation = () => {
        if (inputValue && !state.ubicaciones.some(loc => loc.toLowerCase() === inputValue.toLowerCase())) {
            const newUbicaciones = [...state.ubicaciones, inputValue].sort()
            updateUbicaciones(newUbicaciones)
            onValueChange(inputValue)
            setOpen(false)
            showSuccess({
                title: "Ubicación Añadida",
                description: `"${inputValue}" ha sido añadida a las ubicaciones disponibles.`
            })
            addRecentActivity({
                type: "Gestión de Atributos",
                description: `Ubicación "${inputValue}" añadida`,
                date: new Date().toLocaleString(),
                details: { newLocation: inputValue },
            })
        } else if (inputValue && state.ubicaciones.some(loc => loc.toLowerCase() === inputValue.toLowerCase())) {
            showError({
                title: "Ubicación Existente",
                description: `"${inputValue}" ya existe en la lista de ubicaciones.`
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
                    <CommandInput placeholder="Buscar ubicación..." value={inputValue} onValueChange={setInputValue} />
                    <CommandList>
                        <CommandEmpty>
                            <div className="p-2">
                                <p className="text-sm text-muted-foreground mb-2">No se encontró la ubicación.</p>
                                <Button size="sm" onClick={handleCreateNewLocation} className="w-full">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Crear nueva ubicación: "{inputValue}"
                                </Button>
                            </div>
                        </CommandEmpty>
                        <CommandGroup>
                            {state.ubicaciones.map((location) => (
                                <CommandItem key={location} value={location} onSelect={() => handleSelect(location)}>
                                    <Check className={cn("mr-2 h-4 w-4", value === location ? "opacity-100" : "opacity-0")} />
                                    {location}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
} 