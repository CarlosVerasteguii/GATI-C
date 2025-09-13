import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { PendingTaskUpdateOneRequiredWithoutTaskAuditNestedInputObjectSchema } from './PendingTaskUpdateOneRequiredWithoutTaskAuditNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  event: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  details: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  task: z.lazy(() => PendingTaskUpdateOneRequiredWithoutTaskAuditNestedInputObjectSchema).optional()
}).strict();
export const TaskAuditLogUpdateInputObjectSchema: z.ZodType<Prisma.TaskAuditLogUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogUpdateInput>;
export const TaskAuditLogUpdateInputObjectZodSchema = makeSchema();
