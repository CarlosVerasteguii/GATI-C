import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { BrandOrderByWithRelationInputObjectSchema } from './objects/BrandOrderByWithRelationInput.schema';
import { BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';
import { BrandWhereUniqueInputObjectSchema } from './objects/BrandWhereUniqueInput.schema';
import { BrandCountAggregateInputObjectSchema } from './objects/BrandCountAggregateInput.schema';

export const BrandCountSchema: z.ZodType<Prisma.BrandCountArgs> = z.object({ orderBy: z.union([BrandOrderByWithRelationInputObjectSchema, BrandOrderByWithRelationInputObjectSchema.array()]).optional(), where: BrandWhereInputObjectSchema.optional(), cursor: BrandWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BrandCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.BrandCountArgs>;

export const BrandCountZodSchema = z.object({ orderBy: z.union([BrandOrderByWithRelationInputObjectSchema, BrandOrderByWithRelationInputObjectSchema.array()]).optional(), where: BrandWhereInputObjectSchema.optional(), cursor: BrandWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BrandCountAggregateInputObjectSchema ]).optional() }).strict();