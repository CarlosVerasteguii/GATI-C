import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  creatorId: z.string(),
  type: z.string(),
  status: z.string(),
  detailsJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const PendingTaskCreateManyInputObjectSchema: z.ZodType<Prisma.PendingTaskCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCreateManyInput>;
export const PendingTaskCreateManyInputObjectZodSchema = makeSchema();
