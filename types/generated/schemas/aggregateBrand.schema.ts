import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { BrandOrderByWithRelationInputObjectSchema } from './objects/BrandOrderByWithRelationInput.schema';
import { BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';
import { BrandWhereUniqueInputObjectSchema } from './objects/BrandWhereUniqueInput.schema';
import { BrandCountAggregateInputObjectSchema } from './objects/BrandCountAggregateInput.schema';
import { BrandMinAggregateInputObjectSchema } from './objects/BrandMinAggregateInput.schema';
import { BrandMaxAggregateInputObjectSchema } from './objects/BrandMaxAggregateInput.schema';

export const BrandAggregateSchema: z.ZodType<Prisma.BrandAggregateArgs> = z.object({ orderBy: z.union([BrandOrderByWithRelationInputObjectSchema, BrandOrderByWithRelationInputObjectSchema.array()]).optional(), where: BrandWhereInputObjectSchema.optional(), cursor: BrandWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), BrandCountAggregateInputObjectSchema ]).optional(), _min: BrandMinAggregateInputObjectSchema.optional(), _max: BrandMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BrandAggregateArgs>;

export const BrandAggregateZodSchema = z.object({ orderBy: z.union([BrandOrderByWithRelationInputObjectSchema, BrandOrderByWithRelationInputObjectSchema.array()]).optional(), where: BrandWhereInputObjectSchema.optional(), cursor: BrandWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), BrandCountAggregateInputObjectSchema ]).optional(), _min: BrandMinAggregateInputObjectSchema.optional(), _max: BrandMaxAggregateInputObjectSchema.optional() }).strict();