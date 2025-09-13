import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutPendingTasksNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutPendingTasksNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  detailsJson: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutPendingTasksNestedInputObjectSchema).optional()
}).strict();
export const PendingTaskUpdateWithoutTaskAuditInputObjectSchema: z.ZodType<Prisma.PendingTaskUpdateWithoutTaskAuditInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUpdateWithoutTaskAuditInput>;
export const PendingTaskUpdateWithoutTaskAuditInputObjectZodSchema = makeSchema();
