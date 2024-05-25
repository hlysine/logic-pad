const api = {
  ping: () => {
    return fetch('/api/ping', {
      method: 'GET',
    });
  },
};
export default api;
