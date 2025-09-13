import { z } from 'zod';
import { DocumentSelectObjectSchema } from './objects/DocumentSelect.schema';
import { DocumentIncludeObjectSchema } from './objects/DocumentInclude.schema';
import { DocumentCreateInputObjectSchema } from './objects/DocumentCreateInput.schema';
import { DocumentUncheckedCreateInputObjectSchema } from './objects/DocumentUncheckedCreateInput.schema';

export const DocumentCreateOneSchema = z.object({ select: DocumentSelectObjectSchema.optional(), include: DocumentIncludeObjectSchema.optional(), data: z.union([DocumentCreateInputObjectSchema, DocumentUncheckedCreateInputObjectSchema])  })