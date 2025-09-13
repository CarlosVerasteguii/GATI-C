import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentWhereUniqueInputObjectSchema } from './DocumentWhereUniqueInput.schema';
import { DocumentUpdateWithoutProductInputObjectSchema } from './DocumentUpdateWithoutProductInput.schema';
import { DocumentUncheckedUpdateWithoutProductInputObjectSchema } from './DocumentUncheckedUpdateWithoutProductInput.schema';
import { DocumentCreateWithoutProductInputObjectSchema } from './DocumentCreateWithoutProductInput.schema';
import { DocumentUncheckedCreateWithoutProductInputObjectSchema } from './DocumentUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DocumentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => DocumentUpdateWithoutProductInputObjectSchema), z.lazy(() => DocumentUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => DocumentCreateWithoutProductInputObjectSchema), z.lazy(() => DocumentUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const DocumentUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.DocumentUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentUpsertWithWhereUniqueWithoutProductInput>;
export const DocumentUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
