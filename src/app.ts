import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
    public app = express();

    constructor(controllers: Controller[]) {
        this.connectDB();

        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());

        this.initializeRoutes(controllers);

        this.app.use(errorMiddleware);
    }

    public listen() {
        const port = process.env.PORT;

        this.app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
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

    private initializeRoutes(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });

        this.app.all('**', (req, res) => {
            return res.status(404).json(`${req.method} ${req.path} does not exists`);
        });
    }
}

export default App;