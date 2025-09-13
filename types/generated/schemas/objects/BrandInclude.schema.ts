import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductFindManySchema } from '../findManyProduct.schema';
import { BrandCountOutputTypeArgsObjectSchema } from './BrandCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  products: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BrandCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BrandIncludeObjectSchema: z.ZodType<Prisma.BrandInclude> = makeSchema() as unknown as z.ZodType<Prisma.BrandInclude>;
export const BrandIncludeObjectZodSchema = makeSchema();
