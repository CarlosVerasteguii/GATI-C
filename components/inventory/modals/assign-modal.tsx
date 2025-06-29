'use client';

// Imports de Zod y React Hook Form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Imports de Componentes de UI (con añadidos para ComboBox)
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // Utilidad de Shadcn para clases condicionales

// Importamos nuestro nuevo mock de usuarios
import { mockUsers } from "@/lib/mocks/inventory-mock-data";

// 1. Definir el esquema del formulario con Zod
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
    // 2. Configurar el hook del formulario
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 1,
            assignee: "",
        },
    });

    // 3. Crear la función de envío (por ahora solo muestra en consola)
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Datos del formulario a enviar (con ComboBox):", {
            productId: productData?.product.id,
            ...values,
        });
        form.reset();
        onClose();
    }

    // Limpiamos el formulario cuando el modal se cierra
    const handleClose = () => {
        form.reset();
        onClose();
    }

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

                {/* --- INICIO DEL FORMULARIO --- */}
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

                        {/* --- INICIO DEL NUEVO CAMPO COMBOBOX --- */}
                        <FormField
                            control={form.control}
                            name="assignee"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Asignar a</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? mockUsers.find(
                                                            (user) => user.value === field.value
                                                        )?.label
                                                        : "Seleccionar usuario..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar usuario..." />
                                                <CommandEmpty>No se encontró el usuario.</CommandEmpty>
                                                <CommandList>
                                                    <CommandGroup>
                                                        {mockUsers.map((user) => (
                                                            <CommandItem
                                                                value={user.label}
                                                                key={user.value}
                                                                onSelect={() => {
                                                                    form.setValue("assignee", user.value);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        user.value === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
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
                        {/* --- FIN DEL NUEVO CAMPO COMBOBOX --- */}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
                            <Button type="submit">Asignar Activo</Button>
                        </DialogFooter>
                    </form>
                </Form>
                {/* --- FIN DEL FORMULARIO --- */}

            </DialogContent>
        </Dialog>
    );
} 