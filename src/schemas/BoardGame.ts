import { z } from 'zod';

export const BoardGame = z.object({
  id: z.string(), // or `_id` or whatever your Payload setup uses
  title: z.string(),
  rating: z.number().min(0).max(5),
  minPlayerCount: z.number(),
  maxPlayerCount: z.number(),
  playTime: z.number(),
  releaseYear: z.number(),
  complexity: z.number().min(0).max(5),
  mechanics: z.array(z.string()),
  publisher: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(), // if populated
});