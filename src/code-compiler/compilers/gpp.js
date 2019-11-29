import fs from 'fs';
import {exec} from 'child_process';
import terminate from 'terminate';

const isWindows = process.platform == 'win32';
const outExtension = isWindows ? '.exe' : '.out';
const delCommand = isWindows ? 'del' : 'rm';
const executionPath = isWindows ? '' : './';

const timeouts = {
    start: 0,
    end: 0,
    time_taken: 0,
    close: 0,
    terminate: 0,
};
export const gpp = (fileName, filePath, options, extension) => {
    return new Promise((resolve) => {
        exec(
            'g++ ' +
        filePath +
        fileName +
        extension +
        ' -o ' +
        filePath +
        fileName +
        outExtension,

            (err, stdout, stderr) => {
                if (err || stdout || stderr) {
                    const output = {
                        err: true,
                        out: err.message,
                    };
                    resolve(output);
                } else {
                    let output;
                    timeouts.start = Date.now();
                    timeouts.close = timeouts.terminate = -1;
                    const program = exec(
                        filePath + fileName + outExtension,
                        (err, stdout, stderr) => {
                            if (err && err.killed) {
                                output = {
                                    err: true,
                                    total: '',
                                    signal: err.signal,
                                };
                            }

                            if (stderr) {
                                output = {
                                    err: true,
                                    out: serr,
                                };
                            } else {
                                output = {
                                    err: false,
                                    out: stdout,
                                };
                            }
                        },
                    );

                    setTimeout(() => {
                        timeouts.terminate = Date.now();
                        terminate(program.pid, (err) => {
                            if (fs.existsSync(filePath + fileName + outExtension)) {
                                exec(
                                    'cd ' +
                    filePath +
                    ' && ' +
                    delCommand +
                    ' ' +
                    fileName +
                    outExtension,
                                    () => {},
                                );
                            }

                            output = {
                                err: true,
                                total: '',
                                killed: true,
                                signal: 'SIGKILL',
                            };
                        });
                    }, options.timeout);

                    if (options.input.length > 0) program.stdin.write(options.input);
                    program.stdin.end();
                    program.on('close', (err, code) => {
                        if (fs.existsSync(filePath + fileName + outExtension)) {
                            exec(
                                'cd ' +
                  filePath +
                  ' && ' +
                  delCommand +
                  ' ' +
                  fileName +
                  outExtension +
                  ' ' +
                  delCommand +
                  ' ' +
                  fileName +
                  extension,
                                () => {},
                            );
                        }

                        timeouts.close = Date.now();
                        timeouts.end =
              timeouts.terminate == -1 ?
                  timeouts.close :
                  Math.min(timeouts.close, timeouts.terminate);
                        timeouts.time_taken = timeouts.end - timeouts.start;

                        if (timeouts.terminate != -1) {
                            output = {
                                err: false,
                                out: '',
                                killed: true,
                                signal: code || 'SIGKILL',
                            };
                        } else {
                            output = {
                                err: false,
                                out: output.out,
                                killed: false,
                                signal: '',
                            };
                        }
                        output.time = timeouts;

                        resolve(output);
                    });
                }
            },
        );
    });
};
