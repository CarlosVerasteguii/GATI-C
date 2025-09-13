import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskCreateWithoutCreatorInputObjectSchema } from './PendingTaskCreateWithoutCreatorInput.schema';
import { PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema } from './PendingTaskUncheckedCreateWithoutCreatorInput.schema';
import { PendingTaskCreateOrConnectWithoutCreatorInputObjectSchema } from './PendingTaskCreateOrConnectWithoutCreatorInput.schema';
import { PendingTaskCreateManyCreatorInputEnvelopeObjectSchema } from './PendingTaskCreateManyCreatorInputEnvelope.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './PendingTaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PendingTaskCreateWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskCreateWithoutCreatorInputObjectSchema).array(), z.lazy(() => PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskUncheckedCreateWithoutCreatorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PendingTaskCreateOrConnectWithoutCreatorInputObjectSchema), z.lazy(() => PendingTaskCreateOrConnectWithoutCreatorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PendingTaskCreateManyCreatorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PendingTaskWhereUniqueInputObjectSchema), z.lazy(() => PendingTaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PendingTaskCreateNestedManyWithoutCreatorInputObjectSchema: z.ZodType<Prisma.PendingTaskCreateNestedManyWithoutCreatorInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCreateNestedManyWithoutCreatorInput>;
export const PendingTaskCreateNestedManyWithoutCreatorInputObjectZodSchema = makeSchema();
