import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import { userModel } from './user.model';

class UserController implements Controller {
    public path = '/users';
    public router = Router();

    constructor() {
        this.router.get('/', authMiddleware(true), this.getAllUsers);
        // this.router.patch('/:id', authMiddleware(), this.patchUser);
    }

    private getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        res.json(await userModel.find());
    }

    private patchUser = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;

    }
}

export default UserController;