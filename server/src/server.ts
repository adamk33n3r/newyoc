import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import * as mongoose from 'mongoose';
import 'reflect-metadata';

import { Socket } from './services/socket';

// routes
import AppRouter from './api/router';

// interfaces
// import { IUser } from './interfaces/user'; // import IUser

// models
// import { IModel } from './models/model'; // import IModel
// import { IUserModel } from './models/user'; // import IUserModel

// schemas
// import { userSchema } from './schemas/user'; // import userSchema

/**
 * The server.
 *
 * @class Server
 */
export class Server {
    private static MONGODB_CONNECTION = 'mongodb://eon.adam-keenan.net:27272/newyoc';

    public app: express.Application;

    // private model: IModel; // an instance of IModel

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        // instance defaults
        // this.model = Object(); // initialize this to an empty object

        // create expressjs application
        this.app = express();
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config(socket: SocketIO.Server) {
        new Socket(socket);

        // Add static paths
        this.app.use(express.static('./src/public'));

        // Mount logger
        this.app.use(logger('dev'));

        // Mount json form parser
        this.app.use(bodyParser.json());

        // Mount query string parser
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));

        // Mount cookie parker
        this.app.use(cookieParser('i am so secret'));

        // Mount override
        this.app.use(methodOverride());

        // Use native promises
        (<any> mongoose).Promise = Promise;

        // Connect to mongoose
        // const connection: mongoose.Connection = mongoose.createConnection(Server.MONGODB_CONNECTION);

        // Create models
        // this.model.user = connection.model<IUserModel>('User', userSchema);

        // Catch 404 and forward to error handler
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            err.status = 404;
            next(err);
        });

        // Error handling
        this.app.use(errorHandler());

        this.routes();
    }

    /**
     * Create and return Router.
     *
     * @class Server
     * @method config
     * @return void
     */
    private routes() {
        const router: express.Router = Reflect.getMetadata('$router.router', AppRouter);
        const routePath: string = Reflect.getMetadata('$router.path', AppRouter);
        this.app.use(routePath, router);
        const pathToClient = path.join(__dirname, '../../../../client/dist');
        this.app.use(express.static(pathToClient));
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(pathToClient, 'index.html'));
        });
    }

}
