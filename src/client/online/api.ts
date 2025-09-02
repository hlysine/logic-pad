import axiosStatic, { AxiosError } from 'axios';
import {
  Completion,
  PuzzleBrief,
  PuzzleFull,
  PuzzleLove,
  ListResponse,
  UserBrief,
  Identity,
  CollectionBrief,
  CollectionFollow,
  ResourceStatus,
  ResourceResponse,
  UserDetail,
  FrontPage,
  Comment,
} from './data';
import {
  DataTag,
  DefaultError,
  InfiniteData,
  infiniteQueryOptions,
  QueryClient,
  QueryKey,
  UseSuspenseInfiniteQueryOptions,
} from '@tanstack/react-query';
import onlineSolveTracker from '../router/onlineSolveTracker';
import toast from 'react-hot-toast';
import { PuzzleSearchParams } from './PuzzleSearchQuery';
import { CollectionSearchParams } from './CollectionSearchQuery';

export interface ApiErrorResponse {
  summary: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10 * 1000,
      retry(failureCount, error) {
        if (error instanceof ApiError) {
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      onError(error) {
        toast.error(error.message);
      },
    },
  },
});

export const axios = axiosStatic.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT as string,
  withCredentials: true,
});

const rethrowError = (error: AxiosError<ApiErrorResponse>) => {
  if (error.response) {
    throw new ApiError(error.response.data.summary, error.response.status);
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
  listIdentities: async () => {
    return await axios
      .get<ListResponse<Identity>>('/auth/identity/list')
      .then(res => res.data)
      .catch(() => null);
  },
  deleteIdentity: async (identityId: string) => {
    await axios.delete(`/auth/identity/${identityId}`).catch(rethrowError);
  },
  getMe: async () => {
    return await axios
      .get<UserBrief>('/user/me')
      .then(res => res.data)
      .catch(() => null);
  },
  updateMe: async (data: Partial<Pick<UserBrief, 'name' | 'description'>>) => {
    return await axios.put<UserBrief>('/user/me', data).catch(() => null);
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
  getUserDetail: async (userId: string) => {
    return await axios
      .get<UserDetail>(`/user/${userId}/detail`)
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
  deletePuzzles: async (puzzleIds: string[]) => {
    return await axios
      .post<{ deleted: string[] }>(`/puzzle/delete`, { puzzleIds })
      .then(res => res.data)
      .catch(rethrowError);
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
  searchPuzzles: async (
    query: PuzzleSearchParams,
    cursorBefore?: string,
    cursorAfter?: string
  ) => {
    return await axios
      .get<ListResponse<PuzzleBrief>>(`/puzzle/search`, {
        params: { ...query, cursorBefore, cursorAfter },
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  listMyPuzzles: async (
    query: PuzzleSearchParams,
    cursorBefore?: string,
    cursorAfter?: string
  ) => {
    return await axios
      .get<ListResponse<PuzzleBrief>>(`/user/me/puzzles`, {
        params: { ...query, cursorBefore, cursorAfter },
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  getCollectionBrief: async (collectionId: string) => {
    return await axios
      .get<CollectionBrief>(`/collection/${collectionId}`)
      .then(res => res.data)
      .catch(rethrowError);
  },
  listCollectionPuzzles: async (
    collectionId: string,
    cursorBefore?: string,
    cursorAfter?: string
  ) => {
    return await axios
      .get<ListResponse<PuzzleBrief>>(`/collection/${collectionId}/puzzles`, {
        params: { cursorBefore, cursorAfter },
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  getCollectionFollow: async (collectionId: string) => {
    return await axios
      .get<CollectionFollow>(`/collection/${collectionId}/follow`)
      .then(res => res.data)
      .catch(rethrowError);
  },
  setCollectionFollow: async (collectionId: string, followed: boolean) => {
    return await axios
      .put<CollectionFollow>(`/collection/${collectionId}/follow`, {
        followed,
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  createCollection: async (title: string, description?: string) => {
    return await axios
      .post<{ id: string }>(`/collection/create`, {
        title,
        description,
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  updateCollection: async (
    collectionId: string,
    title?: string,
    description?: string,
    status?: ResourceStatus
  ) => {
    await axios
      .put<CollectionBrief>(`/collection/${collectionId}`, {
        title,
        description,
        status,
      })
      .catch(rethrowError);
  },
  deleteCollection: async (collectionId: string) => {
    await axios.delete(`/collection/${collectionId}`).catch(rethrowError);
  },
  reorderCollection: async (
    collectionId: string,
    moving: string,
    replacing: string
  ) => {
    await axios
      .put(`/collection/${collectionId}/reorder`, {
        moving,
        replacing,
      })
      .catch(rethrowError);
  },
  addToCollection: async (collectionId: string, puzzleIds: string[]) => {
    await axios
      .post(`/collection/${collectionId}/add`, { puzzleIds })
      .catch(rethrowError);
  },
  removeFromCollection: async (collectionId: string, puzzleIds: string[]) => {
    await axios
      .post(`/collection/${collectionId}/remove`, { puzzleIds })
      .catch(rethrowError);
  },
  searchCollections: async (
    query: CollectionSearchParams,
    cursorBefore?: string,
    cursorAfter?: string
  ) => {
    return await axios
      .get<ListResponse<CollectionBrief>>(`/collection/search`, {
        params: { ...query, cursorBefore, cursorAfter },
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  listMyCollections: async (
    query: CollectionSearchParams,
    cursorBefore?: string,
    cursorAfter?: string
  ) => {
    return await axios
      .get<ListResponse<CollectionBrief>>(`/user/me/collections`, {
        params: { ...query, cursorBefore, cursorAfter },
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  getFrontPage: async () => {
    return await axios
      .get<FrontPage>(`/frontpage`)
      .then(res => res.data)
      .catch(rethrowError);
  },
  listMyFollowedCollections: async (
    query: CollectionSearchParams,
    cursorBefore?: string,
    cursorAfter?: string
  ) => {
    return await axios
      .get<ListResponse<CollectionBrief>>(`/user/me/followed-collections`, {
        params: { ...query, cursorBefore, cursorAfter },
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  listComments: async (
    puzzleId: string,
    cursorBefore?: string,
    cursorAfter?: string
  ) => {
    return await axios
      .get<ListResponse<Comment>>(`/comments/${puzzleId}`, {
        params: { cursorBefore, cursorAfter },
      })
      .then(res => res.data)
      .catch(rethrowError);
  },
  createComment: async (puzzleId: string, content: string) => {
    return await axios
      .post<{ id: string }>(`/comments/${puzzleId}`, { content })
      .then(res => res.data)
      .catch(rethrowError);
  },
  updateComment: async (commentId: string, content: string) => {
    await axios
      .put<Comment>(`/comments/${commentId}`, { content })
      .catch(rethrowError);
  },
  deleteComment: async (commentId: string) => {
    await axios.delete(`/comments/${commentId}`).catch(rethrowError);
  },
};

export const bidirectionalInfiniteQuery = <
  TQueryFnData extends ListResponse<ResourceResponse>,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: (
    cursorBefore?: string,
    cursorAfter?: string
  ) => Promise<TQueryFnData>,
  predictEndOfQuery = true
): UseSuspenseInfiniteQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey,
  { cursorBefore?: string; cursorAfter?: string } | undefined
> & {
  queryKey: DataTag<TQueryKey, InfiniteData<TQueryFnData>, TError>;
} =>
  infiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    { cursorBefore?: string; cursorAfter?: string } | undefined
  >({
    queryKey,
    queryFn: ({ pageParam = {} }) => {
      return queryFn(pageParam.cursorBefore, pageParam.cursorAfter);
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage, _allPages, lastPageParams) => {
      return lastPage.results.length === 30 ||
        (!predictEndOfQuery &&
          !lastPageParams?.cursorAfter &&
          !lastPageParams?.cursorBefore)
        ? {
            cursorAfter: lastPage.results[lastPage.results.length - 1].id,
          }
        : lastPageParams?.cursorBefore
          ? { cursorAfter: lastPageParams.cursorBefore }
          : undefined;
    },
    getPreviousPageParam: (firstPage, _allPages, firstPageParams) => {
      return firstPage.results.length === 30 ||
        (!predictEndOfQuery &&
          !firstPageParams?.cursorAfter &&
          !firstPageParams?.cursorBefore)
        ? {
            cursorBefore: firstPage.results[0].id,
          }
        : firstPageParams?.cursorAfter
          ? { cursorBefore: firstPageParams.cursorAfter }
          : undefined;
    },
    throwOnError(error) {
      toast.error((error as Error).message);
      return false;
    },
    retry: false,
    staleTime: 1000 * 60,
  });
