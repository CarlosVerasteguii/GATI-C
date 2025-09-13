import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutPendingTasksInputObjectSchema } from './UserCreateWithoutPendingTasksInput.schema';
import { UserUncheckedCreateWithoutPendingTasksInputObjectSchema } from './UserUncheckedCreateWithoutPendingTasksInput.schema';
import { UserCreateOrConnectWithoutPendingTasksInputObjectSchema } from './UserCreateOrConnectWithoutPendingTasksInput.schema';
import { UserUpsertWithoutPendingTasksInputObjectSchema } from './UserUpsertWithoutPendingTasksInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutPendingTasksInputObjectSchema } from './UserUpdateToOneWithWhereWithoutPendingTasksInput.schema';
import { UserUpdateWithoutPendingTasksInputObjectSchema } from './UserUpdateWithoutPendingTasksInput.schema';
import { UserUncheckedUpdateWithoutPendingTasksInputObjectSchema } from './UserUncheckedUpdateWithoutPendingTasksInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutPendingTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutPendingTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPendingTasksInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPendingTasksInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutPendingTasksInputObjectSchema), z.lazy(() => UserUpdateWithoutPendingTasksInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutPendingTasksInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneRequiredWithoutPendingTasksNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPendingTasksNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneRequiredWithoutPendingTasksNestedInput>;
export const UserUpdateOneRequiredWithoutPendingTasksNestedInputObjectZodSchema = makeSchema();
