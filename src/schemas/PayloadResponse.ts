import { z } from 'zod';

export const PayloadResponse = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    docs: z.array(itemSchema),
    totalDocs: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    page: z.number(),
    pagingCounter: z.number(),
    hasPrevPage: z.boolean(),
    hasNextPage: z.boolean(),
    prevPage: z.number().nullable(),
    nextPage: z.number().nullable(),
  });