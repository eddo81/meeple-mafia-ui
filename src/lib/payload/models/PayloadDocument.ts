import { z } from 'zod';
import type { Json } from "../types/Json";

export class PayloadDocument {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly json: Json;
  
  private static readonly _schema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }).passthrough();

  constructor(json: Json) {
    const result = PayloadDocument._schema.safeParse(json);
    
    if (!result.success) {
      throw new Error(`Invalid PayloadDocument: ${result.error.message}`);
    }
    
    this.id = result.data.id;
    this.createdAt = result.data.createdAt;
    this.updatedAt = result.data.updatedAt;
    this.json = result.data;
  }
}