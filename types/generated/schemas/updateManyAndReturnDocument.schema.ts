import { z } from 'zod';
import { DocumentSelectObjectSchema } from './objects/DocumentSelect.schema';
import { DocumentUpdateManyMutationInputObjectSchema } from './objects/DocumentUpdateManyMutationInput.schema';
import { DocumentWhereInputObjectSchema } from './objects/DocumentWhereInput.schema';

export const DocumentUpdateManyAndReturnSchema = z.object({ select: DocumentSelectObjectSchema.optional(), data: DocumentUpdateManyMutationInputObjectSchema, where: DocumentWhereInputObjectSchema.optional()  }).strict()