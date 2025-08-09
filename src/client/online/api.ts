import axiosStatic, { AxiosError } from 'axios';
import { PuzzleFull, UserBrief } from './data';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const axios = axiosStatic.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT as string,
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
    const url = new URL(window.location.origin);
    url.pathname = '/api/auth/oauth/' + provider;
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
};
