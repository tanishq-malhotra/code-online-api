import bodyParser from 'body-parser';
import logger from 'morgan';

import app from './app';
import {ENV} from './config';
const {PORT} = ENV;
import {apiRoutes, compileCpp} from './routes';
import cors from 'cors';

app.express.use(cors());
app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({extended: true}));

app.express.use(logger('dev'));

(async () => {
    app.mountRoutes(apiRoutes);
    app.mountRoutes(compileCpp);
    app.start(PORT);
})();
