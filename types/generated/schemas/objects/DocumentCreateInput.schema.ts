import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateNestedOneWithoutDocumentsInputObjectSchema } from './ProductCreateNestedOneWithoutDocumentsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  originalFilename: z.string(),
  storedUuidFilename: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutDocumentsInputObjectSchema)
}).strict();
export const DocumentCreateInputObjectSchema: z.ZodType<Prisma.DocumentCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentCreateInput>;
export const DocumentCreateInputObjectZodSchema = makeSchema();
