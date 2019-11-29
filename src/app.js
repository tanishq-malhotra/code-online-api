import express from 'express';
import {errorHandler, undefinedRouteHandler} from './middlewares';
import path from 'path';

class App {
    constructor() {
        this.express = express();
        this.router = express.Router();
    }

    mountRoutes(routes) {
        routes(this.router);
    }

    start(port) {
        const app = this.express;

        app.use('/', this.router);
        app.use(express.static(path.join(__dirname, '../files')));
        app.use(undefinedRouteHandler);
        app.use(errorHandler);

        app.listen(port, () => {
            console.log(`Server started on port: ${port}`);
        });
    }
}

export default new App();
