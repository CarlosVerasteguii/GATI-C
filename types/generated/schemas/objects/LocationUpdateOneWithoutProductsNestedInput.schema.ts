import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { LocationCreateWithoutProductsInputObjectSchema } from './LocationCreateWithoutProductsInput.schema';
import { LocationUncheckedCreateWithoutProductsInputObjectSchema } from './LocationUncheckedCreateWithoutProductsInput.schema';
import { LocationCreateOrConnectWithoutProductsInputObjectSchema } from './LocationCreateOrConnectWithoutProductsInput.schema';
import { LocationUpsertWithoutProductsInputObjectSchema } from './LocationUpsertWithoutProductsInput.schema';
import { LocationWhereInputObjectSchema } from './LocationWhereInput.schema';
import { LocationWhereUniqueInputObjectSchema } from './LocationWhereUniqueInput.schema';
import { LocationUpdateToOneWithWhereWithoutProductsInputObjectSchema } from './LocationUpdateToOneWithWhereWithoutProductsInput.schema';
import { LocationUpdateWithoutProductsInputObjectSchema } from './LocationUpdateWithoutProductsInput.schema';
import { LocationUncheckedUpdateWithoutProductsInputObjectSchema } from './LocationUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => LocationCreateWithoutProductsInputObjectSchema), z.lazy(() => LocationUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => LocationCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  upsert: z.lazy(() => LocationUpsertWithoutProductsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => LocationWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => LocationWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => LocationWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => LocationUpdateToOneWithWhereWithoutProductsInputObjectSchema), z.lazy(() => LocationUpdateWithoutProductsInputObjectSchema), z.lazy(() => LocationUncheckedUpdateWithoutProductsInputObjectSchema)]).optional()
}).strict();
export const LocationUpdateOneWithoutProductsNestedInputObjectSchema: z.ZodType<Prisma.LocationUpdateOneWithoutProductsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationUpdateOneWithoutProductsNestedInput>;
export const LocationUpdateOneWithoutProductsNestedInputObjectZodSchema = makeSchema();
