import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { CategoryOrderByRelevanceFieldEnumSchema } from '../enums/CategoryOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  fields: z.union([CategoryOrderByRelevanceFieldEnumSchema, CategoryOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const CategoryOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.CategoryOrderByRelevanceInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryOrderByRelevanceInput>;
export const CategoryOrderByRelevanceInputObjectZodSchema = makeSchema();
