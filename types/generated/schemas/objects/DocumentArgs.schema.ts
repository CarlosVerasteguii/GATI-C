import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentSelectObjectSchema } from './DocumentSelect.schema';
import { DocumentIncludeObjectSchema } from './DocumentInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => DocumentSelectObjectSchema).optional(),
  include: z.lazy(() => DocumentIncludeObjectSchema).optional()
}).strict();
export const DocumentArgsObjectSchema = makeSchema();
export const DocumentArgsObjectZodSchema = makeSchema();
