import { NextFunction, Request, Response, Router } from 'express';
import ForbiddenException from '../exceptions/ForbiddenException';
import HttpException from '../exceptions/HttpException';
import NotFoundException from '../exceptions/NotFoundException';
import ServerException from '../exceptions/ServerException';
import Controller from '../interfaces/controller.interface';
import UserRequest from '../interfaces/userRequest.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { base64ToHex } from '../utils/base.converters';
import UrlDto from './url.dto';
import { urlModel } from './url.model';

class UrlController implements Controller {
    public path = '/url';
    public router = Router();

    constructor() {
        this.router.get('/', authMiddleware(true), this.getAll);
        this.router.get('/my', authMiddleware(), this.getMy);
        this.router.delete('/:id', authMiddleware(), this.delete);
        this.router.post('/', authMiddleware(), validationMiddleware(UrlDto), this.create);
        
        this.router.get('/:key', this.query);
    }

    private query = async (req: Request, res: Response, next: NextFunction) => {
        const key = req.params.key;
        if (/[\w/+]{16}/.test(key)) {
            const id = base64ToHex(key);
    
            const url = await urlModel.findById(id);
            if (url) return res.json(url);
        }

        const url = await urlModel.findOne({ shortUrl: key });
        if (!url) return next(new NotFoundException('URL not found'));

        return res.json(url);
    }

    private getMy = async (req: UserRequest, res: Response, next: NextFunction) => {
        if (!req.user) return next(new ServerException());

        return res.json(await urlModel.find({ owner: req.user._id }))
    }

    private getAll = async (req: Request, res: Response, next: NextFunction) => {
        return res.json(await urlModel.find().populate('owner'));
    }

    private delete = async (req: UserRequest, res: Response, next: NextFunction) => {
        if (!req.user) return next(new ServerException());
        const id = req.params.id;

        const url = await urlModel.findById(id);
        if (!url) return next(new NotFoundException('URL not found'));

        if (!req.user.admin && url.owner != req.user._id) {
            return next(new ForbiddenException())
        }

        return res.json('URL deleted');
    }

    private create = async (req: UserRequest, res: Response, next: NextFunction) => {
        const urlData: UrlDto = req.body;
        if (!req.user) return next(new ServerException());

        if (urlData.shortUrl) {
            const existurl = await urlModel.findOne({ shortUrl: urlData.shortUrl });
            if (existurl) return next(new HttpException(400, 'URL already exists'));
        }
        else {
            const existurl = await urlModel.findOne({ fullUrl: urlData.fullUrl });
            if (existurl) return res.json(existurl);
        }

        const url = new urlModel({ ...urlData, owner: req.user._id });
        try {
            await url.save();
            return res.status(201).json(url);
        }
        catch {
            return next(new ServerException());
        }
    }
}

export default UrlController;