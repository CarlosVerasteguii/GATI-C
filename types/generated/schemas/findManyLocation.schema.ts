import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { LocationIncludeObjectSchema } from './objects/LocationInclude.schema';
import { LocationOrderByWithRelationInputObjectSchema } from './objects/LocationOrderByWithRelationInput.schema';
import { LocationWhereInputObjectSchema } from './objects/LocationWhereInput.schema';
import { LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';
import { LocationScalarFieldEnumSchema } from './enums/LocationScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const LocationFindManySelectSchema: z.ZodType<Prisma.LocationSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.LocationSelect>;

export const LocationFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const LocationFindManySchema: z.ZodType<Prisma.LocationFindManyArgs> = z.object({ select: LocationFindManySelectSchema.optional(), include: z.lazy(() => LocationIncludeObjectSchema.optional()), orderBy: z.union([LocationOrderByWithRelationInputObjectSchema, LocationOrderByWithRelationInputObjectSchema.array()]).optional(), where: LocationWhereInputObjectSchema.optional(), cursor: LocationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LocationScalarFieldEnumSchema, LocationScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.LocationFindManyArgs>;

export const LocationFindManyZodSchema = z.object({ select: LocationFindManySelectSchema.optional(), include: z.lazy(() => LocationIncludeObjectSchema.optional()), orderBy: z.union([LocationOrderByWithRelationInputObjectSchema, LocationOrderByWithRelationInputObjectSchema.array()]).optional(), where: LocationWhereInputObjectSchema.optional(), cursor: LocationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LocationScalarFieldEnumSchema, LocationScalarFieldEnumSchema.array()]).optional() }).strict();