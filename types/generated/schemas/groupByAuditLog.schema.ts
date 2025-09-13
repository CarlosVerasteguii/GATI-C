import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { AuditLogWhereInputObjectSchema } from './objects/AuditLogWhereInput.schema';
import { AuditLogOrderByWithAggregationInputObjectSchema } from './objects/AuditLogOrderByWithAggregationInput.schema';
import { AuditLogScalarWhereWithAggregatesInputObjectSchema } from './objects/AuditLogScalarWhereWithAggregatesInput.schema';
import { AuditLogScalarFieldEnumSchema } from './enums/AuditLogScalarFieldEnum.schema';
import { AuditLogCountAggregateInputObjectSchema } from './objects/AuditLogCountAggregateInput.schema';
import { AuditLogMinAggregateInputObjectSchema } from './objects/AuditLogMinAggregateInput.schema';
import { AuditLogMaxAggregateInputObjectSchema } from './objects/AuditLogMaxAggregateInput.schema';

export const AuditLogGroupBySchema: z.ZodType<Prisma.AuditLogGroupByArgs> = z.object({ where: AuditLogWhereInputObjectSchema.optional(), orderBy: z.union([AuditLogOrderByWithAggregationInputObjectSchema, AuditLogOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AuditLogScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AuditLogScalarFieldEnumSchema), _count: z.union([ z.literal(true), AuditLogCountAggregateInputObjectSchema ]).optional(), _min: AuditLogMinAggregateInputObjectSchema.optional(), _max: AuditLogMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AuditLogGroupByArgs>;

export const AuditLogGroupByZodSchema = z.object({ where: AuditLogWhereInputObjectSchema.optional(), orderBy: z.union([AuditLogOrderByWithAggregationInputObjectSchema, AuditLogOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AuditLogScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AuditLogScalarFieldEnumSchema), _count: z.union([ z.literal(true), AuditLogCountAggregateInputObjectSchema ]).optional(), _min: AuditLogMinAggregateInputObjectSchema.optional(), _max: AuditLogMaxAggregateInputObjectSchema.optional() }).strict();