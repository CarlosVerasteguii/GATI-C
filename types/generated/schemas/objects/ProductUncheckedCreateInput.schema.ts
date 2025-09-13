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
  categoryId: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProductInputObjectSchema)
}).strict();
export const ProductUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateInput>;
export const ProductUncheckedCreateInputObjectZodSchema = makeSchema();
