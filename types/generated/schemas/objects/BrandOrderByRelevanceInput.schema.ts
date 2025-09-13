import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandOrderByRelevanceFieldEnumSchema } from '../enums/BrandOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  fields: z.union([BrandOrderByRelevanceFieldEnumSchema, BrandOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const BrandOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.BrandOrderByRelevanceInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandOrderByRelevanceInput>;
export const BrandOrderByRelevanceInputObjectZodSchema = makeSchema();
