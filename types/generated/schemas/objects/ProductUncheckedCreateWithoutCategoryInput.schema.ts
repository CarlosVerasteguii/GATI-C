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
  brandId: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional()
}).strict();
export const ProductUncheckedCreateWithoutCategoryInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateWithoutCategoryInput>;
export const ProductUncheckedCreateWithoutCategoryInputObjectZodSchema = makeSchema();
