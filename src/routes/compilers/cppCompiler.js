import {spawn} from 'child_process';
import path from 'path';
import fs from 'fs';

export const compileCpp = (router) => {
    router.get('/compile-cpp', async (req, res) => {
        const code = req.query.code;
        const input = req.query.input.split('\n');
        const timeStamp = req.body.timeStamp;
        const p = path.join(__dirname, '../../../files/' + timeStamp + '.cpp');
        const filePath = path.join(__dirname, '../../../files/' + timeStamp + '.out');

        fs.writeFile(p, code, (err) => {
            if (err) throw err;
        });

        const compile = spawn('g++', ['-o', filePath, p]);
        let out = '';
        compile.stderr.on('data', async (data) => {
            out += data;
        });
        compile.on('close', (data) => {
            if (data === 0) {
                const run = spawn(filePath, []);

                [...input].forEach((e) => run.stdin.write(e + ' '));
                run.stdin.end();
                run.stdout.on('data', (output) => {
                    fs.unlink(p, (err) => {
                        if (err) throw err;
                    });
                    fs.unlink(filePath, (err) => {
                        if (err) throw err;
                    });

                    res.send(String(output));
                });
            } else {
                res.send(out);
            }
        });
    });
};
