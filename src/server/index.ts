import app from './app';
import env from './env';

app.on('start', () => console.log(`Server started on port ${env.PORT}`));
app.listen(env.PORT);
