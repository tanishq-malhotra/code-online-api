import mongoose from 'mongoose';

export const connect = () => {
    mongoose.connect(
        'mongodb://localhost:27017/code-online',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    ).then(() => console.log('database connected')).catch((err) => {
        console.log(err);
    });
};
