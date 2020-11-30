import 'dotenv/config';
import App from './app';
import AuthController from './auth/auth.controller';
import UserController from './user/user.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([
    new AuthController(),
    new UserController(),
]);

app.listen();