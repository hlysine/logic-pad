import { z } from 'zod';
import GridData from './grid';

export interface PuzzleMetadata {
  title: string;
  description: string;
  difficulty: number;
  id: string;
}

export const PuzzleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string(),
  link: z.string(),
  difficulty: z.number().int().min(1).max(10),
  grid: z.instanceof(GridData),
  solution: z.instanceof(GridData).nullable(),
});

export default interface Puzzle extends PuzzleMetadata {
  grid: GridData;
  solution: GridData | null;
}
