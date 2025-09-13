import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { PendingTaskIncludeObjectSchema } from './objects/PendingTaskInclude.schema';
import { PendingTaskOrderByWithRelationInputObjectSchema } from './objects/PendingTaskOrderByWithRelationInput.schema';
import { PendingTaskWhereInputObjectSchema } from './objects/PendingTaskWhereInput.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './objects/PendingTaskWhereUniqueInput.schema';
import { PendingTaskScalarFieldEnumSchema } from './enums/PendingTaskScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PendingTaskFindFirstSelectSchema: z.ZodType<Prisma.PendingTaskSelect> = z.object({
    id: z.boolean().optional(),
    creatorId: z.boolean().optional(),
    type: z.boolean().optional(),
    status: z.boolean().optional(),
    detailsJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    creator: z.boolean().optional(),
    taskAudit: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PendingTaskSelect>;

export const PendingTaskFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    creatorId: z.boolean().optional(),
    type: z.boolean().optional(),
    status: z.boolean().optional(),
    detailsJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    creator: z.boolean().optional(),
    taskAudit: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const PendingTaskFindFirstSchema: z.ZodType<Prisma.PendingTaskFindFirstArgs> = z.object({ select: PendingTaskFindFirstSelectSchema.optional(), include: z.lazy(() => PendingTaskIncludeObjectSchema.optional()), orderBy: z.union([PendingTaskOrderByWithRelationInputObjectSchema, PendingTaskOrderByWithRelationInputObjectSchema.array()]).optional(), where: PendingTaskWhereInputObjectSchema.optional(), cursor: PendingTaskWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PendingTaskScalarFieldEnumSchema, PendingTaskScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PendingTaskFindFirstArgs>;

export const PendingTaskFindFirstZodSchema = z.object({ select: PendingTaskFindFirstSelectSchema.optional(), include: z.lazy(() => PendingTaskIncludeObjectSchema.optional()), orderBy: z.union([PendingTaskOrderByWithRelationInputObjectSchema, PendingTaskOrderByWithRelationInputObjectSchema.array()]).optional(), where: PendingTaskWhereInputObjectSchema.optional(), cursor: PendingTaskWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PendingTaskScalarFieldEnumSchema, PendingTaskScalarFieldEnumSchema.array()]).optional() }).strict();