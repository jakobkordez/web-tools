import * as bcrypt from 'bcrypt';
import { Document, model, Schema } from 'mongoose';
import User from './user.interface';

interface UserDoc extends Document, User { }

const userSchema: Schema = new Schema({
    'username': {
        type: String,
        required: [true, 'Username required'],
        unique: [true, 'Username exists'],
    },
    'password': {
        type: String,
        required: [true, 'Password required'],
        get: () => undefined,
    },
    'admin': {
        type: Boolean,
        default: false,
    }
}, {
    toJSON: {
        virtuals: false,
        getters: true,
        versionKey: false,
    }
});

userSchema.pre('save', function (next) {
    const user = this as UserDoc;

    if (!user.isModified('password')) return next();

    bcrypt.hash(getPassword(user), 10, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        return next();
    });
});

const getPassword = (user: UserDoc) => {
    return user.get('password', String, { getters: false });
}

const userModel = model<UserDoc>('User', userSchema);

export { userModel, UserDoc, getPassword };