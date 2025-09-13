import { z } from 'zod';
import { DocumentCreateManyInputObjectSchema } from './objects/DocumentCreateManyInput.schema';

export const DocumentCreateManySchema = z.object({ data: z.union([ DocumentCreateManyInputObjectSchema, z.array(DocumentCreateManyInputObjectSchema) ]),  })