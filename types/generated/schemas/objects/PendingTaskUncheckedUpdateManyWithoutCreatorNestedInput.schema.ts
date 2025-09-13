import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskCreateWithoutCreatorInputObjectSchema } from './PendingTaskCreateWithoutCreatorInput.schema';
import { PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema } from './PendingTaskUncheckedCreateWithoutCreatorInput.schema';
import { PendingTaskCreateOrConnectWithoutCreatorInputObjectSchema } from './PendingTaskCreateOrConnectWithoutCreatorInput.schema';
import { PendingTaskUpsertWithWhereUniqueWithoutCreatorInputObjectSchema } from './PendingTaskUpsertWithWhereUniqueWithoutCreatorInput.schema';
import { PendingTaskCreateManyCreatorInputEnvelopeObjectSchema } from './PendingTaskCreateManyCreatorInputEnvelope.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './PendingTaskWhereUniqueInput.schema';
import { PendingTaskUpdateWithWhereUniqueWithoutCreatorInputObjectSchema } from './PendingTaskUpdateWithWhereUniqueWithoutCreatorInput.schema';
import { PendingTaskUpdateManyWithWhereWithoutCreatorInputObjectSchema } from './PendingTaskUpdateManyWithWhereWithoutCreatorInput.schema';
import { PendingTaskScalarWhereInputObjectSchema } from './PendingTaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PendingTaskCreateWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskCreateWithoutCreatorInputObjectSchema).array(), z.lazy(() => PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PendingTaskCreateOrConnectWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskCreateOrConnectWithoutCreatorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PendingTaskUpsertWithWhereUniqueWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskUpsertWithWhereUniqueWithoutCreatorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PendingTaskCreateManyCreatorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PendingTaskWhereUniqueInputObjectSchema), z.lazy(() => PendingTaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PendingTaskWhereUniqueInputObjectSchema), z.lazy(() => PendingTaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PendingTaskWhereUniqueInputObjectSchema), z.lazy(() => PendingTaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PendingTaskWhereUniqueInputObjectSchema), z.lazy(() => PendingTaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PendingTaskUpdateWithWhereUniqueWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskUpdateWithWhereUniqueWithoutCreatorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PendingTaskUpdateManyWithWhereWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskUpdateManyWithWhereWithoutCreatorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PendingTaskScalarWhereInputObjectSchema), z.lazy(() => PendingTaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PendingTaskUncheckedUpdateManyWithoutCreatorNestedInputObjectSchema: z.ZodType<Prisma.PendingTaskUncheckedUpdateManyWithoutCreatorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUncheckedUpdateManyWithoutCreatorNestedInput>;
export const PendingTaskUncheckedUpdateManyWithoutCreatorNestedInputObjectZodSchema = makeSchema();
