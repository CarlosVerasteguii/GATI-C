import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { PendingTaskSelectObjectSchema } from './objects/PendingTaskSelect.schema';
import { PendingTaskIncludeObjectSchema } from './objects/PendingTaskInclude.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './objects/PendingTaskWhereUniqueInput.schema';

export const PendingTaskFindUniqueSchema: z.ZodType<Prisma.PendingTaskFindUniqueArgs> = z.object({ select: PendingTaskSelectObjectSchema.optional(), include: PendingTaskIncludeObjectSchema.optional(), where: PendingTaskWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PendingTaskFindUniqueArgs>;

export const PendingTaskFindUniqueZodSchema = z.object({ select: PendingTaskSelectObjectSchema.optional(), include: PendingTaskIncludeObjectSchema.optional(), where: PendingTaskWhereUniqueInputObjectSchema }).strict();