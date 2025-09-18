'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUpdateProduct } from '@/lib/api/hooks/use-update-product';
import { useProduct } from '@/lib/api/hooks/use-inventory';
import type { UpdateProductData } from '@/lib/api/endpoints/inventory';
import { Skeleton } from '@/components/ui/skeleton';

export type EditProductDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    productId: string | null;
    // Optional controlled option lists; replace with real data later
    brands?: Array<{ id: string; name: string }>;
    categories?: Array<{ id: string; name: string }>;
};

// MVP fields schema for editing (essential subset)
const EditProductSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    serialNumber: z.string().optional().or(z.literal('')),
    brandId: z.string().min(1, 'Selecciona una marca'),
    categoryId: z.string().min(1, 'Selecciona una categoría'),
});

type EditProductForm = z.infer<typeof EditProductSchema>;

const defaultBrands = [
    { id: 'b1', name: 'Marca A' },
    { id: 'b2', name: 'Marca B' },
];

const defaultCategories = [
    { id: 'c1', name: 'Categoría X' },
    { id: 'c2', name: 'Categoría Y' },
];

export default function EditProductDialog({ isOpen, onOpenChange, productId, brands = defaultBrands, categories = defaultCategories }: EditProductDialogProps) {
    const { toast } = useToast();
    const { updateProduct, isUpdating } = useUpdateProduct();
    const { data: product, isLoading } = useProduct(isOpen ? productId : null);

    const form = useForm<EditProductForm>({
        resolver: zodResolver(EditProductSchema),
        defaultValues: {
            name: '',
            serialNumber: '',
            brandId: '',
            categoryId: '',
        },
        mode: 'onSubmit',
    });

    // Populate form when fetched product changes
    useEffect(() => {
        if (isOpen && product) {
            form.reset({
                name: product.name ?? '',
                serialNumber: product.serialNumber ?? '',
                brandId: (product as any).brandId ?? '',
                categoryId: (product as any).categoryId ?? '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, product]);

    async function onSubmit(values: EditProductForm) {
        if (!productId) return;
        const payload: UpdateProductData = {
            name: values.name,
            serialNumber: values.serialNumber || undefined,
            brandId: values.brandId,
            categoryId: values.categoryId,
        };

        try {
            await updateProduct({ id: productId, data: payload });
            toast({ title: 'Producto actualizado', description: 'Los cambios fueron guardados correctamente.' });
            onOpenChange(false);
        } catch (error: any) {
            toast({ title: 'Error', description: error?.message ?? 'No se pudo actualizar el producto', variant: 'destructive' });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar Producto</DialogTitle>
                    <DialogDescription>Modifica los campos esenciales del producto.</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-28" />
                        </div>
                    </div>
                ) : (
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" placeholder="Nombre del producto" {...form.register('name')} />
                            {form.formState.errors.name && (
                                <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="serialNumber">Número de Serie</Label>
                            <Input id="serialNumber" placeholder="Opcional" {...form.register('serialNumber')} />
                        </div>

                        <div>
                            <Label htmlFor="brandId">Marca</Label>
                            <Select
                                value={form.watch('brandId')}
                                onValueChange={(val) => form.setValue('brandId', val, { shouldValidate: true })}
                            >
                                <SelectTrigger id="brandId">
                                    <SelectValue placeholder="Selecciona una marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.brandId && (
                                <p className="mt-1 text-xs text-red-600">{form.formState.errors.brandId.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="categoryId">Categoría</Label>
                            <Select
                                value={form.watch('categoryId')}
                                onValueChange={(val) => form.setValue('categoryId', val, { shouldValidate: true })}
                            >
                                <SelectTrigger id="categoryId">
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.categoryId && (
                                <p className="mt-1 text-xs text-red-600">{form.formState.errors.categoryId.message}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}


