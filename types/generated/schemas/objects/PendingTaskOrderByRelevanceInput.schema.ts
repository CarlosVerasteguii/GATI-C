import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskOrderByRelevanceFieldEnumSchema } from '../enums/PendingTaskOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  fields: z.union([PendingTaskOrderByRelevanceFieldEnumSchema, PendingTaskOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const PendingTaskOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.PendingTaskOrderByRelevanceInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskOrderByRelevanceInput>;
export const PendingTaskOrderByRelevanceInputObjectZodSchema = makeSchema();
