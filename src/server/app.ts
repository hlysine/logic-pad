import { Elysia } from 'elysia';

const createApp = <App extends Elysia<'/api'>>(app: App) => {
  app.get('/ping', () => null);
};

export default createApp;
