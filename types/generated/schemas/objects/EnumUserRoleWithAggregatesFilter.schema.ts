import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { NestedEnumUserRoleWithAggregatesFilterObjectSchema } from './NestedEnumUserRoleWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumUserRoleFilterObjectSchema } from './NestedEnumUserRoleFilter.schema'

const makeSchema = () => z.object({
  equals: UserRoleSchema.optional(),
  in: UserRoleSchema.array().optional(),
  notIn: UserRoleSchema.array().optional(),
  not: z.union([UserRoleSchema, z.lazy(() => NestedEnumUserRoleWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterObjectSchema).optional()
}).strict();
export const EnumUserRoleWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter>;
export const EnumUserRoleWithAggregatesFilterObjectZodSchema = makeSchema();
