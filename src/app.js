import express from 'express';

import http from 'http';
import {errorHandler, undefinedRouteHandler} from '@middlewares/index';
import io from 'socket.io';

class App {
    constructor() {
        this.express = express();
        this.router = express.Router();
        this.server = http.createServer(this.express);
        this.io = io(this.server);
    }

    mountRoutes(routes) {
        routes(this.router);
    }

    start(port) {
        const app = this.express;

        app.use('/', this.router);
        app.use(undefinedRouteHandler);
        app.use(errorHandler);

        this.server.listen(port, () => {
            console.log(`Server started on port: ${port}`);
        });
    }
}

export default new App();
