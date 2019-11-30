import bodyParser from 'body-parser';
import logger from 'morgan';

import app from '@app/app';
import {ENV} from '@config/index';

import {apiRoutes} from '@routes/index';
import cors from 'cors';

const {PORT} = ENV;

app.express.use(cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({extended: true}));

app.express.use(logger('dev'));

(async () => {
    app.mountRoutes(apiRoutes);
    app.start(PORT);
})();
