import {model, Schema} from 'mongoose';

const projectschema = Schema({
    id: String,
    name: String,
    path: String,
});

const userschema = Schema({
    id: String,
    name: String,
    email: String,
    pass: String,
    gender: String,
    age: String,
    about: String,
});

export const userSchema = model('userschema', userschema);
export const projectSchema = model('projectschema', projectschema);
