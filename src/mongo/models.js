import {model, Schema} from 'mongoose';

const userschema = Schema({
    id: String,
    name: String,
    email: String,
    age: Number,
    institue: String,
    password: String,
});

export const userSchema = model('userschema', userschema);
