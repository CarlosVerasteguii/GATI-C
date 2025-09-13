import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandCountOutputTypeSelectObjectSchema } from './BrandCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BrandCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const BrandCountOutputTypeArgsObjectSchema = makeSchema();
export const BrandCountOutputTypeArgsObjectZodSchema = makeSchema();
