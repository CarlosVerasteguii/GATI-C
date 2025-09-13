import { z } from 'zod';
import { PendingTaskSelectObjectSchema } from './objects/PendingTaskSelect.schema';
import { PendingTaskCreateManyInputObjectSchema } from './objects/PendingTaskCreateManyInput.schema';

export const PendingTaskCreateManyAndReturnSchema = z.object({ select: PendingTaskSelectObjectSchema.optional(), data: z.union([ PendingTaskCreateManyInputObjectSchema, z.array(PendingTaskCreateManyInputObjectSchema) ]),  }).strict()