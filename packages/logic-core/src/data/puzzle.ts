import { z } from 'zod';
import GridData from './grid.js';
import { PuzzleType } from './primitives.js';

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
   * The difficulty of the puzzle, from 0 to 10. (required)
   *
   * 0 represents an unrated puzzle, 6-10 represent star difficulties.
   */
  difficulty: number;
};

export const MetadataSchema = z
  .object({
    title: z.string().min(1),
    author: z.string().min(1),
    description: z.string(),
    difficulty: z.number().int().min(0).max(10),
  })
  .strict();

export const PuzzleSchema = z
  .object({
    title: z.string().min(1),
    author: z.string().min(1),
    description: z.string(),
    difficulty: z.number().int().min(0).max(10),
    grid: z.instanceof(GridData),
    solution: z.instanceof(GridData).nullable(),
  })
  .strict();

export type PuzzleData = {
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

export type Puzzle = PuzzleMetadata & PuzzleData;

/**
 * Get the types of a puzzle based on its grid properties. The returned types are ordered by their priority.
 * The first type is the most important one.
 */
export function getPuzzleTypes(puzzle: Puzzle): PuzzleType[] {
  const types: PuzzleType[] = [];
  let logic = true;
  if (puzzle.grid.musicGrid.value) {
    types.push(PuzzleType.Music);
    logic = false;
  }
  if (puzzle.grid.completePattern.value) {
    types.push(PuzzleType.Pattern);
    logic = false;
  }
  if (puzzle.grid.underclued.value) {
    types.push(PuzzleType.Underclued);
  }
  if (logic) {
    types.push(PuzzleType.Logic);
  }
  return types;
}
