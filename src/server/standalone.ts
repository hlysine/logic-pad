import Elysia from 'elysia';
import createApp from './app';
import env from './env';

const app = new Elysia({ prefix: '/api' });
app.on('start', () => console.log(`Server started on port ${env.PORT}`));
app.onResponse(ctx =>
  console.log(`${ctx.request.method} ${ctx.request.url} - ${ctx.set.status}`)
);

createApp(app);

app.listen(env.PORT);
