import { z } from 'zod';
import { LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationIncludeObjectSchema } from './objects/LocationInclude.schema';
import { LocationCreateInputObjectSchema } from './objects/LocationCreateInput.schema';
import { LocationUncheckedCreateInputObjectSchema } from './objects/LocationUncheckedCreateInput.schema';

export const LocationCreateOneSchema = z.object({ select: LocationSelectObjectSchema.optional(), include: LocationIncludeObjectSchema.optional(), data: z.union([LocationCreateInputObjectSchema, LocationUncheckedCreateInputObjectSchema])  })