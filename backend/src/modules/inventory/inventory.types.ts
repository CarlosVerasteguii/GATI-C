import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    serial_number: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    cost: z.number().positive().optional().nullable(),
    purchase_date: z.string().datetime().optional().nullable(),
    condition: z.string().optional().nullable(),
    brandId: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    locationId: z.string().optional().nullable(),
});

export type CreateProductData = z.infer<typeof createProductSchema>;

// Esquema para actualización parcial de producto: todos los campos opcionales
export const updateProductSchema = z.object({
    name: z.string().min(1, 'El nombre no puede estar vacío').optional(),
    serial_number: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    cost: z.number().positive().optional().nullable(),
    purchase_date: z.string().datetime().optional().nullable(),
    condition: z.string().optional().nullable(),
    brandId: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    locationId: z.string().optional().nullable(),
});

export type UpdateProductData = z.infer<typeof updateProductSchema>;


