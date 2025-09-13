import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskWhereUniqueInputObjectSchema } from './PendingTaskWhereUniqueInput.schema';
import { PendingTaskUpdateWithoutCreatorInputObjectSchema } from './PendingTaskUpdateWithoutCreatorInput.schema';
import { PendingTaskUncheckedUpdateWithoutCreatorInputObjectSchema } from './PendingTaskUncheckedUpdateWithoutCreatorInput.schema';
import { PendingTaskCreateWithoutCreatorInputObjectSchema } from './PendingTaskCreateWithoutCreatorInput.schema';
import { PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema } from './PendingTaskUncheckedCreateWithoutCreatorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PendingTaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PendingTaskUpdateWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskUncheckedUpdateWithoutCreatorInputObjectSchema)]),
  create: z.union([z.lazy(() => PendingTaskCreateWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema)])
}).strict();
export const PendingTaskUpsertWithWhereUniqueWithoutCreatorInputObjectSchema: z.ZodType<Prisma.PendingTaskUpsertWithWhereUniqueWithoutCreatorInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUpsertWithWhereUniqueWithoutCreatorInput>;
export const PendingTaskUpsertWithWhereUniqueWithoutCreatorInputObjectZodSchema = makeSchema();
