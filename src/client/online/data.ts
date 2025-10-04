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

export enum NotificationType {
  CollectionActivity = 'collectionActivity',
  CommentActivity = 'commentActivity',
  Account = 'account',
  System = 'system',
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
  supporter: number;
}

export interface MeBrief extends UserBrief {
  supporterUntil: string | null;
  labels: string[];
}

export interface PuzzleBrief extends ResourceResponse {
  title: string;
  description: string;
  designDifficulty: number;
  ratedDifficulty: number[];
  inSeries: boolean | null;
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
  isSeries: boolean;
}

export interface Comment extends ResourceResponse {
  puzzleId: string;
  creator: UserBrief;
  content: string;
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

export interface Notification extends ResourceResponse {
  user: string;
  target: string | null;
  source: string | null;
  message: string;
  type: NotificationType;
  read: boolean;
}

export interface PuzzleLove {
  loved: boolean;
}

export interface CollectionFollow {
  followed: boolean;
}

export interface UserAutocomplete {
  id: string;
  name: string;
}

export interface UserDetail {
  accessedAt: string;
  followCount: number;
  solvedPuzzlesCollection: string | null;
  createdPuzzlesCollection: string | null;
  createdPuzzles: PuzzleBrief[];
  createdCollections: CollectionBrief[];
  solvedPuzzles: PuzzleBrief[] | null;
}

export interface PuzzleFull extends PuzzleBrief {
  data: string;
  series: CollectionBrief | null;
}

export interface FrontPage {
  newestPuzzles: PuzzleBrief[];
  newestCollections: CollectionBrief[];
}

export interface ListResponse<T extends ResourceResponse> {
  total: number;
  results: T[];
}

export interface SupporterPrice {
  priceId: string;
  months: number;
  price: number;
  currency: string;
}

export interface PaymentHistory extends ResourceResponse {
  user: string;
  order: string;
  currency: string;
  amount: number;
  items: string[];
}

export interface SitemapEntry {
  id: string;
  updatedAt: string;
}

export interface UserAccount {
  id: string;
  createdAt: string;
  updatedAt: string;
  registeredAt: string;
  accessedAt: string;
  labels: string[];
  status: boolean;
}

export interface UserRestrictions {
  comments: string | null;
  puzzles: string | null;
  collections: string | null;
  ratings: string | null;
}
