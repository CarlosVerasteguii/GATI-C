import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const CategoryUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryUncheckedUpdateManyInput>;
export const CategoryUncheckedUpdateManyInputObjectZodSchema = makeSchema();
