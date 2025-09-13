import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { AuditLogOrderByWithRelationInputObjectSchema } from './objects/AuditLogOrderByWithRelationInput.schema';
import { AuditLogWhereInputObjectSchema } from './objects/AuditLogWhereInput.schema';
import { AuditLogWhereUniqueInputObjectSchema } from './objects/AuditLogWhereUniqueInput.schema';
import { AuditLogCountAggregateInputObjectSchema } from './objects/AuditLogCountAggregateInput.schema';

export const AuditLogCountSchema: z.ZodType<Prisma.AuditLogCountArgs> = z.object({ orderBy: z.union([AuditLogOrderByWithRelationInputObjectSchema, AuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: AuditLogWhereInputObjectSchema.optional(), cursor: AuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AuditLogCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.AuditLogCountArgs>;

export const AuditLogCountZodSchema = z.object({ orderBy: z.union([AuditLogOrderByWithRelationInputObjectSchema, AuditLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: AuditLogWhereInputObjectSchema.optional(), cursor: AuditLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AuditLogCountAggregateInputObjectSchema ]).optional() }).strict();