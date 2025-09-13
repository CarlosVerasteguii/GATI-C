import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const BrandUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.BrandUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUpdateManyMutationInput>;
export const BrandUpdateManyMutationInputObjectZodSchema = makeSchema();
