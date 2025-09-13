import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentCreateWithoutProductInputObjectSchema } from './DocumentCreateWithoutProductInput.schema';
import { DocumentUncheckedCreateWithoutProductInputObjectSchema } from './DocumentUncheckedCreateWithoutProductInput.schema';
import { DocumentCreateOrConnectWithoutProductInputObjectSchema } from './DocumentCreateOrConnectWithoutProductInput.schema';
import { DocumentCreateManyProductInputEnvelopeObjectSchema } from './DocumentCreateManyProductInputEnvelope.schema';
import { DocumentWhereUniqueInputObjectSchema } from './DocumentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => DocumentCreateWithoutProductInputObjectSchema), z.lazy(() => DocumentCreateWithoutProductInputObjectSchema).array(), z.lazy(() => DocumentUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => DocumentUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => DocumentCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => DocumentCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => DocumentCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => DocumentWhereUniqueInputObjectSchema), z.lazy(() => DocumentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const DocumentUncheckedCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.DocumentUncheckedCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentUncheckedCreateNestedManyWithoutProductInput>;
export const DocumentUncheckedCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();
