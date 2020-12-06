import { NextFunction, Request, Response, Router } from 'express';
import NotFoundException from '../exceptions/NotFoundException';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import User from './user.interface';
import { userModel } from './user.model';

class UserController implements Controller {
    public path = '/users';
    public router = Router();

    constructor() {
        this.router.get('/', authMiddleware(true), this.getAllUsers);
        this.router.get('/me', authMiddleware(), this.getMe);
        this.router.get('/:id', authMiddleware(), this.getById);
        // this.router.patch('/:id', authMiddleware(), this.patchUser);
    }

    private getById = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        
        const user = await userModel.findById(id);
        if (!user) return next(new NotFoundException('User not found'));

        return res.json(user);
    }

    private getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        res.json(await userModel.find());
    }

    private getMe = async (req: any, res: Response, next: NextFunction) => {
        res.json(req.user);
    }

    private patchUser = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;

    }
}

export default UserController;