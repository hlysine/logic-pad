import app from './app';

const vercel = {
  fetch(request: Request) {
    return app.handle(request);
  },
};

export default vercel;
