import { z } from 'zod';
import { BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandIncludeObjectSchema } from './objects/BrandInclude.schema';
import { BrandUpdateInputObjectSchema } from './objects/BrandUpdateInput.schema';
import { BrandUncheckedUpdateInputObjectSchema } from './objects/BrandUncheckedUpdateInput.schema';
import { BrandWhereUniqueInputObjectSchema } from './objects/BrandWhereUniqueInput.schema';

export const BrandUpdateOneSchema = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), data: z.union([BrandUpdateInputObjectSchema, BrandUncheckedUpdateInputObjectSchema]), where: BrandWhereUniqueInputObjectSchema  })