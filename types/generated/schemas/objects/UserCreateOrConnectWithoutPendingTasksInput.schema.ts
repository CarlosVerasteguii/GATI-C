import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutPendingTasksInputObjectSchema } from './UserCreateWithoutPendingTasksInput.schema';
import { UserUncheckedCreateWithoutPendingTasksInputObjectSchema } from './UserUncheckedCreateWithoutPendingTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutPendingTasksInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutPendingTasksInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutPendingTasksInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPendingTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutPendingTasksInput>;
export const UserCreateOrConnectWithoutPendingTasksInputObjectZodSchema = makeSchema();
