import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentCreateWithoutProductInputObjectSchema } from './DocumentCreateWithoutProductInput.schema';
import { DocumentUncheckedCreateWithoutProductInputObjectSchema } from './DocumentUncheckedCreateWithoutProductInput.schema';
import { DocumentCreateOrConnectWithoutProductInputObjectSchema } from './DocumentCreateOrConnectWithoutProductInput.schema';
import { DocumentUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './DocumentUpsertWithWhereUniqueWithoutProductInput.schema';
import { DocumentCreateManyProductInputEnvelopeObjectSchema } from './DocumentCreateManyProductInputEnvelope.schema';
import { DocumentWhereUniqueInputObjectSchema } from './DocumentWhereUniqueInput.schema';
import { DocumentUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './DocumentUpdateWithWhereUniqueWithoutProductInput.schema';
import { DocumentUpdateManyWithWhereWithoutProductInputObjectSchema } from './DocumentUpdateManyWithWhereWithoutProductInput.schema';
import { DocumentScalarWhereInputObjectSchema } from './DocumentScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => DocumentCreateWithoutProductInputObjectSchema), z.lazy(() => DocumentCreateWithoutProductInputObjectSchema).array(), z.lazy(() => DocumentUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => DocumentUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DocumentCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => DocumentCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => DocumentUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => DocumentUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => DocumentCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => DocumentWhereUniqueInputObjectSchema), z.lazy(() => DocumentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => DocumentWhereUniqueInputObjectSchema), z.lazy(() => DocumentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => DocumentWhereUniqueInputObjectSchema), z.lazy(() => DocumentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => DocumentWhereUniqueInputObjectSchema), z.lazy(() => DocumentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => DocumentUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => DocumentUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => DocumentUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => DocumentUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => DocumentScalarWhereInputObjectSchema), z.lazy(() => DocumentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const DocumentUncheckedUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.DocumentUncheckedUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentUncheckedUpdateManyWithoutProductNestedInput>;
export const DocumentUncheckedUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
