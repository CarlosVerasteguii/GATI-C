import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutPendingTasksInputObjectSchema } from './UserCreateWithoutPendingTasksInput.schema';
import { UserUncheckedCreateWithoutPendingTasksInputObjectSchema } from './UserUncheckedCreateWithoutPendingTasksInput.schema';
import { UserCreateOrConnectWithoutPendingTasksInputObjectSchema } from './UserCreateOrConnectWithoutPendingTasksInput.schema';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutPendingTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutPendingTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPendingTasksInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutPendingTasksInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPendingTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutPendingTasksInput>;
export const UserCreateNestedOneWithoutPendingTasksInputObjectZodSchema = makeSchema();
