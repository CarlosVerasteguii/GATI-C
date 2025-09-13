import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskCreateWithoutTaskAuditInputObjectSchema } from './PendingTaskCreateWithoutTaskAuditInput.schema';
import { PendingTaskUncheckedCreateWithoutTaskAuditInputObjectSchema } from './PendingTaskUncheckedCreateWithoutTaskAuditInput.schema';
import { PendingTaskCreateOrConnectWithoutTaskAuditInputObjectSchema } from './PendingTaskCreateOrConnectWithoutTaskAuditInput.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './PendingTaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PendingTaskCreateWithoutTaskAuditInputObjectSchema), z.lazy(() => PendingTaskUncheckedCreateWithoutTaskAuditInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PendingTaskCreateOrConnectWithoutTaskAuditInputObjectSchema).optional(),
  connect: z.lazy(() => PendingTaskWhereUniqueInputObjectSchema).optional()
}).strict();
export const PendingTaskCreateNestedOneWithoutTaskAuditInputObjectSchema: z.ZodType<Prisma.PendingTaskCreateNestedOneWithoutTaskAuditInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCreateNestedOneWithoutTaskAuditInput>;
export const PendingTaskCreateNestedOneWithoutTaskAuditInputObjectZodSchema = makeSchema();
