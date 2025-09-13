import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableFloatFieldUpdateOperationsInputObjectSchema } from './NullableFloatFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BrandUpdateOneWithoutProductsNestedInputObjectSchema } from './BrandUpdateOneWithoutProductsNestedInput.schema';
import { CategoryUpdateOneWithoutProductsNestedInputObjectSchema } from './CategoryUpdateOneWithoutProductsNestedInput.schema';
import { LocationUpdateOneWithoutProductsNestedInputObjectSchema } from './LocationUpdateOneWithoutProductsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  serialNumber: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  cost: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  purchaseDate: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  condition: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  brand: z.lazy(() => BrandUpdateOneWithoutProductsNestedInputObjectSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneWithoutProductsNestedInputObjectSchema).optional(),
  location: z.lazy(() => LocationUpdateOneWithoutProductsNestedInputObjectSchema).optional()
}).strict();
export const ProductUpdateWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ProductUpdateWithoutDocumentsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateWithoutDocumentsInput>;
export const ProductUpdateWithoutDocumentsInputObjectZodSchema = makeSchema();
