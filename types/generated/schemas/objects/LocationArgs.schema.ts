import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { LocationSelectObjectSchema } from './LocationSelect.schema';
import { LocationIncludeObjectSchema } from './LocationInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => LocationSelectObjectSchema).optional(),
  include: z.lazy(() => LocationIncludeObjectSchema).optional()
}).strict();
export const LocationArgsObjectSchema = makeSchema();
export const LocationArgsObjectZodSchema = makeSchema();
