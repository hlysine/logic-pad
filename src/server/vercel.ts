import Elysia from 'elysia';
import createApp from './app';

const app = new Elysia({ prefix: '/api' });
createApp(app);

const vercel = {
  fetch(request: Request) {
    return app.handle(request);
  },
};

export default vercel;
