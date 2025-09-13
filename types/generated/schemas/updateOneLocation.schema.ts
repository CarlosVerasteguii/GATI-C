import { z } from 'zod';
import { LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationIncludeObjectSchema } from './objects/LocationInclude.schema';
import { LocationUpdateInputObjectSchema } from './objects/LocationUpdateInput.schema';
import { LocationUncheckedUpdateInputObjectSchema } from './objects/LocationUncheckedUpdateInput.schema';
import { LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';

export const LocationUpdateOneSchema = z.object({ select: LocationSelectObjectSchema.optional(), include: LocationIncludeObjectSchema.optional(), data: z.union([LocationUpdateInputObjectSchema, LocationUncheckedUpdateInputObjectSchema]), where: LocationWhereUniqueInputObjectSchema  })