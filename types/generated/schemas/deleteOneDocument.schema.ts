import { z } from 'zod';
import { DocumentSelectObjectSchema } from './objects/DocumentSelect.schema';
import { DocumentIncludeObjectSchema } from './objects/DocumentInclude.schema';
import { DocumentWhereUniqueInputObjectSchema } from './objects/DocumentWhereUniqueInput.schema';

export const DocumentDeleteOneSchema = z.object({ select: DocumentSelectObjectSchema.optional(), include: DocumentIncludeObjectSchema.optional(), where: DocumentWhereUniqueInputObjectSchema  })