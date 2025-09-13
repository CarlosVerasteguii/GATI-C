import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  originalFilename: z.string(),
  storedUuidFilename: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const DocumentCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.DocumentCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentCreateWithoutProductInput>;
export const DocumentCreateWithoutProductInputObjectZodSchema = makeSchema();
