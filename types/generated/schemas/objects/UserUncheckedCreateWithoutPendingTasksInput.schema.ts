import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { AuditLogUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './AuditLogUncheckedCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  role: UserRoleSchema.optional(),
  isActive: z.boolean().optional(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  trustedIp: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  auditLogs: z.lazy(() => AuditLogUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutPendingTasksInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPendingTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutPendingTasksInput>;
export const UserUncheckedCreateWithoutPendingTasksInputObjectZodSchema = makeSchema();
