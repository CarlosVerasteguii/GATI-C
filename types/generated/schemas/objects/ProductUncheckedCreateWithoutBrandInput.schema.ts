import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './DocumentUncheckedCreateNestedManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  serialNumber: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  cost: z.number().optional().nullable(),
  purchaseDate: z.coerce.date().optional().nullable(),
  condition: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional()
}).strict();
export const ProductUncheckedCreateWithoutBrandInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateWithoutBrandInput>;
export const ProductUncheckedCreateWithoutBrandInputObjectZodSchema = makeSchema();
