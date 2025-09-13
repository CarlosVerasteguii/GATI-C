import { z } from 'zod';
import { PendingTaskSelectObjectSchema } from './objects/PendingTaskSelect.schema';
import { PendingTaskIncludeObjectSchema } from './objects/PendingTaskInclude.schema';
import { PendingTaskCreateInputObjectSchema } from './objects/PendingTaskCreateInput.schema';
import { PendingTaskUncheckedCreateInputObjectSchema } from './objects/PendingTaskUncheckedCreateInput.schema';

export const PendingTaskCreateOneSchema = z.object({ select: PendingTaskSelectObjectSchema.optional(), include: PendingTaskIncludeObjectSchema.optional(), data: z.union([PendingTaskCreateInputObjectSchema, PendingTaskUncheckedCreateInputObjectSchema])  })