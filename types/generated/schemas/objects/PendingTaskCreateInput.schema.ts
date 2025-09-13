import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { UserCreateNestedOneWithoutPendingTasksInputObjectSchema } from './UserCreateNestedOneWithoutPendingTasksInput.schema';
import { TaskAuditLogCreateNestedManyWithoutTaskInputObjectSchema } from './TaskAuditLogCreateNestedManyWithoutTaskInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: z.string(),
  status: z.string(),
  detailsJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  createdAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutPendingTasksInputObjectSchema),
  taskAudit: z.lazy(() => TaskAuditLogCreateNestedManyWithoutTaskInputObjectSchema)
}).strict();
export const PendingTaskCreateInputObjectSchema: z.ZodType<Prisma.PendingTaskCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCreateInput>;
export const PendingTaskCreateInputObjectZodSchema = makeSchema();
