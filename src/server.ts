import App from '@/app';
import routes from '@/routes';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App(routes);

app.listen();
