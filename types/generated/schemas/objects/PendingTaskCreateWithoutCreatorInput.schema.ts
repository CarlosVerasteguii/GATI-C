import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { TaskAuditLogCreateNestedManyWithoutTaskInputObjectSchema } from './TaskAuditLogCreateNestedManyWithoutTaskInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: z.string(),
  status: z.string(),
  detailsJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  taskAudit: z.lazy(() => TaskAuditLogCreateNestedManyWithoutTaskInputObjectSchema).optional()
}).strict();
export const PendingTaskCreateWithoutCreatorInputObjectSchema: z.ZodType<Prisma.PendingTaskCreateWithoutCreatorInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCreateWithoutCreatorInput>;
export const PendingTaskCreateWithoutCreatorInputObjectZodSchema = makeSchema();
