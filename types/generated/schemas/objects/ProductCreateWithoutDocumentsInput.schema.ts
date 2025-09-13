import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandCreateNestedOneWithoutProductsInputObjectSchema } from './BrandCreateNestedOneWithoutProductsInput.schema';
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
  brand: z.lazy(() => BrandCreateNestedOneWithoutProductsInputObjectSchema).optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutProductsInputObjectSchema).optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutProductsInputObjectSchema).optional()
}).strict();
export const ProductCreateWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ProductCreateWithoutDocumentsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateWithoutDocumentsInput>;
export const ProductCreateWithoutDocumentsInputObjectZodSchema = makeSchema();
