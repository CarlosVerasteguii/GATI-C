import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { DocumentWhereInputObjectSchema } from './objects/DocumentWhereInput.schema';
import { DocumentOrderByWithAggregationInputObjectSchema } from './objects/DocumentOrderByWithAggregationInput.schema';
import { DocumentScalarWhereWithAggregatesInputObjectSchema } from './objects/DocumentScalarWhereWithAggregatesInput.schema';
import { DocumentScalarFieldEnumSchema } from './enums/DocumentScalarFieldEnum.schema';
import { DocumentCountAggregateInputObjectSchema } from './objects/DocumentCountAggregateInput.schema';
import { DocumentMinAggregateInputObjectSchema } from './objects/DocumentMinAggregateInput.schema';
import { DocumentMaxAggregateInputObjectSchema } from './objects/DocumentMaxAggregateInput.schema';

export const DocumentGroupBySchema: z.ZodType<Prisma.DocumentGroupByArgs> = z.object({ where: DocumentWhereInputObjectSchema.optional(), orderBy: z.union([DocumentOrderByWithAggregationInputObjectSchema, DocumentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: DocumentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(DocumentScalarFieldEnumSchema), _count: z.union([ z.literal(true), DocumentCountAggregateInputObjectSchema ]).optional(), _min: DocumentMinAggregateInputObjectSchema.optional(), _max: DocumentMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.DocumentGroupByArgs>;

export const DocumentGroupByZodSchema = z.object({ where: DocumentWhereInputObjectSchema.optional(), orderBy: z.union([DocumentOrderByWithAggregationInputObjectSchema, DocumentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: DocumentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(DocumentScalarFieldEnumSchema), _count: z.union([ z.literal(true), DocumentCountAggregateInputObjectSchema ]).optional(), _min: DocumentMinAggregateInputObjectSchema.optional(), _max: DocumentMaxAggregateInputObjectSchema.optional() }).strict();