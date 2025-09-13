import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DocumentOrderByWithRelationInputObjectSchema } from './objects/DocumentOrderByWithRelationInput.schema';
import { DocumentWhereInputObjectSchema } from './objects/DocumentWhereInput.schema';
import { DocumentWhereUniqueInputObjectSchema } from './objects/DocumentWhereUniqueInput.schema';
import { DocumentCountAggregateInputObjectSchema } from './objects/DocumentCountAggregateInput.schema';
import { DocumentMinAggregateInputObjectSchema } from './objects/DocumentMinAggregateInput.schema';
import { DocumentMaxAggregateInputObjectSchema } from './objects/DocumentMaxAggregateInput.schema';

export const DocumentAggregateSchema: z.ZodType<Prisma.DocumentAggregateArgs> = z.object({ orderBy: z.union([DocumentOrderByWithRelationInputObjectSchema, DocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: DocumentWhereInputObjectSchema.optional(), cursor: DocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), DocumentCountAggregateInputObjectSchema ]).optional(), _min: DocumentMinAggregateInputObjectSchema.optional(), _max: DocumentMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.DocumentAggregateArgs>;

export const DocumentAggregateZodSchema = z.object({ orderBy: z.union([DocumentOrderByWithRelationInputObjectSchema, DocumentOrderByWithRelationInputObjectSchema.array()]).optional(), where: DocumentWhereInputObjectSchema.optional(), cursor: DocumentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), DocumentCountAggregateInputObjectSchema ]).optional(), _min: DocumentMinAggregateInputObjectSchema.optional(), _max: DocumentMaxAggregateInputObjectSchema.optional() }).strict();