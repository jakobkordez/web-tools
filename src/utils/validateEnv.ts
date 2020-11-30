import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        PORT: port({ default: 3000 }),
        MONGO: str({ example: 'mongodb://user:password@localhost/database', default: 'mongodb://localhost/web-tools' }),
        JWT_SECRET: str(),
    });
}

export default validateEnv;