import HttpException from './HttpException';

class NotFoundException extends HttpException {
    constructor(message: string = 'Not found') {
        super(404, message);
    }
}

export default NotFoundException;