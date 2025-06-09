import { PayloadDocument } from "./PayloadDocument";
import type { Json } from '../types/Json';
import { z } from 'zod';

export class PayloadCollection {
  docs: PayloadDocument[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;

  constructor(params: {
    docs: PayloadDocument[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  }) {
    this.docs = params.docs;
    this.totalDocs = params.totalDocs;
    this.limit = params.limit;
    this.totalPages = params.totalPages;
    this.page = params.page;
    this.hasPrevPage = params.hasPrevPage;
    this.hasNextPage = params.hasNextPage;
  }

  static fromJson(json: Json): PayloadCollection {
    const schema = z.object({
      docs: z.array(z.any()),
      totalDocs: z.number().default(0),
      limit: z.number().default(10),
      totalPages: z.number().default(1),
      page: z.number().default(1),
      hasPrevPage: z.boolean().default(false),
      hasNextPage: z.boolean().default(false),
    });

    const result = schema.safeParse(json);

    if (!result.success) {
      throw new Error(`Invalid PayloadCollection JSON: ${result.error.message}`);
    }

    const docs = result.data.docs.map((doc: any) => new PayloadDocument(doc));

    return new PayloadCollection({
      docs,
      totalDocs: json['totalDocs'] ?? 0,
      limit: json['limit'] ?? 10,
      totalPages: json['totalPages'] ?? 1,
      page: json['page'] ?? 1,
      hasPrevPage: json['hasPrevPage'] ?? false,
      hasNextPage: json['hasNextPage'] ?? false,
    });
  }
}