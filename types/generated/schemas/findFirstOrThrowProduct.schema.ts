import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { ProductIncludeObjectSchema } from './objects/ProductInclude.schema';
import { ProductOrderByWithRelationInputObjectSchema } from './objects/ProductOrderByWithRelationInput.schema';
import { ProductWhereInputObjectSchema } from './objects/ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema } from './objects/ProductWhereUniqueInput.schema';
import { ProductScalarFieldEnumSchema } from './enums/ProductScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ProductFindFirstOrThrowSelectSchema: z.ZodType<Prisma.ProductSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    serialNumber: z.boolean().optional(),
    description: z.boolean().optional(),
    cost: z.boolean().optional(),
    purchaseDate: z.boolean().optional(),
    condition: z.boolean().optional(),
    brandId: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    locationId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    documents: z.boolean().optional(),
    brand: z.boolean().optional(),
    category: z.boolean().optional(),
    location: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ProductSelect>;

export const ProductFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    serialNumber: z.boolean().optional(),
    description: z.boolean().optional(),
    cost: z.boolean().optional(),
    purchaseDate: z.boolean().optional(),
    condition: z.boolean().optional(),
    brandId: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    locationId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    documents: z.boolean().optional(),
    brand: z.boolean().optional(),
    category: z.boolean().optional(),
    location: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ProductFindFirstOrThrowSchema: z.ZodType<Prisma.ProductFindFirstOrThrowArgs> = z.object({ select: ProductFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => ProductIncludeObjectSchema.optional()), orderBy: z.union([ProductOrderByWithRelationInputObjectSchema, ProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductWhereInputObjectSchema.optional(), cursor: ProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductFindFirstOrThrowArgs>;

export const ProductFindFirstOrThrowZodSchema = z.object({ select: ProductFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => ProductIncludeObjectSchema.optional()), orderBy: z.union([ProductOrderByWithRelationInputObjectSchema, ProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductWhereInputObjectSchema.optional(), cursor: ProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array()]).optional() }).strict();