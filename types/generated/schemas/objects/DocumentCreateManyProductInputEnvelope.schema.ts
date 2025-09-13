import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { DocumentCreateManyProductInputObjectSchema } from './DocumentCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => DocumentCreateManyProductInputObjectSchema), z.lazy(() => DocumentCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const DocumentCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.DocumentCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.DocumentCreateManyProductInputEnvelope>;
export const DocumentCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
