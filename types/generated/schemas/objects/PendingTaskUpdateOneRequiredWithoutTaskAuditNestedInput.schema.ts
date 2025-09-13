import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskCreateWithoutTaskAuditInputObjectSchema } from './PendingTaskCreateWithoutTaskAuditInput.schema';
import { PendingTaskUncheckedCreateWithoutTaskAuditInputObjectSchema } from './PendingTaskUncheckedCreateWithoutTaskAuditInput.schema';
import { PendingTaskCreateOrConnectWithoutTaskAuditInputObjectSchema } from './PendingTaskCreateOrConnectWithoutTaskAuditInput.schema';
import { PendingTaskUpsertWithoutTaskAuditInputObjectSchema } from './PendingTaskUpsertWithoutTaskAuditInput.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './PendingTaskWhereUniqueInput.schema';
import { PendingTaskUpdateToOneWithWhereWithoutTaskAuditInputObjectSchema } from './PendingTaskUpdateToOneWithWhereWithoutTaskAuditInput.schema';
import { PendingTaskUpdateWithoutTaskAuditInputObjectSchema } from './PendingTaskUpdateWithoutTaskAuditInput.schema';
import { PendingTaskUncheckedUpdateWithoutTaskAuditInputObjectSchema } from './PendingTaskUncheckedUpdateWithoutTaskAuditInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PendingTaskCreateWithoutTaskAuditInputObjectSchema), z.lazy(() => PendingTaskUncheckedCreateWithoutTaskAuditInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PendingTaskCreateOrConnectWithoutTaskAuditInputObjectSchema).optional(),
  upsert: z.lazy(() => PendingTaskUpsertWithoutTaskAuditInputObjectSchema).optional(),
  connect: z.lazy(() => PendingTaskWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PendingTaskUpdateToOneWithWhereWithoutTaskAuditInputObjectSchema), z.lazy(() => PendingTaskUpdateWithoutTaskAuditInputObjectSchema), z.lazy(() => PendingTaskUncheckedUpdateWithoutTaskAuditInputObjectSchema)]).optional()
}).strict();
export const PendingTaskUpdateOneRequiredWithoutTaskAuditNestedInputObjectSchema: z.ZodType<Prisma.PendingTaskUpdateOneRequiredWithoutTaskAuditNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUpdateOneRequiredWithoutTaskAuditNestedInput>;
export const PendingTaskUpdateOneRequiredWithoutTaskAuditNestedInputObjectZodSchema = makeSchema();
