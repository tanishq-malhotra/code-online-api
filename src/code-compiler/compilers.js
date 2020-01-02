function createOptions(compiler_name, file_name, output_command, e_arguments) {
    const options = {
        compiler_name: compiler_name,
        file_name: file_name,
        output_command: output_command,
        e_arguments: e_arguments,
    };

    return options;
}


export const compilers = {
    'C': createOptions(`'gcc -o /usercode/a.out'`, 'main.c', `'./usercode/a.out'`, ''),
    'C++': createOptions(`'g++ -o /usercode/a.out'`, '*.cpp', `'./usercode/a.out'`, ''),
};
