import bodyParser from 'body-parser';
import logger from 'morgan';

import app from './app';
import {ENV} from './config';
const {PORT} = ENV;
import {apiRoutes, compileCpp} from './routes';
import cors from 'cors';
import {codeCompiler} from './code-compiler';

app.express.use(cors());
app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({extended: true}));

app.express.use(logger('dev'));

app.io.on('connection', async (socket) => {
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
		console.log("client "+req.params.id+" handled");
            socket.emit(req.params.id, output);
        } catch (err) {}
    });
});

app.io.on('disconnect', (socket) => console.log(socket.id + ' disconnected'));

(async () => {
    app.mountRoutes(apiRoutes);
    app.start(PORT);
})();
