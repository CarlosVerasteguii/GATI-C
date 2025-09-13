import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { LocationWhereUniqueInputObjectSchema } from './LocationWhereUniqueInput.schema';
import { LocationCreateWithoutProductsInputObjectSchema } from './LocationCreateWithoutProductsInput.schema';
import { LocationUncheckedCreateWithoutProductsInputObjectSchema } from './LocationUncheckedCreateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => LocationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => LocationCreateWithoutProductsInputObjectSchema), z.lazy(() => LocationUncheckedCreateWithoutProductsInputObjectSchema)])
}).strict();
export const LocationCreateOrConnectWithoutProductsInputObjectSchema: z.ZodType<Prisma.LocationCreateOrConnectWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationCreateOrConnectWithoutProductsInput>;
export const LocationCreateOrConnectWithoutProductsInputObjectZodSchema = makeSchema();
