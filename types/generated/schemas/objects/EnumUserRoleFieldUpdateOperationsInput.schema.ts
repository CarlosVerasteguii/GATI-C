import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserRoleSchema } from '../enums/UserRole.schema'

const makeSchema = () => z.object({
  set: UserRoleSchema.optional()
}).strict();
export const EnumUserRoleFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput>;
export const EnumUserRoleFieldUpdateOperationsInputObjectZodSchema = makeSchema();
