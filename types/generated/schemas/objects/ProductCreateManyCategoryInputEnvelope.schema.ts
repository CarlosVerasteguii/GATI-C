import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateManyCategoryInputObjectSchema } from './ProductCreateManyCategoryInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProductCreateManyCategoryInputObjectSchema), z.lazy(() => ProductCreateManyCategoryInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProductCreateManyCategoryInputEnvelopeObjectSchema: z.ZodType<Prisma.ProductCreateManyCategoryInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateManyCategoryInputEnvelope>;
export const ProductCreateManyCategoryInputEnvelopeObjectZodSchema = makeSchema();
