import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { createStream, Generator } from 'rotating-file-stream';
import HttpException from './exceptions/HttpException';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
    public app = express();

    constructor(controllers: Controller[]) {
        this.connectDB();

        this.initMiddileware();

        this.initRoutes(controllers);

        this.app.use(errorMiddleware);
    }

    public listen() {
        const port = process.env.PORT;

        this.app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    }

    private initMiddileware() {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());

        const logStream = createStream(this.fGenerator, {
            interval: '1d',
            path: 'logs',
        });

        this.app.use(morgan('common', { stream: logStream }));
        this.app.use(morgan('dev'));
    }

    private connectDB() {
        const uri = process.env.MONGO as string;

        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true,
        }, (err) => {
            if (err) {
                console.log('Error connecting to MongoDB');
                process.exit(1);
            }
        });
    }

    private initRoutes(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });

        this.app.all('**', (req, res, next) => {
            return next(new HttpException(404, `${req.method} ${req.path} does not exists`));
        });
    }

    private fGenerator: Generator = (time: number | Date): string => {
        if (!time) return 'access.log';
        time = time as Date;
        return `${time.getFullYear()}-${time.getMonth().toFixed(2)}-${time.getDate().toFixed(2)}-access.log`;
    }
}

export default App;