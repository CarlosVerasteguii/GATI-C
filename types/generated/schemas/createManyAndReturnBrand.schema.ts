import { z } from 'zod';
import { BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandCreateManyInputObjectSchema } from './objects/BrandCreateManyInput.schema';

export const BrandCreateManyAndReturnSchema = z.object({ select: BrandSelectObjectSchema.optional(), data: z.union([ BrandCreateManyInputObjectSchema, z.array(BrandCreateManyInputObjectSchema) ]),  }).strict()