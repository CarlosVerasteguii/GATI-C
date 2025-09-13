import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { AuditLogCreateNestedManyWithoutUserInputObjectSchema } from './AuditLogCreateNestedManyWithoutUserInput.schema';
import { PendingTaskCreateNestedManyWithoutCreatorInputObjectSchema } from './PendingTaskCreateNestedManyWithoutCreatorInput.schema'

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
  auditLogs: z.lazy(() => AuditLogCreateNestedManyWithoutUserInputObjectSchema),
  pendingTasks: z.lazy(() => PendingTaskCreateNestedManyWithoutCreatorInputObjectSchema)
}).strict();
export const UserCreateInputObjectSchema: z.ZodType<Prisma.UserCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateInput>;
export const UserCreateInputObjectZodSchema = makeSchema();
