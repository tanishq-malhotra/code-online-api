import {randomBytes} from 'crypto';
import {userSchema, projectSchema} from '../mongo';
import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';

export const apiRoutes = async (router) => {
    // default welcome route
    router.get('/', async (req, res) => {
        res.send('Compiler-API');
    });

    // user register route
    router.post('/register', async (req, res) => {
        const {name, email, pass, gender, age, about} = req.body.data;
        const id = randomBytes(10).toString('hex');
        userSchema
            .create({
                id: id,
                name: name,
                email: email,
                pass: pass,
                gender: gender,
                age: age,
                about: about,
            })
            .then((data) => {
                const dirPath = path.join(
                    __dirname,
                    '../../files/' + id + name.split(' ')[0],
                );
                fs.mkdirSync(dirPath, {recursive: true}, (err) => {
                    if (err) throw err;
                });
                res.send('done');
            })
            .catch((err) => {
                console.log(err);
                res.send([]);
            });
    });

    // user login route
    router.post('/login', async (req, res) => {
        const {email, pass} = req.body.data;

        userSchema
            .find({
                email: email,
                pass: pass,
            })
            .then((data) => {
                if (data.length) {
                    const temp = {};
                    temp.id = data[0].id;
                    temp.name = data[0].name;
                    temp.email = data[0].email;
                    temp.gender = data[0].gender;
                    temp.age = data[0].age;
                    temp.about = data[0].about;
                    res.send(temp);
                } else res.send('nope');
            })
            .catch((err) => {
                console.log(err);
                res.send('err');
            });
    });

    // create directory or file
    // router.post('/add', async (req, res) => {
    //     const {
    //         userId,
    //         userName,
    //         projectName,
    //         type,
    //         typeName,
    //         typePath,
    //     } = req.body;

    //     if (type === 'dir') {
    //         const dirPath = path.join(
    //             __dirname,
    //             '../../files/' + userId + userName.split(' ')[0],
    //             typePath,
    //             typeName,
    //         );
    //         fs.mkdirSync(dirPath, {recursive: true}, (err) => {
    //             if (err) throw err;
    //         });
    //         res.send('dir created');
    //     } else {
    //         const filePath = path.join(
    //             __dirname,
    //             '../../files/' + userId + userName.split(' ')[0],
    //             typePath,
    //             typeName,
    //         );

    //         fs.writeFile(filePath, '', (err) => {
    //             if (err) throw err;
    //             res.send('file created');
    //         });
    //     }
    // });

    // user create project route
    router.post('/create-project', async (req, res) => {
        const {name, id, projectName, lang} = req.body.data;
        const dirPath = path.join(
            __dirname,
            '../../files/' + id + name.split(' ')[0],
            projectName,
        );
        const filePath = path.join(dirPath, 'main.cpp');
        const today = new Date();
        const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        const time = today.getHours() + ':' + today.getMinutes();
        projectSchema
            .create({
                id: id,
                name: projectName,
                dateOfCreation: date,
                lastEdited: time,
                language: lang,
            })
            .then((_) => {
                fs.mkdirSync(dirPath, {recursive: true}, (err) => {
                    if (err) throw err;
                });
                fs.writeFileSync(filePath, '', {recursive: true}, (err) => {
                    if (err) throw err;
                });
                res.send('done');
            })
            .catch((err) => {
                console.log(err);
                res.send([]);
            });
    });

    // route to get all the user projects
    router.get('/get-user-projects', async (req, res) => {
        projectSchema.find({
            id: req.query.id,
        }).then((data) => {
            if (data.length) {
                res.send(data);
            } else res.send('nope');
        }).catch((err) => {
            console.log(err);
            res.send('err');
        });
    });


    // get the user project tree with custom level
    router.post('/get-project-tree', async (req, res) => {
        const {userId, userName, projectName, level, currPath} = req.body;
        const dirPath = path.join(__dirname, '../../files' ,userId + userName.split(' ')[0], projectName, currPath);
        exec(`cd ${dirPath} && tree -L ${level} -J --inodes`, (err, stdout, stderr) => {
            if(err) throw err;
            res.send(JSON.parse(stdout)[0]);
        })
    });

};
