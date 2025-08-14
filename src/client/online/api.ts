import axiosStatic, { AxiosError } from 'axios';
import {
  Completion,
  PuzzleBrief,
  PuzzleFull,
  PuzzleLove,
  SearchResult,
  UserBrief,
} from './data';
import { QueryClient } from '@tanstack/react-query';
import onlineSolveTracker from '../router/onlineSolveTracker';
import { SearchParams } from '../routes/_layout.search';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10 * 1000,
    },
  },
});

export const axios = axiosStatic.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT as string,
  withCredentials: true,
});

export interface ApiError {
  summary: string;
}

const rethrowError = (error: AxiosError<ApiError>) => {
  if (error.response) {
    throw new Error(error.response.data.summary);
  } else {
    throw error;
  }
};

export const api = {
  isOnline: async () => {
    return await axios
      .get('/')
      .then(() => true)
      .catch(() => false);
  },
  signInWithOAuth: (provider: string, success: string, error: string) => {
    onlineSolveTracker.clearSolveRecords();
    const url = new URL(
      (import.meta.env.VITE_API_ENDPOINT as string) + '/auth/oauth/' + provider
    );
    url.searchParams.set('success', success);
    url.searchParams.set('error', error);
    window.location.href = url.toString();
  },
  callbackOAuth: async (userId: string, secret: string) => {
    await axios({
      method: 'POST',
      url: '/auth/oauth/callback',
      params: {
        userId,
        secret,
      },
    });
  },
  getMe: async () => {
    return await axios
      .get<UserBrief>('/user/me')
      .then(res => res.data)
      .catch(() => null);
  },
  logout: async () => {
    await queryClient.invalidateQueries();
    onlineSolveTracker.clearSolveRecords();
    await axios.delete('/auth/logout').catch(rethrowError);
    window.location.reload();
  },
  getUser: async (userId: string) => {
    return await axios
      .get<UserBrief>(`/user/${userId}`)
      .then(res => res.data)
      .catch(() => null);
  },
  getAvatar: async (userId: string) => {
    return await axios
      .get<Blob>(`/user/${userId}/avatar`, {
        responseType: 'blob',
      })
      .then(res => URL.createObjectURL(res.data))
      .catch(() => null);
  },
  getPuzzleFullForEdit: async (puzzleId: string) => {
    return await axios
      .get<PuzzleFull>(`/puzzle/${puzzleId}/edit`)
      .then(res => res.data)
      .catch(rethrowError);
  },
  getPuzzleFullForSolve: async (puzzleId: string) => {
    return await axios
      .get<PuzzleFull>(`/puzzle/${puzzleId}/solve`)
      .then(res => res.data)
      .catch(rethrowError);
  },
  getPuzzleBriefForSolve: async (puzzleId: string) => {
    return await axios
      .get<PuzzleBrief>(`/puzzle/${puzzleId}/solve/brief`)
      .then(res => res.data)
      .catch(rethrowError);
  },
  createPuzzle: async (
    title: string,
    description: string,
    designDifficulty: number,
    data: string
  ) => {
    return await axios
      .post<{ id: string }>('/puzzle/create', {
        title,
        description,
        designDifficulty,
        data,
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  savePuzzle: async (
    puzzleId: string,
    title: string,
    description: string,
    designDifficulty: number,
    data: string
  ) => {
    return await axios
      .put<{ id: string }>('/puzzle/' + puzzleId, {
        title,
        description,
        designDifficulty,
        data,
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  deletePuzzle: async (puzzleId: string) => {
    await axios.delete(`/puzzle/${puzzleId}`).catch(rethrowError);
  },
  publishPuzzle: async (puzzleId: string) => {
    return await axios
      .post<{ id: string }>(`/puzzle/${puzzleId}/publish`)
      .then(res => res.data)
      .catch(rethrowError);
  },
  getPuzzleLove: async (puzzleId: string) => {
    return await axios
      .get<PuzzleLove>(`/puzzle/${puzzleId}/love`)
      .then(res => res.data)
      .catch(rethrowError);
  },
  setPuzzleLove: async (puzzleId: string, loved: boolean) => {
    return await axios
      .put<PuzzleLove>(`/puzzle/${puzzleId}/love`, { loved })
      .then(res => res.data)
      .catch(rethrowError);
  },
  completionBegin: async (puzzleId: string) => {
    return await axios
      .post<Completion>(`/completion/${puzzleId}/begin`)
      .then(res => res.data)
      .catch(rethrowError);
  },
  completionSolvingBeacon: (puzzleId: string, msTimeElapsed: number) => {
    const headers = {
      type: 'application/json',
    };
    const blob = new Blob([JSON.stringify({ msTimeElapsed })], headers);
    return navigator.sendBeacon(
      (import.meta.env.VITE_API_ENDPOINT as string) +
        `/completion/${puzzleId}/solving`,
      blob
    );
  },
  completionSolving: async (puzzleId: string, msTimeElapsed: number) => {
    return await axios
      .post<Completion>(`/completion/${puzzleId}/solving`, { msTimeElapsed })
      .then(res => res.data)
      .catch(rethrowError);
  },
  completionComplete: async (puzzleId: string) => {
    return await axios
      .post<Completion>(`/completion/${puzzleId}/complete`)
      .then(res => res.data)
      .catch(rethrowError);
  },
  ratePuzzle: async (puzzleId: string, rating: number) => {
    return await axios
      .put<{ id: string }>(`/completion/${puzzleId}/rate`, { rating })
      .then(res => res.data)
      .catch(rethrowError);
  },
  searchPuzzles: async (query: SearchParams, cursor?: string) => {
    return await axios
      .get<SearchResult<PuzzleBrief>>(`/puzzle/search`, {
        params: { ...query, cursor },
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  listMyPuzzles: async (cursor?: string) => {
    return await axios
      .get<SearchResult<PuzzleBrief>>(`/user/me/puzzles`, {
        params: { cursor },
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
};
