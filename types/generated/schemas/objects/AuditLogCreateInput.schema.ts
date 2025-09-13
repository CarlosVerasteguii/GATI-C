import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { UserCreateNestedOneWithoutAuditLogsInputObjectSchema } from './UserCreateNestedOneWithoutAuditLogsInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  action: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  changesJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutAuditLogsInputObjectSchema)
}).strict();
export const AuditLogCreateInputObjectSchema: z.ZodType<Prisma.AuditLogCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AuditLogCreateInput>;
export const AuditLogCreateInputObjectZodSchema = makeSchema();
