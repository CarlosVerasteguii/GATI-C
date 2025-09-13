import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { TaskAuditLogOrderByWithRelationInputObjectSchema } from './objects/TaskAuditLogOrderByWithRelationInput.schema';
import { TaskAuditLogWhereInputObjectSchema } from './objects/TaskAuditLogWhereInput.schema';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './objects/TaskAuditLogWhereUniqueInput.schema';
import { TaskAuditLogCountAggregateInputObjectSchema } from './objects/TaskAuditLogCountAggregateInput.schema';

export const TaskAuditLogCountSchema: z.ZodType<Prisma.TaskAuditLogCountArgs> = z.object({ orderBy: z.union([TaskAuditLogOrderByWithRelationInputObjectSchema, TaskAuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskAuditLogWhereInputObjectSchema.optional(), cursor: TaskAuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskAuditLogCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskAuditLogCountArgs>;

export const TaskAuditLogCountZodSchema = z.object({ orderBy: z.union([TaskAuditLogOrderByWithRelationInputObjectSchema, TaskAuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskAuditLogWhereInputObjectSchema.optional(), cursor: TaskAuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), TaskAuditLogCountAggregateInputObjectSchema ]).optional() }).strict();