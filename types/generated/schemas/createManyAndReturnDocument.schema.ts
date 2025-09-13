import { z } from 'zod';
import { DocumentSelectObjectSchema } from './objects/DocumentSelect.schema';
import { DocumentCreateManyInputObjectSchema } from './objects/DocumentCreateManyInput.schema';

export const DocumentCreateManyAndReturnSchema = z.object({ select: DocumentSelectObjectSchema.optional(), data: z.union([ DocumentCreateManyInputObjectSchema, z.array(DocumentCreateManyInputObjectSchema) ]),  }).strict()