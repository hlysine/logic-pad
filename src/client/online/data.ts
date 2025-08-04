/* Sync with backend */

export enum PuzzleType {
  Logic = 'logic',
  Underclued = 'underclued',
  Pattern = 'pattern',
  Music = 'music',
}

export enum ResourceStatus {
  Private = 'private',
  Public = 'public',
}

export enum FeedbackType {
  General = 'general',
  Issue = 'issue',
  Report = 'report',
}

export interface UserBrief {
  id: string;
  createdAt: string;
  updatedAt: string;
  accessedAt: string;
  name: string;
  avatar: string | null;
  solveCount: number;
  createCount: number;
  description: string;
}

export interface PuzzleBrief {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  designDifficulty: number;
  ratedDifficulty: number[];
  creator: UserBrief;
  solveCount: number;
  loveCount: number;
  width: number;
  height: number;
  status: ResourceStatus;
  types: PuzzleType[];
}

export interface CollectionBrief {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  minDifficulty: number;
  maxDifficulty: number;
  creator: UserBrief;
  puzzleCount: number;
  followCount: number;
  status: ResourceStatus;
  isSpecial: boolean;
  types: PuzzleType[];
}

export interface Feedback {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  data: string | null;
  creator: UserBrief;
  puzzle: PuzzleBrief;
  type: FeedbackType;
}

export interface Attempt {
  id: string;
  createdAt: string;
  updatedAt: string;
  puzzle: PuzzleBrief;
  user: UserBrief;
  ratedDifficulty: number | null;
  solvedAt: string | null;
  msTimeUsed: number | null;
}

export interface UserFull extends UserBrief {
  followedCollections: CollectionBrief[];
  createdPuzzles: CollectionBrief;
  lovedPuzzles: CollectionBrief;
}

export interface PuzzleFull extends PuzzleBrief {
  data: string;
}

export interface CollectionFull extends CollectionBrief {
  puzzles: PuzzleBrief[];
}
