import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { UserCreateNestedOneWithoutPendingTasksInputObjectSchema } from './UserCreateNestedOneWithoutPendingTasksInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: z.string(),
  status: z.string(),
  detailsJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutPendingTasksInputObjectSchema)
}).strict();
export const PendingTaskCreateWithoutTaskAuditInputObjectSchema: z.ZodType<Prisma.PendingTaskCreateWithoutTaskAuditInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCreateWithoutTaskAuditInput>;
export const PendingTaskCreateWithoutTaskAuditInputObjectZodSchema = makeSchema();
