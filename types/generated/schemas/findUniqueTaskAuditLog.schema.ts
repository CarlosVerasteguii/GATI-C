import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { TaskAuditLogSelectObjectSchema } from './objects/TaskAuditLogSelect.schema';
import { TaskAuditLogIncludeObjectSchema } from './objects/TaskAuditLogInclude.schema';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './objects/TaskAuditLogWhereUniqueInput.schema';

export const TaskAuditLogFindUniqueSchema: z.ZodType<Prisma.TaskAuditLogFindUniqueArgs> = z.object({ select: TaskAuditLogSelectObjectSchema.optional(), include: TaskAuditLogIncludeObjectSchema.optional(), where: TaskAuditLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskAuditLogFindUniqueArgs>;

export const TaskAuditLogFindUniqueZodSchema = z.object({ select: TaskAuditLogSelectObjectSchema.optional(), include: TaskAuditLogIncludeObjectSchema.optional(), where: TaskAuditLogWhereUniqueInputObjectSchema }).strict();