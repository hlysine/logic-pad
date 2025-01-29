import { z } from 'zod';
import GridData from './grid.js';

export type PuzzleMetadata = {
  /**
   * The title of the puzzle. (required)
   */
  title: string;
  /**
   * The author of the puzzle. (required)
   */
  author: string;
  /**
   * A description of the puzzle. (can be empty)
   */
  description: string;
  /**
   * A link to a place to discuss this puzzle. (can be empty)
   */
  link: string;
  /**
   * The difficulty of the puzzle, from 1 to 10. (required)
   *
   * 6-10 represent star difficulties.
   */
  difficulty: number;
};

export const MetadataSchema = z
  .object({
    title: z.string().min(1),
    author: z.string().min(1),
    description: z.string(),
    link: z.string(),
    difficulty: z.number().int().min(0).max(10),
  })
  .strict();

export const PuzzleSchema = z
  .object({
    title: z.string().min(1),
    author: z.string().min(1),
    description: z.string(),
    link: z.string(),
    difficulty: z.number().int().min(0).max(10),
    grid: z.instanceof(GridData),
    solution: z.instanceof(GridData).nullable(),
  })
  .strict();

export type Puzzle = PuzzleMetadata & {
  /**
   * The grid of the puzzle. (required)
   *
   * You must fix all given cells in the grid. The rest of the cells will be cleared.
   */
  grid: GridData;
  /**
   * The solution to the puzzle. (optional)
   *
   * You should provide a solution if a rule requires it. Otherwise, the rule can never be satisfied.
   *
   * If there are no rules that require a solution, this field will be ignored.
   */
  solution: GridData | null;
};
