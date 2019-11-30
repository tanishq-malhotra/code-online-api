import {DockerSandbox, compilers} from '../code-compiler';
import {randomBytes} from 'crypto';
import path from 'path';

export const apiRoutes = async (router) => {
    // default welcome route
    router.get('/', async (req, res) => {
        res.send('Compiler-API');
    });

    router.post('/compile', async (req, res) => {
        const language = req.body.params.language;
        const code = req.body.params.code;
        const input = req.body.params.input;


        const query = {
            timeout_value: 20,
            path: path.resolve(__dirname, '..') + '/',
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
            res.json({output: data,
                errors: err,
                time: exec_time});
        });
    });
};
