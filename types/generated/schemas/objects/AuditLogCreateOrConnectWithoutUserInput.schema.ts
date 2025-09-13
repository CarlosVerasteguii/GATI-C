import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { AuditLogWhereUniqueInputObjectSchema } from './AuditLogWhereUniqueInput.schema';
import { AuditLogCreateWithoutUserInputObjectSchema } from './AuditLogCreateWithoutUserInput.schema';
import { AuditLogUncheckedCreateWithoutUserInputObjectSchema } from './AuditLogUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AuditLogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AuditLogCreateWithoutUserInputObjectSchema), z.lazy(() => AuditLogUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const AuditLogCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.AuditLogCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.AuditLogCreateOrConnectWithoutUserInput>;
export const AuditLogCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
