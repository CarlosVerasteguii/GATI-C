import { z } from 'zod';
import { LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationIncludeObjectSchema } from './objects/LocationInclude.schema';
import { LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';
import { LocationCreateInputObjectSchema } from './objects/LocationCreateInput.schema';
import { LocationUncheckedCreateInputObjectSchema } from './objects/LocationUncheckedCreateInput.schema';
import { LocationUpdateInputObjectSchema } from './objects/LocationUpdateInput.schema';
import { LocationUncheckedUpdateInputObjectSchema } from './objects/LocationUncheckedUpdateInput.schema';

export const LocationUpsertSchema = z.object({ select: LocationSelectObjectSchema.optional(), include: LocationIncludeObjectSchema.optional(), where: LocationWhereUniqueInputObjectSchema, create: z.union([ LocationCreateInputObjectSchema, LocationUncheckedCreateInputObjectSchema ]), update: z.union([ LocationUpdateInputObjectSchema, LocationUncheckedUpdateInputObjectSchema ])  })