'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreateProduct } from '@/lib/api/hooks/use-create-product';
import type { CreateProductData } from '@/lib/api/endpoints/inventory';
import { CreateProductSchema } from '@/lib/api/schemas/inventory';

export type CreateProductDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    // Optional controlled option lists; replace with real data later
    brands?: Array<{ id: string; name: string }>;
    categories?: Array<{ id: string; name: string }>;
};

type CreateProductForm = z.infer<typeof CreateProductSchema>;

const defaultBrands = [
    { id: 'b1', name: 'Marca A' },
    { id: 'b2', name: 'Marca B' },
];

const defaultCategories = [
    { id: 'c1', name: 'Categoría X' },
    { id: 'c2', name: 'Categoría Y' },
];

export default function CreateProductDialog({ isOpen, onOpenChange, brands = defaultBrands, categories = defaultCategories }: CreateProductDialogProps) {
    const { toast } = useToast();
    const { createProduct, isCreating } = useCreateProduct();

    const form = useForm<CreateProductForm>({
        resolver: zodResolver(CreateProductSchema),
        defaultValues: {
            name: '',
            serialNumber: '',
            brandId: '',
            categoryId: '',
        },
        mode: 'onSubmit',
    });

    async function onSubmit(values: CreateProductForm) {
        const payload: CreateProductData = {
            name: values.name,
            serialNumber: values.serialNumber || undefined,
            brandId: values.brandId,
            categoryId: values.categoryId,
        } as CreateProductData;

        try {
            await createProduct(payload);
            toast({ title: 'Producto creado', description: 'Producto creado correctamente.' });
            form.reset();
            onOpenChange(false);
        } catch (error: any) {
            toast({ title: 'Error', description: error?.message ?? 'No se pudo crear el producto', variant: 'destructive' });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Crear Producto</DialogTitle>
                    <DialogDescription>Completa los campos para registrar un nuevo producto.</DialogDescription>
                </DialogHeader>

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
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? 'Creando...' : 'Crear'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


