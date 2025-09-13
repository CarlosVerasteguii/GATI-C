import { z } from 'zod';
import { PendingTaskSelectObjectSchema } from './objects/PendingTaskSelect.schema';
import { PendingTaskIncludeObjectSchema } from './objects/PendingTaskInclude.schema';
import { PendingTaskUpdateInputObjectSchema } from './objects/PendingTaskUpdateInput.schema';
import { PendingTaskUncheckedUpdateInputObjectSchema } from './objects/PendingTaskUncheckedUpdateInput.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './objects/PendingTaskWhereUniqueInput.schema';

export const PendingTaskUpdateOneSchema = z.object({ select: PendingTaskSelectObjectSchema.optional(), include: PendingTaskIncludeObjectSchema.optional(), data: z.union([PendingTaskUpdateInputObjectSchema, PendingTaskUncheckedUpdateInputObjectSchema]), where: PendingTaskWhereUniqueInputObjectSchema  })