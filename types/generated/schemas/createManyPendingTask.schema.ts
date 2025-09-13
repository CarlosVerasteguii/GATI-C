import { z } from 'zod';
import { PendingTaskCreateManyInputObjectSchema } from './objects/PendingTaskCreateManyInput.schema';

export const PendingTaskCreateManySchema = z.object({ data: z.union([ PendingTaskCreateManyInputObjectSchema, z.array(PendingTaskCreateManyInputObjectSchema) ]),  })