import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { PendingTaskOrderByWithRelationInputObjectSchema } from './objects/PendingTaskOrderByWithRelationInput.schema';
import { PendingTaskWhereInputObjectSchema } from './objects/PendingTaskWhereInput.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './objects/PendingTaskWhereUniqueInput.schema';
import { PendingTaskCountAggregateInputObjectSchema } from './objects/PendingTaskCountAggregateInput.schema';
import { PendingTaskMinAggregateInputObjectSchema } from './objects/PendingTaskMinAggregateInput.schema';
import { PendingTaskMaxAggregateInputObjectSchema } from './objects/PendingTaskMaxAggregateInput.schema';

export const PendingTaskAggregateSchema: z.ZodType<Prisma.PendingTaskAggregateArgs> = z.object({ orderBy: z.union([PendingTaskOrderByWithRelationInputObjectSchema, PendingTaskOrderByWithRelationInputObjectSchema.array()]).optional(), where: PendingTaskWhereInputObjectSchema.optional(), cursor: PendingTaskWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), PendingTaskCountAggregateInputObjectSchema ]).optional(), _min: PendingTaskMinAggregateInputObjectSchema.optional(), _max: PendingTaskMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PendingTaskAggregateArgs>;

export const PendingTaskAggregateZodSchema = z.object({ orderBy: z.union([PendingTaskOrderByWithRelationInputObjectSchema, PendingTaskOrderByWithRelationInputObjectSchema.array()]).optional(), where: PendingTaskWhereInputObjectSchema.optional(), cursor: PendingTaskWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), PendingTaskCountAggregateInputObjectSchema ]).optional(), _min: PendingTaskMinAggregateInputObjectSchema.optional(), _max: PendingTaskMaxAggregateInputObjectSchema.optional() }).strict();