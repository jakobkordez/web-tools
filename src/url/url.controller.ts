import { NextFunction, Request, Response, Router } from 'express';
import HttpException from '../exceptions/HttpException';
import NotFoundException from '../exceptions/NotFoundException';
import ServerException from '../exceptions/ServerException';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { base64ToHex } from '../utils/base.converters';
import UrlDto from './url.dto';
import { urlModel } from './url.model';

class UrlController implements Controller {
    public path = '/url';
    public router = Router();

    constructor() {
        this.router.get('/:key([\\w/+]{16})', this.query);
        this.router.get('/:key', this.queryCustom);

        this.router.get('/', authMiddleware(true), this.getAll);
        this.router.delete('/:id', authMiddleware(true), this.delete);
        this.router.post('/', authMiddleware(), validationMiddleware(UrlDto), this.create);
    }

    private query = async (req: Request, res: Response, next: NextFunction) => {
        const id = base64ToHex(req.params.key);

        const url = await urlModel.findById(id);
        if (!url) return this.queryCustom(req, res, next);

        return res.json(url);
    }

    private queryCustom = async (req: Request, res: Response, next: NextFunction) => {
        const url = await urlModel.findOne({ shortUrl: req.params.key });
        if (!url) return next(new NotFoundException('URL not found'));

        return res.json(url);
    }

    private getAll = async (req: Request, res: Response, next: NextFunction) => {
        return res.json(await urlModel.find());
    }

    private delete = async (req: Request, res: Response, next: NextFunction) => {
        const url = await urlModel.findByIdAndDelete(req.params.id);
        if (!url) return next(new NotFoundException('URL not found'));

        return res.json('URL deleted');
    }

    private create = async (req: Request, res: Response, next: NextFunction) => {
        const urlData: UrlDto = req.body;

        if (urlData.shortUrl) {
            const existurl = await urlModel.findOne({ shortUrl: urlData.shortUrl });
            if (existurl) return next(new HttpException(400, 'URL already exists'));
        }
        else {
            const existurl = await urlModel.findOne({ fullUrl: urlData.fullUrl });
            if (existurl) return res.json(existurl);
        }

        const url = new urlModel(urlData);
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