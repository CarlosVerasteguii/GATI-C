import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentWhereUniqueInputObjectSchema } from './DocumentWhereUniqueInput.schema';
import { DocumentCreateWithoutProductInputObjectSchema } from './DocumentCreateWithoutProductInput.schema';
import { DocumentUncheckedCreateWithoutProductInputObjectSchema } from './DocumentUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DocumentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => DocumentCreateWithoutProductInputObjectSchema), z.lazy(() => DocumentUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const DocumentCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.DocumentCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentCreateOrConnectWithoutProductInput>;
export const DocumentCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
