import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskScalarWhereInputObjectSchema } from './PendingTaskScalarWhereInput.schema';
import { PendingTaskUpdateManyMutationInputObjectSchema } from './PendingTaskUpdateManyMutationInput.schema';
import { PendingTaskUncheckedUpdateManyWithoutCreatorInputObjectSchema } from './PendingTaskUncheckedUpdateManyWithoutCreatorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PendingTaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PendingTaskUpdateManyMutationInputObjectSchema), z.lazy(() => PendingTaskUncheckedUpdateManyWithoutCreatorInputObjectSchema)])
}).strict();
export const PendingTaskUpdateManyWithWhereWithoutCreatorInputObjectSchema: z.ZodType<Prisma.PendingTaskUpdateManyWithWhereWithoutCreatorInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUpdateManyWithWhereWithoutCreatorInput>;
export const PendingTaskUpdateManyWithWhereWithoutCreatorInputObjectZodSchema = makeSchema();
