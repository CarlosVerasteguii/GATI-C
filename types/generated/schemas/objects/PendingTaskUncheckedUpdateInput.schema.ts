import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInputObjectSchema } from './TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  creatorId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  detailsJson: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  taskAudit: z.lazy(() => TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInputObjectSchema).optional()
}).strict();
export const PendingTaskUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.PendingTaskUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUncheckedUpdateInput>;
export const PendingTaskUncheckedUpdateInputObjectZodSchema = makeSchema();
