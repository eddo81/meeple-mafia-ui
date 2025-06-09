import { z } from 'zod';
import type { Json } from "../types/Json";

export class PayloadDocument {
  readonly json: Json;
  
  private static readonly _schema = z.record(z.any());

  constructor(json: Json) {
    const result = PayloadDocument._schema.safeParse(json);
    
    if (!result.success) {
      throw new Error(`Invalid PayloadDocument: ${result.error.message}`);
    }

    this.json = result.data;
  }
}