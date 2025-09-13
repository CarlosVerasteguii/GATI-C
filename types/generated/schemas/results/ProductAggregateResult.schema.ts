import { z } from 'zod';
export const ProductAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    serialNumber: z.number(),
    description: z.number(),
    cost: z.number(),
    purchaseDate: z.number(),
    condition: z.number(),
    brandId: z.number(),
    categoryId: z.number(),
    locationId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    documents: z.number(),
    brand: z.number(),
    category: z.number(),
    location: z.number()
  }).optional(),
  _sum: z.object({
    cost: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    cost: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    serialNumber: z.string().nullable(),
    description: z.string().nullable(),
    cost: z.number().nullable(),
    purchaseDate: z.date().nullable(),
    condition: z.string().nullable(),
    brandId: z.string().nullable(),
    categoryId: z.string().nullable(),
    locationId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    serialNumber: z.string().nullable(),
    description: z.string().nullable(),
    cost: z.number().nullable(),
    purchaseDate: z.date().nullable(),
    condition: z.string().nullable(),
    brandId: z.string().nullable(),
    categoryId: z.string().nullable(),
    locationId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});