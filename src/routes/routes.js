import {randomBytes} from 'crypto';
import {userSchema, projectSchema} from '../mongo';
import fs from 'fs';
import path from 'path';

export const apiRoutes = async (router) => {
    // default welcome route
    router.get('/', async (req, res) => {
        res.send('Compiler-API');
    });

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

    router.post('/login', async (req, res) => {
        const {email, pass} = req.body.data;

        userSchema
            .find({
                email: email,
                pass: pass,
            })
            .then((data) => {
                if (data.length) {
                    res.send('done');
                } else res.send('nope');
            })
            .catch((err) => {
                console.log(err);
                res.send('err');
            });
    });

    router.post('/add', async (req, res) => {
        const {userId, userName, projectName, type, typeName, typePath} = req.body;

        if (type === 'dir') {
            const dirPath = path.join(__dirname,
                '../../files/' + userId + userName.split(' ')[0], typePath, typeName,
            );
            fs.mkdirSync(dirPath, {recursive: true}, (err) => {
                if (err) throw err;
            });
            res.send('dir created');
        } else {
            const filePath = path.join(__dirname,
                '../../files/' + userId + userName.split(' ')[0], typePath, typeName,
            );

            fs.writeFile(filePath, '', (err) => {
                if (err) throw err;
                res.send('file created');
            });
        }
    });
};
