import { z } from 'zod';

export const createProductSchema = z
    .object({
        name: z.string().min(1, 'El nombre es requerido'),
        serialNumber: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        cost: z.number().positive().optional().nullable(),
        purchaseDate: z.string().datetime().optional().nullable(),
        condition: z.string().optional().nullable(),
        brandId: z.string().optional().nullable(),
        categoryId: z.string().optional().nullable(),
        locationId: z.string().optional().nullable(),
    })
    .transform((data) => ({
        ...data,
        serialNumber: data.serialNumber ?? (data as any).serial_number ?? null,
        purchaseDate: data.purchaseDate ?? (data as any).purchase_date ?? null,
    }));

export type CreateProductData = z.infer<typeof createProductSchema>;

// Esquema para actualización parcial de producto: todos los campos opcionales
export const updateProductSchema = z
    .object({
        name: z.string().min(1, 'El nombre no puede estar vacío').optional(),
        serialNumber: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        cost: z.number().positive().optional().nullable(),
        purchaseDate: z.string().datetime().optional().nullable(),
        condition: z.string().optional().nullable(),
        brandId: z.string().optional().nullable(),
        categoryId: z.string().optional().nullable(),
        locationId: z.string().optional().nullable(),
    })
    .transform((data) => ({
        ...data,
        serialNumber: data.serialNumber ?? (data as any).serial_number ?? null,
        purchaseDate: data.purchaseDate ?? (data as any).purchase_date ?? null,
    }));

export type UpdateProductData = z.infer<typeof updateProductSchema>;
