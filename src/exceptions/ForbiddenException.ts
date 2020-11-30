import HttpException from './HttpException';

class ForbiddenException extends HttpException {
    constructor(message: string = 'You cannot do that') {
        super(403, message);
    }
}

export default ForbiddenException;