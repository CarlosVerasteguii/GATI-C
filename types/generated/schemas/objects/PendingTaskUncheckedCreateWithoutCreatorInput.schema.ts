import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { TaskAuditLogUncheckedCreateNestedManyWithoutTaskInputObjectSchema } from './TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: z.string(),
  status: z.string(),
  detailsJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  taskAudit: z.lazy(() => TaskAuditLogUncheckedCreateNestedManyWithoutTaskInputObjectSchema).optional()
}).strict();
export const PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema: z.ZodType<Prisma.PendingTaskUncheckedCreateWithoutCreatorInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUncheckedCreateWithoutCreatorInput>;
export const PendingTaskUncheckedCreateWithoutCreatorInputObjectZodSchema = makeSchema();
