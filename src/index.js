import bodyParser from 'body-parser';
import logger from 'morgan';

import app from '@app/app';
import {ENV} from '@config/index';

import {apiRoutes} from '@routes/index';
import cors from 'cors';
import {codeCompiler} from './code-compiler';

const {PORT} = ENV;

app.express.use(cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({extended: true}));

app.express.use(logger('dev'));

app.io.on('connection', async (socket) => {
    console.log('client connected');
    socket.on('compile', async (req) => {
        const code = req.code;
        const options = {
            fileName: req.params.id,
            input: req.params.input,
            language: req.params.language,
            timeout: req.params.timeout,
        };
        try {
            const output = await codeCompiler(code, options);
            socket.emit(req.params.id, output);
        } catch (err) {}
    });
});

app.io.on('disconnect', (socket) => console.log(socket.id + ' disconnected'));

(async () => {
    app.mountRoutes(apiRoutes);
    app.start(PORT);
})();
