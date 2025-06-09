import { z } from 'zod';
import type { Json } from '../../lib/payload/types/Json';

const schema = z.object({
  id: z.string(),
  title: z.string(),
  rating: z.number().min(0).max(5),
  minPlayerCount: z.number(),
  maxPlayerCount: z.number(),
  playTime: z.number(),
  releaseYear: z.number(),
  complexity: z.number().min(0).max(5),
  mechanics: z.array(z.string()),
  publisher: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});

type BoardGameInput = z.infer<typeof schema>;

export class BoardGame {
  readonly id: string;
  readonly title: string;
  readonly rating: number;
  readonly minPlayerCount: number;
  readonly maxPlayerCount: number;
  readonly playTime: number;
  readonly releaseYear: number;
  readonly complexity: number;
  readonly mechanics: string[];
  readonly publisher?: {
    id: string;
    name: string;
  };

  private constructor(data: BoardGameInput) {
    this.id = data.id;
    this.title = data.title;
    this.rating = data.rating;
    this.minPlayerCount = data.minPlayerCount;
    this.maxPlayerCount = data.maxPlayerCount;
    this.playTime = data.playTime;
    this.releaseYear = data.releaseYear;
    this.complexity = data.complexity;
    this.mechanics = data.mechanics;
    this.publisher = data.publisher;
  }

  static fromJson(json: Json): BoardGame {
    const parsed = schema.parse(json);
    return new BoardGame(parsed);
  }
}