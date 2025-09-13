import { z } from 'zod';
import { PendingTaskUpdateManyMutationInputObjectSchema } from './objects/PendingTaskUpdateManyMutationInput.schema';
import { PendingTaskWhereInputObjectSchema } from './objects/PendingTaskWhereInput.schema';

export const PendingTaskUpdateManySchema = z.object({ data: PendingTaskUpdateManyMutationInputObjectSchema, where: PendingTaskWhereInputObjectSchema.optional()  })