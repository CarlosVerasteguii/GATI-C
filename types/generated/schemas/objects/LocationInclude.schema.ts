import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductFindManySchema } from '../findManyProduct.schema';
import { LocationCountOutputTypeArgsObjectSchema } from './LocationCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  products: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => LocationCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const LocationIncludeObjectSchema: z.ZodType<Prisma.LocationInclude> = makeSchema() as unknown as z.ZodType<Prisma.LocationInclude>;
export const LocationIncludeObjectZodSchema = makeSchema();
