import { z } from 'zod';
import { DocumentSelectObjectSchema } from './objects/DocumentSelect.schema';
import { DocumentIncludeObjectSchema } from './objects/DocumentInclude.schema';
import { DocumentWhereUniqueInputObjectSchema } from './objects/DocumentWhereUniqueInput.schema';
import { DocumentCreateInputObjectSchema } from './objects/DocumentCreateInput.schema';
import { DocumentUncheckedCreateInputObjectSchema } from './objects/DocumentUncheckedCreateInput.schema';
import { DocumentUpdateInputObjectSchema } from './objects/DocumentUpdateInput.schema';
import { DocumentUncheckedUpdateInputObjectSchema } from './objects/DocumentUncheckedUpdateInput.schema';

export const DocumentUpsertSchema = z.object({ select: DocumentSelectObjectSchema.optional(), include: DocumentIncludeObjectSchema.optional(), where: DocumentWhereUniqueInputObjectSchema, create: z.union([ DocumentCreateInputObjectSchema, DocumentUncheckedCreateInputObjectSchema ]), update: z.union([ DocumentUpdateInputObjectSchema, DocumentUncheckedUpdateInputObjectSchema ])  })