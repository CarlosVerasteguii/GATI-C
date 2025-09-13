import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const DocumentIncludeObjectSchema: z.ZodType<Prisma.DocumentInclude> = makeSchema() as unknown as z.ZodType<Prisma.DocumentInclude>;
export const DocumentIncludeObjectZodSchema = makeSchema();
