import { z } from 'zod';
import { ProductSelectObjectSchema } from './objects/ProductSelect.schema';
import { ProductUpdateManyMutationInputObjectSchema } from './objects/ProductUpdateManyMutationInput.schema';
import { ProductWhereInputObjectSchema } from './objects/ProductWhereInput.schema';

export const ProductUpdateManyAndReturnSchema = z.object({ select: ProductSelectObjectSchema.optional(), data: ProductUpdateManyMutationInputObjectSchema, where: ProductWhereInputObjectSchema.optional()  }).strict()