import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DocumentIncludeObjectSchema } from './objects/DocumentInclude.schema';
import { DocumentOrderByWithRelationInputObjectSchema } from './objects/DocumentOrderByWithRelationInput.schema';
import { DocumentWhereInputObjectSchema } from './objects/DocumentWhereInput.schema';
import { DocumentWhereUniqueInputObjectSchema } from './objects/DocumentWhereUniqueInput.schema';
import { DocumentScalarFieldEnumSchema } from './enums/DocumentScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const DocumentFindFirstSelectSchema: z.ZodType<Prisma.DocumentSelect> = z.object({
    id: z.boolean().optional(),
    originalFilename: z.boolean().optional(),
    storedUuidFilename: z.boolean().optional(),
    productId: z.boolean().optional(),
    deletedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    product: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.DocumentSelect>;

export const DocumentFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    originalFilename: z.boolean().optional(),
    storedUuidFilename: z.boolean().optional(),
    productId: z.boolean().optional(),
    deletedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    product: z.boolean().optional()
  }).strict();

export const DocumentFindFirstSchema: z.ZodType<Prisma.DocumentFindFirstArgs> = z.object({ select: DocumentFindFirstSelectSchema.optional(), include: z.lazy(() => DocumentIncludeObjectSchema.optional()), orderBy: z.union([DocumentOrderByWithRelationInputObjectSchema, DocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: DocumentWhereInputObjectSchema.optional(), cursor: DocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([DocumentScalarFieldEnumSchema, DocumentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.DocumentFindFirstArgs>;

export const DocumentFindFirstZodSchema = z.object({ select: DocumentFindFirstSelectSchema.optional(), include: z.lazy(() => DocumentIncludeObjectSchema.optional()), orderBy: z.union([DocumentOrderByWithRelationInputObjectSchema, DocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: DocumentWhereInputObjectSchema.optional(), cursor: DocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([DocumentScalarFieldEnumSchema, DocumentScalarFieldEnumSchema.array()]).optional() }).strict();