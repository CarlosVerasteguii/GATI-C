import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { LocationIncludeObjectSchema } from './objects/LocationInclude.schema';
import { LocationOrderByWithRelationInputObjectSchema } from './objects/LocationOrderByWithRelationInput.schema';
import { LocationWhereInputObjectSchema } from './objects/LocationWhereInput.schema';
import { LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';
import { LocationScalarFieldEnumSchema } from './enums/LocationScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const LocationFindFirstSelectSchema: z.ZodType<Prisma.LocationSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.LocationSelect>;

export const LocationFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const LocationFindFirstSchema: z.ZodType<Prisma.LocationFindFirstArgs> = z.object({ select: LocationFindFirstSelectSchema.optional(), include: z.lazy(() => LocationIncludeObjectSchema.optional()), orderBy: z.union([LocationOrderByWithRelationInputObjectSchema, LocationOrderByWithRelationInputObjectSchema.array()]).optional(), where: LocationWhereInputObjectSchema.optional(), cursor: LocationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LocationScalarFieldEnumSchema, LocationScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.LocationFindFirstArgs>;

export const LocationFindFirstZodSchema = z.object({ select: LocationFindFirstSelectSchema.optional(), include: z.lazy(() => LocationIncludeObjectSchema.optional()), orderBy: z.union([LocationOrderByWithRelationInputObjectSchema, LocationOrderByWithRelationInputObjectSchema.array()]).optional(), where: LocationWhereInputObjectSchema.optional(), cursor: LocationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LocationScalarFieldEnumSchema, LocationScalarFieldEnumSchema.array()]).optional() }).strict();