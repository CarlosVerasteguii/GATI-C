import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskWhereUniqueInputObjectSchema } from './PendingTaskWhereUniqueInput.schema';
import { PendingTaskUpdateWithoutCreatorInputObjectSchema } from './PendingTaskUpdateWithoutCreatorInput.schema';
import { PendingTaskUncheckedUpdateWithoutCreatorInputObjectSchema } from './PendingTaskUncheckedUpdateWithoutCreatorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PendingTaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PendingTaskUpdateWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskUncheckedUpdateWithoutCreatorInputObjectSchema)])
}).strict();
export const PendingTaskUpdateWithWhereUniqueWithoutCreatorInputObjectSchema: z.ZodType<Prisma.PendingTaskUpdateWithWhereUniqueWithoutCreatorInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUpdateWithWhereUniqueWithoutCreatorInput>;
export const PendingTaskUpdateWithWhereUniqueWithoutCreatorInputObjectZodSchema = makeSchema();
