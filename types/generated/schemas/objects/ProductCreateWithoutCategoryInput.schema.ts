import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentCreateNestedManyWithoutProductInputObjectSchema } from './DocumentCreateNestedManyWithoutProductInput.schema';
import { BrandCreateNestedOneWithoutProductsInputObjectSchema } from './BrandCreateNestedOneWithoutProductsInput.schema';
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
  brand: z.lazy(() => BrandCreateNestedOneWithoutProductsInputObjectSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutProductsInputObjectSchema).optional()
}).strict();
export const ProductCreateWithoutCategoryInputObjectSchema: z.ZodType<Prisma.ProductCreateWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateWithoutCategoryInput>;
export const ProductCreateWithoutCategoryInputObjectZodSchema = makeSchema();
