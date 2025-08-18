/* Sync with backend */

import { PuzzleType } from '@logic-pad/core/data/primitives';

export enum ResourceStatus {
  Private = 'private',
  Public = 'public',
}

export enum FeedbackType {
  General = 'general',
  Issue = 'issue',
  Report = 'report',
}

export interface ResourceResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export enum AutoCollection {
  CreatedPuzzles = 'createdPuzzles',
  LovedPuzzles = 'lovedPuzzles',
  SolvedPuzzles = 'solvedPuzzles',
}

export interface UserBrief extends ResourceResponse {
  solveCount: number;
  createCount: number;
  description: string;
  name: string;
  title: string | null;
}

export interface PuzzleBrief extends ResourceResponse {
  title: string;
  description: string;
  designDifficulty: number;
  ratedDifficulty: number[];
  solveCount: number;
  loveCount: number;
  types: PuzzleType[];
  width: number;
  height: number;
  status: ResourceStatus;
  publishedAt?: string | null;
  creator: UserBrief;
}

export interface CollectionBrief extends ResourceResponse {
  title: string;
  description: string;
  puzzleCount: number | null;
  followCount: number;
  status: ResourceStatus;
  creator: UserBrief;
  autoPopulate: string | null;
  modifiedAt: string;
}

export interface Feedback extends ResourceResponse {
  title: string;
  description: string;
  data: string | null;
  type: FeedbackType;
  creator: UserBrief;
  puzzle: PuzzleBrief;
}

export interface Completion extends ResourceResponse {
  ratedDifficulty: number | null;
  solvedAt: string | null;
  msTimeUsed: number;
  puzzle: string;
  user: string;
}

export interface Identity extends ResourceResponse {
  provider: string;
  email: string;
}

export interface PuzzleLove {
  loved: boolean;
}

export interface CollectionFollow {
  followed: boolean;
}

export interface UserDetail {
  accessedAt: string;
  createdPuzzlesCollection: string | null;
  createdPuzzles: PuzzleBrief[];
  createdCollections: CollectionBrief[];
}

export interface PuzzleFull extends PuzzleBrief {
  data: string;
}

export interface ListResponse<T extends ResourceResponse> {
  total: number;
  results: T[];
}
