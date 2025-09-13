import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskAuditLogOrderByRelevanceFieldEnumSchema } from '../enums/TaskAuditLogOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  fields: z.union([TaskAuditLogOrderByRelevanceFieldEnumSchema, TaskAuditLogOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const TaskAuditLogOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.TaskAuditLogOrderByRelevanceInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogOrderByRelevanceInput>;
export const TaskAuditLogOrderByRelevanceInputObjectZodSchema = makeSchema();
