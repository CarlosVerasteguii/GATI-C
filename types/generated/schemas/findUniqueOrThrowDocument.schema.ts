import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DocumentSelectObjectSchema } from './objects/DocumentSelect.schema';
import { DocumentIncludeObjectSchema } from './objects/DocumentInclude.schema';
import { DocumentWhereUniqueInputObjectSchema } from './objects/DocumentWhereUniqueInput.schema';

export const DocumentFindUniqueOrThrowSchema: z.ZodType<Prisma.DocumentFindUniqueOrThrowArgs> = z.object({ select: DocumentSelectObjectSchema.optional(), include: DocumentIncludeObjectSchema.optional(), where: DocumentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.DocumentFindUniqueOrThrowArgs>;

export const DocumentFindUniqueOrThrowZodSchema = z.object({ select: DocumentSelectObjectSchema.optional(), include: DocumentIncludeObjectSchema.optional(), where: DocumentWhereUniqueInputObjectSchema }).strict();