import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { NestedEnumUserRoleFilterObjectSchema } from './NestedEnumUserRoleFilter.schema'

const makeSchema = () => z.object({
  equals: UserRoleSchema.optional(),
  in: UserRoleSchema.array().optional(),
  notIn: UserRoleSchema.array().optional(),
  not: z.union([UserRoleSchema, z.lazy(() => NestedEnumUserRoleFilterObjectSchema)]).optional()
}).strict();
export const EnumUserRoleFilterObjectSchema: z.ZodType<Prisma.EnumUserRoleFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumUserRoleFilter>;
export const EnumUserRoleFilterObjectZodSchema = makeSchema();
