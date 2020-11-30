import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';
import HttpException from '../exceptions/HttpException';

function validationMiddleware(type: any, skipMissingProperties = false): RequestHandler {
    return async (req, res, next) => {
        const errors = await validate(plainToClass(type, req.body), { skipMissingProperties });

        if (errors.length === 0) return next();

        const message = errors.map(e => Object.values(e.constraints ?? {})).join(', ');
        return next(new HttpException(400, message));
    };
}

export default validationMiddleware;