import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductFindManySchema } from '../findManyProduct.schema';
import { LocationCountOutputTypeArgsObjectSchema } from './LocationCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  products: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => LocationCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const LocationSelectObjectSchema: z.ZodType<Prisma.LocationSelect> = makeSchema() as unknown as z.ZodType<Prisma.LocationSelect>;
export const LocationSelectObjectZodSchema = makeSchema();
