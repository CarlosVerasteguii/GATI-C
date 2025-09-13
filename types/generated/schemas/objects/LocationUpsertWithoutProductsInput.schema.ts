import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { LocationUpdateWithoutProductsInputObjectSchema } from './LocationUpdateWithoutProductsInput.schema';
import { LocationUncheckedUpdateWithoutProductsInputObjectSchema } from './LocationUncheckedUpdateWithoutProductsInput.schema';
import { LocationCreateWithoutProductsInputObjectSchema } from './LocationCreateWithoutProductsInput.schema';
import { LocationUncheckedCreateWithoutProductsInputObjectSchema } from './LocationUncheckedCreateWithoutProductsInput.schema';
import { LocationWhereInputObjectSchema } from './LocationWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => LocationUpdateWithoutProductsInputObjectSchema), z.lazy(() => LocationUncheckedUpdateWithoutProductsInputObjectSchema)]),
  create: z.union([z.lazy(() => LocationCreateWithoutProductsInputObjectSchema), z.lazy(() => LocationUncheckedCreateWithoutProductsInputObjectSchema)]),
  where: z.lazy(() => LocationWhereInputObjectSchema).optional()
}).strict();
export const LocationUpsertWithoutProductsInputObjectSchema: z.ZodType<Prisma.LocationUpsertWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationUpsertWithoutProductsInput>;
export const LocationUpsertWithoutProductsInputObjectZodSchema = makeSchema();
