import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentWhereUniqueInputObjectSchema } from './DocumentWhereUniqueInput.schema';
import { DocumentUpdateWithoutProductInputObjectSchema } from './DocumentUpdateWithoutProductInput.schema';
import { DocumentUncheckedUpdateWithoutProductInputObjectSchema } from './DocumentUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DocumentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => DocumentUpdateWithoutProductInputObjectSchema), z.lazy(() => DocumentUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const DocumentUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.DocumentUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentUpdateWithWhereUniqueWithoutProductInput>;
export const DocumentUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
