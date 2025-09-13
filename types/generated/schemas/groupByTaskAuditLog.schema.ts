import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { TaskAuditLogWhereInputObjectSchema } from './objects/TaskAuditLogWhereInput.schema';
import { TaskAuditLogOrderByWithAggregationInputObjectSchema } from './objects/TaskAuditLogOrderByWithAggregationInput.schema';
import { TaskAuditLogScalarWhereWithAggregatesInputObjectSchema } from './objects/TaskAuditLogScalarWhereWithAggregatesInput.schema';
import { TaskAuditLogScalarFieldEnumSchema } from './enums/TaskAuditLogScalarFieldEnum.schema';
import { TaskAuditLogCountAggregateInputObjectSchema } from './objects/TaskAuditLogCountAggregateInput.schema';
import { TaskAuditLogMinAggregateInputObjectSchema } from './objects/TaskAuditLogMinAggregateInput.schema';
import { TaskAuditLogMaxAggregateInputObjectSchema } from './objects/TaskAuditLogMaxAggregateInput.schema';

export const TaskAuditLogGroupBySchema: z.ZodType<Prisma.TaskAuditLogGroupByArgs> = z.object({ where: TaskAuditLogWhereInputObjectSchema.optional(), orderBy: z.union([TaskAuditLogOrderByWithAggregationInputObjectSchema, TaskAuditLogOrderByWithAggregationInputObjectSchema.array()]).optional(), having: TaskAuditLogScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(TaskAuditLogScalarFieldEnumSchema), _count: z.union([ z.literal(true), TaskAuditLogCountAggregateInputObjectSchema ]).optional(), _min: TaskAuditLogMinAggregateInputObjectSchema.optional(), _max: TaskAuditLogMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskAuditLogGroupByArgs>;

export const TaskAuditLogGroupByZodSchema = z.object({ where: TaskAuditLogWhereInputObjectSchema.optional(), orderBy: z.union([TaskAuditLogOrderByWithAggregationInputObjectSchema, TaskAuditLogOrderByWithAggregationInputObjectSchema.array()]).optional(), having: TaskAuditLogScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(TaskAuditLogScalarFieldEnumSchema), _count: z.union([ z.literal(true), TaskAuditLogCountAggregateInputObjectSchema ]).optional(), _min: TaskAuditLogMinAggregateInputObjectSchema.optional(), _max: TaskAuditLogMaxAggregateInputObjectSchema.optional() }).strict();