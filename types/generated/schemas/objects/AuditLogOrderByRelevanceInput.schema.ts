import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { AuditLogOrderByRelevanceFieldEnumSchema } from '../enums/AuditLogOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  fields: z.union([AuditLogOrderByRelevanceFieldEnumSchema, AuditLogOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const AuditLogOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.AuditLogOrderByRelevanceInput> = makeSchema() as unknown as z.ZodType<Prisma.AuditLogOrderByRelevanceInput>;
export const AuditLogOrderByRelevanceInputObjectZodSchema = makeSchema();
