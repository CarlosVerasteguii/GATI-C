import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskUpdateWithoutTaskAuditInputObjectSchema } from './PendingTaskUpdateWithoutTaskAuditInput.schema';
import { PendingTaskUncheckedUpdateWithoutTaskAuditInputObjectSchema } from './PendingTaskUncheckedUpdateWithoutTaskAuditInput.schema';
import { PendingTaskCreateWithoutTaskAuditInputObjectSchema } from './PendingTaskCreateWithoutTaskAuditInput.schema';
import { PendingTaskUncheckedCreateWithoutTaskAuditInputObjectSchema } from './PendingTaskUncheckedCreateWithoutTaskAuditInput.schema';
import { PendingTaskWhereInputObjectSchema } from './PendingTaskWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PendingTaskUpdateWithoutTaskAuditInputObjectSchema), z.lazy(() => PendingTaskUncheckedUpdateWithoutTaskAuditInputObjectSchema)]),
  create: z.union([z.lazy(() => PendingTaskCreateWithoutTaskAuditInputObjectSchema), z.lazy(() => PendingTaskUncheckedCreateWithoutTaskAuditInputObjectSchema)]),
  where: z.lazy(() => PendingTaskWhereInputObjectSchema).optional()
}).strict();
export const PendingTaskUpsertWithoutTaskAuditInputObjectSchema: z.ZodType<Prisma.PendingTaskUpsertWithoutTaskAuditInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUpsertWithoutTaskAuditInput>;
export const PendingTaskUpsertWithoutTaskAuditInputObjectZodSchema = makeSchema();
