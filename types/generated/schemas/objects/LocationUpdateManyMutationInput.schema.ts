import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const LocationUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.LocationUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationUpdateManyMutationInput>;
export const LocationUpdateManyMutationInputObjectZodSchema = makeSchema();
