import { Elysia } from 'elysia';
import env from './env';

const app = new Elysia({ prefix: '/api' });
app.get('/ping', () => null);

app.on('start', () => console.log(`Server started on port ${env.PORT}`));
app.listen(env.PORT);

export default app;
