import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentCreateNestedManyWithoutProductInputObjectSchema } from './DocumentCreateNestedManyWithoutProductInput.schema';
import { CategoryCreateNestedOneWithoutProductsInputObjectSchema } from './CategoryCreateNestedOneWithoutProductsInput.schema';
import { LocationCreateNestedOneWithoutProductsInputObjectSchema } from './LocationCreateNestedOneWithoutProductsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  serialNumber: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  cost: z.number().optional().nullable(),
  purchaseDate: z.coerce.date().optional().nullable(),
  condition: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  documents: z.lazy(() => DocumentCreateNestedManyWithoutProductInputObjectSchema).optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutProductsInputObjectSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutProductsInputObjectSchema).optional()
}).strict();
export const ProductCreateWithoutBrandInputObjectSchema: z.ZodType<Prisma.ProductCreateWithoutBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateWithoutBrandInput>;
export const ProductCreateWithoutBrandInputObjectZodSchema = makeSchema();
