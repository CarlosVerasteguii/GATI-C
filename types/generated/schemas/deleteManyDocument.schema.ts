import { z } from 'zod';
import { DocumentWhereInputObjectSchema } from './objects/DocumentWhereInput.schema';

export const DocumentDeleteManySchema = z.object({ where: DocumentWhereInputObjectSchema.optional()  })