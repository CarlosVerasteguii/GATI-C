import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskWhereInputObjectSchema } from './PendingTaskWhereInput.schema';
import { PendingTaskUpdateWithoutTaskAuditInputObjectSchema } from './PendingTaskUpdateWithoutTaskAuditInput.schema';
import { PendingTaskUncheckedUpdateWithoutTaskAuditInputObjectSchema } from './PendingTaskUncheckedUpdateWithoutTaskAuditInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PendingTaskWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PendingTaskUpdateWithoutTaskAuditInputObjectSchema), z.lazy(() => PendingTaskUncheckedUpdateWithoutTaskAuditInputObjectSchema)])
}).strict();
export const PendingTaskUpdateToOneWithWhereWithoutTaskAuditInputObjectSchema: z.ZodType<Prisma.PendingTaskUpdateToOneWithWhereWithoutTaskAuditInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskUpdateToOneWithWhereWithoutTaskAuditInput>;
export const PendingTaskUpdateToOneWithWhereWithoutTaskAuditInputObjectZodSchema = makeSchema();
