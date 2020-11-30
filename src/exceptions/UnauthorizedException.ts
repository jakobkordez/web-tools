import HttpException from './HttpException';

class UnauthorizedException extends HttpException {
    constructor() {
        super(401, 'Login required');
    }
}

export default UnauthorizedException;