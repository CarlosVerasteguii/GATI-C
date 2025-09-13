import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationIncludeObjectSchema } from './objects/LocationInclude.schema';
import { LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';

export const LocationFindUniqueSchema: z.ZodType<Prisma.LocationFindUniqueArgs> = z.object({ select: LocationSelectObjectSchema.optional(), include: LocationIncludeObjectSchema.optional(), where: LocationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.LocationFindUniqueArgs>;

export const LocationFindUniqueZodSchema = z.object({ select: LocationSelectObjectSchema.optional(), include: LocationIncludeObjectSchema.optional(), where: LocationWhereUniqueInputObjectSchema }).strict();