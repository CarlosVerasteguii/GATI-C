import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { LocationOrderByWithRelationInputObjectSchema } from './objects/LocationOrderByWithRelationInput.schema';
import { LocationWhereInputObjectSchema } from './objects/LocationWhereInput.schema';
import { LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';
import { LocationCountAggregateInputObjectSchema } from './objects/LocationCountAggregateInput.schema';

export const LocationCountSchema: z.ZodType<Prisma.LocationCountArgs> = z.object({ orderBy: z.union([LocationOrderByWithRelationInputObjectSchema, LocationOrderByWithRelationInputObjectSchema.array()]).optional(), where: LocationWhereInputObjectSchema.optional(), cursor: LocationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), LocationCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.LocationCountArgs>;

export const LocationCountZodSchema = z.object({ orderBy: z.union([LocationOrderByWithRelationInputObjectSchema, LocationOrderByWithRelationInputObjectSchema.array()]).optional(), where: LocationWhereInputObjectSchema.optional(), cursor: LocationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), LocationCountAggregateInputObjectSchema ]).optional() }).strict();