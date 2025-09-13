import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  originalFilename: z.boolean().optional(),
  storedUuidFilename: z.boolean().optional(),
  productId: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const DocumentSelectObjectSchema: z.ZodType<Prisma.DocumentSelect> = makeSchema() as unknown as z.ZodType<Prisma.DocumentSelect>;
export const DocumentSelectObjectZodSchema = makeSchema();
