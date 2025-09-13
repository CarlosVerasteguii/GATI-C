import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DocumentOrderByWithRelationInputObjectSchema } from './objects/DocumentOrderByWithRelationInput.schema';
import { DocumentWhereInputObjectSchema } from './objects/DocumentWhereInput.schema';
import { DocumentWhereUniqueInputObjectSchema } from './objects/DocumentWhereUniqueInput.schema';
import { DocumentCountAggregateInputObjectSchema } from './objects/DocumentCountAggregateInput.schema';

export const DocumentCountSchema: z.ZodType<Prisma.DocumentCountArgs> = z.object({ orderBy: z.union([DocumentOrderByWithRelationInputObjectSchema, DocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: DocumentWhereInputObjectSchema.optional(), cursor: DocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), DocumentCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.DocumentCountArgs>;

export const DocumentCountZodSchema = z.object({ orderBy: z.union([DocumentOrderByWithRelationInputObjectSchema, DocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: DocumentWhereInputObjectSchema.optional(), cursor: DocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), DocumentCountAggregateInputObjectSchema ]).optional() }).strict();