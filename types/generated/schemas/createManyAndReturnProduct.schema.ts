import { z } from 'zod';
import { ProductSelectObjectSchema } from './objects/ProductSelect.schema';
import { ProductCreateManyInputObjectSchema } from './objects/ProductCreateManyInput.schema';

export const ProductCreateManyAndReturnSchema = z.object({ select: ProductSelectObjectSchema.optional(), data: z.union([ ProductCreateManyInputObjectSchema, z.array(ProductCreateManyInputObjectSchema) ]),  }).strict()