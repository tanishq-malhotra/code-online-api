import {exec} from 'child_process';
import fs from 'fs';

export class DockerSandbox {
    constructor({
        timeout_value,
        path,
        folder,
        vm_name,
        compiler_name,
        file_name,
        code,
        output_command,
        languageName,
        e_arguments,
        stdin_data,
    }) {
        this.timeout_value = timeout_value;
        this.path = path;
        this.folder = folder;
        this.vm_name = vm_name;
        this.compiler_name = compiler_name;
        this.file_name = file_name;
        this.code = code;
        this.output_command = output_command;
        this.langName = languageName;
        this.extra_arguments = e_arguments;
        this.stdin_data = stdin_data;
    }

    prepare(callback) {
        const dirPath = this.path + this.folder;
        const filePath = `${dirPath}/${this.file_name}`;
        const inputFile = `${dirPath}/inputFile`;
        const payload = __dirname + '/payload';

        exec(`mkdir '${dirPath}' && cp -r '${payload}'/* '${dirPath}'`,
            (_err, _stdout, _stderr) => {
                fs.writeFile(filePath, this.code, (err) => {
                    if (err) {
                        throw err;
                    } else {
                        fs.writeFile(inputFile, this.stdin_data, (err) => {
                            if (err) {
                                throw err;
                            } else {
                                callback();
                            };
                        });
                    }
                });
            });
    }

    execute(callback) {
        const dirPath = this.path + this.folder;
        const run = __dirname + '/docker-run.sh';

        const cmd = `sh '${run}' ${this.timeout_value} -i -t -v '${dirPath}':/usercode ${this.vm_name} /usercode/script.sh ${this.compiler_name} ${this.file_name} ${this.output_command} ${this.extra_arguments}`;

        exec(cmd);

        let counter = 0;
        const intid = setInterval(() => {
            counter++;

            fs.readFile(`${dirPath}/completed`, 'utf8', (err_main, data_main) => {
                if (err_main && counter < this.timeout_value) {
                    console.log(err_main);
                    return;
                } else if (counter < this.timeout_value) {
                    fs.readFile(`${dirPath}/errors`, 'utf8', (err_fail, data_fail) => {
                        const results = data_main.toString().split('*-CODE-COMPILE-*');

                        const result = results[0];
                        const time = results[1];
                        const errors = data_fail || '';

                        callback(result, time, errors);
                    });
                } else {
                    fs.readFile(`${dirPath}/logfile.txt`, 'utf8', (err_main, data_main) => {
                        data_main = data_main || '';

                        data_main += '\nExecution Timed Out';
                        fs.readFile(`${dirPath}/errors`, 'utf8', (err_fail, data_fail) => {
                            const results = data_main.toString().split('*---*');

                            const result = results[0];
                            const time = results[1];
                            const errors = data_fail || '';

                            callback(result, time, errors);
                        });
                    });
                }
                exec(`rm -r '${dirPath}'`);
                clearInterval(intid);
            });
        }, 1000);
    }

    run(callback) {
        this.prepare(() => {
            this.execute(callback);
        });
    }
}
