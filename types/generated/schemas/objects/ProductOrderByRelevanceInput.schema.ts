import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductOrderByRelevanceFieldEnumSchema } from '../enums/ProductOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  fields: z.union([ProductOrderByRelevanceFieldEnumSchema, ProductOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const ProductOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.ProductOrderByRelevanceInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductOrderByRelevanceInput>;
export const ProductOrderByRelevanceInputObjectZodSchema = makeSchema();
