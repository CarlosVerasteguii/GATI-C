import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentWhereInputObjectSchema } from './DocumentWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => DocumentWhereInputObjectSchema).optional(),
  some: z.lazy(() => DocumentWhereInputObjectSchema).optional(),
  none: z.lazy(() => DocumentWhereInputObjectSchema).optional()
}).strict();
export const DocumentListRelationFilterObjectSchema: z.ZodType<Prisma.DocumentListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.DocumentListRelationFilter>;
export const DocumentListRelationFilterObjectZodSchema = makeSchema();
