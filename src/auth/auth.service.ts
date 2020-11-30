import * as jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import ServerException from '../exceptions/ServerException';
import TokenData from '../interfaces/tokenData';
import { UserDoc, userModel } from '../user/user.model';
import UserDto from './user.dto';

class AuthService {
    public async register(userData: UserDto): Promise<UserDoc> {
        if (await userModel.findOne({ username: userData.username })) {
            throw new HttpException(400, 'Username taken');
        }

        const user = new userModel(userData);
        try {
            await user.save();
            return user;
        }
        catch {
            throw new ServerException();
        }
    }

    public createToken(tokenData: TokenData): String {
        return jwt.sign(tokenData, process.env.JWT_TOKEN as string);
    }
}

export default AuthService;