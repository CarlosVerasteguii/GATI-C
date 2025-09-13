import { z } from 'zod';
import { BrandCreateManyInputObjectSchema } from './objects/BrandCreateManyInput.schema';

export const BrandCreateManySchema = z.object({ data: z.union([ BrandCreateManyInputObjectSchema, z.array(BrandCreateManyInputObjectSchema) ]),  })