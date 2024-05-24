import { Elysia } from 'elysia';

const app = new Elysia({ prefix: '/api' });
app.get('/ping', () => null);

export default app;
