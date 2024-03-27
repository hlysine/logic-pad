import GridData from './grid';

export interface PuzzleMetadata {
  title: string;
  author: string;
  description: string;
  link: string;
  difficulty: number;
}

export interface SerializedPuzzle extends PuzzleMetadata {
  grid: string;
}

export default interface Puzzle extends PuzzleMetadata {
  grid: GridData;
  solution: GridData | null;
}
