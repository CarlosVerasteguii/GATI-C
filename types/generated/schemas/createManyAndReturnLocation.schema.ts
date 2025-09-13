import { z } from 'zod';
import { LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationCreateManyInputObjectSchema } from './objects/LocationCreateManyInput.schema';

export const LocationCreateManyAndReturnSchema = z.object({ select: LocationSelectObjectSchema.optional(), data: z.union([ LocationCreateManyInputObjectSchema, z.array(LocationCreateManyInputObjectSchema) ]),  }).strict()