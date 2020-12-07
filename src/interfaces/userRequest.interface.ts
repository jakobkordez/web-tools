import { Request } from 'express';
import User from '../user/user.interface';

interface UserRequest extends Request {
    user?: User
}

export default UserRequest;