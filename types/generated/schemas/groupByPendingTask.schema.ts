import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { PendingTaskWhereInputObjectSchema } from './objects/PendingTaskWhereInput.schema';
import { PendingTaskOrderByWithAggregationInputObjectSchema } from './objects/PendingTaskOrderByWithAggregationInput.schema';
import { PendingTaskScalarWhereWithAggregatesInputObjectSchema } from './objects/PendingTaskScalarWhereWithAggregatesInput.schema';
import { PendingTaskScalarFieldEnumSchema } from './enums/PendingTaskScalarFieldEnum.schema';
import { PendingTaskCountAggregateInputObjectSchema } from './objects/PendingTaskCountAggregateInput.schema';
import { PendingTaskMinAggregateInputObjectSchema } from './objects/PendingTaskMinAggregateInput.schema';
import { PendingTaskMaxAggregateInputObjectSchema } from './objects/PendingTaskMaxAggregateInput.schema';

export const PendingTaskGroupBySchema: z.ZodType<Prisma.PendingTaskGroupByArgs> = z.object({ where: PendingTaskWhereInputObjectSchema.optional(), orderBy: z.union([PendingTaskOrderByWithAggregationInputObjectSchema, PendingTaskOrderByWithAggregationInputObjectSchema.array()]).optional(), having: PendingTaskScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(PendingTaskScalarFieldEnumSchema), _count: z.union([ z.literal(true), PendingTaskCountAggregateInputObjectSchema ]).optional(), _min: PendingTaskMinAggregateInputObjectSchema.optional(), _max: PendingTaskMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PendingTaskGroupByArgs>;

export const PendingTaskGroupByZodSchema = z.object({ where: PendingTaskWhereInputObjectSchema.optional(), orderBy: z.union([PendingTaskOrderByWithAggregationInputObjectSchema, PendingTaskOrderByWithAggregationInputObjectSchema.array()]).optional(), having: PendingTaskScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(PendingTaskScalarFieldEnumSchema), _count: z.union([ z.literal(true), PendingTaskCountAggregateInputObjectSchema ]).optional(), _min: PendingTaskMinAggregateInputObjectSchema.optional(), _max: PendingTaskMaxAggregateInputObjectSchema.optional() }).strict();