import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  originalFilename: z.string(),
  storedUuidFilename: z.string(),
  productId: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const DocumentCreateManyInputObjectSchema: z.ZodType<Prisma.DocumentCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentCreateManyInput>;
export const DocumentCreateManyInputObjectZodSchema = makeSchema();
