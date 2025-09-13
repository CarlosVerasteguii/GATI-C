import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { LocationWhereInputObjectSchema } from './objects/LocationWhereInput.schema';
import { LocationOrderByWithAggregationInputObjectSchema } from './objects/LocationOrderByWithAggregationInput.schema';
import { LocationScalarWhereWithAggregatesInputObjectSchema } from './objects/LocationScalarWhereWithAggregatesInput.schema';
import { LocationScalarFieldEnumSchema } from './enums/LocationScalarFieldEnum.schema';
import { LocationCountAggregateInputObjectSchema } from './objects/LocationCountAggregateInput.schema';
import { LocationMinAggregateInputObjectSchema } from './objects/LocationMinAggregateInput.schema';
import { LocationMaxAggregateInputObjectSchema } from './objects/LocationMaxAggregateInput.schema';

export const LocationGroupBySchema: z.ZodType<Prisma.LocationGroupByArgs> = z.object({ where: LocationWhereInputObjectSchema.optional(), orderBy: z.union([LocationOrderByWithAggregationInputObjectSchema, LocationOrderByWithAggregationInputObjectSchema.array()]).optional(), having: LocationScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(LocationScalarFieldEnumSchema), _count: z.union([ z.literal(true), LocationCountAggregateInputObjectSchema ]).optional(), _min: LocationMinAggregateInputObjectSchema.optional(), _max: LocationMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.LocationGroupByArgs>;

export const LocationGroupByZodSchema = z.object({ where: LocationWhereInputObjectSchema.optional(), orderBy: z.union([LocationOrderByWithAggregationInputObjectSchema, LocationOrderByWithAggregationInputObjectSchema.array()]).optional(), having: LocationScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(LocationScalarFieldEnumSchema), _count: z.union([ z.literal(true), LocationCountAggregateInputObjectSchema ]).optional(), _min: LocationMinAggregateInputObjectSchema.optional(), _max: LocationMaxAggregateInputObjectSchema.optional() }).strict();