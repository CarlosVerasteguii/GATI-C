import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { LocationWhereInputObjectSchema } from './LocationWhereInput.schema';
import { LocationUpdateWithoutProductsInputObjectSchema } from './LocationUpdateWithoutProductsInput.schema';
import { LocationUncheckedUpdateWithoutProductsInputObjectSchema } from './LocationUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => LocationWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => LocationUpdateWithoutProductsInputObjectSchema), z.lazy(() => LocationUncheckedUpdateWithoutProductsInputObjectSchema)])
}).strict();
export const LocationUpdateToOneWithWhereWithoutProductsInputObjectSchema: z.ZodType<Prisma.LocationUpdateToOneWithWhereWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationUpdateToOneWithWhereWithoutProductsInput>;
export const LocationUpdateToOneWithWhereWithoutProductsInputObjectZodSchema = makeSchema();
