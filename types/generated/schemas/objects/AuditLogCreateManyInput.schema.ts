import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  userId: z.string(),
  action: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  changesJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  createdAt: z.coerce.date().optional()
}).strict();
export const AuditLogCreateManyInputObjectSchema: z.ZodType<Prisma.AuditLogCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.AuditLogCreateManyInput>;
export const AuditLogCreateManyInputObjectZodSchema = makeSchema();
