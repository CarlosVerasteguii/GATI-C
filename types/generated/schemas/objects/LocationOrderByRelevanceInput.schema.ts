import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { LocationOrderByRelevanceFieldEnumSchema } from '../enums/LocationOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  fields: z.union([LocationOrderByRelevanceFieldEnumSchema, LocationOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const LocationOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.LocationOrderByRelevanceInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationOrderByRelevanceInput>;
export const LocationOrderByRelevanceInputObjectZodSchema = makeSchema();
