import { z } from 'zod';
import { PendingTaskWhereInputObjectSchema } from './objects/PendingTaskWhereInput.schema';

export const PendingTaskDeleteManySchema = z.object({ where: PendingTaskWhereInputObjectSchema.optional()  })