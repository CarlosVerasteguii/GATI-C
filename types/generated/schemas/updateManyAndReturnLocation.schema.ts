import { z } from 'zod';
import { LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationUpdateManyMutationInputObjectSchema } from './objects/LocationUpdateManyMutationInput.schema';
import { LocationWhereInputObjectSchema } from './objects/LocationWhereInput.schema';

export const LocationUpdateManyAndReturnSchema = z.object({ select: LocationSelectObjectSchema.optional(), data: LocationUpdateManyMutationInputObjectSchema, where: LocationWhereInputObjectSchema.optional()  }).strict()