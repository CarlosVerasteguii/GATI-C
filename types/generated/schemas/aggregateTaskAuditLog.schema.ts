import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { TaskAuditLogOrderByWithRelationInputObjectSchema } from './objects/TaskAuditLogOrderByWithRelationInput.schema';
import { TaskAuditLogWhereInputObjectSchema } from './objects/TaskAuditLogWhereInput.schema';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './objects/TaskAuditLogWhereUniqueInput.schema';
import { TaskAuditLogCountAggregateInputObjectSchema } from './objects/TaskAuditLogCountAggregateInput.schema';
import { TaskAuditLogMinAggregateInputObjectSchema } from './objects/TaskAuditLogMinAggregateInput.schema';
import { TaskAuditLogMaxAggregateInputObjectSchema } from './objects/TaskAuditLogMaxAggregateInput.schema';

export const TaskAuditLogAggregateSchema: z.ZodType<Prisma.TaskAuditLogAggregateArgs> = z.object({ orderBy: z.union([TaskAuditLogOrderByWithRelationInputObjectSchema, TaskAuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskAuditLogWhereInputObjectSchema.optional(), cursor: TaskAuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), TaskAuditLogCountAggregateInputObjectSchema ]).optional(), _min: TaskAuditLogMinAggregateInputObjectSchema.optional(), _max: TaskAuditLogMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskAuditLogAggregateArgs>;

export const TaskAuditLogAggregateZodSchema = z.object({ orderBy: z.union([TaskAuditLogOrderByWithRelationInputObjectSchema, TaskAuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskAuditLogWhereInputObjectSchema.optional(), cursor: TaskAuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), TaskAuditLogCountAggregateInputObjectSchema ]).optional(), _min: TaskAuditLogMinAggregateInputObjectSchema.optional(), _max: TaskAuditLogMaxAggregateInputObjectSchema.optional() }).strict();