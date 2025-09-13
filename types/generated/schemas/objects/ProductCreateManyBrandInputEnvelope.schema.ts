import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateManyBrandInputObjectSchema } from './ProductCreateManyBrandInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProductCreateManyBrandInputObjectSchema), z.lazy(() => ProductCreateManyBrandInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProductCreateManyBrandInputEnvelopeObjectSchema: z.ZodType<Prisma.ProductCreateManyBrandInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateManyBrandInputEnvelope>;
export const ProductCreateManyBrandInputEnvelopeObjectZodSchema = makeSchema();
