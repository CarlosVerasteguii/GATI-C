'use client';

// Imports de Zod y React Hook Form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Imports de Componentes de UI
import { Button } from "@/components/ui/button";
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
        console.log("Datos del formulario a enviar:", {
            productId: productData?.product.id,
            ...values,
        });
        onClose(); // Cierra el modal después de enviar
    }

    if (!productData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
                        <FormField
                            control={form.control}
                            name="assignee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Asignar a</FormLabel>
                                    <FormControl>
                                        {/* NOTA: Esto lo cambiaremos por un ComboBox en la siguiente fase */}
                                        <Input placeholder="Buscar usuario..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button type="submit">Asignar Activo</Button>
                        </DialogFooter>
                    </form>
                </Form>
                {/* --- FIN DEL FORMULARIO --- */}

            </DialogContent>
        </Dialog>
    );
} 