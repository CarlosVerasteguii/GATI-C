import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutPendingTasksInputObjectSchema } from './UserUpdateWithoutPendingTasksInput.schema';
import { UserUncheckedUpdateWithoutPendingTasksInputObjectSchema } from './UserUncheckedUpdateWithoutPendingTasksInput.schema';
import { UserCreateWithoutPendingTasksInputObjectSchema } from './UserCreateWithoutPendingTasksInput.schema';
import { UserUncheckedCreateWithoutPendingTasksInputObjectSchema } from './UserUncheckedCreateWithoutPendingTasksInput.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutPendingTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutPendingTasksInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutPendingTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutPendingTasksInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutPendingTasksInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutPendingTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutPendingTasksInput>;
export const UserUpsertWithoutPendingTasksInputObjectZodSchema = makeSchema();
