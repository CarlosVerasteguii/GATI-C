import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskCreateManyCreatorInputObjectSchema } from './PendingTaskCreateManyCreatorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => PendingTaskCreateManyCreatorInputObjectSchema), z.lazy(() => PendingTaskCreateManyCreatorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PendingTaskCreateManyCreatorInputEnvelopeObjectSchema: z.ZodType<Prisma.PendingTaskCreateManyCreatorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCreateManyCreatorInputEnvelope>;
export const PendingTaskCreateManyCreatorInputEnvelopeObjectZodSchema = makeSchema();
