import { z } from 'zod';
import { PendingTaskSelectObjectSchema } from './objects/PendingTaskSelect.schema';
import { PendingTaskIncludeObjectSchema } from './objects/PendingTaskInclude.schema';
import { PendingTaskWhereUniqueInputObjectSchema } from './objects/PendingTaskWhereUniqueInput.schema';

export const PendingTaskDeleteOneSchema = z.object({ select: PendingTaskSelectObjectSchema.optional(), include: PendingTaskIncludeObjectSchema.optional(), where: PendingTaskWhereUniqueInputObjectSchema  })