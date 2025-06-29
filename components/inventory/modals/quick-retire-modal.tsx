'use client';

// Imports
import React, { useState, useEffect } from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { GroupedProduct } from '@/types/inventory';

// El formulario ahora es completamente opcional
const formSchema = z.object({
    productIdentifier: z.string().optional(),
    notes: z.string().optional(),
});

interface QuickRetireModalProps {
    isOpen: boolean;
    onClose: () => void;
    inventoryItems: GroupedProduct[]; // Recibirá todos los productos para la búsqueda
    productData?: GroupedProduct | null;
}

export function QuickRetireModal({ isOpen, onClose, inventoryItems, productData }: QuickRetireModalProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productIdentifier: productData?.product?.id || "",
            notes: "",
        },
    });

    useEffect(() => {
        form.reset({
            productIdentifier: productData?.product?.id || "",
            notes: "",
        });
    }, [productData, isOpen, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Nueva Tarea Pendiente de Retiro (Unificado):", values);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar Retiro Rápido</DialogTitle>
                    <DialogDescription>
                        {productData
                            ? `Producto seleccionado: ${productData.product.nombre}. Añade notas opcionales.`
                            : "Busca un producto o deja los campos en blanco."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="productIdentifier"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Producto</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-between"
                                                    disabled={!!productData}
                                                >
                                                    {field.value
                                                        ? inventoryItems.find(item => item.product.id === field.value)?.product.nombre
                                                        : "Buscar producto..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command filter={(value, search) => {
                                                const item = inventoryItems.find(i => i.product.id === value)?.product;
                                                if (item && (item.nombre.toLowerCase().includes(search) || item.marca.toLowerCase().includes(search))) return 1;
                                                return 0;
                                            }}>
                                                <CommandInput placeholder="Buscar producto..." />
                                                <CommandEmpty>No se encontró el producto.</CommandEmpty>
                                                <CommandGroup>
                                                    {inventoryItems.map((item) => (
                                                        <CommandItem
                                                            value={item.product.id}
                                                            key={item.product.id}
                                                            onSelect={() => {
                                                                form.setValue("productIdentifier", item.product.id);
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", item.product.id === field.value ? "opacity-100" : "opacity-0")} />
                                                            {item.product.nombre}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas (Opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={
                                                productData
                                                    ? `Especifica cuál(es) ${productData.product.nombre}${productData.product.isSerialized ? ' (incluye números de serie)' : ''} y el motivo del retiro`
                                                    : "Contexto del retiro (ej. 'para proyecto Alfa')"
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button type="submit">Crear Tarea</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 