import axiosStatic from 'axios';
import { UserBrief } from './data';

export const axios = axiosStatic.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT as string,
});

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
};
