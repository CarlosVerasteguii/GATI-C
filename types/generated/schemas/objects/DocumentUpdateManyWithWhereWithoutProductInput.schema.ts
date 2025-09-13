import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentScalarWhereInputObjectSchema } from './DocumentScalarWhereInput.schema';
import { DocumentUpdateManyMutationInputObjectSchema } from './DocumentUpdateManyMutationInput.schema';
import { DocumentUncheckedUpdateManyWithoutProductInputObjectSchema } from './DocumentUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => DocumentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => DocumentUpdateManyMutationInputObjectSchema), z.lazy(() => DocumentUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const DocumentUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.DocumentUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentUpdateManyWithWhereWithoutProductInput>;
export const DocumentUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();
