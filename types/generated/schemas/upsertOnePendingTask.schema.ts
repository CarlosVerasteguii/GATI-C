import { z } from 'zod';
import { PendingTaskSelectObjectSchema } from './objects/PendingTaskSelect.schema';
import { PendingTaskIncludeObjectSchema } from './objects/PendingTaskInclude.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './objects/PendingTaskWhereUniqueInput.schema';
import { PendingTaskCreateInputObjectSchema } from './objects/PendingTaskCreateInput.schema';
import { PendingTaskUncheckedCreateInputObjectSchema } from './objects/PendingTaskUncheckedCreateInput.schema';
import { PendingTaskUpdateInputObjectSchema } from './objects/PendingTaskUpdateInput.schema';
import { PendingTaskUncheckedUpdateInputObjectSchema } from './objects/PendingTaskUncheckedUpdateInput.schema';

export const PendingTaskUpsertSchema = z.object({ select: PendingTaskSelectObjectSchema.optional(), include: PendingTaskIncludeObjectSchema.optional(), where: PendingTaskWhereUniqueInputObjectSchema, create: z.union([ PendingTaskCreateInputObjectSchema, PendingTaskUncheckedCreateInputObjectSchema ]), update: z.union([ PendingTaskUpdateInputObjectSchema, PendingTaskUncheckedUpdateInputObjectSchema ])  })