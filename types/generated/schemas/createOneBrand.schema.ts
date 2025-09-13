import { z } from 'zod';
import { BrandSelectObjectSchema } from './objects/BrandSelect.schema';
import { BrandIncludeObjectSchema } from './objects/BrandInclude.schema';
import { BrandCreateInputObjectSchema } from './objects/BrandCreateInput.schema';
import { BrandUncheckedCreateInputObjectSchema } from './objects/BrandUncheckedCreateInput.schema';

export const BrandCreateOneSchema = z.object({ select: BrandSelectObjectSchema.optional(), include: BrandIncludeObjectSchema.optional(), data: z.union([BrandCreateInputObjectSchema, BrandUncheckedCreateInputObjectSchema])  })