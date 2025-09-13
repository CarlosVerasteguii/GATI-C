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
export const DocumentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.DocumentUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentUncheckedCreateInput>;
export const DocumentUncheckedCreateInputObjectZodSchema = makeSchema();
