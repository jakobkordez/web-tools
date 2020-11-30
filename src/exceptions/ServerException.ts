import HttpException from './HttpException';

class ServerException extends HttpException {
    constructor() {
        super(500, 'Something went wrong');
    }
}

export default ServerException;