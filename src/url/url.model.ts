import { Document, model, Schema } from 'mongoose';
import { hexToBase64 } from '../utils/base.converters';
import Url from './url.interface';

interface UrlDoc extends Document, Url { }

const urlSchema: Schema = new Schema({
    'fullUrl': {
        type: String,
        required: [true, 'URL required'],
    },
    'shortUrl': {
        type: String,
        unique: [true, 'ShortURL must be unique'],
        default: function (this: UrlDoc) {
            return hexToBase64(this.id);
        },
    }
}, {
    toJSON: {
        versionKey: false,
    }
});

const urlModel = model<UrlDoc>('Url', urlSchema);

export { urlModel, UrlDoc };