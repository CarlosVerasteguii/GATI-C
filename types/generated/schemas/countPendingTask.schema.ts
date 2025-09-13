import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { PendingTaskOrderByWithRelationInputObjectSchema } from './objects/PendingTaskOrderByWithRelationInput.schema';
import { PendingTaskWhereInputObjectSchema } from './objects/PendingTaskWhereInput.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './objects/PendingTaskWhereUniqueInput.schema';
import { PendingTaskCountAggregateInputObjectSchema } from './objects/PendingTaskCountAggregateInput.schema';

export const PendingTaskCountSchema: z.ZodType<Prisma.PendingTaskCountArgs> = z.object({ orderBy: z.union([PendingTaskOrderByWithRelationInputObjectSchema, PendingTaskOrderByWithRelationInputObjectSchema.array()]).optional(), where: PendingTaskWhereInputObjectSchema.optional(), cursor: PendingTaskWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PendingTaskCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.PendingTaskCountArgs>;

export const PendingTaskCountZodSchema = z.object({ orderBy: z.union([PendingTaskOrderByWithRelationInputObjectSchema, PendingTaskOrderByWithRelationInputObjectSchema.array()]).optional(), where: PendingTaskWhereInputObjectSchema.optional(), cursor: PendingTaskWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PendingTaskCountAggregateInputObjectSchema ]).optional() }).strict();