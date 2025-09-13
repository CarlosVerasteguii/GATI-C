import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserOrderByRelevanceFieldEnumSchema } from '../enums/UserOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  fields: z.union([UserOrderByRelevanceFieldEnumSchema, UserOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const UserOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.UserOrderByRelevanceInput> = makeSchema() as unknown as z.ZodType<Prisma.UserOrderByRelevanceInput>;
export const UserOrderByRelevanceInputObjectZodSchema = makeSchema();
