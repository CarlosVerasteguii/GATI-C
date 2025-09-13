import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductSelectObjectSchema } from './ProductSelect.schema';
import { ProductIncludeObjectSchema } from './ProductInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProductSelectObjectSchema).optional(),
  include: z.lazy(() => ProductIncludeObjectSchema).optional()
}).strict();
export const ProductArgsObjectSchema = makeSchema();
export const ProductArgsObjectZodSchema = makeSchema();
