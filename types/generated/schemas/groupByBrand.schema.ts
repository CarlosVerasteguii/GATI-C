import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';
import { BrandOrderByWithAggregationInputObjectSchema } from './objects/BrandOrderByWithAggregationInput.schema';
import { BrandScalarWhereWithAggregatesInputObjectSchema } from './objects/BrandScalarWhereWithAggregatesInput.schema';
import { BrandScalarFieldEnumSchema } from './enums/BrandScalarFieldEnum.schema';
import { BrandCountAggregateInputObjectSchema } from './objects/BrandCountAggregateInput.schema';
import { BrandMinAggregateInputObjectSchema } from './objects/BrandMinAggregateInput.schema';
import { BrandMaxAggregateInputObjectSchema } from './objects/BrandMaxAggregateInput.schema';

export const BrandGroupBySchema: z.ZodType<Prisma.BrandGroupByArgs> = z.object({ where: BrandWhereInputObjectSchema.optional(), orderBy: z.union([BrandOrderByWithAggregationInputObjectSchema, BrandOrderByWithAggregationInputObjectSchema.array()]).optional(), having: BrandScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(BrandScalarFieldEnumSchema), _count: z.union([ z.literal(true), BrandCountAggregateInputObjectSchema ]).optional(), _min: BrandMinAggregateInputObjectSchema.optional(), _max: BrandMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BrandGroupByArgs>;

export const BrandGroupByZodSchema = z.object({ where: BrandWhereInputObjectSchema.optional(), orderBy: z.union([BrandOrderByWithAggregationInputObjectSchema, BrandOrderByWithAggregationInputObjectSchema.array()]).optional(), having: BrandScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(BrandScalarFieldEnumSchema), _count: z.union([ z.literal(true), BrandCountAggregateInputObjectSchema ]).optional(), _min: BrandMinAggregateInputObjectSchema.optional(), _max: BrandMaxAggregateInputObjectSchema.optional() }).strict();