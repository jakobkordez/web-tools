import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { getPassword, UserDoc, userModel } from '../user/user.model';
import AuthService from './auth.service';
import UserDto from '../user/user.dto';

class AuthController implements Controller {
    public path = '/auth';
    public router = Router();

    private authService = new AuthService();

    constructor() {
        this.router.post('/login', validationMiddleware(UserDto), this.loginUser);

        this.router.post('/register', authMiddleware(true), validationMiddleware(UserDto), this.registerUser);
    }

    private registerUser = async (req: Request, res: Response, next: NextFunction) => {
        const userData: UserDto = req.body;

        try {
            const user: UserDoc = await this.authService.register(userData);
            return res.status(201).json(user);
        }
        catch (e) {
            return next(e);
        }
    }

    private loginUser = async (req: Request, res: Response, next: NextFunction) => {
        const userData: UserDto = req.body;

        const user = await userModel.findOne({ username: userData.username });

        if (user) {
            if (await bcrypt.compare(userData.password, getPassword(user))) {
                const token = this.authService.createToken({ user_id: user._id });

                return res.json({ user, token });
            }
        }

        return res.status(400).json('Invalid login');
    }
}

export default AuthController;