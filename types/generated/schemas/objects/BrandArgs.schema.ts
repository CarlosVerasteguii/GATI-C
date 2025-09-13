import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandSelectObjectSchema } from './BrandSelect.schema';
import { BrandIncludeObjectSchema } from './BrandInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BrandSelectObjectSchema).optional(),
  include: z.lazy(() => BrandIncludeObjectSchema).optional()
}).strict();
export const BrandArgsObjectSchema = makeSchema();
export const BrandArgsObjectZodSchema = makeSchema();
