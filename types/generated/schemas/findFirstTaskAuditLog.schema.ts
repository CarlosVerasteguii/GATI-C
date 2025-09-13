import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { TaskAuditLogIncludeObjectSchema } from './objects/TaskAuditLogInclude.schema';
import { TaskAuditLogOrderByWithRelationInputObjectSchema } from './objects/TaskAuditLogOrderByWithRelationInput.schema';
import { TaskAuditLogWhereInputObjectSchema } from './objects/TaskAuditLogWhereInput.schema';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './objects/TaskAuditLogWhereUniqueInput.schema';
import { TaskAuditLogScalarFieldEnumSchema } from './enums/TaskAuditLogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TaskAuditLogFindFirstSelectSchema: z.ZodType<Prisma.TaskAuditLogSelect> = z.object({
    id: z.boolean().optional(),
    taskId: z.boolean().optional(),
    userId: z.boolean().optional(),
    event: z.boolean().optional(),
    details: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    task: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TaskAuditLogSelect>;

export const TaskAuditLogFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    taskId: z.boolean().optional(),
    userId: z.boolean().optional(),
    event: z.boolean().optional(),
    details: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    task: z.boolean().optional()
  }).strict();

export const TaskAuditLogFindFirstSchema: z.ZodType<Prisma.TaskAuditLogFindFirstArgs> = z.object({ select: TaskAuditLogFindFirstSelectSchema.optional(), include: z.lazy(() => TaskAuditLogIncludeObjectSchema.optional()), orderBy: z.union([TaskAuditLogOrderByWithRelationInputObjectSchema, TaskAuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskAuditLogWhereInputObjectSchema.optional(), cursor: TaskAuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskAuditLogScalarFieldEnumSchema, TaskAuditLogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TaskAuditLogFindFirstArgs>;

export const TaskAuditLogFindFirstZodSchema = z.object({ select: TaskAuditLogFindFirstSelectSchema.optional(), include: z.lazy(() => TaskAuditLogIncludeObjectSchema.optional()), orderBy: z.union([TaskAuditLogOrderByWithRelationInputObjectSchema, TaskAuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: TaskAuditLogWhereInputObjectSchema.optional(), cursor: TaskAuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TaskAuditLogScalarFieldEnumSchema, TaskAuditLogScalarFieldEnumSchema.array()]).optional() }).strict();