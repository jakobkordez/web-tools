import { RequestHandler, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import ForbiddenException from '../exceptions/ForbiddenException';
import InvalidTokenException from '../exceptions/InvalidTokenException';
import UnauthorizedException from '../exceptions/UnauthorizedException';
import TokenData from '../interfaces/tokenData';
import UserRequest from '../interfaces/userRequest.interface';
import { userModel } from '../user/user.model';

function authMiddleware(requireAdmin = false): RequestHandler {
    return async (req: UserRequest, res: Response, next: NextFunction) => {
        const auth = req.headers.authorization;

        if (!auth || !/^Bearer \S+$/i.test(auth)) return next(new UnauthorizedException());

        const token = auth.substr(7);
        const secret = process.env.JWT_SECRET as string;

        let data: TokenData;
        try {
            data = verify(token, secret) as TokenData;
        }
        catch {
            return next(new InvalidTokenException());
        }

        const user = await userModel.findById(data.user_id);
        if (!user) return next(new InvalidTokenException());

        if (requireAdmin && !user.admin) return next(new ForbiddenException());

        req.user = user;
        return next();
    };
}

export default authMiddleware;