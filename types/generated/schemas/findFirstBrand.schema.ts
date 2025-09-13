import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { BrandIncludeObjectSchema } from './objects/BrandInclude.schema';
import { BrandOrderByWithRelationInputObjectSchema } from './objects/BrandOrderByWithRelationInput.schema';
import { BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';
import { BrandWhereUniqueInputObjectSchema } from './objects/BrandWhereUniqueInput.schema';
import { BrandScalarFieldEnumSchema } from './enums/BrandScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BrandFindFirstSelectSchema: z.ZodType<Prisma.BrandSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.BrandSelect>;

export const BrandFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const BrandFindFirstSchema: z.ZodType<Prisma.BrandFindFirstArgs> = z.object({ select: BrandFindFirstSelectSchema.optional(), include: z.lazy(() => BrandIncludeObjectSchema.optional()), orderBy: z.union([BrandOrderByWithRelationInputObjectSchema, BrandOrderByWithRelationInputObjectSchema.array()]).optional(), where: BrandWhereInputObjectSchema.optional(), cursor: BrandWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BrandScalarFieldEnumSchema, BrandScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.BrandFindFirstArgs>;

export const BrandFindFirstZodSchema = z.object({ select: BrandFindFirstSelectSchema.optional(), include: z.lazy(() => BrandIncludeObjectSchema.optional()), orderBy: z.union([BrandOrderByWithRelationInputObjectSchema, BrandOrderByWithRelationInputObjectSchema.array()]).optional(), where: BrandWhereInputObjectSchema.optional(), cursor: BrandWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BrandScalarFieldEnumSchema, BrandScalarFieldEnumSchema.array()]).optional() }).strict();