import bodyParser from 'body-parser';
import logger from 'morgan';

import app from '@app/app';
import {ENV} from '@config/index';

import {apiRoutes} from '@routes/index';
import cors from 'cors';
import {DockerSandbox, compilers} from './code-compiler';
import {randomBytes} from 'crypto';

const {PORT} = ENV;

app.express.use(
    cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
    }),
);

app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({extended: true}));

app.express.use(logger('dev'));

app.io.on('connection', async (socket) => {
    socket.on('compile', async (req) => {
        const language = req.params.language;
        const code = req.params.code;
        const input = req.params.input;
        const query = {
            timeout_value: 5,
            path: __dirname + '/',
            folder: 'temp/' + randomBytes(10).toString('hex'),
            vm_name: 'docker_machine',
            compiler_name: compilers[language].compiler_name,
            file_name: compilers[language].file_name,
            code: code,
            output_command: compilers[language].output_command,
            languageName: language,
            e_arguments: compilers[language].e_arguments,
            stdin_data: input,
        };
        const sandbox = new DockerSandbox(query);
        sandbox.run((data, exec_time, err) => {
            const output = {output: data, exec_time: exec_time, err: err};
            console.log('client '+req.params.id+' handled');
            socket.emit(req.params.id, output);
        });
    });
});

app.io.on('disconnect', (socket) => console.log(socket.id + ' disconnected'));

(async () => {
    app.mountRoutes(apiRoutes);
    app.start(PORT);
})();
