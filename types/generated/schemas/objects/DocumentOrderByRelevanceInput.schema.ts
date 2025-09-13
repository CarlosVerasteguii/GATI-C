import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentOrderByRelevanceFieldEnumSchema } from '../enums/DocumentOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  fields: z.union([DocumentOrderByRelevanceFieldEnumSchema, DocumentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const DocumentOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.DocumentOrderByRelevanceInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentOrderByRelevanceInput>;
export const DocumentOrderByRelevanceInputObjectZodSchema = makeSchema();
