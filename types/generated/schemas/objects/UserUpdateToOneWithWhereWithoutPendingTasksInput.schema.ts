import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutPendingTasksInputObjectSchema } from './UserUpdateWithoutPendingTasksInput.schema';
import { UserUncheckedUpdateWithoutPendingTasksInputObjectSchema } from './UserUncheckedUpdateWithoutPendingTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutPendingTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutPendingTasksInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutPendingTasksInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPendingTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPendingTasksInput>;
export const UserUpdateToOneWithWhereWithoutPendingTasksInputObjectZodSchema = makeSchema();
