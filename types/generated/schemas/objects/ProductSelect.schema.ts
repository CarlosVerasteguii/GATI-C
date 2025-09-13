import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentFindManySchema } from '../findManyDocument.schema';
import { BrandArgsObjectSchema } from './BrandArgs.schema';
import { CategoryArgsObjectSchema } from './CategoryArgs.schema';
import { LocationArgsObjectSchema } from './LocationArgs.schema';
import { ProductCountOutputTypeArgsObjectSchema } from './ProductCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  serialNumber: z.boolean().optional(),
  description: z.boolean().optional(),
  cost: z.boolean().optional(),
  purchaseDate: z.boolean().optional(),
  condition: z.boolean().optional(),
  brandId: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  locationId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  documents: z.union([z.boolean(), z.lazy(() => DocumentFindManySchema)]).optional(),
  brand: z.union([z.boolean(), z.lazy(() => BrandArgsObjectSchema)]).optional(),
  category: z.union([z.boolean(), z.lazy(() => CategoryArgsObjectSchema)]).optional(),
  location: z.union([z.boolean(), z.lazy(() => LocationArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductSelectObjectSchema: z.ZodType<Prisma.ProductSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductSelect>;
export const ProductSelectObjectZodSchema = makeSchema();
