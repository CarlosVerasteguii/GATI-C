import { z } from 'zod';
import { BrandUpdateManyMutationInputObjectSchema } from './objects/BrandUpdateManyMutationInput.schema';
import { BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';

export const BrandUpdateManySchema = z.object({ data: BrandUpdateManyMutationInputObjectSchema, where: BrandWhereInputObjectSchema.optional()  })