import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentFindManySchema } from '../findManyDocument.schema';
import { BrandArgsObjectSchema } from './BrandArgs.schema';
import { CategoryArgsObjectSchema } from './CategoryArgs.schema';
import { LocationArgsObjectSchema } from './LocationArgs.schema';
import { ProductCountOutputTypeArgsObjectSchema } from './ProductCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  documents: z.union([z.boolean(), z.lazy(() => DocumentFindManySchema)]).optional(),
  brand: z.union([z.boolean(), z.lazy(() => BrandArgsObjectSchema)]).optional(),
  category: z.union([z.boolean(), z.lazy(() => CategoryArgsObjectSchema)]).optional(),
  location: z.union([z.boolean(), z.lazy(() => LocationArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductIncludeObjectSchema: z.ZodType<Prisma.ProductInclude> = makeSchema() as unknown as z.ZodType<Prisma.ProductInclude>;
export const ProductIncludeObjectZodSchema = makeSchema();
