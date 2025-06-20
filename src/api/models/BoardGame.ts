import { z } from 'zod';
import type { Json } from '../../lib/payload/types/Json';

const schema = z.object({
  'id': z.string(),
  'title': z.string(),
  'description': z.string().optional(),
  'rating': z.number().min(0).max(5).optional(),
  'min-player-count': z.number(),
  'max-player-count': z.number(),
  'play-time': z.number().optional(),
  'release-year': z.number().optional(),
  'complexity': z.number().min(0).max(5).optional(),
  'mechanics': z.array(z.string()).optional(),
  'publisher': z
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
  readonly description?: string;
  readonly rating?: number;
  readonly minPlayerCount: number;
  readonly maxPlayerCount: number;
  readonly playTime?: number;
  readonly releaseYear?: number;
  readonly complexity?: number;
  readonly mechanics?: string[];
  readonly publisher?: {
    id: string;
    name: string;
  };

  private constructor(data: BoardGameInput) {
    this.id = data['id'];
    this.title = data['title'];
    this.description = data['description'];
    this.rating = data['rating'];
    this.minPlayerCount = data['min-player-count'];
    this.maxPlayerCount = data['max-player-count'];
    this.playTime = data['play-time'];
    this.releaseYear = data['release-year'];
    this.complexity = data['complexity'];
    this.mechanics = data['mechanics'];
    this.publisher = data['publisher'];
  }

  static fromJson(json: Json): BoardGame {
    const parsed = schema.parse(json);
    return new BoardGame(parsed);
  }
}