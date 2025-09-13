import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DocumentSelectObjectSchema } from './objects/DocumentSelect.schema';
import { DocumentIncludeObjectSchema } from './objects/DocumentInclude.schema';
import { DocumentWhereUniqueInputObjectSchema } from './objects/DocumentWhereUniqueInput.schema';

export const DocumentFindUniqueSchema: z.ZodType<Prisma.DocumentFindUniqueArgs> = z.object({ select: DocumentSelectObjectSchema.optional(), include: DocumentIncludeObjectSchema.optional(), where: DocumentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.DocumentFindUniqueArgs>;

export const DocumentFindUniqueZodSchema = z.object({ select: DocumentSelectObjectSchema.optional(), include: DocumentIncludeObjectSchema.optional(), where: DocumentWhereUniqueInputObjectSchema }).strict();