import { z } from 'zod';
import { BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandIncludeObjectSchema } from './objects/BrandInclude.schema';
import { BrandWhereUniqueInputObjectSchema } from './objects/BrandWhereUniqueInput.schema';

export const BrandDeleteOneSchema = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), where: BrandWhereUniqueInputObjectSchema  })