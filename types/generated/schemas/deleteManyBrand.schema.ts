import { z } from 'zod';
import { BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';

export const BrandDeleteManySchema = z.object({ where: BrandWhereInputObjectSchema.optional()  })