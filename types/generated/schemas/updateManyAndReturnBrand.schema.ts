import { z } from 'zod';
import { BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandUpdateManyMutationInputObjectSchema } from './objects/BrandUpdateManyMutationInput.schema';
import { BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';

export const BrandUpdateManyAndReturnSchema = z.object({ select: BrandSelectObjectSchema.optional(), data: BrandUpdateManyMutationInputObjectSchema, where: BrandWhereInputObjectSchema.optional()  }).strict()