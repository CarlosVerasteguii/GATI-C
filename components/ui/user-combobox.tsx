"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useApp } from "@/contexts/app-context"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { showSuccess, showError } from "@/hooks/use-toast"
import { User } from "@/types/inventory"

interface UserComboboxProps {
    value: User | null
    onValueChange: (user: User | null) => void
    placeholder?: string
    currentUserRole: 'Administrador' | 'Editor' | 'Lector';
}

export function UserCombobox({ value, onValueChange, placeholder = "Selecciona un usuario", currentUserRole }: UserComboboxProps) {
    const { addRecentActivity } = useApp()
    const { users, addUser } = useAuthStore() as any
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(value?.nombre || "")

    React.useEffect(() => {
        setInputValue(value?.nombre || "")
    }, [value])

    const handleSelect = (user: User) => {
        const newValue = user === value ? null : user
        onValueChange(newValue)
        setInputValue(newValue?.nombre || "")
        setOpen(false)
    }

    const handleCreateNewUser = () => {
        const existingUser = users.find((u: User) => u.nombre.toLowerCase() === inputValue.toLowerCase());

        if (inputValue && !existingUser) {
            const newUser: User = {
                id: Math.max(0, ...users.map((u: User) => u.id)) + 1,
                nombre: inputValue,
                email: `${inputValue.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Email de ejemplo
                rol: "Lector",
            } as User;

            addUser(newUser);
            onValueChange(newUser);
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
                    {value?.nombre ? value.nombre : placeholder}
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
                                {currentUserRole === 'Administrador' && (
                                    <Button size="sm" onClick={handleCreateNewUser} className="w-full">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Crear nuevo usuario: "{inputValue}"
                                    </Button>
                                )}
                            </div>
                        </CommandEmpty>
                        <CommandGroup>
                            {users.map((user: User) => (
                                <CommandItem key={user.id} value={user.nombre} onSelect={() => handleSelect(user)}>
                                    <Check className={cn("mr-2 h-4 w-4", value?.id === user.id ? "opacity-100" : "opacity-0")} />
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