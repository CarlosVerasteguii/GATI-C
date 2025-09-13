import { z } from 'zod';
import { PendingTaskSelectObjectSchema } from './objects/PendingTaskSelect.schema';
import { PendingTaskUpdateManyMutationInputObjectSchema } from './objects/PendingTaskUpdateManyMutationInput.schema';
import { PendingTaskWhereInputObjectSchema } from './objects/PendingTaskWhereInput.schema';

export const PendingTaskUpdateManyAndReturnSchema = z.object({ select: PendingTaskSelectObjectSchema.optional(), data: PendingTaskUpdateManyMutationInputObjectSchema, where: PendingTaskWhereInputObjectSchema.optional()  }).strict()