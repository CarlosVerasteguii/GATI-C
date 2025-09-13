import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserRoleSchema } from '../enums/UserRole.schema';
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
  updatedAt: z.coerce.date().optional(),
  pendingTasks: z.lazy(() => PendingTaskCreateNestedManyWithoutCreatorInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutAuditLogsInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutAuditLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutAuditLogsInput>;
export const UserCreateWithoutAuditLogsInputObjectZodSchema = makeSchema();
