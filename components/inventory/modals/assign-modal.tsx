'use client';

// Imports de React y hooks
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/app-context';
// Imports de Zod y React Hook Form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// Imports de Componentes de UI
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    quantity: z.coerce.number().min(1, "Debe ser al menos 1"),
    assignee: z.string().min(1, "Debe seleccionar un responsable"),
});

type AssignModalProps = {
    isOpen: boolean;
    onClose: () => void;
    productData: any | null;
};

export function AssignModal({ isOpen, onClose, productData }: AssignModalProps) {
    const { state, addUserToUsersData } = useApp(); // Obtenemos usuarios y función desde el contexto

    // Convertimos los usuarios del contexto al formato que espera el componente
    const users = state.usersData.map(user => ({
        value: user.id.toString(),
        label: user.nombre
    }));

    // Estados separados como en BrandCombobox
    const [open, setOpen] = useState(false); // Estado para controlar el Popover
    const [inputValue, setInputValue] = useState(""); // Estado para el input de búsqueda

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { quantity: 1, assignee: "" },
    });

    // Limpiar formulario y estados cuando el modal se abre/cierra
    useEffect(() => {
        if (isOpen) {
            form.reset({ quantity: 1, assignee: "" });
            setInputValue("");
            setOpen(false);
        }
    }, [isOpen, form]);

    // Sincronizar inputValue con el valor seleccionado (como en BrandCombobox)
    const assigneeValue = form.watch("assignee");
    useEffect(() => {
        if (!open && assigneeValue) {
            const selectedUser = users.find(user => user.value === assigneeValue);
            setInputValue(selectedUser?.label || "");
        }
    }, [assigneeValue, users, open]);

    const handleSelectUser = (userValue: string) => {
        form.setValue("assignee", userValue);
        const selectedUser = users.find(user => user.value === userValue);
        setInputValue(selectedUser?.label || "");
        setOpen(false);
    };

    const handleCreateNewUser = () => {
        if (inputValue && !users.some(user => user.label.toLowerCase() === inputValue.toLowerCase())) {
            // Crear un nuevo usuario en el contexto
            const newUser = {
                id: Math.max(...state.usersData.map(u => u.id), 0) + 1, // Generar nuevo ID
                nombre: inputValue,
                email: `${inputValue.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Email temporal
                rol: "Lector" as const // Rol por defecto
            };
            addUserToUsersData(newUser);
            form.setValue("assignee", newUser.id.toString());
            setInputValue(inputValue); // Mantener el nombre en el input
            setOpen(false);
        }
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Datos del formulario (versión final):", {
            productId: productData?.product.id,
            ...values,
        });
        form.reset();
        setInputValue("");
        onClose();
    }

    const handleClose = () => {
        form.reset();
        setInputValue("");
        setOpen(false);
        onClose();
    };

    if (!productData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Asignar: {productData.product.nombre}</DialogTitle>
                    <DialogDescription>
                        Disponible: {productData.summary.disponible} unidades.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cantidad a Asignar</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="1" max={productData.summary.disponible} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="assignee"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Asignar a</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value
                                                        ? users.find((user) => user.value === field.value)?.label || inputValue
                                                        : "Seleccionar usuario..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Buscar usuario..."
                                                    value={inputValue}
                                                    onValueChange={setInputValue}
                                                />
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
                                                        {users.map((user) => (
                                                            <CommandItem
                                                                value={user.label}
                                                                key={user.value}
                                                                onSelect={() => handleSelectUser(user.value)}
                                                            >
                                                                <Check
                                                                    className={cn("mr-2 h-4 w-4", user.value === field.value ? "opacity-100" : "opacity-0")}
                                                                />
                                                                {user.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
                            <Button type="submit">Asignar Activo</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 