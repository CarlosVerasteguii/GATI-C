import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskWhereUniqueInputObjectSchema } from './PendingTaskWhereUniqueInput.schema';
import { PendingTaskCreateWithoutTaskAuditInputObjectSchema } from './PendingTaskCreateWithoutTaskAuditInput.schema';
import { PendingTaskUncheckedCreateWithoutTaskAuditInputObjectSchema } from './PendingTaskUncheckedCreateWithoutTaskAuditInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PendingTaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PendingTaskCreateWithoutTaskAuditInputObjectSchema), z.lazy(() => PendingTaskUncheckedCreateWithoutTaskAuditInputObjectSchema)])
}).strict();
export const PendingTaskCreateOrConnectWithoutTaskAuditInputObjectSchema: z.ZodType<Prisma.PendingTaskCreateOrConnectWithoutTaskAuditInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCreateOrConnectWithoutTaskAuditInput>;
export const PendingTaskCreateOrConnectWithoutTaskAuditInputObjectZodSchema = makeSchema();
