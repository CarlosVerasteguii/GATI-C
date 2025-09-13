import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { LocationCreateWithoutProductsInputObjectSchema } from './LocationCreateWithoutProductsInput.schema';
import { LocationUncheckedCreateWithoutProductsInputObjectSchema } from './LocationUncheckedCreateWithoutProductsInput.schema';
import { LocationCreateOrConnectWithoutProductsInputObjectSchema } from './LocationCreateOrConnectWithoutProductsInput.schema';
import { LocationWhereUniqueInputObjectSchema } from './LocationWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => LocationCreateWithoutProductsInputObjectSchema), z.lazy(() => LocationUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => LocationCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  connect: z.lazy(() => LocationWhereUniqueInputObjectSchema).optional()
}).strict();
export const LocationCreateNestedOneWithoutProductsInputObjectSchema: z.ZodType<Prisma.LocationCreateNestedOneWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationCreateNestedOneWithoutProductsInput>;
export const LocationCreateNestedOneWithoutProductsInputObjectZodSchema = makeSchema();
