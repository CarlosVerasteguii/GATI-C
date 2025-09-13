import { z } from 'zod';
import { DocumentUpdateManyMutationInputObjectSchema } from './objects/DocumentUpdateManyMutationInput.schema';
import { DocumentWhereInputObjectSchema } from './objects/DocumentWhereInput.schema';

export const DocumentUpdateManySchema = z.object({ data: DocumentUpdateManyMutationInputObjectSchema, where: DocumentWhereInputObjectSchema.optional()  })