import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskWhereUniqueInputObjectSchema } from './PendingTaskWhereUniqueInput.schema';
import { PendingTaskCreateWithoutCreatorInputObjectSchema } from './PendingTaskCreateWithoutCreatorInput.schema';
import { PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema } from './PendingTaskUncheckedCreateWithoutCreatorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PendingTaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PendingTaskCreateWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema)])
}).strict();
export const PendingTaskCreateOrConnectWithoutCreatorInputObjectSchema: z.ZodType<Prisma.PendingTaskCreateOrConnectWithoutCreatorInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCreateOrConnectWithoutCreatorInput>;
export const PendingTaskCreateOrConnectWithoutCreatorInputObjectZodSchema = makeSchema();
