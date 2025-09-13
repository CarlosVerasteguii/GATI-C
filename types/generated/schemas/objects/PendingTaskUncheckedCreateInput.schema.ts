import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { TaskAuditLogUncheckedCreateNestedManyWithoutTaskInputObjectSchema } from './TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  creatorId: z.string(),
  type: z.string(),
  status: z.string(),
  detailsJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  createdAt: z.coerce.date().optional(),
  taskAudit: z.lazy(() => TaskAuditLogUncheckedCreateNestedManyWithoutTaskInputObjectSchema)
}).strict();
export const PendingTaskUncheckedCreateInputObjectSchema: z.ZodType<Prisma.PendingTaskUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUncheckedCreateInput>;
export const PendingTaskUncheckedCreateInputObjectZodSchema = makeSchema();
