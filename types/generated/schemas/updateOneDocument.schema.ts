import { z } from 'zod';
import { DocumentSelectObjectSchema } from './objects/DocumentSelect.schema';
import { DocumentIncludeObjectSchema } from './objects/DocumentInclude.schema';
import { DocumentUpdateInputObjectSchema } from './objects/DocumentUpdateInput.schema';
import { DocumentUncheckedUpdateInputObjectSchema } from './objects/DocumentUncheckedUpdateInput.schema';
import { DocumentWhereUniqueInputObjectSchema } from './objects/DocumentWhereUniqueInput.schema';

export const DocumentUpdateOneSchema = z.object({ select: DocumentSelectObjectSchema.optional(), include: DocumentIncludeObjectSchema.optional(), data: z.union([DocumentUpdateInputObjectSchema, DocumentUncheckedUpdateInputObjectSchema]), where: DocumentWhereUniqueInputObjectSchema  })