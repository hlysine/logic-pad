import axiosStatic from 'axios';

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
};
