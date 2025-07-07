"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useApp } from "@/contexts/app-context"
import { showSuccess, showError } from "@/hooks/use-toast"
import { User } from "@/types/inventory"

interface UserComboboxProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
}

export function UserCombobox({ value, onValueChange, placeholder = "Selecciona un usuario" }: UserComboboxProps) {
    const { state, addUserToUsersData, addRecentActivity } = useApp()
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(value)

    React.useEffect(() => {
        setInputValue(value)
    }, [value])

    const handleSelect = (currentValue: string) => {
        const newValue = currentValue === value ? "" : currentValue
        onValueChange(newValue)
        setInputValue(newValue)
        setOpen(false)
    }

    const handleCreateNewUser = () => {
        const existingUser = state.usersData.find(u => u.nombre.toLowerCase() === inputValue.toLowerCase());

        if (inputValue && !existingUser) {
            const newUser: User = {
                id: Math.max(0, ...state.usersData.map(u => u.id)) + 1,
                nombre: inputValue,
                email: `${inputValue.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Email de ejemplo
                rol: "Lector", // Rol por defecto
                password: "password123" // Contraseña temporal
            };

            addUserToUsersData(newUser);
            onValueChange(inputValue);
            setOpen(false);

            showSuccess({
                title: "Usuario Creado",
                description: `El usuario "${inputValue}" ha sido creado con rol de Lector.`
            });

            addRecentActivity({
                type: "Gestión de Usuarios",
                description: `Usuario "${inputValue}" creado`,
                date: new Date().toLocaleString(),
                details: { newUser: newUser.nombre, role: newUser.rol },
            });
        } else if (existingUser) {
            showError({
                title: "Usuario Existente",
                description: `El usuario "${inputValue}" ya existe.`
            });
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
                    <CommandInput placeholder="Buscar usuario..." value={inputValue} onValueChange={setInputValue} />
                    <CommandList>
                        <CommandEmpty>
                            <div className="p-2">
                                <p className="text-sm text-muted-foreground mb-2">No se encontró el usuario.</p>
                                <Button size="sm" onClick={handleCreateNewUser} className="w-full">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Crear nuevo usuario: "{inputValue}"
                                </Button>
                            </div>
                        </CommandEmpty>
                        <CommandGroup>
                            {state.usersData.map((user) => (
                                <CommandItem key={user.id} value={user.nombre} onSelect={() => handleSelect(user.nombre)}>
                                    <Check className={cn("mr-2 h-4 w-4", value === user.nombre ? "opacity-100" : "opacity-0")} />
                                    {user.nombre}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
} 