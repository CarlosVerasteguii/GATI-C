import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateManyLocationInputObjectSchema } from './ProductCreateManyLocationInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProductCreateManyLocationInputObjectSchema), z.lazy(() => ProductCreateManyLocationInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProductCreateManyLocationInputEnvelopeObjectSchema: z.ZodType<Prisma.ProductCreateManyLocationInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateManyLocationInputEnvelope>;
export const ProductCreateManyLocationInputEnvelopeObjectZodSchema = makeSchema();
