import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { LocationCountOutputTypeSelectObjectSchema } from './LocationCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => LocationCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const LocationCountOutputTypeArgsObjectSchema = makeSchema();
export const LocationCountOutputTypeArgsObjectZodSchema = makeSchema();
